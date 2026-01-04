import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebaseAdmin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { checkAdminStatus } from '@/lib/adminCheck';

// GET - Fetch messages for a specific chat
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { chatId } = await params;

        // Check if user is admin or the chat owner
        const isAdmin = await checkAdminStatus(userId);
        const chatDoc = await db.collection('chats').doc(chatId).get();

        if (!chatDoc.exists) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        const chatData = chatDoc.data();
        const chatOwnerId = chatData?.user_id || chatId.replace('chat_', '');

        if (!isAdmin && userId !== chatOwnerId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Fetch messages
        const messagesSnapshot = await db
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .limit(100)
            .get();

        const messages = messagesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                sender_uid: data.sender_uid,
                sender_type: data.sender_type,
                text: data.text,
                timestamp: data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate().toISOString()
                    : new Date().toISOString()
            };
        });

        return NextResponse.json(messages);
    } catch (error: any) {
        console.error('Error fetching chat messages:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST - Send a message in a chat (admin or user)
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { chatId } = await params;
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Check if user is admin or the chat owner
        const isAdmin = await checkAdminStatus(userId);
        const chatDoc = await db.collection('chats').doc(chatId).get();

        if (!chatDoc.exists) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        const chatData = chatDoc.data();
        const chatOwnerId = chatData?.user_id || chatId.replace('chat_', '');

        if (!isAdmin && userId !== chatOwnerId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Get sender name
        let senderName = 'User';
        if (isAdmin) {
            senderName = 'Admin Support';
        } else {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                senderName = userData?.name || decodedToken.email?.split('@')[0] || 'User';
            }
        }

        // Add message
        await db.collection('chats').doc(chatId).collection('messages').add({
            sender_uid: userId,
            sender_type: isAdmin ? 'agent' : 'user',
            text: message,
            timestamp: FieldValue.serverTimestamp()
        });

        // Update chat's last message timestamp
        await db.collection('chats').doc(chatId).update({
            last_message_at: FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
    }
}

// PATCH - Update chat status (admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
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

        const { chatId } = await params;
        const { status } = await req.json();

        if (!['active', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await db.collection('chats').doc(chatId).update({
            status: status
        });

        return NextResponse.json({ success: true, message: 'Chat status updated' });
    } catch (error: any) {
        console.error('Error updating chat status:', error);
        return NextResponse.json({ error: error.message || 'Failed to update status' }, { status: 500 });
    }
}
