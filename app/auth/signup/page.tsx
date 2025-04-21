"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "", confirmPassword: "" }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)

      try {
        const response = await fetch(API_ENDPOINTS.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to create account")
        }

        // Store the token and user data if available
        if (data.token) {
          localStorage.setItem("authToken", data.token)

          if (data.data && data.data.user) {
            localStorage.setItem("userData", JSON.stringify(data.data.user))
          }
        }

        // Account created successfully
        router.push("/auth/success?action=signup")
      } catch (error) {
        // Handle error
        setErrors((prev) => ({
          ...prev,
          email: error instanceof Error ? error.message : "An error occurred during registration",
        }))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleSignup = async () => {
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

      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-[#0a1e3b] hover:text-[#ff5533] mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <h1 className="text-2xl font-bold text-[#0a1e3b]">Create your account</h1>
          <p className="text-gray-600 mt-1">Start summarizing articles with TLDR News</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors mb-6"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 absolute w-full"></div>
            <span className="bg-white px-2 text-sm text-gray-500 relative">or</span>
          </div>

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
                placeholder="At least 8 characters"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-[#0a1e3b]`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
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
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#ff5533] hover:underline">
              Log in
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
