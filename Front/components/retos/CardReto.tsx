"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Recycle, Coffee, Footprints, Lock } from "lucide-react";

const iconMap: Record<string, any> = {
  recycle: Recycle,
  coffee: Coffee,
  footprints: Footprints,
};

interface CardRetoProps {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  meta: number;
  progresoInicial: number;
  xpRecompensa: number;
  estadoInicial: "activo" | "disponible" | "bloqueado";
  nivelRequerido?: number;
}

export default function CardReto({
  titulo,
  descripcion,
  icono,
  meta,
  progresoInicial,
  xpRecompensa,
  estadoInicial,
  nivelRequerido,
}: CardRetoProps) {
  const [estado, setEstado] = useState(estadoInicial);
  const [progreso, setProgreso] = useState(progresoInicial);

  const IconComponent = estado === "bloqueado" ? Lock : iconMap[icono] || Recycle;
  const porcentaje = (progreso / meta) * 100;

  const handleAceptar = () => {
    if (estado === "disponible") {
      setEstado("activo");
    }
  };

  return (
    <div 
      className={`bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-72 transition-all relative ${
        estado === "bloqueado" ? "opacity-60 select-none" : "hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            estado === "bloqueado" ? "bg-slate-100 text-slate-400" : "bg-[#046a53] text-white"
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          
          <div className="bg-[#fcc419]/20 text-amber-700 text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1">
            <span>☆</span> +{xpRecompensa} XP
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">{titulo}</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[220px]">
          {descripcion}
        </p>
      </div>

      <div className="mt-4">
        {estado === "activo" && (
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-400">Progreso</span>
              <span className="text-[#046a53] font-mono">{progreso} / {meta}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                className="h-full bg-[#046a53] rounded-full"
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {estado === "disponible" && (
          <div className="space-y-4">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-200 w-0" />
            </div>
            <button 
              onClick={handleAceptar}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Aceptar Reto
            </button>
          </div>
        )}

        {estado === "bloqueado" && (
          <div className="text-center py-4">
            <span className="text-xs font-bold text-slate-400 tracking-wide bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 inline-block">
              Bloqueado (Nivel {nivelRequerido} req.)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
