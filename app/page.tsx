"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <header className="pt-2">

        {/* Navigation with just the login button */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex justify-end items-center">
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-white border border-[#0a1e3b] text-[#0a1e3b] hover:bg-[#0a1e3b] hover:text-white rounded-md font-medium transition-all"
              >
                Log in
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white border border-[#0a1e3b] text-[#0a1e3b] hover:bg-[#0a1e3b] hover:text-white rounded-md font-medium transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center relative z-10">
          <div className="w-full max-w-xl mb-[60px]">
            <img src="/images/tldr-news-logo.png" alt="TLDR News Logo" className="w-full h-auto" />
          </div>
        </div>
      </header>

      <div
        className="w-full flex flex-col items-center justify-center px-6 py-[100px]"
        style={{
          background: 'linear-gradient(180deg, white 0%, #101828 7%, #101828 93%, white 100%)'
        }}
      >
        <h1 className="text-6xl font-bold text-white mb-4 text-center">Get to the Point, Faster</h1>
        <div className="flex justify-center items-center rounded-xl overflow-hidden p-6">
          <video
            className="rounded-xl max-w-4xl w-full"
            src="/demo.mp4"
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto text-center pt-10">
            TLDR News uses AI to instantly summarize news articles, helping you stay informed without the fluff. Choose
            the plan that works best for you.
          </h1>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Trial Plan */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0a1e3b] mb-2">Trial</h2>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-[#0a1e3b]">Free</span>
                </div>
                <p className="text-sm text-gray-500">Get started with TLDR News</p>
              </div>

              <div className="mb-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#ff5533] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">30 article summaries per month</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/auth/signup"
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-[#0a1e3b] font-medium rounded-md transition-colors text-center"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white border-2 border-[#0a1e3b] rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col relative">
              <div className="absolute -top-3 right-6 bg-[#ff5533] text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                Popular
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0a1e3b] mb-2">Premium</h2>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-[#0a1e3b]">$1.99</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
                <p className="text-sm text-gray-500">Perfect for regular readers</p>
              </div>

              <div className="mb-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#ff5533] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">500 article summaries per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#ff5533] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
              </div>

              <Link
                href={isLoggedIn ? "/dashboard/checkout?plan=premium" : "/auth/signup?plan=premium"}
                className="w-full py-2 px-4 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors text-center"
              >
                Subscribe Now
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0a1e3b] mb-2">Pro</h2>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-[#0a1e3b]">$9.99</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
                <p className="text-sm text-gray-500">For power users and researchers</p>
              </div>

              <div className="mb-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#ff5533] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">5000 article summaries per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#ff5533] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
              </div>

              <Link
                href={isLoggedIn ? "/dashboard/checkout?plan=pro" : "/auth/signup?plan=pro"}
                className="w-full py-2 px-4 bg-[#ff5533] hover:bg-[#e64a2e] text-white font-medium rounded-md transition-colors text-center"
              >
                Go Pro
              </Link>
            </div>
          </div>
        </div>
        
        

        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4 text-[#0a1e3b]">How TLDR News Works</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Our AI-powered extension analyzes news articles and creates concise, accurate summaries in seconds. Just
            click the TLDR News icon when reading any article online.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4">
              <div className="bg-[#0a1e3b] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-medium text-[#0a1e3b] mb-2">Browse to any article</h3>
              <p className="text-sm text-gray-600">Navigate to your favorite news site</p>
            </div>
            <div className="p-4">
              <div className="bg-[#0a1e3b] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-medium text-[#0a1e3b] mb-2">Click TLDR News</h3>
              <p className="text-sm text-gray-600">Activate the extension with one click</p>
            </div>
            <div className="p-4">
              <div className="bg-[#0a1e3b] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-medium text-[#0a1e3b] mb-2">Get your summary</h3>
              <p className="text-sm text-gray-600">Instantly see a concise summary</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-[#0a1e3b] text-sm">© {new Date().getFullYear()} TLDR News. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/privacy-policy" className="text-sm text-[#0a1e3b] hover:text-[#ff5533] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-[#0a1e3b] hover:text-[#ff5533] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/refunds-policy" className="text-sm text-[#0a1e3b] hover:text-[#ff5533] transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        .bg-grid-[\\#0a1e3b]\\/\\[0\\.03\\] {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(10, 30, 59, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10, 30, 59, 0.03) 1px, transparent 1px);
        }
      `}</style>
    </div>
  )
}
