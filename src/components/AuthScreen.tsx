'use client';

import React, { useState } from 'react';
import { useApp } from '../app/providers';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Mock Login details validation for Stage 1 sandbox
    setTimeout(() => {
      if (mode === 'signup') {
        if (!name || !email || !password) {
          setErrorMsg('Please fill in all fields.');
          setLoading(false);
          return;
        }
        signup(name, email);
      } else {
        if (!email || !password) {
          setErrorMsg('Please enter email and password.');
          setLoading(false);
          return;
        }
        login(email, 'Kasven');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background soft glow rings inspired by Talex Dashboard */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FDF7E2]/60 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#EBE6DD]/50 blur-[140px]" />

      <div className="w-full max-w-md bg-white border border-[#EBE6DD] rounded-[28px] p-8 shadow-md relative z-10 hover:shadow-lg transition duration-300">
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#1E1E1E] flex items-center justify-center mb-3 shadow-md">
            <span className="text-[#F5C518] font-extrabold text-2xl">P</span>
          </div>
          <h2 className="text-2xl font-bold text-[#121212] tracking-tight flex items-center gap-1.5">
            PrepFlow
            <Sparkles className="w-5 h-5 text-[#F5C518]" />
          </h2>
          <p className="text-xs text-[#8A8A86] mt-1 text-center font-bold uppercase tracking-wider max-w-[280px]">
            Exam Preparation OS
          </p>
        </div>

        {/* Database sandbox announcement widget */}
        <div className="mb-6 bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl p-3 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <div className="text-[11px] leading-tight">
            <p className="font-extrabold text-[#121212]">Stage 1 Sandbox Active</p>
            <p className="text-[#8A8A86] mt-0.5 font-medium">Session logs and metadata will persist in your browser local storage.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#EBE6DD] mb-6 text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg transition ${
              mode === 'login' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-[#8A8A86] hover:text-[#121212]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg transition ${
              mode === 'signup' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-[#8A8A86] hover:text-[#121212]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A86]">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Kasven"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EBE6DD] bg-[#FAF8F5] focus:border-[#1E1E1E] focus:bg-white text-sm outline-none transition font-semibold text-[#121212]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A86]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EBE6DD] bg-[#FAF8F5] focus:border-[#1E1E1E] focus:bg-white text-sm outline-none transition font-semibold text-[#121212]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A86]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EBE6DD] bg-[#FAF8F5] focus:border-[#1E1E1E] focus:bg-white text-sm outline-none transition font-semibold text-[#121212]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition duration-200 shadow-sm disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4 text-[#F5C518]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
