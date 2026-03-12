import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;
export type Course = Prisma.CourseGetPayload<{
  include: {
    instructor: true,
    modules: {
      include: {
        lessons: true
      }
    }
  }
}>;
export type Community = Prisma.CommunityGetPayload<{
  include: {
    discussions: {
      include: {
        author: true,
        comments: true
      }
    }
  }
}>;
export type Discussion = Prisma.DiscussionGetPayload<{
  include: {
    author: true,
    comments: true,
    _count: {
      select: { comments: true }
    }
  }
}>;