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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Encabezado */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-slate-800">{titulo}</h2>
          <p className="text-xs text-slate-400">{subtitulo}</p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
          Página {paginaActual} de {paginasTotales}
        </span>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              {!ocultarIdEntrada && <th className="py-4 px-6">ID Entrada</th>}
              <th className="py-4 px-6">Pedido</th>
              <th className="py-4 px-6">Evento</th>
              <th className="py-4 px-6 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {entradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                  No se encontraron entradas registradas que cumplan con este criterio.
                </td>
              </tr>
            ) : (
              entradas.map((ticket) => (
                <tr key={ticket.id_entrada} className="hover:bg-slate-50/80 transition-colors">
                  {!ocultarIdEntrada && (
                    <td className="py-4 px-6 font-mono font-medium text-xs text-slate-900">
                      #{ticket.id_entrada}
                    </td>
                  )}
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {ticket.id_pedido?.toString() || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {ticket.id_evento?.toString() || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      ticket.estado === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      ticket.estado === 'Usado' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        ticket.estado === 'Confirmado' ? 'bg-emerald-500' :
                        ticket.estado === 'Usado' ? 'bg-amber-500' : 'bg-rose-500'
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
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between sm:flex-row flex-col gap-3">
        <p className="text-xs text-slate-500 font-medium">
          Mostrando {entradas.length} resultados en esta página.
        </p>
        
        <div className="inline-flex space-x-2">
          {paginaActual > 1 ? (
            <Link
              href={armarLinkPagina(paginaActual - 1)}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              ← Anterior
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed opacity-60">
              ← Anterior
            </button>
          )}

          <div className="px-3.5 py-2 bg-slate-200/60 rounded-xl text-xs font-black text-slate-700 flex items-center justify-center">
            {paginaActual}
          </div>

          {paginaActual < paginasTotales ? (
            <Link
              href={armarLinkPagina(paginaActual + 1)}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              Siguiente →
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed opacity-60">
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}