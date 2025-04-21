import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold mb-2 text-[#0a1e3b]">Privacy Policy</h1>
          <p className="text-gray-500">Effective Date: March 11, 2025</p>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to TLDR News! Your privacy is our priority. This Privacy Policy explains how TLDR News handles
              your information when you use our Chrome extension.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">2. No Data Collection</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not collect, store, or share any personal data or browsing history. TLDR News operates entirely on
              your device, and all processing is done locally or through secure API connections that do not retain user
              data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">3. API Key Storage</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>TLDR News requires an API key for AI-powered summaries.</li>
              <li>
                The API key is stored locally on your device and is never transmitted to us or any third party outside
                of the AI service provider.
              </li>
              <li>You have full control over your API key, and you can update or remove it at any time.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">4. How TLDR News Works</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>The extension processes news articles only when you choose to summarize them.</li>
              <li>No information about the articles you summarize is stored, tracked, or shared.</li>
              <li>We do not use cookies, analytics, or tracking technologies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">5. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If TLDR News uses an external AI service to generate summaries, we ensure that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Only the text of the article you choose to summarize is sent.</li>
              <li>No personal information is included in summary requests.</li>
              <li>The AI service provider does not retain or misuse your data.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">6. Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Although we do not collect any data, we take security seriously:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Your API key is stored locally and is not accessible by us.</li>
              <li>Secure protocols are used for all communications with AI services.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be reflected with an updated
              "Effective Date."
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-[#0a1e3b]">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
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
