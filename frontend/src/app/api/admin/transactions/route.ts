import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/adminCheck';

export async function GET(request: NextRequest) {
    try {
        await verifyAdmin(request.headers.get('Authorization'));

        const txSnapshot = await db.collection('transactions')
            .orderBy('date', 'desc')
            .limit(100)
            .get();

        const transactions = txSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error('Admin Transactions API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
