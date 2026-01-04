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

        return NextResponse.json(cards[0]); // Return the primary card
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
