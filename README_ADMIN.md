# Admin Account Setup

## Overview
This document explains how to create and access the admin account for DEspendables.

## Creating the Admin Account

### 1. Set Environment Variables

Add the following to your `.env.local` file in the `frontend` directory:

```env
ADMIN_EMAIL=admin@despendables.com
ADMIN_PASSWORD=YourSecurePassword123
```

**Important**: 
- Use a strong password (minimum 6 characters)
- Keep these credentials secure
- Do NOT commit `.env.local` to version control

### 2. Run the Admin Creation Script

From the `frontend` directory:

```bash
cd frontend
node scripts/create-admin.js
```

The script will:
- Create a Firebase Auth user with the specified email/password
- Set up a Firestore user document with `is_admin: true`
- Create checking and savings accounts with initial balances
- Display confirmation and login credentials

### 3. Login as Admin

1. Navigate to `http://localhost:3000/login`
2. Enter the admin email and password
3. You'll have full access to:
   - Admin Panel (`/admin`)
   - User management
   - Balance adjustments
   - Transaction monitoring
   - All regular user features

## Admin Features

Once logged in as admin, you can:

- **View All Users**: See complete user list with balances
- **Adjust Balances**: Credit or debit any user's account
- **Toggle User Status**: Activate or suspend user accounts
- **Monitor Transactions**: View all system transactions
- **System Statistics**: Real-time stats on users, volume, and balances

## Security Notes

- The admin account has `is_admin: true` in Firestore
- All admin API routes verify this flag via `verifyAdmin` middleware
- The admin button in the sidebar only appears for admin users
- Regular users cannot access admin routes even if they know the URL

## Troubleshooting

**Script fails with "ADMIN_EMAIL not set"**
- Ensure `.env.local` exists in the `frontend` directory
- Check that the variables are properly formatted

**"User already exists" error**
- The script is idempotent - it will update existing users
- If you need to reset, delete the user from Firebase Console

**Can't see admin button after login**
- Clear browser cache and cookies
- Verify `is_admin: true` in Firestore user document
- Check browser console for AuthContext errors

## Changing Admin Credentials

To change the admin password:

1. Update `ADMIN_PASSWORD` in `.env.local`
2. Run the script again (it will update the existing user)

Or use Firebase Console to manually reset the password.
