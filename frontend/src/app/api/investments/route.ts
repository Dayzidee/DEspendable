import { NextResponse } from 'next/server';

export async function GET() {
    const investments = [
        { id: 1, name: 'S&P 500 ETF', value: 5200.50, change: '+1.2%', type: 'ETF' },
        { id: 2, name: 'Tech Growth Fund', value: 3400.20, change: '+3.5%', type: 'Mutual Fund' },
        { id: 3, name: 'Global Bonds', value: 3849.30, change: '+0.4%', type: 'Bond' },
    ];

    return NextResponse.json(investments);
}
