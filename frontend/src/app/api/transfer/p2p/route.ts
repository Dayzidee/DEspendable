import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const senderId = decodedToken.uid;

        const { recipientId, amount, message } = await request.json();

        if (!recipientId || !amount || Number(amount) <= 0) {
            return NextResponse.json({ error: 'Invalid recipient or amount' }, { status: 400 });
        }

        // Perform transfer in a transaction
        await db.runTransaction(async (transaction) => {
            // 1. Get sender checking account
            const senderAccounts = await db.collection('accounts')
                .where('owner_uid', '==', senderId)
                .where('type', '==', 'Checking')
                .get();

            if (senderAccounts.empty) throw new Error('Sender checking account not found');
            const senderAccountRef = senderAccounts.docs[0].ref;
            const senderAccountData = senderAccounts.docs[0].data();

            // 2. Get recipient checking account
            const recipientAccounts = await db.collection('accounts')
                .where('owner_uid', '==', recipientId)
                .where('type', '==', 'Checking')
                .get();

            if (recipientAccounts.empty) throw new Error('Recipient checking account not found');
            const recipientAccountRef = recipientAccounts.docs[0].ref;
            const recipientAccountData = recipientAccounts.docs[0].data();

            if (senderAccountData.balance < Number(amount)) {
                throw new Error('Insufficient balance');
            }

            // 3. Update balances
            transaction.update(senderAccountRef, {
                balance: FieldValue.increment(-Number(amount))
            });

            transaction.update(recipientAccountRef, {
                balance: FieldValue.increment(Number(amount))
            });

            // 4. Create transaction records
            const txRef = db.collection('transactions').doc();
            transaction.set(txRef, {
                user_id: senderId,
                type: 'Sent',
                category: 'Transfer',
                amount: -Number(amount),
                recipient: recipientAccountData.name || 'DEspendables User',
                message: message || 'P2P Transfer',
                created_at: FieldValue.serverTimestamp()
            });

            const rxRef = db.collection('transactions').doc();
            transaction.set(rxRef, {
                user_id: recipientId,
                type: 'Received',
                category: 'Transfer',
                amount: Number(amount),
                sender: senderAccountData.name || 'DEspendables User',
                message: message || 'P2P Transfer',
                created_at: FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('P2P Transfer Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
