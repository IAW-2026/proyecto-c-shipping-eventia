import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import ScanClientContainer from "../../../components/features/ScanClientContainer";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: ' Eventia - Escaner de Entradas',
  description: 'Escaner de entradas para organizadores de Eventia.',
};

export default async function ScanPage() {
  const { userId } = await auth.protect();

  const user = await currentUser();

  const roles = (user?.publicMetadata?.roles as string[]) || [];
  
    if (!roles.includes("seller")) {
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
                Tu cuenta actual no tiene permisos para acceder al escaner de QR.
              </p>
              <Link
                href="/buyer"
                className="btn-retro-primary inline-block w-full sm:w-auto px-6 py-2.5 text-sm text-center"
              >
                Ir a Mis Entradas
              </Link>
            </div>
          </div>
        </>
      );
    }

  return (
    <div className="p-4 max-w-xl mx-auto min-h-[85vh] flex flex-col justify-center pb-12">
      
      <div className="mb-8 text-left">
        <Link 
          href="/seller" 
          className="inline-flex items-center text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-low hover:bg-surface-container border border-primary/15 hover:border-primary/30 px-5 py-2.5 rounded-xl shadow-soft-ambient transition-all active:scale-[0.98]"
        >
          ← Volver al Panel
        </Link>
      </div>
      
      {/* CONTENEDOR DEL ESCÁNER */}
      <div className="card-retro p-2 md:p-4 bg-surface-container-lowest overflow-hidden">
        <div className="rounded-2xl overflow-hidden border border-primary/5 bg-black/5">
          <ScanClientContainer usuarioId={user?.id || ""} />
        </div>
      </div>

    </div>
  );
}