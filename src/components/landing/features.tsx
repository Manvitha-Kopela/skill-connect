'use client';

import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Languages, Users } from 'lucide-react';

const features = [
  {
    icon: Languages,
    title: 'Language-First Learning',
    description: 'Master skills in your native language with courses from creators around the world.',
  },
  {
    icon: Gamepad2,
    title: 'Gamified Progress',
    description: 'Stay motivated with points, badges, and leaderboards. Make learning a fun and rewarding adventure.',
  },
  {
    icon: Users,
    title: 'Built-in Communities',
    description: 'Every course has a dedicated community to ask questions, share projects, and collaborate.',
  },
  {
    icon: BookOpen,
    title: 'Structured Courses',
    description: 'Learn effectively with well-organized modules and clear learning paths designed by experts.',
  },
];

const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

export default function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            SkillConnect provides a comprehensive ecosystem for learners and creators alike.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
             <motion.div
             key={index}
             className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm"
             initial="offscreen"
             whileInView="onscreen"
             viewport={{ once: true, amount: 0.5 }}
             variants={cardVariants}
             >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
