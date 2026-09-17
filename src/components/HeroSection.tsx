'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, MoveRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenVisionModal: () => void;
}

export function HeroSection({ onOpenVisionModal }: HeroSectionProps) {
  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between overflow-hidden bg-white bg-noise">
      {/* Background Subtle Ambient Soft Gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-zinc-200/40 via-zinc-100/20 to-transparent rounded-full blur-[180px] pointer-events-none" />

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
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              OLUFEMI DIGITAL AGENCY
            </span>
          </motion.div>

          {/* Iconic Giant ODA Block Title with Framer Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="text-[7.5rem] sm:text-[11rem] md:text-[15rem] lg:text-[18rem] xl:text-[20rem] font-black tracking-tighter uppercase leading-[0.82] text-zinc-900 select-none">
              ODA<span className="text-zinc-300 font-serif font-light">.</span>
            </h1>
          </motion.div>

          {/* Description Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-zinc-600 text-lg md:text-2xl font-light max-w-2xl leading-relaxed pt-2"
          >
            Your single media partner. We help brands refine their ideas and build a commanding online presence through photography, videography, content creation, and graphic design.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
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
        transition={{ duration: 0.8, delay: 0.5 }}
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
