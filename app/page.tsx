import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { QrCodeIcon, ChartBarIcon, TicketIcon } from "@heroicons/react/24/outline";

export default async function LandingPage() {
  const { userId } = await auth();

  // Definimos las rutas dinámicamente según si el usuario está logueado o no
  const buyerHref = userId ? "/buyer" : "/sign-in?redirect_url=/buyer";
  const sellerHref = userId ? "/seller" : "/sign-in?redirect_url=/seller";
  const adminHref = userId ? "/admin" : "/sign-in?redirect_url=/admin";

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary-container selection:text-background">

      {/* BLOQUE 1:*/}
      <section className="min-h-screen w-full flex flex-col md:flex-row items-center justify-start md:justify-between px-0 md:px-16 pt-20 md:pt-0 pb-8 gap-0 md:gap-12 relative border-b border-primary/10 bg-gradient-to-b from-primary/5 via-background to-background">

        <div className="flex-1 w-full flex flex-col justify-center max-w-xl z-10 space-y-4 order-2 md:order-1 text-left mt-6 md:mt-0 px-6 md:px-0">
          <span className="label-retro tracking-widest uppercase block font-bold">
            Bienvenido a Eventia
          </span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-black tracking-tighter leading-[1.1]">
            <span className="block mb-1">Descubrí,</span>
            creá y viví los mejores eventos
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-md leading-relaxed">
            La plataforma definitiva para la gestión inteligente de accesos y la centralización de experiencias en tiempo real.
          </p>
          <div className="pt-2">
            <a href="#modos" className="btn-retro-primary inline-block w-full sm:w-auto text-center py-2.5 px-8 text-sm">
              Comenzar ↓
            </a>
          </div>
        </div>

        {/* Lado Derecho (Imagen): Escala expandida (Flex-1.4 en Desktop para ocupar casi todo) */}
        <div className="flex-1 md:flex-[1.4] w-full sm:mt-0 sm:mx-0 h-[40vh] md:h-[75vh] relative sm:rounded-3xl overflow-hidden shadow-soft-ambient border-b sm:border border-primary/10 order-1 md:order-2">
          <Image
            src="/imgHome.jpeg"
            alt="Eventia Home Experience"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
            priority
          />
        </div>
      </section>

      {/*BLOQUE 2: MODOS DE USUARIO */}
      <section id="modos" className="min-h-screen w-full flex flex-col md:flex-row border-b border-primary/10">

        {/* Columna Comprador */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative border-b md:border-b-0 md:border-r border-primary/10 min-h-[50vh] md:min-h-screen bg-transparent overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-multiply bg-primary/10">
            <Image
              src="/imgHome.jpeg"
              alt="Fondo sección compradores"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
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
              <Link href={buyerHref} className="btn-retro-primary px-8">
                Ingresar como Comprador
              </Link>
            </div>
          </div>
        </div>

        {/* Columna Vendedor (Derecha) */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative min-h-[50vh] md:min-h-screen bg-gradient-to-br from-secondary-container/30 to-surface-container-low">
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
              <Link href={sellerHref} className="btn-retro-secondary px-8">
                Ingresar como Organizador
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*BLOQUE 3: INFORMACIÓN*/}
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
          <div className="card-retro flex flex-col justify-between space-y-4 bg-surface-container-low/50 hover:bg-primary/5 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <QrCodeIcon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-primary">Escáner Preciso</div>
              <p className="text-body-md text-on-surface-variant">
                Validación inmediata de credenciales en puerta, optimizada para un alto flujo de personas concurrentes.
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Capacidad  */}
          <div className="card-retro-tonal flex flex-col justify-between space-y-4 bg-secondary-container/20 border-secondary-container/30">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-primary">Control de capacidad</div>
              <p className="text-body-md text-on-surface-variant">
                Monitoreá las métricas de asistencia e ingresos de tus eventos organizados con actualización instantánea.
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Entradas */}
          <div className="card-retro flex flex-col justify-between space-y-4 bg-surface-container-low/50 hover:bg-primary/5 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
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
    </div>
  );
}