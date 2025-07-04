"use client"

import type React from "react"
import { Suspense } from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { API_ENDPOINTS } from "@/config/api"

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
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

  // Check if this is an extension user upgrade
  const extensionId = searchParams.get("extensionId")
  const isExtensionUpgrade = Boolean(extensionId)

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
        const requestBody: any = {
          email: formData.email,
          password: formData.password,
        }

        // Include extension ID if this is an extension upgrade
        if (extensionId) {
          requestBody.extensionId = extensionId
        }

        const response = await fetch(API_ENDPOINTS.REGISTER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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
        const plan = searchParams.get("plan")
        router.push(`/auth/success?action=signup${plan ? `&plan=${plan}` : ""}`)
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
          <h1 className="text-2xl font-bold text-[#0a1e3b]">
            {isExtensionUpgrade ? "Complete your account setup" : "Create your account"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isExtensionUpgrade 
              ? "Upgrade your extension account to access premium features. Your existing usage will be preserved." 
              : "Start summarizing articles with TLDR News"
            }
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {isExtensionUpgrade && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">
                  <strong>Upgrading your extension account:</strong> Your current usage and remaining requests will be preserved after creating your account.
                </p>
              </div>
            </div>
          )}
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
                isExtensionUpgrade ? "Complete Account Setup" : "Create Account"
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
