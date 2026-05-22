"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, Battery, Wifi, Truck, RefreshCw } from "lucide-react";

const mockBasureros = [
  { id: "1", codigo: "B1", nombre: "Plaza Principal", nivelActual: 30, estado: "disponible" as const, bateria: 100, ultimoEvento: { usuario: "Pedro", tipo: "Vidrio", hace: "10m" } },
  { id: "2", codigo: "B2", nombre: "Entrada Norte", nivelActual: 45, estado: "disponible" as const, bateria: 95, ultimoEvento: { usuario: "Carlos", tipo: "Papel", hace: "45m" } },
  { id: "3", codigo: "B3", nombre: "Biblioteca Central", nivelActual: 98, estado: "lleno" as const, bateria: 100, ultimoEvento: { usuario: "Ana", tipo: "Plástico", hace: "2h" } },
  { id: "4", codigo: "B4", nombre: "Cafetería Campus", nivelActual: 85, estado: "alerta" as const, bateria: 80, ultimoEvento: { usuario: "Sofía", tipo: "Metal", hace: "1h" } },
  { id: "5", codigo: "B5", nombre: "Gimnasio", nivelActual: 0, estado: "offline" as const, bateria: 12, ultimoEvento: null },
];

export default function RutaPage() {
  const [selectedId, setSelectedId] = useState("3");

  const b = mockBasureros.find((item) => item.id === selectedId) || mockBasureros[2];

  const getEstilosNodo = (estado: string, isSelected: boolean) => {
    let colores = "border-slate-400 bg-slate-50 text-slate-500";
    if (estado === "disponible") colores = "border-[#046a53] bg-white text-[#046a53]";
    if (estado === "alerta") colores = "border-amber-500 bg-white text-amber-600";
    if (estado === "lleno") colores = "border-red-600 bg-white text-red-600";
    return `${colores} ${isSelected ? "ring-4 ring-offset-2 ring-slate-400 scale-105" : ""}`;
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start w-full mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ruta de Contenedores</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">{"{{DATA:DOCUMENT:DOCUMENT_3}}"}</p>
        </div>
        <div className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" />
          <span>Actualizado hace 1 min</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs mb-6">
        <h3 className="font-bold text-slate-800 text-sm mb-12">Estado de la Red</h3>
        
        <div className="relative flex items-center justify-between px-6 max-w-4xl mx-auto">
          <div className="absolute top-[26px] left-12 right-12 h-1.5 bg-slate-200 -z-0 flex rounded-full overflow-hidden">
            <div className="w-[25%] h-full bg-[#046a53]" />
            <div className="w-[25%] h-full bg-gradient-to-r from-[#046a53] to-amber-500" />
            <div className="w-[25%] h-full bg-red-600" />
            <div className="w-[25%] h-full bg-slate-200" />
          </div>

          {mockBasureros.map((nodo) => {
            const isSelected = nodo.id === selectedId;
            return (
              <div key={nodo.id} className="flex flex-col items-center z-10">
                <button
                  onClick={() => setSelectedId(nodo.id)}
                  className={`w-14 h-14 rounded-full border-3 flex items-center justify-center transition-all cursor-pointer ${getEstilosNodo(nodo.estado, isSelected)}`}
                >
                  {nodo.estado === "lleno" ? <AlertTriangle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                </button>
                
                <span className="text-xs font-bold text-slate-900 mt-3">{nodo.codigo}</span>
                <span className={`text-[11px] font-semibold mt-0.5 ${
                  nodo.estado === "disponible" ? "text-[#046a53]" : nodo.estado === "alerta" ? "text-amber-600" : nodo.estado === "lleno" ? "text-red-600 font-bold" : "text-slate-400"
                }`}>
                  {nodo.estado === "lleno" ? `${nodo.nivelActual}% FULL` : nodo.estado === "alerta" ? `${nodo.nivelActual}% Alert` : nodo.estado === "disponible" ? `${nodo.nivelActual}%` : "Empty"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] text-white font-extrabold px-2 py-0.5 rounded ${b.estado === 'lleno' ? 'bg-red-600' : 'bg-amber-500'}`}>
                  {b.estado === 'lleno' ? 'CRÍTICO' : 'ATENCIÓN'}
                </span>
                <h3 className="text-lg font-bold text-slate-900">Contenedor {b.codigo}</h3>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black tracking-tighter ${b.estado === 'lleno' ? 'text-red-600' : 'text-slate-800'}`}>{b.nivelActual}%</span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Capacidad</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6">📍 {b.nombre}</p>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${b.estado === 'lleno' ? 'bg-red-600' : 'bg-[#046a53]'}`} 
                style={{ width: `${b.nivelActual}%` }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <Battery className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">Batería</p>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{b.bateria}%</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <Wifi className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">Estado Red</p>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-500 mb-2">Materiales Aceptados:</h5>
            <div className="flex gap-2">
              {["Papel", "Cartón", "Plástico"].map((m) => (
                <span key={m} className="bg-slate-100 text-slate-600 font-medium text-xs px-3 py-1 rounded-full">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 mb-3">⏱️ Última Actividad</h4>
            <div className="bg-slate-50 border-l-4 border-[#046a53] p-3 rounded-r-xl">
              <p className="text-xs font-semibold text-slate-800">
                "{b.ultimoEvento?.usuario || "Ana"} depositó plástico"
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Hace 2 horas</span>
            </div>
          </div>

          <div className="bg-[#046a53] text-white p-5 rounded-2xl shadow-xs flex flex-col items-center justify-between text-center flex-1">
            <div className="py-2">
              <Truck className="w-6 h-6 mb-2 mx-auto" />
              <h4 className="text-xs font-bold tracking-wide">Solicitar Recolección</h4>
              <p className="text-[11px] text-emerald-100/80 mt-1 max-w-[180px]">
                El contenedor {b.codigo} requiere atención inmediata.
              </p>
            </div>
            <button className="w-full bg-white hover:bg-slate-50 text-[#046a53] font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer mt-4">
              Despachar Unidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
