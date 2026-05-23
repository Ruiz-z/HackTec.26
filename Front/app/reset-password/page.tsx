"use client";
import { useState, Suspense } from "react";
import { Lock, Eye, Gamepad2, CircleCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token inválido");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer");
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <TriangleAlert className="w-12 h-12 text-red-500" />
        </div>
        <p className="text-sm font-medium text-red-600">Enlace inválido o expirado.</p>
        <Link href="/forgot-password" className="inline-block text-[11px] font-bold text-[#14b8a6] hover:underline">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CircleCheck className="w-12 h-12 text-[#14b8a6]" />
        </div>
        <p className="text-sm font-medium text-slate-700">Contraseña restablecida correctamente.</p>
        <Link href="/login" className="inline-block text-[11px] font-bold text-[#14b8a6] hover:underline mt-2">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-bold text-slate-700 font-mono tracking-wide mb-1.5">
          Nueva contraseña
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mín. 6 caracteres"
            required
            minLength={6}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono placeholder-slate-300 text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || password.length < 6}
          className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer uppercase"
        >
          <span>{loading ? "Guardando..." : "Restablecer contraseña"}</span>
          <span className="text-[10px]">➔</span>
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 w-full max-w-md rounded-2xl p-8 shadow-sm flex flex-col relative">
        <Link href="/login" className="absolute top-5 left-6 text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="w-12 h-12 bg-[#046a53] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white mb-3">
            <Gamepad2 className="w-5 h-5 fill-white text-[#046a53]" />
          </div>
          <h1 className="text-2xl font-black text-[#046a53] tracking-tight">Nueva contraseña</h1>
          <p className="text-[11px] font-mono text-slate-400 font-bold mt-1 tracking-wide uppercase">
            Elige una contraseña segura
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-slate-400">Cargando...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
