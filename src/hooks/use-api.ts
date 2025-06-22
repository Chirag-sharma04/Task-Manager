"use client"

import { useState, useCallback } from "react"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(
    async (url: string, requestOptions: RequestInit = {}): Promise<ApiResponse<T>> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...requestOptions.headers,
          },
          ...requestOptions,
        })

        const data: ApiResponse<T> = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "An error occurred")
        }

        if (data.success && options.onSuccess) {
          options.onSuccess(data.data)
        }

        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)

        if (options.onError) {
          options.onError(errorMessage)
        }

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setLoading(false)
      }
    },
    [], // Remove options from dependencies to prevent infinite re-renders
  )

  const get = useCallback(
    (url: string) => {
      return request(url, { method: "GET" })
    },
    [request],
  )

  const post = useCallback(
    (url: string, data: any) => {
      return request(url, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    [request],
  )

  const put = useCallback(
    (url: string, data: any) => {
      return request(url, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },
    [request],
  )

  const del = useCallback(
    (url: string) => {
      return request(url, { method: "DELETE" })
    },
    [request],
  )

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  }
}
