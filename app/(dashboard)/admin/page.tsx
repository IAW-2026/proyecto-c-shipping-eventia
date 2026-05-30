import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import prisma from "@/lib/prisma";
import TablaEntradas from "../../components/EntradaTabla";

// captura filtros y ordenamiento
interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    estado?: string; 
    orden?: 'asc' | 'desc';
  }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("admin")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
        <div className="bg-amber-50 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold shadow-sm border border-amber-200">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Área Restringida</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
          Este módulo está reservado exclusivamente para el personal de administración central de Eventia.
        </p>
        <Link 
          href="/buyer" 
          className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const params = await searchParams;
  const TAMANIO_PAGINA = 10;
  const paginaActual = Number(params.page) || 1;
  const saltarElementos = (paginaActual - 1) * TAMANIO_PAGINA;
  
  // Filtro y orden por defecto
  const filtroEstado = params.estado || undefined; // Si no hay filtro, trae todos
  const direccionOrden = params.orden || 'desc'; // Por defecto, los más nuevos primero

 
  const totalEntradas = await prisma.entrada.count();
  const entradasDisponibles = await prisma.entrada.count({ where: { estado: "Confirmado" } });
  const entradasUsadas = await prisma.entrada.count({ where: { estado: "Usado" } });
  const entradasCanceladas = await prisma.entrada.count({ where: { estado: "Cancelada" } });


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

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Encabezado */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel de Administración Central</h1>
          <p className="text-sm text-slate-500 mt-1">Bienvenido, {user?.firstName}.</p>
        </div>
        <Link href="admin/simulacionCompra" className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-all shadow-sm">
          Simular Compra
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Emitidas</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalEntradas}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Confirmadas</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{entradasDisponibles}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Usadas</p>
          <p className="text-3xl font-black text-amber-600 mt-2">{entradasUsadas}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Canceladas</p>
          <p className="text-3xl font-black text-rose-600 mt-2">{entradasCanceladas}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase mr-2">Filtrar por Estado:</span>
          <Link 
            href="/admin?page=1"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${!filtroEstado ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Todos
          </Link>
          <Link 
            href={`/admin?page=1&estado=Confirmado&orden=${direccionOrden}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filtroEstado === 'Confirmado' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Confirmado
          </Link>
          <Link 
            href={`/admin?page=1&estado=Usado&orden=${direccionOrden}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filtroEstado === 'Usado' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Usado
          </Link>
          <Link 
            href={`/admin?page=1&estado=Cancelada&orden=${direccionOrden}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filtroEstado === 'Cancelada' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Cancelada
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Orden ID:</span>
          <Link
            href={`/admin?page=1${filtroEstado ? `&estado=${filtroEstado}` : ''}&orden=desc`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${direccionOrden === 'desc' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Nuevos primero ↓
          </Link>
          <Link
            href={`/admin?page=1${filtroEstado ? `&estado=${filtroEstado}` : ''}&orden=asc`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${direccionOrden === 'asc' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            Viejos primero ↑
          </Link>
        </div>
      </div>

      <TablaEntradas 
        entradas={entradas} 
        titulo={filtroEstado ? `Entradas con estado: ${filtroEstado}` : "Registro Global de Entradas"}
        subtitulo="Auditoría y control de emisión de tickets en tiempo real"
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        rutaBase={`/admin${filtroEstado ? `?estado=${filtroEstado}` : '?'}${direccionOrden ? `&orden=${direccionOrden}` : ''}`} 
      />
    </div>
  );
}


