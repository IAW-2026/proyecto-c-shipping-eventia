import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function AdminPage() {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("admin")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
        <div className="bg-amber-50 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold shadow-sm border border-amber-200">
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Área Restringida</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
          Este módulo está reservado exclusivamente para el personal de administración central de Eventia.
        </p>
        <Link 
          href="/buyer" 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado del Panel */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <span className="text-3xl"></span>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Panel de Administración Central
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bienvenido, {user?.firstName}. Tenés control total sobre la plataforma Eventia.
            </p>
          </div>
        </div>
      </div>

      {/* Grilla de Herramientas de Gestión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="text-2xl mb-3"></div>
          <h3 className="font-bold text-lg text-slate-800">Simulacion compra de entradas</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Simula una compra de una entrada desde la app Seller</p>
          <Link 
            href="admin/simulacionCompra" 
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
          >
            Ir a Simulación
          </Link>
        </div>

      </div>
    </div>
  );
}