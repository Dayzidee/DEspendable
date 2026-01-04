import { NextResponse } from 'next/server';

export async function GET() {
    const accounts = [
        { id: '1', name: 'Main Checking', type: 'Checking', balance: 2450.50, iban: 'DE89 3705 0000 1234 5678 90', status: 'Active' },
        { id: '2', name: 'Emergency Fund', type: 'Savings', balance: 15000.00, iban: 'DE45 3705 0000 9876 5432 10', status: 'Active' },
        { id: '3', name: 'Travel Savings', type: 'Savings', balance: 3200.00, iban: 'DE12 3705 0000 5555 4444 33', status: 'Active' },
    ];

    return NextResponse.json(accounts);
}
