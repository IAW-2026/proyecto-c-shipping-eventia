import {NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    const estado = body.estado;

    return NextResponse.json({
        estado: estado
    });
}