import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 3) {
            return NextResponse.json([]);
        }

        // Search by email
        const usersByEmail = await db.collection('users')
            .where('email', '>=', query)
            .where('email', '<=', query + '\uf8ff')
            .limit(10)
            .get();

        // Map and filter out current user
        const results = usersByEmail.docs
            .map(doc => ({
                id: doc.id,
                name: doc.data().name || doc.data().email.split('@')[0],
                email: doc.data().email,
                avatar: (doc.data().name || doc.data().email).substring(0, 2).toUpperCase()
            }))
            .filter(u => u.id !== userId);

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('User Search API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
