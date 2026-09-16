'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Review } from '../lib/supabase/types';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquareQuote, Play, Pause } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    } else {
      setScrollProgress(100);
    }

    const cardWidth = 380;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(0, index), Math.max(0, reviews.length - 1)));
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollState();
      el.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [reviews]);

  // Smooth Auto Shuffle / Scroll Loop (Pauses on Hover or User Toggle)
  useEffect(() => {
    if (!isAutoPlay || isHovered || reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      // If near the end of scrollable area, loop back to start smoothly
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = 380;
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, reviews.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="reviews" className="py-28 px-6 md:px-12 bg-white relative border-t border-zinc-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 font-medium mb-3">
              <MessageSquareQuote className="w-4 h-4 text-zinc-900" />
              <span>TESTIMONIALS & REVIEWS</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-zinc-900">
              CLIENT <span className="text-zinc-400">VOICES</span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-6">
            <p className="text-zinc-600 text-sm md:text-base max-w-md font-light leading-relaxed md:text-right">
              Read what brand founders and creative directors say about collaborating with Olufemi Digital Agency.
            </p>

            {/* Navigation & Autoplay Controls */}
            <div className="flex items-center gap-4">
              {/* Autoplay Status Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                title={isAutoPlay ? 'Pause Auto Scroll' : 'Play Auto Scroll'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 text-[11px] font-mono uppercase tracking-wider text-zinc-600 hover:border-zinc-900 hover:text-black transition-colors cursor-pointer bg-zinc-50/80"
              >
                {isAutoPlay ? (
                  <>
                    <Pause className="w-3 h-3 text-green-600 fill-green-600" />
                    <span>AUTO SHUFFLE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-zinc-400" />
                    <span>PAUSED</span>
                  </>
                )}
              </motion.button>

              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mr-1">
                <span className="text-zinc-900 font-bold">
                  {reviews.length > 0 ? String(currentIndex + 1).padStart(2, '0') : '00'}
                </span>{' '}
                / {String(reviews.length).padStart(2, '0')}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous review"
                className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  canScrollLeft
                    ? 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white shadow-sm'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next review"
                className={`p-3.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  canScrollRight
                    ? 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white shadow-sm'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 -mx-6 px-6 md:-mx-12 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 snap-start p-8 md:p-10 rounded-3xl bg-[#fafafa] border border-zinc-200/90 flex flex-col justify-between relative group hover:border-zinc-900 hover:bg-white transition-all duration-500 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-zinc-200 group-hover:text-zinc-300 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-zinc-700 text-sm md:text-base font-light leading-relaxed mb-10 italic">
                  "{review.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-200/80">
                <img
                  src={review.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                  alt={review.author_name}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-300 group-hover:border-zinc-900 transition-colors shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
                    {review.author_name}
                  </h4>
                  <p className="text-xs font-mono text-zinc-500 font-medium">{review.author_role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Indicator Bar */}
        <div className="mt-8 w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            style={{ width: `${scrollProgress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
}
