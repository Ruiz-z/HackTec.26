"use client";
import { useState } from "react";
import VisorCamara from "@/components/escaneo/VisorCamara";
import { Search, Lightbulb, RefreshCw } from "lucide-react";

export default function EscaneoPage() {
  const [binCode, setBinCode] = useState("");

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex justify-between items-start w-full mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, Mauro</h1>
          <p className="text-slate-400 text-xs font-semibold mt-1">Escanea el contenedor para empezar a sumar puntos.</p>
        </div>
        <div className="bg-[#fcc419] text-slate-950 font-black px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <span>⭐</span>
          <span>4,258 XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <VisorCamara />

        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-[#046a53] animate-spin" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-none">Buscando código...</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Mantén estable la cámara</p>
                </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Entrada Manual</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">
                ¿No puedes escanear? Ingresa el código del basurero manualmente
            </p>

            <div className="space-y-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ej: ARC-9982"
                        value={binCode}
                        onChange={(e) => setBinCode(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-slate-400"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Search className="w-4 h-4 text-slate-300" />
                    </div>
                </div>

                <button className="w-full bg-[#046a53] hover:bg-[#035442] text-white font-bold py-3 rounded-xl text-xs tracking-wide shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2 group">
                    <span>Vincular</span>
                    <span className="transition-transform group-hover:translate-x-1">➔</span>
                </button>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-[#fcc419] rounded-xl flex items-center justify-center text-slate-900 shrink-0 shadow-2xs">
                <Lightbulb className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
                <h4 className="text-xs font-bold text-amber-900">Tip de Arcade</h4>
                <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium mt-1">
                    Vincular tu sesión antes de depositar te otorga un multiplicador de <strong className="text-amber-800">x1.2 XP</strong> por las primeras 5 botellas.
                </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
