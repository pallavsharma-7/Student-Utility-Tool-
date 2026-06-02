import { supabase } from './supabase';

export interface Subject {
  id: string;
  name: string;
  difficulty: number; // 1-10
  is_weak: boolean;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  subject_id: string | null;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  due_date?: string | null;
  created_at: string;
  completed_at?: string;
}

export interface StudySession {
  id: string;
  subject_id: string | null;
  duration_seconds: number;
  created_at: string; // ISO string
}

export type ScheduleBlockType = 'study' | 'break' | 'lunch';

export interface ScheduleSubject {
  id: string;
  name: string;
  difficulty: number;
  is_weak: boolean;
  allocated_minutes: number;
}

export interface ScheduleBlock {
  id: string;
  type: ScheduleBlockType;
  subject_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

export interface DailySchedule {
  id: string;
  title: string;
  date: string;
  available_minutes: number;
  start_time: string;
  subjects: ScheduleSubject[];
  blocks: ScheduleBlock[];
  created_at: string;
  updated_at: string;
}

export interface RoadmapSubject {
  id: string;
  name: string;
  is_weak: boolean;
  weight: number;
}

export interface RoadmapDailyTarget {
  id: string;
  day: number;
  date: string;
  subject: string;
  title: string;
  hours: number;
}

export interface RoadmapWeeklyTarget {
  id: string;
  week: number;
  start_date: string;
  end_date: string;
  phase_id: string;
  title: string;
  targets: string[];
  daily_targets: RoadmapDailyTarget[];
}

export interface RoadmapPhase {
  id: string;
  name: 'Learning' | 'Practice' | 'Revision' | 'Mock Tests';
  start_day: number;
  end_day: number;
  goal: string;
  progress: number;
}

export interface ExamRoadmap {
  id: string;
  exam_name: string;
  exam_date: string;
  hours_per_day: number;
  remaining_days: number;
  subjects: RoadmapSubject[];
  phases: RoadmapPhase[];
  weekly_targets: RoadmapWeeklyTarget[];
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  name: string;
  email: string;
  streak: number;
  total_study_hours: number;
  tasks_completed: number;
  syllabus_completion: number;
}

// Helpers
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

const isBrowser = typeof window !== 'undefined';

const KEYS = {
  STATS: 'prepflow_stats',
  SUBJECTS: 'prepflow_subjects',
  TASKS: 'prepflow_tasks',
  STUDY_SESSIONS: 'prepflow_study_sessions',
  ROADMAP: 'prepflow_roadmap',
  LECTURES: 'prepflow_lectures',
  SCHEDULES: 'prepflow_schedules'
};

// ==========================================
// SEEDING DYNAMIC DEMO DATA (30 DAYS)
// ==========================================
export const seedDemoData = () => {
  if (!isBrowser) return;

  // 1. Seed Subjects
  const defaultSubjects: Subject[] = [
    { id: 'sub-1', name: 'Mathematics', difficulty: 8, is_weak: false, color: '#F5C518' },
    { id: 'sub-2', name: 'Operating Systems', difficulty: 9, is_weak: true, color: '#E03E3E' },
    { id: 'sub-3', name: 'DBMS', difficulty: 6, is_weak: false, color: '#1E1E1E' },
    { id: 'sub-4', name: 'Computer Networks', difficulty: 5, is_weak: true, color: '#8A8A86' },
    { id: 'sub-5', name: 'DSA', difficulty: 7, is_weak: false, color: '#4F46E5' }
  ];
  if (!localStorage.getItem(KEYS.SUBJECTS)) {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(defaultSubjects));
  }

  // 2. Seed Tasks with priority, notes, and due dates (Stage 3 targets)
  const defaultTasks: Task[] = [
    { id: 'task-1', title: 'Solve Calculus PYQ Set 3', subject_id: 'sub-1', status: 'pending', priority: 'high', notes: 'Solve questions from 2024 to 2026 GATE papers.', due_date: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-2', title: 'Revise Binary Trees Traversals', subject_id: 'sub-5', status: 'done', priority: 'medium', notes: 'Focus on recursive vs iterative approaches.', due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], created_at: new Date(Date.now() - 86400000).toISOString(), completed_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'task-3', title: 'Finish OS Scheduling Lecture 12', subject_id: 'sub-2', status: 'in_progress', priority: 'high', notes: 'Take deep notes on preemption mechanisms.', due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-4', title: 'Review ISO-OSI Layer 3 and 4 functions', subject_id: 'sub-4', status: 'pending', priority: 'medium', notes: 'Memorize header details of TCP and IP.', due_date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-5', title: 'Write SQL Queries practicing Joins & GroupBy', subject_id: 'sub-3', status: 'done', priority: 'high', notes: 'Practice complex inner, outer and cross joins.', due_date: new Date(Date.now() - 172800000).toISOString().split('T')[0], created_at: new Date(Date.now() - 172800000).toISOString(), completed_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 'task-6', title: 'Revise Semaphores & Deadlocks', subject_id: 'sub-2', status: 'done', priority: 'low', notes: 'Producer-Consumer problem implementation study.', due_date: new Date(Date.now() - 259200000).toISOString().split('T')[0], created_at: new Date(Date.now() - 259200000).toISOString(), completed_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 'task-7', title: 'Practice Dijkstra Algorithm on Graphs', subject_id: 'sub-5', status: 'pending', priority: 'high', notes: 'Implement in C++ and analyze time and space complexity.', due_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-8', title: 'Study CN TCP Congestion Control', subject_id: 'sub-4', status: 'in_progress', priority: 'medium', notes: 'Understand Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery.', due_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-9', title: 'Solve Linear Algebra Matrices Exercises', subject_id: 'sub-1', status: 'pending', priority: 'low', notes: 'Focus on eigenvalues, eigenvectors, and matrix diagonalization.', due_date: new Date(Date.now() + 86400000 * 13).toISOString().split('T')[0], created_at: new Date().toISOString() },
    { id: 'task-10', title: 'Read DBMS Normalization Theory', subject_id: 'sub-3', status: 'pending', priority: 'medium', notes: 'Study 1NF, 2NF, 3NF, BCNF, and multi-valued dependencies.', due_date: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], created_at: new Date().toISOString() }
  ];
  const existingTasks = localStorage.getItem(KEYS.TASKS);
  if (!existingTasks || JSON.parse(existingTasks).length < 10) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(defaultTasks));
  }

  // 3. Seed Study Sessions (30 days)
  if (!localStorage.getItem(KEYS.STUDY_SESSIONS)) {
    const studySessions: StudySession[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const sessionDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      if (i === 12 || i === 22) continue;
      
      const dailyHours = 1.5 + Math.random() * 4;
      const durationSeconds = Math.round(dailyHours * 3600);
      const subjectId = `sub-${Math.floor(Math.random() * 5) + 1}`;
      
      studySessions.push({
        id: `ses-gen-${i}`,
        subject_id: subjectId,
        duration_seconds: durationSeconds,
        created_at: sessionDate.toISOString()
      });
    }
    localStorage.setItem(KEYS.STUDY_SESSIONS, JSON.stringify(studySessions));
  }

  // 4. Seed user stats
  if (!localStorage.getItem(KEYS.STATS)) {
    const defaultStats: UserStats = {
      name: 'Kasven',
      email: 'kasven@prepflow.io',
      streak: 7,
      total_study_hours: 42.5,
      tasks_completed: 18,
      syllabus_completion: 58
    };
    localStorage.setItem(KEYS.STATS, JSON.stringify(defaultStats));
  }

  // 5. Seed scheduler examples for Stage 4 testing
  if (!localStorage.getItem(KEYS.SCHEDULES)) {
    const today = new Date().toISOString().split('T')[0];
    const demoSchedules: DailySchedule[] = [
      {
        id: 'schedule-jee-demo',
        title: 'JEE Balanced Day',
        date: today,
        available_minutes: 480,
        start_time: '08:00',
        subjects: [
          { id: 'jee-maths', name: 'Maths', difficulty: 9, is_weak: true, allocated_minutes: 270 },
          { id: 'jee-physics', name: 'Physics', difficulty: 6, is_weak: false, allocated_minutes: 130 },
          { id: 'jee-chemistry', name: 'Chemistry', difficulty: 3, is_weak: false, allocated_minutes: 80 }
        ],
        blocks: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'schedule-neet-demo',
        title: 'NEET Bio-First Day',
        date: today,
        available_minutes: 420,
        start_time: '07:30',
        subjects: [
          { id: 'neet-biology', name: 'Biology', difficulty: 8, is_weak: false, allocated_minutes: 190 },
          { id: 'neet-physics', name: 'Physics', difficulty: 9, is_weak: true, allocated_minutes: 170 },
          { id: 'neet-chemistry', name: 'Chemistry', difficulty: 5, is_weak: false, allocated_minutes: 60 }
        ],
        blocks: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'schedule-gate-demo',
        title: 'GATE Core Systems Day',
        date: today,
        available_minutes: 390,
        start_time: '09:00',
        subjects: [
          { id: 'gate-os', name: 'Operating Systems', difficulty: 9, is_weak: true, allocated_minutes: 170 },
          { id: 'gate-dsa', name: 'DSA', difficulty: 8, is_weak: false, allocated_minutes: 120 },
          { id: 'gate-dbms', name: 'DBMS', difficulty: 6, is_weak: false, allocated_minutes: 100 }
        ],
        blocks: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(demoSchedules));
  }

  // 6. Seed roadmap examples for Stage 5 testing
  if (!localStorage.getItem(KEYS.ROADMAP)) {
    const now = new Date().toISOString();
    const demoRoadmaps: ExamRoadmap[] = [
      {
        id: 'roadmap-gate-demo',
        exam_name: 'GATE',
        exam_date: '2027-02-15',
        hours_per_day: 5,
        remaining_days: 258,
        subjects: [
          { id: 'roadmap-sub-dsa', name: 'DSA', is_weak: false, weight: 1 },
          { id: 'roadmap-sub-os', name: 'OS', is_weak: true, weight: 1.5 },
          { id: 'roadmap-sub-dbms', name: 'DBMS', is_weak: false, weight: 1 },
          { id: 'roadmap-sub-cn', name: 'CN', is_weak: true, weight: 1.5 }
        ],
        phases: [
          { id: 'phase-learning-demo', name: 'Learning', start_day: 1, end_day: 116, goal: 'Build core concepts subject by subject.', progress: 0 },
          { id: 'phase-practice-demo', name: 'Practice', start_day: 117, end_day: 193, goal: 'Solve PYQs and topic practice.', progress: 0 },
          { id: 'phase-revision-demo', name: 'Revision', start_day: 194, end_day: 232, goal: 'Run revision cycles and patch weak areas.', progress: 0 },
          { id: 'phase-mocks-demo', name: 'Mock Tests', start_day: 233, end_day: 258, goal: 'Attempt mocks and analyze mistakes.', progress: 0 }
        ],
        weekly_targets: [],
        created_at: now,
        updated_at: now
      },
      {
        id: 'roadmap-neet-demo',
        exam_name: 'NEET',
        exam_date: '2027-05-02',
        hours_per_day: 6,
        remaining_days: 334,
        subjects: [
          { id: 'roadmap-sub-bio', name: 'Biology', is_weak: false, weight: 1 },
          { id: 'roadmap-sub-physics', name: 'Physics', is_weak: true, weight: 1.5 },
          { id: 'roadmap-sub-chemistry', name: 'Chemistry', is_weak: false, weight: 1 }
        ],
        phases: [],
        weekly_targets: [],
        created_at: now,
        updated_at: now
      },
      {
        id: 'roadmap-jee-demo',
        exam_name: 'JEE',
        exam_date: '2027-01-24',
        hours_per_day: 6,
        remaining_days: 236,
        subjects: [
          { id: 'roadmap-sub-maths', name: 'Maths', is_weak: true, weight: 1.5 },
          { id: 'roadmap-sub-physics-jee', name: 'Physics', is_weak: false, weight: 1 },
          { id: 'roadmap-sub-chemistry-jee', name: 'Chemistry', is_weak: false, weight: 1 }
        ],
        phases: [],
        weekly_targets: [],
        created_at: now,
        updated_at: now
      }
    ];
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify(demoRoadmaps));
  }
};

if (isBrowser) {
  seedDemoData();
}

// Local storage accessors
const getLocalData = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

const setLocalData = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Streak calculator logic
export const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(sessions.map(s => s.created_at.split('T')[0]))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const hasStudiedRecently = uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr;
  if (!hasStudiedRecently) return 0;

  let currentStreak = 0;
  let checkDate = new Date(uniqueDates[0]);

  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (uniqueDates.includes(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
};

// Aggregates recalculations
export const calculateDashboardStats = async (): Promise<UserStats> => {
  const user = getLocalData<UserStats>(KEYS.STATS, {
    name: 'Kasven',
    email: 'kasven@prepflow.io',
    streak: 0,
    total_study_hours: 0,
    tasks_completed: 0,
    syllabus_completion: 58
  });

  const sessions = getLocalData<StudySession[]>(KEYS.STUDY_SESSIONS, []);
  const tasks = getLocalData<Task[]>(KEYS.TASKS, []);

  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
  const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));
  const tasksDone = tasks.filter(t => t.status === 'done').length;
  const streak = calculateStreak(sessions);

  const updated = {
    ...user,
    streak,
    total_study_hours: totalHours,
    tasks_completed: tasksDone,
    syllabus_completion: 58
  };
  setLocalData(KEYS.STATS, updated);

  return updated;
};

export const dbService = {
  // --- STATS ---
  async getStats(): Promise<UserStats> {
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase!.auth.getUser();
      if (user) {
        const { data, error } = await supabase!
          .from('users')
          .select('name, email')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          const sessions = await this.getStudySessions();
          const tasks = await this.getTasks();

          const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
          const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));
          const tasksDone = tasks.filter(t => t.status === 'done').length;
          const streak = calculateStreak(sessions);

          return {
            name: data.name,
            email: data.email,
            streak,
            total_study_hours: totalHours,
            tasks_completed: tasksDone,
            syllabus_completion: 58
          };
        }
      }
    }
    return calculateDashboardStats();
  },

  async updateStats(stats: Partial<UserStats>): Promise<UserStats> {
    const current = getLocalData<UserStats>(KEYS.STATS, {
      name: 'Kasven',
      email: 'kasven@prepflow.io',
      streak: 7,
      total_study_hours: 42.5,
      tasks_completed: 18,
      syllabus_completion: 58
    });
    const updated = { ...current, ...stats };
    setLocalData(KEYS.STATS, updated);
    return updated;
  },

  // --- SUBJECTS ---
  async getSubjects(): Promise<Subject[]> {
    return getLocalData<Subject[]>(KEYS.SUBJECTS, []);
  },

  async addSubject(name: string, difficulty: number, is_weak: boolean = false, color: string = '#1E1E1E'): Promise<Subject> {
    const newSub: Subject = {
      id: 'sub-' + Math.random().toString(36).substr(2, 9),
      name,
      difficulty,
      is_weak,
      color
    };
    const current = await this.getSubjects();
    const updated = [...current, newSub];
    setLocalData(KEYS.SUBJECTS, updated);
    return newSub;
  },

  // --- TASKS ---
  async getTasks(): Promise<Task[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('tasks').select('*');
      if (!error && data) return data;
    }
    return getLocalData<Task[]>(KEYS.TASKS, []);
  },

  async addTask(title: string, subject_id: string | null = null, priority: 'low' | 'medium' | 'high' = 'medium', notes: string = '', due_date?: string | null): Promise<Task> {
    const newTask: Task = {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      title,
      subject_id,
      status: 'pending',
      priority,
      notes,
      due_date: due_date || null,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase!.auth.getUser();
      if (user) {
        const { data, error } = await supabase!
          .from('tasks')
          .insert({ title, subject_id, status: 'pending', priority, notes, due_date: due_date || null, user_id: user.id })
          .select()
          .single();
        if (!error && data) return data;
      }
    }

    const current = await this.getTasks();
    const updated = [newTask, ...current];
    setLocalData(KEYS.TASKS, updated);
    await calculateDashboardStats();
    return newTask;
  },

  async updateTask(id: string, fields: Partial<Task>): Promise<Task> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('tasks')
        .update(fields)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const current = await this.getTasks();
    let updatedTask: Task | null = null;
    const updated = current.map(t => {
      if (t.id === id) {
        updatedTask = { ...t, ...fields };
        if (fields.status === 'done' && !t.completed_at) {
          updatedTask.completed_at = new Date().toISOString();
        }
        return updatedTask;
      }
      return t;
    });

    if (updatedTask) {
      setLocalData(KEYS.TASKS, updated);
      await calculateDashboardStats();
      return updatedTask;
    }
    throw new Error('Task not found');
  },

  async deleteTask(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase!.from('tasks').delete().eq('id', id);
    }
    const current = await this.getTasks();
    const updated = current.filter(t => t.id !== id);
    setLocalData(KEYS.TASKS, updated);
    await calculateDashboardStats();
  },

  // --- STUDY SESSIONS ---
  async getStudySessions(): Promise<StudySession[]> {
    return getLocalData<StudySession[]>(KEYS.STUDY_SESSIONS, []);
  },

  async logStudySession(subjectId: string | null, durationSeconds: number): Promise<StudySession> {
    const newSession: StudySession = {
      id: 'ses-' + Math.random().toString(36).substr(2, 9),
      subject_id: subjectId,
      duration_seconds: durationSeconds,
      created_at: new Date().toISOString()
    };

    const current = await this.getStudySessions();
    const updated = [newSession, ...current];
    setLocalData(KEYS.STUDY_SESSIONS, updated);

    await calculateDashboardStats();
    return newSession;
  },

  // --- DAILY SCHEDULES ---
  async getSchedules(): Promise<DailySchedule[]> {
    return getLocalData<DailySchedule[]>(KEYS.SCHEDULES, []);
  },

  async getTodaySchedule(): Promise<DailySchedule | null> {
    const today = new Date().toISOString().split('T')[0];
    const schedules = await this.getSchedules();
    return schedules.find(schedule => schedule.date === today) || schedules[0] || null;
  },

  async saveSchedule(schedule: DailySchedule): Promise<DailySchedule> {
    const current = await this.getSchedules();
    const now = new Date().toISOString();
    const savedSchedule = {
      ...schedule,
      updated_at: now,
      created_at: schedule.created_at || now
    };
    const exists = current.some(item => item.id === savedSchedule.id);
    const updated = exists
      ? current.map(item => item.id === savedSchedule.id ? savedSchedule : item)
      : [savedSchedule, ...current];

    setLocalData(KEYS.SCHEDULES, updated);
    return savedSchedule;
  },

  async deleteSchedule(id: string): Promise<void> {
    const current = await this.getSchedules();
    setLocalData(KEYS.SCHEDULES, current.filter(schedule => schedule.id !== id));
  },

  // --- EXAM ROADMAPS ---
  async getRoadmaps(): Promise<ExamRoadmap[]> {
    return getLocalData<ExamRoadmap[]>(KEYS.ROADMAP, []);
  },

  async getCurrentRoadmap(): Promise<ExamRoadmap | null> {
    const roadmaps = await this.getRoadmaps();
    return roadmaps[0] || null;
  },

  async saveRoadmap(roadmap: ExamRoadmap): Promise<ExamRoadmap> {
    const current = await this.getRoadmaps();
    const now = new Date().toISOString();
    const savedRoadmap = {
      ...roadmap,
      updated_at: now,
      created_at: roadmap.created_at || now
    };
    const exists = current.some(item => item.id === savedRoadmap.id);
    const updated = exists
      ? current.map(item => item.id === savedRoadmap.id ? savedRoadmap : item)
      : [savedRoadmap, ...current];

    setLocalData(KEYS.ROADMAP, updated);
    return savedRoadmap;
  },

  async deleteRoadmap(id: string): Promise<void> {
    const current = await this.getRoadmaps();
    setLocalData(KEYS.ROADMAP, current.filter(roadmap => roadmap.id !== id));
  }
};
