import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "@/components/layout/SessionProvider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "GradConnect — Build Together. Ship Together.",
  description:
    "AI is creating the biggest startup opportunity in history. Don't go it alone. Connect with recent grads from complementary fields, vote on a project, and build something real.",
  keywords: ["startup", "college graduates", "AI", "team building", "co-founders"],
  openGraph: {
    title: "GradConnect — Build Together. Ship Together.",
    description:
      "The AI gold rush is here. You need a team. Connect with recent grads and build the next big thing.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}
