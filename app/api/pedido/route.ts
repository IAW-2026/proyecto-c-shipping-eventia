import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"; 
import { generarIdEntrada } from "@/lib/util";

export async function POST(request: Request) {
    const {id_pedido, cantidad, nombre_evento, id_usuario} = await request.json();
    
    const id_generado = generarIdEntrada();

    try {
        const nuevaEntrada= await prisma.entrada.create({
            data: {
                id_entrada: id_generado,
                id_pedido: id_pedido,
                cantidad: cantidad,
                nombre_evento: nombre_evento,
                id_usuario: id_usuario,
                estado: "pendiente",
            },
        });
        return NextResponse.json(id_generado.toString(), { status: 201 });

    } catch (error) {
        console.error("Error creando pedido:", error);
        return NextResponse.json({ error: "Error creando pedido" }, { status: 500 });
    }
}
