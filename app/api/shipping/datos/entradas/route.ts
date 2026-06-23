import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { validarApiKey } from "@/lib/util";

export async function GET(request: Request) {

    const shippingKey = process.env.SHIPPING_API_KEY;
    if (!validarApiKey(request, shippingKey)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try{ 
        const entradas = await prisma.entrada.findMany();
        const entradasSerializadas = entradas.map(entrada => ({
            ...entrada,
            id_entrada: entrada.id_entrada.toString()
       }));
     return NextResponse.json(entradasSerializadas);
    }
   catch (error) {
        console.error("Error en la API de entradas:", error); 
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return NextResponse.json(
            { error: "Internal Server Error", detalle: mensaje }, 
            { status: 500 }
        );
    }
}
