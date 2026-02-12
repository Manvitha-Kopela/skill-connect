export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: User;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnailUrl: string;
  modules: {
    title: string;
    lessons: {
      title:string;
      duration: string;
    }[];
  }[];
};

export type Community = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: 'Course' | 'College' | 'Professional';
  thumbnailUrl: string;
};

export type Post = {
  id: string;
  author: User;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
};
