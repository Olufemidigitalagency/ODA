'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      // Demo simulated auth mode if Supabase env vars aren't set yet
      setTimeout(() => {
        setLoading(false);
        const demoUser = { email, id: `demo-${Date.now()}` };
        onAuthSuccess(demoUser);
        onClose();
      }, 600);
      return;
    }

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          setMessage({ type: 'success', text: 'Account created! Check your email or proceed to sign in.' });
          setMode('signin');
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-md w-full bg-[#09090b] rounded-3xl border border-zinc-800 p-8 md:p-10 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <span className="font-mono text-2xl font-black text-white tracking-widest uppercase">ODA</span>
            <h2 className="text-xl font-bold uppercase text-white mt-2">
              {mode === 'signin' ? 'CLIENT PORTAL ACCESS' : 'CREATE ACCOUNT'}
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {mode === 'signin' ? 'Sign in with your Supabase credentials' : 'Register to submit & manage agency projects'}
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl mb-6 text-xs font-mono text-center ${
                message.type === 'error'
                  ? 'bg-red-950/60 border border-red-800/40 text-red-400'
                  : 'bg-green-950/60 border border-green-800/40 text-green-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="client@oda.studio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 mt-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-zinc-900">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setMessage(null);
              }}
              className="text-xs text-zinc-400 hover:text-white font-mono transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
