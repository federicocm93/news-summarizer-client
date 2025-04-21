import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 relative">
          <div className="py-6 flex flex-col items-center justify-center">
            <Link href="/">
              <div className="w-full max-w-xl">
                <img src="/images/tldr-news-logo.png" alt="TLDR News Logo" className="w-full h-auto" />
              </div>
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full mx-[150px] mt-10">
        <Link href="/" className="inline-flex items-center text-[#0a1e3b] hover:text-[#ff5533] transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#0a1e3b]">Refund Policy</h1>
          <p className="text-gray-500">Effective Date: March 11, 2025</p>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Refund Policy outlines the terms and conditions for refunds related to TLDR News subscription plans.
              We strive to provide high-quality service, but we understand that there may be situations where a refund
              is appropriate.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">2. Subscription Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our refund policy for subscription plans is as follows:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>
                <strong>14-Day Money-Back Guarantee:</strong> If you are not satisfied with your Premium or Pro
                subscription, you may request a full refund within 14 days of your initial purchase. This applies only
                to first-time subscribers.
              </li>
              <li>
                <strong>Recurring Subscriptions:</strong> For recurring subscription payments, we do not provide refunds
                for the current billing period. If you cancel your subscription, you will continue to have access to the
                service until the end of your current billing period.
              </li>
              <li>
                <strong>Annual Subscriptions:</strong> For annual subscriptions, refunds may be provided on a prorated
                basis if requested within 30 days of purchase.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">3. Eligibility for Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Refunds may be considered in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>
                Technical issues that significantly impair the functionality of the service and cannot be resolved
                within a reasonable timeframe.
              </li>
              <li>Incorrect billing or charging errors.</li>
              <li>Service unavailability for extended periods.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">4. Non-Refundable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-3">The following are not eligible for refunds:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Subscriptions that have been active for more than 14 days (for first-time subscribers).</li>
              <li>Subscriptions that have been used extensively (more than 25% of the monthly limit).</li>
              <li>Accounts that have violated our Terms and Conditions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">5. How to Request a Refund</h2>
            <p className="text-gray-700 leading-relaxed mb-3">To request a refund, please follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-1 text-gray-700">
              <li>Contact our support team at un.papelitoblanco@gmail.com with the subject line "Refund Request".</li>
              <li>Include your account email address and the reason for your refund request.</li>
              <li>Provide any relevant information or documentation that supports your request.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-3">
              We will review your request and respond within 3 business days. If approved, refunds will be processed to
              the original payment method used for the purchase.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">6. Processing Time</h2>
            <p className="text-gray-700 leading-relaxed">
              Once a refund is approved, it may take 5-10 business days for the refund to appear in your account,
              depending on your payment provider's policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">7. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Refund Policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the "Effective Date" at the top.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our Refund Policy, please contact us at:
            </p>
            <div className="mt-2 flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <a href="mailto:un.papelitoblanco@gmail.com" className="text-[#ff5533] hover:underline">
                un.papelitoblanco@gmail.com
              </a>
            </div>
          </div>
        </section>
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
    </div>
  )
}
