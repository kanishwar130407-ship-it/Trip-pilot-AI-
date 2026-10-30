import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

export const ToastNotification: React.FC = () => {
  const toasts = useTripStore((s) => s.toasts);
  const removeToast = useTripStore((s) => s.removeToast);

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-xl border ${
              toast.type === 'success'
                ? 'bg-emerald-600/90 text-white border-emerald-500/50'
                : toast.type === 'error'
                ? 'bg-red-600/90 text-white border-red-500/50'
                : toast.type === 'warning'
                ? 'bg-amber-500/90 text-white border-amber-400/50'
                : 'bg-slate-900/90 text-white border-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-200" />
              ) : (
                <Info className="w-4 h-4 text-slate-300" />
              )}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
