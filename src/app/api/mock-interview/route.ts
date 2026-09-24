import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, difficulty, durationMinutes, companyName, topicName, sessionId, solvedProblemIds, timeSpentSeconds } = body;

    // 1. Create a new Mock Interview Session
    if (action === 'start') {
      const diff = difficulty || 'INTERMEDIATE';
      const duration = durationMinutes || 45;

      const where: any = {
        difficulty: diff,
        isPublished: true,
      };

      if (companyName && companyName !== 'All') {
        where.companies = {
          some: {
            company: {
              name: { contains: companyName },
            },
          },
        };
      }

      if (topicName && topicName !== 'All') {
        where.topics = {
          some: {
            topic: {
              name: { contains: topicName },
            },
          },
        };
      }

      // Pick 2-3 matching problems
      let selectedProblems = await prisma.problem.findMany({
        where,
        take: 3,
        include: {
          topics: { include: { topic: true } },
          companies: { include: { company: true } },
        },
      });

      // Fallback if filter too narrow
      if (selectedProblems.length < 2) {
        selectedProblems = await prisma.problem.findMany({
          where: { difficulty: diff },
          take: 3,
          include: {
            topics: { include: { topic: true } },
            companies: { include: { company: true } },
          },
        });
      }

      const session = await prisma.mockInterviewSession.create({
        data: {
          userId: user.id,
          difficulty: diff,
          durationMinutes: duration,
          companyName: companyName || 'General MNC',
          topicName: topicName || 'Mixed DSA',
          totalProblems: selectedProblems.length,
          solvedCount: 0,
          status: 'IN_PROGRESS',
          problems: {
            create: selectedProblems.map((p, idx) => ({
              problemId: p.id,
              orderIndex: idx,
              status: 'UNSOLVED',
            })),
          },
        },
        include: {
          problems: {
            include: {
              problem: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  difficulty: true,
                  estimatedTimeMinutes: true,
                  description: true,
                  constraints: true,
                  examples: true,
                  starterCode: true,
                  topics: { include: { topic: true } },
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          difficulty: session.difficulty,
          durationMinutes: session.durationMinutes,
          companyName: session.companyName,
          totalProblems: session.totalProblems,
          startedAt: session.startedAt,
          problems: session.problems.map((mp) => ({
            id: mp.problem.id,
            slug: mp.problem.slug,
            title: mp.problem.title,
            difficulty: mp.problem.difficulty,
            estimatedTimeMinutes: mp.problem.estimatedTimeMinutes,
            description: mp.problem.description,
            constraints: mp.problem.constraints,
            examples: JSON.parse(mp.problem.examples || '[]'),
            starterCode: JSON.parse(mp.problem.starterCode || '{}'),
            topics: mp.problem.topics.map((t) => t.topic.name),
          })),
        },
      });
    }

    // 2. Complete Session and Generate Report
    if (action === 'complete') {
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
      }

      const solved = solvedProblemIds?.length || 0;
      const total = 3;
      const accuracyScore = Math.round((solved / total) * 100);
      const timeRating = timeSpentSeconds < 1800 ? 'Fast & Efficient' : 'Steady Pace';

      const feedback = {
        score: accuracyScore,
        solvedCount: solved,
        totalProblems: total,
        accuracy: `${accuracyScore}%`,
        timeSpentSeconds: timeSpentSeconds || 0,
        timeManagement: timeRating,
        verdict:
          accuracyScore >= 80
            ? 'Strong Hire — Placement Ready'
            : accuracyScore >= 50
            ? 'Hire with Minor Review — Solid Fundamentals'
            : 'Needs Practice on Speed & Edge Cases',
        weakTopics: accuracyScore < 70 ? ['Dynamic Programming', 'Edge Cases'] : [],
        recommendations: [
          'Review space complexity optimizations for two-pointer problems',
          'Practice 2 more timed medium problems this week',
        ],
      };

      const completedSession = await prisma.mockInterviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          score: accuracyScore,
          solvedCount: solved,
          completedAt: new Date(),
          feedbackJson: JSON.stringify(feedback),
        },
      });

      // Update XP for completing interview
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          xp: { increment: 150 },
        },
      });

      return NextResponse.json({
        success: true,
        report: feedback,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Mock interview API error:', error);
    return NextResponse.json({ error: 'Mock interview process failed' }, { status: 500 });
  }
}
