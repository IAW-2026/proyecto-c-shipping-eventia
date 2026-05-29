import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function POST(request: Request) {
  try {
    const {id} = await request.json();

    const entradaEscaneada = await prisma.entrada.findUnique({
      where: { id_entrada: id },
    });

    if (!entradaEscaneada) {
      return NextResponse.json({ message: 'Entrada no encontrada' }, { status: 404 });
    }

    if (entradaEscaneada.estado === 'Usado') {
      return NextResponse.json({ 
        message: 'Esta entrada ya fue utilizada',
        entradaEscaneada 
      }, { status: 409 }); // 409 Conflict
    }

    // Caso C: El ticket está cancelado o inválido
    if (entradaEscaneada.estado === 'Cancelada') {
      return NextResponse.json({ message: 'Esta entrada fue cancelada' }, { status: 403 });
    }

    // Caso D: Todo perfecto ("disponible") -> Cambiamos el estado de inmediato
    const entradaActualizada = await prisma.entrada.update({
      where: { id_entrada: id },
      data: { 
        estado: 'Usado',
      },
    });

    return NextResponse.json({ 
      message: 'Acceso concedido', 
      entrada: entradaActualizada 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}