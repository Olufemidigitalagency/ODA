'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenVisionModal: () => void;
  user?: any;
  onSignOut?: () => void;
}

export function Navbar({ onOpenVisionModal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#projects' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 glass-header px-6 md:px-12 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo Link with Circular Emblem */}
          <a href="#top" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full glass-card border border-zinc-300 flex items-center justify-center overflow-hidden p-0.5 group-hover:border-black transition-colors duration-300">
              <img
                src="/logo-circle.png"
                alt="ODA Logo"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase font-mono text-zinc-900 group-hover:tracking-widest transition-all duration-300">
              ODA
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-zinc-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-black transition-colors py-1 relative group cursor-pointer"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenVisionModal}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-black/10 cursor-pointer"
            >
              <span>Share Your Vision</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-black focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[65px] z-40 bg-white/98 backdrop-blur-2xl md:hidden flex flex-col justify-between p-8 border-b border-zinc-200"
          >
            <div className="flex flex-col gap-6 text-2xl font-light uppercase tracking-widest text-zinc-700 pt-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-black hover:pl-2 transition-all duration-300 border-b border-zinc-100 pb-3 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-zinc-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenVisionModal();
                }}
                className="w-full py-3 text-sm font-semibold uppercase tracking-wider bg-black text-white rounded-xl flex items-center justify-center cursor-pointer"
              >
                <span>Share Your Vision</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
