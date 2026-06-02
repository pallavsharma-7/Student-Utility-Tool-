'use client';

import React from 'react';
import { useApp } from '../app/providers';
import { Calendar, Database, ShieldCheck, HelpCircle } from 'lucide-react';

import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, activeView } = useApp();
  const pathname = usePathname();

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPageTitle = () => {
    if (pathname === '/tasks') return 'Task Manager';
    if (pathname === '/scheduler') return 'Smart Daily Scheduler';
    if (pathname === '/roadmap') return 'Roadmap Generator';
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Task Manager';
      case 'scheduler': return 'Smart Daily Scheduler';
      case 'roadmap': return 'Roadmap Generator';
      case 'mentor': return 'Mentor Guide';
      case 'lectures': return 'Lecture Tracker';
      case 'revisions': return 'Revision Manager';
      case 'analytics': return 'Performance Analytics';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-20 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#EBE6DD] px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-white border border-[#EBE6DD] hover:bg-[#F5F0E6] transition"
          >
            <span className="sr-only">Open menu</span>
            <svg className="w-5 h-5 text-[#1E1E1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-[#121212] tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h2>
          <p className="text-[11px] text-[#8A8A86] font-bold uppercase tracking-wider mt-0.5">
            {getGreeting()}, {user?.name || 'Kasven'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Countdown Banner */}
        <div className="hidden lg:flex bg-white border border-[#EBE6DD] rounded-xl px-4 py-2 items-center gap-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
          <div className="p-1.5 rounded-lg bg-[#FDF7E2]">
            <Calendar className="w-4 h-4 text-[#F5C518]" />
          </div>
          <div>
            <p className="text-[9px] text-[#8A8A86] font-bold uppercase leading-none">GATE 2027</p>
            <p className="text-xs font-extrabold text-[#121212] mt-0.5">217 Days Left</p>
          </div>
        </div>

        {/* Database Status Sync Badge */}
        <div className="bg-white border border-[#EBE6DD] rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse" />
          <div className="text-[10px]">
            <p className="font-bold text-[#121212] leading-none">Sandbox Mode</p>
            <p className="text-[#8A8A86] text-[8px] mt-0.5 font-semibold">Local Storage</p>
          </div>
        </div>
      </div>
    </header>
  );
};
