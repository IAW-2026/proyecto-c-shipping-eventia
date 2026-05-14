import { EntradaCard } from './EntradaCard';

// Definimos la interfaz basada en tu modelo de Prisma
interface Entrada {
  id_entrada: bigint | string;
  id_pedido: number;
  nombre_evento: string;
  cantidad: number;
  estado: string;
  creado: Date | string;
}

export const EntradaList = ({ tickets }: { tickets: Entrada[] }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">No tienes entradas registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <EntradaCard 
          key={ticket.id_entrada.toString()} 
          // Pasamos el id_entrada explícitamente convertido a string para la URL
          id_entrada={ticket.id_entrada.toString()}
          id_pedido={ticket.id_pedido}
          nombre_evento={ticket.nombre_evento}
          cantidad={ticket.cantidad}
          estado={ticket.estado}
          creado={ticket.creado}
        />
      ))}
    </div>
  );
};