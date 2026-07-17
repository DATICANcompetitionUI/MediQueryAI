import React from 'react';
import { X, History, FileSpreadsheet, Calendar } from 'lucide-react';
import { ImportItem } from '../types';

interface HistoryModalProps {
  history: ImportItem[];
  onClose: () => void;
}

export function HistoryModal({ history, onClose }: HistoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col text-slate-800 animate-[scale_0.2s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2.5">
            <History className="text-blue-600" size={22} /> Import History
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Tables Imported (This Session)
        </p>

        {/* List Content */}
        <div className="flex-1 max-h-[260px] overflow-y-auto custom-scrollbar-light space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-medium">
              <FileSpreadsheet className="w-12 h-12 stroke-[1.5] text-slate-300 mx-auto mb-3" />
              No imports this session.
            </div>
          ) : (
            history.map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold border border-blue-100">
                  <FileSpreadsheet size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    TableName: <code className="bg-slate-200/60 font-mono px-1.5 py-0.5 rounded text-[12px]">{item.tableName}</code>
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Rows: <span className="text-blue-600">{item.rowsInserted} rows</span>
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={10} />
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-8 border-t border-slate-100 pt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
