import { NextResponse } from 'next/server';

export async function GET() {
    const loans: any[] = [];
    return NextResponse.json(loans);
}
