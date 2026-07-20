import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  ChevronDown, 
  FileSpreadsheet, 
  History, 
  LogOut, 
  Settings,
  Mail,
  User,
  ExternalLink,
  Bot,
  Sun,
  Moon
} from 'lucide-react';
import { Message, ImportItem } from './types';
import { MessageBubble, TypingIndicator } from './components/Message';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { AnalyseModal } from './components/AnalyseModal';
import { ImportModal } from './components/ImportModal';
import { HistoryModal } from './components/HistoryModal';

export default function App() {
  // App routing views: 'login' | 'register' | 'chat'
  const [view, setView] = useState<'login' | 'register' | 'chat'>('login');
  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem("chatbot_theme");
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const toggleTheme = () => {
    const target = theme === 'light' ? 'dark' : 'light';
    setTheme(target);
    localStorage.setItem("chatbot_theme", target);
  };
  
  // Auth details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  // Chat interface states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [paperclipOpen, setPaperclipOpen] = useState(false);

  // Excel flow states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyseModalOpen, setIsAnalyseModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // History list
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [importHistory, setImportHistory] = useState<ImportItem[]>([]);

  // Refs for auto-scroll and file clicks
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const paperclipRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const analyseInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Character limit rules (max 2000 chars)
  const CHAR_LIMIT = 2000;
  const charsRemaining = CHAR_LIMIT - input.length;

  // Sync on startup (auto-login check)
  useEffect(() => {
    // Check URL parameters for premium override sessions
    const params = new URLSearchParams(window.location.search);
    const urlSession = params.get('sessionId');

    const savedSession = localStorage.getItem("chatbot_session_id");
    const savedName = localStorage.getItem("chatbot_customer_name");
    const savedEmail = localStorage.getItem("chatbot_email") || "user@datacompany.com";

    if (urlSession) {
      // Prioritize explicit sessionId in query
      setSessionId(urlSession);
      setCustomerName(savedName || "Valued Customer");
      setCustomerEmail(savedEmail);
      setView('chat');
    } else if (savedSession && savedName) {
      setSessionId(savedSession);
      setCustomerName(savedName);
      setCustomerEmail(savedEmail);
      setView('chat');
    } else {
      setView('login');
    }
  }, []);

  const deserializeMessages = (storedStr: string): Message[] => {
    try {
      const raw = JSON.parse(storedStr);
      if (!Array.isArray(raw)) return [];
      return raw.map((m: any) => {
        const date = new Date();
        if (m.time && typeof m.time === 'string' && m.time.includes(':')) {
          const [hours, minutes] = m.time.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            date.setHours(hours, minutes, 0, 0);
          }
        }
        return {
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text || '',
          timestamp: date
        };
      });
    } catch (e) {
      console.error("Error parsing history", e);
      return [];
    }
  };

  // Initialize standard assistant greetings when view switches to 'chat'
  useEffect(() => {
    if (view === 'chat' && customerName) {
      const savedHistoryStr = localStorage.getItem("chatbot_history");
      if (savedHistoryStr) {
        const loaded = deserializeMessages(savedHistoryStr);
        if (loaded.length > 0) {
          setMessages(loaded);
          return;
        }
      }

      const capitalizedName = customerName.charAt(0).toUpperCase() + customerName.slice(1);
      setMessages([
        {
          role: 'assistant',
          content: `Hello ${capitalizedName}! 👋 I'm your DataChat AI assistant.

Ask me anything about your patients, diagnoses, prescriptions, or lab results in plain English.

You can also:
📎 **Analyse reference records** — upload an Excel sheet and ask questions instantly
💾 **Import clinical database schema** — permanently save your records to your database to query anytime

What would you like to know today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [view, customerName]);

  // Persist messages to localStorage under "chatbot_history"
  useEffect(() => {
    if (view === 'chat' && messages.length > 0) {
      const last100 = messages.slice(-100);
      const serialized = last100.map(m => {
        const d = m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;
        return {
          role: m.role === 'user' ? 'user' : 'ai',
          text: m.content,
          time: timeStr
        };
      });
      localStorage.setItem("chatbot_history", JSON.stringify(serialized));
    }
  }, [messages, view]);

  // Handle outside click to close popups
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
      if (paperclipRef.current && !paperclipRef.current.contains(event.target as Node)) {
        setPaperclipOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Soft smooth auto-scroll to bottom of chat list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Success login hook
  const handleLoginSuccess = (sessId: string, name: string, email: string) => {
    localStorage.setItem("chatbot_session_id", sessId);
    localStorage.setItem("chatbot_customer_name", name);
    setSessionId(sessId);
    setCustomerName(name);
    setCustomerEmail(email);
    setSessionExpiredMessage(null);
    setView('chat');
  };

  // Switch to register page
  const handleSwitchToRegister = () => {
    setSessionExpiredMessage(null);
    setView('register');
  };

  // Switch to login page with optional custom warning
  const handleLogout = (warningMessage?: string) => {
    localStorage.removeItem("chatbot_session_id");
    localStorage.removeItem("chatbot_customer_name");
    localStorage.removeItem("chatbot_history");
    
    // Clean states
    setSessionId("");
    setCustomerName("");
    setMessages([]);
    setImportHistory([]);
    setSelectedFile(null);

    if (warningMessage) {
      setSessionExpiredMessage(warningMessage);
    } else {
      setSessionExpiredMessage(null);
    }
    setView('login');
  };

  // Trigger file attachment selection dialogue
  const handleFileActionPick = (action: 'analyse' | 'import') => {
    setPaperclipOpen(false);
    if (action === 'analyse') {
      analyseInputRef.current?.click();
    } else {
      importInputRef.current?.click();
    }
  };

  // Handle spreadsheet file pick for local temporary analysis
  const handleAnalyseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsAnalyseModalOpen(true);
    }
    e.target.value = ''; // clear
  };

  // Handle spreadsheet file pick for permanent database creation
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsImportModalOpen(true);
    }
    e.target.value = ''; // clear
  };

  // Submit parsed spreadsheet data of temporary analysis to chat
  const handleAnalyseSubmit = (constructedChatInput: string, displayQuestion: string) => {
    setIsAnalyseModalOpen(false);
    setSelectedFile(null);

    // Add user question to messages list
    const userMsg: Message = {
      role: 'user',
      content: displayQuestion,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Fetch call on natural excel analysis
    triggerChatRequest(constructedChatInput);
  };

  // Submit permanent schema import webhook success
  const handleImportSuccess = (result: { tableName: string; rowsInserted: number }) => {
    setIsImportModalOpen(false);
    setSelectedFile(null);

    // Save success table logs
    const historyLog: ImportItem = {
      tableName: result.tableName,
      rowsInserted: result.rowsInserted,
      timestamp: new Date()
    };
    setImportHistory(prev => [historyLog, ...prev]);

    // Add beautiful styled assistant confirmation reply in chat log
    const confirmationMsg: Message = {
      role: 'assistant',
      content: `✅ **Excel import successful!**

**Table name:** \`${result.tableName}\`
**Rows imported:** ${result.rowsInserted} 

You can now query this data. Try asking:
*"Show me all rows from ${result.tableName}"*`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  // Trigger chat API
  const triggerChatRequest = async (chatText: string) => {
    try {
      const response = await fetch("https://n8n-production-b41a.up.railway.app/webhook/DataMediQueryAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          chatInput: chatText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout("Your session has expired. Please log in again.");
          return;
        }
        
        // Custom 429 message limit checks
        if (response.status === 429) {
          const errMsg = data.error && data.error.toLowerCase().includes("limit")
            ? "You have reached your monthly message limit. Please contact support to upgrade your plan."
            : "Too many requests. Please slow down.";
            
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: errMsg,
            timestamp: new Date()
          }]);
          setIsLoading(false);
          return;
        }

        // Generic webhook error
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Something went wrong. Please try again.",
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      // Display response output correctly
      const aiResponse = data.output || "No response received.";
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Connection failed. Check your internet and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom user sends a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    setInput('');

    // Append user bubble
    const userMsg: Message = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Trigger Chat hook
    triggerChatRequest(trimmedInput);
  };

  return (
    <div className="h-screen h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden selection:bg-blue-500/20">
      
      {/* View routing container */}
      <AnimatePresence mode="wait">
        
        {view === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full max-h-full overflow-hidden"
          >
            {/* Display expired notice inside login view if session fails */}
            {sessionExpiredMessage && (
              <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-800 p-3 sm:px-6 font-semibold text-center text-xs flex items-center justify-center gap-2">
                ⚠️ {sessionExpiredMessage}
              </div>
            )}
            <LoginView 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </motion.div>
        )}

        {view === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full max-h-full overflow-hidden"
          >
            <RegisterView 
              onRegisterSuccess={handleLoginSuccess}
              onSwitchToLogin={() => setView('login')}
            />
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex-grow flex flex-col h-full max-h-full overflow-hidden transition-colors duration-200 ${
              theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            {/* Header fixed at top (60px) */}
            <header className="h-[60px] bg-[#0f172a] shadow-lg flex items-center justify-between px-6 z-30 flex-shrink-0 text-white select-none">
              
              {/* Brand Logo & title */}
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-extrabold text-[17px] tracking-tight text-white">DataChat <span className="text-blue-400">AI</span></span>
              </div>

              {/* Center User Notice (Responsive truncation) */}
              <div className="text-[12px] sm:text-[14px] font-medium text-slate-300 truncate max-w-[110px] sm:max-w-none">
                Welcome, <span className="font-bold text-white">{customerName ? (customerName.charAt(0).toUpperCase() + customerName.slice(1)) : ''}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Light/Dark mode toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-755 hover:border-slate-600 active:scale-95 text-slate-300 hover:text-white transition-all focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer shadow-inner pr-3 pl-3"
                  title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={15} className="text-amber-400 animate-pulse" />
                      <span className="text-[12px] font-bold tracking-tight text-slate-300 hidden sm:inline">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon size={15} className="text-indigo-300" />
                      <span className="text-[12px] font-bold tracking-tight text-slate-300 hidden sm:inline">Dark</span>
                    </>
                  )}
                </button>

                {/* Profile Avatar Options dropdown menu */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    className="flex items-center gap-2 group p-1 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white font-black text-[14px] uppercase select-none">
                      {customerName ? customerName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 group-hover:text-white transition-transform ${avatarMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown contents */}
                  {avatarMenuOpen && (
                    <div className={`absolute right-0 mt-2.5 w-[210px] rounded-xl shadow-2xl border py-2.5 text-[14px] focus:outline-none z-50 animate-[translate-y-[-4px]_0.15s] select-none ${
                      theme === 'dark' 
                        ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-slate-950' 
                        : 'bg-white border-slate-100 text-slate-800'
                    }`}>
                      
                      {/* User profile identifier block */}
                      <div className="px-4 py-2 flex flex-col gap-0.5">
                        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Current Account</span>
                        <span className={`font-bold truncate max-w-full text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{customerName ? (customerName.charAt(0).toUpperCase() + customerName.slice(1)) : ''}</span>
                        <span className="text-xs font-semibold text-slate-400 truncate max-w-full block">{customerEmail}</span>
                      </div>

                      <div className={`h-px my-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                      {/* Import History handler */}
                      <button 
                        onClick={() => {
                          setAvatarMenuOpen(false);
                          setIsHistoryModalOpen(true);
                        }}
                        className={`w-full text-left px-4 py-2 font-bold flex items-center gap-2.5 transition-colors focus:outline-none ${
                          theme === 'dark' ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <History size={16} className="text-slate-400" />
                        Import History
                      </button>

                      <div className={`h-px my-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                      {/* Sign out */}
                      <button 
                        onClick={() => {
                          setAvatarMenuOpen(false);
                          handleLogout();
                        }}
                        className={`w-full text-left px-4 py-2 font-bold flex items-center gap-2.5 transition-colors focus:outline-none ${
                          theme === 'dark' ? 'hover:bg-red-955/20 text-red-400 font-bold' : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <LogOut size={16} className="text-red-500" />
                        Sign Out
                      </button>

                    </div>
                  )}
                </div>
              </div>

            </header>

            {/* Chat Messages scroll area */}
            <div className={`flex-grow flex-1 overflow-y-auto px-4 md:px-8 py-6 select-text overflow-x-hidden relative transition-colors duration-200 ${
                 theme === 'dark' ? 'bg-[#0b101d]' : 'bg-white'
               }`}
                 style={{ 
                   backgroundImage: theme === 'dark' 
                     ? 'radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)' 
                     : 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', 
                   backgroundSize: '24px 24px' 
                 }}>
              
              <div className="max-w-[780px] mx-auto w-full">
                
                {/* Loop messages logs */}
                {messages.map((message, index) => (
                  <MessageBubble 
                    key={index}
                    message={message}
                    customerName={customerName}
                    theme={theme}
                  />
                ))}

                {/* Loading indicator */}
                {isLoading && <TypingIndicator theme={theme} />}

                <div ref={messagesEndRef} className="h-10" />
              </div>

            </div>

            {/* Input Fixed dock area */}
            <div className={`border-t p-4 flex flex-col justify-end items-center relative z-20 flex-shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] selection:bg-blue-500/20 transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-[#0f172a] border-slate-805/80 shadow-[0_-2px_12px_rgba(0,0,0,0.2)]' 
                : 'bg-white border-[#e2e8f0]'
            }`}>
              
              <div className="w-full max-w-[780px] relative">
                
                {/* Textarea container row */}
                <form 
                  onSubmit={handleSendMessage}
                  className={`border rounded-[24px] p-2 flex items-center gap-2 transition-all focus-within:ring-4 focus-within:ring-blue-500/5 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800/80 focus-within:bg-slate-950 focus-within:border-blue-500'
                      : 'bg-slate-50 border-[#e2e8f0] hover:border-slate-300 focus-within:bg-white focus-within:border-blue-500'
                  }`}
                >
                  
                  {/* Paperclip options popup wrapper */}
                  <div className="relative" ref={paperclipRef}>
                    <button
                      type="button"
                      onClick={() => setPaperclipOpen(!paperclipOpen)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50/20 transition-colors focus:outline-none flex-shrink-0 select-none"
                    >
                      <Paperclip size={18} />
                    </button>

                    {/* Paperclip attachments options */}
                    {paperclipOpen && (
                      <div className={`absolute bottom-12 left-0 w-[230px] rounded-xl shadow-2xl border py-2 text-xs font-bold z-50 animate-[translate-y-[4px]_0.15s] select-none uppercase tracking-wider ${
                        theme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950'
                          : 'bg-white border-slate-100 text-slate-800 shadow-slate-200'
                      }`}>
                        
                        {/* Option A: Temporary analysis */}
                        <button
                          type="button"
                          onClick={() => handleFileActionPick('analyse')}
                          className={`w-full text-left px-4.5 py-2.5 transition-colors flex items-center gap-2.5 focus:outline-none ${
                            theme === 'dark' 
                              ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                              : 'hover:bg-slate-50 text-slate-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="text-base leading-none">📊</span>
                          Analyse Excel file
                        </button>

                        <div className={`h-px my-1.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>

                        {/* Option B: Permanent Db insertion */}
                        <button
                          type="button"
                          onClick={() => handleFileActionPick('import')}
                          className={`w-full text-left px-4.5 py-2.5 transition-colors flex items-center gap-2.5 focus:outline-none ${
                            theme === 'dark' 
                              ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                              : 'hover:bg-slate-50 text-slate-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="text-base leading-none">💾</span>
                          Import layout to DB
                        </button>

                      </div>
                    )}
                  </div>

                  {/* Textarea grows automatically up to 5 lines */}
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      if (e.target.value.length <= CHAR_LIMIT) {
                        setInput(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Enter key submits message, Shift+Enter inputs breaking space
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder={isLoading ? "Please wait for DataChat response..." : "Ask about patients, diagnoses, prescriptions..."}
                    disabled={isLoading}
                    className={`flex-grow scrollbar-none bg-transparent border-none py-2 px-3 focus:outline-none text-[15px] font-medium focus:ring-0 whitespace-pre-wrap max-h-[120px] overflow-y-auto resize-none ${
                      theme === 'dark'
                        ? 'text-slate-100 placeholder-slate-500'
                        : 'text-slate-800 placeholder-slate-400'
                    }`}
                    style={{ minHeight: '38px' }}
                  />

                  {/* Send Action Trigger */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 select-none ${
                      !input.trim() || isLoading 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md'
                    }`}
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>

                </form>

                {/* Character Counter status under 200 */}
                {charsRemaining <= 200 && (
                  <div className={`absolute bottom-[-22px] right-2 text-[10px] font-bold tracking-wider ${
                    charsRemaining <= 100 ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {charsRemaining} characters left
                  </div>
                )}

              </div>

            </div>

            {/* Hidden spreadsheet upload targets */}
            <input 
              type="file"
              ref={analyseInputRef}
              onChange={handleAnalyseFileChange}
              accept=".xlsx, .xls"
              className="hidden"
            />
            <input 
              type="file"
              ref={importInputRef}
              onChange={handleImportFileChange}
              accept=".xlsx, .xls"
              className="hidden"
            />

            {/* Modals injection wrappers */}
            {isAnalyseModalOpen && selectedFile && (
              <AnalyseModal 
                file={selectedFile}
                onCancel={() => {
                  setIsAnalyseModalOpen(false);
                  setSelectedFile(null);
                }}
                onSubmitAnalysis={handleAnalyseSubmit}
              />
            )}

            {isImportModalOpen && selectedFile && (
              <ImportModal 
                file={selectedFile}
                sessionId={sessionId}
                onCancel={() => {
                  setIsImportModalOpen(false);
                  setSelectedFile(null);
                }}
                onImportSuccess={handleImportSuccess}
              />
            )}

            {isHistoryModalOpen && (
              <HistoryModal 
                history={importHistory}
                onClose={() => setIsHistoryModalOpen(false)}
              />
            )}

          </motion.div>
        )}

      </AnimatePresence>
      
    </div>
  );
}
