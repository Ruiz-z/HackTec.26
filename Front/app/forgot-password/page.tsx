"use client";
import { useState } from "react";
import { Mail, Gamepad2, ChevronLeft, CircleCheck } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setSent(true);
    } catch {
      setError("Error al enviar el correo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 w-full max-w-md rounded-2xl p-8 shadow-sm flex flex-col relative">
        <Link href="/login" className="absolute top-5 left-6 text-slate-400 hover:text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="w-12 h-12 bg-[#046a53] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white mb-3">
            <Gamepad2 className="w-5 h-5 fill-white text-[#046a53]" />
          </div>
          <h1 className="text-2xl font-black text-[#046a53] tracking-tight">Recuperar contraseña</h1>
          <p className="text-[11px] font-mono text-slate-400 font-bold mt-1 tracking-wide uppercase">
            Te enviaremos un enlace mágico
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CircleCheck className="w-12 h-12 text-[#14b8a6]" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Si el correo <span className="font-bold text-[#046a53]">{email}</span> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Revisa tu bandeja de entrada y spam.</p>
            <Link href="/login" className="inline-block text-[11px] font-bold text-[#14b8a6] hover:underline mt-2">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 font-mono tracking-wide mb-1.5">
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-300 text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer uppercase"
              >
                <span>{loading ? "Enviando..." : "Enviar enlace"}</span>
                <span className="text-[10px]">➔</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
