import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

function generateIBAN() {
  const bankCode = '10050000'; // Example Bank Code
  const accountNumber = crypto.randomInt(1000000000, 9999999999).toString();
  const country = 'DE';
  // Simplified Checksum (Not valid algorithm, just for format)
  const checksum = '00';
  return `${country}${checksum}${bankCode}${accountNumber}`;
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

    if (userDoc.exists) {
      return NextResponse.json({ message: 'User already initialized' });
    }

    // Initialize User & Accounts
    const accountNumber = crypto.randomInt(1000000000, 9999999999).toString();

    const batch = db.batch();

    // 1. Create User Document
    batch.set(userRef, {
      email: email,
      account_number: accountNumber,
      created_at: FieldValue.serverTimestamp(),
      is_admin: false,
      settings: {
        discreet_mode: false,
        theme: 'light'
      }
    });

    // 2. Create Checking Account (Girokonto)
    const checkingRef = db.collection('accounts').doc();
    batch.set(checkingRef, {
      owner_uid: userId,
      type: 'Checking',
      name: 'Girokonto',
      balance: 1500.00, // Starting balance
      iban: generateIBAN(),
      currency: 'EUR',
      created_at: FieldValue.serverTimestamp()
    });

    // 3. Create Savings Account (Tagesgeld)
    const savingsRef = db.collection('accounts').doc();
    batch.set(savingsRef, {
      owner_uid: userId,
      type: 'Savings',
      name: 'Tagesgeld',
      balance: 5000.00,
      iban: generateIBAN(),
      currency: 'EUR',
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
