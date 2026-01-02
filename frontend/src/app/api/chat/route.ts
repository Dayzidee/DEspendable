import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// POST: Send a message
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { message } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const chatId = `chat_${userId}`; // Single chat room per user for support
    const chatRef = db.collection('chats').doc(chatId);

    // Ensure chat exists
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
        await chatRef.set({
            user_id: userId,
            status: 'active',
            created_at: FieldValue.serverTimestamp(),
            last_message_at: FieldValue.serverTimestamp()
        });
    } else {
        await chatRef.update({
            last_message_at: FieldValue.serverTimestamp()
        });
    }

    // Add message
    await chatRef.collection('messages').add({
        sender_uid: userId,
        text: message,
        timestamp: FieldValue.serverTimestamp(),
        sender_type: 'user'
    });

    // Simulate Bot Response (Banking Simulation)
    // In a real app, this would be a separate triggered function
    setTimeout(async () => {
        const botResponses = [
            "Thank you for your message. A support agent will be with you shortly.",
            "I can help you with that. Could you provide more details?",
            "Please check our FAQ for immediate assistance.",
            "Your request has been logged. Reference #8823."
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

        await chatRef.collection('messages').add({
            sender_uid: 'system_bot',
            text: randomResponse,
            timestamp: FieldValue.serverTimestamp(),
            sender_type: 'agent'
        });
    }, 1000);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET: Fetch messages
export async function GET(request: NextRequest) {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const token = authHeader.split(' ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      const chatId = `chat_${userId}`;
      const messagesSnapshot = await db.collection('chats').doc(chatId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .limit(50)
        .get();

      const messages = messagesSnapshot.docs.map(doc => {
          const data = doc.data();
          if (data.timestamp instanceof Timestamp) {
              data.timestamp = data.timestamp.toDate().toISOString();
          }
          return { id: doc.id, ...data };
      });

      return NextResponse.json(messages);

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
