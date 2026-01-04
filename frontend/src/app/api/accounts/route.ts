import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const accountsSnapshot = await db
            .collection('accounts')
            .where('owner_uid', '==', userId)
            .get();

        const accounts = accountsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'Girokonto',
                type: data.type || 'Checking',
                balance: Number(data.balance || 0),
                iban: data.iban || 'DE****0000',
                status: data.status || 'Active',
                currency: data.currency || 'EUR'
            };
        });

        return NextResponse.json(accounts);
    } catch (error: any) {
        console.error('Accounts API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
