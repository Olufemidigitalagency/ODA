'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fullNameLetters = "OLUFEMI DIGITAL AGENCY".split('');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 6;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#09090b] p-8 md:p-16 text-white bg-noise overflow-hidden"
        >
          {/* Top Brand Tag */}
          <div className="flex items-center justify-between text-xs tracking-[0.3em] uppercase text-zinc-400 font-mono">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              EST. 2025
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              PHOTOGRAPHY / VIDEO / DESIGN
            </motion.span>
          </div>

          {/* Center Kinetic Typography */}
          <div className="my-auto overflow-hidden text-center space-y-4">
            {/* ODA Acronym */}
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl sm:text-9xl md:text-[12rem] font-black tracking-tighter uppercase text-white font-mono leading-none"
            >
              ODA
            </motion.h1>

            {/* Staggered Full Name Animation */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.03, delayChildren: 0.2 }
                }
              }}
              className="flex flex-nowrap justify-center items-center gap-[0.05em] sm:gap-[0.15em] text-[11px] min-[380px]:text-xs min-[440px]:text-sm sm:text-2xl md:text-3xl font-bold tracking-[0.05em] sm:tracking-[0.2em] uppercase text-zinc-300 font-mono whitespace-nowrap overflow-hidden max-w-full"
            >
              {fullNameLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={char === ' ' ? 'mr-1 sm:mr-3' : 'inline-block text-white'}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-xs md:text-sm text-zinc-500 font-light tracking-[0.3em] uppercase pt-2"
            >
              We Don't Just Create. We Understand.
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Counter */}
          <div className="w-full">
            <div className="flex justify-between items-end mb-4 font-mono text-xs md:text-sm text-zinc-400">
              <span className="tracking-widest">INITIALIZING EXPERIENCE...</span>
              <span className="text-3xl md:text-5xl font-bold font-mono text-white">{progress}%</span>
            </div>
            <div className="h-[2px] w-full bg-zinc-800 overflow-hidden relative">
              <motion.div
                className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
