import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail, removeDuplicates } from '../../utils/emailVerifier';

const RATE_LIMIT = 5; // emails per second

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { emails } = body;
  
  if (!emails || !Array.isArray(emails)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const uniqueEmails = removeDuplicates(emails);

  const results = [];
  for (let i = 0; i < uniqueEmails.length; i += RATE_LIMIT) {
    const batch = uniqueEmails.slice(i, i + RATE_LIMIT);
    const batchResults = await Promise.all(batch.map(verifyEmail));
    results.push(...batchResults);

    // Wait for 1 second before processing the next batch
    if (i + RATE_LIMIT < uniqueEmails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(results);
}