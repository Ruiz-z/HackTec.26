"use client";
import { Trophy, Shield, Info, MapPin } from "lucide-react";

const topTres = [
  { id: "2", nombre: "Ana", xp: 50, rango: 2, foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
  { id: "1", nombre: "Mauro", xp: 75, rango: 1, foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop" },
  { id: "3", nombre: "Luis", xp: 30, rango: 3, foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
];

const listaChase = [
  { posicion: 4, nombre: "Sara", sub: "Level 12 Recycler", xp: "25 XP", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" },
  { posicion: 5, nombre: "Carlos", sub: "Level 9 Recycler", xp: "10 XP", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
];

export default function RankingPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex justify-between items-center w-full mb-12">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Ranking</h1>
        <div className="bg-slate-100 border border-slate-200/60 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
          <span>🏆</span>
          <span>Season 4 Active</span>
        </div>
      </div>

      {/* PODIO REAL */}
      <div className="flex justify-center items-end gap-6 max-w-xl mx-auto mb-10 pt-16">
        
        {/* PUESTO 2 */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-[-12px] z-10">
            <img src={topTres[0].foto} alt="Ana" className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-[10px] font-bold px-1.5 rounded-full shadow-2xs text-slate-800">
              #2
            </div>
          </div>
          <div className="bg-slate-100 border border-slate-200/50 rounded-t-2xl pt-6 pb-5 px-4 w-full text-center shadow-2xs flex flex-col items-center h-28 justify-between">
            <h4 className="text-sm font-bold text-slate-800">{topTres[0].nombre}</h4>
            <div className="bg-[#fcc419]/90 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <span>☆</span> {topTres[0].xp} XP
            </div>
          </div>
        </div>

        {/* PUESTO 1 */}
        <div className="flex flex-col items-center flex-1 relative -top-4">
          <div className="relative mb-[-12px] z-10">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-lg text-amber-500 animate-bounce">👑</span>
            <img src={topTres[1].foto} alt="Mauro" className="w-18 h-18 rounded-full border-4 border-[#fcc419] shadow-md object-cover" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fcc419] text-slate-950 text-[10px] font-black px-1.5 rounded-full shadow-2xs">
              #1
            </div>
          </div>
          <div className="bg-[#046a53] rounded-t-2xl pt-7 pb-5 px-4 w-full text-center shadow-xs flex flex-col items-center h-34 justify-between">
            <h4 className="text-base font-black text-white tracking-wide">{topTres[1].nombre}</h4>
            <div className="bg-[#fcc419] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <span>☆</span> {topTres[1].xp} XP
            </div>
          </div>
        </div>

        {/* PUESTO 3 */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-[-12px] z-10">
            <img src={topTres[2].foto} alt="Luis" className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover" />
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

      </div>

      {/* THE CHASE */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xs overflow-hidden mb-6">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700 px-5">
          <span>The Chase</span>
          <span className="text-slate-400 font-semibold text-[11px]">Top 50</span>
        </div>

        <div className="divide-y divide-slate-100">
          {listaChase.map((user) => (
            <div key={user.posicion} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-5">
                <span className="font-mono text-xs font-bold text-slate-800 w-4 text-center">{user.posicion}</span>
                <img src={user.foto} alt={user.nombre} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-none">{user.nombre}</h5>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{user.sub}</span>
                </div>
              </div>
              <div className="bg-[#fcc419]/15 text-amber-800 font-bold text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
                <span>☆</span> {user.xp}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white border-t border-slate-50 flex justify-center">
          <button className="text-[#046a53] hover:text-[#035442] font-bold text-xs tracking-wide py-1 px-4 cursor-pointer">
            Load More
          </button>
        </div>
      </div>

      {/* FOOTER: SEASON INFO + DOC REFERENCE */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-emerald-50/60 border border-emerald-100/60 p-5 rounded-2xl flex items-start gap-4">
          <div className="w-9 h-9 bg-[#046a53] rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#046a53]">Season Info</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
              Top 3 players receive exclusive physical eco-rewards at the end of the month. Keep recycling to climb!
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Document Reference</span>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center font-mono text-[11px] text-slate-400 mt-2">
            {"{{DATA:DOCUMENT:DOCUMENT_4}}"}
          </div>
        </div>
      </div>

    </div>
  );
}
