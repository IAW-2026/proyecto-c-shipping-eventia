import { EntradaCard } from './EntradaCard';

interface Entrada {
  id_entrada: bigint | string;
  id_pedido: number;
  id_evento: number;
  cantidad: number;
  estado: string;
  nombre_evento?: string
  ubicacion?: string;
  fecha_evento?: string;
}

interface Props  {
  params: Promise<{
    id: string;
  }>;
};

interface Evento{
  idEvento: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  precio: number;
  stock: number;
}

async function getEvento(id: string) {

  const sellerUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerKey = process.env.SELLER_API_KEY;

  try {
    
    const res = await fetch(`${sellerUrl}/api/seller/eventos/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sellerKey ?? ''
      }
    });
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as Evento;
  } catch (error) {
    return null;
  }
}

export const EntradaList = async ({ tickets }: { tickets: Entrada[] }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">No tienes entradas registradas aún.</p>
      </div>
    );
  }

  // Cargar todos los eventos en paralelo
  const ticketsConEvento = await Promise.all(
    tickets.map(async (ticket) => {
      const evento = await getEvento(ticket.id_evento.toString());
      return {
        ...ticket,
        nombre_evento: evento?.nombre || "Evento desconocido",
        ubicacion: evento?.ubicacion || "Ubicación no disponible",
        fecha_evento: evento?.fecha || "Fecha no disponible"
      };
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ticketsConEvento.map((ticket) => (
        <EntradaCard 
          id_entrada={ticket.id_entrada.toString()}
          id_pedido={ticket.id_pedido}
          id_evento={ticket.id_evento}
          cantidad={ticket.cantidad}
          estado={ticket.estado}
          nombre_evento={ticket.nombre_evento}
          ubicacion={ticket.ubicacion}
          fecha_evento={ticket.fecha_evento}
        />
      ))}
    </div>
  );
};