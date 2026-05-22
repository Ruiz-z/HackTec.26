"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Coins, Ticket, ShoppingBag, Coffee, CheckCircle2 } from "lucide-react";

const premiosIniciales = [
  {
    id: "p1",
    titulo: "Termo de Acero Inoxidable",
    categoria: "Físico",
    descripcion: "Mantén tus bebidas frías o calientes y elimina por completo el uso de botellas de plástico de un solo uso.",
    costo: 1200,
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=300&auto=format&fit=crop",
    icono: ShoppingBag,
    disponible: true,
  },
  {
    id: "p2",
    titulo: "Bono de Café Orgánico Gratis",
    categoria: "Digital",
    descripcion: "Cupón digital válido por un café mediano en cualquier establecimiento local participante de la red eco.",
    costo: 350,
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300&auto=format&fit=crop",
    icono: Coffee,
    disponible: true,
  },
  {
    id: "p3",
    titulo: "Boleto de Transporte Público",
    categoria: "Digital",
    descripcion: "Un viaje gratis integrado en tu tarjeta de transporte urbano para promover la movilidad sostenible.",
    costo: 150,
    imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=300&auto=format&fit=crop",
    icono: Ticket,
    disponible: true,
  },
];

export default function RecompensasPage() {
  const [userXp, setUserXp] = useState(4250);
  const [canjeados, setCanjeados] = useState<string[]>([]);

  const handleCanjear = (id: string, costo: number) => {
    if (userXp >= costo) {
      setUserXp(prev => prev - costo);
      setCanjeados(prev => [...prev, id]);
    }
  };

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
            <span className="font-mono text-sm font-black text-slate-900 mt-1 block">{userXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiosIniciales.map((premio) => {
          const IconoCat = premio.icono;
          const yaCanjeado = canjeados.includes(premio.id);
          const puedeComprar = userXp >= premio.costo;

          return (
            <div 
              key={premio.id} 
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div className="relative h-40 bg-slate-100 border-b border-slate-100">
                <img 
                  src={premio.imagen} 
                  alt={premio.titulo} 
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 left-3 text-[9px] font-extrabold px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider text-white ${
                  premio.categoria === "Físico" ? "bg-[#046a53]" : "bg-teal-600"
                }`}>
                  {premio.categoria}
                </span>
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
                    <span className="font-mono text-xs font-black text-amber-700 mt-1 block">⭐ {premio.costo} XP</span>
                  </div>

                  {yaCanjeado ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 py-2 px-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Canjeado
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleCanjear(premio.id, premio.costo)}
                      disabled={!puedeComprar}
                      className={`font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer ${
                        puedeComprar 
                          ? "bg-[#046a53] hover:bg-[#035442] text-white" 
                          : "bg-slate-50 text-slate-400 border border-slate-200/40 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {puedeComprar ? "Canjear Premio" : "XP Insuficiente"}
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-slate-200/60 rounded-xl p-4 text-center font-mono text-[10px] text-slate-400 shadow-2xs">
        {"{{DATA:DOCUMENT:DOCUMENT_7}}"}
      </div>

    </div>
  );
}
