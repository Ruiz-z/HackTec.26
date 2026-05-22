import { HeaderVista } from "@/components/HeaderVista"
import { MapaBasureros } from "@/components/ruta/MapaBasureros"

export default function RutaPage() {
  return (
    <div>
      <HeaderVista
        titulo="Mi Ruta"
        subtitulo="Puntos de reciclaje cercanos y recompensas disponibles"
      />
      <MapaBasureros />
    </div>
  )
}
