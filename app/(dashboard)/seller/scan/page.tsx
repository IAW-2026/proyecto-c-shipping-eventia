import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import UsuarioSeller from "../../../components/features/usuarioSeller";

export default async function ScanPage() {
  const user = await currentUser();

  return (
    <div className="p-4 max-w-xl mx-auto min-h-[80vh] flex flex-col justify-center">
      {/* Botón sutil para regresar al Panel de Administración */}
      <div className="mb-6">
        <Link 
          href="/seller" 
          className="text-sm text-indigo-600 font-bold hover:underline bg-slate-100 px-4 py-2.5 rounded-xl transition-all"
        >
          ← Volver al Panel
        </Link>
      </div>
      
      {/* El escáner puro con los parámetros requeridos */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
        <UsuarioSeller usuarioClerk={{ id: user?.id || "" }} />
      </div>
    </div>
  );
}