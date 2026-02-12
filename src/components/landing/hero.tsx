'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AnimatedBackground from './animated-background';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <AnimatedBackground />
      <div className="container relative z-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-4">
              Now in Public Beta
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            Skill Exchange + Community-Driven Learning
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-muted-foreground"
            variants={itemVariants}
          >
            The language-first, gamified platform to learn new skills, connect
            with experts, and grow with a global community.
          </motion.p>
          <motion.div
            className="mt-10 flex items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Button asChild size="lg">
              <Link href="/courses">
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/communities">Join Community</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
