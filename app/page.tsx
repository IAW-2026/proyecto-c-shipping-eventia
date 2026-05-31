// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { QrCodeIcon, ChartBarIcon, TicketIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary-container selection:text-background">

      {/* ==========================================================================
          BLOQUE 1: HERO - IMPACTO REDUCIDO Y EFECTO PEEK (85vh)
          ========================================================================== */}
      <section className="min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-12 md:pt-0 pb-8 gap-8 md:gap-12 relative border-b border-primary/10">

        {/* Lado Izquierdo (Texto): Siempre alineado a la izquierda */}
        <div className="flex-1 w-full flex flex-col justify-center max-w-xl z-10 space-y-5 order-2 md:order-1 text-left mt-6 md:mt-0">
          <span className="text-label-sm text-primary tracking-widest uppercase block font-bold">
            Bienvenidos a Eventia
          </span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-black font-black tracking-tighter leading-[1.1]">
            <span className="block mb-1">Descubrí,</span>
            creá y viví los mejores eventos
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-md leading-relaxed">
            La plataforma definitiva para la gestión inteligente de accesos y la centralización de experiencias en tiempo real.
          </p>
          <div className="pt-2">
            <a href="#modos" className="btn-retro-primary inline-block w-full sm:w-auto text-center py-2.5 px-8 text-sm">
              Ingresar ↓
            </a>
          </div>
        </div>

        {/* Lado Derecho (Imagen): Escala expandida (Flex-1.4 en Desktop para ocupar casi todo) */}
        <div className="flex-1 md:flex-[1.4] w-full -mt-12 -mx-6 sm:mt-0 sm:mx-0 h-[48vh] md:h-[75vh] relative sm:rounded-3xl overflow-hidden shadow-soft-ambient border-b sm:border border-primary/10 order-1 md:order-2">
          <Image
            src="/imgHome.jpeg"
            alt="Eventia Home Experience"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      {/* ==========================================================================
          BLOQUE 2: MODOS DE USUARIO - ACCESO INTUITIVO (Aparece parcialmente arriba)
          ========================================================================== */}
      <section id="modos" className="min-h-screen w-full flex flex-col md:flex-row border-b border-primary/10">

        {/* Columna Comprador (Izquierda) */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative border-b md:border-b-0 md:border-r border-primary/10 min-h-[50vh] md:min-h-screen bg-transparent overflow-hidden">
          {/* Fondo muy tenue para garantizar contraste */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
            <Image
              src="/imgHome.jpeg"
              alt="Fondo sección compradores"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="max-w-sm text-center space-y-4 z-10">
            <span className="chip-retro">Clientes</span>
            <h2 className="text-headline-md text-primary tracking-tight">
              Accedé a tus entradas
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Ingresá para ver tus códigos QR troquelados y gestionar tus accesos en puerta de forma inmediata.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/buyer" className="btn-retro-primary px-8">
                Ingresar como Comprador
              </Link>
            </div>
          </div>
        </div>

        {/* Columna Vendedor (Derecha) */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative min-h-[50vh] md:min-h-screen bg-surface-container-low">
          <div className="max-w-sm text-center space-y-4">
            <span className="chip-retro" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-background)' }}>
              Organizadores
            </span>
            <h2 className="text-headline-md text-primary tracking-tight">
              Gestioná tus eventos
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Monitoreá tus ventas y accedé al escáner de entradas en tiempo real.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/seller" className="btn-retro-secondary px-8">
                Ingresar como Organizador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          BLOQUE 3: INFORMACIÓN / BENEFICIOS DEL SISTEMA
          ========================================================================== */}
      <section id="info" className="py-20 px-6 md:px-16 max-w-6xl mx-auto w-full space-y-12 border-b border-primary/10">

        {/* Encabezado adaptado a las características reales */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-headline-md text-primary">Ecosistema Ágil e Integrado</h2>
          <p className="text-body-md text-on-surface-variant">
            Una solución interactiva diseñada para conectar a organizadores y asistentes.
          </p>
        </div>

        {/* Grilla de Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Tarjeta 1: Escáner */}
          <div className="card-retro flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                <QrCodeIcon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-primary">Escáner Preciso</div>
              <p className="text-body-md text-on-surface-variant">
                Validación inmediata de credenciales en puerta, optimizada para un alto flujo de personas concurrentes.
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Capacidad (Tonal para generar contraste) */}
          <div className="card-retro-tonal flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-primary">Control de capacidad</div>
              <p className="text-body-md text-on-surface-variant">
                Monitoreá las métricas de asistencia e ingresos de tus eventos organizados con actualización instantánea.
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Entradas */}
          <div className="card-retro flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                <TicketIcon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-primary">Entradas únicas</div>
              <p className="text-body-md text-on-surface-variant">
                Generación de códigos QR únicos para cada entrada, agrupados por pedido para facilitar tu ingreso.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================================================
          BLOQUE 4: FOOTER DE NAVEGACIÓN COMPLETA
          ========================================================================== */}
      <footer className="bg-surface-container-highest border-t border-primary/10 px-6 md:px-16 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">

          <div className="space-y-3">
            <span className="text-headline-lg-mobile text-primary tracking-tighter font-display block">
              Eventia
            </span>
            <p className="text-label-sm text-on-surface-variant/70 max-w-xs">
              Sistemas avanzados de gestión y verificación de accesos para eventos.
            </p>
          </div>

          {/* Links de Navegación Estructurales */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
            <div className="space-y-3">
              <span className="text-label-lg text-primary block uppercase tracking-wider">Flujos</span>
              <ul className="space-y-2 text-body-md text-on-surface-variant">
                <li><Link href="/buyer" className="hover:text-primary transition-colors">Portal Comprador</Link></li>
                <li><Link href="/seller" className="hover:text-primary transition-colors">Portal Organizador</Link></li>
                <li><Link href="/seller/scan" className="hover:text-primary transition-colors">Escáner de Puerta</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-label-lg text-primary block uppercase tracking-wider">Soporte</span>
              <ul className="space-y-2 text-body-md text-on-surface-variant">
                <li><Link href="#info" className="hover:text-primary transition-colors">Documentación</Link></li>
                <li><span className="opacity-50 cursor-not-allowed">Términos y condiciones</span></li>
                <li><span className="opacity-50 cursor-not-allowed">Privacidad</span></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="text-label-lg text-primary block uppercase tracking-wider">Sistema</span>
              <div className="bg-background/50 border border-primary/10 rounded-xl p-3 text-label-sm text-on-surface-variant space-y-1">
                <div>⚡ Next.js App Router</div>
                <div>🎨 Tailwind v4 Style</div>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-primary/5 mt-12 pt-6 text-center text-label-sm text-on-surface-variant/50">
          © {new Date().getFullYear()} Eventia Inc. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}