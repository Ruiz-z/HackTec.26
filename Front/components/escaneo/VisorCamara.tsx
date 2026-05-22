"use client";
import { motion } from "framer-motion";
import { Maximize, ScanLine } from "lucide-react";

export default function VisorCamara() {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-2xs flex flex-col items-center justify-center text-center h-full min-h-[500px]">
      
      <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden border-8 border-slate-50 shadow-inner flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Hardware Preview"
          />
        </div>

        <div className="absolute inset-12 border-2 border-white/30 rounded-2xl flex items-center justify-center">
            <motion.div 
                initial={{ y: -60 }}
                animate={{ y: 60 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-20"
            />
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg" />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase animate-pulse">
                    Scanning...
                </span>
            </div>
        </div>
      </div>

      <p className="mt-8 text-xs font-bold text-slate-800 leading-relaxed max-w-xs">
        Apunta tu cámara al código QR del contenedor para vincular tu sesión
      </p>
    </div>
  );
}
