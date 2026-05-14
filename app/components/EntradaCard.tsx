import React from 'react';

interface EntradaProps {
  id_entrada: bigint | string;
  id_pedido: number;
  nombre_evento: string;
  cantidad: number;
  estado: string;
  creado: Date | string;
}

export const EntradaCard = ({ nombre_evento, cantidad, estado, creado, id_pedido }: EntradaProps) => {
  const fechaFormateada = new Date(creado).toLocaleDateString('es-AR', {
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
        <p>Fecha de compra: {fechaFormateada}</p>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
          estado === 'Aceptado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {estado}
        </span>
        <button className="text-indigo-600 font-bold hover:underline">
          Ver detalles
        </button>
      </div>
    </div>
  );
};