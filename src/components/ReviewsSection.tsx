'use client';

import { motion } from 'framer-motion';
import { Review } from '../lib/supabase/types';
import { Star, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-28 px-6 md:px-12 bg-[#09090b] relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500">TESTIMONIALS & REVIEWS</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-white mt-2">
              CLIENT <span className="text-zinc-500">VOICES</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-md font-light">
            Read what brand founders and creative directors say about collaborating with Olufemi Digital Agency.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="p-8 md:p-10 rounded-3xl glass-card border border-zinc-800/80 flex flex-col justify-between relative group hover:border-zinc-500/80 transition-all duration-500 shadow-xl"
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-zinc-800/80 group-hover:text-zinc-600 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-white fill-white' : 'text-zinc-800'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed mb-10 italic">
                  "{review.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-900">
                <img
                  src={review.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                  alt={review.author_name}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-700/80 group-hover:border-white transition-colors"
                />
                <div>
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                    {review.author_name}
                  </h4>
                  <p className="text-xs font-mono text-zinc-500">{review.author_role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
