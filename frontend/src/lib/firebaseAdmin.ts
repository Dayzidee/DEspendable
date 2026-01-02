import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // If you are using real-time database, add databaseURL here
      // databaseURL: "https://<YOUR-PROJECT-ID>.firebaseio.com"
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
