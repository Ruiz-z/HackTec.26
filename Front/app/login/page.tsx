"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, Gamepad2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("mauro@eco.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) router.push("/home");
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f8fafc] z-50 flex items-center justify-center p-4">
      
      <div className="bg-white border border-slate-200/80 w-full max-w-md rounded-2xl p-8 shadow-sm flex flex-col relative">
        
        <div className="absolute top-5 right-6 text-[10px] font-mono font-bold text-slate-400 flex gap-1">
          <span className="text-[#046a53] cursor-pointer">ES</span>
          <span>/</span>
          <span className="hover:text-slate-700 cursor-pointer">EN</span>
        </div>

        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="w-12 h-12 bg-[#046a53] text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white mb-3">
            <Gamepad2 className="w-5 h-5 fill-white text-[#046a53]" />
          </div>
          <h1 className="text-3xl font-black text-[#046a53] tracking-tight">EcoArcade</h1>
          <p className="text-[11px] font-mono text-slate-400 font-bold mt-1 tracking-wide uppercase">
            Insert Coin to Save the Planet
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-700 font-mono tracking-wide mb-1.5">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player1@ecoarcade.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-300 text-slate-800 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 font-mono tracking-wide mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type={showPass ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="text-right">
            <Link href="/forgot-password" className="text-[10px] font-mono font-bold text-[#046a53] hover:underline">
              Recuperar contraseña
            </Link>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer uppercase"
            >
              <span>{loading ? "Ingresando..." : "Iniciar Sesión"}</span>
              <span className="text-[10px]">➔</span>
            </button>
          </div>

        </form>

        <div className="text-center mt-8 border-t border-slate-100 pt-6 space-y-1">
          <p className="text-[10px] font-medium text-slate-500">¿Nuevo en EcoArcade?</p>
          <a href="#" className="text-[10px] font-mono font-bold text-[#046a53] hover:underline block">
            Crear una cuenta rápida
          </a>
        </div>

      </div>

    </div>
  );
}
