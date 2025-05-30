"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Copy, Eye, EyeOff, User, Key, Package, BarChart3, Check } from "lucide-react"
import { API_ENDPOINTS } from "@/config/api"
import Pusher from 'pusher-js'
import toast from 'react-hot-toast'

interface UserData {
  email: string
  apiKey: string
  subscriptionTier: "free" | "premium" | "pro"
  requestsRemaining: number
  subscriptionExternalId?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPaddleLoaded, setIsPaddleLoaded] = useState(false)

  const fetchUserData = async () => {
    setIsLoading(true)
    setError(null)

    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/auth/login")
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
          router.push("/auth/login")
          return
        }
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUserData(data.data)
      localStorage.setItem("userData", JSON.stringify(data.data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // This ensures the code only runs on the client side
    if (typeof window !== "undefined") {
      fetchUserData()

      // Initialize Pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
        cluster: 'us2'
      })

      // Subscribe to the user subscription channel
      const channel = pusher.subscribe('user-subscription-channel')

      // Listen for new subscription events
      channel.bind('new-subscription', async (data: { userId: string }) => {
        // Get the current user's ID from localStorage
        const storedUserData = localStorage.getItem("userData")
        if (storedUserData) {
          const currentUser = JSON.parse(storedUserData)
          // If the event is for the current user, update their data
          if (currentUser.id === data.userId) {
            await fetchUserData()
            toast.success('Subscription updated 🎉', {
              style: {
                background: '#10B981',
                color: '#fff',
              },
              duration: 5000,
              position: 'bottom-center'
            })
          }
        }
      })

      // Cleanup on unmount
      return () => {
        channel.unbind_all()
        channel.unsubscribe()
        pusher.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Paddle) {
      const script = document.createElement('script')
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
      script.async = true
      script.onload = () => {
        window.Paddle.Environment.set(process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? 'sandbox' : 'production')
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        })
        setIsPaddleLoaded(true)
      }
      document.head.appendChild(script)
      return () => {
        document.head.removeChild(script)
      }
    } else if (window.Paddle) {
      setIsPaddleLoaded(true)
    }
  }, [])

  const copyApiKey = () => {
    if (typeof window !== "undefined" && userData?.apiKey) {
      navigator.clipboard.writeText(userData.apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      router.push("/")
    }
  }

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "text-blue-600 bg-blue-50"
      case "pro":
        return "text-[#ff5533] bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSubscriptionLabel = (tier: string) => {
    switch (tier) {
      case "premium":
        return "Premium"
      case "pro":
        return "Pro"
      default:
        return "Free"
    }
  }

  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/customer-portal-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data && data.status === 'success' && data.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('Failed to get customer portal link.');
      }
    } catch (err) {
      toast.error('Failed to open subscription management. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1e3b] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[#0a1e3b]">Loading your dashboard...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
          <h2 className="text-xl font-semibold text-[#0a1e3b] mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/">
            <div className="w-48">
              <img src="/images/tldr-news-logo.png" alt="TLDR News Logo" className="w-full h-auto" />
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="text-[#0a1e3b] hover:text-[#ff5533] transition-colors text-sm font-medium"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0a1e3b]">Your Dashboard</h1>
          <p className="text-gray-600">Manage your TLDR News account and API key</p>
        </div>

        {userData && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-50 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-[#0a1e3b]">Account</h2>
              </div>
              <div className="text-gray-700">{userData.email}</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-50 p-2 rounded-full">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-[#0a1e3b]">Subscription</h2>
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionColor(
                  userData.subscriptionTier,
                )}`}
              >
                {getSubscriptionLabel(userData.subscriptionTier)}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-50 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-[#0a1e3b]">Usage</h2>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">
                  {userData.requestsRemaining !== undefined ? userData.requestsRemaining : 0}
                </span>{" "}
                requests remaining
              </div>
            </div>
          </div>
        )}

        {userData && userData.subscriptionTier === "free" && (
          <div className="bg-gradient-to-r from-[#0a1e3b] to-[#152d4a] rounded-lg p-6 text-white mb-8">
            <h2 className="text-xl font-bold mb-2">Upgrade Your Plan</h2>
            <p className="mb-4 opacity-90">
              Get more article summaries and advanced features by upgrading to Premium or Pro.
            </p>
            <Link
              href="/dashboard/checkout"
              className="inline-block py-2 px-4 bg-[#ff5533] hover:bg-[#e64a2e] text-white font-medium rounded-md transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}

{userData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#0a1e3b]">Set Up Your Chrome Extension</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Get started by installing our Chrome extension to summarize articles directly from your browser.
              </p>

              <a
                href={process.env.NEXT_PUBLIC_CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-4 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
              >
                <img src="/images/chrome-store-icon.png" alt="Chrome Web Store" className="w-5 h-5" />
                Go to Chrome Web Store
              </a>
            </div>
          </div>
        )}

        {userData && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-50 p-2 rounded-full">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#0a1e3b]">Your API Key</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Use this API key to authenticate requests to the TLDR News API. Keep it secret and secure.
              </p>

              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={userData.apiKey}
                    readOnly
                    className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700 font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <button
                  onClick={copyApiKey}
                  className={`px-3 h-[42px] flex items-center justify-center border border-l-0 border-gray-300 rounded-r-md ${
                    copied
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Copy API key"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">How to use your API key</h3>
              <p className="text-sm text-blue-700 mb-3">
                Follow these steps to set up your TLDR News Extension:
              </p>
              <ol className="list-decimal list-inside text-sm text-blue-700 mb-4 space-y-2">
                <li>Click the TLDR News extension icon in your browser toolbar</li>
                <li>Go to "Settings"</li>
                <li>Paste your API key in the input field as shown below</li>
                <li>That's it! You're all set 🎉 Now just visit your favorite news site, open any article, and click the "Summarize article" button to get instant AI-powered summaries</li>
              </ol>
              <div className="bg-blue-100 rounded-lg border border-blue-200 p-4 mb-4">
                <video
                  src="/TLDR News-tutorial.mp4"
                  className="w-full max-w-[900px] mx-auto rounded-lg shadow-sm"
                  controls
                  autoPlay
                  loop
                  muted
                />
              </div>
              <p className="text-xs text-blue-600">
                Your API key is stored locally and securely in your browser.
              </p>
            </div>
          </div>
        )}
        {/* Cancel Subscription Button for non-free users with a subscriptionExternalId */}
        {userData && userData.subscriptionTier !== 'free' && userData.subscriptionExternalId && (
          <div className="w-full flex justify-center mt-6">
            <button
              onClick={handleCancelSubscription}
              className="inline-block py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors mb-4"
              disabled={!isPaddleLoaded}
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </main>

      {/* Support Section */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-[#0a1e3b] text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Need Help?</h2>
          <p className="mb-4 opacity-90">If you have any questions, issues, or feedback, our support team is here to help you.</p>
          <a
            href="mailto:un.papelitoblanco@gmail.com"
            className="inline-block py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-[#0a1e3b] text-sm">
          <p>© {new Date().getFullYear()} TLDR News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
