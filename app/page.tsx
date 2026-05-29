// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    // Reemplazamos bg-white por layout-container para heredar el fondo crema y tipografía base
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-background">
      
      {/* 👑 LOGO CENTRAL EVENTIA (Visible en Desktop) */}
      {/* Usamos text-headline-lg (Climate Crisis) para un impacto de póster underground */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center">
        {/*<div className="bg-background border border-primary/20 px-8 py-4 rounded-xl shadow-soft-ambient">*/}
          <h1 className="text-headline-lg text-primary tracking-tighter uppercase">
            Eventia
          </h1>
        {/*</div>*/}
      </div>

      {/* ==========================================================================
         SECCIÓN COMPRADOR (Izquierda)
         ========================================================================== */}
     <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative border-b md:border-b-0 md:border-r border-primary/10 min-h-[50vh] md:min-h-screen bg-transparent z-10 overflow-hidden">
        
        {/* 🖼️ IMAGEN DE FONDO EXCLUSIVA PARA ESTA COLUMNA */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-multiply">
          <Image
            src="/imgHome.jpeg" // Asegurate de que esté en /public con este mismo nombre y extensión
            alt="Fondo sección compradores"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        {/* Nombre de la app para mobile */}
        <div className="md:hidden absolute top-6 left-6">
          <span className="text-headline-md text-primary tracking-tight uppercase">Eventia</span>
        </div>

        <div className="max-w-sm text-center space-y-4">
          
          <h2 className="text-headline-md text-primary tracking-tight">
            Accedé a tus entradas
          </h2>
          
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Accedé a tus QR troquelados y gestioná tus accesos a los mejores eventos en un solo lugar.
          </p>
          
          <div className="pt-4 flex justify-center">
            <Link href="/buyer" className="btn-retro-primary">
              Comenzar
            </Link>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         SECCIÓN VENDEDOR (Derecha)
         Usamos un fondo de capa tonal (surface-container-low) para generar contraste suave
         ========================================================================== */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative min-h-[50vh] md:min-h-screen bg-surface-container-low">
        
        <div className="max-w-sm text-center space-y-4">
  
          
          <h2 className="text-headline-md text-primary tracking-tight">
            Gestioná tus eventos
          </h2>
          
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Realizá el seguimiento de ventas y escaneá entradas en tiempo real con nuestra app móvil.
          </p>
          
          <div className="pt-4 flex justify-center">
            {/* Usamos el botón secundario (Dusty Rose) para diferenciar los flujos */}
            <Link href="/seller" className="btn-retro-secondary">
              Comenzar
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}