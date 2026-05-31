"use client";

import { useState } from "react";
import { eventos } from "@/data/eventos"; // Conectado a tu data real
import { simularPagoAction, simularPedidoAction } from "../../../actions/simulacion"; // Importamos las Server Actions para simular pedido y pago"

export default function SimuladorPage() {
  // Estados para el formulario de simulación
  const [eventoSeleccionado, setEventoSeleccionado] = useState(eventos[0]?.idEvento || "");
  const [cantidad, setCantidad] = useState(1);
  const [clerkKey, setClerkKey] = useState("");

  // ID del pedido como string editable de forma libre
  const [pedidoId, setPedidoId] = useState("");
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [loadingPago, setLoadingPago] = useState(false);
  const [consolaLog, setConsolaLog] = useState<string[]>([]);

  // Función para agregar mensajes a nuestra "consola virtual" en pantalla
  const registrarLog = (mensaje: string) => {
    setConsolaLog((prev) => [`[${new Date().toLocaleTimeString()}] ${mensaje}`, ...prev]);
  };

  // 1️⃣ PASO 1: Simular pedido enviando datos a la Server Action
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

  // 💳 PASO 2: Simular aviso de la App Payments (Confirmar Pago)
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Simulación de POST de APIS externas</h1>
        <p className="text-xs text-slate-500 mt-1">
          Probá el comportamiento de los endpoints de Eventia Shipping
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL DE CONTROL / FORMULARIO */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Parámetros del Pedido</h3>

          {/* Selector de Eventos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Seleccionar Evento</label>
            <select
              value={eventoSeleccionado}
              onChange={(e) => setEventoSeleccionado(e.target.value)}
              className="w-full bg-white text-sm font-semibold text-slate-900 p-2 border border-slate-300 rounded-lg"
            >
              {eventos.map((evt) => (
                <option key={evt.idEvento} value={evt.idEvento}>
                  {evt.nombre} — ${evt.precio}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cantidad</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white text-sm text-slate-900 p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Clerk Key</label>
              <input
                type="password"
                value={clerkKey}
                onChange={(e) => setClerkKey(e.target.value)}
                placeholder="Ingresa tu clave"
                className="w-full bg-white text-sm text-slate-900 p-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Input ID Pedido Manual */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ID del Pedido para Confirmar Pago (Manual o Autocompletado)
            </label>
            <input
              type="text"
              placeholder="Ej: 1716900000 o escribe un ID previo"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              className="w-full bg-white text-sm font-mono text-slate-900 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <hr className="border-slate-100 my-4" />

          {/* ACCIONES / BOTONES DEL FLUJO */}
          <div className="space-y-3">
            <button
              onClick={handleSimularPedido}
              disabled={loadingPedido}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold py-3 rounded-xl hover:opacity-95 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loadingPedido ? "Procesando..." : "1️⃣ Simular Pedido (App Seller -> Tu API)"}
            </button>

            <button
              onClick={handleSimularPago}
              disabled={loadingPago}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold py-3 rounded-xl hover:opacity-95 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loadingPago ? "Confirmando..." : "2️⃣ Simular Pago (Payments -> Tu API)"}
            </button>
          </div>
        </div>

        {/* CONSOLA DE EVENTOS LOG */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[30vh] md:min-h-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Terminal de Salida</h3>
            <button
              onClick={() => { setConsolaLog([]); setPedidoId(""); }}
              className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 rounded-md text-slate-400 hover:text-white"
            >
              Limpiar Todo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-2 max-h-[320px] md:max-h-none">
            {consolaLog.length === 0 ? (
              <p className="text-slate-600 italic">Esperando acciones para registrar eventos de red...</p>
            ) : (
              consolaLog.map((log, index) => (
                <p key={index} className="leading-relaxed border-l-2 border-slate-800 pl-2 whitespace-pre-wrap">{log}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}