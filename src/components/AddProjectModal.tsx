'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadMediaFile } from '../lib/data-store';
import { Project } from '../lib/supabase/types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Omit<Project, 'id'>) => void;
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Branding');
  const [clientName, setClientName] = useState('');
  const [year, setYear] = useState('2025');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Branding, Design, Strategy');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadMediaFile(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const finalImage = imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop';

    onProjectAdded({
      title,
      slug: slug || `project-${Date.now()}`,
      category,
      description,
      client_name: clientName,
      year,
      image_url: finalImage,
      tags,
      featured: true,
    });

    onClose();
    // Reset
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-2xl w-full bg-[#09090b] rounded-3xl border border-zinc-800 p-6 md:p-10 shadow-2xl relative my-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
            ADD NEW PROJECT
          </h2>
          <p className="text-xs font-mono text-zinc-400 mb-8">
            Add a portfolio piece. Uploaded media syncs with Supabase Storage.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VORTEX ARCHITECTURE"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors text-sm"
                >
                  <option value="Branding">Branding</option>
                  <option value="Web Design">Web Design</option>
                  <option value="3D & Motion">3D & Motion</option>
                  <option value="Digital Strategy">Digital Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                  CLIENT NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maison Aura"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                  YEAR
                </label>
                <input
                  type="text"
                  placeholder="2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                PROJECT DESCRIPTION *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Brief summary of project scope, challenges, and results..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                placeholder="Branding, 3D Motion, Packaging"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors text-sm"
              />
            </div>

            {/* Media Upload Box */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                PROJECT COVER MEDIA
              </label>
              <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 text-center bg-zinc-950 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="text-xs font-mono text-zinc-400">Uploading to Supabase Storage...</span>
                  </div>
                ) : imageUrl ? (
                  <div className="flex items-center justify-between p-2">
                    <img src={imageUrl} alt="Preview" className="h-16 rounded-lg object-cover" />
                    <span className="text-xs text-green-400 font-mono">Media Uploaded Successfully</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-zinc-500" />
                    <span className="text-xs text-zinc-300 font-medium">
                      Click or drag image file to upload
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">JPG, PNG, WEBP supported</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
              >
                Save Project
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
