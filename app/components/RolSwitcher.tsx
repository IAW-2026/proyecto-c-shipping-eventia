"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from '@clerk/nextjs';

export default function RolSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];
  const rolesAdmin =  (user?.publicMetadata?.rolesAdmin as string[]) || [];

  const isSellerMode = pathname.startsWith("/seller") || pathname.includes("/seller");
  const isAdminMode = pathname.startsWith("/admin") || pathname.includes("/admin");

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
    setIsOpen(false);
    router.push(route);
  };

  if (!isLoaded) {
    return <div className="w-40 h-9 bg-surface-container-high/60 animate-pulse rounded-full border border-primary/10" />;
  }

  // Retorna únicamente el string limpio para insertarlo simétricamente
  const getActiveModeText = () => {
    if (isAdminMode) return "Admin";
    if (isSellerMode) return "Vendedor";
    return "Comprador";
  };

  // Define dinámicamente los estilos del "Botón-Chip" según el estado activo
  const getButtonStyles = () => {
    if (isAdminMode) {
      return "bg-primary text-background border-primary hover:opacity-90";
    }
    if (isSellerMode) {
      return "bg-primary-container text-background border-primary-container hover:scale-[1.02]";
    }
    return "bg-secondary-container text-on-secondary-container border-transparent hover:scale-[1.02]";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`inline-flex items-center justify-between w-40 px-4 py-1.5 border text-label-sm font-label font-bold uppercase tracking-wider rounded-full shadow-soft-ambient transition-all duration-300 focus:outline-none cursor-pointer ${getButtonStyles()}`}
      >
        <span>
          {getActiveModeText()}
        </span>
        
        <svg
          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
            isAdminMode || isSellerMode ? "text-background/80" : "text-on-secondary-container/70"
          } ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-surface-container-lowest border border-primary/15 rounded-xl shadow-soft-ambient focus:outline-none overflow-hidden transition-all">
          <div className="py-1.5">
            <p className="px-4 py-1.5 text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-label font-bold">
              Cambio de rol
            </p>
            
            {/* Opción Comprador */}
            <button
              onClick={() => handleModeChange("/buyer")}
              className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors cursor-pointer ${
                !isSellerMode && !isAdminMode
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="font-label uppercase tracking-wider">Comprador</span>
              <span className="text-[10px] opacity-70 font-body font-normal normal-case mt-0.5">Ver mis entradas</span>
            </button>

            {/* Opción Vendedor */}
            <button
              onClick={() => handleModeChange("/seller")}
              className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors cursor-pointer ${
                isSellerMode
                  ? "bg-primary-container text-background font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="font-label uppercase tracking-wider">Vendedor</span>
              <span className="text-[10px] opacity-70 font-body font-normal normal-case mt-0.5">Escanear entradas</span>
            </button>

            {/* Opción Administrador */}
            {rolesAdmin.includes("adminShipping") && (
              <button
                onClick={() => handleModeChange("/admin")}
                className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors cursor-pointer ${
                  isAdminMode
                    ? "bg-primary text-background font-bold"
                    : "text-primary-container hover:bg-primary-container/10"
                }`}
              >
                <span className="font-label uppercase tracking-wider">Administrador</span>
                <span className="text-[10px] opacity-70 font-body font-normal normal-case mt-0.5">Panel central</span>
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}