import Link from "next/link";

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
    // ¡Ahora sí! Un degradé real que va desde un púrpura suave a un fucsia/rosa sutil
    <div className="card-retro flex flex-col justify-between p-5 bg-gradient-to-br from-purple-200/30 via-fuchsia-100/40 to-transparent border-primary/10 hover:border-primary/20">
      
      {/* Contenido Superior */}
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-3">
          <h2 className="text-lg font-extrabold text-primary-container leading-snug tracking-tight font-body text-balance">
            {nombre_evento}
          </h2>
          <span className="text-[11px] font-label font-bold bg-surface-container-highest/80 text-on-surface-variant px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
            #{id_pedido}
          </span>
        </div>

        {/* Detalles en tamaño contenido */}
        <div className="space-y-1.5 text-sm text-on-surface-variant/90 font-body">
          {/* Cantidad */}
          <p className="flex items-center gap-1.5 font-label text-xs text-on-surface uppercase tracking-wider font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-primary/70">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 15V7.5A1.5 1.5 0 0 1 7.5 6ZM4.5 9h1.5m-1.5 3h1.5m-1.5 3h1.5" />
            </svg>
            Tickets: <span className="text-primary-container font-black text-sm normal-case">{cantidad}</span>
          </p>

          {/* Fecha */}
          <p className="flex items-center gap-2 text-xs font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-on-surface-variant/60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {fechaFormateada}
          </p>

          {/* Ubicación */}
          <p className="flex items-center gap-2 text-xs font-medium text-balance">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-on-surface-variant/60 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {ubicacion}
          </p> 
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link 
          href={`/buyer/${id_pedido}`}
          className="text-indigo-600 font-bold hover:underline">
          Ver detalles
        </Link>
      </div>
    </div>
  );
};