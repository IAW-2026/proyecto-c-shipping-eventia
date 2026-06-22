import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { validarApiKey } from "@/lib/util";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(request: Request) {

    const shippingKey = process.env.SHIPPING_API_KEY;
    if (!validarApiKey(request, shippingKey)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try{ 
        const entradas = await prisma.entrada.findMany();
        return NextResponse.json(entradas);
    }
    catch (error) {
        return NextResponse.json({error: "Error devolviendo datos de entradas" }, { status: 500 });
    }

}