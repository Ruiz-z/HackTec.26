"use client";
import { useState, useEffect } from "react";
import { Trophy, Shield, Info, MapPin } from "lucide-react";
import { api } from "@/lib/api";

type UserRanking = {
  id: number; nombre: string; puntos: number; xp: number;
  nivel: string; nivelNum: number; _count: { scans: number };
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRanking()
      .then(data => { setRanking(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const topTres = ranking.slice(0, 3)
  const listaChase = ranking.slice(3)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex justify-between items-center w-full mb-12">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Ranking</h1>
        <div className="bg-slate-100 border border-slate-200/60 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
          <span>🏆</span>
          <span>Season 4 Active</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">Cargando ranking...</div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">No hay datos de ranking disponibles.</div>
      ) : (
      <>

      {/* PODIO */}
      <div className="flex justify-center items-end gap-6 max-w-xl mx-auto mb-10 pt-16">

        {/* PUESTO 2 */}
        {topTres.length >= 2 && (
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-[-12px] z-10">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-[#046a53] text-white flex items-center justify-center text-lg font-black">
              {topTres[1].nombre.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-[10px] font-bold px-1.5 rounded-full shadow-2xs text-slate-800">
              #2
            </div>
          </div>
          <div className="bg-slate-100 border border-slate-200/50 rounded-t-2xl pt-6 pb-5 px-4 w-full text-center shadow-2xs flex flex-col items-center h-28 justify-between">
            <h4 className="text-sm font-bold text-slate-800">{topTres[1].nombre}</h4>
            <div className="bg-[#fcc419]/90 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <span>☆</span> {topTres[1].xp} XP
            </div>
          </div>
        </div>
        )}

        {/* PUESTO 1 */}
        <div className="flex flex-col items-center flex-1 relative -top-4">
          <div className="relative mb-[-12px] z-10">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-lg text-amber-500 animate-bounce">👑</span>
            <div className="w-18 h-18 rounded-full border-4 border-[#fcc419] shadow-md bg-[#046a53] text-white flex items-center justify-center text-2xl font-black">
              {topTres[0]?.nombre?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fcc419] border-2 border-white text-[10px] font-black px-1.5 rounded-full shadow-2xs text-slate-950">
              #1
            </div>
          </div>
          <div className="bg-[#fcc419] border border-[#fcc419]/50 rounded-t-2xl pt-6 pb-5 px-4 w-full text-center shadow-md flex flex-col items-center h-32 justify-between">
            <h4 className="text-sm font-black text-slate-950">{topTres[0]?.nombre || '—'}</h4>
            <div className="bg-white/90 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <span>👑</span> {topTres[0]?.xp || 0} XP
            </div>
          </div>
        </div>

        {/* PUESTO 3 */}
        {topTres.length >= 3 && (
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-[-12px] z-10">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-[#046a53] text-white flex items-center justify-center text-lg font-black">
              {topTres[2].nombre.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-[10px] font-bold px-1.5 rounded-full shadow-2xs text-slate-800">
              #3
            </div>
          </div>
          <div className="bg-slate-100 border border-slate-200/50 rounded-t-2xl pt-6 pb-5 px-4 w-full text-center shadow-2xs flex flex-col items-center h-24 justify-between">
            <h4 className="text-sm font-bold text-slate-800">{topTres[2].nombre}</h4>
            <div className="bg-[#fcc419]/90 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <span>☆</span> {topTres[2].xp} XP
            </div>
          </div>
        </div>
        )}

      </div>

      {/* THE CHASE LIST */}
      {listaChase.length > 0 && (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-2xs divide-y divide-slate-50">
        {listaChase.map((usuario) => (
          <div key={usuario.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/70 transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 w-6 text-center">{usuario.nivelNum}</span>
              <div className="w-9 h-9 rounded-full border-2 border-slate-100 bg-[#046a53] text-white flex items-center justify-center text-xs font-black">
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{usuario.nombre}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{usuario.nivel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                +{usuario.xp} XP
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      </>
      )}

    </div>
  );
}
