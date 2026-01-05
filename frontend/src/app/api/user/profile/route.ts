import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        // Return profile data specifically
        return NextResponse.json({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            dateOfBirth: userData?.dateOfBirth || '',
            phoneNumber: userData?.phoneNumber || '',
            nationality: userData?.nationality || '',
            taxId: userData?.taxId || '',
            address: userData?.address || {
                street: '',
                city: '',
                postalCode: '',
                country: ''
            },
            employmentStatus: userData?.employmentStatus || '',
            sourceOfFunds: userData?.sourceOfFunds || '',
            annualIncome: userData?.annualIncome || '',
            isProfileComplete: !!userData?.isProfileComplete
        });
    } catch (error: any) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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

        // Basic validation
        const requiredFields = [
            'firstName', 'lastName', 'dateOfBirth', 'phoneNumber',
            'nationality', 'taxId', 'employmentStatus', 'sourceOfFunds', 'annualIncome'
        ];

        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
        }

        if (!body.address || !body.address.street || !body.address.city || !body.address.postalCode || !body.address.country) {
            return NextResponse.json({ error: 'Incomplete address information' }, { status: 400 });
        }

        // Prepare update data
        const updateData = {
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            phoneNumber: body.phoneNumber,
            nationality: body.nationality,
            taxId: body.taxId,
            address: {
                street: body.address.street,
                city: body.address.city,
                postalCode: body.address.postalCode,
                country: body.address.country
            },
            employmentStatus: body.employmentStatus,
            sourceOfFunds: body.sourceOfFunds,
            annualIncome: body.annualIncome,
            isProfileComplete: true,
            updated_at: FieldValue.serverTimestamp()
        };

        await db.collection('users').doc(userId).update(updateData);

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
