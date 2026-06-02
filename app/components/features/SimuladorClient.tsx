"use client";

import { useState } from "react";
import { eventos } from "@/data/eventos"; // Ajustá las rutas relativas con @/ si tenés configurados los alias
import { usuarios } from "@/data/usuarios";  
import { simularPagoAction, simularPedidoAction, cancelarPedidoAction } from "@/app/actions/simulacion"; 
import Link from "next/link";
import { ArrowLeftIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";

interface SimuladorClientProps {
  esAdmin: boolean;
}

export default function SimuladorClient({ esAdmin }: SimuladorClientProps) {

  // Si no es admin, mostramos el cartel de bloqueo inmediatamente
  if (!esAdmin) {
    return (
      <>
        <div className="fixed inset-0 bg-background -z-10 pointer-events-none" />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="card-retro-tonal max-w-md flex flex-col items-center p-8 bg-surface-container-low">
            <div className="bg-primary-container text-background w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-soft-ambient border border-primary/20">
              <ShieldExclamationIcon className="w-9 h-9 stroke-[2]" />
            </div>
            <h1 className="text-headline-md text-primary mb-2 tracking-tight uppercase font-black">
              Acceso Restringido
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
              Este módulo está reservado exclusivamente para el personal de administración central de Eventia.
            </p>
            <Link
              href="/buyer"
              className="btn-retro-primary inline-block w-full sm:w-auto px-6 py-2.5 text-sm text-center font-bold uppercase tracking-wider"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </>
    );
  }

  // --- TODO TU ESTADO Y LÓGICA ORIGINAL QUEDA IGUAL ACÁ ABAJO ---
  const [eventoSeleccionado, setEventoSeleccionado] = useState(eventos[0]?.idEvento?.toString() || "");
  const [cantidad, setCantidad] = useState(1);
  const [clerkKey, setClerkKey] = useState(usuarios[0]?.id || "");
  const [pedidoId, setPedidoId] = useState("");
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [loadingCancelacion, setLoadingCancelacion] = useState(false);
  const [consolaLog, setConsolaLog] = useState<string[]>([]);

  const registrarLog = (mensaje: string) => {
    setConsolaLog((prev) => [`[${new Date().toLocaleTimeString()}] ${mensaje}`, ...prev]);
  };

  const handleSimularPedido = async () => {
    if (!eventoSeleccionado || !clerkKey) {
      registrarLog("Tenes que seleccionar un evento e ingresar la Clerk Key");
      return;
    }
    setLoadingPedido(true);
    registrarLog("Simulando nuevo pedido de Buyer");

    try {
      const resultado = await simularPedidoAction({
        cantidad: Number(cantidad),
        id_evento: Number(eventoSeleccionado),
        id_usuario: clerkKey
      });

      if (resultado.success && resultado.id_pedido) {
        setPedidoId(resultado.id_pedido.toString());
        registrarLog(`Pedido creado con éxito. ID: ${resultado.id_pedido}`);
      } else {
        registrarLog(`Error en API /pedido: ${resultado.error || "Error desconocido"}`);
      }
    } catch (error) {
      registrarLog("Error de red al conectar con la API de pedidos.");
    } finally {
      setLoadingPedido(false);
    }
  };

  const handleSimularPago = async () => {
    if (!pedidoId) {
      registrarLog("Advertencia: Enviando simulación de pago con un ID de pedido vacío.");
    }
    setLoadingPago(true);
    registrarLog(`Simulando pago de pedido ID: "${pedidoId || "VACÍO"}"...`);

    try {
      const resultado = await simularPagoAction({
        id_pedido: Number(pedidoId),
        estado: "Confirmado"
      });

      if (resultado.success) {
        registrarLog("Pago Confirmado exitosamente");
      } else {
        registrarLog(`Error en API /entrada: ${resultado.error || "Error desconocido"}`);
      }
    } catch (error) {
      registrarLog("Error de red al conectar con la API de pagos.");
      console.error(error);
    } finally {
      setLoadingPago(false);
    }
  };

  const handleSimularCancelacion = async () => {
    if (!pedidoId) {
      registrarLog("Error: No hay un ID de pedido para cancelar.");
      return;
    }
    setLoadingCancelacion(true);
    registrarLog(`Simulando cancelación de pedido ID: "${pedidoId}"...`);

    try {
      const resultado = await cancelarPedidoAction({
        id_pedido: Number(pedidoId),
      });

      if (resultado.success) {
        registrarLog("Pedido cancelado exitosamente en Shipping API");
      } else {
        registrarLog(`Error en API /pedidoCancelado: ${resultado.error || "Error desconocido"}`);
      }
    } catch (error) {
      registrarLog("Error de red al conectar con la API de cancelación.");
    } finally {
      setLoadingCancelacion(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-label-sm font-bold text-on-surface-variant/70 hover:text-primary uppercase tracking-wider transition-colors group font-body"
        >
          <ArrowLeftIcon className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-1" />
          Volver al panel
        </Link>
      </div>
      <div>
        <h1 className="text-body-lg font-black tracking-tight text-black uppercase font-body">
          Simulación de POST de APIS externas
        </h1>
        <p className="text-label-sm text-on-surface-variant/60 mt-1 font-body">
          Probá el comportamiento de los endpoints de Eventia Shipping
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 card-retro p-8 bg-gradient-to-br from-surface-container-low via-surface-container-high/30 to-transparent space-y-5">
          <h3 className="text-label-sm font-extrabold uppercase text-primary-container tracking-wider font-body">
            Parámetros del Pedido
          </h3>

          <div className="space-y-1">
            <label className="block text-label-sm font-bold text-on-surface/80 uppercase font-body">
              Seleccionar Evento
            </label>
            <div className="relative">
              <select
                value={eventoSeleccionado}
                onChange={(e) => setEventoSeleccionado(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-surface-container-low text-body-sm text-black rounded-xl border border-primary/15 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body appearance-none cursor-pointer font-semibold"
              >
                {eventos.map((evt) => (
                  <option key={evt.idEvento} value={evt.idEvento}>
                    {evt.nombreEvento} — ${evt.precio}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40 text-xs">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-label-sm font-bold text-on-surface/80 uppercase font-body">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 bg-surface-container-low text-body-sm text-black rounded-xl border border-primary/15 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body font-semibold"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-label-sm font-bold text-on-surface/80 uppercase font-body">
                Usuario (Clerk Key)
              </label>
              <div className="relative">
                <select
                  value={clerkKey}
                  onChange={(e) => setClerkKey(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-surface-container-low text-body-sm text-black rounded-xl border border-primary/15 focus:border-primary/30 focus:outline-none transition-all shadow-inner font-body appearance-none cursor-pointer font-semibold"
                >
                  {usuarios.map((usr) => (
                    <option key={usr.id} value={usr.id}>
                      {usr.nombre}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40 text-xs">▼</div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-label-sm font-bold text-on-surface/80 uppercase font-body text-balance">
              ID del Pedido para Confirmar Pago (Manual o Autocompletado)
            </label>
            <input
              type="text"
              placeholder="Ej: 1716900000 o escribe un ID previo"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low text-body-sm text-black font-mono rounded-xl border border-primary/15 focus:border-primary/30 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="pt-2 border-t border-primary/10 space-y-3">
            <button
              onClick={handleSimularPedido}
              disabled={loadingPedido}
              className="w-full btn-retro-primary inline-flex justify-center items-center text-center font-bold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-40 cursor-pointer hover:scale-[1.01] hover:opacity-90"
            >
              {loadingPedido ? "Procesando..." : "Simular Pedido "}
            </button>

            <button
              onClick={handleSimularPago}
              disabled={loadingPago}
              className="w-full btn-retro-secondary inline-flex justify-center items-center text-center font-bold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-40 cursor-pointer hover:scale-[1.01] hover:opacity-90"
            >
              {loadingPago ? "Confirmando..." : "Simular Pago "}
            </button>

            <button
              onClick={handleSimularCancelacion}
              disabled={loadingCancelacion}
              className="w-full py-3 bg-error/10 text-error border-2 border-error/20 hover:bg-error/20 rounded-xl inline-flex justify-center items-center text-center font-bold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-40 cursor-pointer hover:scale-[1.01] uppercase text-xs"
            >
              {loadingCancelacion ? "Cancelando..." : "Simular Cancelación ✕"}
            </button>
          </div>
        </div>

        {/* CONSOLA */}
        <div className="md:col-span-5 bg-black/95 border-2 border-primary/20 rounded-2xl p-6 flex flex-col min-h-[35vh] md:min-h-auto shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/80 font-mono">
              Terminal de Salida
            </h3>
            <button
              onClick={() => { setConsolaLog([]); setPedidoId(""); }}
              className="text-[10px] bg-surface-container-highest/20 border border-primary/20 px-2.5 py-1 rounded-md text-on-surface-variant/70 hover:text-white hover:border-primary/40 transition-all font-mono uppercase tracking-wider"
            >
              Limpiar Todo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-2 max-h-[340px] md:max-h-none selection:bg-emerald-500/30">
            {consolaLog.length === 0 ? (
              <p className="text-white/20 italic font-body text-xs">Esperando acciones para registrar eventos de red...</p>
            ) : (
              consolaLog.map((log, index) => (
                <p key={index} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2.5 whitespace-pre-wrap drop-shadow-[0_0_3px_rgba(52,211,153,0.2)]">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}