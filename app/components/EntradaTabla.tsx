import Link from "next/link";

export interface TicketData {
  id_entrada: string;
  id_pedido?: string | number | null;
  id_evento?: string | number | null;
  estado: string;
}

interface TablaEntradasProps {
  entradas: TicketData[];
  titulo?: string;
  subtitulo?: string;
  paginaActual: number;
  totalPaginas: number;
  rutaBase: string; 
  ocultarIdEntrada?: boolean;
}

export default function TablaEntradas({
  entradas,
  titulo = "Registro de Entradas",
  subtitulo = "Listado de movimientos en tiempo real",
  paginaActual,
  totalPaginas,
  rutaBase,
  ocultarIdEntrada = false
}: TablaEntradasProps) {
  
  const paginasTotales = Math.max(totalPaginas, 1);
  
  // Función auxiliar para armar los links de paginación de forma limpia sin romper los query strings existentes
  const armarLinkPagina = (nuevaPagina: number) => {
    if (rutaBase.includes('?')) {
      // Si la rutaBase ya trae filtros (ej: /admin?estado=Usado), concatenamos con &
      return `${rutaBase}&page=${nuevaPagina}`;
    }
    // Si está limpia (ej: /admin?), le ponemos el page directo
    return `${rutaBase}page=${nuevaPagina}`;
  };

  return (<div className="card-retro bg-surface-container-lowest overflow-hidden">
      
      {/* Encabezado */}
      <div className="p-5 border-b border-primary/10 flex items-center justify-between bg-surface-container-low/40">
        <div>
          <h2 className="font-bold text-headline-sm text-black uppercase tracking-tight">{titulo}</h2>
          <p className="text-label-sm text-on-surface-variant/60">{subtitulo}</p>
        </div>
        <span className="chip-retro !py-1">
          Página {paginaActual} de {paginasTotales}
        </span>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/60 text-on-surface-variant text-label-sm font-bold uppercase tracking-wider border-b border-primary/10">
              {!ocultarIdEntrada && <th className="py-4 px-6 font-label">ID Entrada</th>}
              <th className="py-4 px-6 font-label">Pedido</th>
              <th className="py-4 px-6 font-label">Evento</th>
              <th className="py-4 px-6 font-label text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5 text-body-sm text-on-surface-variant font-body">
            {entradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-on-surface-variant/50 text-body-sm italic">
                  No se encontraron entradas registradas que cumplan con este criterio.
                </td>
              </tr>
            ) : (
              entradas.map((ticket) => (
                <tr key={ticket.id_entrada} className="hover:bg-surface-container-low/30 transition-colors">
                  {!ocultarIdEntrada && (
                    <td className="py-4 px-6 font-mono font-medium text-xs text-black">
                      #{ticket.id_entrada}
                    </td>
                  )}
                  <td className="py-4 px-6 text-xs text-on-surface-variant/80">
                    {ticket.id_pedido?.toString() || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-xs text-black font-medium">
                    {ticket.id_evento?.toString() || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      ticket.estado === 'Confirmado' 
                        ? 'bg-primary/5 text-primary border-primary/20' 
                        : ticket.estado === 'Usado' 
                        ? 'bg-secondary-container/50 text-on-secondary-container border-secondary-container/60' 
                        : ticket.estado === 'Expirado'
                        ? 'bg-on-surface-variant/10 text-on-surface-variant/70 border-on-surface-variant/20'
                        : 'bg-error/5 text-error border-error/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        ticket.estado === 'Confirmado' ? 'bg-primary' :
                        ticket.estado === 'Usado' ? 'bg-on-secondary-container' : 
                        ticket.estado === 'Expirado' ? 'bg-on-surface-variant/40' : 'bg-error'
                      }`} />
                      {ticket.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="p-4 bg-surface-container-low/40 border-t border-primary/10 flex items-center justify-between sm:flex-row flex-col gap-3">
        <p className="text-label-sm text-on-surface-variant/60">
          Mostrando {entradas.length} resultados en esta página.
        </p>
        
        <div className="inline-flex space-x-2">
          {paginaActual > 1 ? (
            <Link
              href={armarLinkPagina(paginaActual - 1)}
              className="px-4 py-2 bg-surface-container-lowest border border-primary/15 hover:border-primary/30 text-on-surface text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-ambient transition-all active:scale-95"
            >
              ← Anterior
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-surface-container-low/50 border border-primary/5 text-on-surface-variant/30 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-50">
              ← Anterior
            </button>
          )}

          <div className="px-3.5 py-2 bg-primary/10 rounded-xl text-xs font-black text-primary flex items-center justify-center min-w-[32px]">
            {paginaActual}
          </div>

          {paginaActual < paginasTotales ? (
            <Link
              href={armarLinkPagina(paginaActual + 1)}
              className="px-4 py-2 bg-surface-container-lowest border border-primary/15 hover:border-primary/30 text-on-surface text-xs font-bold uppercase tracking-wider rounded-xl shadow-soft-ambient transition-all active:scale-95"
            >
              Siguiente →
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-surface-container-low/50 border border-primary/5 text-on-surface-variant/30 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-50">
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
    );
}