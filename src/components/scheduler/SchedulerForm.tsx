'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Wand2 } from 'lucide-react';
import { DailySchedule } from '../../lib/db';
import { generateSchedule } from '../../lib/schedulerAlgorithm';
import { EditableSchedulerSubject, SubjectInputCard } from './SubjectInputCard';

interface SchedulerFormProps {
  currentSchedule: DailySchedule | null;
  onGenerate: (schedule: DailySchedule) => void;
}

const blankSubject = (name = ''): EditableSchedulerSubject => ({
  id: `form-sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name,
  difficulty: 5,
  isWeak: false
});

const presets = {
  JEE: [
    { name: 'Maths', difficulty: 9, isWeak: true },
    { name: 'Physics', difficulty: 6, isWeak: false },
    { name: 'Chemistry', difficulty: 3, isWeak: false }
  ],
  NEET: [
    { name: 'Biology', difficulty: 8, isWeak: false },
    { name: 'Physics', difficulty: 9, isWeak: true },
    { name: 'Chemistry', difficulty: 5, isWeak: false }
  ],
  GATE: [
    { name: 'Operating Systems', difficulty: 9, isWeak: true },
    { name: 'DSA', difficulty: 8, isWeak: false },
    { name: 'DBMS', difficulty: 6, isWeak: false }
  ]
};

export const SchedulerForm: React.FC<SchedulerFormProps> = ({ currentSchedule, onGenerate }) => {
  const [title, setTitle] = useState('Smart Daily Schedule');
  const [availableHours, setAvailableHours] = useState('8');
  const [startTime, setStartTime] = useState('08:00');
  const [subjects, setSubjects] = useState<EditableSchedulerSubject[]>([
    { ...blankSubject('Maths'), difficulty: 9, isWeak: true },
    { ...blankSubject('Physics'), difficulty: 6 },
    { ...blankSubject('Chemistry'), difficulty: 3 }
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentSchedule) return;
    setTitle(currentSchedule.title);
    setAvailableHours((currentSchedule.available_minutes / 60).toString());
    setStartTime(currentSchedule.start_time);
    setSubjects(currentSchedule.subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      difficulty: subject.difficulty,
      isWeak: subject.is_weak
    })));
  }, [currentSchedule]);

  const updateSubject = (nextSubject: EditableSchedulerSubject) => {
    setSubjects(current => current.map(subject => subject.id === nextSubject.id ? nextSubject : subject));
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    setTitle(`${presetName} Daily Plan`);
    setSubjects(presets[presetName].map(subject => ({
      ...blankSubject(subject.name),
      difficulty: subject.difficulty,
      isWeak: subject.isWeak
    })));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      const schedule = generateSchedule({
        title,
        availableHours: Number(availableHours),
        startTime,
        subjects: subjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          difficulty: subject.difficulty,
          isWeak: subject.isWeak
        }))
      });
      if (currentSchedule) {
        schedule.id = currentSchedule.id;
        schedule.created_at = currentSchedule.created_at;
      }
      onGenerate(schedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate schedule.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-[#EBE6DD] pb-4">
        <div>
          <h3 className="text-base font-extrabold text-[#121212]">Plan Inputs</h3>
          <p className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider mt-1">
            Difficulty weighted daily scheduler
          </p>
        </div>
        <div className="flex gap-2">
          {(Object.keys(presets) as Array<keyof typeof presets>).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyPreset(preset)}
              className="bg-[#FAF8F5] border border-[#EBE6DD] hover:bg-[#F5F0E6] px-3 py-2 rounded-xl text-[10px] font-extrabold text-[#1E1E1E]"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Schedule Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Available Hours</label>
          <input
            type="number"
            min="1"
            max="16"
            step="0.5"
            value={availableHours}
            onChange={(event) => setAvailableHours(event.target.value)}
            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
          />
        </div>
        <div>
          <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setSubjects(current => [...current, blankSubject()])}
            className="w-full bg-[#FAF8F5] border border-[#EBE6DD] hover:bg-[#F5F0E6] rounded-xl py-2.5 text-xs font-bold text-[#1E1E1E] flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <SubjectInputCard
            key={subject.id}
            subject={subject}
            canRemove={subjects.length > 1}
            onChange={updateSubject}
            onRemove={() => setSubjects(current => current.filter(item => item.id !== subject.id))}
          />
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl px-3 py-2 text-xs font-bold">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/95 text-white rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition"
      >
        <Wand2 className="w-4 h-4 text-[#F5C518]" /> Generate Smart Schedule
      </button>
    </form>
  );
};
