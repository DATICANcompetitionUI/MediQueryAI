import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  customerName: string;
  theme: 'light' | 'dark';
}

export function MessageBubble({ message, customerName, theme }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const initialChar = customerName ? customerName.charAt(0).toUpperCase() : 'U';

  // Format timestamp (HH:MM)
  const timeStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end animate-[messageAppear_0.25s_ease-out]' : 'justify-start'}`}
    >
      <div 
        className={`flex w-full items-start gap-3 ${
          isUser 
            ? 'flex-row-reverse max-w-[85%] lg:max-w-[70%]' 
            : 'flex-row max-w-[85%] lg:max-w-[70%]'
        }`}
      >
        {/* Avatar circle */}
        {isUser ? (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 border border-blue-500 shadow-md flex items-center justify-center text-white font-bold text-sm select-none">
            {initialChar}
          </div>
        ) : (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 font-bold text-base select-none">
            🤖
          </div>
        )}

        <div className={`flex flex-col flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          
          {/* AI Info Header */}
          {!isUser && (
            <span className="text-xs font-semibold text-slate-500 mb-1 pl-1">
              DataChat AI
            </span>
          )}

          {/* Chat Bubble Container */}
          <div 
            className={`shadow-sm px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white rounded-[18px_18px_4px_18px]'
                : theme === 'dark'
                  ? 'bg-slate-900 text-slate-100 rounded-[18px_18px_18px_4px] border border-slate-800 shadow-2xl shadow-slate-950/50'
                  : 'bg-[#f1f5f9] text-[#1e293b] rounded-[18px_18px_18px_4px] border border-[#e2e8f0]'
            }`}
          >
            <div className="prose-config w-full overflow-x-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customized HTML Tables matching standard spec
                  table: ({ children }) => (
                    <div className={`my-4 overflow-x-auto rounded-[12px] border shadow-md ${
                      theme === 'dark' 
                        ? 'border-slate-800 bg-slate-950/80 shadow-slate-950/20' 
                        : 'border-[#e2e8f0] bg-white'
                    }`}>
                      <table className="w-full border-collapse text-[13px] text-left">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className={`font-bold border-b ${
                      theme === 'dark' 
                        ? 'bg-slate-950 text-slate-300 border-slate-800' 
                        : 'bg-[#0f172a] text-white border-[#e2e8f0]'
                    }`}>
                      {children}
                    </thead>
                  ),
                  tr: ({ children }) => (
                    <tr className={`border-b last:border-0 transition-colors ${
                      theme === 'dark'
                        ? 'border-slate-900 odd:bg-slate-950/40 even:bg-slate-900/30'
                        : 'border-[#e2e8f0] odd:bg-white even:bg-[#eff6ff]'
                    }`}>
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className={`px-4 py-3 font-black tracking-widest text-[11px] uppercase border-r last:border-r-0 ${
                      theme === 'dark' 
                        ? 'text-cyan-300 border-slate-900 bg-slate-950' 
                        : 'text-amber-300 border-[#1e293b]/20 bg-[#0f172a]'
                    }`}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className={`px-4 py-2.5 font-normal border-r last:border-r-0 ${
                      theme === 'dark' 
                        ? 'text-slate-300 border-slate-900' 
                        : 'text-slate-800 border-[#e2e8f0]'
                    }`}>
                      {children}
                    </td>
                  ),
                  p: ({ children }) => (
                    <p className={`mb-3 last:mb-0 leading-relaxed text-[14px] ${
                      isUser 
                        ? 'text-white font-medium' 
                        : theme === 'dark' 
                          ? 'text-slate-200' 
                          : 'text-slate-700'
                    }`}>
                      {children}
                    </p>
                  ),
                  code: ({ children, className }) => {
                    const inline = !className;
                    return inline ? (
                      <code className={`px-1.5 py-0.5 rounded font-mono text-[0.85em] ${
                        isUser 
                          ? 'bg-blue-700 text-blue-100' 
                          : theme === 'dark'
                            ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                            : 'bg-slate-200/80 text-slate-800 border border-slate-300'
                      }`}>
                        {children}
                      </code>
                    ) : (
                      <pre className="p-4 rounded-xl border border-white/5 bg-[#1e293b] text-white overflow-x-auto my-3 font-mono text-[13px] leading-relaxed select-text shadow-inner">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  pre: ({ children }) => children, // pre is handled above in code block component
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-600 hover:text-blue-500 underline underline-offset-4 transition-colors font-bold">
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1 my-3 text-[14px]">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1 my-3 text-[14px]">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className={`${
                      isUser 
                        ? 'text-white font-medium' 
                        : theme === 'dark' 
                          ? 'text-slate-300' 
                          : 'text-slate-600'
                    }`}>{children}</li>
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Timestamp Indicator */}
          <span className="text-[10px] text-slate-400 font-semibold mt-1 px-1 flex items-center gap-1.5 uppercase select-none">
            {timeStr}
          </span>

        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full mb-6 justify-start"
    >
      <div className="flex flex-row items-start gap-3 max-w-[85%] lg:max-w-[70%] animate-[messageAppear_0.25s_ease-out]">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 border border-slate-300 shadow-sm flex items-center justify-center text-slate-700 font-bold text-base select-none">
          🤖
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-500 mb-1 pl-1">
            DataChat AI
          </span>
          <div className={`px-5 py-4 rounded-[18px_18px_18px_4px] flex gap-1.5 items-center shadow-sm ${
            theme === 'dark' 
              ? 'bg-slate-900 border border-slate-800' 
              : 'bg-[#f1f5f9] border border-[#e2e8f0]'
          }`}>
            <motion.div
              animate={{ translateY: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'}`}
            />
            <motion.div
              animate={{ translateY: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
              className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'}`}
            />
            <motion.div
              animate={{ translateY: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
              className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-500'}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
