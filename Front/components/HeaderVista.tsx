"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface HeaderVistaProps {
  titulo: string
  subtitulo: string
  xp?: number
}

export function HeaderVista({ titulo, subtitulo, xp = 12450 }: HeaderVistaProps) {
  return (
    <div className="flex justify-between items-start w-full mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {titulo}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{subtitulo}</p>
      </div>

      <motion.div
        whileTap={{ scale: 0.95 }}
        className="bg-[#fcc419] font-bold text-slate-950 px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>{xp.toLocaleString()} XP</span>
      </motion.div>
    </div>
  )
}
