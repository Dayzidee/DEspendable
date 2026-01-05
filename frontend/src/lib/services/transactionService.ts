import { db } from '../firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { TANService } from './tanService';

interface TransactionData {
  from_account_id: string;
  amount: number;
  type: 'internal' | 'external';
  recipient_info: {
    to_account_id?: string;
    recipient_account_number?: string;
    name?: string;
  };
  reference: string;
  category?: string;
}

export class TransactionService {
  /**
   * Initiate a transfer.
   * Creates a pending transaction and a TAN challenge.
   */
  static async initiateTransfer(userId: string, data: TransactionData) {
    // Basic Validation
    if (data.amount <= 0) {
      throw new Error('Betrag muss positiv sein');
    }

    const fromAccRef = db.collection('accounts').doc(data.from_account_id);
    const fromAccDoc = await fromAccRef.get();

    if (!fromAccDoc.exists) {
      throw new Error('Absenderkonto nicht gefunden');
    }
    if (fromAccDoc.data()?.owner_uid !== userId) {
      throw new Error('Zugriff verweigert');
    }
    if (fromAccDoc.data()?.balance < data.amount) {
      throw new Error('Unzureichendes Guthaben');
    }

    // Determine Recipient Identifier for TAN
    let recipientIdentifier = '';
    if (data.type === 'internal') {
      recipientIdentifier = data.recipient_info.to_account_id || 'unknown';
    } else {
      recipientIdentifier = data.recipient_info.recipient_account_number || 'unknown';
    }

    // Create Pending Transaction
    const txData = {
      ...data,
      user_id: userId,
      status: 'pending_authorization',
      created_at: FieldValue.serverTimestamp(),
    };

    const txRef = await db.collection('transactions').add(txData);

    // Create TAN Challenge
    const { tanId, challengeData } = await TANService.createTanChallenge(
      userId,
      txRef.id,
      data.amount,
      recipientIdentifier
    );

    // Link TAN to Transaction
    await txRef.update({ tan_id: tanId });

    return {
      transactionId: txRef.id,
      tanId,
      challengeData,
    };
  }

  /**
   * Execute a transfer after TAN verification.
   */
  static async executeTransfer(
    userId: string,
    transactionId: string,
    tanInput: string,
    tanId: string
  ) {
    // 1. Fetch Transaction
    const txRef = db.collection('transactions').doc(transactionId);
    const txDoc = await txRef.get();

    if (!txDoc.exists) {
      throw new Error('Transaktion nicht gefunden');
    }

    const txData = txDoc.data() as any;

    if (txData.user_id !== userId) {
      throw new Error('Zugriff verweigert');
    }

    if (txData.status !== 'pending_authorization') {
      throw new Error('Transaktion bereits verarbeitet oder ungültig');
    }

    // 2. Validate TAN
    let recipientIdentifier = '';
    if (txData.type === 'internal') {
      recipientIdentifier = txData.recipient_info.to_account_id || 'unknown';
    } else {
      recipientIdentifier = txData.recipient_info.recipient_account_number || 'unknown';
    }

    const { isValid, error } = await TANService.validateTan(
      tanId,
      tanInput,
      transactionId,
      txData.amount,
      recipientIdentifier
    );

    if (!isValid) {
      throw new Error(error || 'TAN ungültig');
    }

    // 3. Execute Atomically using Firestore Transaction
    await db.runTransaction(async (t) => {
      // --- READ PHASE ---

      // Read source account
      const fromAccRef = db.collection('accounts').doc(txData.from_account_id);
      const fromAccSnap = await t.get(fromAccRef);

      if (!fromAccSnap.exists) {
        throw new Error("Absenderkonto existiert nicht mehr");
      }

      // If internal, read recipient account
      let toAccRef: any = null;
      let toAccSnap: any = null;

      if (txData.type === 'internal' && txData.recipient_info.to_account_id) {
        toAccRef = db.collection('accounts').doc(txData.recipient_info.to_account_id);
        toAccSnap = await t.get(toAccRef);
      } else if (txData.type === 'external') {
        // Attempt to find internal recipient by account number?
        // Firestore transactions cannot run queries that are not document lookups easily if data can change.
        // Queries in transactions require all docs to be read.
        // For SIMPLICITY and SAFETY in this demo:
        // We will NOT query for external recipient users inside the transaction to avoid complexity.
        // External transfers will just deduct funds.
      }

      // --- LOGIC PHASE ---
      const currentBalance = fromAccSnap.data()?.balance || 0;
      const amount = Number(txData.amount);

      if (currentBalance < amount) {
        throw new Error("Unzureichendes Guthaben (Saldo hat sich geändert)");
      }

      // --- WRITE PHASE ---

      // Deduct from sender
      t.update(fromAccRef, { balance: currentBalance - amount });

      // Credit Recipient (if internal and found)
      if (toAccRef && toAccSnap && toAccSnap.exists) {
        const newBal = (toAccSnap.data()?.balance || 0) + amount;
        t.update(toAccRef, { balance: newBal });
      }

      // Update Transaction Status
      t.update(txRef, {
        status: 'completed',
        completed_at: FieldValue.serverTimestamp(),
        notes: txData.reference
      });
    });

    return { success: true };
  }
}
