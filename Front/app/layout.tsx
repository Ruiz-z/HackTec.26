import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoArcade",
  description: "Gamified recycling app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex min-h-screen bg-[#f8fafc]`}>
        <Sidebar />
        <main className="flex-1 ml-72 p-8">{children}</main>
      </body>
    </html>
  )
}
