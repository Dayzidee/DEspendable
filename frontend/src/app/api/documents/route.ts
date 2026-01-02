import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const docsSnapshot = await db
      .collection('documents')
      .where('owner_uid', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    let docs = docsSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert Timestamp to ISO string for JSON serialization
      if (data.created_at instanceof Timestamp) {
        data.created_at = data.created_at.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data,
      };
    });

    // Seed dummy data if empty (Simulation only)
    if (docs.length === 0) {
      const now = new Date();
      const dummyDocs = [
        {
          title: 'Finanzstatus 12/2025',
          type: 'Statement',
          created_at: FieldValue.serverTimestamp(),
          owner_uid: userId,
          download_url: '#',
        },
        {
          title: 'AGB Änderung (Terms Update)',
          type: 'Legal',
          created_at: FieldValue.serverTimestamp(),
          owner_uid: userId,
          download_url: '#',
        },
      ];

      const batch = db.batch();
      for (const d of dummyDocs) {
        const ref = db.collection('documents').doc();
        batch.set(ref, d);
      }
      await batch.commit();

      // Return the dummy docs with client-friendly dates
      docs = dummyDocs.map((d, i) => ({
        ...d,
        id: `new_${i}`,
        created_at: now.toISOString(), // Use client-safe date
      }));
    }

    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
