import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generarIdEntrada, validarApiKey } from "@/lib/util";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const shippingKey = process.env.SHIPPING_API_KEY;
    if (!validarApiKey(request, shippingKey)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id_pedido, cantidad, id_evento, id_usuario } = await request.json();
        const cantidadEntradas= Number(cantidad);

        const sellerUrl = process.env.URL_SELLER ?? 'http://localhost:3000';
        const sellerKey = process.env.SELLER_API_KEY;

        const res = await fetch(`${sellerUrl}/api/seller/eventos/${id_evento}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': sellerKey ?? ''
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: "No se encontró el evento en Seller" }, { status: 404 });
        }

        const evento = await res.json();

        const idOrganizador = evento.idOrganizador;

        if (!idOrganizador) {
            return NextResponse.json({ error: "El evento no posee un organizador asignado" }, { status: 400 });
        }

        const datosEntradas = Array.from({ length: cantidadEntradas }, () => ({
            id_entrada: generarIdEntrada(),
            id_pedido,
            id_evento,
            id_usuario,
            id_organizador: idOrganizador,
            estado: "Pendiente",
        }));

        await prisma.entrada.createMany({
            data: datosEntradas,
        });

        const entradasCreadasSerializadas = datosEntradas.map(entrada => ({
            ...entrada,
            id_entrada: entrada.id_entrada.toString(),
            id_pedido: entrada.id_pedido.toString(),
        }));

        return NextResponse.json({ message: "Pedido creado con éxito", entrada: entradasCreadasSerializadas }, { status: 201 });

    } catch (error) {
        console.error("Error procesando pedido:", error);
        return NextResponse.json({ error: "Error interno creando pedido" }, { status: 500 });
    }
}
