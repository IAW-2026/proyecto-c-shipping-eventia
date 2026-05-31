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

  // Vista de Acceso Restringido adaptada al estilo Retro Tonal
  if (!roles.includes("buyer")) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 text-center">
        <div className="card-retro-tonal max-w-md flex flex-col items-center">
          <div className="bg-primary-container text-background w-16 h-16 rounded-xl flex items-center justify-center font-display text-headline-md mb-4 shadow-soft-ambient">
            !
          </div>
          <h1 className="text-headline-md text-primary-container mb-2">
            Acceso Restringido
          </h1>
          <p className="text-body-md text-on-surface-variant/80 max-w-sm mb-6 leading-relaxed">
            Tu cuenta actual no tiene permisos de comprador para acceder al escáner de entradas de Eventia.
          </p>
          <Link 
            href="/seller" 
            className="btn-retro-primary inline-block"
          >
            Volver a Escanear Entradas
          </Link>
        </div>
      </div>
    );
  }
  
  const misEntradas = await entradasUsuarioID(userId);

  return (
    <main className="layout-container">
      {/* Header del Dashboard - Estilo Retro-Flow */}
      <div className="border-b border-primary/15 pb-8 mb-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary-container">
            Mis Entradas
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Gestiona tus tickets y accede a los códigos QR de ingreso.
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-headline-md text-on-background">
            Próximos Eventos
          </h2>
          <span className="chip-retro">
            {misEntradas.length} Entradas activas
          </span>
        </div>

        {/* Listado de Componentes */}
        <div className="mt-6">
          <EntradaList tickets={misEntradas} />
        </div>
      </div>
    </main>
  );
}