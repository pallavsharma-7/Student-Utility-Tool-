'use client';

import React, { useState } from 'react';
import { useApp } from '../app/providers';
import { 
  Hourglass, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles, 
  Plus, 
  ArrowUpRight,
  Check,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardView: React.FC = () => {
  const { 
    stats, 
    tasks, 
    subjects, 
    studySessions,
    addTask,
    updateTask,
    // Focus Timer
    timerActive,
    setTimerActive,
    timerSecondsLeft,
    setTimerSecondsLeft,
    timerTotalDuration,
    setTimerTotalDuration,
    timerSubjectId,
    setTimerSubjectId,
    timerMode,
    setTimerMode
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [customMins, setCustomMins] = useState('45');

  // Helper to format timer duration
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Preset Mode change
  const handleModeChange = (mode: 'pomodoro' | 'short_break' | 'long_break' | 'custom', mins: number) => {
    setTimerActive(false);
    setTimerMode(mode);
    setTimerSecondsLeft(mins * 60);
    setTimerTotalDuration(mins * 60);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMins);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      handleModeChange('custom', mins);
    }
  };

  const handleReset = () => {
    setTimerActive(false);
    setTimerSecondsLeft(timerTotalDuration);
  };

  // Add a task from dashboard checklist quickly
  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), null);
      setNewTaskTitle('');
    }
  };

  // SVG circular countdown calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timerSecondsLeft / timerTotalDuration) * circumference;

  // Active associated subject details
  const activeSubject = subjects.find(s => s.id === timerSubjectId);

  // ==========================================
  // CALCULATING CHART DATA (LAST 7 DAYS)
  // ==========================================
  const getLast7DaysData = () => {
    const data = [];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // matching S M T W T F S in Talex design!
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayIndex = d.getDay();
      const label = days[dayIndex];

      // Sum logged hours for this date
      const daysSessions = studySessions.filter(s => s.created_at.startsWith(dateStr));
      const totalSeconds = daysSessions.reduce((sum, s) => sum + s.duration_seconds, 0);
      const hours = parseFloat((totalSeconds / 3600).toFixed(1));

      data.push({
        label,
        hours,
        isToday: i === 0,
        dateStr
      });
    }
    return data;
  };

  const last7Days = getLast7DaysData();
  const maxHours = Math.max(...last7Days.map(d => d.hours), 4); // minimum ceiling for heights scaling

  // Calculate syllabus completions or mock roadmap
  const syllabusProgress = stats.syllabus_completion;

  return (
    <div className="space-y-6 page-transition">
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Hours Stat Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl p-5 shadow-sm border border-[#EBE6DD] bg-[#1E1E1E] text-white flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Study Hours</span>
            <div className="p-1.5 rounded-lg bg-white/10">
              <Hourglass className="w-4 h-4 text-[#F5C518]" />
            </div>
          </div>
          <div className="my-1">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.total_study_hours}h</h3>
            <p className="text-[10px] font-bold text-[#8A8A86] mt-0.5">Total hours logged</p>
          </div>
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full bg-white/20">
              <div 
                className="h-full rounded-full bg-[#F5C518] transition-all duration-500" 
                style={{ width: `${Math.min((stats.total_study_hours / 100) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </motion.div>

        {/* Tasks Completed Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl p-5 shadow-sm border border-[#EBE6DD] bg-white text-[#121212] flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Tasks Completed</span>
            <div className="p-1.5 rounded-lg bg-[#FAF8F5]">
              <CheckCircle2 className="w-4 h-4 text-[#1E1E1E]" />
            </div>
          </div>
          <div className="my-1">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.tasks_completed}</h3>
            <p className="text-[10px] font-bold text-[#8A8A86] mt-0.5">
              {tasks.filter(t => t.status === 'done').length}/{tasks.length} tasks completed
            </p>
          </div>
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full bg-[#FAF8F5]">
              <div 
                className="h-full rounded-full bg-[#1E1E1E] transition-all duration-500" 
                style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </motion.div>

        {/* Active Streak Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl p-5 shadow-sm border border-[#F5C518]/30 bg-[#FDF7E2] text-[#121212] flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Study Streak</span>
            <div className="p-1.5 rounded-lg bg-white shadow-sm border border-[#F5C518]/10">
              <Flame className="w-4 h-4 text-[#F5C518]" />
            </div>
          </div>
          <div className="my-1">
            <h3 className="text-3xl font-extrabold tracking-tight">{stats.streak} Days</h3>
            <p className="text-[10px] font-bold text-[#8A8A86] mt-0.5">Consecutive active study days</p>
          </div>
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full bg-white/60">
              <div className="h-full rounded-full bg-[#F5C518]" style={{ width: '100%' }} />
            </div>
          </div>
        </motion.div>

        {/* Syllabus Progress Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl p-5 shadow-sm border border-[#EBE6DD] bg-white text-[#121212] flex flex-col justify-between h-36"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A86]">Syllabus Progress</span>
            <div className="p-1.5 rounded-lg bg-[#FAF8F5]">
              <BookOpen className="w-4 h-4 text-[#1E1E1E]" />
            </div>
          </div>
          <div className="my-1">
            <h3 className="text-3xl font-extrabold tracking-tight">{syllabusProgress}%</h3>
            <p className="text-[10px] font-bold text-[#8A8A86] mt-0.5">Weighted syllabus completion</p>
          </div>
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full bg-[#FAF8F5]">
              <div className="h-full rounded-full bg-[#1E1E1E]" style={{ width: `${syllabusProgress}%` }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. DYNAMIC WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. FUNCTIONAL FOCUS TIMER */}
        <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[360px] select-none">
          <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3">
            <h4 className="text-sm font-bold text-[#121212] flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-[#F5C518]" />
              Focus Timer
            </h4>

            {/* Mode selection pills */}
            <div className="flex bg-[#FAF8F5] p-0.5 rounded-xl border border-[#EBE6DD] text-[9px] font-bold">
              <button
                onClick={() => handleModeChange('pomodoro', 25)}
                className={`px-2 py-1 rounded-lg transition ${
                  timerMode === 'pomodoro' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-[#8A8A86] hover:text-[#121212]'
                }`}
              >
                25m
              </button>
              <button
                onClick={() => handleModeChange('short_break', 5)}
                className={`px-2 py-1 rounded-lg transition ${
                  timerMode === 'short_break' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-[#8A8A86] hover:text-[#121212]'
                }`}
              >
                5m
              </button>
              <button
                onClick={() => handleModeChange('custom', parseInt(customMins) || 45)}
                className={`px-2 py-1 rounded-lg transition ${
                  timerMode === 'custom' ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-[#8A8A86] hover:text-[#121212]'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center my-2 gap-5">
            {/* Countdown SVG Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r={radius} className="stroke-[#FAF8F5] fill-transparent" strokeWidth="5" />
                <motion.circle 
                  cx="64" 
                  cy="64" 
                  r={radius} 
                  className="stroke-[#F5C518] fill-transparent" 
                  strokeWidth="5" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  transition={{ ease: "linear" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#121212]">{formatTime(timerSecondsLeft)}</span>
                <span className="text-[8px] text-[#8A8A86] font-extrabold tracking-widest uppercase mt-0.5">
                  {timerActive ? 'FOCUSING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Subject Selector dropdown */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {timerMode === 'custom' && (
                <form onSubmit={handleCustomSubmit} className="flex gap-1.5 items-center mb-1">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMins}
                    onChange={(e) => setCustomMins(e.target.value)}
                    className="w-12 px-1.5 py-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-lg text-center font-extrabold text-[10px] outline-none"
                  />
                  <button type="submit" className="bg-[#1E1E1E] text-white font-bold text-[9px] px-2 py-1.5 rounded-lg">Set</button>
                </form>
              )}

              <p className="text-[8px] text-[#8A8A86] font-extrabold uppercase">Study Subject</p>
              <div className="relative">
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="w-full bg-[#FAF8F5] hover:bg-[#F5F0E6] border border-[#EBE6DD] rounded-xl px-3 py-2 text-xs font-bold text-[#121212] flex items-center justify-between text-left truncate transition"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: activeSubject?.color || '#8A8A86' }} 
                    />
                    <span className="truncate">{activeSubject?.name || 'General Study'}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A8A86] flex-shrink-0 ml-1" />
                </button>

                {showSubjectDropdown && (
                  <div className="absolute left-0 bottom-11 w-full bg-white border border-[#EBE6DD] rounded-xl shadow-lg py-1.5 z-10 max-h-36 overflow-y-auto">
                    <button
                      onClick={() => { setTimerSubjectId(null); setShowSubjectDropdown(false); }}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-[#FAF8F5] flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8A8A86]" />General Study</span>
                      {!timerSubjectId && <Check className="w-3.5 h-3.5" />}
                    </button>
                    {subjects.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => { setTimerSubjectId(sub.id); setShowSubjectDropdown(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-[#FAF8F5] flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />{sub.name}</span>
                        {timerSubjectId === sub.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-3">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`flex-1 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 transition duration-200 shadow-sm ${
                timerActive 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-[#1E1E1E] hover:bg-[#1E1E1E]/95 text-white'
              }`}
            >
              {timerActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Focus
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-[#F5C518]" /> Start Session
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="bg-[#FAF8F5] border border-[#EBE6DD] p-3 rounded-xl hover:bg-[#F5F0E6] transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1E1E1E]" />
            </button>
          </div>
        </div>

        {/* B. DYNAMIC CHECKLIST CARD */}
        <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
              <h4 className="text-sm font-bold text-[#121212] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5C518]" />
                Today's Goals
              </h4>
              <span className="text-[9px] bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] px-2 py-0.5 rounded font-bold uppercase">
                {tasks.filter(t => t.status === 'done').length}/{tasks.length}
              </span>
            </div>

            {/* Quick Task Addition */}
            <form onSubmit={handleQuickAddTask} className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add a daily study task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-semibold text-[#121212] outline-none focus:border-[#1E1E1E]"
              />
              <button
                type="submit"
                className="bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 p-2 rounded-xl"
              >
                <Plus className="w-4 h-4 text-[#F5C518]" />
              </button>
            </form>

            {/* Scrollable checklists */}
            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-[#8A8A86] text-xs">
                  <p className="font-bold">No active study goals</p>
                  <p className="text-[10px] mt-0.5">Quick-add one above to start logging!</p>
                </div>
              ) : (
                tasks.slice(0, 4).map((task) => {
                  const isDone = task.status === 'done';
                  const taskSubject = subjects.find(s => s.id === task.subject_id);
                  return (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-2.5 border rounded-xl transition duration-200 ${
                        isDone 
                          ? 'bg-[#FAF8F5]/80 border-[#EBE6DD]/60 opacity-60' 
                          : 'bg-[#FAF8F5] border-[#EBE6DD] hover:border-[#1E1E1E]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => updateTask(task.id, { status: isDone ? 'pending' : 'done' })}
                          className="w-4 h-4 rounded border border-[#EBE6DD] bg-white flex items-center justify-center cursor-pointer transition active:scale-95 flex-shrink-0"
                        >
                          {isDone && <span className="w-2.5 h-2.5 bg-[#1E1E1E] rounded-sm" />}
                        </button>
                        <div className="truncate">
                          <p className={`text-xs font-bold leading-tight truncate ${isDone ? 'line-through text-[#8A8A86]' : 'text-[#121212]'}`}>
                            {task.title}
                          </p>
                        </div>
                      </div>
                      
                      {taskSubject && (
                        <span 
                          className="text-[8px] font-extrabold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                          style={{ backgroundColor: taskSubject.color }}
                        >
                          {taskSubject.name.substring(0, 4)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[9px] text-[#8A8A86] font-bold text-center border-t border-[#EBE6DD] pt-2">
            Click tasks checkbox to instantly toggle completion
          </div>
        </div>

        {/* C. VISUAL PREMIUM CHARTS (STAGE 2 REAL DATA) */}
        <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[360px] select-none">
          <div>
            <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3 mb-4">
              <h4 className="text-sm font-bold text-[#121212] flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-[#F5C518]" />
                Study Hours (Last 7d)
              </h4>
              <span className="text-[10px] text-[#1E1E1E] font-extrabold">
                {stats.total_study_hours}h total
              </span>
            </div>

            {/* Custom rounded bar chart columns */}
            <div className="h-40 flex items-end justify-between px-2 pt-6 pb-2 bg-[#FAF8F5] border border-[#EBE6DD] rounded-2xl relative">
              {/* Grid lines background */}
              <div className="absolute inset-x-0 top-1/4 border-t border-[#EBE6DD]/40 border-dashed" />
              <div className="absolute inset-x-0 top-2/4 border-t border-[#EBE6DD]/40 border-dashed" />
              <div className="absolute inset-x-0 top-3/4 border-t border-[#EBE6DD]/40 border-dashed" />

              {last7Days.map((day, idx) => {
                const pct = (day.hours / maxHours) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 z-10 group relative">
                    {/* Hover tooltip showing precise study duration */}
                    <div className="absolute top-[-26px] bg-[#1E1E1E] text-[#F5C518] text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                      {day.hours} hrs
                    </div>

                    {/* Column pill bar */}
                    <div className="w-3.5 sm:w-4 bg-neutral-200/50 rounded-full h-24 flex items-end overflow-hidden border border-[#EBE6DD]/30">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 1, delay: idx * 0.05 }}
                        className={`w-full rounded-full transition-all duration-300 ${
                          day.isToday ? 'bg-[#F5C518]' : 'bg-[#1E1E1E] hover:bg-[#1E1E1E]/90'
                        }`}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-[#8A8A86] mt-2 leading-none">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly progress percentage calculated metric */}
          <div className="flex items-center justify-between text-[11px] font-bold text-[#8A8A86] border-t border-[#EBE6DD] pt-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
              Today highlighted
            </span>
            <span className="text-[#121212]">
              Weekly Target: 25h
            </span>
          </div>
        </div>
      </div>

      {/* 3. LECTURES DECK PREVIEW (MVP VISUAL STAGE 2) */}
      <div className="bg-white border border-[#EBE6DD] rounded-[28px] p-6 shadow-sm select-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-base font-extrabold text-[#121212]">Lecture Tracker</h4>
            <p className="text-xs text-[#8A8A86] font-semibold">Netflix-style study playlist tracking</p>
          </div>
          <button className="bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/95 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
            <Plus className="w-3.5 h-3.5 text-[#F5C518]" /> Add Playlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample playlists visually mapping progress */}
          <div className="border border-[#EBE6DD] rounded-2xl overflow-hidden bg-[#FAF8F5] group hover:border-[#1E1E1E] transition duration-200">
            <div className="h-36 bg-neutral-200 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80" 
                alt="OS by Gate Smashers" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <span className="absolute bottom-3 right-3 bg-[#1E1E1E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                56% done
              </span>
            </div>
            <div className="p-4">
              <h5 className="text-xs font-bold text-[#121212] truncate">OS by Gate Smashers</h5>
              <div className="flex justify-between items-center mt-3 text-[10px] text-[#8A8A86] font-bold">
                <span>Watched: 42/75</span>
                <span className="text-[#1E1E1E]">Continue</span>
              </div>
            </div>
          </div>

          <div className="border border-[#EBE6DD] rounded-2xl overflow-hidden bg-[#FAF8F5] group hover:border-[#1E1E1E] transition duration-200">
            <div className="h-36 bg-neutral-200 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80" 
                alt="DSA Complete placement course" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <span className="absolute bottom-3 right-3 bg-[#1E1E1E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                26% done
              </span>
            </div>
            <div className="p-4">
              <h5 className="text-xs font-bold text-[#121212] truncate">DSA Complete Placement</h5>
              <div className="flex justify-between items-center mt-3 text-[10px] text-[#8A8A86] font-bold">
                <span>Watched: 32/120</span>
                <span className="text-[#1E1E1E]">Continue</span>
              </div>
            </div>
          </div>

          <div className="border border-[#EBE6DD] rounded-2xl overflow-hidden bg-[#FAF8F5] group hover:border-[#1E1E1E] transition duration-200">
            <div className="h-36 bg-neutral-200 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80" 
                alt="DBMS for GATE" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <span className="absolute bottom-3 right-3 bg-[#1E1E1E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                58% done
              </span>
            </div>
            <div className="p-4">
              <h5 className="text-xs font-bold text-[#121212] truncate">DBMS for GATE</h5>
              <div className="flex justify-between items-center mt-3 text-[10px] text-[#8A8A86] font-bold">
                <span>Watched: 26/45</span>
                <span className="text-[#1E1E1E]">Continue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
