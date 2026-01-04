import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
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

        const investmentsSnapshot = await db
            .collection('investments')
            .where('user_id', '==', userId)
            .get();

        if (investmentsSnapshot.empty) {
            // Seed default investments if none exist
            const defaultInvestments = [
                { name: "S&P 500 ETF", value: 5200.50, change: "+1.2%", category: "Equity", color: "blue" },
                { name: "Tech Growth Fund", value: 3400.20, change: "+3.5%", category: "Equity", color: "green" },
                { name: "Global Bonds", value: 3849.30, change: "+0.4%", category: "Bonds", color: "orange" }
            ];

            const batch = db.batch();
            defaultInvestments.forEach(inv => {
                const ref = db.collection('investments').doc();
                batch.set(ref, { ...inv, user_id: userId, created_at: FieldValue.serverTimestamp() });
            });
            await batch.commit();

            return NextResponse.json(defaultInvestments);
        }

        const investments = investmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(investments);
    } catch (error: any) {
        console.error('Investments API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
