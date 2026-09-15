'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Palette, Compass, CheckCircle2 } from 'lucide-react';

export function ServicesSection({ onOpenVisionModal }: { onOpenVisionModal?: () => void }) {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: '01',
      title: 'PHOTOGRAPHY',
      icon: Camera,
      tagline: 'CAPTURING YOUR BRAND WITH PRECISION',
      description: 'High-impact commercial, corporate, and editorial photography that communicates quality and builds instant credibility.',
      deliverables: [
        'Brand & Commercial Photography',
        'Corporate Event Photography',
        'Headshots & Professional Portraits',
        'Campaign Photography',
        'Product Pictures & Studio Shoots'
      ],
    },
    {
      id: '02',
      title: 'VIDEOGRAPHY',
      icon: Video,
      tagline: 'CINEMATIC MOTION THAT SELLS & INSPIRES',
      description: 'End-to-end video production from high-converting product ads and talking heads to documentary event highlights.',
      deliverables: [
        'Campaign Videos & Promotional Ads',
        'Event Video Highlights & Documentation',
        'Talking Head & Interview Videos',
        'Product & E-Commerce Advertising Videos',
        'Social Media Videos & Reels',
        'Behind-the-Scenes (BTS) Videos'
      ],
    },
    {
      id: '03',
      title: 'GRAPHIC DESIGN',
      icon: Palette,
      tagline: 'ELEGANT VISUAL SYSTEM & PROMOTIONAL ASSETS',
      description: 'Custom flyer designs, high-engagement social carousel slides, presentation decks, and brand identity systems.',
      deliverables: [
        'Flyer & Promotional Designs',
        'Carousel & Slide Designs (Social Media)',
        'Logo Design & Visual Identity',
        'Seasonal & Occasion Designs',
        'Presentation Decks & Pitch Material',
        'Event & Campaign Graphics'
      ],
    },
    {
      id: '04',
      title: 'VISION & STRATEGY',
      icon: Compass,
      tagline: 'WE UNDERSTAND & REFINE YOUR VISION',
      description: 'Our Client Vision Questionnaire guides your ideas into a clear, structured creative direction with one reliable media partner.',
      deliverables: [
        'Client Vision Questionnaire Assessment',
        'Concept Development & Idea Refinement',
        'One Media Partner Management',
        'Omnichannel Visual Content Strategy'
      ],
    },
  ];

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-[#09090b] relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500">OUR SCOPE OF SERVICES</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mt-2">
              ONE MEDIA <br />
              <span className="text-zinc-500">PARTNER</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-md font-light">
            Instead of managing scattered freelancers, ODA brings photography, videography, content creation, and graphic design together under one roof.
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Service Selector Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;

              return (
                <button
                  key={service.id}
                  onClick={() => setActiveService(index)}
                  className={`w-full text-left p-6 rounded-2xl glass-card transition-all duration-300 flex items-center justify-between group ${
                    isActive
                      ? 'bg-zinc-900 border-white/30 shadow-xl shadow-white/5 scale-[1.02]'
                      : 'hover:border-zinc-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-zinc-500">{service.id}</span>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <h3 className="font-bold text-sm md:text-base uppercase tracking-wider text-white">
                      {service.title}
                    </h3>
                  </div>

                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Service Showcase Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-12 rounded-3xl glass-card border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-3xl md:text-5xl font-bold text-zinc-700">
                    {services[activeService].id}
                  </span>
                  <div className="p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-white">
                    {(() => {
                      const ActiveIcon = services[activeService].icon;
                      return <ActiveIcon className="w-6 h-6" />;
                    })()}
                  </div>
                </div>

                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block mb-1">
                  {services[activeService].tagline}
                </span>

                <h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-4">
                  {services[activeService].title}
                </h3>

                <p className="text-zinc-300 text-base md:text-lg font-light leading-relaxed mb-8">
                  {services[activeService].description}
                </p>

                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <p className="text-xs uppercase tracking-widest font-mono text-zinc-500">SCOPE & CAPABILITIES</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services[activeService].deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-zinc-300 font-light">
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeService === 3 && onOpenVisionModal && (
                  <button
                    onClick={onOpenVisionModal}
                    className="mt-8 w-full py-4 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                  >
                    <span>Start Client Vision Questionnaire</span>
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
