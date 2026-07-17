import { motion } from 'motion/react';
import { Lock, AlertCircle, RefreshCw } from 'lucide-react';

interface AccessDeniedProps {
  onRetry: () => void;
}

export function AccessDenied({ onRetry }: AccessDeniedProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Lock size={40} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your current session is invalid or has expired. Please verify your credentials or contact your administrator to regain access.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <RefreshCw size={18} />
            Retry Connection
          </button>
          
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mt-4">
            <AlertCircle size={14} />
            Authentication Source: n8n Verification
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
