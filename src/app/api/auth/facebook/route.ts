import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    
    const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile&response_type=code`
    return NextResponse.redirect(fbAuthUrl)
  }

  try {
    
    const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`)
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain Facebook access token")
    }

   
    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`)
    const fbUser = await userRes.json()

    await connectDB()

    let user = await User.findOne({
      $or: [{ facebookId: fbUser.id }, { email: fbUser.email }],
    })

    if (!user) {
      const [firstName, ...rest] = fbUser.name?.split(" ") || []
      const lastName = rest.join(" ")

      user = await User.create({
        firstName,
        lastName,
        username: fbUser.email?.split("@")[0] || `fb_${fbUser.id}`,
        email: fbUser.email,
        avatar: fbUser.picture?.data?.url,
        facebookId: fbUser.id,
      })
    } else if (!user.facebookId) {
      user.facebookId = fbUser.id
      user.avatar = fbUser.picture?.data?.url
      await user.save()
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
