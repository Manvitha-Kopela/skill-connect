import { User, Course, Community, Post } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/user1/100/100', title: 'Lead Instructor' },
  { id: 'user-2', name: 'Bob Williams', avatarUrl: 'https://picsum.photos/seed/user2/100/100', title: 'Python Expert' },
  { id: 'user-3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/user3/100/100', title: 'UX Designer' },
  { id: 'user-4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/user4/100/100', title: 'Marketing Guru' },
];

export const courses: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Deep dive into advanced React concepts, hooks, and state management for building scalable applications.',
    instructor: users[0],
    language: 'English',
    level: 'Advanced',
    thumbnailUrl: 'https://picsum.photos/seed/course1/600/400',
    modules: [
      { title: 'Module 1: React Hooks Deep Dive', lessons: [{title: 'useState and useEffect', duration: '15m'}, {title: 'Custom Hooks', duration: '25m'}] },
      { title: 'Module 2: State Management', lessons: [{title: 'Context API', duration: '20m'}, {title: 'Redux Toolkit', duration: '45m'}] },
      { title: 'Module 3: Performance Optimization', lessons: [{title: 'Memoization', duration: '22m'}, {title: 'Code Splitting', duration: '18m'}] },
    ],
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Learn Python and its powerful libraries like Pandas, NumPy, and Matplotlib to analyze and visualize data.',
    instructor: users[1],
    language: 'English',
    level: 'Intermediate',
    thumbnailUrl: 'https://picsum.photos/seed/course2/600/400',
    modules: [
      { title: 'Module 1: Python Basics', lessons: [{title: 'Data Types', duration: '10m'}] },
      { title: 'Module 2: NumPy and Pandas', lessons: [{title: 'DataFrames', duration: '30m'}] },
    ],
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'A comprehensive guide to the principles of UI/UX design, from user research to creating high-fidelity prototypes.',
    instructor: users[2],
    language: 'Spanish',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/seed/course3/600/400',
    modules: [
      { title: 'Module 1: Introduction to UX', lessons: [{title: 'User Personas', duration: '25m'}] },
      { title: 'Module 2: Wireframing & Prototyping', lessons: [{title: 'Figma Basics', duration: '40m'}] },
    ],
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description: 'Master SEO, content marketing, and social media strategies to grow your online presence.',
    instructor: users[3],
    language: 'English',
    level: 'Beginner',
    thumbnailUrl: 'https://picsum.photos/seed/course4/600/400',
    modules: [
        { title: 'Module 1: SEO', lessons: [{title: 'On-page SEO', duration: '30m'}] },
        { title: 'Module 2: Social Media', lessons: [{title: 'Platform Strategies', duration: '45m'}] },
    ],
  },
  {
    id: '5',
    title: 'Introduction to Machine Learning',
    description: 'Explore the fundamentals of machine learning and build your first predictive models.',
    instructor: users[1],
    language: 'English',
    level: 'Intermediate',
    thumbnailUrl: 'https://picsum.photos/seed/course5/600/400',
    modules: [
      { title: 'Module 1: Core Concepts', lessons: [{title: 'Supervised Learning', duration: '35m'}] },
      { title: 'Module 2: Building Models', lessons: [{title: 'Linear Regression', duration: '50m'}] },
    ],
  },
  {
    id: '6',
    title: 'Data Structures & Algorithms',
    description: 'A deep dive into common data structures and algorithms to prepare for technical interviews.',
    instructor: users[0],
    language: 'English',
    level: 'Advanced',
    thumbnailUrl: 'https://picsum.photos/seed/course6/600/400',
    modules: [
        { title: 'Module 1: Data Structures', lessons: [{title: 'Arrays & Linked Lists', duration: '45m'}] },
        { title: 'Module 2: Algorithms', lessons: [{title: 'Sorting & Searching', duration: '60m'}] },
    ],
  },
];

export const communities: Community[] = [
  {
    id: '1',
    name: 'React Developers Hub',
    description: 'A community for developers passionate about React and its ecosystem. Share, learn, and connect.',
    memberCount: 12500,
    category: 'Course',
    thumbnailUrl: 'https://picsum.photos/seed/community1/400/300',
  },
  {
    id: '2',
    name: 'State University Coders',
    description: 'Official community for computer science students at State University. All levels welcome.',
    memberCount: 850,
    category: 'College',
    thumbnailUrl: 'https://picsum.photos/seed/community2/400/300',
  },
  {
    id: '3',
    name: 'Bay Area Tech Professionals',
    description: 'Networking and knowledge sharing for tech professionals working in the San Francisco Bay Area.',
    memberCount: 42000,
    category: 'Professional',
    thumbnailUrl: 'https://picsum.photos/seed/community3/400/300',
  },
  {
    id: '4',
    name: 'Data Science Enthusiasts',
    description: 'Discuss trends, share projects, and ask questions about the world of data science and machine learning.',
    memberCount: 23000,
    category: 'Course',
    thumbnailUrl: 'https://picsum.photos/seed/community4/400/300',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    author: users[1],
    timestamp: '2 hours ago',
    content: 'Has anyone tried the new server components in Next.js 14? I\'m curious about the performance impact on data-heavy pages. The documentation seems promising but I\'d love to hear some real-world experiences.',
    likes: 42,
    comments: 8,
  },
  {
    id: '2',
    author: users[2],
    timestamp: '5 hours ago',
    content: 'Sharing a sneak peek of a new design system I\'m working on. The focus is on accessibility and motion. What do you all think of the color palette? #uidesign #accessibility',
    likes: 128,
    comments: 23,
  },
  {
    id: '3',
    author: users[0],
    timestamp: '1 day ago',
    content: 'Just pushed a new custom hook to my GitHub for handling complex form state with nested objects. It simplifies validation logic significantly. Link in the resources channel!',
    likes: 76,
    comments: 15,
  },
];
