import type { ReactNode } from "react"
import clsx from "clsx"

interface CardBaseProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function CardBase({ children, className, onClick }: CardBaseProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className="rounded-t-xl object-cover h-40 w-full"
      />
    </div>
  )
}

export function CardBadge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute top-3 right-3 text-xs text-slate-700 font-bold bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-sm">
      {children}
    </span>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("p-4", className)}>{children}</div>
}

export function CardButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#046a53] text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[#046a53]/90 transition-colors"
    >
      {children}
    </button>
  )
}
