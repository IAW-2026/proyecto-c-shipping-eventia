'use client';

import { useState } from "react";
import EscanerQR from "../EscanerQR"; 
import { validarQrAction } from "@/app/actions/validacion"; 
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ArrowPathIcon} from "@heroicons/react/24/outline";

type EstadoEntrada = 'escanerActivo' | 'cargando' | 'valido' | 'usado' | 'invalido';

export default function UsuarioSeller(usuarioClerk: any) {
  const [estado, setEstado] = useState<EstadoEntrada>('escanerActivo');
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const handleQrScan = async (qrData: string) => {
    setEstado('cargando');
    try {
      const resultado = await validarQrAction(qrData, usuarioClerk);

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
      console.error("ERROR EN FRONTEND:", error);
    }
  };

  const handleReset = () => {
    setEstado('escanerActivo');
    setTicketInfo(null);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-headline-md text-center  tracking-tight">
        Control de Accesos
      </h1>
      {estado === 'escanerActivo' && (
        <EscanerQR onScanSuccess={handleQrScan} />
      )}

      {estado === 'cargando' && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 card-retro bg-surface-container-lowest">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-body-md font-medium text-on-surface-variant">
            Validando entrada...
          </p>
        </div>
      )}

      {estado !== 'escanerActivo' && estado !== 'cargando' && (
        <div className={`card-retro p-8 text-center space-y-6 transition-all ${
          estado === 'valido' ? 'bg-primary/10 border-primary/30' :
          estado === 'usado' ? 'bg-secondary-container/70 border-secondary-container' : 
          'bg-error/10 border-error/30'
        }`}>
          
          <div className="flex flex-col items-center space-y-3">
            {estado === 'valido' && (
              <>
                <div className="w-14 h-14 bg-primary text-background rounded-2xl flex items-center justify-center shadow-soft-ambient border border-primary/10">
                  <CheckCircleIcon className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h2 className="text-headline-sm text-primary font-black tracking-tight uppercase">
                  Acceso Permitido
                </h2>
              </>
            )}
            {estado === 'usado' && (
              <>
                <div className="w-14 h-14 bg-on-secondary-container text-secondary-container rounded-2xl flex items-center justify-center shadow-soft-ambient border border-on-secondary-container/15">
                  <ExclamationTriangleIcon className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h2 className="text-headline-sm text-on-secondary-container font-black tracking-tight uppercase">
                  Entrada Ya Usada
                </h2>
              </>
            )}
            {estado === 'invalido' && (
              <>
                <div className="w-14 h-14 bg-error text-background rounded-2xl flex items-center justify-center shadow-soft-ambient border border-error/10">
                  <XCircleIcon className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h2 className="text-headline-sm text-error font-black tracking-tight uppercase">
                  Entrada Inválida o Cancelada
                </h2>
              </>
            )}
          </div>

          {ticketInfo && (
            <div className="bg-surface-container-lowest/80 border border-primary/10 p-4 rounded-xl inline-block min-w-[260px] text-left space-y-2 shadow-soft-ambient">
              <p className="text-label-sm uppercase text-on-surface-variant/60 font-bold tracking-widest text-center border-b border-primary/10 pb-1.5 mb-2">
                Datos del Ticket
              </p>
              <p className="text-body-sm text-on-surface-variant flex justify-between gap-4">
                <span className="font-bold text-black">Ticket ID:</span> 
                <span className="font-mono text-xs bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                  #{ticketInfo.id_entrada}
                </span>
              </p>
              <p className="text-body-sm text-on-surface-variant flex justify-between gap-4">
                <span className="font-bold text-black">Evento ID:</span> 
                <span className="font-mono text-xs">{ticketInfo.id_evento}</span>
              </p>
              <p className="text-body-sm text-on-surface-variant flex justify-between gap-4">
                <span className="font-bold text-black">Pedido ID:</span> 
                <span className="font-mono text-xs">{ticketInfo.id_pedido}</span>
              </p>
              
              <div className="text-center pt-2 border-t border-primary/5 mt-2">
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  estado === 'valido' ? 'bg-primary/10 text-primary border-primary/20' :
                  estado === 'usado' ? 'bg-secondary-container text-on-secondary-container border-secondary-container/40' :
                  'bg-error/10 text-error border-error/20'
                }`}>
                  {ticketInfo.estado}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="btn-retro-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4 stroke-[2.5]" />
            Escanear Siguiente 
          </button>
        </div>
      )}
    </div>
  );
}