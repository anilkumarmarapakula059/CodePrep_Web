import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
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
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Execute against all test cases including hidden suite
    const result = await executeCode(code, language, problem.testCases);

    const currentUser = await getCurrentUser();
    let newlySolved = false;
    let earnedXP = 0;
    let unlockedBadges: string[] = [];

    if (currentUser) {
      const firstFailed = result.results.find((r) => !r.passed);

      // Record official submission
      await prisma.submission.create({
        data: {
          userId: currentUser.id,
          problemId: problem.id,
          language,
          code,
          status: result.status,
          executionTimeMs: result.executionTimeMs,
          memoryKb: result.memoryKb,
          passedTestCases: result.passedTestCases,
          totalTestCases: result.totalTestCases,
          failedTestCaseInput: firstFailed?.input || null,
          failedTestCaseExpected: firstFailed?.expectedOutput || null,
          failedTestCaseActual: firstFailed?.actualOutput || null,
          errorMessage: result.compilationError || firstFailed?.errorMessage || null,
        },
      });

      // Fetch existing user progress
      const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_problemId: {
            userId: currentUser.id,
            problemId: problem.id,
          },
        },
      });

      if (result.status === 'ACCEPTED') {
        if (!existingProgress || existingProgress.status !== 'SOLVED') {
          newlySolved = true;
          earnedXP = problem.difficulty === 'ADVANCED' ? 200 : problem.difficulty === 'INTERMEDIATE' ? 100 : 50;

          await prisma.userProgress.upsert({
            where: {
              userId_problemId: {
                userId: currentUser.id,
                problemId: problem.id,
              },
            },
            update: {
              status: 'SOLVED',
              solvedAt: new Date(),
              lastAttemptAt: new Date(),
              attemptsCount: { increment: 1 },
            },
            create: {
              userId: currentUser.id,
              problemId: problem.id,
              status: 'SOLVED',
              solvedAt: new Date(),
              attemptsCount: 1,
            },
          });

          // Update user profile counters
          const diffField =
            problem.difficulty === 'ADVANCED'
              ? 'hardSolved'
              : problem.difficulty === 'INTERMEDIATE'
              ? 'mediumSolved'
              : 'easySolved';

          const updatedProfile = await prisma.profile.update({
            where: { userId: currentUser.id },
            data: {
              totalSolved: { increment: 1 },
              [diffField]: { increment: 1 },
              xp: { increment: earnedXP },
              codingMinutes: { increment: Math.max(5, problem.estimatedTimeMinutes) },
            },
          });

          // Check level up
          const newLevel = Math.floor(updatedProfile.xp / 500) + 1;
          if (newLevel > updatedProfile.level) {
            await prisma.profile.update({
              where: { userId: currentUser.id },
              data: { level: newLevel },
            });
          }

          // Check First Problem Achievement
          const firstProblemAch = await prisma.achievement.findUnique({ where: { slug: 'first-problem' } });
          if (firstProblemAch) {
            const hasIt = await prisma.userAchievement.findUnique({
              where: { userId_achievementId: { userId: currentUser.id, achievementId: firstProblemAch.id } },
            });
            if (!hasIt) {
              await prisma.userAchievement.create({
                data: { userId: currentUser.id, achievementId: firstProblemAch.id },
              });
              unlockedBadges.push(firstProblemAch.title);
            }
          }

          // Check 50 Solved Achievement
          if (updatedProfile.totalSolved >= 50) {
            const fiftyAch = await prisma.achievement.findUnique({ where: { slug: 'fifty-solved' } });
            if (fiftyAch) {
              const hasIt = await prisma.userAchievement.findUnique({
                where: { userId_achievementId: { userId: currentUser.id, achievementId: fiftyAch.id } },
              });
              if (!hasIt) {
                await prisma.userAchievement.create({
                  data: { userId: currentUser.id, achievementId: fiftyAch.id },
                });
                unlockedBadges.push(fiftyAch.title);
              }
            }
          }
        }
      } else {
        // Mark attempted
        await prisma.userProgress.upsert({
          where: {
            userId_problemId: {
              userId: currentUser.id,
              problemId: problem.id,
            },
          },
          update: {
            lastAttemptAt: new Date(),
            attemptsCount: { increment: 1 },
          },
          create: {
            userId: currentUser.id,
            problemId: problem.id,
            status: 'ATTEMPTED',
            attemptsCount: 1,
          },
        });
      }
    }

    return NextResponse.json({
      ...result,
      newlySolved,
      earnedXP,
      unlockedBadges,
    });
  } catch (error: any) {
    console.error('Submit code error:', error);
    return NextResponse.json({ error: 'Submission server error' }, { status: 500 });
  }
}
