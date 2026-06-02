'use client';

import React from 'react';
import { useApp } from './providers';
import { AppShell } from '../components/layout/AppShell';
import { DashboardView } from '../components/DashboardView';
import { Sparkles, Compass } from 'lucide-react';

export default function HomePage() {
  const { activeView } = useApp();

  // Render dynamic view placeholder based on active navigation screen
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      default:
        return (
          <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-8 shadow-sm flex flex-col items-center justify-center text-center h-[500px] page-transition">
            <div className="w-16 h-16 rounded-2xl bg-[#FDF7E2] border border-[#F5C518]/30 flex items-center justify-center mb-4 text-[#F5C518]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-[#121212]">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Module
            </h3>
            <p className="text-xs text-[#8A8A86] mt-2 font-semibold max-w-sm uppercase tracking-wider">
              Stage 1 Placeholder Active
            </p>
            <div className="mt-6 p-4 bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl max-w-md text-left text-xs font-semibold text-[#1E1E1E]">
              <p className="font-bold flex items-center gap-1.5 text-[#121212]">
                <Compass className="w-4 h-4 text-[#F5C518]" /> Next Steps in Stage 2 - 9:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-[#8A8A86]">
                <li>Database tables population via active Supabase Sync.</li>
                <li>Algorithm execution (smart time distribution logic).</li>
                <li>Phased study-roadmaps dynamic generation.</li>
                <li>Active task status columns dragging and dropping!</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <AppShell>
      {renderActiveView()}
    </AppShell>
  );
}
