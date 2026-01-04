
const admin = require('firebase-admin');
const serviceAccount = require('../backend/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function makeAdmin(email) {
    console.log(`Looking for user with email: ${email}...`);
    const usersSnapshot = await db.collection('users').where('email', '==', email).get();

    if (usersSnapshot.empty) {
        console.log('User not found.');
        return;
    }

    const userDoc = usersSnapshot.docs[0];
    console.log(`Found user: ${userDoc.id}`);

    await userDoc.ref.update({
        is_admin: true,
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Successfully granted admin privileges to ${email}`);
}

makeAdmin('inuoluwadunsimis@gmail.com').catch(console.error);
