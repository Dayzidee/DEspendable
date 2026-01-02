import { db } from '../firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import crypto from 'crypto';

interface TanChallenge {
  user_id: string;
  transaction_id: string;
  tan_hash: string;
  dynamic_link: string;
  amount: number;
  recipient: string;
  tan_type: string;
  created_at: FieldValue;
  expires_at: Date;
  status: 'pending' | 'used' | 'expired' | 'locked' | 'cancelled';
  attempts: number;
}

export class TANService {
  private static TAN_LENGTH = 6;
  private static TAN_EXPIRATION_MINUTES = 5;

  /**
   * Generate a cryptographically secure TAN.
   */
  private static generateTan(length: number = 6): string {
    let tan = '';
    for (let i = 0; i < length; i++) {
      tan += crypto.randomInt(0, 10).toString();
    }
    return tan;
  }

  /**
   * Create a TAN challenge with dynamic linking.
   */
  static async createTanChallenge(
    userId: string,
    transactionId: string,
    amount: number,
    recipient: string,
    tanType: string = 'pushTAN'
  ) {
    const tan = this.generateTan(this.TAN_LENGTH);

    // Create dynamic linking hash (binds TAN to transaction details)
    const dynamicLink = crypto
      .createHash('sha256')
      .update(`${transactionId}:${amount}:${recipient}`)
      .digest('hex');

    // Calculate expiration
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + this.TAN_EXPIRATION_MINUTES);

    const tanData: TanChallenge = {
      user_id: userId,
      transaction_id: transactionId,
      tan_hash: crypto.createHash('sha256').update(tan).digest('hex'),
      dynamic_link: dynamicLink,
      amount: amount,
      recipient: recipient,
      tan_type: tanType,
      created_at: FieldValue.serverTimestamp(),
      expires_at: expiration,
      status: 'pending',
      attempts: 0,
    };

    const tanRef = await db.collection('tan_challenges').add(tanData);

    const challengeData: any = {
      tan_id: tanRef.id,
      type: tanType,
      expires_in: this.TAN_EXPIRATION_MINUTES * 60,
      transaction_details: {
        amount,
        recipient,
      },
    };

    // INSECURE: For demo purposes only! Remove in production.
    // In a real app, this would be sent via Push Notification / SMS
    if (process.env.NODE_ENV !== 'production') {
      challengeData.mock_tan = tan;
    }

    return { tanId: tanRef.id, challengeData };
  }

  /**
   * Validate a TAN with dynamic linking verification.
   */
  static async validateTan(
    tanId: string,
    tanInput: string,
    transactionId: string,
    amount: number,
    recipient: string
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const tanRef = db.collection('tan_challenges').doc(tanId);
      const tanDoc = await tanRef.get();

      if (!tanDoc.exists) {
        return { isValid: false, error: 'TAN-Challenge nicht gefunden' };
      }

      const tanData = tanDoc.data() as TanChallenge;

      // Check if already used
      if (tanData.status !== 'pending') {
        return { isValid: false, error: 'TAN wurde bereits verwendet' };
      }

      // Check expiration
      // Firestore stores Dates as Timestamps, so we need to convert if necessary
      let expiresAt = tanData.expires_at;
      if (expiresAt instanceof Timestamp) {
        expiresAt = expiresAt.toDate();
      }

      if (expiresAt && new Date() > expiresAt) {
        await tanRef.update({ status: 'expired' });
        return { isValid: false, error: 'TAN ist abgelaufen' };
      }

      // Check attempt limit
      if (tanData.attempts >= 3) {
        await tanRef.update({ status: 'locked' });
        return { isValid: false, error: 'Zu viele Fehlversuche. TAN gesperrt.' };
      }

      // Verify dynamic linking
      const expectedLink = crypto
        .createHash('sha256')
        .update(`${transactionId}:${amount}:${recipient}`)
        .digest('hex');

      if (tanData.dynamic_link !== expectedLink) {
        return { isValid: false, error: 'Transaktionsdetails stimmen nicht überein' };
      }

      // Verify TAN
      const tanHash = crypto.createHash('sha256').update(tanInput).digest('hex');

      if (tanData.tan_hash !== tanHash) {
        await tanRef.update({ attempts: (tanData.attempts || 0) + 1 });
        const remaining = 3 - ((tanData.attempts || 0) + 1);
        return { isValid: false, error: `Ungültige TAN. Noch ${remaining} Versuche übrig.` };
      }

      // Valid
      await tanRef.update({
        status: 'used',
        used_at: FieldValue.serverTimestamp(),
      });

      return { isValid: true };
    } catch (error) {
      console.error('TAN validation error:', error);
      return { isValid: false, error: 'Fehler bei der TAN-Validierung' };
    }
  }
}
