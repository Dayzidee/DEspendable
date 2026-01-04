import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Try to load service account key for local development
    const serviceAccountPath = path.join(process.cwd(), '..', 'backend', 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      // Local development: use service account key
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId || serviceAccount.project_id,
      });
      console.log(`Firebase admin initialized with service account for project: ${projectId || serviceAccount.project_id}`);
    } else if (projectId) {
      // Production: use application default credentials (Vercel environment)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId,
      });
      console.log(`Firebase admin initialized for project: ${projectId}`);
    } else {
      // Fallback
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log('Firebase admin initialized using application default credentials');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
