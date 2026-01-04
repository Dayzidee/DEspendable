import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/adminCheck';

export async function GET(request: NextRequest) {
    try {
        await verifyAdmin(request.headers.get('Authorization'));

        // Fetch all users for stats
        const usersSnapshot = await db.collection('users').get();
        const totalUsers = usersSnapshot.size;

        let activeUsers = 0;
        let totalBalance = 0;

        usersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status !== 'suspended') activeUsers++;
            totalBalance += Number(data.balance || 0);
        });

        const avgBalance = totalUsers > 0 ? totalBalance / totalUsers : 0;

        // Fetch transaction volume (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const txSnapshot = await db.collection('transactions')
            .where('date', '>=', thirtyDaysAgo.toISOString())
            .get();

        let totalVolume = 0;
        txSnapshot.docs.forEach(doc => {
            totalVolume += Math.abs(Number(doc.data().amount || 0));
        });

        return NextResponse.json({
            totalUsers,
            activeUsers,
            totalVolume,
            avgBalance,
            // Mock growth data for the chart since we don't have historical snapshots yet
            growth: [1200, 1900, 2300, 2100, 2800, totalUsers],
            volumeHistory: [320000, 380000, 420000, 390000, 450000, totalVolume]
        });
    } catch (error: any) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
