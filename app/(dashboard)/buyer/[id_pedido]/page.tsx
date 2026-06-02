import { redirect } from "next/navigation";
import { EntradaDetalle } from "../../../components/EntradaDetalle";
import { entradasPorPedidoID } from "@/services/entradas"; 
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";


interface PageProps {
  params: Promise<{ id_pedido: string }>; 
}

export default async function TicketDetailPage({ params }: PageProps) {
  
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

  const { id_pedido } = await params;

  const entradas = await entradasPorPedidoID(id_pedido);

  if (!entradas || entradas.length === 0) {
    redirect("/buyer");
  }

  return (
    <EntradaDetalle 
      id_pedido={id_pedido} 
      entradas={entradas} 
    />
  );
}