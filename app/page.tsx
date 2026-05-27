// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-white">
      
      {/* Logo eventia */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex flex-col items-center">
        <div className="px-6 py-3">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Eventia
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative border-b md:border-b-0 md:border-r border-slate-200 min-h-[50vh] md:min-h-screen bg-white">
        
        {/* Nombre de la app visible solo en celular arriba */}
        <div className="md:hidden absolute top-6 left-6">
          <span className="text-xl font-extrabold text-slate-900">Eventia</span>
        </div>

        <div className="max-w-sm text-center">
          <div className="text-4xl mb-4 inline-block md:block"></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accedé a tus entradas
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Accede a tus QR troquelados y gestioná tus accesos a los mejores eventos en un solo lugar.
          </p>
          <div className="mt-8 flex justify-center">
            <Link 
              href="/buyer" 
              className="inline-flex items-center justify-center bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors active:scale-95 text-sm"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative min-h-[50vh] md:min-h-screen bg-slate-50">
        
        <div className="max-w-sm text-center">
          <div className="text-4xl mb-4 inline-block md:block"></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestioná tus eventos
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Realizá el seguimiento de ventas y escaneá entradas en tiempo real con nuestra app móvil.
          </p>
          <div className="mt-8 flex justify-center">
            <Link 
              href="/seller" 
              className="inline-flex items-center justify-center bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors active:scale-95 text-sm"
            >
              Comenzar 
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}