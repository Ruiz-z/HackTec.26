"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Droplet, Target, Sparkles, ArrowDownRight, Info } from "lucide-react";

export default function InsightsPage() {
  const [filtro, setFiltro] = useState("semanal");

  const materiales = [
    { nombre: "Plástico", cantidad: "142 ítems", porcentaje: 60, color: "bg-[#046a53]" },
    { nombre: "Papel y Cartón", cantidad: "64 ítems", porcentaje: 25, color: "bg-slate-400" },
    { nombre: "Vidrio", cantidad: "38 ítems", porcentaje: 15, color: "bg-[#fcc419]" },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insights</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Analiza tu progreso ecológico y el desglose de tus depósitos.</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-end sm:self-auto">
          {["semanal", "mensual", "historico"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filtro === f ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f === "historico" ? "Histórico" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-emerald-50 text-[#046a53] rounded-xl flex items-center justify-center border border-emerald-100/30 shrink-0">
            <ArrowDownRight className="w-5 h-5 text-[#046a53]" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">CO₂ Mitigado</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">-14.2 kg</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">📉 Tendencia a la baja</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/30 shrink-0">
            <Droplet className="w-5 h-5 fill-blue-500 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Agua Salvada</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">45 Litros</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Equivalente a 3 duchas</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/30 shrink-0">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Precisión de Escaneo</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">98.4%</h3>
            <p className="text-[10px] text-amber-700 font-bold mt-0.5">🎯 Rango Calibrado</p>
          </div>
        </div>

      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Distribución de Residuos</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Volumen por categoría</span>
        </div>

        <div className="w-full h-5 bg-slate-100 rounded-lg overflow-hidden flex mb-8 border border-slate-200/20 shadow-inner">
          <div className="h-full bg-[#046a53]" style={{ width: "60%" }} title="Plástico 60%" />
          <div className="h-full bg-slate-400" style={{ width: "25%" }} title="Papel 25%" />
          <div className="h-full bg-[#fcc419]" style={{ width: "15%" }} title="Vidrio 15%" />
        </div>

        <div className="space-y-4">
          {materiales.map((mat) => (
            <div key={mat.nombre} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6">
              <div className="flex items-center gap-3 w-40 shrink-0">
                <div className={`w-3 h-3 rounded-full ${mat.color}`} />
                <span className="text-xs font-bold text-slate-800">{mat.nombre}</span>
              </div>
              
              <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                <div className={`h-full rounded-full ${mat.color}`} style={{ width: `${mat.porcentaje}%` }} />
              </div>

              <div className="text-right w-24 shrink-0">
                <span className="text-xs font-mono font-bold text-slate-900">{mat.cantidad}</span>
                <span className="text-[10px] text-slate-400 font-semibold block sm:inline sm:ml-2">({mat.porcentaje}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        <div className="md:col-span-3 bg-emerald-50/60 border border-emerald-100/60 p-5 rounded-2xl flex items-start gap-4">
          <div className="w-9 h-9 bg-[#046a53] rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 fill-white text-[#046a53]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#046a53] flex items-center gap-1.5">Sugerencia del Eco-Asistente</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
              ¡Tu precisión con el plástico aumentó un 5%! <strong className="text-slate-700">Tip de juego:</strong> Recuerda quitar las tapas y vaciar por completo los envases antes de pasarlos por el escáner del contenedor para asegurar la máxima bonificación de XP.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Ficha Técnica</span>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center font-mono text-[11px] text-slate-400 mt-2">
            Datos actualizados en tiempo real
          </div>
        </div>

      </div>

    </div>
  );
}
