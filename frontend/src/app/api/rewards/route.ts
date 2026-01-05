import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const rewardsRef = db.collection('rewards').doc(userId);
        const rewardsDoc = await rewardsRef.get();

        if (!rewardsDoc.exists) {
            // Initialize rewards for the user
            const initialRewards = {
                points: 1250,
                tier: "silver",
                history: [
                    {
                        date: new Date().toISOString().split('T')[0],
                        descriptionKey: "welcome_bonus",
                        description: "Willkommensbonus",
                        points: 1000
                    },
                    {
                        date: new Date().toISOString().split('T')[0],
                        descriptionKey: "first_login",
                        description: "Erste Anmeldung",
                        points: 250
                    }
                ],
                created_at: FieldValue.serverTimestamp()
            };
            await rewardsRef.set(initialRewards);
            return NextResponse.json(initialRewards);
        }

        const data = rewardsDoc.data();

        // Process history to ensure descriptionKey exists (handling legacy data)
        const processedHistory = (data?.history || []).map((item: any) => {
            if (item.descriptionKey) return item;

            // Map legacy descriptions to keys
            let key = 'other';
            if (item.description === 'Willkommensbonus') key = 'welcome_bonus';
            else if (item.description === 'Erste Anmeldung') key = 'first_login';

            return {
                ...item,
                descriptionKey: key
            };
        });

        return NextResponse.json({
            ...data,
            history: processedHistory
        });
    } catch (error: any) {
        console.error('Rewards API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
