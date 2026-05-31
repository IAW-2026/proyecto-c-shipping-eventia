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
    return <div className="w-44 h-9 bg-surface-container-high/60 animate-pulse rounded-xl border border-primary/10" />;
  }

  const renderActiveModeLabel = () => {
    if (isAdminMode) return <>Admin</>;
    if (isSellerMode) return <>Vendedor</>;
    return <>Comprador</>;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* BOTÓN PRINCIPAL (Tonalidades adaptadas al tema orgánico) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`inline-flex items-center justify-between w-44 px-4 py-2 font-label text-label-sm rounded-xl transition-all border shadow-soft-ambient focus:outline-none ${
          isAdminMode 
            ? "border-primary bg-primary-container text-background hover:bg-primary" 
            : "border-primary/15 bg-surface-container-low text-on-surface hover:bg-surface-container"
        }`}
      >
        <span className="flex items-center gap-2 uppercase tracking-wider">
          {renderActiveModeLabel()}
        </span>
        
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isAdminMode ? "text-background/70" : "text-primary/50"
          } ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* MENÚ DESPLEGABLE (Contenedores Retro Tonal) */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-surface-container-lowest border border-primary/15 rounded-xl shadow-soft-ambient focus:outline-none overflow-hidden transition-all">
          <div className="py-1.5">
            <p className="px-4 py-1.5 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest font-label">
              Cambio de rol
            </p>
            
            {/* Opción Comprador */}
            <button
              onClick={() => handleModeChange("/buyer")}
              className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors ${
                !isSellerMode && !isAdminMode
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span>Comprador</span>
              <span className="text-[10px] opacity-70 font-normal normal-case">Ver mis entradas</span>
            </button>

            {/* Opción Vendedor */}
            <button
              onClick={() => handleModeChange("/seller")}
              className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors ${
                isSellerMode
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span>Vendedor</span>
              <span className="text-[10px] opacity-70 font-normal normal-case">Escanear entradas</span>
            </button>

            {/* Opción Administrador */}
            {roles.includes("adminShipping") && (
              <button
                onClick={() => handleModeChange("/admin")}
                className={`w-full text-left px-4 py-2 text-label-sm flex flex-col transition-colors ${
                  isAdminMode
                    ? "bg-primary text-background font-bold"
                    : "text-primary-container hover:bg-primary-container/10"
                }`}
              >
                <span>Administrador</span>
                <span className="text-[10px] opacity-70 font-normal normal-case">Panel central</span>
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}