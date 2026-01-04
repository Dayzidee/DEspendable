import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { checkAdminStatus } from '@/lib/adminCheck';

// GET - Fetch all chat conversations (admin only)
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        // Check if user is admin
        const isAdmin = await checkAdminStatus(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Fetch all chats sorted by most recent activity
        const chatsSnapshot = await db
            .collection('chats')
            .orderBy('last_message_at', 'desc')
            .limit(100)
            .get();

        const chats = await Promise.all(chatsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const chatId = doc.id;

            // Get message count
            const messagesSnapshot = await db
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .count()
                .get();

            // Get user details
            const userId = data.user_id || chatId.replace('chat_', '');
            let userName = 'Unknown User';
            let userEmail = '';

            try {
                const userDoc = await db.collection('users').doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    userName = userData?.name || userEmail?.split('@')[0] || 'User';
                    userEmail = userData?.email || '';
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }

            return {
                id: chatId,
                user_id: userId,
                user_name: userName,
                user_email: userEmail,
                status: data.status || 'active',
                created_at: data.created_at instanceof Timestamp
                    ? data.created_at.toDate().toISOString()
                    : new Date().toISOString(),
                last_message_at: data.last_message_at instanceof Timestamp
                    ? data.last_message_at.toDate().toISOString()
                    : new Date().toISOString(),
                message_count: messagesSnapshot.data().count || 0
            };
        }));

        return NextResponse.json(chats);
    } catch (error: any) {
        console.error('Error fetching admin chats:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch chats' }, { status: 500 });
    }
}
