import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB  from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`
    return NextResponse.redirect(googleAuthUrl)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token")
    }

    // Get user info from Google
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
    )
    const googleUser = await userResponse.json()

    await connectDB()

    // Check if user exists
    let user = await User.findOne({
      $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
    })

    if (!user) {
      // Create new user
      user = await User.create({
        firstName: googleUser.given_name || googleUser.name.split(" ")[0],
        lastName: googleUser.family_name || googleUser.name.split(" ").slice(1).join(" "),
        username: googleUser.email.split("@")[0],
        email: googleUser.email,
        avatar: googleUser.picture,
        googleId: googleUser.id,
      })
    } else if (!user.googleId) {
      // Link existing user with Google
      user.googleId = googleUser.id
      user.avatar = googleUser.picture
      await user.save()
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Redirect to dashboard with token
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
