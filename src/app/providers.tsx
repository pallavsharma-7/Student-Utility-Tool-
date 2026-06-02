'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService, UserStats, Task, Subject, StudySession, DailySchedule, ExamRoadmap } from '../lib/db';

interface UserSession {
  name: string;
  email: string;
}

interface AppContextProps {
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  user: UserSession | null;
  
  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;

  // Real Database integration states
  stats: UserStats;
  tasks: Task[];
  subjects: Subject[];
  studySessions: StudySession[];
  schedules: DailySchedule[];
  todaySchedule: DailySchedule | null;
  roadmaps: ExamRoadmap[];
  currentRoadmap: ExamRoadmap | null;
  
  // Actions
  addTask: (title: string, subjectId: string | null, priority?: 'low' | 'medium' | 'high', notes?: string, due_date?: string | null) => Promise<void>;
  updateTask: (id: string, fields: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  logStudySession: (subjectId: string | null, durationSeconds: number) => Promise<void>;
  saveSchedule: (schedule: DailySchedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  saveRoadmap: (roadmap: ExamRoadmap) => Promise<void>;
  deleteRoadmap: (id: string) => Promise<void>;
  refreshStats: () => Promise<void>;

  // Focus Timer active states
  timerActive: boolean;
  setTimerActive: (active: boolean) => void;
  timerSecondsLeft: number;
  setTimerSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  timerTotalDuration: number;
  setTimerTotalDuration: (duration: number) => void;
  timerSubjectId: string | null;
  setTimerSubjectId: (id: string | null) => void;
  timerMode: 'pomodoro' | 'short_break' | 'long_break' | 'custom';
  setTimerMode: (mode: 'pomodoro' | 'short_break' | 'long_break' | 'custom') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Real data state logs
  const [stats, setStats] = useState<UserStats>({
    name: 'Kasven',
    email: 'kasven@prepflow.io',
    streak: 0,
    total_study_hours: 0,
    tasks_completed: 0,
    syllabus_completion: 58
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<DailySchedule | null>(null);
  const [roadmaps, setRoadmaps] = useState<ExamRoadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState<ExamRoadmap | null>(null);

  // Focus Timer States
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60);
  const [timerTotalDuration, setTimerTotalDuration] = useState<number>(25 * 60);
  const [timerSubjectId, setTimerSubjectId] = useState<string | null>(null);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'short_break' | 'long_break' | 'custom'>('pomodoro');

  // Load user session on launch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('prepflow_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Fetch all core records from dbService when logged in
  const fetchAllRecords = async () => {
    try {
      const currentStats = await dbService.getStats();
      const currentTasks = await dbService.getTasks();
      const currentSubjects = await dbService.getSubjects();
      const currentSessions = await dbService.getStudySessions();
      const currentSchedules = await dbService.getSchedules();
      const currentTodaySchedule = await dbService.getTodaySchedule();
      const currentRoadmaps = await dbService.getRoadmaps();
      const activeRoadmap = await dbService.getCurrentRoadmap();

      setStats(currentStats);
      setTasks(currentTasks);
      setSubjects(currentSubjects);
      setStudySessions(currentSessions);
      setSchedules(currentSchedules);
      setTodaySchedule(currentTodaySchedule);
      setRoadmaps(currentRoadmaps);
      setCurrentRoadmap(activeRoadmap);
    } catch (e) {
      console.error('Error fetching databases', e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllRecords();
    }
  }, [isLoggedIn]);

  // Focus Timer Countdown Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerActive && timerSecondsLeft === 0) {
      setTimerActive(false);
      
      // Auto log Completed Session
      if (timerMode === 'pomodoro' || timerMode === 'custom') {
        logStudySession(timerSubjectId, timerTotalDuration);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSecondsLeft]);

  const login = (email: string, name: string = 'Kasven') => {
    const session = { name, email };
    setUser(session);
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepflow_session', JSON.stringify(session));
    }
  };

  const signup = (name: string, email: string) => {
    const session = { name, email };
    setUser(session);
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepflow_session', JSON.stringify(session));
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('prepflow_session');
    }
  };

  // Actions
  const addTask = async (title: string, subjectId: string | null, priority: 'low' | 'medium' | 'high' = 'medium', notes: string = '', due_date?: string | null) => {
    await dbService.addTask(title, subjectId, priority, notes, due_date);
    await fetchAllRecords();
  };

  const updateTask = async (id: string, fields: Partial<Task>) => {
    await dbService.updateTask(id, fields);
    await fetchAllRecords();
  };

  const deleteTask = async (id: string) => {
    await dbService.deleteTask(id);
    await fetchAllRecords();
  };

  const logStudySession = async (subjectId: string | null, durationSeconds: number) => {
    await dbService.logStudySession(subjectId, durationSeconds);
    await fetchAllRecords();
  };

  const saveSchedule = async (schedule: DailySchedule) => {
    await dbService.saveSchedule(schedule);
    await fetchAllRecords();
  };

  const deleteSchedule = async (id: string) => {
    await dbService.deleteSchedule(id);
    await fetchAllRecords();
  };

  const saveRoadmap = async (roadmap: ExamRoadmap) => {
    await dbService.saveRoadmap(roadmap);
    await fetchAllRecords();
  };

  const deleteRoadmap = async (id: string) => {
    await dbService.deleteRoadmap(id);
    await fetchAllRecords();
  };

  const refreshStats = async () => {
    const s = await dbService.getStats();
    setStats(s);
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      login,
      signup,
      logout,
      user,
      activeView,
      setActiveView,
      stats,
      tasks,
      subjects,
      studySessions,
      schedules,
      todaySchedule,
      roadmaps,
      currentRoadmap,
      addTask,
      updateTask,
      deleteTask,
      logStudySession,
      saveSchedule,
      deleteSchedule,
      saveRoadmap,
      deleteRoadmap,
      refreshStats,
      
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
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
