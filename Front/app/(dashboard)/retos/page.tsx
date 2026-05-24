"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Leaf, Award, Recycle, Flame, Store, CheckCircle2, Coins } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const iconosDisponibles: Record<string, any> = {
  '🌿': Leaf, '♻️': Recycle, '🔥': Flame, '🏆': Award, '🥤': Recycle, '🗺️': Award,
}

interface RetoAPI {
  id: number; titulo: string; descripcion: string; tipo: string;
  meta: number; xpRecompensa: number; ptsRecompensa: number; icono: string;
  progreso: number; completado: boolean; completadoAt: string | null; porcentaje: number;
}

const fallbackIcono = Recycle

export default function RetosPage() {
  const { user } = useAuth();
  const [retos, setRetos] = useState<RetoAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRetos = useCallback(() => {
    if (!user?.id) return
    setLoading(true)
    api.getRetosUsuario(user.id)
      .then(data => { setRetos(data); setLoading(false) })
      .catch(() => { setError("Error al cargar retos"); setLoading(false) })
  }, [user?.id])

  useEffect(() => { fetchRetos() }, [fetchRetos])

  useEffect(() => {
    const onFocus = () => fetchRetos()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchRetos])

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Retos Activos</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Completa tus misiones para ganar XP y puntos.</p>
        </div>
        
        <button className="bg-[#fcc419] hover:bg-[#e2af13] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
          <Store className="w-3.5 h-3.5 text-slate-950" />
          <span>Tienda de XP</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 font-medium">Cargando retos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {!loading && !error && retos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 font-medium">No hay retos activos disponibles.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {retos.map((reto) => {
            const IconoComponente = iconosDisponibles[reto.icono] || fallbackIcono;
            const porcentaje = Math.min(100, (reto.progreso / reto.meta) * 100);
            const esCompletado = reto.completado;

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

                    {!esCompletado && (
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

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#fcc419]/15 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <span>★</span> +{reto.xpRecompensa} XP
                    </div>
                    {reto.ptsRecompensa > 0 && (
                      <div className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Coins className="w-3 h-3" /> +{reto.ptsRecompensa}
                      </div>
                    )}
                  </div>

                  {esCompletado ? (
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
      )}
    </div>
  );
}
