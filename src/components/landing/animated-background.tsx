'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,_hsl(var(--primary)/0.15),_transparent_40%),_radial-gradient(circle_at_80%_70%,_hsl(var(--accent)/0.1),_transparent_40%)]"
      />
      <motion.div
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-accent/5 opacity-50 blur-3xl"
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -50, 50, -50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 opacity-50 blur-3xl"
        animate={{
          x: [0, -50, 0, 50, 0],
          y: [0, 50, -50, 50, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
