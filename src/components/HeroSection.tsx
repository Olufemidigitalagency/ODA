'use client';

import { ArrowDownRight, MoveRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenVisionModal: () => void;
}

export function HeroSection({ onOpenVisionModal }: HeroSectionProps) {
  return (
    <section id="top" className="relative min-h-screen pt-36 pb-20 px-6 md:px-12 flex flex-col justify-between overflow-hidden bg-white bg-noise">
      {/* Background Subtle Ambient Soft Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-zinc-200/40 via-zinc-100/20 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto relative z-10">
        <div className="max-w-4xl space-y-6">
          {/* Static Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.92] text-zinc-900">
            WE DON'T JUST CREATE. <br />
            <span className="text-zinc-400">WE UNDERSTAND.</span>
          </h1>

          {/* Description Subtitle */}
          <p className="text-zinc-600 text-lg md:text-xl font-light max-w-xl leading-relaxed">
            ODA is your single media partner. We help brands refine their ideas and build a professional online presence through photography, videography, content creation, and graphic design.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
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
          </div>
        </div>
      </div>

      {/* Bottom Metric Highlights */}
      <div className="max-w-7xl mx-auto w-full pt-16 border-t border-zinc-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-zinc-600 text-xs relative z-10">
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
      </div>
    </section>
  );
}
