"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { MagnifyingGlassIcon, FunnelIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export function BarraFiltrosEntradas() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const paramsRef = useRef(searchParams);
  useEffect(() => {
    paramsRef.current = searchParams;
  }, [searchParams]);

  const [busqueda, setBusqueda] = useState(searchParams.get("buscar") || "");
  const estadoActual = searchParams.get("estado") || "todos";
  const fechaActual = searchParams.get("fecha") || "todos"; // 📅 Nuevo parámetro

  useEffect(() => {
    const inicialEnUrl = paramsRef.current.get("buscar") || "";
    if (busqueda === "" && inicialEnUrl === "") return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(paramsRef.current.toString());
      if (busqueda.trim()) {
        params.set("buscar", busqueda);
      } else {
        params.delete("buscar");
      }
      params.delete("pagina");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, pathname, router]);

  const handleCambioFiltro = (clave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor && valor !== "todos") {
      params.set(clave, valor);
    } else {
      params.delete(clave);
    }
    params.delete("pagina");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center w-full">
      {/* Input de Búsqueda */}
      <div className="relative w-full md:col-span-6">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-on-surface-variant/40">
          <MagnifyingGlassIcon className={`w-4 h-4 stroke-[2.5] ${isPending ? "animate-pulse text-primary" : ""}`} />
        </div>
        <input
          type="text"
          placeholder="Buscar por ID de pase, evento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low text-body-sm text-black placeholder:text-on-surface-variant/40 rounded-2xl border border-primary/10 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body"
        />
      </div>

      {/* Selector de Estado */}
      <div className="relative w-full md:col-span-3">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-on-surface-variant/40">
          <FunnelIcon className="w-4 h-4 stroke-[2.5]" />
        </div>
        <select
          value={estadoActual}
          onChange={(e) => handleCambioFiltro("estado", e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-surface-container-low text-body-sm text-black rounded-2xl border border-primary/10 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body appearance-none cursor-pointer"
        >
          <option value="todos">Todos los estados</option>
          <option value="confirmado">Confirmados</option>
          <option value="usado">Usados</option>
          <option value="expirado">Expirados</option>
          <option value="pendiente">Pendientes</option>
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40 text-xs">▼</div>
      </div>

      {/* 📅 Selector de Fecha */}
      <div className="relative w-full md:col-span-3">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-on-surface-variant/40">
          <CalendarDaysIcon className="w-4 h-4 stroke-[2.5]" />
        </div>
        <select
          value={fechaActual}
          onChange={(e) => handleCambioFiltro("fecha", e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-surface-container-low text-body-sm text-black rounded-2xl border border-primary/10 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body appearance-none cursor-pointer"
        >
          <option value="todos">Cualquier fecha</option>
          <option value="proximos">Próximos eventos</option>
          <option value="pasados">Eventos pasados</option>
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40 text-xs">▼</div>
      </div>
    </div>
  );
}