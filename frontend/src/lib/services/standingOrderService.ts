import { db } from '../firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export class StandingOrderService {
  /**
   * Get all standing orders for a user.
   */
  static async getUserStandingOrders(userId: string) {
    const ordersSnapshot = await db
      .collection('standing_orders')
      .where('user_id', '==', userId)
      .get();

    return ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * Create a new standing order.
   */
  static async createStandingOrder(
    userId: string,
    data: {
      from_account_id: string;
      to_account_id?: string;
      amount: number;
      reference: string;
      frequency: string;
      start_date: string;
      end_date?: string;
      execution_day: number;
    }
  ) {
    const fromAccRef = db.collection('accounts').doc(data.from_account_id);
    const fromAccDoc = await fromAccRef.get();

    if (!fromAccDoc.exists) {
      throw new Error('Absenderkonto nicht gefunden');
    }
    if (fromAccDoc.data()?.owner_uid !== userId) {
      throw new Error('Zugriff verweigert');
    }

    const orderData = {
      user_id: userId,
      ...data,
      amount: Number(data.amount),
      created_at: FieldValue.serverTimestamp(),
      next_execution: Timestamp.fromDate(new Date(data.start_date)), // Simplified logic
      status: 'active',
    };

    const docRef = await db.collection('standing_orders').add(orderData);
    return { success: true, id: docRef.id };
  }

  /**
   * Cancel a standing order.
   */
  static async cancelStandingOrder(orderId: string, userId: string) {
    const orderRef = db.collection('standing_orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new Error('Dauerauftrag nicht gefunden');
    }
    if (orderDoc.data()?.user_id !== userId) {
      throw new Error('Zugriff verweigert');
    }

    await orderRef.update({ status: 'cancelled' });
    return { success: true };
  }
}
