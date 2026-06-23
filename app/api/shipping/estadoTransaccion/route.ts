import prisma from "@/lib/prisma";
import { validarApiKey } from "@/lib/util";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const shippingKey = process.env.SHIPPING_API_KEY;

    if (!validarApiKey(request, shippingKey)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
        const { idPedido, estadoTransaccion } = await request.json();
        let estadoFinal: string;

        if (estadoTransaccion === 'APROBADA') {
            estadoFinal = "Confirmado";
        } else if (estadoTransaccion === 'FALLIDA' || estadoTransaccion === 'CANCELADA') {
            estadoFinal = "Cancelado";
        } else {
            return new NextResponse("Estado no válido", { status: 400 });
        }

        const entradaPendiente = await prisma.entrada.updateMany({
            where: { id_pedido: Number(idPedido) },
            data: { estado: estadoFinal }
        })

        return new NextResponse("Estado de transacción actualizado", { status: 200 });
    } catch (error: any) {
        console.error("Error actualizando entrada:", error);

        if (error.code === 'P2025') {
            return new NextResponse("Pedido no encontrado", { status: 404 });
        }

        return new NextResponse("Error en el servidor", { status: 500 });
    }
}
