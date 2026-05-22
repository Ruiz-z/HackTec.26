import { HeaderVista } from "@/components/HeaderVista"

export default function AdminPage() {
  return (
    <div>
      <HeaderVista
        titulo="Panel Admin"
        subtitulo="Gestión del sistema EcoArcade"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500 mb-1">Usuarios activos</p>
          <p className="text-2xl font-bold text-slate-900">1,284</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500 mb-1">Residuos reciclados</p>
          <p className="text-2xl font-bold text-slate-900">3,452 kg</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-500 mb-1">CO₂ evitado</p>
          <p className="text-2xl font-bold text-slate-900">842 kg</p>
        </div>
      </div>
    </div>
  )
}
