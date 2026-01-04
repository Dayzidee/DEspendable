import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fetch Accounts
    const accountsSnapshot = await db
      .collection('accounts')
      .where('owner_uid', '==', userId)
      .get();

    const accounts = accountsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure balance is number
      balance: Number(doc.data().balance)
    }));

    // Fetch Recent Transactions (Limit 5)
    // Note: In a real app, we'd query transactions where user is sender OR recipient.
    // Firestore OR queries are limited. We'll query by user_id (sender) for now.
    const transactionsSnapshot = await db
      .collection('transactions')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(5)
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.created_at instanceof Timestamp) {
        data.created_at = data.created_at.toDate().toISOString();
      } else if (data.completed_at instanceof Timestamp) {
        // Fallback for sorting if needed, or ensuring completed_at is safe
        data.completed_at = data.completed_at.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data
      };
    });

    // Calculate Total Balance
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    return NextResponse.json({
      accounts,
      transactions,
      total_balance: totalBalance,
      last_login: new Date().toISOString() // Simulating last login update
    });

  } catch (error: any) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
