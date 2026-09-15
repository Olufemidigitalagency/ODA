'use client';

import { motion } from 'framer-motion';
import { Eye, Target, Compass, Layers, Award } from 'lucide-react';

export function AboutSection({ onOpenVisionModal }: { onOpenVisionModal: () => void }) {
  const differentiators = [
    {
      num: '01',
      title: 'WE UNDERSTAND BEFORE WE CREATE',
      desc: 'We take time to understand your vision, brand, and expectations before any camera rolls or design pixel is set.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'WE REFINE IDEAS',
      desc: 'You don’t need to have everything figured out. Our Client Vision Questionnaire guides your ideas into a sharp creative direction.',
      icon: Target,
    },
    {
      num: '03',
      title: 'ONE MEDIA PARTNER',
      desc: 'Photography, Videography, Content Creation, and Graphic Design under one roof. No fragmented freelancers or scattered communication.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'STANDARD OF EXCELLENCE',
      desc: 'Excellence, professionalism, and reliability are non-negotiable. Every project reflects the caliber your brand deserves.',
      icon: Award,
    },
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-[#050507] relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Top Tagline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono text-zinc-500 whitespace-nowrap">ABOUT OLUFEMI DIGITAL AGENCY</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-tight">
            WE DON'T JUST CREATE. <br />
            <span className="text-stroke">WE UNDERSTAND.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed">
            ODA (Olufemi Digital Agency) is a full-service creative media agency. We use photography, videography, content creation, and graphic design as strategic tools to build a strong, professional online presence for your brand.
          </p>
        </div>

        {/* Vision & Mission Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl glass-card border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 relative"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">OUR VISION</span>
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold uppercase text-white mb-4">EXCELLENCE & RELIABILITY</h3>
            <p className="text-zinc-300 text-base font-light leading-relaxed">
              "To become a media agency known for excellence, professionalism, and reliability through quality visual services."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 md:p-12 rounded-3xl glass-card border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 relative"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">OUR MISSION</span>
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold uppercase text-white mb-4">REFINING IDEAS INTO REALITY</h3>
            <p className="text-zinc-300 text-base font-light leading-relaxed">
              "To help brands and businesses refine and bring their ideas into reality by providing quality media services that build a strong and professional online presence."
            </p>
          </motion.div>
        </div>

        {/* Why ODA Stands Out Grid */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500">THE ODA EXPERIENCE</span>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white mt-1">
                WHAT MAKES US <span className="text-zinc-500">STAND OUT</span>
              </h3>
            </div>

            <button
              onClick={onOpenVisionModal}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/10"
            >
              <span>Fill Vision Questionnaire</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((diff, index) => {
              const Icon = diff.icon;
              return (
                <motion.div
                  key={diff.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl glass-card border border-zinc-800 hover:border-zinc-600 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl font-bold text-zinc-600 group-hover:text-white transition-colors">
                        {diff.num}
                      </span>
                      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>

                    <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-2">
                      {diff.title}
                    </h4>

                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
