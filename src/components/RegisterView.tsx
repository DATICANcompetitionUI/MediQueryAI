import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, User, Tag, Server, Hash, Database, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import aiBotLoginBg from '../assets/images/hospital_intelligence_bg_1781850292308.jpg';

interface RegisterViewProps {
  onRegisterSuccess: (sessionId: string, customerName: string, email: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterView({ onRegisterSuccess, onSwitchToLogin }: RegisterViewProps) {
  // Section 1 State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Section 2 State
  const [dbType, setDbType] = useState<"mysql" | "postgres" | "mssql">("mysql");
  const [dbHost, setDbHost] = useState("");
  const [dbPort, setDbPort] = useState("3306");
  const [dbName, setDbName] = useState("");
  const [dbUser, setDbUser] = useState("");
  const [dbPassword, setDbPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDbPassword, setShowDbPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailConflict, setIsEmailConflict] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);



  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailConflict(false);
    setError(null);

    // Initial validations
    if (!fullName.trim()) {
      setError("Full name is required.");
      triggerShake();
      return;
    }
    if (!email.trim() || !password || !confirmPassword || !inviteCode.trim()) {
      setError("Please fill in all account details.");
      triggerShake();
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      triggerShake();
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      triggerShake();
      return;
    }
    if (!dbHost.trim() || !dbPort.trim() || !dbName.trim() || !dbUser.trim() || !dbPassword.trim()) {
      setError("Please fill in all database credentials.");
      triggerShake();
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        inviteCode: inviteCode.trim().toUpperCase(),
        dbHost: dbHost.trim(),
        dbPort: dbPort.trim(),
        dbName: dbName.trim(),
        dbUser: dbUser.trim(),
        dbPassword: dbPassword,
        dbType
      };

      const response = await fetch("https://n8n-production-b41a.up.railway.app/webhook/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 403) {
          setError("Invalid or already used invite code. Please contact your administrator.");
        } else if (response.status === 409) {
          setError("This email address is already registered.");
          setIsEmailConflict(true);
        } else if (response.status === 400) {
          setError(data.error || "Full name is required.");
        } else if (response.status === 429) {
          setError("Too many registration attempts. Please wait a minute.");
        } else {
          setError(data.error || "failed register connection error");
        }
        triggerShake();
        setIsLoading(false);
        return;
      }

      // Success register
      onRegisterSuccess(data.session_id, data.customer_name, email.trim());
    } catch (err) {
      setError("Connection failed. Check your internet connection.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-h-full bg-slate-950 font-sans text-slate-900 selection:bg-blue-500/20 overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-6 bg-[#0f172a] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
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
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 border border-blue-400/20 border-blue-500/20">
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
            Connect your MySQL, PostgreSQL, or MSSQL (SQL Server) medical databases safely. Begin querying demographics, clinical trials, diagnoses, and lab results in plain English.
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

      {/* RIGHT Form Panel: Scrollable since content is tall */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar flex items-start justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-[500px] flex flex-col py-4">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 mb-1">Create your clinical account</h1>
            <p className="text-slate-500 font-medium text-[15px]">Enter your invite code and hospital database details below</p>
          </div>

          {/* Error Banner with shaking animation */}
          {error && (
            <div className={`p-4 mb-6 rounded-xl bg-red-50 border border-red-100 text-red-600 flex flex-col gap-2 text-sm font-medium ${shouldShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
                <div className="flex-1">{error}</div>
              </div>
              {isEmailConflict && (
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-700 font-bold underline pl-8 text-left uppercase text-xs tracking-wider"
                >
                  Sign in instead →
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1 - Account Details */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Account Details</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    minLength={6}
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Invite Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invite Code</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. INV-2026-CLIENT01"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 tracking-wider transition-all focus:outline-none"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5">Get this from your system administrator.</span>
              </div>
            </div>

            {/* SECTION 2 - Database Connection */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Database Connection</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              {/* Secure Credentials Note */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-[13px] font-medium text-blue-700 leading-relaxed">
                🔒 Your database credentials are encrypted with AES-256 before being stored. We never store plain text passwords.
              </div>

              {/* Database Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Type</label>
                <div className="relative">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value as "mysql" | "postgres" | "mssql")}
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-12 pr-10 text-[15px] font-medium text-slate-900 transition-all focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="mysql">MySQL Server</option>
                    <option value="postgres">PostgreSQL Server</option>
                    <option value="mssql">Microsoft SQL Server (MSSQL)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Database Host */}
                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Host Server</label>
                  <div className="relative">
                    <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={dbHost}
                      onChange={(e) => setDbHost(e.target.value)}
                      placeholder="mysql-abc.aivencloud.com"
                      disabled={isLoading}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Database Port */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Port</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={dbPort}
                      onChange={(e) => setDbPort(e.target.value.replace(/\D/g, ''))}
                      placeholder={dbType === "mysql" ? "3306" : dbType === "postgres" ? "5432" : "1433"}
                      disabled={isLoading}
                      className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-9 pr-3 text-[15px] font-medium text-slate-900 transition-all focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Database Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Name</label>
                <div className="relative">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    placeholder="e.g. defaultdb"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={dbUser}
                    onChange={(e) => setDbUser(e.target.value)}
                    placeholder="avnadmin"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 px-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showDbPassword ? "text" : "password"}
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                    placeholder="Your database password"
                    disabled={isLoading}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3 pl-12 pr-12 text-[15px] font-medium text-slate-900 transition-all focus:outline-none"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowDbPassword(!showDbPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showDbPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-[15px] rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 select-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className="text-center font-semibold text-[15px] mt-8 flex-shrink-0">
            <span className="text-slate-500">Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-bold focus:outline-none"
            >
              Sign in here →
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
