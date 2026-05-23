"use client";
import { useRouter } from "next/navigation";
import { QrCode, MapPin, FileText, PlayCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in relative min-h-[calc(100vh-6rem)] flex flex-col justify-between select-none">
      
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">Hola, Mauro</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-bold text-slate-500">Eco Principiante</span>
            <div className="bg-[#fcc419] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
              <span>☆</span> 0 XP
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
          
          <div
            onClick={() => router.push("/escaneo")}
            className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs flex flex-col justify-between items-center text-center cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-center w-full mb-6">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Tú Eco-Pass Digital</h3>
              <QrCode className="w-4 h-4 text-[#046a53]" />
            </div>

            <div className="w-56 h-56 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/80 p-6 flex flex-col items-center justify-center relative shadow-inner group-hover:border-[#046a53]/30 transition-colors">
              <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
                <QrCode className="w-24 h-24 text-slate-400 stroke-[1.2]" />
              </div>
            </div>

            <p className="text-xs font-mono font-bold text-slate-500 mt-6 tracking-wide group-hover:text-[#046a53] transition-colors">
              Escanea para iniciar
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start w-full mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Ruta Activa</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#046a53] shrink-0" />
                    <span>B3 - Biblioteca Central</span>
                  </div>
                </div>
                <span className="bg-[#046a53] text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                  Vinculado
                </span>
              </div>

              <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200/40">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
                  alt="City Map" 
                  className="w-full h-full object-cover grayscale opacity-45 mix-blend-multiply"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#046a53] text-white rounded-full flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                  <span>♻️</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Materiales Aceptados:</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-50 text-slate-600 border border-slate-200/60 font-semibold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                  📄 Papel
                </span>
                <span className="bg-slate-50 text-slate-600 border border-slate-200/60 font-semibold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                  📦 Cartón
                </span>
                <span className="bg-slate-50 text-slate-600 border border-slate-200/60 font-semibold text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1">
                  💧 Plástico
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center gap-3 shadow-2xs w-full">
          <div className="w-8 h-8 bg-[#fcc419] rounded-lg flex items-center justify-center text-slate-950 shrink-0 font-bold">
            💡
          </div>
          <span className="font-mono text-xs text-slate-500">Eco-Pass Digital</span>
        </div>
      </div>

      <div className="flex justify-end w-full mt-8 lg:mt-0">
        <button
          onClick={() => router.push("/escaneo")}
          className="bg-[#046a53] hover:bg-[#035442] text-white font-bold py-3.5 px-6 rounded-xl text-xs tracking-wider flex items-center gap-2.5 shadow-md transition-all hover:scale-102 cursor-pointer uppercase"
        >
          <PlayCircle className="w-4 h-4 text-emerald-300" />
          <span>Iniciar Depósito</span>
        </button>
      </div>

    </div>
  );
}
