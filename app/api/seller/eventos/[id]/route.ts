import { NextResponse } from 'next/server';
import { eventos } from '@/data/eventos';
import { validarApiKey } from "@/lib/util";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: Request, { params }: Params) {
    const sellerKey = process.env.SELLER_API_KEY;
    if (!validarApiKey(_request, sellerKey)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const idEvento = Number(id);

    const evento = eventos.find((e) => e.idEvento === idEvento);

    if (!evento) {
        return NextResponse.json(
            { error: 'Evento no encontrado' },
            { status: 404 }
        );
    }

    return NextResponse.json(evento);
}