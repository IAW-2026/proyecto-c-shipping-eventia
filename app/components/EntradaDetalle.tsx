'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import dynamic from 'next/dynamic';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false });

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
  const estaExpirada = entradaActual.estado === 'Expirado';

  return (
    <div className="max-w-md mx-auto py-8 px-4 font-body">
      <div className="mb-5 text-left">
        <Link 
          href="/buyer" 
          className="inline-flex items-center text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant/70 hover:text-black transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1 stroke-[2.5]" />
          Volver a mis entradas
        </Link>
      </div>

      <div className="card-retro bg-surface-container-lowest overflow-hidden shadow-soft-ambient">
        
        <div className="bg-primary/10 border-b border-primary/10 p-5 text-center relative">
          <span className="text-[10px] uppercase tracking-widest bg-primary text-background px-3 py-1 rounded-full font-bold">
            Entrada Digital
          </span>
          <p className="text-xs text-primary font-mono font-bold mt-2.5">
            Pedido #{id_pedido}
          </p>

          {/* SELECTOR DEL CARRUSEL */}
          {totalEntradas > 1 && (
            <div className="mt-4 flex items-center justify-between bg-surface-container-low p-1 rounded-xl border border-primary/10 max-w-[280px] mx-auto">
              <button
                type="button"
                onClick={() => setIndexActual(prev => Math.max(0, prev - 1))}
                disabled={indexActual === 0}
                className="p-1.5 bg-surface-container-lowest hover:bg-surface-container text-black rounded-lg border border-primary/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Pase {indexActual + 1} de {totalEntradas}
              </span>

              <button
                type="button"
                onClick={() => setIndexActual(prev => Math.min(totalEntradas - 1, prev + 1))}
                disabled={indexActual === totalEntradas - 1}
                className="p-1.5 bg-surface-container-lowest hover:bg-surface-container text-black rounded-lg border border-primary/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronRightIcon className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col items-center justify-center bg-surface-container-lowest border-b-2 border-dashed border-primary/20 relative min-h-[290px]">
          
          {/* Muescas físicas laterales de corte de boleto */}
          <div className="absolute -left-3.5 top-full -translate-y-1/2 w-7 h-7 bg-background border border-primary/15 rounded-full shadow-inner" />
          <div className="absolute -right-3.5 top-full -translate-y-1/2 w-7 h-7 bg-background border border-primary/15 rounded-full shadow-inner" />

          {/* ENTRADA YA UTILIZADA */}
          {estaUsada ? (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-surface-container-low/40 rounded-2xl border border-primary/5 max-w-xs w-full py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-surface-container-low/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                <span className="text-error font-black tracking-widest uppercase border-4 border-error px-4 py-1.5 rounded-xl text-xl rotate-12 shadow-sm bg-surface-container-lowest select-none">
                  Utilizado
                </span>
              </div>
              <div className="opacity-10 blur-[1px] select-none">
                <QRCodeSVG value={String(entradaActual.id_entrada)} size={160} level="M" />
              </div>
              <p className="text-xs text-on-surface-variant/60 mt-4 font-medium z-10">
                Este pase ya fue validado en los controles de acceso.
              </p>
            </div>
          ) : estaConfirmada ? (
            /* ENTRADA CONFIRMADA (*/
            <>
              <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-primary/10 shadow-inner mb-4 transition-all hover:scale-[1.01]">
                <QRCodeSVG 
                  value={String(entradaActual.id_entrada)}
                  size={200}
                  level="H"
                />
              </div>
              <p className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest select-all bg-surface-container-low px-2 py-0.5 rounded border border-primary/5">
                ID: {String(entradaActual.id_entrada)}
              </p>
            </>
          ) : estaExpirada ? (
            /* ENTRADA EXPIRADA */
            <>
              <div className="flex flex-col items-center justify-center p-6 text-center bg-on-surface-variant/5 rounded-2xl border border-on-surface-variant/10 max-w-xs w-full py-8 grayscale opacity-60">
                <div className="w-10 h-10 bg-on-surface-variant/10 text-on-surface-variant rounded-xl flex items-center justify-center mb-3">
                  <NoSymbolIcon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="opacity-20 blur-[0.5px]">
                  <QRCodeSVG value={String(entradaActual.id_entrada)} size={140} level="M" />
                </div>
              </div>
              <p className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest select-all bg-surface-container-low px-2 py-0.5 rounded border border-primary/5">
                ID: {String(entradaActual.id_entrada)}
              </p>
            </>
          ) : (
            /* ENTRADA PENDIENTE O CANCELADA */
            <div className="flex flex-col items-center justify-center p-6 text-center bg-secondary-container/40 rounded-2xl border border-secondary-container max-w-xs w-full py-8">
              <div className="w-10 h-10 bg-on-secondary-container/10 text-on-secondary-container rounded-xl flex items-center justify-center mb-3">
                <ClockIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-on-secondary-container uppercase tracking-wider">
                Código QR no disponible
              </h3>
              <p className="text-[11px] text-on-secondary-container/80 mt-2 px-2 leading-relaxed">
                Tu entrada se encuentra en estado <span className="font-bold">"{entradaActual.estado}"</span>. El acceso se habilitará automáticamente una vez confirmado el pago.
              </p>
            </div>
          )}
        </div>

        {/* Detalles adicionales abajo del troquelado */}
        <div className="bg-surface-container-low/40 p-5 space-y-3 text-xs text-on-surface-variant border-t border-primary/5">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant/70 font-medium">Ubicación del pase:</span>
            <span className="font-bold text-black uppercase tracking-tight text-[11px]">
              Pase {indexActual + 1} de {totalEntradas}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant/70 font-medium">Estado actual:</span>
            <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
              estaConfirmada 
                ? 'bg-primary/5 text-primary border-primary/20' 
                : estaUsada 
                ? 'bg-surface-container-low text-on-surface-variant/40 line-through border-primary/10' 
                : estaExpirada
                ? 'bg-on-surface-variant/10 text-on-surface-variant/60 border-on-surface-variant/20'
                : 'bg-secondary-container text-on-secondary-container border-secondary-container/60'
            }`}>
              {entradaActual.estado}
            </span>
          </div>
          
          <div className="pt-3 text-center text-[11px] text-on-surface-variant/50 border-t border-primary/10 font-medium leading-normal">
            {estaConfirmada && "Presentá este código QR desde tu celular al ingresar al establecimiento."}
            {estaUsada && "Entrada inválida para reingresos sin autorización del staff."}
            {estaExpirada && "Este pase ha expirado porque la fecha del evento ya pasó."}
            {estaPendiente && "Si ya realizaste el pago y el estado no cambia, por favor contactá al soporte."}
          </div>
        </div>

      </div>
    </div>
  );
}