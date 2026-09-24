import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      difficulty,
      frequency,
      frequencySource,
      description,
      constraints,
      inputFormat,
      outputFormat,
      testCases,
      hints,
      topics,
      companies,
    } = body;

    if (!title || !slug || !difficulty) {
      return NextResponse.json({ error: 'Title, slug, and difficulty are required' }, { status: 400 });
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        slug: slug.toLowerCase().trim(),
        difficulty,
        frequency: frequency || 3,
        frequencySource: frequencySource || 'Admin verified 2026',
        description: description || 'Problem description',
        constraints: constraints || '1 <= N <= 10^5',
        inputFormat: inputFormat || 'Standard input',
        outputFormat: outputFormat || 'Standard output',
        examples: JSON.stringify([
          { input: 'Sample Input', output: 'Sample Output', explanation: 'Basic example' },
        ]),
        starterCode: JSON.stringify({
          python: `def solve():\n    pass\n\nif __name__ == '__main__':\n    print("0")`,
          javascript: `function solve() {\n  return 0;\n}\nconsole.log(0);`,
          java: `public class Solution {\n    public static void main(String[] args) {\n        System.out.println(0);\n    }\n}`,
          cpp: `#include <iostream>\nusing namespace std;\nint main() { cout << 0 << endl; return 0; }`,
        }),
        testCases: {
          create: (testCases || [
            { input: '1 2 3', expectedOutput: '1', isHidden: false },
            { input: '4 5 6', expectedOutput: '4', isHidden: true },
          ]).map((tc: any, idx: number) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: Boolean(tc.isHidden),
            orderIndex: idx,
          })),
        },
        hints: {
          create: (hints || [{ hintText: 'Consider using a hash map or two pointers.' }]).map(
            (h: any, idx: number) => ({
              hintIndex: idx + 1,
              hintText: h.hintText,
            })
          ),
        },
      },
    });

    return NextResponse.json({ success: true, problem });
  } catch (error: any) {
    console.error('Admin create problem error:', error);
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Problem ID required' }, { status: 400 });
    }

    await prisma.problem.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Problem deleted' });
  } catch (error: any) {
    console.error('Admin delete problem error:', error);
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}
