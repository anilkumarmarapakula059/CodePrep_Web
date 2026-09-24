import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeCode } from '@/lib/code-runner';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json({ error: 'Code and language are required' }, { status: 400 });
    }

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const executionResult = await executeCode(code, language, problem.testCases);

    return NextResponse.json(executionResult);
  } catch (error: any) {
    console.error('Run code error:', error);
    return NextResponse.json({ error: 'Execution server error' }, { status: 500 });
  }
}
