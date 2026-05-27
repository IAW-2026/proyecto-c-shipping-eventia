import React from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { StringDecoder } from 'node:string_decoder';

interface EntradaDetalleProps {
  entrada: {
    id_entrada: bigint | string;
    id_pedido: number;
    nombre_evento: string;
    cantidad: number;
    estado: string;
  };
}

export const EntradaDetalle = ({ entrada }: EntradaDetalleProps) => {
 const estaConfirmada = entrada.estado === 'Confirmado';

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {/* Botón para volver atrás */}
      <Link 
        href="/buyer" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 font-medium transition-colors"
      >
        ← Volver a mis entradas
      </Link>

      {/* DISEÑO ESTILO TICKET FÍSICO */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Cabecera del Ticket */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 text-center">
          <span className="text-xs uppercase tracking-widest bg-indigo-500/50 px-2.5 py-1 rounded-full font-semibold">
            Entrada Digital
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">
            {entrada.nombre_evento}
          </h1>
          <p className="text-xs text-indigo-200 mt-1 font-mono">
            Pedido #{entrada.id_pedido}
          </p>
        </div>

        {/* Cuerpo del Ticket: Control condicional del QR */}
        <div className="p-8 flex flex-col items-center justify-center bg-white border-b-2 border-dashed border-gray-200 relative min-h-[280px]">
          {/* Bolitas de diseño de ticket cortado */}
          <div className="absolute -left-3 top-full -translate-y-1/2 w-6 h-6 bg-slate-50 border-r border-gray-100 rounded-full" />
          <div className="absolute -right-3 top-full -translate-y-1/2 w-6 h-6 bg-slate-50 border-l border-gray-100 rounded-full" />

          {estaConfirmada ? (
            <>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-inner mb-4">
                <QRCodeSVG 
                  value={String(entrada.id_entrada)}
                  size={220}
                  level="H"
                />
              </div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider select-all">
                ID: {entrada.id_entrada}
              </p>
            </>
          ) : ( //Entrada no confirmada.
            <div className="flex flex-col items-center justify-center p-6 text-center bg-amber-50/60 rounded-2xl border border-amber-100 max-w-xs w-full py-10">
              <span className="text-4xl mb-3">⏳</span>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Código QR no disponible
              </h3>
              <p className="text-xs text-amber-700 mt-2 px-2">
                Tu entrada se encuentra en estado <span className="font-semibold">"{entrada.estado}"</span>. El código de acceso se habilitará una vez que el pago sea procesado y aceptado.
              </p>
            </div>
          )}
        </div>

        {/* Detalles adicionales abajo del corte de ticket */}
        <div className="bg-gray-50 p-6 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Cantidad de accesos:</span>
            <span className="font-semibold text-gray-900">{entrada.cantidad} u.</span>
          </div>
          <div className="flex justify-between">
            <span>Estado del pase:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
              estaConfirmada ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {entrada.estado}
            </span>
          </div>
          
          <div className="pt-4 text-center text-xs text-gray-400 border-t border-gray-200/60">
            {estaConfirmada 
              ? "Presentá este código QR desde tu celular al ingresar al establecimiento."
              : "Si ya realizaste el pago y el estado no cambia, por favor contactá al soporte técnico de la firma contable."}
          </div>
        </div>

      </div>
    </div>
  );
};