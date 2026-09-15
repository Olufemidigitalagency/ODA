'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../lib/supabase/types';
import { ArrowUpRight, X, User } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ['All', 'Photography', 'Videography', 'Graphic Design', 'Campaigns'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-28 px-6 md:px-12 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500">PORTFOLIO SHOWCASE</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-white mt-2">
              OUR <span className="text-zinc-500">SERVICES</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-xl shadow-white/10'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
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
                className="group cursor-pointer rounded-3xl glass-card overflow-hidden glass-card-hover flex flex-col justify-between border border-zinc-800/80"
              >
                {/* Image Container with Zoom effect */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full glass-card border border-white/15 text-[10px] uppercase font-mono tracking-widest text-white backdrop-blur-md">
                    {project.category}
                  </div>

                  <div className="absolute bottom-4 right-4 p-3.5 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                      {project.title}
                    </h3>
                    <span className="font-mono text-xs text-zinc-500">{project.year || '2025'}</span>
                  </div>

                  <p className="text-zinc-400 text-xs line-clamp-2 font-light mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-[10px] text-zinc-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 md:p-12 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-[#09090b] rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video w-full relative bg-zinc-900">
                <img
                  src={activeProject.image_url}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:p-12 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">
                      {activeProject.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white mt-1">
                      {activeProject.title}
                    </h2>
                  </div>

                  {activeProject.client_name && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-zinc-800 text-xs text-zinc-300 font-mono">
                      <User className="w-3.5 h-3.5" />
                      <span>{activeProject.client_name}</span>
                    </div>
                  )}
                </div>

                <p className="text-zinc-300 text-base md:text-lg font-light leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {activeProject.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
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
