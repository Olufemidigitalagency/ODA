'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, ArrowUp, CheckCircle, Instagram, MessageSquare } from 'lucide-react';
import { saveVisionQuestionnaire } from '../lib/data-store';

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.05A6.34 6.34 0 0 0 3.5 15.688a6.342 6.342 0 0 0 6.346 6.312c3.504 0 6.346-2.825 6.346-6.312V9.05a8.211 8.211 0 0 0 4.797 1.536V7.14a4.845 4.845 0 0 1-1.4-0.454z" />
  </svg>
);

export function FooterSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !details) return;

    // 1. Construct formatted message for WhatsApp with tick checkmarks
    const formattedMessage = `✓ *ODA PROJECT INQUIRY*

✓ *CLIENT DETAILS*
• *Name:* ${name}
• *Email:* ${email}

✓ *PROJECT DETAILS & BUDGET*
${details}`;

    // 2. Save inquiry to database & local cache so it appears in Admin dashboard as well
    try {
      await saveVisionQuestionnaire({
        client_name: name,
        email: email,
        services_requested: ['Project Inquiry'],
        vision_description: details,
      });
    } catch (err) {
      console.warn('Failed to save questionnaire locally', err);
    }

    // 3. WhatsApp Redirect with designated number
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348068957236';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedMessage)}`;

    // Open WhatsApp tab
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setDetails('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      label: 'TikTok',
      icon: TikTokIcon,
      href: 'https://www.tiktok.com/@olufemidigitalagency?_r=1&_d=f223ia2mla55a2&sec_uid=MS4wLjABAAAAiDPKg5HGtPUKln5snIMw6uPfSoVmKnzhPzSQmhnse61OSh3u2MLKoolAGlxNjUxi&share_author_id=7122667464702198789&sharer_language=en&source=h5_m&u_code=e30a0372ih380k&timestamp=1789588535&user_id=7122667464702198789&sec_user_id=MS4wLjABAAAAiDPKg5HGtPUKln5snIMw6uPfSoVmKnzhPzSQmhnse61OSh3u2MLKoolAGlxNjUxi&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7686111161926993672&share_link_id=11cf0e4a-aa69-4059-878c-d2fe2fc14e86&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2CEnlargeAvatarActivity&social_share_type=5&share_enter_from=personal_homepage&item_author_type=1&enable_checksum=1',
    },
    {
      label: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/olufemidigitalagency?stkn=Njh0ZW5tdHV4dXVr',
    },
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
              Have a project in mind or want to elevate your brand presence? Send us an inquiry below or reach out via WhatsApp.
            </p>

            {/* Official Agency Social Media Links (TikTok & Instagram Only) */}
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
                    className="p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-black hover:border-zinc-900 transition-all duration-300 active:scale-95 shadow-sm flex items-center justify-center"
                    title={s.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-zinc-900 flex items-center justify-between">
                <span>PROJECT INQUIRY</span>
                <span className="text-[10px] font-mono text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1 font-semibold">
                  <MessageSquare className="w-3 h-3" />
                  WHATSAPP DIRECT
                </span>
              </h3>

              {submitted ? (
                <div className="p-6 text-center space-y-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                  <h4 className="font-bold uppercase text-zinc-900">INQUIRY SENT VIA WHATSAPP</h4>
                  <p className="text-xs text-zinc-600 font-mono">Opening WhatsApp with your proposal details...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Work Email Address *"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Project details & estimated budget... *"
                      rows={3}
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-zinc-900 text-white font-semibold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 active:scale-95 cursor-pointer"
                  >
                    <span>Send Proposal via WhatsApp</span>
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
            <img
              src="/logo.png"
              alt="Olufemi Digital Agency Logo"
              className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
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
