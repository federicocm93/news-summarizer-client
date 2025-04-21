"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const action = searchParams.get("action") || "signup"

  const title =
    action === "login"
      ? "Login Successful!"
      : action === "google"
        ? "Google Authentication Successful!"
        : "Account Created Successfully!"

  const message =
    action === "login"
      ? "You have successfully logged in to your TLDR News account."
      : action === "google"
        ? "You have successfully connected your Google account to TLDR News."
        : "Your TLDR News account has been created. You're now ready to start summarizing articles."

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

      <main className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0a1e3b] mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            href="/dashboard"
            className="inline-block py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
          >
            Go to Dashboard
          </Link>
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
