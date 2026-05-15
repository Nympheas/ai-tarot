"use client";

import { motion } from "framer-motion";

export function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-white rounded-full"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{
            duration: 2 + (i % 5) * 0.6,
            repeat: Infinity,
            delay: (i % 8) * 0.5,
          }}
        />
      ))}
    </div>
  );
}
