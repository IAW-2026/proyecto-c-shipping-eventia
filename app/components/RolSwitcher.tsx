"use client";

import { usePathname, useRouter } from "next/navigation";

export default function RolSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Detectamos si la URL actual empieza con /seller
  const isSellerMode = pathname.startsWith("/seller");

  return (
    <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
      {/* BOTÓN MODO COMPRADOR */}
      <button
        onClick={() => router.push("/buyer")} // Te manda directo a tus entradas
        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
          !isSellerMode 
            ? "bg-white text-indigo-600 shadow-sm font-semibold" // Activo (Hacemos juego con tu color de Eventia)
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50" // Inactivo
        }`}
      >
        Modo Comprador
      </button>

      {/* BOTÓN MODO VENDEDOR */}
      <button
        onClick={() => router.push("/seller")} // Te manda directo al escáner
        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
          isSellerMode 
            ? "bg-white text-emerald-600 shadow-sm font-semibold" // Activo
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50" // Inactivo
        }`}
      >
        Modo Vendedor
      </button>
    </div>
  );
}