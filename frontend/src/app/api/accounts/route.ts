import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

function generateIBAN() {
    const bankCode = '10050000'; // DEspendables Bank Code
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

        const accountsSnapshot = await db
            .collection('accounts')
            .where('owner_uid', '==', userId)
            .get();

        // If user has no accounts, create them automatically
        if (accountsSnapshot.empty) {
            console.log(`User ${userId} has no accounts. Creating default accounts...`);

            const batch = db.batch();

            // Create Checking Account (Girokonto)
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

            // Create Savings Account (Tagesgeld)
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

            // Fetch the newly created accounts
            const newAccountsSnapshot = await db
                .collection('accounts')
                .where('owner_uid', '==', userId)
                .get();

            const accounts = newAccountsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Girokonto',
                    type: data.type || 'Checking',
                    balance: Number(data.balance || 0),
                    iban: data.iban || 'DE****0000',
                    status: data.status || 'Active',
                    currency: data.currency || 'EUR'
                };
            });

            return NextResponse.json(accounts);
        }

        const accounts = accountsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || 'Girokonto',
                type: data.type || 'Checking',
                balance: Number(data.balance || 0),
                iban: data.iban || 'DE****0000',
                status: data.status || 'Active',
                currency: data.currency || 'EUR'
            };
        });

        return NextResponse.json(accounts);
    } catch (error: any) {
        console.error('Accounts API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
