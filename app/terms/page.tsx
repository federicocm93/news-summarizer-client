import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsAndConditions() {
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
          <h1 className="text-3xl font-bold mb-2 text-[#0a1e3b]">Terms & Conditions</h1>
          <p className="text-gray-500">Effective Date: March 11, 2025</p>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to TLDR News! These Terms and Conditions govern your use of our Chrome extension and website. By
              using our services, you agree to these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>"Service" refers to the TLDR News Chrome extension and website.</li>
              <li>"User" refers to individuals who access or use our Service.</li>
              <li>"Subscription" refers to the paid plans that provide additional features and usage limits.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">3. Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To use certain features of our Service, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Provide accurate and complete information when creating your account.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">4. Subscription Plans</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TLDR News offers various subscription plans with different features and usage limits:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Free Trial: Limited to 50 article summaries in total.</li>
              <li>Premium: Provides 500 article summaries per month for $3.99/month.</li>
              <li>Pro: Provides 5000 article summaries per month for $9.99/month.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Subscription fees are charged at the beginning of each billing cycle. You can cancel your subscription at
              any time, but no refunds will be provided for the current billing period.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">5. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-3">When using our Service, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Use the Service for any illegal purpose or in violation of any laws.</li>
              <li>Attempt to gain unauthorized access to any part of the Service.</li>
              <li>Use the Service to infringe on intellectual property rights.</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service.</li>
              <li>Share your account or API key with others.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality are owned by TLDR News and are protected
              by international copyright, trademark, and other intellectual property laws. You may not reproduce,
              distribute, modify, create derivative works of, publicly display, or exploit any content from our Service
              without explicit permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TLDR News shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use the Service. We do not guarantee the accuracy of summaries
              generated by our AI technology.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms and Conditions from time to time. We will notify you of any changes by posting
              the new Terms on this page and updating the "Effective Date" at the top.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
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
