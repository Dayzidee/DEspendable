import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

function generateAccountNumber() {
  return crypto.randomInt(1000000000, 9999999999).toString();
}

function generateIBAN() {
  const bankCode = '10050000'; // DEspendables Bank Code
  const country = 'DE';
  const checksum = crypto.randomInt(10, 99).toString();
  const partialAccount = crypto.randomInt(1000000000, 9999999999).toString();
  return `${country}${checksum}${bankCode}${partialAccount}`;
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
    const email = decodedToken.email;

    // Check if user already exists in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists && userDoc.data()?.account_number) {
      return NextResponse.json({ message: 'User already initialized', account_number: userDoc.data()?.account_number });
    }

    // Initialize User & Accounts
    const accountNumber = generateAccountNumber();

    const batch = db.batch();

    // 1. Create/Update User Document
    batch.set(userRef, {
      email: email,
      account_number: accountNumber,
      created_at: FieldValue.serverTimestamp(),
      is_admin: false,
      account_tier: 'Standard',
      settings: {
        discreet_mode: false,
        theme: 'light',
        language: 'de'
      }
    }, { merge: true });

    // 2. Create Checking Account (Girokonto)
    const checkingRef = db.collection('accounts').doc();
    batch.set(checkingRef, {
      owner_uid: userId,
      type: 'Checking',
      name: 'Checking Account',
      display_name: 'Girokonto',
      balance: 0.00, // Zero initial balance as requested
      iban: generateIBAN(),
      currency: 'EUR',
      status: 'Active',
      created_at: FieldValue.serverTimestamp()
    });

    // 3. Create Savings Account (Tagesgeld)
    const savingsRef = db.collection('accounts').doc();
    batch.set(savingsRef, {
      owner_uid: userId,
      type: 'Savings',
      name: 'Savings Account',
      display_name: 'Tagesgeld',
      balance: 0.00, // Zero initial balance as requested
      iban: generateIBAN(),
      currency: 'EUR',
      status: 'Active',
      created_at: FieldValue.serverTimestamp()
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      account_number: accountNumber
    });

  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
