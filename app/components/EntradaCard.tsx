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
    <div className="card-retro flex flex-col justify-between p-10 bg-gradient-to-br from-secondary-container/20 via-surface-container-high/40 to-transparent">
      
      {/* Contenido Superior */}
      <div className="space-y-5">
        <div className="flex justify-between items-start gap-4">
          {/* Título usando tu color bordeaux principal */}
          <h2 className="text-body-lg font-extrabold text-primary-container leading-snug tracking-tight font-body text-balance">
            {nombre_evento}
          </h2>
          {/* Chip de pedido usando tus capas tonales más oscuras */}
          <span className="text-label-sm font-bold bg-surface-container-highest text-on-surface-variant px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wider">
            #{id_pedido}
          </span>
        </div>

        {/* Detalles con tus iconos y textos semánticos */}
        <div className="space-y-2.5 text-body-md text-on-surface-variant/90 font-body">
          
          {/* Cantidad (Tickets) */}
          <p className="flex items-center gap-2 text-label-sm text-on-surface uppercase tracking-wider font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-primary-container/80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h12a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 15V7.5A1.5 1.5 0 0 1 7.5 6ZM4.5 9h1.5m-1.5 3h1.5m-1.5 3h1.5" />
            </svg>
            Tickets: <span className="text-primary-container font-black text-body-md normal-case ml-0.5">{cantidad}</span>
          </p>

          {/* Fecha */}
          <p className="flex items-center gap-2 text-label-lg font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-on-surface-variant/60">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {fechaFormateada}
          </p>

          {/* Ubicación */}
          <p className="flex items-center gap-2 text-label-lg font-medium text-balance">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-on-surface-variant/60 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
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