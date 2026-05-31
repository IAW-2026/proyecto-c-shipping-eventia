import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import UsuarioSeller from '../../components/features/usuarioSeller';
import prisma from "@/lib/prisma";
import TablaEntradas from "@/app/components/EntradaTabla";
import { CheckCircle2, Ticket, Users2 } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SellerPage({ searchParams }: PageProps) {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("seller")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[60vh]">
        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold">
          !
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
        <p className="text-gray-500 max-w-sm mb-6 text-sm">
          Tu cuenta no tiene permisos de vendedor para acceder al escáner de Eventia.
        </p>
        <Link href="/buyer" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
          Volver a Mis Entradas
        </Link>
      </div>
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
        const res = await fetch(`${sellerUrl}/api/seller/eventos/${id}`, { cache: 'no-store', headers: {
        'Content-Type': 'application/json',
        'x-api-key': sellerKey ?? ''
      } });
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Banner de acceso prioritario al escáner en puerta */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Monitoreá tus ventas en tiempo real y gestioná el ingreso de los asistentes al evento.
          </p>
        </div>
        
        {/* Este link simplemente saca al usuario hacia la pantalla de la cámara */}
        <Link 
          href="/seller/scan"
          className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-4 rounded-2xl font-bold shadow-md text-center text-base transition-transform active:scale-[0.98]"
        >
          Abrir Escáner QR
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Tarjeta 1: Total Emitidas */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Ticket size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Entradas Emitidas</span>
            <span className="text-2xl font-bold text-slate-800">{totalEntradas}</span>
          </div>
        </div>

        {/* Tarjeta 2: Ya Ingresaron (Asistencia) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Ingresos (Check-in)</span>
            <span className="text-2xl font-bold text-slate-800">
              {totalUsadas} <span className="text-xs font-normal text-slate-400">/ {totalEntradas}</span>
            </span>
          </div>
        </div>

        {/* Tarjeta 3: Ritmo de Asistencia % */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Users2 size={24} />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Porcentaje de Público</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-800">{porcentajeAsistencia}%</span>
              {/* Pequeña barra visual de progreso */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="bg-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${porcentajeAsistencia}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tu componente original inyectado limpiamente */}
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
  );
}

