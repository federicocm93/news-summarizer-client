import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TLDR News - Instant Article Summaries",
  description:
    "TLDR News instantly summarizes news articles using AI, helping you get to the important information without wading through SEO-optimized fluff.",
  icons: {
    icon: [
      {
        url: "/images/tldr-news-logo.png",
        href: "/images/tldr-news-logo.png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
