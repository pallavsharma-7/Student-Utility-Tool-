'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { SchedulerForm } from '../../components/scheduler/SchedulerForm';
import { ScheduleTimeline } from '../../components/scheduler/ScheduleTimeline';
import { ScheduleSummary } from '../../components/scheduler/ScheduleSummary';
import { useApp } from '../providers';
import { DailySchedule } from '../../lib/db';
import { minutesToHoursLabel } from '../../lib/schedulerAlgorithm';

export default function SchedulerPage() {
  const { setActiveView, todaySchedule, schedules, subjects, saveSchedule, addTask } = useApp();
  const [draftSchedule, setDraftSchedule] = useState<DailySchedule | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setActiveView('scheduler');
  }, [setActiveView]);

  useEffect(() => {
    if (todaySchedule && !draftSchedule) {
      const scheduleWithBlocks = todaySchedule.blocks.length > 0 ? todaySchedule : null;
      setDraftSchedule(scheduleWithBlocks);
    }
  }, [todaySchedule, draftSchedule]);

  const handleSave = async () => {
    if (!draftSchedule) return;
    await saveSchedule(draftSchedule);
    setMessage('Schedule saved and will persist after refresh.');
  };

  const handleConvertToTasks = async () => {
    if (!draftSchedule) return;
    const today = new Date().toISOString().split('T')[0];
    for (const subject of draftSchedule.subjects) {
      const matchedSubject = subjects.find(item => item.name.toLowerCase() === subject.name.toLowerCase());
      const sessionCount = Math.max(1, Math.ceil(subject.allocated_minutes / 120));
      for (let index = 1; index <= sessionCount; index++) {
        const title = `${subject.name} Session ${index}`;
        const notes = `Generated from ${draftSchedule.title}. Total allocation: ${minutesToHoursLabel(subject.allocated_minutes)}.`;
        await addTask(title, matchedSubject?.id || null, subject.is_weak ? 'high' : 'medium', notes, today);
      }
    }
    setMessage('Schedule converted into Task Manager tasks.');
  };

  const loadSchedule = (schedule: DailySchedule) => {
    setDraftSchedule(schedule);
    setMessage(`Loaded ${schedule.title}.`);
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#121212]">Smart Daily Scheduler</h3>
            <p className="text-xs text-[#8A8A86] font-semibold uppercase tracking-wider mt-0.5">
              Weighted subject allocation with human-friendly breaks
            </p>
          </div>
          {schedules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {schedules.slice(0, 3).map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => loadSchedule(schedule)}
                  className="bg-white border border-[#EBE6DD] hover:bg-[#F5F0E6] text-[#1E1E1E] px-3 py-2 rounded-xl text-[10px] font-extrabold transition"
                >
                  {schedule.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {message && (
          <div className="bg-[#FDF7E2] border border-[#F5C518]/30 rounded-2xl px-4 py-3 text-xs font-bold text-[#121212]">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-6">
            <SchedulerForm
              currentSchedule={draftSchedule}
              onGenerate={(schedule) => {
                setDraftSchedule(schedule);
                setMessage('Generated a new optimized schedule.');
              }}
            />
            <ScheduleSummary
              schedule={draftSchedule}
              isSaved={Boolean(draftSchedule && schedules.some(schedule => schedule.id === draftSchedule.id))}
              onSave={handleSave}
              onConvertToTasks={handleConvertToTasks}
            />
          </div>
          <ScheduleTimeline blocks={draftSchedule?.blocks || []} />
        </div>
      </div>
    </AppShell>
  );
}
