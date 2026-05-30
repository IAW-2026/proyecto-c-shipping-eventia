"use server";

import prisma from "@/lib/prisma";

interface ValidarQrResponse {
  success: boolean;
  status: number;
  message: string;
  entrada?: {
    id_entrada: string;
    id_pedido: number;
    id_evento: number;
    estado: string;
    [key: string]: any; // Permite cualquier otra propiedad que tenga tu modelo Entrada
  };
}

export async function validarQrAction(qrData: string): Promise<ValidarQrResponse> {
  try {
    const entradaEscaneada = await prisma.entrada.findUnique({
      where: { id_entrada: BigInt(qrData) },
    });

    if (!entradaEscaneada) {
      return { 
        success: false, 
        status: 404, 
        message: 'Entrada no encontrada' 
      };
    }

    if (entradaEscaneada.estado === 'Usado') {
      return {
        success: false,
        status: 409,
        message: 'Esta entrada ya fue utilizada'
      };
    }

    if (entradaEscaneada.estado === 'Cancelada') {
      return { 
        success: false, 
        status: 403, 
        message: 'Esta entrada fue cancelada' 
      };
    }

    const entradaActualizada = await prisma.entrada.update({
      where: { id_entrada: BigInt(qrData) },
      data: {
        estado: 'Usado',
      },
    });

    const entradaConvertida = {
      ...entradaActualizada,
      id_entrada: entradaActualizada.id_entrada.toString(),
      id_pedido: Number(entradaActualizada.id_pedido), 
      id_evento: Number(entradaActualizada.id_evento), 
    };

    return {
      success: true,
      status: 200,
      message: 'Acceso concedido',
      entrada: entradaConvertida
    };

  } catch (error) {
    console.error("🚨 Error interno en validarQrAction:", error);
    return { 
      success: false, 
      status: 500, 
      message: 'Error interno del servidor' 
    };
  }
}