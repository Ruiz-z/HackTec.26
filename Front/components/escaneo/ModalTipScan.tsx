"use client";
import { X, Lightbulb, Recycle, Zap } from "lucide-react";

interface ModalTipScanProps {
  resultado: {
    objeto: string;
    tipo: string;
    tip: string;
    comoReciclar: string;
    xpGanado: number;
    confianza: number;
    modo?: string;
  };
  onClose: () => void;
}

const COLOR_POR_TIPO: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  plastico: { bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",   text: "text-blue-700" },
  metal:    { bg: "bg-slate-50",  border: "border-slate-200",  badge: "bg-slate-100 text-slate-700", text: "text-slate-700" },
  aluminio: { bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700", text: "text-amber-700" },
};

const ICONO_POR_TIPO: Record<string, string> = {
  plastico: "🥤",
  metal:    "🔩",
  aluminio: "🥫",
};

export default function ModalTipScan({ resultado, onClose }: ModalTipScanProps) {
  const colores = COLOR_POR_TIPO[resultado.tipo] ?? {
    bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700",
  };
  const icono = ICONO_POR_TIPO[resultado.tipo] ?? "♻️";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className={`${colores.bg} ${colores.border} border-b px-6 pt-6 pb-5 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icono}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Clasificado</p>
              <h2 className="text-lg font-black text-slate-900 leading-tight">{resultado.objeto}</h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colores.badge} capitalize mt-0.5 inline-block`}>
                {resultado.tipo}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* XP ganado */}
        <div className="px-6 py-4 flex items-center justify-between bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">XP Ganado</span>
          </div>
          <span className="text-xl font-black text-emerald-600">+{resultado.xpGanado} XP</span>
        </div>

        {/* Tip educativo */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">¿Sabías que...?</p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{resultado.tip}</p>
            </div>
          </div>
        </div>

        {/* Cómo reciclar */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <Recycle className="w-4 h-4 text-[#046a53] shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#046a53] mb-1">Cómo Reciclarlo</p>
              <p className="text-sm text-slate-700 leading-relaxed">{resultado.comoReciclar}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3">
          {resultado.modo === 'offline' && (
            <p className="text-[10px] text-amber-500 font-semibold">⚠ Modo offline</p>
          )}
          <button
            onClick={onClose}
            className="ml-auto bg-[#046a53] hover:bg-[#035442] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            ¡Entendido!
          </button>
        </div>

      </div>
    </div>
  );
}
