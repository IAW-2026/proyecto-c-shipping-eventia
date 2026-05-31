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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">{nombre_evento}</h2>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
          Pedido #{id_pedido}
        </span>
      </div>

      <div className="space-y-2 text-gray-600">
        <p>Cantidad: <span className="font-semibold text-gray-900">{cantidad}</span></p>
        <p>Fecha del evento: {fechaFormateada}</p>
        <p>Ubicación: {ubicacion}</p> 
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