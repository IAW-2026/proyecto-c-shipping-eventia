import { EntradaCard } from './EntradaCard';
import { TicketIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { cache } from 'react';

interface Entrada {
  id_entrada: bigint | string;
  id_pedido: number | string;
  id_evento: number;
  estado: string;
}

interface Evento {
  idEvento: number;
  nombreEvento: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
}


const getEvento = cache(async (id: string) => {
  const sellerUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerKey = process.env.SELLER_API_KEY;

  try {
    const res = await fetch(`${sellerUrl}/api/seller/eventos/${id}`, {
      next: { revalidate: 60 }, // Cacheamos 60 segundos el resultado del evento
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sellerKey ?? ''
      }
    });
    if (!res.ok) return null;
    return (await res.json()) as Evento;
  } catch (error) {
    console.error(`Error al traer evento ID ${id}:`, error);
    return null;
  }
});

interface EntradaListProps {
  tickets: Entrada[];
  buscar: string;
  estado: string;
  fecha: string
  paginaActual: number;
  rutaBase: string;
}

export const EntradaList = async ({ tickets, buscar, estado, fecha, paginaActual, rutaBase }: EntradaListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-primary/20">
        <p className="text-on-surface-variant/60 font-medium font-body">No tienes entradas registradas aún.</p>
      </div>
    );
  }

  const entradasPorPedido = tickets.reduce((grupos, ticket) => {
    const idPedido = ticket.id_pedido.toString();
    if (!grupos[idPedido]) {
      grupos[idPedido] = {
        id_pedido: ticket.id_pedido,
        id_evento: ticket.id_evento,
        entradas: []
      };
    }
    grupos[idPedido].entradas.push({
      id_entrada: ticket.id_entrada.toString(),
      estado: ticket.estado
    });
    return grupos;
  }, {} as Record<string, { id_pedido: number | string; id_evento: number; entradas: { id_entrada: string; estado: string }[] }>);

  const listaPedidos = Object.values(entradasPorPedido);
 
  const idsEventosUnicos = Array.from(new Set(listaPedidos.map(p => p.id_evento.toString())));
  const eventosData = await Promise.all(idsEventosUnicos.map(id => getEvento(id)));
  
  // Mapeamos los resultados para acceso rápido
  const mapaEventos = new Map(
    eventosData
      .filter((e): e is Evento => e !== null)
      .map(e => [e.idEvento, e])
  );

  const pedidosConEvento = await Promise.all(
    listaPedidos.map(async (pedido) => {
      const evento = mapaEventos.get(pedido.id_evento);
      const fechaEventoObj = evento?.fecha ? new Date(evento.fecha) : null;
      return {
        ...pedido,
        nombre_evento: evento?.nombreEvento || "Evento desconocido",
        ubicacion: evento?.ubicacion || "Ubicación no disponible",
        fecha_evento: evento?.fecha || "Fecha no disponible",
        // Guardamos si el evento ya expiró para la lógica posterior
        yaPaso: fechaEventoObj ? fechaEventoObj < ahora : false
      };
    })
  );

  // IDs para actualizar en la DB en un solo paso
  const idsAExpirar: bigint[] = [];

  const pedidosProcesados = pedidosConEvento.map(pedido => {
    if (pedido.yaPaso) {
        pedido.entradas.forEach(entrada => {
          if (entrada.estado === 'Confirmado') {
            entrada.estado = 'Expirado';
            idsAExpirar.push(BigInt(entrada.id_entrada));
          }
        });
    }
    return pedido;
  });

  // Actualización en segundo plano de la base de datos 
  if (idsAExpirar.length > 0) {
    prisma.entrada.updateMany({
      where: { id_entrada: { in: idsAExpirar } },
      data: { estado: 'Expirado' }
    }).catch(err => console.error("Error actualizando expirados:", err));
  }

  const ahora = new Date();
  const pedidosFiltrados = pedidosProcesados.filter(pedido => {
    // Verificamos si al menos un ticket del pedido coincide con el estado buscado
    const coincideEstado = estado === "todos" || pedido.entradas.some(t => t.estado.toLowerCase() === estado.toLowerCase());

    const query = buscar.toLowerCase();
    const coincideBusqueda = buscar === "" || 
      pedido.id_pedido.toString().includes(query) ||
      pedido.nombre_evento.toLowerCase().includes(query) ||
      pedido.ubicacion.toLowerCase().includes(query);
    
      let coincideFecha = true;
    if (pedido.fecha_evento && pedido.fecha_evento !== "Fecha no disponible") {
      const fechaEventoObj = new Date(pedido.fecha_evento);
      
      if (fecha === "proximos") {
        coincideFecha = fechaEventoObj >= ahora; // Eventos hoy o a futuro
      } else if (fecha === "pasados") {
        coincideFecha = fechaEventoObj < ahora;  // Eventos viejos
      }
    }

    return coincideEstado && coincideBusqueda && coincideFecha;
  });

  const pedidosOrdenados = pedidosFiltrados.sort((a, b) => {
    const dateA = new Date(a.fecha_evento).getTime() || 0;
    const dateB = new Date(b.fecha_evento).getTime() || 0;
    return fecha === "pasados" ? dateB - dateA : dateA - dateB; // Si mira el pasado, mostrar los últimos que pasaron primero
  });

  const itemsPorPagina = 6;
  const totalItems = pedidosOrdenados.length;
  const paginasTotales = Math.max(Math.ceil(totalItems / itemsPorPagina), 1);
  const inicioIndex = (paginaActual - 1) * itemsPorPagina;
  const pedidosPaginados = pedidosOrdenados.slice(inicioIndex, inicioIndex + itemsPorPagina);


  const armarLinkPagina = (nuevaPagina: number) => {
    const separador = rutaBase.includes('?') ? (rutaBase.endsWith('?') || rutaBase.endsWith('&') ? '' : '&') : '?';
    return `${rutaBase}${separador}pagina=${nuevaPagina}`;
  };

  

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-body-md text-black font-bold tracking-tight uppercase font-body">
          {estado === 'todos' ? 'Tus órdenes de compra' : `Órdenes en estado: ${estado}`}
        </h2>
        <span className="chip-retro">
          {totalItems} {totalItems === 1 ? 'Pedido encontrado' : 'Pedidos encontrados'}
        </span>
      </div>

    
      {pedidosPaginados.length === 0 ? (
        <div className="card-retro bg-surface-container-lowest p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-surface-container-low text-on-surface-variant/40 rounded-xl flex items-center justify-center border border-primary/10">
            <TicketIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="text-body-sm text-on-surface-variant/60 italic">
            No se encontraron pedidos que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pedidosPaginados.map((pedido) => (
            <EntradaCard 
              key={pedido.id_pedido}
              id_pedido={pedido.id_pedido}
              id_evento={pedido.id_evento}
              nombre_evento={pedido.nombre_evento}
              ubicacion={pedido.ubicacion}
              fecha_evento={pedido.fecha_evento}
              cantidad={pedido.entradas.length}
            />
          ))}
        </div>
      )}

     
      {paginasTotales > 1 && (
        <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-label-sm text-on-surface-variant/60 font-body">
            Página {paginaActual} de {paginasTotales}
          </p>
          
          <div className="flex items-center space-x-2">
            {paginaActual > 1 ? (
              <Link
                href={armarLinkPagina(paginaActual - 1)}
                className="p-2.5 bg-surface-container-lowest border border-primary/15 hover:border-primary/30 text-black rounded-xl shadow-soft-ambient transition-all active:scale-95"
              >
                <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
              </Link>
            ) : (
              <button disabled className="p-2.5 bg-surface-container-low/50 border border-primary/5 text-on-surface-variant/30 rounded-xl cursor-not-allowed opacity-40">
                <ChevronLeftIcon className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            <div className="px-4 py-2 bg-primary/10 rounded-xl text-xs font-black text-primary min-w-[36px] text-center font-mono">
              {paginaActual}
            </div>

            {paginaActual < paginasTotales ? (
              <Link
                href={armarLinkPagina(paginaActual + 1)}
                className="p-2.5 bg-surface-container-lowest border border-primary/15 hover:border-primary/30 text-black rounded-xl shadow-soft-ambient transition-all active:scale-95"
              >
                <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
              </Link>
            ) : (
              <button disabled className="p-2.5 bg-surface-container-low/50 border border-primary/5 text-on-surface-variant/30 rounded-xl cursor-not-allowed opacity-40">
                <ChevronRightIcon className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};