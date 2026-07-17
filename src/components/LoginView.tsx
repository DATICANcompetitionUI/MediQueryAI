import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import aiBotLoginBg from '../assets/images/hospital_intelligence_bg_1781850292308.jpg';

interface LoginViewProps {
  onLoginSuccess: (sessionId: string, customerName: string, email: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginView({ onLoginSuccess, onSwitchToRegister }: LoginViewProps) {
  const [email, setEmail] = useState(() => localStorage.getItem("chatbot_email") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in all details.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://n8n-production-b41a.up.railway.app/webhook/auth-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          setError("Invalid email or password.");
        } else if (response.status === 429) {
          setError("Too many attempts. Please wait a minute and try again.");
        } else {
          setError(data.error || "Login failed. Please verify your credentials.");
        }
        triggerShake();
        setIsLoading(false);
        return;
      }

      // Success
      if (rememberMe) {
        localStorage.setItem("chatbot_email", email.trim());
      } else {
        localStorage.removeItem("chatbot_email");
      }
      onLoginSuccess(data.session_id, data.customer_name, email.trim());
    } catch (err) {
      setError("Connection failed. Check your internet connection.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-h-full bg-slate-950 font-sans text-slate-900 selection:bg-blue-500/20 overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-6 bg-[#0f172a] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Hexagon Logo Icon */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight text-lg">DataChat <span className="text-blue-500">AI</span></span>
        </div>
      </div>

      {/* LEFT Branding Panel: 45% on desktop */}
      <div className="hidden lg:flex w-[45%] bg-[#080d19] text-white flex-col justify-between p-12 relative overflow-hidden flex-shrink-0 border-r border-slate-900">
        
        {/* Background Image with Dark/Glow Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={aiBotLoginBg} 
            alt="AI bot illustrating assistance chatting with databases" 
            className="w-full h-full object-cover object-center scale-105 select-none" 
            referrerPolicy="no-referrer"
          />
          {/* Dark overlay with blue glowing tone to make text extremely legible */}
          <div className="absolute inset-0 bg-[#0f172a]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-[#0f172a]/50 to-[#0b101d]/85"></div>
        </div>

        {/* Brand Header */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 border border-blue-400/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight">DataChat <span className="text-blue-400">AI</span></span>
            <span className="text-[10px] text-blue-500/80 uppercase tracking-[0.2em] font-black mt-0.5 block">Hospital Intelligence Platform</span>
          </div>
        </div>

        {/* Center Intro */}
        <div className="z-10 my-auto py-12">
          <h2 className="text-4xl font-black leading-tight tracking-tight mb-4">
            Ask about patient data.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Get clinical insights today.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-md mb-8">
            The premium medical intelligence platform that allows clinicians, researchers, and hospital staffs to query patient demographics, lab diagnoses, and prescriptions using plain natural language.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 font-bold text-lg mt-0.5">✦</span>
              <p className="text-slate-300 font-medium">Natural language diagnosis & prescription queries</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 font-bold text-lg mt-0.5">✦</span>
              <p className="text-slate-300 font-medium">HIPAA-compliant, secure AES-256 encrypted connections</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 font-bold text-lg mt-0.5">✦</span>
              <p className="text-slate-300 font-medium">Real-time AI-powered patient reports</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 border-t border-white/5 pt-6 text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Trusted by leading healthcare centers & hospitals
        </div>
      </div>

      {/* RIGHT Form Panel: 55% on desktop */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-[440px] flex flex-col">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 mb-1">Welcome back</h1>
            <p className="text-slate-500 font-medium text-[15px]">Sign in to your hospital clinical account</p>
          </div>

          {/* Error Banner with shaking animation */}
          {error && (
            <div className={`p-4 mb-6 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-start gap-3 text-sm font-medium ${shouldShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={isLoading}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-12 pr-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-blue-600 focus:ring-blue-500/30 border-slate-300"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <span className="text-slate-400 font-semibold cursor-default">Forgot password? Contact admin</span>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-[15px] rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 select-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider with or */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center font-medium text-[15px]">
            <span className="text-slate-500">Don't have an account? </span>
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 group transition-colors focus:outline-none"
            >
              Register with invite code 
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
