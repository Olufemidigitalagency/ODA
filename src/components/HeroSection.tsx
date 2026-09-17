'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowDownRight, MoveRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenVisionModal: () => void;
}

export function HeroSection({ onOpenVisionModal }: HeroSectionProps) {
  const letters = [
    { char: 'O', src: '/logo-letter-o.png', isDot: false },
    { char: 'D', src: '/logo-letter-d.png', isDot: false },
    { char: 'A', src: '/logo-letter-a.png', isDot: false },
    { char: '.', src: '/logo-letter-dot.png', isDot: true },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 90,
      scale: 0.8,
      filter: 'blur(12px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 100,
      },
    },
  };

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between overflow-hidden bg-white bg-noise">
      {/* Background Micro-Dot Grid (Matching user design) */}
      <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />

      {/* Large Giant Faint ODA Watermark in Background (Matching user design) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="w-[92%] max-w-6xl object-contain opacity-[0.045]"
        />
      </div>

      {/* Ambient Pulsing Futuristic Radial Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-zinc-300/40 via-zinc-200/20 to-transparent rounded-full blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto relative z-10">
        <div className="space-y-6">
          {/* Top Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-700 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900 animate-spin" style={{ animationDuration: '6s' }} />
              OLUFEMI DIGITAL AGENCY
            </span>
          </motion.div>

          {/* Futuristic Block ODA Animation using Exact Logo Lettermarks */}
          <div className="relative inline-block py-2">
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-end gap-3 sm:gap-5 md:gap-8 lg:gap-10 select-none"
            >
              {letters.map((item, index) => (
                <motion.div
                  key={index}
                  variants={letterVariants}
                  whileHover={{
                    y: -16,
                    scale: 1.05,
                    transition: { type: 'spring', stiffness: 300 },
                  }}
                  className="inline-block cursor-default"
                >
                  <img
                    src={item.src}
                    alt={item.char}
                    className={
                      item.isDot
                        ? 'h-[2.8rem] sm:h-[4.2rem] md:h-[6.2rem] lg:h-[7.8rem] xl:h-[9rem] w-auto object-contain mb-1 sm:mb-2 md:mb-3'
                        : 'h-[5.5rem] sm:h-[8.5rem] md:h-[12.5rem] lg:h-[15.5rem] xl:h-[18rem] w-auto object-contain'
                    }
                  />
                </motion.div>
              ))}
            </motion.h1>

            {/* Futuristic Underline Scanning Laser Accent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-1.5 w-full bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-900 rounded-full origin-left mt-2"
            />
          </div>

          {/* Description Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-zinc-600 text-lg md:text-2xl font-light max-w-2xl leading-relaxed pt-4"
          >
            Your single media partner. We help brands refine their ideas and build a commanding online presence through photography, videography, content creation, and graphic design.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <button
              onClick={onOpenVisionModal}
              className="group px-8 py-4 rounded-full bg-zinc-900 text-white font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all duration-300 shadow-xl shadow-zinc-900/10 active:scale-95 cursor-pointer"
            >
              <span>Vision Questionnaire</span>
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#projects"
              className="group px-8 py-4 rounded-full glass-card border border-zinc-300 text-zinc-900 font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
            >
              <span>Explore Showcase</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom Metric Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="max-w-7xl mx-auto w-full pt-16 border-t border-zinc-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-zinc-600 text-xs relative z-10"
      >
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">MEDIA SERVICES</p>
          <p className="text-xl text-zinc-900 font-bold font-mono">4-IN-1 PARTNER</p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">CLIENT VISION PROCESS</p>
          <p className="text-xl text-zinc-900 font-bold font-mono">REFINED IDEAS</p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">CORE STANDARD</p>
          <p className="text-xl text-zinc-900 font-bold font-mono">EXCELLENCE</p>
        </div>
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">AGENCY BRAND</p>
          <p className="text-xl text-zinc-900 font-bold font-mono">OLUFEMI DIGITAL</p>
        </div>
      </motion.div>
    </section>
  );
}
