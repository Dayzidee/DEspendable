import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

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
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    if (docsSnapshot.empty) {
      // Seed initial welcome documents
      const initialDocs = [
        {
          title: "Willkommen bei DEspendables",
          type: "Info",
          created_at: FieldValue.serverTimestamp(),
          user_id: userId,
          content_url: "#"
        },
        {
          title: "Kontoeröffnungsbestätigung",
          type: "Vertrag",
          created_at: FieldValue.serverTimestamp(),
          user_id: userId,
          content_url: "#"
        }
      ];

      const batch = db.batch();
      initialDocs.forEach(doc => {
        const ref = db.collection('documents').doc();
        batch.set(ref, doc);
      });
      await batch.commit();

      // Fetch again to get the documents with IDs
      const newSnapshot = await db
        .collection('documents')
        .where('user_id', '==', userId)
        .get();

      return NextResponse.json(newSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date()
      })));
    }

    const documents = docsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.() || new Date()
    }));

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Documents API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
