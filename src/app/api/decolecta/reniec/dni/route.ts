import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const numero = searchParams.get('numero');

    if (!numero) {
        return NextResponse.json({ error: 'Parámetro numero es requerido' }, { status: 400 });
    }

    try {
        const token = process.env.DECOLECTA_API_TOKEN;
        if (!token) {
            return NextResponse.json({ error: 'Token de Decolecta no configurado' }, { status: 500 });
        }

        const response = await fetch(`https://api.decolecta.com/v1/reniec/dni?numero=${numero}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en proxy DNI:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}