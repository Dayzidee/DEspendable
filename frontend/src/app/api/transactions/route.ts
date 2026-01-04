import { NextRequest, NextResponse } from 'next/server';
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    // Simplified filtering
    const type = searchParams.get('type'); // 'send' or 'receive'

    let query = db.collection('transactions')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(limit);

    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();

    const transactions = snapshot.docs.map(doc => {
      const data = doc.data();
      if (data.created_at instanceof Timestamp) {
        data.created_at = data.created_at.toDate().toISOString();
      }
      if (data.completed_at instanceof Timestamp) {
        data.completed_at = data.completed_at.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data
      };
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Transactions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
