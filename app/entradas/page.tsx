import { EntradaList } from '../components/EntradaList';

// DATOS DE PRUEBA
const MOCK_ENTRADAS = [
  {
    id_entrada: "9223372036854775807", // Simulación de BigInt como string
    id_pedido: 450,
    nombre_evento: "Festival de Jazz 2026",
    cantidad: 2,
    estado: "Confirmado",
    creado: new Date("2026-05-10T14:30:00Z"),
    id_usuario: 1
  },
  {
    id_entrada: "102030405060708090",
    id_pedido: 451,
    nombre_evento: "Final Copa Libertadores",
    cantidad: 1,
    estado: "Pendiente",
    creado: new Date("2026-05-12T09:15:00Z"),
    id_usuario: 1
  }
];

export default function EntradasPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header del Dashboard */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Mis Entradas</h1>
          <p className="text-slate-500 mt-2">
            Gestiona tus tickets y accede a los códigos QR de ingreso.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">Próximos Eventos</h2>
          <span className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full font-semibold">
            {MOCK_ENTRADAS.length} Entradas activas
          </span>
        </div>

        {/* Listado de Componentes */}
        <EntradaList tickets={MOCK_ENTRADAS} />
      </div>
    </main>
  );
}