"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Award, Recycle, Flame, Store, CheckCircle2 } from "lucide-react";

const retosIniciales = [
  {
    id: "r1",
    titulo: "Héroe del Vidrio",
    descripcion: "Deposita al menos 5 botellas de vidrio en los contenedores verdes esta semana.",
    progreso: 3,
    meta: 5,
    xp: 250,
    icono: Recycle,
    estado: "activo",
  },
  {
    id: "r2",
    titulo: "Racha Verde",
    descripcion: "Completa un escaneo diario durante 3 días consecutivos para mantener tu racha.",
    progreso: 1,
    meta: 3,
    xp: 400,
    icono: Flame,
    estado: "activo",
  },
  {
    id: "r3",
    titulo: "Cero Desperdicio",
    descripcion: "Clasifica correctamente 20 elementos sin registrar un solo error de IA.",
    progreso: 0,
    meta: 20,
    xp: 600,
    icono: Leaf,
    estado: "disponible",
  },
];

export default function RetosPage() {
  const [retos, setRetos] = useState(retosIniciales);

  const handleAceptarReto = (id: string) => {
    setRetos(prev =>
      prev.map(r => (r.id === id ? { ...r, estado: "activo" } : r))
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Retos Activos</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Completa tus misiones para reclamar recompensas en la tienda.</p>
        </div>
        
        <button className="bg-[#fcc419] hover:bg-[#e2af13] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
          <Store className="w-3.5 h-3.5 text-slate-950" />
          <span>Tienda de XP</span>
        </button>
      </div>

      <div className="space-y-4">
        {retos.map((reto) => {
          const IconoComponente = reto.icono;
          const porcentaje = (reto.progreso / reto.meta) * 100;
          const esCompletado = reto.progreso >= reto.meta;

          return (
            <div 
              key={reto.id} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#046a53] shrink-0">
                  <IconoComponente className="w-5 h-5" />
                </div>

                <div className="w-full">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-0.5">
                    {reto.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl mb-3">
                    {reto.descripcion}
                  </p>

                  {reto.estado === "activo" && (
                    <div className="flex items-center gap-3 w-full max-w-md">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${porcentaje}%` }}
                          className="h-full bg-[#046a53] rounded-full"
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                        {reto.progreso}/{reto.meta}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                <div className="bg-[#fcc419]/15 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span>★</span> +{reto.xp} XP
                </div>

                {reto.estado === "disponible" ? (
                  <button 
                    onClick={() => handleAceptarReto(reto.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Aceptar
                  </button>
                ) : esCompletado ? (
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 py-1.5 px-2 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reclamado
                  </span>
                ) : (
                  <button 
                    disabled
                    className="bg-slate-50 text-slate-400 font-bold px-4 py-1.5 rounded-xl text-xs border border-slate-100 cursor-not-allowed"
                  >
                    En progreso
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-slate-100 rounded-xl p-4 text-center font-mono text-[10px] text-slate-400 shadow-2xs">
        {"{{DATA:DOCUMENT:DOCUMENT_5}}"}
      </div>
    </div>
  );
}
