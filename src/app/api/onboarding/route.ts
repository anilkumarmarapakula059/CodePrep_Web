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
    const { preparationGoal, experienceLevel, preferredLanguage, targetCompanies } = body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        preparationGoal: preparationGoal || 'PLACEMENT',
        experienceLevel: experienceLevel || 'BEGINNER',
        preferredLanguage: preferredLanguage || 'python',
        targetCompanies: JSON.stringify(targetCompanies || ['Google', 'Amazon']),
        onboarded: true,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    return NextResponse.json({ error: 'Failed to update onboarding preferences.' }, { status: 500 });
  }
}
