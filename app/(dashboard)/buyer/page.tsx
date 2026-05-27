import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EntradaList } from '../../components/EntradaList';
import { entradasUsuarioID } from "@/services/entradas";
import Link from "next/link";

export default async function EntradasPage() {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || []; 
  const userId = user?.id;

  if (!userId) {
    redirect('/sign-in');
  }
  
  

  if(!roles.includes("buyer")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn min-h-[60vh]">
        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold shadow-sm">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
          Tu cuenta actual no tiene permisos de comprador para acceder al escáner de entradas de Eventia.
        </p>
        <Link 
          href="/seller" 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          Volver a Escanear Entradas
        </Link>
      </div>
    );
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