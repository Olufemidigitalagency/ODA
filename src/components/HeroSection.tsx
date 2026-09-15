'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowDownRight, MoveRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenVisionModal: () => void;
}

export function HeroSection({ onOpenVisionModal }: HeroSectionProps) {
  // Motion values for magnetic 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between overflow-hidden bg-noise">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.035] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Kinetic Headline & Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card border border-white/10 text-xs uppercase tracking-[0.2em] text-zinc-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Olufemi Digital Agency — Photography, Video & Design</span>
            </motion.div>

            {/* Kinetic Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.92] text-white"
            >
              WE DON'T JUST CREATE. <br />
              <span className="text-stroke hover:text-white transition-all duration-500">WE UNDERSTAND.</span>
            </motion.h1>

            {/* Description Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-zinc-400 text-lg md:text-xl font-light max-w-xl leading-relaxed"
            >
              ODA is your single media partner. We help brands refine their ideas and build a professional online presence through photography, videography, content creation, and graphic design.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={onOpenVisionModal}
                className="group px-8 py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-200 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95 cursor-pointer"
              >
                <span>Vision Questionnaire</span>
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#projects"
                className="group px-8 py-4 rounded-full glass-card border border-zinc-700 text-white font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:border-zinc-400 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span>Explore Showcase</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Kinetic Logo Showcase Emblem */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center cursor-pointer group"
            >
              {/* Pulsing Ambient Background Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-zinc-500/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

              {/* Rotating Kinetic Circular SVG Text Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                  <path
                    id="textPath"
                    d="M 200, 200 m -160, 0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0"
                    fill="none"
                  />
                  <text className="text-[11px] font-mono uppercase tracking-[0.32em] fill-zinc-400 group-hover:fill-white transition-colors duration-500">
                    <textPath href="#textPath" startOffset="0%">
                      • OLUFEMI DIGITAL AGENCY • PHOTOGRAPHY • VIDEOGRAPHY • GRAPHIC DESIGN
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Outer Circular Ring Border */}
              <div className="absolute inset-4 rounded-full border border-zinc-800 group-hover:border-zinc-500 transition-colors duration-500 pointer-events-none" />

              {/* Center Circular Logo Emblem Container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full glass-card border border-white/20 p-6 flex flex-col items-center justify-center shadow-2xl shadow-black/80 relative overflow-hidden backdrop-blur-2xl group-hover:border-white/50 transition-all duration-500"
              >
                {/* Logo Image */}
                <img
                  src="/logo-circle.png"
                  alt="Olufemi Digital Agency Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Inner Lens Flare Glow */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:translate-x-12 group-hover:translate-y-12 transition-transform duration-700 pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Metric Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="max-w-7xl mx-auto w-full pt-16 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-zinc-400 text-xs"
      >
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">MEDIA SERVICES</p>
          <p className="text-xl text-white font-bold font-mono">4-IN-1 PARTNER</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">CLIENT VISION PROCESS</p>
          <p className="text-xl text-white font-bold font-mono">REFINED IDEAS</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">CORE STANDARD</p>
          <p className="text-xl text-white font-bold font-mono">EXCELLENCE</p>
        </div>
        <div>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">AGENCY BRAND</p>
          <p className="text-xl text-white font-bold font-mono">OLUFEMI DIGITAL</p>
        </div>
      </motion.div>
    </section>
  );
}
