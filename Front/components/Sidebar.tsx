"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Map, Trophy, Star, Gift, ScanLine, ShieldAlert, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Ruta", href: "/ruta", icon: Map },
  { name: "Ranking", href: "/ranking", icon: Trophy },
  { name: "Challenges", href: "/retos", icon: Star },
  { name: "Recompensas", href: "/recompensas", icon: Gift },
  { name: "Escaneo", href: "/escaneo", icon: ScanLine },
  { name: "Admin", href: "/admin", icon: ShieldAlert },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const iniciales = user?.nombre?.substring(0, 2).toUpperCase() || "RH";
  const nivel = user?.nivel || "Reciclador";
  const xp = user?.xp?.toLocaleString() || "0";

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 p-5 flex flex-col justify-between sticky top-0 shrink-0 select-none">
      <div>
        <div className="text-[#046a53] text-xl font-bold tracking-tight px-2 mb-6">
          EcoArcade
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl mb-4">
          <div className="w-9 h-9 bg-[#fcc419] rounded-full flex items-center justify-center text-slate-900 font-bold text-xs tracking-wider shrink-0">
            {iniciales}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.nombre || "RecycleHero_88"}</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{nivel} &middot; {xp} XP</p>
          </div>
        </div>

        <div className="px-1 mb-6">
          <button className="w-full bg-[#046a53] hover:bg-[#035442] text-white font-semibold py-2.5 px-4 rounded-xl text-xs tracking-wide transition-colors shadow-sm">
            New Challenge
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 overflow-hidden"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeMenuBlock" 
                    className="absolute inset-0 bg-[#fcc419] rounded-xl -z-10" 
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                  />
                )}
                
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-slate-950" : "text-slate-600"
                }`} />
                
                <span className={`transition-colors tracking-wide ${
                  isActive ? "text-slate-950 font-extrabold" : "text-slate-500 hover:text-slate-800"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-4 px-1">
        <button className="flex items-center gap-3 w-full px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors rounded-lg">
          <Settings className="w-4 h-4 text-slate-500" />
          Settings
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors rounded-lg"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  );
}
