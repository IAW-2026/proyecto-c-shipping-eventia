import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {EntradaList} from '../../components/EntradaList';
import { BarraFiltrosEntradas } from '../../components/BarraFiltrosEntrada';
import { entradasUsuarioID } from "@/services/entradas";
import Link from "next/link";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

interface PageProps {
  searchParams: Promise<{
    buscar?: string;
    estado?: string;
    fecha?: string;
    pagina?: string;
  }>;
}

export default async function EntradasPage({ searchParams }: PageProps) {
  const { userId } = await auth.protect();

  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  // Vista de Acceso Restringido adaptada al estilo Retro Tonal con Heroicon
  if (!roles.includes("buyer")) {
    return (
      <>
        <div className="fixed inset-0 bg-background -z-10 pointer-events-none" />

        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center selection:bg-primary-container selection:text-background">
          <div className="card-retro-tonal max-w-md flex flex-col items-center p-8 bg-surface-container-low">
            <div className="bg-primary-container text-background w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-soft-ambient border border-primary/20">
              <ShieldExclamationIcon className="w-9 h-9 stroke-[2]" />
            </div>
            <h1 className="text-headline-md text-primary mb-2 tracking-tight">
              Acceso Restringido
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
              Tu cuenta actual no tiene permisos de asistente para visualizar o gestionar entradas en Eventia.
            </p>
            <Link
              href="/seller"
              className="btn-retro-primary inline-block w-full sm:w-auto px-6 py-2.5 text-sm text-center"
            >
              Ir al Panel Organizador
            </Link>
          </div>
        </div>
      </>
    );
  }

  const params = await searchParams;
  const buscar = params.buscar || "";
  const estado = params.estado || "todos";
  const fecha = params.fecha || "todos";
  const paginaActual = Number(params.pagina) || 1;

  // Traemos los pases del usuario tal cual lo hacías al principio
  const misEntradas = await entradasUsuarioID(userId);

  // Construimos el query string dinámico para los botones de las páginas
  const queryUrlProps = new URLSearchParams();
  if (buscar) queryUrlProps.set("buscar", buscar);
  if (estado !== "todos") queryUrlProps.set("estado", estado);
  if (fecha !== "todos") queryUrlProps.set("fecha", fecha);
  const queryStr = queryUrlProps.toString();
  const rutaBaseDinamica = queryStr ? `/buyer?${queryStr}&` : `/buyer?`;

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-background pb-16">
      <main className="layout-container pt-10 px-4 max-w-7xl mx-auto space-y-8">
        
        {/* Header*/}
        <div className="card-retro p-8 md:p-12 bg-gradient-to-br from-primary/10 via-surface-container-low to-transparent border-primary/20 relative overflow-hidden shadow-soft-ambient">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary uppercase tracking-tight font-black">
              Mis Entradas
            </h1>
            <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl font-medium leading-relaxed">
              Gestioná tus tickets y accedé a los códigos QR de ingreso para tus eventos.
            </p>
          </div>
        </div>

        {/* Componente Cliente de Input de Búsqueda y Filtros */}
        <BarraFiltrosEntradas />

        {/* Tu Componente original de Listado que ahora encapsula el fetch y el paginado */}
        <div className="mt-6">
          <EntradaList 
            tickets={misEntradas} 
            buscar={buscar}
            estado={estado}
            fecha={fecha}
            paginaActual={paginaActual}
            rutaBase={rutaBaseDinamica}
          />
        </div>

      </main>
    </div>
  );
}