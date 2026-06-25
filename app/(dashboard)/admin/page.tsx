import Link from "next/link";
import prisma from "@/lib/prisma";
import TablaEntradas from "../../components/EntradaTabla";
import {
  ShieldExclamationIcon,
  CommandLineIcon,
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { isAdmin } from "@/lib/util";

// captura filtros y ordenamiento
interface PageProps {
  searchParams: Promise<{
    page?: string;
    estado?: string;
    orden?: 'asc' | 'desc';
  }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const esAdmin = await isAdmin();
  if (!esAdmin) {
    return (
      <>
        <div className="fixed inset-0 bg-background -z-10 pointer-events-none" />

        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center selection:bg-primary-container selection:text-background font-body">
          <div className="card-retro-tonal max-w-md flex flex-col items-center p-8 bg-surface-container-low">
            <div className="bg-primary-container text-background w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-soft-ambient border border-primary/20">
              <ShieldExclamationIcon className="w-9 h-9 stroke-[2]" />
            </div>
            <h1 className="text-headline-md text-primary mb-2 tracking-tight uppercase font-black">
              Acceso Restringido
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
              Este módulo está reservado exclusivamente para el personal de administración central de Eventia.
            </p>
            <Link
              href="/buyer"
              className="btn-retro-primary inline-block w-full sm:w-auto px-6 py-2.5 text-sm text-center font-bold uppercase tracking-wider"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </>
    );
  }

  const params = await searchParams;
  const TAMANIO_PAGINA = 10;
  const paginaActual = Number(params.page) || 1;
  const saltarElementos = (paginaActual - 1) * TAMANIO_PAGINA;

  // Filtro y orden por defecto
  const filtroEstado = params.estado || undefined;
  const direccionOrden = params.orden || 'desc';

  const totalEntradas = await prisma.entrada.count();
  const entradasDisponibles = await prisma.entrada.count({ where: { estado: "Confirmado" } });
  const entradasUsadas = await prisma.entrada.count({ where: { estado: "Usado" } });
  const entradasCanceladas = await prisma.entrada.count({ where: { estado: "Cancelado" } });
  const entradasPendientes = await prisma.entrada.count({ where: { estado: "Pendiente" } });

  const condicionesWhere = filtroEstado ? { estado: filtroEstado } : {};

  const totalFiltrados = await prisma.entrada.count({ where: condicionesWhere });
  const totalPaginas = Math.ceil(totalFiltrados / TAMANIO_PAGINA);

  const entradasDb = await prisma.entrada.findMany({
    where: condicionesWhere,
    orderBy: { id_entrada: direccionOrden },
    take: TAMANIO_PAGINA,
    skip: saltarElementos,
  });

  const entradas = entradasDb.map(e => ({
    ...e,
    id_entrada: e.id_entrada.toString(),
    id_pedido: e.id_pedido?.toString(),
    id_evento: e.id_evento?.toString(),
  }));

  // Porcentaje de efectividad/uso global en la plataforma
  const porcentajeAsistencia = totalEntradas > 0
    ? Math.round((entradasUsadas / totalEntradas) * 100)
    : 0;

  return (
    <div className="w-full space-y-10 pb-12 pt-6 font-body">

      {/* PANEL DE BIENVENIDA Y ACCESO RÁPIDO */}
      <div className="card-retro p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden bg-secondary-container/70 border-secondary-container/60 shadow-soft-ambient">

        <div className="absolute right-6 -bottom-6 text-on-secondary-container/10 pointer-events-none hidden md:block select-none">
          <TicketIcon className="w-44 h-44 rotate-12 stroke-[1.5]" />
        </div>

        <div className="text-left space-y-1 z-10">
          <h1 className="text-headline-md text-on-secondary-container tracking-tight">
            Panel de Administración Central
          </h1>
          <p className="text-body-md text-on-secondary-container/80 max-w-xl leading-relaxed">
            Bienvenido<span className="font-extrabold text-black"></span>. Auditoría global del sistema de tickets y accesos descentralizados.
          </p>
        </div>
      </div>

      {/* METRICAS:*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">


        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <TicketIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Total Emitidas
            </span>
            <span className="text-2xl font-black text-black text-body-md">{totalEntradas}</span>
          </div>
        </div>


        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <CheckCircleIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Confirmadas
            </span>
            <span className="text-2xl font-black text-black text-body-md">
              {entradasDisponibles}
            </span>
          </div>
        </div>




        {/* Métrica de Pendientes */}
        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-on-surface-variant/5 flex items-center justify-center text-on-surface-variant/60 border border-primary/10">
            <ClockIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Pendientes
            </span>
            <span className="text-2xl font-black text-black text-body-md">
              {entradasPendientes}
            </span>
          </div>
        </div>


        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <XCircleIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Canceladas
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-black text-black text-body-md">
                {entradasCanceladas}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card-retro p-5 flex items-center gap-4 bg-surface-container-lowest border border-primary/10">
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <ArrowPathIcon className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-label-sm text-on-surface-variant/60 uppercase tracking-widest block font-bold">
              Entradas Usadas
            </span>
            <span className="text-2xl font-black text-black text-body-md">
              {entradasUsadas} <span className="text-sm text-on-surface-variant/60">/ {totalEntradas}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low border-2 border-primary/15 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between shadow-inner">

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label-sm font-extrabold text-on-surface-variant/80 uppercase mr-2 tracking-wide">
            Filtrar por Estado:
          </span>
          <Link
            href="/admin?page=1"
            className={`px-4 py-2 rounded-xl text-label-sm font-bold border-2 transition-all uppercase tracking-wider ${!filtroEstado ? 'bg-black text-white border-black shadow-md' : 'bg-surface-container-high text-on-surface-variant border-primary/10 hover:border-primary/30'}`}
          >
            Todos
          </Link>
          <Link
            href={`/admin?page=1&estado=Confirmado&orden=${direccionOrden}`}
            className={`px-4 py-2 rounded-xl text-label-sm font-bold border-2 transition-all uppercase tracking-wider ${filtroEstado === 'Confirmado' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-surface-container-high text-emerald-600/90 border-primary/10 hover:border-emerald-500/30'}`}
          >
            Confirmado
          </Link>
          <Link
            href={`/admin?page=1&estado=Usado&orden=${direccionOrden}`}
            className={`px-4 py-2 rounded-xl text-label-sm font-bold border-2 transition-all uppercase tracking-wider ${filtroEstado === 'Usado' ? 'bg-amber-500 text-black border-amber-600 shadow-md' : 'bg-surface-container-high text-amber-600 border-primary/10 hover:border-amber-500/30'}`}
          >
            Usado
          </Link>
          <Link
            href={`/admin?page=1&estado=Pendiente&orden=${direccionOrden}`}
            className={`px-4 py-2 rounded-xl text-label-sm font-bold border-2 transition-all uppercase tracking-wider ${filtroEstado === 'Pendiente' ? 'bg-on-surface-variant text-white border-on-surface-variant shadow-md' : 'bg-surface-container-high text-on-surface-variant border-primary/10 hover:border-primary/30'}`}
          >
            Pendiente
          </Link>
          <Link
            href={`/admin?page=1&estado=Cancelado&orden=${direccionOrden}`}
            className={`px-4 py-2 rounded-xl text-label-sm font-bold border-2 transition-all uppercase tracking-wider ${filtroEstado === 'Cancelado' ? 'bg-rose-600 text-white border-rose-700 shadow-md' : 'bg-surface-container-high text-rose-600 border-primary/10 hover:border-rose-500/30'}`}
          >
            Cancelado
          </Link>
        </div>

        {/* Dirección de Orden */}
        <div className="flex items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 border-primary/10 pt-4 lg:pt-0">
          <span className="text-label-sm font-extrabold text-on-surface-variant/80 uppercase tracking-wide mr-1">
            Orden ID:
          </span>
          <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
            <Link
              href={`/admin?page=1${filtroEstado ? `&estado=${filtroEstado}` : ''}&orden=desc`}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold border-2 text-center transition-all uppercase tracking-wider ${direccionOrden === 'desc' ? 'bg-surface-container-highest text-black border-primary/40 shadow-sm' : 'bg-surface-container-high text-on-surface-variant border-primary/10 hover:border-primary/20'}`}
            >
              Nuevos ↓
            </Link>
            <Link
              href={`/admin?page=1${filtroEstado ? `&estado=${filtroEstado}` : ''}&orden=asc`}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold border-2 text-center transition-all uppercase tracking-wider ${direccionOrden === 'asc' ? 'bg-surface-container-highest text-black border-primary/40 shadow-sm' : 'bg-surface-container-high text-on-surface-variant border-primary/10 hover:border-primary/20'}`}
            >
              Viejos ↑
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <TablaEntradas
          entradas={entradas}
          titulo={filtroEstado ? `Entradas con estado: ${filtroEstado}` : "Registro Global de Entradas"}
          subtitulo="Auditoría y control de emisión de tickets en tiempo real"
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          rutaBase={`/admin${filtroEstado ? `?estado=${filtroEstado}` : '?'}${direccionOrden ? `&orden=${direccionOrden}` : ''}`}
          mostrarCamposAdmin={true}
        />
      </div>
    </div>
  );
}