import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const loansSnapshot = await db
            .collection('loans')
            .where('user_id', '==', userId)
            .get();

        const loans = loansSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate?.() || new Date()
        }));

        return NextResponse.json(loans);
    } catch (error: any) {
        console.error('Loans API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { amount, purpose, term } = await request.json();

        if (!amount || !term) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Simple automatic approval for demo purposes
        const newLoan = {
            user_id: userId,
            amount: Number(amount),
            purpose: purpose || 'Personal',
            term: Number(term),
            interest_rate: 3.5,
            status: 'active',
            monthly_payment: (Number(amount) * 1.05) / Number(term),
            remaining_balance: Number(amount),
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('loans').add(newLoan);

        return NextResponse.json({ id: docRef.id, ...newLoan });
    } catch (error: any) {
        console.error('Loan Application Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
