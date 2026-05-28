import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { id_pedido, estado } = await request.json();

        const entradaPendiente = await prisma.entrada.updateMany({
            where : { id_pedido: Number(id_pedido) },
            data : { estado: estado }
        })

        return new NextResponse(null, { status: 204 });
    } catch (error : any) {
        console.error("Error actualizando entrada:", error);

        if(error.code === 'P2025') {
            return new NextResponse("Pedido no encontrado", { status: 404 });
        }

        return new NextResponse(null, { status: 500 });
    }
}