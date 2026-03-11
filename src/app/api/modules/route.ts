import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { courseId, title } = await req.json();

    if (!courseId) {
      return NextResponse.json({ message: 'Course ID is required' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const count = await prisma.module.count({
      where: { courseId }
    });

    const nextOrder = count + 1;

    const module = await prisma.module.create({
      data: {
        title: title,
        order: nextOrder,
        courseId
      }
    });

    return NextResponse.json(module);
  } catch (error: any) {
    console.error('Module creation error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { moduleId, title } = await req.json();

    if (!moduleId || !title) {
      return NextResponse.json({ message: 'Module ID and Title are required' }, { status: 400 });
    }

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: { title }
    });

    return NextResponse.json(updatedModule);
  } catch (error: any) {
    console.error('Module update error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { moduleId } = await req.json();

    if (!moduleId) {
      return NextResponse.json({ message: 'Module ID is required' }, { status: 400 });
    }

    await prisma.module.delete({
      where: { id: moduleId }
    });

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error: any) {
    console.error('Module deletion error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
