import { motion } from 'motion/react';
import { 
  Database, 
  MessageSquare, 
  History, 
  Settings, 
  ShieldCheck, 
  Terminal,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  sessionId: string | null;
}

export function Sidebar({ isOpen, setIsOpen, sessionId }: SidebarProps) {
  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[260px] glass transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Database size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-white tracking-tight leading-none truncate">Cluster OS</h1>
                <span className="text-[10px] text-blue-500/80 uppercase tracking-[0.2em] font-black mt-1 block">Root Protocol</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-5 py-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Control Plane</p>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 transition-all duration-300">
                <MessageSquare size={16} />
                <span className="text-sm font-semibold truncate">Active Chat</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                <Terminal size={16} />
                <span className="text-sm font-semibold truncate">Node Terminal</span>
              </button>
            </div>

            <div className="space-y-2">
              <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">System</p>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                 <History size={16} className="text-slate-500" />
                 <span className="text-sm font-medium">Global History</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                 <Settings size={16} className="text-slate-500" />
                 <span className="text-sm font-medium">Node Settings</span>
              </button>
            </div>
          </nav>

          {/* System Health Section */}
          <div className="mt-auto p-8 border-t border-white/5 bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Core Status</p>
              <span className="text-[10px] font-bold text-emerald-500">OPTIMIZED</span>
            </div>
            
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
               />
            </div>

            <div className="flex justify-between font-mono text-[9px] text-slate-500 tracking-wider">
               <span>LATENCY: 14MS</span>
               <span>VERIFIED</span>
            </div>

            <div className="mt-6 flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase truncate">USER: {sessionId ? sessionId.slice(0, 8) + '...' : 'GUEST'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
