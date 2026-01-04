import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const cardsSnapshot = await db
            .collection('cards')
            .where('user_id', '==', userId)
            .get();

        if (cardsSnapshot.empty) {
            // Create a default card for the user if none exist
            const newCard = {
                user_id: userId,
                number: "4532 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000),
                cvv: Math.floor(100 + Math.random() * 900).toString(),
                expiry: "12/28",
                holder: decodedToken.name || "User",
                status: 'active',
                type: 'Premium',
                balance: 2500.00,
                created_at: FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('cards').add(newCard);
            return NextResponse.json({ id: docRef.id, ...newCard });
        }


        const cards = cardsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const card = cards[0];

        // Fetch recent transactions for this user
        const transactionsSnapshot = await db
            .collection('transactions')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc')
            .limit(10)
            .get();

        const transactions = transactionsSnapshot.docs.map(doc => {
            const data = doc.data();
            let timestamp = new Date().toISOString();
            if (data.created_at instanceof Timestamp) {
                timestamp = data.created_at.toDate().toISOString();
            }

            return {
                id: doc.id,
                merchant: data.description || data.recipient_name || 'Merchant',
                amount: Number(data.amount || 0),
                type: data.type || 'payment',
                date: timestamp
            };
        });

        // Calculate monthly spending for limit
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlySpending = transactions
            .filter(tx => new Date(tx.date) >= firstDayOfMonth && tx.amount < 0)
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        return NextResponse.json({
            ...card,
            transactions,
            spending: {
                monthly: monthlySpending,
                limit: 1000.00 // Default limit
            }
        });
    } catch (error: any) {
        console.error('Cards API Error:', error);
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

        const { cardId, action } = await request.json();

        if (!cardId || !action) {
            return NextResponse.json({ error: 'Missing cardId or action' }, { status: 400 });
        }

        const cardRef = db.collection('cards').doc(cardId);
        const cardDoc = await cardRef.get();

        if (!cardDoc.exists || cardDoc.data()?.user_id !== userId) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        if (action === 'freeze') {
            await cardRef.update({ status: 'frozen' });
        } else if (action === 'unfreeze') {
            await cardRef.update({ status: 'active' });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true, status: action === 'freeze' ? 'frozen' : 'active' });
    } catch (error: any) {
        console.error('Cards Action Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
