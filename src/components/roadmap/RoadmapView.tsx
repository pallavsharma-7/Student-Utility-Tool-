'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Flag, ListPlus, Map, Save, Sparkles, Wand2 } from 'lucide-react';
import { useApp } from '../../app/providers';
import { ExamRoadmap } from '../../lib/db';
import { generateRoadmap, getCurrentPhase } from '../../lib/roadmapGenerator';
import { generateSchedule } from '../../lib/schedulerAlgorithm';

const presets = {
  GATE: {
    examDate: '2027-02-15',
    hoursPerDay: 5,
    subjects: 'DSA\nOS\nDBMS\nCN',
    weakSubjects: 'OS\nCN'
  },
  NEET: {
    examDate: '2027-05-02',
    hoursPerDay: 6,
    subjects: 'Biology\nPhysics\nChemistry',
    weakSubjects: 'Physics'
  },
  JEE: {
    examDate: '2027-01-24',
    hoursPerDay: 6,
    subjects: 'Maths\nPhysics\nChemistry',
    weakSubjects: 'Maths'
  }
};

const splitLines = (value: string) => value.split('\n').map(item => item.trim()).filter(Boolean);

export const RoadmapView: React.FC = () => {
  const { roadmaps, currentRoadmap, subjects, saveRoadmap, addTask, saveSchedule } = useApp();
  const [examName, setExamName] = useState('GATE');
  const [examDate, setExamDate] = useState('2027-02-15');
  const [hoursPerDay, setHoursPerDay] = useState('5');
  const [subjectText, setSubjectText] = useState('DSA\nOS\nDBMS\nCN');
  const [weakSubjectText, setWeakSubjectText] = useState('OS\nCN');
  const [draftRoadmap, setDraftRoadmap] = useState<ExamRoadmap | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentRoadmap || draftRoadmap) return;
    const hydratedRoadmap = currentRoadmap.weekly_targets.length > 0
      ? currentRoadmap
      : generateRoadmap({
        examName: currentRoadmap.exam_name,
        examDate: currentRoadmap.exam_date,
        hoursPerDay: currentRoadmap.hours_per_day,
        subjects: currentRoadmap.subjects.map(subject => subject.name),
        weakSubjects: currentRoadmap.subjects.filter(subject => subject.is_weak).map(subject => subject.name)
      });
    hydratedRoadmap.id = currentRoadmap.id;
    hydratedRoadmap.created_at = currentRoadmap.created_at;
    setDraftRoadmap(hydratedRoadmap);
    setExamName(hydratedRoadmap.exam_name);
    setExamDate(hydratedRoadmap.exam_date);
    setHoursPerDay(hydratedRoadmap.hours_per_day.toString());
    setSubjectText(hydratedRoadmap.subjects.map(subject => subject.name).join('\n'));
    setWeakSubjectText(hydratedRoadmap.subjects.filter(subject => subject.is_weak).map(subject => subject.name).join('\n'));
  }, [currentRoadmap, draftRoadmap]);

  const activePhase = useMemo(() => getCurrentPhase(draftRoadmap), [draftRoadmap]);
  const nextWeek = draftRoadmap?.weekly_targets[0] || null;
  const nextDays = nextWeek?.daily_targets.slice(0, 7) || [];

  const applyPreset = (presetName: keyof typeof presets) => {
    const preset = presets[presetName];
    setExamName(presetName);
    setExamDate(preset.examDate);
    setHoursPerDay(preset.hoursPerDay.toString());
    setSubjectText(preset.subjects);
    setWeakSubjectText(preset.weakSubjects);
    setMessage(`${presetName} example loaded.`);
  };

  const handleGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      const roadmap = generateRoadmap({
        examName,
        examDate,
        hoursPerDay: Number(hoursPerDay),
        subjects: splitLines(subjectText),
        weakSubjects: splitLines(weakSubjectText)
      });
      if (draftRoadmap) {
        roadmap.id = draftRoadmap.id;
        roadmap.created_at = draftRoadmap.created_at;
      }
      setDraftRoadmap(roadmap);
      setMessage('Roadmap generated with weighted weekly and daily targets.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate roadmap.');
    }
  };

  const handleSave = async () => {
    if (!draftRoadmap) return;
    await saveRoadmap(draftRoadmap);
    setMessage('Roadmap saved and will persist after refresh.');
  };

  const handleConvertToTasks = async () => {
    if (!draftRoadmap) return;
    for (const week of draftRoadmap.weekly_targets) {
      const weakMatch = draftRoadmap.subjects.some(subject => subject.is_weak && week.targets.join(' ').toLowerCase().includes(subject.name.toLowerCase()));
      await addTask(
        `${draftRoadmap.exam_name} Week ${week.week}: ${week.title}`,
        null,
        weakMatch ? 'high' : 'medium',
        week.targets.join('\n'),
        week.end_date
      );
    }
    setMessage('Roadmap weekly targets converted into Task Manager tasks.');
  };

  const handleGenerateSchedule = async () => {
    if (!draftRoadmap || nextDays.length === 0) return;
    const uniqueTargets = nextDays.slice(0, 4);
    const schedule = generateSchedule({
      title: `${draftRoadmap.exam_name} Roadmap Daily Plan`,
      availableHours: draftRoadmap.hours_per_day,
      startTime: '08:00',
      subjects: uniqueTargets.map((target, index) => {
        const matchedRoadmapSubject = draftRoadmap.subjects.find(subject => subject.name === target.subject);
        const matchedAppSubject = subjects.find(subject => subject.name.toLowerCase() === target.subject.toLowerCase());
        return {
          id: matchedAppSubject?.id || `roadmap-schedule-${index}`,
          name: target.subject,
          difficulty: matchedRoadmapSubject?.is_weak ? 9 : 6,
          isWeak: Boolean(matchedRoadmapSubject?.is_weak)
        };
      })
    });
    await saveSchedule(schedule);
    setMessage('Daily schedule generated from roadmap targets and saved to Scheduler.');
  };

  const loadRoadmap = (roadmap: ExamRoadmap) => {
    const hydratedRoadmap = roadmap.weekly_targets.length > 0
      ? roadmap
      : generateRoadmap({
        examName: roadmap.exam_name,
        examDate: roadmap.exam_date,
        hoursPerDay: roadmap.hours_per_day,
        subjects: roadmap.subjects.map(subject => subject.name),
        weakSubjects: roadmap.subjects.filter(subject => subject.is_weak).map(subject => subject.name)
      });
    hydratedRoadmap.id = roadmap.id;
    hydratedRoadmap.created_at = roadmap.created_at;
    setDraftRoadmap(hydratedRoadmap);
    setExamName(hydratedRoadmap.exam_name);
    setExamDate(hydratedRoadmap.exam_date);
    setHoursPerDay(hydratedRoadmap.hours_per_day.toString());
    setSubjectText(hydratedRoadmap.subjects.map(subject => subject.name).join('\n'));
    setWeakSubjectText(hydratedRoadmap.subjects.filter(subject => subject.is_weak).map(subject => subject.name).join('\n'));
    setMessage(`Loaded ${hydratedRoadmap.exam_name} roadmap.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#121212] flex items-center gap-2">
            Exam Roadmap Generator
            <Sparkles className="w-5 h-5 text-[#F5C518]" />
          </h3>
          <p className="text-xs text-[#8A8A86] font-semibold uppercase tracking-wider mt-0.5">
            Long-term prep phases, weekly goals, and daily targets
          </p>
        </div>
        {roadmaps.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {roadmaps.slice(0, 3).map((roadmap) => (
              <button
                key={roadmap.id}
                onClick={() => loadRoadmap(roadmap)}
                className="bg-white border border-[#EBE6DD] hover:bg-[#F5F0E6] text-[#1E1E1E] px-3 py-2 rounded-xl text-[10px] font-extrabold transition"
              >
                {roadmap.exam_name}
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
        <form onSubmit={handleGenerate} className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-[#EBE6DD] pb-4">
            <div>
              <h4 className="text-base font-extrabold text-[#121212]">Roadmap Form</h4>
              <p className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider mt-1">Exam timeline inputs</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Exam Name</label>
              <input
                value={examName}
                onChange={(event) => setExamName(event.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
              />
            </div>
            <div>
              <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Hours Per Day</label>
            <input
              type="number"
              min="1"
              max="14"
              step="0.5"
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(event.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
            />
          </div>

          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Subjects</label>
            <textarea
              value={subjectText}
              onChange={(event) => setSubjectText(event.target.value)}
              rows={5}
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E] resize-none"
            />
          </div>

          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5">Weak Subjects</label>
            <textarea
              value={weakSubjectText}
              onChange={(event) => setWeakSubjectText(event.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E] resize-none"
            />
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
            <Wand2 className="w-4 h-4 text-[#F5C518]" /> Generate Roadmap
          </button>
        </form>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1E1E1E] text-white rounded-[22px] p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Remaining Days</p>
              <p className="text-3xl font-extrabold mt-1">{draftRoadmap?.remaining_days || 0}</p>
            </div>
            <div className="bg-white border border-[#EBE6DD] rounded-[22px] p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Current Phase</p>
              <p className="text-xl font-extrabold mt-2 text-[#121212]">{activePhase?.name || 'Not generated'}</p>
            </div>
            <div className="bg-[#FDF7E2] border border-[#F5C518]/30 rounded-[22px] p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Weekly Goals</p>
              <p className="text-3xl font-extrabold mt-1 text-[#121212]">{draftRoadmap?.weekly_targets.length || 0}</p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
              <h4 className="text-sm font-extrabold text-[#121212] flex items-center gap-2">
                <Map className="w-4 h-4 text-[#F5C518]" /> Phase Timeline
              </h4>
              {draftRoadmap && <span className="text-[10px] font-bold text-[#8A8A86]">{draftRoadmap.exam_name}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {(draftRoadmap?.phases || []).map((phase) => (
                <div
                  key={phase.id}
                  className={`rounded-2xl border p-4 ${phase.id === activePhase?.id ? 'bg-[#1E1E1E] border-[#1E1E1E] text-white' : 'bg-[#FAF8F5] border-[#EBE6DD] text-[#121212]'}`}
                >
                  <p className="text-sm font-extrabold">{phase.name}</p>
                  <p className={`text-[10px] font-bold mt-1 ${phase.id === activePhase?.id ? 'text-[#F5C518]' : 'text-[#8A8A86]'}`}>
                    Day {phase.start_day} - {phase.end_day}
                  </p>
                  <div className="h-2 rounded-full bg-white/50 border border-[#EBE6DD]/40 mt-3 overflow-hidden">
                    <div className="h-full bg-[#F5C518]" style={{ width: `${phase.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
                <h4 className="text-sm font-extrabold text-[#121212] flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#F5C518]" /> Weekly Targets
                </h4>
                <span className="text-[9px] bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] px-2 py-1 rounded-lg font-bold uppercase">Next 4</span>
              </div>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {(draftRoadmap?.weekly_targets.slice(0, 4) || []).map((week) => (
                  <div key={week.id} className="bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-[#121212]">{week.title}</p>
                      <span className="text-[10px] font-bold text-[#8A8A86] whitespace-nowrap">Week {week.week}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {week.targets.slice(0, 4).map((target) => (
                        <li key={target} className="text-xs font-bold text-[#8A8A86] flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-[#F5C518]" /> {target}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
                <h4 className="text-sm font-extrabold text-[#121212] flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#F5C518]" /> Daily Targets
                </h4>
                <span className="text-[9px] bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] px-2 py-1 rounded-lg font-bold uppercase">Next 7</span>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {nextDays.map((day) => (
                  <div key={day.id} className="grid grid-cols-[74px_1fr_auto] gap-3 items-center bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl p-3">
                    <span className="text-[10px] font-extrabold text-[#8A8A86]">{day.date}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#121212] truncate">{day.title}</p>
                      <p className="text-[10px] font-bold text-[#8A8A86]">{day.subject}</p>
                    </div>
                    <span className="text-xs font-extrabold text-[#121212]">{day.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-5 shadow-sm flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={!draftRoadmap}
              className="flex-1 bg-[#1E1E1E] disabled:opacity-40 hover:bg-[#1E1E1E]/95 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4 text-[#F5C518]" /> Save Roadmap
            </button>
            <button
              onClick={handleConvertToTasks}
              disabled={!draftRoadmap}
              className="flex-1 bg-[#FAF8F5] disabled:opacity-40 border border-[#EBE6DD] hover:bg-[#F5F0E6] text-[#1E1E1E] rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <ListPlus className="w-4 h-4" /> Convert To Tasks
            </button>
            <button
              onClick={handleGenerateSchedule}
              disabled={!draftRoadmap}
              className="flex-1 bg-[#FDF7E2] disabled:opacity-40 border border-[#F5C518]/30 hover:bg-[#F8EDC9] text-[#1E1E1E] rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <CalendarDays className="w-4 h-4" /> Generate Daily Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
