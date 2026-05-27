import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EntradaList } from '../../components/EntradaList';
import { entradasUsuarioID } from "@/services/entradas";

export default async function EntradasPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
   
  const misEntradas = await entradasUsuarioID(userId);

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
            {misEntradas.length} Entradas activas
          </span>
        </div>

        {/* Listado de Componentes */}
        <EntradaList tickets={misEntradas} />
      </div>
    </main>
  );
}