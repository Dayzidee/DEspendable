import { NextResponse } from 'next/server';

export async function GET() {
    const transactions = [
        { id: 1, type: 'income', amount: 2500.00, description: 'Salary Deposit', category: 'Income', date: new Date().toISOString() },
        { id: 2, type: 'expense', amount: -45.99, description: 'Amazon.de', category: 'Shopping', date: new Date().toISOString() },
        { id: 3, type: 'expense', amount: -12.50, description: 'Netflix Subscription', category: 'Entertainment', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 4, type: 'expense', amount: -34.20, description: 'Uber Eats', category: 'Food', date: new Date(Date.now() - 172800000).toISOString() },
        { id: 5, type: 'income', amount: 150.00, description: 'Refund', category: 'Income', date: new Date(Date.now() - 259200000).toISOString() },
    ];

    return NextResponse.json(transactions);
}
