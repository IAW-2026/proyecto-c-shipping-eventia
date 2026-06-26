import Link from "next/link";
import { TicketIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface EntradaProps {
  id_pedido: number | string;
  id_evento: number;
  cantidad: number;
  nombre_evento: string
  ubicacion: string;
  fecha_evento: string;
}

export const EntradaCard = ({nombre_evento, cantidad, ubicacion, fecha_evento, id_pedido }: EntradaProps) => {
  const fechaFormateada = new Date(fecha_evento).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="card-retro flex flex-col justify-between p-10 bg-gradient-to-br from-secondary-container/20 via-surface-container-high/40 to-transparent">
      
      {/* Contenido Superior */}
      <div className="space-y-5">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-body-lg font-extrabold text-primary-container leading-snug tracking-tight font-body text-balance">
            {nombre_evento}
          </h2>
          <span className="text-label-sm font-bold bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wider">
            #{id_pedido}
          </span>
        </div>

        <div className="space-y-2.5 text-body-md text-on-surface-variant/90 font-body">
          
          {/* Cantidad (Tickets) */}
          <p className="flex items-center gap-2 text-label-sm text-on-surface uppercase tracking-wider font-bold">
            <TicketIcon className="w-4 h-4 text-primary-container/80 stroke-[2.5]" />
            Tickets: <span className="text-primary-container font-black text-body-md normal-case ml-0.5">{cantidad}</span>
          </p>

          {/* Fecha */}
          <p className="flex items-center gap-2 text-label-lg font-medium">
            <CalendarDaysIcon className="w-4 h-4 text-on-surface-variant/60 stroke-[2]" />
            {fechaFormateada}
          </p>

          {/* Ubicación */}
          <p className="flex items-center gap-2 text-label-lg font-medium text-balance">
            <MapPinIcon className="w-4 h-4 text-on-surface-variant/60 shrink-0 stroke-[2]" />
            {ubicacion}
          </p> 
        </div>
      </div>

      {/* Acción Inferior: Ahora es un botón integrado al sistema con fondo rosa */}
      <div className="mt-6 pt-4 border-t border-primary/10">
        <Link 
          href={`/buyer/${id_pedido}`}
          className="btn-retro-secondary w-full inline-flex justify-center items-center text-center font-bold tracking-wide transition-all shadow-sm"
        >
          Ver detalle →
        </Link>
      </div>

    </div>
  );
};