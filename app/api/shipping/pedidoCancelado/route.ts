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
        const { idPedido} = await request.json();

        const entradaPendiente = await prisma.entrada.updateMany({
            where: { id_pedido: Number(idPedido) },
            data: { estado: "Cancelado" }
        })

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("Error cancelando entrada:", error);

        if (error.code === 'P2025') {
            return new NextResponse("Pedido no encontrado", { status: 404 });
        }

        return new NextResponse(null, { status: 500 });
    }
}