'use client';

import React from 'react';
import { useApp } from '../app/providers';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarRange, 
  Map, 
  MessageSquareCode, 
  PlaySquare, 
  LineChart, 
  History,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, logout, user } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare, href: '/tasks' },
    { id: 'scheduler', label: 'Daily Scheduler', icon: CalendarRange, href: '/scheduler' },
    { id: 'roadmap', label: 'Roadmap Builder', icon: Map, href: '/roadmap' },
    { id: 'mentor', label: 'Mentor Chat', icon: MessageSquareCode },
    { id: 'lectures', label: 'Lecture Tracker', icon: PlaySquare },
    { id: 'revisions', label: 'Revision Manager', icon: History },
    { id: 'analytics', label: 'Analytics Panel', icon: LineChart },
  ];

  return (
    <aside className="w-64 bg-[#FAF8F4] border-r border-[#EBE6DD] flex flex-col h-screen fixed left-0 top-0 select-none z-30">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#EBE6DD] gap-3 bg-white">
        <div className="w-9 h-9 rounded-xl bg-[#1E1E1E] flex items-center justify-center shadow-md">
          <span className="text-[#F5C518] font-extrabold text-xl">P</span>
        </div>
        <div>
          <h1 className="font-bold text-[#121212] text-base tracking-wide flex items-center gap-1">
            PrepFlow
            <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
          </h1>
          <span className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-widest leading-none">OS for Students</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href 
            ? pathname === item.href 
            : (pathname === '/' && activeView === item.id);

          const handleClick = () => {
            setActiveView(item.id);
            if (!item.href && pathname !== '/') {
              router.push('/');
            }
          };

          const buttonClass = `w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold gap-3 ${
            isActive 
              ? 'bg-[#1E1E1E] text-white shadow-md scale-[1.01]' 
              : 'text-[#1E1E1E]/80 hover:bg-[#F5F0E6] hover:text-[#121212]'
          }`;

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveView(item.id)}
                className={buttonClass}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5C518]' : 'text-[#1E1E1E]/50'}`} />
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={buttonClass}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5C518]' : 'text-[#1E1E1E]/50'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout Action */}
      <div className="p-4 border-t border-[#EBE6DD] bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E1E1E] text-[#F5C518] font-bold text-sm flex items-center justify-center">
              {user?.name?.charAt(0) || 'K'}
            </div>
            <div className="truncate max-w-[120px]">
              <p className="text-xs font-bold text-[#121212] truncate">{user?.name || 'Kasven'}</p>
              <p className="text-[10px] text-[#8A8A86] truncate">{user?.email || 'kasven@prepflow.io'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-[#8A8A86] hover:text-rose-600 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
