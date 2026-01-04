#!/usr/bin/env node

/**
 * Admin Account Creation Script
 * 
 * This script creates a hardcoded admin account in Firebase Auth and Firestore.
 * Run with: node scripts/create-admin.js
 * 
 * Required environment variables:
 * - ADMIN_EMAIL: Email for the admin account
 * - ADMIN_PASSWORD: Password for the admin account (min 6 characters)
 */

const admin = require('firebase-admin');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    console.log('\nAdd these to your .env.local file:');
    console.log('ADMIN_EMAIL=admin@despendables.com');
    console.log('ADMIN_PASSWORD=your-secure-password');
    process.exit(1);
}

if (ADMIN_PASSWORD.length < 6) {
    console.error('❌ Error: ADMIN_PASSWORD must be at least 6 characters');
    process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

function generateAccountNumber() {
    return crypto.randomInt(1000000000, 9999999999).toString();
}

function generateIBAN() {
    const bankCode = '10050000'; // DEspendables Bank Code
    const country = 'DE';
    const checksum = crypto.randomInt(10, 99).toString();
    const partialAccount = crypto.randomInt(1000000000, 9999999999).toString();
    return `${country}${checksum}${bankCode}${partialAccount}`;
}

async function createAdminAccount() {
    try {
        console.log('🔧 Creating admin account...\n');

        // Check if user already exists
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
            console.log('ℹ️  Admin user already exists in Firebase Auth');
        } catch (error) {
            // User doesn't exist, create it
            userRecord = await auth.createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                emailVerified: true,
                displayName: 'System Administrator'
            });
            console.log('✅ Created Firebase Auth user');
        }

        const userId = userRecord.uid;

        // Check if Firestore user document exists
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists && userDoc.data().is_admin) {
            console.log('ℹ️  Admin user already configured in Firestore');
        } else {
            const accountNumber = generateAccountNumber();

            // Create/Update user document with admin flag
            await userRef.set({
                email: ADMIN_EMAIL,
                displayName: 'System Administrator',
                account_number: accountNumber,
                is_admin: true,
                status: 'active',
                tier: 'Premium',
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                settings: {
                    discreet_mode: false,
                    theme: 'light',
                    language: 'en'
                }
            }, { merge: true });

            console.log('✅ Created/Updated Firestore user document');

            // Check if accounts already exist
            const accountsSnapshot = await db.collection('accounts')
                .where('owner_uid', '==', userId)
                .get();

            if (accountsSnapshot.empty) {
                // Create Checking Account
                await db.collection('accounts').add({
                    owner_uid: userId,
                    type: 'Checking',
                    name: 'Admin Checking Account',
                    display_name: 'Girokonto',
                    balance: 10000.00, // Give admin account some initial balance
                    iban: generateIBAN(),
                    currency: 'EUR',
                    status: 'Active',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                });

                // Create Savings Account
                await db.collection('accounts').add({
                    owner_uid: userId,
                    type: 'Savings',
                    name: 'Admin Savings Account',
                    display_name: 'Tagesgeld',
                    balance: 5000.00,
                    iban: generateIBAN(),
                    currency: 'EUR',
                    status: 'Active',
                    created_at: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log('✅ Created checking and savings accounts');
            } else {
                console.log('ℹ️  Admin accounts already exist');
            }
        }

        console.log('\n✨ Admin account setup complete!\n');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', '***' + ADMIN_PASSWORD.slice(-3));
        console.log('\n🚀 You can now login at: http://localhost:3000/login\n');

    } catch (error) {
        console.error('❌ Error creating admin account:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

createAdminAccount();
