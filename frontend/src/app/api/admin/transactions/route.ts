import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/adminCheck';

export async function GET(request: NextRequest) {
    try {
        await verifyAdmin(request.headers.get('Authorization'));

        const txSnapshot = await db.collection('transactions')
            .orderBy('created_at', 'desc')
            .limit(100)
            .get();

        const transactions = txSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                amount: data.amount,
                description: data.description || data.reference,
                recipient: data.recipient_name || data.to_account_id,
                sender: data.sender_name || data.from_account_id,
                date: data.created_at?.toDate?.()?.toISOString() || data.created_at,
                status: data.status,
                type: data.type,
                category: data.category
            };
        });

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error('Admin Transactions API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
