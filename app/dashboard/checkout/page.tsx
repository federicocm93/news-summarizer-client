"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    Paddle: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const paddlePremiumMonthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PREMIUM_MONTHLY_PRICE_ID || ""
  const paddlePremiumYearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PREMIUM_YEARLY_PRICE_ID || ""
  const paddleProMonthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID || ""
  const paddleProYearlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID || ""

  useEffect(() => {
    // Load Paddle.js
    const script = document.createElement("script")
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"
    script.async = true
    script.onload = () => {
      // Initialize Paddle
      window.Paddle.Environment.set(process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? 'sandbox' : 'production') // Change to "production" for live
      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: function(data: any) {
          console.log("Paddle Event:", data)
          // Handle different events here
          if (data.name === "checkout.completed") {
            // Handle successful payment
            router.push("/dashboard")
          }
        }
      })
      setIsLoading(false)
    }
    document.head.appendChild(script)

    // Get the plan from URL query params
    const params = new URLSearchParams(window.location.search)
    setSelectedPlan(params.get("plan"))

    return () => {
      // Cleanup
      document.head.removeChild(script)
    }
  }, [router])

  const openCheckout = async (priceId: string) => {
    try {
      const userData = localStorage.getItem("userData")
      const userEmail = userData ? JSON.parse(userData).email : undefined
      await window.Paddle.Checkout.open({
        items: [
          {
            priceId: priceId,
            quantity: 1
          }
        ],
        customer: {
          email: userEmail || undefined
        },
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        }
      })
    } catch (error) {
      console.error("Error opening checkout:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a1e3b]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center text-[#0a1e3b] hover:text-[#0a1e3b]/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-[#0a1e3b] mb-8 text-center">Complete Your Purchase</h1>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div 
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openCheckout(paddlePremiumMonthlyPriceId)} // Replace with your actual Paddle price ID
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#0a1e3b]">Premium Plan monthly</h2>
              <span className="text-2xl font-bold text-[#0a1e3b]">$1.99/month</span>
            </div>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>✓ 500 article summaries per month</li>
              <li>✓ Email support</li>
            </ul>
          </div>
          <div 
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openCheckout(paddlePremiumYearlyPriceId)} // Replace with your actual Paddle price ID
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#0a1e3b]">Premium Plan yearly</h2>
              <span className="text-2xl font-bold text-[#0a1e3b]">$19.90/year</span>
            </div>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>✓ 500 article summaries per month</li>
              <li>✓ Email support</li>
            </ul>
          </div>

          <div 
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openCheckout(paddleProMonthlyPriceId)} // Replace with your actual Paddle price ID
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#0a1e3b]">Pro Plan monthly</h2>
              <span className="text-2xl font-bold text-[#0a1e3b]">$9.99/month</span>
            </div>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>✓ 5000 article summaries per month</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <div 
            className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openCheckout(paddleProYearlyPriceId)} // Replace with your actual Paddle price ID
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#0a1e3b]">Pro Plan yearly</h2>
              <span className="text-2xl font-bold text-[#0a1e3b]">$99.90/year</span>
            </div>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li>✓ 5000 article summaries per month</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8">
          Secure payment powered by Paddle
        </p>
      </div>
    </div>
  )
} 