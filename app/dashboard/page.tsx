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
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showNoRequestsModal, setShowNoRequestsModal] = useState(false)

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
      
      // Show modal if user has no requests remaining (only if not dismissed in this session)
      if (data.data.requestsRemaining === 0) {
        const modalDismissed = sessionStorage.getItem('noRequestsModalDismissed')
        if (!modalDismissed) {
          setShowNoRequestsModal(true)
        }
      }
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

            <div className={`rounded-lg border p-6 ${userData.requestsRemaining === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${userData.requestsRemaining === 0 ? 'bg-red-100' : 'bg-green-50'}`}>
                  <BarChart3 className={`h-5 w-5 ${userData.requestsRemaining === 0 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <h2 className="text-lg font-semibold text-[#0a1e3b]">Usage</h2>
              </div>
              <div className={userData.requestsRemaining === 0 ? 'text-red-700' : 'text-gray-700'}>
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
      </main>

      {/* Support Section */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-[#0a1e3b] text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Need Help?</h2>
          <p className="mb-4 opacity-90">If you have any questions, issues, or feedback, our support team is here to help you.</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=un.papelitoblanco@gmail.com&su=Support%20Request"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white font-medium rounded-md transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Cancel Subscription Button for non-free users with a subscriptionExternalId */}
        {userData && userData.subscriptionTier !== 'free' && userData.subscriptionExternalId && (
          <div className="w-full flex justify-center mt-2">
            <button
              onClick={() => setShowCancelModal(true)}
              className="inline-block py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors mb-4 border border-gray-300"
              disabled={!isPaddleLoaded}
            >
              Cancel Subscription
            </button>
          </div>
        )}

        {/* Cancel Subscription Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-4 text-[#0a1e3b]">Are you sure you want to cancel your TLDR News subscription?</h3>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="py-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowCancelModal(false)
                    await handleCancelSubscription()
                  }}
                  className="py-2 px-6 bg-[#0a1e3b] hover:bg-[#152d4a] text-white rounded-md font-medium"
                  disabled={!isPaddleLoaded}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Requests Remaining Modal */}
        {showNoRequestsModal && userData && userData.requestsRemaining === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff5533] to-[#ff7a33]"></div>
              
              {/* Icon */}
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#ff5533] to-[#ff7a33] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-[#0a1e3b]">
                🚀 Ready for More Summaries?
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                You've used all your free requests! Don't wait for them to reset next month. 
                <span className="font-semibold text-[#0a1e3b]"> Upgrade now</span> and keep enjoying instant AI-powered summaries without limits.
              </p>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-[#0a1e3b] mb-3 text-center">✨ What you'll get:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>500+ summaries</strong> per month (Premium)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span><strong>5000+ summaries</strong> per month (Pro)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Priority support & faster processing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cancel anytime, no strings attached</span>
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard/checkout"
                  onClick={() => setShowNoRequestsModal(false)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#ff5533] to-[#ff7a33] hover:from-[#e64a2e] hover:to-[#e66a2e] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🎯 Upgrade Now & Keep Reading!
                </Link>
                
                <button
                  onClick={() => {
                    setShowNoRequestsModal(false)
                    sessionStorage.setItem('noRequestsModalDismissed', 'true')
                  }}
                  className="w-full py-2 px-6 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Maybe later
                </button>
              </div>

              {/* Small print */}
              <p className="text-xs text-gray-400 mt-4">
                Free tier resets monthly • Upgrade for instant access
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-[#0a1e3b] text-sm">
          <p>© {new Date().getFullYear()} TLDR News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
