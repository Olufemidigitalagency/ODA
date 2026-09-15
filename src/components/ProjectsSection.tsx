'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../lib/supabase/types';
import { ArrowUpRight, X, User, Film, Play, Image as ImageIcon } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [activeTabMedia, setActiveTabMedia] = useState<'video' | 'gallery'>('gallery');

  const categories = ['All', 'Photography', 'Videography', 'Graphic Design', 'Campaigns'];

  useEffect(() => {
    if (activeProject) {
      setActiveMediaIndex(0);
      setActiveTabMedia(activeProject.video_url ? 'video' : 'gallery');
    }
  }, [activeProject]);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-28 px-6 md:px-12 bg-[#fafafa] relative border-t border-zinc-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500 font-medium">PORTFOLIO SHOWCASE</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-zinc-900 mt-2">
              OUR <span className="text-zinc-400">SERVICES</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/10'
                    : 'bg-white text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200/90 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Animated Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer rounded-3xl bg-white border border-zinc-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-zinc-400 transition-all duration-500 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 text-[10px] uppercase font-mono tracking-widest text-zinc-900 font-semibold shadow-sm">
                      {project.category}
                    </span>
                    {project.video_url && (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] uppercase font-mono text-white flex items-center gap-1 backdrop-blur-md shadow-sm">
                        <Film className="w-3 h-3 text-white" />
                        Video
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 p-3.5 rounded-full bg-zinc-900 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-900 group-hover:text-black transition-colors">
                      {project.title}
                    </h3>
                    <span className="font-mono text-xs text-zinc-400 font-medium">{project.year || '2025'}</span>
                  </div>

                  <p className="text-zinc-600 text-xs line-clamp-2 font-light mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-[10px] text-zinc-600 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {project.gallery_images && project.gallery_images.length > 1 && (
                      <span className="text-[10px] font-mono text-zinc-500 font-medium">
                        {project.gallery_images.length} Photos
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Case Study Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-md p-4 md:p-12 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 z-20 p-3 rounded-full bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Player / Main Showcase Viewer */}
              <div className="relative aspect-video w-full bg-black overflow-hidden group">
                {activeTabMedia === 'video' && activeProject.video_url ? (
                  <video
                    src={activeProject.video_url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeMediaIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={
                        activeProject.gallery_images && activeProject.gallery_images[activeMediaIndex]
                          ? activeProject.gallery_images[activeMediaIndex]
                          : activeProject.image_url
                      }
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                )}
              </div>

              {/* Media Switcher Tabs & Thumbnail Bar */}
              <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                {/* Media Type Toggles (if video exists) */}
                {activeProject.video_url && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTabMedia('video')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTabMedia === 'video'
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'bg-white text-zinc-700 border border-zinc-200 hover:text-black'
                      }`}
                    >
                      <Play className="w-3 h-3" />
                      <span>Video Showcase</span>
                    </button>
                    <button
                      onClick={() => setActiveTabMedia('gallery')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeTabMedia === 'gallery'
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'bg-white text-zinc-700 border border-zinc-200 hover:text-black'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Photo Gallery</span>
                    </button>
                  </div>
                )}

                {/* Thumbnails Selector */}
                {activeTabMedia === 'gallery' && activeProject.gallery_images && activeProject.gallery_images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {activeProject.gallery_images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          activeMediaIndex === idx
                            ? 'border-zinc-900 scale-105 shadow-md shadow-zinc-900/10'
                            : 'border-zinc-300 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Case Study Details */}
              <div className="p-6 md:p-10 space-y-6 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-medium">
                      {activeProject.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-zinc-900 mt-1">
                      {activeProject.title}
                    </h2>
                  </div>

                  {activeProject.client_name && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 text-xs text-zinc-700 font-mono bg-zinc-50 shadow-sm">
                      <User className="w-3.5 h-3.5" />
                      <span>{activeProject.client_name}</span>
                    </div>
                  )}
                </div>

                <p className="text-zinc-600 text-base md:text-lg font-light leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeProject.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
