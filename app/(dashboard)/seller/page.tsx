import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import UsuarioSeller from '../../components/features/usuarioSeller';
import prisma from "@/lib/prisma";
import TablaEntradas from "@/app/components/EntradaTabla";
import { CheckCircle2, Ticket, Users2 } from "lucide-react";
import { ShieldExclamationIcon, TicketIcon, CheckCircleIcon, UsersIcon } from "@heroicons/react/24/outline";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SellerPage({ searchParams }: PageProps) {
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

  const resolvedParams = await searchParams;
  const paginaActual = Number(resolvedParams.page) || 1;
  const limitePorPagina = 10;
  const skip = (paginaActual - 1) * limitePorPagina;

  const [entradasSeller, totalEntradas, conteoPorEstado] = await Promise.all([
    prisma.entrada.findMany({
      where: {
        id_organizador: user?.id,
      },
      select: {
        id_entrada: true,
        id_pedido: true,
        id_evento: true,
        estado: true,
      },
      skip: skip,
      take: limitePorPagina,
      orderBy: {
        id_entrada: "desc",
      },
    }),
    prisma.entrada.count({
      where: { id_organizador: user?.id },
    }),
    // Consulta agrupada: nos da los totales de cada estado
    prisma.entrada.groupBy({
      by: ['estado'],
      where: { id_organizador: user?.id },
      _count: { _all: true }
    })
  ]);

  const totalUsadas = conteoPorEstado.find(c => c.estado === 'Usado')?._count._all || 0;
  const totalConfirmadas = conteoPorEstado.find(c => c.estado === 'Confirmado')?._count._all || 0;

  // Porcentaje de asistencia actual en puerta
  const porcentajeAsistencia = totalEntradas > 0
    ? Math.round((totalUsadas / totalEntradas) * 100)
    : 0;

  const idsEventosUnicos = Array.from(
    new Set(entradasSeller.map((e) => e.id_evento).filter(Boolean))
  );

  const sellerUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
  const sellerKey = process.env.SELLER_API_KEY;


  const eventosResueltos = await Promise.all(
    idsEventosUnicos.map(async (id) => {
      try {
        const res = await fetch(`${sellerUrl}/api/seller/eventos/${id}`, {
          cache: 'no-store', headers: {
            'Content-Type': 'application/json',
            'x-api-key': sellerKey ?? ''
          }
        });
        if (!res.ok) return { id, nombre: null };
        const data = await res.json();
        return { id, nombre: data.nombre }; // Ajustá 'data.nombre' según lo que devuelva tu API
      } catch {
        return { id, nombre: null };
      }
    })
  );

  // 4. Mapeamos las respuestas a un diccionario rápido de leer
  const mapaEventos = new Map<string, string>();
  eventosResueltos.forEach((evt) => {
    if (evt.nombre) {
      mapaEventos.set(evt.id.toString(), evt.nombre);
    }
  });

  // 5. Transformamos las entradas cruzando el nombre obtenido
  const entradasConvertidas = entradasSeller.map((entrada) => {
    const idEventoString = entrada.id_evento?.toString() || "";
    return {
      id_entrada: entrada.id_entrada.toString(),
      id_pedido: entrada.id_pedido,
      // Reemplazamos el ID de evento por el Nombre resuelto
      id_evento: mapaEventos.get(idEventoString) || `Evento #${idEventoString}`,
      estado: entrada.estado,
    };
  });


  const totalPaginas = Math.ceil(totalEntradas / limitePorPagina);

  return (
    <div className="w-full space-y-10 pb-12 pt-6">

      {/* 🎫 BANNER PRINCIPAL: ESTILO POSTER RETRO-FLOW */}
      <div className="card-retro p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden bg-secondary-container/70 border-secondary-container/60 shadow-soft-ambient">

        {/* Elemento de Diseño: Ícono gigante de fondo sutil con tinte rosa oscuro */}
        <div className="absolute right-6 -bottom-6 text-on-secondary-container/10 pointer-events-none hidden md:block select-none">
          <TicketIcon className="w-44 h-44 rotate-12 stroke-[1.5]" />
        </div>

        <div className="text-left space-y-1 z-10">
          <h1 className="text-headline-md text-on-secondary-container font-black tracking-tight">
            Panel de Control
          </h1>
          <p className="text-body-md text-on-secondary-container/80 max-w-xl leading-relaxed">
            Monitoreá tus ventas en tiempo real y gestioná el ingreso de los asistentes de manera descentralizada.
          </p>
        </div>

        <Link
          href="/seller/scan"
          className="btn-retro-primary w-full sm:w-auto text-center py-3.5 px-8 text-sm font-bold uppercase tracking-wider whitespace-nowrap"
        >
          Abrir Escáner QR ↓
        </Link>
      </div>

      {/* 📊 CONTENEDORES DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Tarjeta 1: Total Emitidas */}
        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <TicketIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Entradas Emitidas
            </span>
            <span className="text-2xl font-black text-black text-body-md">{totalEntradas}</span>
          </div>
        </div>

        {/* Tarjeta 2: Check-in (Variante Tonal) */}
        <div className="card-retro-tonal p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <CheckCircleIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-primary uppercase tracking-widest block font-bold">
              Ingresos 
            </span>
            <span className="text-2xl font-black text-black text-body-md">
              {totalUsadas} <span className="text-sm text-body-md text-on-surface-variant/60">/ {totalEntradas}</span>
            </span>
          </div>
        </div>

        {/* Tarjeta 3: Porcentaje Asistencia */}
        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <UsersIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Asistencia Actual
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-black text-black text-body-md">{porcentajeAsistencia}%</span>
              {/* Barra de progreso integrada al ecosistema */}
              <div className="flex-1 bg-primary/10 h-2.5 rounded-full overflow-hidden border border-primary/5 hidden sm:block">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${porcentajeAsistencia}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 📋 HISTORIAL / TABLA COMPONENTE */}
      <div className="pt-2">
        <TablaEntradas
          entradas={entradasConvertidas}
          titulo="Historial de Ventas"
          subtitulo="Lista de entradas correspondientes a tus eventos organizados"
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          rutaBase="/seller?"
          ocultarIdEntrada={true}
        />
      </div>

    </div>
  );
}

