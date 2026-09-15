'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, ArrowUp, CheckCircle, Instagram, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';

export function FooterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { label: 'Twitter / X', icon: Twitter, href: 'https://x.com' },
    { label: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ];

  return (
    <footer id="contact" className="bg-[#fafafa] text-zinc-900 pt-24 pb-12 px-6 md:px-12 border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto">
        {/* Contact CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24 pb-20 border-b border-zinc-200/80">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-zinc-500 font-medium">START A CONVERSATION</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.95] text-zinc-900">
              LET'S BUILD <br />
              <span className="text-stroke">SOMETHING ICONIC</span>
            </h2>
            <p className="text-zinc-600 text-base md:text-xl font-light max-w-lg pt-4 leading-relaxed">
              Have a project in mind or want to elevate your brand presence? Send us an inquiry or email us directly at{' '}
              <a href="mailto:hello@oda.studio" className="text-zinc-900 font-semibold underline underline-offset-4 hover:text-zinc-600 transition-colors">
                hello@oda.studio
              </a>
              .
            </p>

            {/* Social Media Clickable Links */}
            <div className="flex items-center gap-4 pt-6">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-900 transition-all duration-300 active:scale-95 shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-zinc-900">PROJECT INQUIRY</h3>

              {submitted ? (
                <div className="p-6 text-center space-y-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <CheckCircle className="w-10 h-10 text-zinc-900 mx-auto" />
                  <h4 className="font-bold uppercase text-zinc-900">INQUIRY RECEIVED</h4>
                  <p className="text-xs text-zinc-600 font-mono">Our creative director will reach out to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Work Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Project details & estimated budget..."
                      rows={3}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-zinc-900 text-white font-semibold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 active:scale-95 cursor-pointer"
                  >
                    <span>Submit Proposal</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation & Brand Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-zinc-200/80">
          <a href="#top" className="group">
            <span className="text-4xl font-black uppercase font-mono tracking-tighter text-zinc-900 group-hover:tracking-widest transition-all duration-300">
              ODA
            </span>
            <p className="text-xs text-zinc-500 font-mono mt-1 whitespace-nowrap font-medium">OLUFEMI DIGITAL AGENCY</p>
          </a>

          <div className="flex flex-wrap items-center gap-8 text-xs font-mono text-zinc-600 uppercase tracking-widest font-medium">
            <a href="#about" className="hover:text-black transition-colors cursor-pointer">ABOUT</a>
            <a href="#services" className="hover:text-black transition-colors cursor-pointer">SERVICES</a>
            <a href="#projects" className="hover:text-black transition-colors cursor-pointer">WORK</a>
            <a href="#reviews" className="hover:text-black transition-colors cursor-pointer">REVIEWS</a>
            <a href="#contact" className="hover:text-black transition-colors cursor-pointer">CONTACT</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white border border-zinc-200 hover:border-zinc-900 text-zinc-900 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Copyright — Secret Admin Gateway */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 font-medium gap-4">
          <Link
            href="/admin"
            className="hover:text-zinc-900 transition-colors cursor-pointer select-none"
            title="ODA Admin Portal"
          >
            © {new Date().getFullYear()} OLUFEMI DIGITAL AGENCY (ODA). ALL RIGHTS RESERVED.
          </Link>
        </div>
      </div>
    </footer>
  );
}
