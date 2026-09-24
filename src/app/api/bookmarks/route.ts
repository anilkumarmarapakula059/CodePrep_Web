import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [bookmarks, collections] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: user.id },
        include: {
          problem: {
            include: {
              topics: { include: { topic: true } },
              companies: { include: { company: true } },
            },
          },
          collection: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.collection.findMany({
        where: { userId: user.id },
        include: { _count: { select: { bookmarks: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const formattedBookmarks = bookmarks.map((b) => ({
      id: b.id,
      problemId: b.problemId,
      notes: b.notes,
      createdAt: b.createdAt,
      collection: b.collection ? { id: b.collection.id, name: b.collection.name } : null,
      problem: {
        slug: b.problem.slug,
        title: b.problem.title,
        difficulty: b.problem.difficulty,
        topics: b.problem.topics.map((t) => t.topic.name),
        companies: b.problem.companies.map((c) => c.company.name),
      },
    }));

    return NextResponse.json({
      bookmarks: formattedBookmarks,
      collections,
    });
  } catch (error: any) {
    console.error('Bookmarks fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, collectionId, notes, createCollectionName } = body;

    // Optional: create collection on the fly
    let targetCollectionId = collectionId;
    if (createCollectionName && createCollectionName.trim()) {
      const newColl = await prisma.collection.create({
        data: {
          userId: user.id,
          name: createCollectionName.trim(),
        },
      });
      targetCollectionId = newColl.id;
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId,
        },
      },
    });

    if (existing) {
      // Toggle off / remove
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, bookmarked: false });
    }

    // Add bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        problemId,
        collectionId: targetCollectionId || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, bookmarked: true, bookmark });
  } catch (error: any) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}
