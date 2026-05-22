"use client"

import { CardBase, CardBody, CardImage, CardBadge, CardButton } from "@/components/CardBase"
import { Gift } from "lucide-react"

const puntos = [
  {
    id: "B1",
    nombre: "Punto Limpio Centro",
    imagen: "/placeholder-bot.jpg",
    xpRequerida: 500,
    direccion: "Av. Principal 123",
  },
  {
    id: "B2",
    nombre: "Recicla Park",
    imagen: "/placeholder-bot.jpg",
    xpRequerida: 1200,
    direccion: "Calle Secundaria 456",
  },
  {
    id: "B3",
    nombre: "EcoStation Norte",
    imagen: "/placeholder-bot.jpg",
    xpRequerida: 800,
    direccion: "Av. del Reciclaje 789",
  },
]

export function MapaBasureros() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puntos.map((punto) => (
        <CardBase key={punto.id}>
          <CardImage src={punto.imagen} alt={punto.nombre} />
          <div className="relative">
            <CardBadge>{punto.xpRequerida} XP</CardBadge>
          </div>
          <CardBody>
            <h3 className="font-semibold text-slate-900 mb-1">{punto.nombre}</h3>
            <p className="text-sm text-slate-500 mb-4">{punto.direccion}</p>
            <CardButton>
              <Gift className="w-4 h-4" />
              Canjear Cupón
            </CardButton>
          </CardBody>
        </CardBase>
      ))}
    </div>
  )
}
