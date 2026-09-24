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

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                topics: { include: { topic: true } },
                progress: currentUser
                  ? {
                      where: { userId: currentUser.id },
                    }
                  : false,
              },
            },
          },
          orderBy: { frequencyWeight: 'desc' },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const problems = company.problems.map((cp) => ({
      id: cp.problem.id,
      slug: cp.problem.slug,
      title: cp.problem.title,
      difficulty: cp.problem.difficulty,
      frequency: cp.problem.frequency,
      acceptanceRate: cp.problem.acceptanceRate,
      estimatedTimeMinutes: cp.problem.estimatedTimeMinutes,
      topics: cp.problem.topics.map((t) => t.topic.name),
      interviewStage: cp.interviewStage,
      userStatus:
        cp.problem.progress && cp.problem.progress.length > 0
          ? cp.problem.progress[0].status
          : 'UNATTEMPTED',
    }));

    return NextResponse.json({
      company: {
        id: company.id,
        slug: company.slug,
        name: company.name,
        logo: company.logo,
        tier: company.tier,
        description: company.description,
        hiringRounds: JSON.parse(company.hiringRounds || '[]'),
        testedTopicsOverview: JSON.parse(company.testedTopicsOverview || '{}'),
      },
      problems,
    });
  } catch (error: any) {
    console.error('Company detail error:', error);
    return NextResponse.json({ error: 'Failed to load company details' }, { status: 500 });
  }
}
