'use client';

import { useState } from "react";
import EscanerQR from "../EscanerQR"; 
import { validarQrAction } from "@/app/actions/validacion"; 

type EstadoEntrada = 'escanerActivo' | 'cargando' | 'valido' | 'usado' | 'invalido';

export default function UsuarioSeller() {
  const [estado, setEstado] = useState<EstadoEntrada>('escanerActivo');
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const handleQrScan = async (qrData: string) => {
    setEstado('cargando');
    try {
      // ⚡ Llamamos directo a la Server Action de Prisma
      const resultado = await validarQrAction(qrData);

      if (resultado.status === 200 && resultado.entrada) {
        setEstado('valido');
        setTicketInfo(resultado.entrada); // Guarda tu entradaConvertida
      } else if (resultado.status === 409) {
        setEstado('usado');
      } else {
        // Acá maneja tanto el 404 (No encontrada) como el 403 (Cancelada) o fallos de catch
        setEstado('invalido');
      }
    } catch (error) {
      setEstado('invalido');
      console.error("🚨 ERROR EN FRONTEND:", error);
    }
  };

  const handleReset = () => {
    setEstado('escanerActivo');
    setTicketInfo(null);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Control de Accesos - Eventia</h1>

      {estado === 'escanerActivo' && (
        <EscanerQR onScanSuccess={handleQrScan} />
      )}

      {estado === 'cargando' && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-gray-600">Validando entrada...</p>
        </div>
      )}

      {estado !== 'escanerActivo' && estado !== 'cargando' && (
        <div className={`p-8 rounded-2xl text-center space-y-4 shadow-md ${
          estado === 'valido' ? 'bg-green-100 text-green-900' :
          estado === 'usado' ? 'bg-yellow-100 text-yellow-900' : 'bg-red-100 text-red-900'
        }`}>
          <h2 className="text-2xl font-extrabold tracking-wide">
            {estado === 'valido' && '✅ ACCESO PERMITIDO'}
            {estado === 'usado' && '⚠️ ENTRADA YA USADA'}
            {estado === 'invalido' && '❌ ENTRADA INVÁLIDA O CANCELADA'}
          </h2>

          {/* Ajustado para mapear tus datos reales de la BD */}
          {ticketInfo && (
            <div className="bg-white/50 p-4 rounded-xl inline-block min-w-[240px] text-left space-y-1">
              <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider text-center border-b border-gray-300/30 pb-1 mb-2">
                Datos del Ticket
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">Ticket ID:</span> <span className="font-mono">{ticketInfo.id_entrada}</span>
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">Evento ID:</span> {ticketInfo.id_evento}
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-bold">Pedido ID:</span> {ticketInfo.id_pedido}
              </p>
              <div className="text-center pt-2">
                <span className="inline-block px-2.5 py-0.5 bg-green-200 text-green-800 rounded-full text-[10px] font-bold uppercase">
                  {ticketInfo.estado}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors shadow-sm"
          >
            Escanear Siguiente
          </button>
        </div>
      )}
    </div>
  );
}