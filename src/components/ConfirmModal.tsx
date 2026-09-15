'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6"
        >
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 p-2 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-900'
              }`}
            >
              {variant === 'danger' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-zinc-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-zinc-600 font-light mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg cursor-pointer ${
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                  : 'bg-black hover:bg-zinc-800 text-white shadow-black/10'
              }`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
