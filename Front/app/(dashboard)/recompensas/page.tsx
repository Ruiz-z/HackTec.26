"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Coins, Ticket, ShoppingBag, Coffee, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Recompensa = {
  id: number; titulo: string; descripcion: string;
  categoria: string; costo: number; imagen: string; icono: string;
  nivelMinimo: number;
}

type Canje = {
  id: number; recompensaId: number; recompensa: Recompensa; createdAt: string;
}

const iconoMap: Record<string, any> = {
  '🧊': ShoppingBag, '☕': Coffee, '🎫': Ticket, '🎁': Gift,
}

const defaultIcono = Gift

export default function RecompensasPage() {
  const { user, token, refreshUser } = useAuth();
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [canjeados, setCanjeados] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [canjeando, setCanjeando] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [r, c] = await Promise.all([
        api.getRecompensas(),
        token ? api.getMisCanjes(token) : [],
      ])
      setRecompensas(r)
      setCanjeados(c.map((cj: Canje) => cj.recompensaId))
    } catch {
      setError("Error al cargar recompensas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [token])

  const handleCanjear = async (id: number) => {
    if (!token) return
    setCanjeando(id)
    setError("")
    try {
      await api.canjearRecompensa(token, id)
      setCanjeados(prev => [...prev, id])
      refreshUser()
    } catch (err: any) {
      setError(err.message || "Error al canjear")
    } finally {
      setCanjeando(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recompensas</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Canjea tus puntos acumulados por premios físicos y beneficios digitales.</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 bg-[#fcc419] rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-2xs">
            <Coins className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Tu Balance</span>
            <span className="font-mono text-sm font-black text-slate-900 mt-1 block">{(user?.puntos || 0).toLocaleString()} pts</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">Cargando recompensas...</div>
      ) : recompensas.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">No hay recompensas disponibles.</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recompensas.map((premio) => {
          const IconoCat = iconoMap[premio.icono] || defaultIcono;
          const yaCanjeado = canjeados.includes(premio.id);
          const puedeComprar = (user?.puntos || 0) >= premio.costo;
          const nivelSuficiente = (user?.nivelNum || 0) >= premio.nivelMinimo;

          return (
            <div 
              key={premio.id} 
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div className={`relative h-44 ${premio.categoria === "Físico" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-teal-400 to-cyan-600"} border-b border-slate-100 flex items-center justify-center overflow-hidden`}>
                <div className="text-6xl opacity-90 drop-shadow-lg">
                  {premio.icono}
                </div>
                <img 
                  src={premio.imagen} 
                  alt={premio.titulo} 
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className={`absolute top-3 left-3 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider text-white ${
                  premio.categoria === "Físico" ? "bg-[#046a53]" : "bg-teal-600"
                }`}>
                  {premio.categoria}
                </span>
                {premio.nivelMinimo > 1 && (
                  <span className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider bg-purple-600 text-white">
                    Nvl {premio.nivelMinimo}+
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <IconoCat className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{premio.titulo}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2 line-clamp-3">
                    {premio.descripcion}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                  <div className="shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Coste</span>
                    <span className="font-mono text-xs font-black text-amber-700 mt-1 block">⭐ {premio.costo} pts</span>
                  </div>

                  {yaCanjeado ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 py-2 px-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Canjeado
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleCanjear(premio.id)}
                      disabled={!puedeComprar || !nivelSuficiente || canjeando === premio.id}
                      className={`font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer ${
                        puedeComprar && nivelSuficiente
                          ? "bg-[#046a53] hover:bg-[#035442] text-white" 
                          : "bg-slate-50 text-slate-400 border border-slate-200/40 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {canjeando === premio.id ? "Canjeando..." : !nivelSuficiente ? `Nivel ${premio.nivelMinimo}+ requerido` : puedeComprar ? "Canjear Premio" : "Puntos Insuficientes"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
