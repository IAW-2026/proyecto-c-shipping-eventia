import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import dynamic from "next/dynamic";

const UsuarioSeller = dynamic(() => import("../../../components/features/usuarioSeller"), { ssr: false });

export default async function ScanPage() {
  const { userId } = await auth.protect();

  const user = await currentUser();

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
          <UsuarioSeller usuarioClerk={{ id: user?.id || "" }} />
        </div>
      </div>

    </div>
  );
}