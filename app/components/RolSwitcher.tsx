"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {useUser} from '@clerk/nextjs'

export default function RolSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  // Detectamos si la URL actual empieza con /seller o /dashboard/seller
  const isSellerMode = pathname.startsWith("/seller") || pathname.includes("/seller");
  const isAdminMode = pathname.startsWith("/admin") || pathname.includes("/admin");

  // Cerramos el dropdown automáticamente si el usuario hace click afuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModeChange = (route: string) => {
    setIsOpen(false); // Cerramos el menú
    router.push(route); // Redirigimos
  };

  // Si Clerk todavía no cargó los metadatos, mostramos un esqueleto sutil para evitar parpadeos
  if (!isLoaded) {
    return <div className="w-44 h-9 bg-slate-100/80 animate-pulse rounded-xl border border-slate-200/40" />;
  }

  // Función auxiliar para renderizar el texto del botón principal dinámicamente
  const renderActiveModeLabel = () => {
    if (isAdminMode) {
      return (
        <>
          <span className="text-violet-600"></span> Admin
        </>
      );
    }
    if (isSellerMode) {
      return (
        <>
          <span className="text-fuchsia-600"></span> Vendedor
        </>
      );
    }
    return (
      <>
        <span className="text-purple-600"></span> Comprador
      </>
    );
  };

  return <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* BOTÓN PRINCIPAL (Muestra el modo activo actual) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`inline-flex items-center justify-between w-44 px-4 py-2 text-xs font-bold rounded-xl transition-all border shadow-sm focus:outline-none ${
          isAdminMode 
            ? "border-violet-300 bg-violet-50/50 text-violet-950 hover:bg-violet-50" 
            : "border-purple-200/60 bg-white text-purple-950 hover:bg-purple-50/50"
        }`}
      >
        <span className="flex items-center gap-2">
          {renderActiveModeLabel()}
        </span>
        
        {/* Flechita dinámica que gira si está abierto */}
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 text-purple-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* MENÚ DESPLEGABLE (Opciones flotantes) */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-950/5 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="py-1.5 bg-white">
            <p className="px-4 py-1.5 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
              Cambio de rol
            </p>
            
            {/* Opción Comprador */}
            <button
              onClick={() => handleModeChange("/buyer")}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                !isSellerMode && !isAdminMode
                  ? "bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700"
                  : "text-slate-600 hover:bg-purple-50/40 hover:text-purple-700"
              }`}
            >
              <span className="text-sm"></span>
              <div className="flex flex-col">
                <span>Comprador</span>
                <span className="text-[10px] text-slate-400 font-normal">Ver mis entradas</span>
              </div>
            </button>

            {/* Opción Vendedor */}
            <button
              onClick={() => handleModeChange("/seller")}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                isSellerMode
                  ? "bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700"
                  : "text-slate-600 hover:bg-purple-50/40 hover:text-purple-700"
              }`}
            >
              <span className="text-sm"></span>
              <div className="flex flex-col">
                <span>Vendedor</span>
                <span className="text-[10px] text-slate-400 font-normal">Escanear entradas</span>
              </div>
            </button>

            {roles.includes("adminShipping") && (
              <>
              <button
              onClick={() => handleModeChange("/admin")}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                isAdminMode
                  ? "bg-gradient-to-r from-violet-100 to-purple-50 text-violet-700"
                  : "text-violet-600 hover:bg-violet-50/50"
              }`}
            >
              <span className="text-sm"></span>
              <div className="flex flex-col">
                <span>Administrador</span>
                <span className="text-[10px] text-slate-400 font-normal">Panel central</span>
              </div>
            </button>
              </>
            )}

          </div>
        </div>
      )}
    </div>;
}