"use client";
import { useState } from "react";
import { ShieldAlert, Trash2, Coins, RefreshCw, Layers, CheckCircle } from "lucide-react";

export default function AdminPage() {
  const [userId, setUserId] = useState("RecycleHero_88");
  const [xpAmount, setXpAmount] = useState("500");
  const [successMsg, setSuccessMsg] = useState("");

  const handleInjectXp = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`¡Éxito! Se han inyectado ${xpAmount} XP correctamente al usuario @${userId}.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Módulo operativo interno para simulación de hardware y soporte técnico.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Operational</span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-emerald-500 text-white p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all">
          <CheckCircle className="w-4 h-4 text-emerald-100" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#046a53] mb-3">
              <Trash2 className="w-4 h-4" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Simulación de Hardware</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
              Fuerza de manera remota el vaciado completo de los sensores físicos de prueba. Ideal para reiniciar el estado de la red sin necesidad de recolección en campo.
            </p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 font-medium flex justify-between items-center mb-6">
              <span>Estado Crítico Actual:</span>
              <span className="font-mono text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">📍 B3 - 98% Full</span>
            </div>
          </div>

          <button className="w-full bg-[#046a53] hover:bg-[#035442] text-white font-bold py-3 rounded-xl text-xs tracking-wide shadow-2xs transition-colors cursor-pointer text-center uppercase">
            Simular Vaciado de Contenedor
          </button>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-600 mb-3">
            <Coins className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Soporte Técnico & Ajuste de Puntos</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
            Inyecta o descuenta saldo de experiencia (XP) directamente en la cuenta de un jugador para resolver reclamos o realizar pruebas de canje en la tienda.
          </p>

          <form onSubmit={handleInjectXp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">ID Usuario</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Importe XP</label>
                <input 
                  type="number" 
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#fcc419] hover:bg-[#e2af13] text-slate-950 font-bold py-3 rounded-xl text-xs tracking-wide shadow-2xs transition-colors cursor-pointer text-center uppercase mt-2">
              Inyectar Puntos
            </button>
          </form>
        </div>

      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700 px-5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Mantenimiento de Nodos Físicos</span>
          </div>
          <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">5 Activos</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { cod: "B1", localizacion: "Plaza Principal", nivel: 30, color: "bg-[#046a53]" },
            { cod: "B2", localizacion: "Entrada Norte", nivel: 45, color: "bg-[#046a53]" },
            { cod: "B3", localizacion: "Biblioteca Central", nivel: 98, color: "bg-red-600" },
            { cod: "B4", localizacion: "Cafetería Campus", nivel: 85, color: "bg-amber-500" },
            { cod: "B5", localizacion: "Gimnasio Universitario", nivel: 12, color: "bg-[#046a53]" },
          ].map((nodo) => (
            <div key={nodo.cod} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 gap-4 hover:bg-slate-50/40 transition-colors">
              
              <div className="flex items-center gap-4 w-52 shrink-0">
                <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{nodo.cod}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-none">{nodo.localizacion}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Módulo Sónico IoT v2</span>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className={`h-full rounded-full ${nodo.color}`} style={{ width: `${nodo.nivel}%` }} />
                </div>
                <span className={`font-mono text-xs font-bold w-12 text-right ${nodo.nivel > 90 ? "text-red-600" : "text-slate-700"}`}>
                  {nodo.nivel}%
                </span>
              </div>

              <div className="sm:w-24 shrink-0 text-right">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-700 border border-slate-200/60 rounded-lg px-2.5 py-1 hover:bg-slate-50 transition-colors cursor-pointer">
                  Reiniciar
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
