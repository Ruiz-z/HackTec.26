import { HeaderVista } from "@/components/HeaderVista"

export default function RetosPage() {
  return (
    <div>
      <HeaderVista
        titulo="Retos"
        subtitulo="Desafíos activos para ganar más XP"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Recicla 5 botellas</h3>
          <p className="text-sm text-slate-500 mb-4">+250 XP</p>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-[#046a53] h-2 rounded-full w-3/5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Visita 3 puntos limpios</h3>
          <p className="text-sm text-slate-500 mb-4">+500 XP</p>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-[#046a53] h-2 rounded-full w-1/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
