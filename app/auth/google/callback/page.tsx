"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { API_ENDPOINTS } from "@/config/api"

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const code = searchParams.get("code")

    if (!code) {
      setError("Authentication failed. No authorization code received.")
      setIsLoading(false)
      return
    }

    const handleGoogleCallback = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(API_ENDPOINTS.GOOGLE_CALLBACK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to authenticate with Google")
        }

        // Store the token in localStorage
        if (data.token) {
          localStorage.setItem("authToken", data.token)
        }

        // Redirect to success page
        router.push("/auth/success?action=google")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Authentication failed")
        setIsLoading(false)
      }
    }

    handleGoogleCallback()
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1e3b] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#0a1e3b]">Completing authentication...</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your Google account.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-100 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#0a1e3b] mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/auth/login"
            className="inline-block py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return null
}
