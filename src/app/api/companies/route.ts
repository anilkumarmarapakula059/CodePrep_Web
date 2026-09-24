import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                difficulty: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = companies.map((c) => {
      const basicCount = c.problems.filter((p) => p.problem.difficulty === 'BASIC').length;
      const intermediateCount = c.problems.filter((p) => p.problem.difficulty === 'INTERMEDIATE').length;
      const advancedCount = c.problems.filter((p) => p.problem.difficulty === 'ADVANCED').length;

      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        logo: c.logo,
        tier: c.tier,
        description: c.description,
        hiringRounds: JSON.parse(c.hiringRounds || '[]'),
        testedTopicsOverview: JSON.parse(c.testedTopicsOverview || '{}'),
        totalProblems: c.problems.length,
        difficultyBreakdown: {
          basic: basicCount,
          intermediate: intermediateCount,
          advanced: advancedCount,
        },
      };
    });

    return NextResponse.json({ companies: formatted });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to retrieve companies' }, { status: 500 });
  }
}
