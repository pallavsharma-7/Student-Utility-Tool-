'use client';

import React from 'react';
import { CheckCircle2, ListPlus, Save, Clock3 } from 'lucide-react';
import { DailySchedule } from '../../lib/db';
import { minutesToHoursLabel } from '../../lib/schedulerAlgorithm';

interface ScheduleSummaryProps {
  schedule: DailySchedule | null;
  isSaved: boolean;
  onSave: () => void;
  onConvertToTasks: () => void;
}

export const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({ schedule, isSaved, onSave, onConvertToTasks }) => {
  if (!schedule) {
    return (
      <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#121212]">Schedule Summary</h3>
        <p className="text-xs text-[#8A8A86] font-semibold mt-2">Generate a plan to see workload distribution.</p>
      </div>
    );
  }

  const studyMinutes = schedule.subjects.reduce((sum, subject) => sum + subject.allocated_minutes, 0);
  const breakMinutes = schedule.blocks
    .filter(block => block.type !== 'study')
    .reduce((sum, block) => sum + block.duration_minutes, 0);

  return (
    <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3">
        <h3 className="text-sm font-extrabold text-[#121212]">Schedule Summary</h3>
        {isSaved && (
          <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#1E1E1E] text-white p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A86]">Study Time</p>
          <p className="text-xl font-extrabold mt-1">{minutesToHoursLabel(studyMinutes)}</p>
        </div>
        <div className="rounded-2xl bg-[#FDF7E2] border border-[#F5C518]/30 p-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A86]">Break Time</p>
          <p className="text-xl font-extrabold mt-1 text-[#121212]">{minutesToHoursLabel(breakMinutes)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {schedule.subjects.map((subject) => (
          <div key={subject.id}>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-[#121212] truncate">{subject.name}</span>
              <span className="text-[#8A8A86]">{minutesToHoursLabel(subject.allocated_minutes)}</span>
            </div>
            <div className="h-2 bg-[#FAF8F5] border border-[#EBE6DD]/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5C518] rounded-full"
                style={{ width: `${(subject.allocated_minutes / studyMinutes) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onSave}
          className="flex-1 bg-[#1E1E1E] hover:bg-[#1E1E1E]/95 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <Save className="w-4 h-4 text-[#F5C518]" /> Save Schedule
        </button>
        <button
          onClick={onConvertToTasks}
          className="flex-1 bg-[#FAF8F5] border border-[#EBE6DD] hover:bg-[#F5F0E6] text-[#1E1E1E] rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <ListPlus className="w-4 h-4" /> Convert To Tasks
        </button>
      </div>

      <div className="text-[10px] font-bold text-[#8A8A86] flex items-center gap-1.5">
        <Clock3 className="w-3.5 h-3.5" />
        Starts at {schedule.blocks[0]?.start_time || schedule.start_time}
      </div>
    </div>
  );
};
