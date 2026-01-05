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

        const goalsSnapshot = await db.collection('goals')
            .where('userId', '==', userId)
            // .orderBy('created_at', 'desc') // Requires index, sorting in memory instead
            .get();

        const goals = goalsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).sort((a: any, b: any) => {
            const dateA = a.created_at?.toMillis ? a.created_at.toMillis() : 0;
            const dateB = b.created_at?.toMillis ? b.created_at.toMillis() : 0;
            return dateB - dateA;
        });

        return NextResponse.json(goals);
    } catch (error: any) {
        console.error('Goals GET API Error:', error);
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

        const body = await request.json();
        const { name, targetAmount, currentAmount, category, deadline, icon } = body;

        if (!name || !targetAmount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const goalData = {
            userId,
            name,
            targetAmount: Number(targetAmount),
            currentAmount: Number(currentAmount || 0),
            category: category || 'General',
            deadline: deadline || null,
            icon: icon || '🎯',
            created_at: FieldValue.serverTimestamp(),
            updated_at: FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('goals').add(goalData);

        return NextResponse.json({ id: docRef.id, ...goalData });
    } catch (error: any) {
        console.error('Goals POST API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { searchParams } = new URL(request.url);
        const goalId = searchParams.get('id');

        if (!goalId) {
            return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
        }

        const goalRef = db.collection('goals').doc(goalId);
        const goalDoc = await goalRef.get();

        if (!goalDoc.exists) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        if (goalDoc.data()?.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await goalRef.delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Goals DELETE API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const body = await request.json();
        const { id, amount } = body;

        if (!id || amount === undefined) {
            return NextResponse.json({ error: 'Missing goal ID or amount' }, { status: 400 });
        }

        const goalRef = db.collection('goals').doc(id);
        const goalDoc = await goalRef.get();

        if (!goalDoc.exists) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        if (goalDoc.data()?.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Increment currentAmount
        await goalRef.update({
            currentAmount: FieldValue.increment(Number(amount)),
            updated_at: FieldValue.serverTimestamp()
        });

        // Optionally: Create a transaction record for this funding event
        // (For now we just update the goal balance)

        const updatedDoc = await goalRef.get();
        return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error: any) {
        console.error('Goals PATCH API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
