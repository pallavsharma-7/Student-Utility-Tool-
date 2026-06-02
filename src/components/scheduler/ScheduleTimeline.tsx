'use client';

import React from 'react';
import { Coffee, Utensils, BookOpen } from 'lucide-react';
import { ScheduleBlock } from '../../lib/db';

interface ScheduleTimelineProps {
  blocks: ScheduleBlock[];
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ blocks }) => {
  if (blocks.length === 0) {
    return (
      <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-8 shadow-sm text-center">
        <p className="text-sm font-extrabold text-[#121212]">No schedule generated yet</p>
        <p className="text-xs text-[#8A8A86] font-semibold mt-1">Add subjects and generate a daily plan.</p>
      </div>
    );
  }

  const iconForType = (type: ScheduleBlock['type']) => {
    if (type === 'lunch') return <Utensils className="w-4 h-4" />;
    if (type === 'break') return <Coffee className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
        <h3 className="text-sm font-extrabold text-[#121212]">Study Timeline</h3>
        <span className="text-[9px] bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] px-2 py-1 rounded-lg font-bold uppercase">
          {blocks.length} blocks
        </span>
      </div>

      <div className="space-y-3">
        {blocks.map((block) => {
          const isStudy = block.type === 'study';
          return (
            <div
              key={block.id}
              className={`grid grid-cols-[90px_1fr] gap-3 rounded-2xl border p-3 ${
                isStudy
                  ? 'bg-[#FAF8F5] border-[#EBE6DD]'
                  : 'bg-[#FDF7E2] border-[#F5C518]/30'
              }`}
            >
              <div className="text-[10px] font-extrabold text-[#8A8A86] leading-5">
                <p>{block.start_time}</p>
                <p>{block.end_time}</p>
              </div>
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isStudy ? 'bg-[#1E1E1E] text-[#F5C518]' : 'bg-white text-[#1E1E1E] border border-[#EBE6DD]'
                  }`}>
                    {iconForType(block.type)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#121212] truncate">{block.title}</p>
                    <p className="text-[10px] font-bold text-[#8A8A86] uppercase tracking-wider">
                      {block.duration_minutes} min
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline text-[9px] font-extrabold uppercase tracking-wider text-[#8A8A86]">
                  {block.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
