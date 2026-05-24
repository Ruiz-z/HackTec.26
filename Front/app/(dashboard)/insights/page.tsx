"use client";
import { useState, useEffect } from "react";
import { BarChart3, Droplet, Target, Sparkles, ArrowDownRight, TreePine } from "lucide-react";
import { api } from "@/lib/api";

type StatsData = {
  totalHoy: number; totalGeneral: number; totalUsuarios: number;
  co2Evitado: number; scansPorHora: { hora: number; total: number }[];
  porTipo: { tipo: string; _count: { id: number } }[];
  ranking: any[]; basurerosAlerta: number;
}

const COLORES_TIPO: Record<string, string> = {
  plastico: 'bg-[#046a53]',
  papel: 'bg-slate-400',
  aluminio: 'bg-[#fcc419]',
  error: 'bg-red-300',
}

const NOMBRES_TIPO: Record<string, string> = {
  plastico: 'Plástico',
  papel: 'Papel',
  aluminio: 'Aluminio',
  error: 'Error',
}

export default function InsightsPage() {
  const [filtro, setFiltro] = useState("semanal");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [arboles, setArboles] = useState<{ total: number; porTipo: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(data => setStats(data as StatsData))
      .catch(() => {})
      .finally(() => setLoading(false))

    api.getImpacto()
      .then(data => setArboles({ total: data.arbolesEquivalentes ?? 0, porTipo: data.arbolesPorTipo ?? {} }))
      .catch(() => {})
  }, [])

  const totalItems = stats?.porTipo?.reduce((acc, t) => acc + t._count.id, 0) || 0

  const materiales = (stats?.porTipo || [])
    .filter(t => t.tipo !== 'error')
    .map(t => ({
      nombre: NOMBRES_TIPO[t.tipo] || t.tipo,
      cantidad: `${t._count.id} ítems`,
      porcentaje: totalItems > 0 ? Math.round((t._count.id / totalItems) * 100) : 0,
      color: COLORES_TIPO[t.tipo] || 'bg-slate-300',
    }))

  return (
    <div className="max-w-5xl mx-auto animate-fade-in select-none">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Insights</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Analiza tu progreso ecológico y el desglose de tus depósitos.</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-end sm:self-auto">
          {["semanal", "mensual", "historico"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                filtro === f ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f === "historico" ? "Histórico" : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">Cargando insights...</div>
      ) : !stats ? (
        <div className="text-center py-12 text-sm text-slate-400 font-medium">Error al cargar datos.</div>
      ) : (
      <>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-emerald-50 text-[#046a53] rounded-xl flex items-center justify-center border border-emerald-100/30 shrink-0">
            <ArrowDownRight className="w-5 h-5 text-[#046a53]" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">CO₂ Mitigado</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">-{stats.co2Evitado.toFixed(1)} kg</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">📉 Tendencia a la baja</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/30 shrink-0">
            <Droplet className="w-5 h-5 fill-blue-500 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Escaneos Hoy</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalHoy}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{stats.totalGeneral} total acumulados</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs flex items-center gap-4 h-28">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/30 shrink-0">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Usuarios</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.totalUsuarios}</h3>
            <p className="text-[10px] text-amber-700 font-bold mt-0.5">🎯 Comunidad activa</p>
          </div>
        </div>

      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center border border-green-100/40 shrink-0">
            <TreePine className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Impacto Ambiental</p>
            <h3 className="text-lg font-black text-slate-900">
              {arboles ? arboles.total.toFixed(2) : "—"} árboles salvados
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { tipo: "papel", label: "Papel", emoji: "📄", color: "bg-slate-100 text-slate-700" },
            { tipo: "plastico", label: "Plástico", emoji: "♻️", color: "bg-emerald-50 text-emerald-700" },
            { tipo: "aluminio", label: "Aluminio", emoji: "🥫", color: "bg-amber-50 text-amber-700" },
          ].map(({ tipo, label, emoji, color }) => (
            <div key={tipo} className={`${color} rounded-xl p-3 text-center`}>
              <span className="text-base">{emoji}</span>
              <p className="text-[10px] font-bold uppercase tracking-wide mt-1">{label}</p>
              <p className="text-sm font-black mt-0.5">
                {arboles?.porTipo[tipo]?.toFixed(2) ?? "0.00"}
              </p>
              <p className="text-[9px] font-semibold opacity-60">árboles</p>
            </div>
          ))}
        </div>
      </div>

      {materiales.length > 0 && (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-2xs mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Distribución de Residuos</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Volumen por categoría</span>
        </div>

        <div className="w-full h-5 bg-slate-100 rounded-lg overflow-hidden flex mb-8 border border-slate-200/20 shadow-inner">
          {materiales.map((mat) => (
            <div
              key={mat.nombre}
              className={`h-full transition-all duration-500 ${mat.color}`}
              style={{ width: `${mat.porcentaje}%` }}
              title={`${mat.nombre} ${mat.porcentaje}%`}
            />
          ))}
        </div>

        <div className="space-y-4">
          {materiales.map((mat) => (
            <div key={mat.nombre} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6">
              <div className="flex items-center gap-3 w-40 shrink-0">
                <div className={`w-3 h-3 rounded-full ${mat.color}`} />
                <span className="text-xs font-bold text-slate-800">{mat.nombre}</span>
              </div>
              
              <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                <div className={`h-full rounded-full ${mat.color}`} style={{ width: `${mat.porcentaje}%` }} />
              </div>

              <div className="text-right w-24 shrink-0">
                <span className="text-xs font-mono font-bold text-slate-900">{mat.cantidad}</span>
                <span className="text-[10px] text-slate-400 font-semibold block sm:inline sm:ml-2">({mat.porcentaje}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        <div className="md:col-span-3 bg-emerald-50/60 border border-emerald-100/60 p-5 rounded-2xl flex items-start gap-4">
          <div className="w-9 h-9 bg-[#046a53] rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 fill-white text-[#046a53]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#046a53] flex items-center gap-1.5">Sugerencia del Eco-Asistente</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
              ¡Tu precisión con el plástico aumentó un 5%! <strong className="text-slate-700">Tip de juego:</strong> Recuerda quitar las tapas y vaciar por completo los envases antes de pasarlos por el escáner del contenedor para asegurar la máxima bonificación de XP.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Ficha Técnica</span>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center font-mono text-[11px] text-slate-400 mt-2">
            {stats.totalGeneral} escaneos · {stats.basurerosAlerta} contenedores en alerta
          </div>
        </div>

      </div>

      </>
      )}

    </div>
  );
}
