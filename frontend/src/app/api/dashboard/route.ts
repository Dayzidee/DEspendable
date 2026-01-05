import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import crypto from 'crypto';

function generateIBAN() {
  const bankCode = '10050000';
  const country = 'DE';
  const checksum = crypto.randomInt(10, 99).toString();
  const partialAccount = crypto.randomInt(1000000000, 9999999999).toString();
  return `${country}${checksum}${bankCode}${partialAccount}`;
}

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
    const accountsSnapshot = await db.collection('accounts')
      .where('owner_uid', '==', userId)
      .get();

    // Auto-initialize accounts if user has none
    if (accountsSnapshot.empty) {
      console.log(`Dashboard: User ${userId} has no accounts.Creating default accounts...`);
      const batch = db.batch();

      const checkingRef = db.collection('accounts').doc();
      batch.set(checkingRef, {
        owner_uid: userId,
        type: 'Checking',
        name: 'Checking Account',
        display_name: 'Girokonto',
        balance: 0.00,
        iban: generateIBAN(),
        currency: 'EUR',
        status: 'Active',
        created_at: FieldValue.serverTimestamp()
      });

      const savingsRef = db.collection('accounts').doc();
      batch.set(savingsRef, {
        owner_uid: userId,
        type: 'Savings',
        name: 'Savings Account',
        display_name: 'Tagesgeld',
        balance: 0.00,
        iban: generateIBAN(),
        currency: 'EUR',
        status: 'Active',
        created_at: FieldValue.serverTimestamp()
      });

      await batch.commit();
    }

    // Re-fetch accounts after potential creation
    const finalAccountsSnapshot = await db.collection('accounts')
      .where('owner_uid', '==', userId)
      .get();

    const accounts = await Promise.all(finalAccountsSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      let iban = data.iban;
      let balance = Number(data.balance);

      if (isNaN(balance)) balance = 0;

      // Self-healing: Generate IBAN if missing
      if (!iban) {
        const newIban = generateIBAN();
        await db.collection('accounts').doc(doc.id).update({ iban: newIban });
        iban = newIban;
      }

      return {
        id: doc.id,
        account_name: data.name || 'Girokonto',
        masked_account_number: iban ? `DE **** ${iban.slice(-4)}` : 'DE **** 0000',
        balance: balance,
        currency: data.currency || 'EUR',
        type: data.type || 'Checking'
      };
    }));

    // Fetch Recent Transactions (Limit 20 for analytics)
    const transactionsSnapshot = await db
      .collection('transactions')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();

    const transactions = transactionsSnapshot.docs.map(doc => {
      const data = doc.data();
      let timestamp = new Date().toISOString();

      if (data.created_at instanceof Timestamp) {
        timestamp = data.created_at.toDate().toISOString();
      } else if (data.completed_at instanceof Timestamp) {
        timestamp = data.completed_at.toDate().toISOString();
      }

      return {
        id: doc.id,
        type: data.type || 'transfer',
        amount: Number(data.amount || 0),
        timestamp: timestamp,
        status: data.status || 'completed',
        description: data.reference || data.recipient_name || data.recipient_iban || 'Bank Transfer',
        category: data.category || 'Finances',
        recipient: data.recipient_name || data.recipient_iban || 'Unknown'
      };
    });

    // Aggregate Spending by Category
    const spendingByCategory: Record<string, number> = {};
    transactions.filter(tx => tx.amount < 0).forEach(tx => {
      const cat = tx.category || 'Other';
      spendingByCategory[cat] = (spendingByCategory[cat] || 0) + Math.abs(tx.amount);
    });

    // Calculate Total Balance
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Fetch User Profile Status
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    return NextResponse.json({
      accounts,
      recent_transactions: transactions,
      spending_by_category: spendingByCategory,
      total_balance: totalBalance,
      firstName: userData?.firstName || '',
      isProfileComplete: !!userData?.isProfileComplete,
      last_login: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Dashboard Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
