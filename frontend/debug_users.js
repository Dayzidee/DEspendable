const admin = require('firebase-admin');
const serviceAccount = require('../backend/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listUsers() {
    console.log('Fetching users...');
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
        console.log('No users found.');
        return;
    }

    console.log(`Found ${usersSnapshot.size} users:`);

    for (const doc of usersSnapshot.docs) {
        const data = doc.data();
        console.log('------------------------------------------------');
        console.log(`ID: ${doc.id}`);
        console.log(`Email: ${data.email}`);
        console.log(`Name: ${data.displayName || data.name}`);
        console.log(`Is Admin: ${data.is_admin}`);
        console.log(`Status: ${data.status}`);

        // Check account
        const accountsSnapshot = await db.collection('accounts')
            .where('owner_uid', '==', doc.id)
            .where('type', '==', 'Checking')
            .limit(1)
            .get();

        if (!accountsSnapshot.empty) {
            console.log(`Checking Account Balance: ${accountsSnapshot.docs[0].data().balance}`);
        } else {
            console.log('No Checking Account found.');
        }
    }
}

listUsers().catch(console.error);
