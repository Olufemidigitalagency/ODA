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
    <section id="about" className="py-24 px-6 md:px-12 bg-[#fafafa] relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Top Tagline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono text-zinc-500 font-semibold whitespace-nowrap">ABOUT OLUFEMI DIGITAL AGENCY</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-zinc-900 leading-tight">
            WE DON'T JUST CREATE. <br />
            <span className="text-stroke">WE UNDERSTAND.</span>
          </h2>
          <p className="text-zinc-600 text-sm md:text-base font-light leading-relaxed">
            ODA (Olufemi Digital Agency) is a full-service creative media agency. We use photography, videography, content creation, and graphic design as strategic tools to build a strong, professional online presence for your brand.
          </p>
        </div>

        {/* Vision & Mission Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-medium">OUR VISION</span>
              <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-black uppercase text-zinc-900 mb-4 tracking-tight">EXCELLENCE & RELIABILITY</h3>
            <p className="text-zinc-600 text-base font-light leading-relaxed">
              "To become a media agency known for excellence, professionalism, and reliability through quality visual services."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 md:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-medium">OUR MISSION</span>
              <div className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-black uppercase text-zinc-900 mb-4 tracking-tight">REFINING IDEAS INTO REALITY</h3>
            <p className="text-zinc-600 text-base font-light leading-relaxed">
              "To help brands and businesses refine and bring their ideas into reality by providing quality media services that build a strong and professional online presence."
            </p>
          </motion.div>
        </div>

        {/* Why ODA Stands Out Grid */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500 font-medium">THE ODA EXPERIENCE</span>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-zinc-900 mt-1">
                WHAT MAKES US <span className="text-zinc-400">STAND OUT</span>
              </h3>
            </div>

            <button
              onClick={onOpenVisionModal}
              className="px-6 py-3 rounded-full bg-zinc-900 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-zinc-900/10 cursor-pointer"
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
                  className="p-7 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-zinc-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl font-bold text-zinc-300 group-hover:text-zinc-900 transition-colors">
                        {diff.num}
                      </span>
                      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                    </div>

                    <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider mb-2">
                      {diff.title}
                    </h4>

                    <p className="text-xs text-zinc-600 font-light leading-relaxed">
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
