import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import UsuarioSeller from '../../components/features/usuarioSeller';

export default async function SellerPage() {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("seller")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[60vh]">
        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm">
          Tu cuenta no tiene permisos de vendedor para acceder al escáner de Eventia.
        </p>
        <Link href="/buyer" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
          Volver a Mis Entradas
        </Link>
      </div>
    );
  }

  // Si tiene el rol, le pasamos el control al componente de cliente
  return <UsuarioSeller />;
}