import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'PROFESSIONAL' ? 'PROFESSIONAL' : 'STUDENT';

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: assignedRole,
        profile: {
          create: {
            fullName: fullName.trim(),
            experienceLevel: assignedRole === 'PROFESSIONAL' ? 'INTERMEDIATE' : 'BEGINNER',
            preparationGoal: assignedRole === 'PROFESSIONAL' ? 'JOB_SWITCH' : 'PLACEMENT',
            preferredLanguage: 'python',
            targetCompanies: JSON.stringify(['Amazon', 'Google', 'Microsoft', 'TCS']),
            xp: 100,
            level: 1,
            streak: 1,
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            codingMinutes: 0,
            onboarded: false,
          },
        },
      },
      include: { profile: true },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });

    response.cookies.set('codeprep_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
