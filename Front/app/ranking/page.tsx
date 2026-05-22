import { HeaderVista } from "@/components/HeaderVista"

export default function RankingPage() {
  return (
    <div>
      <HeaderVista
        titulo="Ranking"
        subtitulo="Los mejores recicladores de la semana"
      />
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <p className="text-slate-500 text-sm">Tabla de clasificación próximamente...</p>
      </div>
    </div>
  )
}
