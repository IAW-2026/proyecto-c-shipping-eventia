'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface EntradaIndividual {
  id_entrada: bigint | string;
  id_pedido: number;
  id_evento: number;
  estado: string; // 'Confirmado' | 'Usado' | 'Pendiente'
}

interface EntradaDetalleProps {
  id_pedido: string | number;
  entradas: EntradaIndividual[]; 
}

export const EntradaDetalle = ({ id_pedido, entradas }: EntradaDetalleProps) => {
  const [indexActual, setIndexActual] = useState(0);

  const entradaActual = entradas[indexActual] || entradas[0];
  const totalEntradas = entradas.length;

  const estaConfirmada = entradaActual.estado === 'Confirmado';
  const estaUsada = entradaActual.estado === 'Usado';
  const estaPendiente = entradaActual.estado === 'Pendiente';

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
          <p className="text-xs text-indigo-200 mt-1 font-mono">
            Pedido #{id_pedido}
          </p>

          {/* SELECTOR DEL CARRUSEL (Solo se renderiza si hay más de 1 ticket) */}
          {totalEntradas > 1 && (
            <div className="mt-4 flex items-center justify-between bg-black/20 p-1.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setIndexActual(prev => Math.max(0, prev - 1))}
                disabled={indexActual === 0}
                className="px-2.5 py-1 bg-white text-indigo-700 rounded-lg text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                ◀
              </button>
              
              <span className="text-xs font-semibold text-indigo-100">
                Pase {indexActual + 1} de {totalEntradas}
              </span>

              <button
                type="button"
                onClick={() => setIndexActual(prev => Math.min(totalEntradas - 1, prev + 1))}
                disabled={indexActual === totalEntradas - 1}
                className="px-2.5 py-1 bg-white text-indigo-700 rounded-lg text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Cuerpo del Ticket: Control condicional del QR */}
        <div className="p-8 flex flex-col items-center justify-center bg-white border-b-2 border-dashed border-gray-200 relative min-h-[280px]">
          {/* Bolitas de diseño de ticket cortado */}
          <div className="absolute -left-3 top-full -translate-y-1/2 w-6 h-6 bg-slate-50 border-r border-gray-100 rounded-full" />
          <div className="absolute -right-3 top-full -translate-y-1/2 w-6 h-6 bg-slate-50 border-l border-gray-100 rounded-full" />

          {/* CASO 1: ENTRADA YA UTILIZADA */}
          {estaUsada ? (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-2xl border border-gray-200 max-w-xs w-full py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-100/40 backdrop-blur-[1px] flex items-center justify-center z-20">
                <span className="text-red-500 font-black tracking-widest uppercase border-4 border-red-500 px-4 py-2 rounded-xl text-2xl rotate-12 opacity-80 shadow-md bg-white">
                  UTILIZADO
                </span>
              </div>
              <div className="opacity-10 blur-[1px]">
                <QRCodeSVG value={String(entradaActual.id_entrada)} size={160} level="M" />
              </div>
              <p className="text-xs text-gray-500 mt-4 font-medium z-10">
                Este pase ya fue validado en los controles de acceso.
              </p>
            </div>
          ) : estaConfirmada ? (
            /* CASO 2: ENTRADA CONFIRMADA (MUESTRA QR) */
            <>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-inner mb-4">
                <QRCodeSVG 
                  value={String(entradaActual.id_entrada)}
                  size={220}
                  level="H"
                />
              </div>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider select-all">
                ID TICKET: {String(entradaActual.id_entrada)}
              </p>
            </>
          ) : (
            /* CASO 3: ENTRADA PENDIENTE O CANCELADA */
            <div className="flex flex-col items-center justify-center p-6 text-center bg-amber-50/60 rounded-2xl border border-amber-100 max-w-xs w-full py-10">
              <span className="text-4xl mb-3">⏳</span>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Código QR no disponible
              </h3>
              <p className="text-xs text-amber-700 mt-2 px-2">
                Tu entrada se encuentra en estado <span className="font-semibold">"{entradaActual.estado}"</span>. El código de acceso se habilitará una vez que el pago sea procesado.
              </p>
            </div>
          )}
        </div>

        {/* Detalles adicionales abajo del corte de ticket */}
        <div className="bg-gray-50 p-6 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Ubicación en este pedido:</span>
            <span className="font-semibold text-gray-900">Pase {indexActual + 1} de {totalEntradas}</span>
          </div>
          <div className="flex justify-between">
            <span>Estado del pase:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-xs uppercase tracking-wider ${
              estaConfirmada ? 'bg-green-100 text-green-700' : 
              estaUsada ? 'bg-gray-200 text-gray-700 line-through' : 'bg-blue-100 text-blue-700'
            }`}>
              {entradaActual.estado}
            </span>
          </div>
          
          <div className="pt-4 text-center text-xs text-gray-400 border-t border-gray-200/60">
            {estaConfirmada && "Presentá este código QR desde tu celular al ingresar al establecimiento."}
            {estaUsada && "Entrada inválida para reingresos sin autorización del staff."}
            {estaPendiente && "Si ya realizaste el pago y el estado no cambia, por favor contactá al soporte técnico."}
          </div>
        </div>

      </div>
    </div>
  );
};