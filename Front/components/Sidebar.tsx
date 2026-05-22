"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Trophy,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Gift,
  User,
} from "lucide-react"
import clsx from "clsx"

const navItems = [
  { href: "/", label: "Ruta", icon: Home },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/retos", label: "Retos", icon: Star },
  { href: "/admin", label: "Admin", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white border-r border-slate-100 p-6 flex flex-col justify-between z-50">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#046a53] flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-[#046a53] text-xl font-bold tracking-tight">
            EcoArcade
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-[#046a53]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#046a53]" />
          </div>
          <div>
            <p className="text-slate-900 font-semibold text-sm">
              RecycleHero_88
            </p>
            <p className="text-xs text-slate-500">Reciclador · 12,450 XP</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={clsx(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#046a53] bg-[#046a53]/5"
                      : "text-slate-600 hover:text-[#046a53] hover:bg-[#046a53]/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#046a53] rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <Link
          href="/retos/nuevo"
          className="block w-full bg-[#046a53] text-white font-medium py-2.5 px-4 rounded-lg text-sm text-center mb-6 hover:bg-[#046a53]/90 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" />
            New Challenge
          </span>
        </Link>

        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-[#046a53] hover:bg-[#046a53]/5 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
