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
    _count: {
      select: {
        discussions: true,
        members: true
      }
    },
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
    comments: {
      include: {
        author: {
          select: { id: true, name: true }
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true }
            }
          }
        }
      }
    },
    _count: {
      select: { comments: true, likes: true }
    }
  }
}>;

export type Comment = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: { id: true, name: true }
    },
    replies: {
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    }
  }
}>;
