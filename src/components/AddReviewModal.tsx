'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Review } from '../lib/supabase/types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (review: Omit<Review, 'id'>) => void;
}

export function AddReviewModal({ isOpen, onClose, onReviewAdded }: AddReviewModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content) return;

    onReviewAdded({
      author_name: authorName,
      author_role: authorRole || 'Client',
      author_avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      content,
      rating,
      approved: true,
    });

    onClose();
    // Reset
    setAuthorName('');
    setAuthorRole('');
    setContent('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-lg w-full bg-[#09090b] rounded-3xl border border-zinc-800 p-6 md:p-10 shadow-2xl relative my-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">
            SUBMIT REVIEW
          </h2>
          <p className="text-xs font-mono text-zinc-400 mb-8">
            Share your experience working with ODA Design Studio.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Evelyn Vance"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                TITLE / ROLE
              </label>
              <input
                type="text"
                placeholder="e.g. Founder at Acme Studio"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                RATING
              </label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-white fill-white' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">
                YOUR TESTIMONIAL *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the collaboration, quality of work, or impact..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm resize-none"
              />
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
                Post Review
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
