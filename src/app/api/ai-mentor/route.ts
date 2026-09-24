import { NextResponse } from 'next/server';
import { getAIMentorAdvice } from '@/lib/gemini';
import { AIMentorRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: AIMentorRequest = await request.json();
    if (!body.problemTitle || !body.mode) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const response = await getAIMentorAdvice(body);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('AI mentor route error:', error);
    return NextResponse.json({ error: 'AI mentor service error' }, { status: 500 });
  }
}
