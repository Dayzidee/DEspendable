import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { TransactionService } from '@/lib/services/transactionService';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Auth Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { action } = body;

    if (action === 'initiate') {
      // Step 1: Initiate Transfer & Get TAN Challenge
      const result = await TransactionService.initiateTransfer(userId, body.data);
      return NextResponse.json(result);
    } else if (action === 'execute') {
      // Step 2: Verify TAN & Execute
      const { transactionId, tanInput, tanId } = body.data;
      const result = await TransactionService.executeTransfer(
        userId,
        transactionId,
        tanInput,
        tanId
      );
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Transfer Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
