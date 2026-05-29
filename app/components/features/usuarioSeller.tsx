'use client'; // <-- ¡Crucial aquí!

import { useState } from "react";
import EscanerQR from "../EscanerQR"; 

type EstadoEntrada = 'escanerActivo' | 'cargando' | 'valido' | 'usado' | 'invalido';

export default function UsuarioSeller() {
  const [estado, setEstado] = useState<EstadoEntrada>('escanerActivo');
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const handleQrScan = async (qrData: string) => {
    setEstado('cargando');
    try {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: qrData }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setEstado('valido');
        setTicketInfo(data.entrada);
      } else if (response.status === 409) {
        setEstado('usado');
      } else {
        setEstado('invalido');
      }
    } catch (error) {
      setEstado('invalido');
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
            {estado === 'invalido' && '❌ ENTRADA INVÁLIDA'}
          </h2>

          {ticketInfo && (
            <div className="bg-white/50 p-4 rounded-xl inline-block min-w-[200px]">
              <p className="text-sm uppercase text-gray-500 font-bold tracking-wider">Asistente</p>
              <p className="text-lg font-bold text-gray-900">{ticketInfo.guestName}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold uppercase">
                {ticketInfo.type}
              </span>
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