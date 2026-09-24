import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const topic = searchParams.get('topic') || '';
    const company = searchParams.get('company') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');

    const currentUser = await getCurrentUser();

    // Build Prisma query filters
    const where: any = {
      isPublished: true,
    };

    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty.toUpperCase();
    }

    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    if (topic && topic !== 'ALL') {
      where.topics = {
        some: {
          topic: {
            OR: [
              { slug: topic.toLowerCase() },
              { name: { contains: topic } },
            ],
          },
        },
      };
    }

    if (company && company !== 'ALL') {
      where.companies = {
        some: {
          company: {
            OR: [
              { slug: company.toLowerCase() },
              { name: { contains: company } },
            ],
          },
        },
      };
    }

    const total = await prisma.problem.count({ where });

    const problems = await prisma.problem.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ frequency: 'desc' }, { acceptanceRate: 'desc' }],
      include: {
        topics: { include: { topic: true } },
        companies: { include: { company: true } },
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
      },
    });

    const formattedProblems = problems.map((p) => {
      const userProgress = p.progress && p.progress.length > 0 ? p.progress[0].status : 'UNATTEMPTED';
      const isBookmarked = p.bookmarks && p.bookmarks.length > 0;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        frequency: p.frequency,
        frequencySource: p.frequencySource,
        acceptanceRate: p.acceptanceRate,
        estimatedTimeMinutes: p.estimatedTimeMinutes,
        topics: p.topics.map((t) => t.topic.name),
        companies: p.companies.map((c) => c.company.name),
        userStatus: userProgress,
        isBookmarked,
      };
    });

    // Filter by user solve status if requested
    let finalProblems = formattedProblems;
    if (status && status !== 'ALL') {
      finalProblems = formattedProblems.filter((p) => p.userStatus === status);
    }

    return NextResponse.json({
      problems: finalProblems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching problems:', error);
    return NextResponse.json({ error: 'Failed to retrieve problems' }, { status: 500 });
  }
}
