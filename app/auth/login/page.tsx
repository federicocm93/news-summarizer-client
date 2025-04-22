"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update the handleSubmit function to correctly extract the token from the response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)

      try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password")
        }

        // Store the token in localStorage for future authenticated requests
        if (data.token) {
          localStorage.setItem("authToken", data.token)

          // Store user data if available
          if (data.data && data.data.user) {
            localStorage.setItem("userData", JSON.stringify(data.data.user))
          }
        }

        // Login successful
        router.push("/auth/success?action=login")
      } catch (error) {
        // Handle error
        setErrors((prev) => ({
          ...prev,
          email: "",
          password: error instanceof Error ? error.message : "Invalid email or password",
        }))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.GOOGLE_AUTH)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to get Google authentication URL")
      }

      // Redirect to the Google authentication URL
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: error instanceof Error ? error.message : "Failed to connect to Google",
      }))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center">
          <Link href="/">
            <div className="w-full max-w-md">
              <img src="/images/tldr-news-logo.png" alt="TLDR News Logo" className="w-full h-auto" />
            </div>
          </Link>
        </div>
      </header>
      <div className="w-full mx-[150px] mt-10">
        <Link href="/" className="inline-flex items-center text-[#0a1e3b] hover:text-[#ff5533] transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0a1e3b]">Log in to your account</h1>
          <p className="text-gray-600 mt-1">Welcome back to TLDR News</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a1e3b]`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a1e3b]`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="flex justify-end mb-6">
              <Link href="/auth/forgot-password" className="text-sm text-[#ff5533] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#ff5533] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-[#0a1e3b] text-sm">
          <p>© {new Date().getFullYear()} TLDR News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
