import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedShapes() {
  return (
    <div className="absolute top-4 right-4 w-32 h-32">
      <motion.div
        className="w-full h-full rounded-full bg-techtoniq-blue/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
