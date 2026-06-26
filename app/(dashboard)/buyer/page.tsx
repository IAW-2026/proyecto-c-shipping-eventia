import { auth, currentUser } from "@clerk/nextjs/server";
import { EntradaList } from '../../components/EntradaList';
import { BarraFiltrosEntradas } from '../../components/BarraFiltrosEntrada';
import { entradasUsuarioID } from "@/services/entradas";
import Link from "next/link";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import {Metadata} from 'next';

interface PageProps {
  searchParams: Promise<{
    buscar?: string;
    estado?: string;
    fecha?: string;
    pagina?: string;
  }>;
}

export const metadata: Metadata = {
  title: ' Eventia - Mis Entradas',
  description: 'Panel de entradas de Eventia',
};

export default async function EntradasPage({ searchParams }: PageProps) {
  const { userId } = await auth.protect();

  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

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

  const misEntradas = await entradasUsuarioID(userId);

  const queryUrlProps = new URLSearchParams();
  if (buscar) queryUrlProps.set("buscar", buscar);
  if (estado !== "todos") queryUrlProps.set("estado", estado);
  if (fecha !== "todos") queryUrlProps.set("fecha", fecha);
  const queryStr = queryUrlProps.toString();
  const rutaBaseDinamica = queryStr ? `/buyer?${queryStr}&` : `/buyer?`;

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-background pb-16">
      <main className="layout-container pt-10 px-4 max-w-7xl mx-auto space-y-8">

        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 shadow-soft-ambient bg-cover bg-center text-background p-8 md:p-12 min-h-[220px] flex items-center"
          style={{ backgroundImage: `url('/imgHome.jpeg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/40 via-secondary-container/20 to-transparent mix-blend-color-linear-dodge pointer-events-none" />
          <div className="relative z-10 max-w-md flex flex-col gap-1">
            <h1 className="font-display text-3xl md:text-5xl text-primary leading-none mt-3">
              Mis Entradas
            </h1>
            <p className="text-primary/90 text-sm font-body font-medium max-w-sm mt-1">
              Gestioná tus tickets y accedé a los códigos QR de ingreso para tus eventos.
            </p>
          </div>
        </div>

        <BarraFiltrosEntradas />

        <div className="mt-6 p-6 md:p-10 bg-surface-container-lowest/50 rounded-[32px] border border-primary/5 shadow-inner">
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