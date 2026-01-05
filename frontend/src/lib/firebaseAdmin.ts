import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // 1. Try environment variable (Production/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

      // Fix for Vercel/Heroku environment variables where newlines might be escaped
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId || serviceAccount.project_id,
      });
      console.log(`Firebase admin initialized with env var for project: ${projectId || serviceAccount.project_id}`);
    }
    // 2. Try local file path (Local Development)
    else {
      const serviceAccountPath = path.join(process.cwd(), '..', 'backend', 'serviceAccountKey.json');

      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: projectId || serviceAccount.project_id,
        });
        console.log(`Firebase admin initialized with service account file for project: ${projectId || serviceAccount.project_id}`);
      } else {
        // 3. Fallback to Application Default Credentials
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId,
        });
        console.log('Firebase admin initialized using application default credentials');
      }
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
