import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const currentUser = await getCurrentUser();

    const problem = await prisma.problem.findUnique({
      where: { slug },
      include: {
        topics: { include: { topic: true } },
        companies: { include: { company: true } },
        hints: { orderBy: { hintIndex: 'asc' } },
        solutions: true,
        testCases: {
          orderBy: { orderIndex: 'asc' },
        },
        progress: currentUser
          ? {
              where: { userId: currentUser.id },
            }
          : false,
        bookmarks: currentUser
          ? {
              where: { userId: currentUser.id },
            }
          : false,
        submissions: currentUser
          ? {
              where: { userId: currentUser.id },
              orderBy: { createdAt: 'desc' },
              take: 5,
            }
          : false,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Public test cases for run code
    const publicTestCases = problem.testCases
      .filter((tc) => !tc.isHidden)
      .map((tc) => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        explanation: tc.explanation,
      }));

    return NextResponse.json({
      problem: {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        frequency: problem.frequency,
        frequencySource: problem.frequencySource,
        acceptanceRate: problem.acceptanceRate,
        estimatedTimeMinutes: problem.estimatedTimeMinutes,
        description: problem.description,
        constraints: problem.constraints,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        examples: JSON.parse(problem.examples || '[]'),
        starterCode: JSON.parse(problem.starterCode || '{}'),
        topics: problem.topics.map((t) => t.topic.name),
        companies: problem.companies.map((c) => c.company.name),
        hints: problem.hints.map((h) => ({
          hintIndex: h.hintIndex,
          hintText: h.hintText,
        })),
        solutions: problem.solutions.map((s) => ({
          id: s.id,
          approachTitle: s.approachTitle,
          approachType: s.approachType,
          explanation: s.explanation,
          stepByStep: JSON.parse(s.stepByStep || '[]'),
          codePython: s.codePython,
          codeJavascript: s.codeJavascript,
          codeJava: s.codeJava,
          codeCpp: s.codeCpp,
          timeComplexity: s.timeComplexity,
          spaceComplexity: s.spaceComplexity,
        })),
        publicTestCases,
        userProgress:
          problem.progress && problem.progress.length > 0
            ? problem.progress[0].status
            : 'UNATTEMPTED',
        isBookmarked: Boolean(problem.bookmarks && problem.bookmarks.length > 0),
        recentSubmissions: problem.submissions || [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching problem details:', error);
    return NextResponse.json({ error: 'Failed to load problem details.' }, { status: 500 });
  }
}
