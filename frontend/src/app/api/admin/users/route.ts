import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/adminCheck';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request.headers.get('Authorization'));

    const usersSnapshot = await db.collection('users').get();

    // Fetch users with their account balances
    const usersWithBalances = await Promise.all(
      usersSnapshot.docs.map(async (doc) => {
        const userData = doc.data();

        // Get user's checking account balance
        const accountsSnapshot = await db.collection('accounts')
          .where('owner_uid', '==', doc.id)
          .where('type', '==', 'Checking')
          .limit(1)
          .get();

        let balance = 0;
        if (!accountsSnapshot.empty) {
          balance = Number(accountsSnapshot.docs[0].data().balance || 0);
        }

        return {
          id: doc.id,
          email: userData.email,
          name: userData.displayName || userData.name,
          status: userData.status || 'active',
          tier: userData.tier || 'Standard',
          balance: balance,
          created_at: userData.created_at,
          is_admin: userData.is_admin || false
        };
      })
    );

    return NextResponse.json(usersWithBalances);
  } catch (error: any) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await verifyAdmin(request.headers.get('Authorization'));
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing userId or status' }, { status: 400 });
    }

    await db.collection('users').doc(userId).update({
      status,
      updated_at: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request.headers.get('Authorization'));
    const body = await request.json();
    const { userId, amount, type, description } = body;

    if (!userId || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's primary checking account
    const accountsSnapshot = await db.collection('accounts')
      .where('owner_uid', '==', userId)
      .where('type', '==', 'Checking')
      .limit(1)
      .get();

    if (accountsSnapshot.empty) {
      return NextResponse.json({ error: 'No checking account found for user' }, { status: 404 });
    }

    const accountDoc = accountsSnapshot.docs[0];
    const accountRef = db.collection('accounts').doc(accountDoc.id);
    const currentBalance = Number(accountDoc.data().balance || 0);
    const adjustment = type === 'credit' ? Number(amount) : -Number(amount);
    const newBalance = currentBalance + adjustment;

    // Prevent negative balances from debit operations
    if (newBalance < 0 && type === 'debit') {
      return NextResponse.json({ error: 'Insufficient balance for debit operation' }, { status: 400 });
    }

    // Update account balance
    await accountRef.update({
      balance: newBalance,
      updated_at: FieldValue.serverTimestamp()
    });

    // Record the adjustment as a transaction
    await db.collection('transactions').add({
      user_id: userId,
      from_account_id: type === 'debit' ? accountDoc.id : null,
      to_account_id: type === 'credit' ? accountDoc.id : null,
      amount: Math.abs(adjustment),
      description: description || `Admin ${type}: €${amount}`,
      reference: description || `Admin ${type}`,
      created_at: FieldValue.serverTimestamp(),
      status: 'completed',
      type: type === 'credit' ? 'admin_deposit' : 'admin_withdrawal',
      sender_name: 'System Admin',
      recipient_name: userDoc.data()?.email || 'User',
      category: 'Admin Adjustment'
    });

    return NextResponse.json({ success: true, newBalance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
