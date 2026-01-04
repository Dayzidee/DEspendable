import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        await auth.verifyIdToken(token);

        // Milestones data (can be moved to Firestore if dynamic)
        const achievements = {
            timeline: [
                { year: "2020", event: "Company Founded", description: "DEspendables Bank AG established in Berlin" },
                { year: "2021", event: "10,000 Customers", description: "Reached first major milestone in user growth" },
                { year: "2022", event: "BaFin License", description: "Received full banking license from German regulator" },
                { year: "2023", event: "€100M Volume", description: "Processed over €100 million in transactions" },
                { year: "2024", event: "AI Integration", description: "Launched AI-powered financial insights" },
                { year: "2025", event: "50,000+ Users", description: "Serving over 50,000 active customers" },
                { year: "2026", event: "European Expansion", description: "Expanding services across EU markets" },
            ],
            metrics: {
                customers: 52400,
                satisfaction: 99.9,
                daily_vol: 2150000
            }
        };

        return NextResponse.json(achievements);
    } catch (error: any) {
        console.error('Achievements API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
