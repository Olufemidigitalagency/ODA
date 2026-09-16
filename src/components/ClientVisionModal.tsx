'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Camera, Video, Palette, Layers, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { saveVisionQuestionnaire } from '../lib/data-store';

interface ClientVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientVisionModal({ isOpen, onClose }: ClientVisionModalProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [brandName, setBrandName] = useState('');
  const [visionDescription, setVisionDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('Custom');
  const [preferredTimeline, setPreferredTimeline] = useState('Within 2-4 Weeks');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableServices = [
    { id: 'Photography', label: 'Photography', desc: 'Brand, Portraits, Headshots, Events, Product', icon: Camera },
    { id: 'Videography', label: 'Videography', desc: 'Campaigns, Highlights, Talking Head, BTS, Product Videos', icon: Video },
    { id: 'Graphic Design', label: 'Graphic Design', desc: 'Flyers, Carousels, Logos, Slide Decks, Branding', icon: Palette },
    { id: 'One Media Partner', label: 'All-in-One Media Package', desc: 'Full-suite Photography, Video & Design combined', icon: Layers },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const formatVisionBriefForWhatsApp = () => {
    const servicesList = selectedServices.length > 0 ? selectedServices.join(', ') : 'Custom Media Package';

    return `✓ *ODA CLIENT VISION BRIEF*

✓ *CLIENT INFORMATION*
• *Name:* ${clientName}
• *Email:* ${email}
• *Phone:* ${phone || 'Not provided'}
• *Brand/Business:* ${brandName || 'Not specified'}

✓ *SERVICES REQUESTED*
• ${servicesList}

✓ *VISION & CREATIVE DIRECTION*
${visionDescription}

✓ *TARGET AUDIENCE*
• ${targetAudience || 'Not specified'}

✓ *BUDGET & TIMELINE*
• *Estimated Budget:* ${estimatedBudget || 'Custom'}
• *Preferred Timeline:* ${preferredTimeline || 'Within 2-4 Weeks'}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to database & local storage for Admin dashboard
    await saveVisionQuestionnaire({
      client_name: clientName,
      email,
      phone,
      brand_name: brandName,
      services_requested: selectedServices,
      vision_description: visionDescription,
      target_audience: targetAudience,
      estimated_budget: estimatedBudget,
      preferred_timeline: preferredTimeline,
    });

    // Format & redirect directly to WhatsApp
    const message = formatVisionBriefForWhatsApp();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348068957236';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setIsSubmitted(false);
      setSelectedServices([]);
      setBrandName('');
      setVisionDescription('');
      setTargetAudience('');
      setClientName('');
      setEmail('');
      setPhone('');
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-2xl w-full bg-white rounded-3xl border border-zinc-200 p-6 md:p-10 shadow-2xl relative my-auto"
        >
          <button
            onClick={resetAndClose}
            className="absolute top-6 right-6 p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div>
              {/* Header Badge */}
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase mb-2">
                <span>ODA CLIENT VISION QUESTIONNAIRE</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 tracking-tight">
                WE REFINE & BRING YOUR IDEAS TO LIFE
              </h2>
              <p className="text-xs text-zinc-600 font-light mt-1 mb-6">
                Step {step} of 3 — Express what you have in mind, even if you don't know exactly how to explain it.
              </p>

              {/* Step Progress Bar */}
              <div className="w-full h-1 bg-zinc-200 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: '33%' }}
                  animate={{ width: `${step * 33.3}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Services Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600">
                      WHAT MEDIA SERVICES DO YOU NEED? (SELECT ALL THAT APPLY)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableServices.map((service) => {
                        const Icon = service.icon;
                        const isSelected = selectedServices.includes(service.id);

                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 ${
                              isSelected
                                ? 'bg-zinc-100 border-black text-zinc-900 shadow-lg'
                                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-400'
                            }`}
                          >
                            <div className={`p-2 rounded-xl border ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-zinc-900 uppercase">{service.label}</h4>
                              <p className="text-[11px] text-zinc-600 font-light mt-0.5">{service.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        type="button"
                        disabled={selectedServices.length === 0}
                        onClick={() => setStep(2)}
                        className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-40 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Vision & Brand Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                        BRAND OR BUSINESS NAME
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Fashion / Personal Brand"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                        DESCRIBE YOUR VISION / WHAT DO YOU WANT TO ACHIEVE? *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share your goals, ideas, style preferences, or what you want people to feel when seeing your media..."
                        value={visionDescription}
                        onChange={(e) => setVisionDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                        TARGET AUDIENCE (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Young professionals, B2B corporate clients, Luxury consumers"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        disabled={!visionDescription}
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-40 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <span>Final Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact & Submission */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                          YOUR FULL NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Olufemi Davies"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                          WORK EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="client@brand.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                        PHONE / WHATSAPP (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="+234 / +1 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                          ESTIMATED BUDGET
                        </label>
                        <input
                          type="text"
                          value={estimatedBudget}
                          onChange={(e) => setEstimatedBudget(e.target.value)}
                          placeholder="Custom"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-black transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono tracking-wider text-zinc-600 mb-1.5">
                          PREFERRED TIMELINE
                        </label>
                        <select
                          value={preferredTimeline}
                          onChange={(e) => setPreferredTimeline(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-black transition-colors text-sm"
                        >
                          <option value="ASAP (Urgent)">ASAP (Urgent)</option>
                          <option value="Within 2-4 Weeks">Within 2-4 Weeks</option>
                          <option value="Within 1-2 Months">Within 1-2 Months</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || !clientName || !email}
                        className="px-8 py-3.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-40 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <span>{isSubmitting ? 'Sending...' : 'Send Vision via WhatsApp'}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          ) : (
            <div className="py-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-black uppercase text-zinc-900 tracking-tight">
                VISION BRIEF RECEIVED!
              </h2>

              <p className="text-zinc-600 text-sm font-light max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-zinc-900 font-bold">{clientName}</span>. Your vision brief has been formatted and opened directly in WhatsApp, and saved for our creative directors.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const message = formatVisionBriefForWhatsApp();
                    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348068957236';
                    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
                    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="px-6 py-3.5 rounded-full bg-green-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-green-700 transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Chat on WhatsApp</span>
                </button>

                <button
                  onClick={resetAndClose}
                  className="px-6 py-3.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
