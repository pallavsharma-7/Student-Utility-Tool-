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

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  duration: number;
  type: 'study' | 'break';
}

export interface Schedule {
  id: string;
  date: string;
  available_hours: number;
  timeline: ScheduleItem[];
}

export interface WeeklyGoal {
  week: number;
  title: string;
  goals: string[];
}

export interface DailyTarget {
  id: string;
  date: string;
  title: string;
  completed: boolean;
}

export interface Roadmap {
  id: string;
  exam_name: string;
  exam_date: string;
  hours_per_day: number;
  subjects: string[];
  weak_subjects: string[];
  weekly_goals: WeeklyGoal[];
  daily_targets: DailyTarget[];
}

export interface Lecture {
  id: string;
  title: string;
  playlist_url: string;
  thumbnail: string;
  lecture_count: number;
  completed_count: number;
  channel?: string;
}

export interface Revision {
  id: string;
  title: string;
  subject_id: string | null;
  scheduled_date: string;
  stage: 1 | 2 | 3;
  is_completed: boolean;
}

export interface StudySession {
  id: string;
  subject_id: string | null;
  duration_seconds: number;
  created_at: string;
}

export interface UserStats {
  name: string;
  email: string;
  streak: number;
  total_study_hours: number;
  tasks_completed: number;
  syllabus_completion: number;
}

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Mathematics', difficulty: 8, is_weak: false, color: '#F5C518' },
  { id: 'sub-2', name: 'Operating Systems', difficulty: 9, is_weak: true, color: '#E03E3E' },
  { id: 'sub-3', name: 'DBMS', difficulty: 6, is_weak: false, color: '#1E1E1E' },
  { id: 'sub-4', name: 'Computer Networks', difficulty: 5, is_weak: true, color: '#8A8A86' },
  { id: 'sub-5', name: 'DSA', difficulty: 7, is_weak: false, color: '#4F46E5' }
];

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Solve Calculus PYQ Set 3', subject_id: 'sub-1', status: 'pending', priority: 'high', created_at: new Date().toISOString() },
  { id: 'task-2', title: 'Revise Binary Trees Traversals', subject_id: 'sub-5', status: 'done', priority: 'medium', created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
  { id: 'task-3', title: 'Finish Lecture 18 on OS Semaphores', subject_id: 'sub-2', status: 'in_progress', priority: 'high', created_at: new Date().toISOString() },
  { id: 'task-4', title: 'Review ISO-OSI Layer 3 and 4 functions', subject_id: 'sub-4', status: 'pending', priority: 'medium', created_at: new Date().toISOString() },
  { id: 'task-5', title: 'Write SQL Queries practicing Joins & GroupBy', subject_id: 'sub-3', status: 'done', priority: 'high', created_at: new Date().toISOString(), completed_at: new Date().toISOString() }
];

export const MOCK_TIMELINE: ScheduleItem[] = [
  { id: 't-1', time: '08:00 - 10:00', subject: 'Mathematics', duration: 2, type: 'study' },
  { id: 't-2', time: '10:00 - 11:30', subject: 'Operating Systems', duration: 1.5, type: 'study' },
  { id: 't-3', time: '11:30 - 12:30', subject: 'Rest Break', duration: 1, type: 'break' },
  { id: 't-4', time: '12:30 - 14:00', subject: 'DBMS', duration: 1.5, type: 'study' },
  { id: 't-5', time: '14:00 - 15:00', subject: 'Computer Networks', duration: 1, type: 'study' }
];

export const MOCK_SCHEDULE: Schedule = {
  id: 'sch-1',
  date: new Date().toISOString().split('T')[0],
  available_hours: 6,
  timeline: MOCK_TIMELINE
};

export const MOCK_ROADMAP: Roadmap = {
  id: 'rdmp-1',
  exam_name: 'GATE 2027',
  exam_date: '2027-02-15',
  hours_per_day: 5,
  subjects: ['Mathematics', 'Operating Systems', 'DBMS', 'Computer Networks', 'DSA'],
  weak_subjects: ['Operating Systems', 'Computer Networks'],
  weekly_goals: [
    { week: 1, title: 'Week 1: Fundamentals', goals: ['DSA Basics (Arrays, Lists)', 'OS Processes & Threads'] },
    { week: 2, title: 'Week 2: core Structures', goals: ['DBMS SQL Queries', 'CN OSI Layers & Physical Layer'] },
    { week: 3, title: 'Week 3: Advanced Core', goals: ['Trees & Graphs', 'OS CPU Scheduling'] },
    { week: 4, title: 'Week 4: Application Layer & Memory', goals: ['OS Virtual Memory', 'CN TCP/UDP Protocols'] }
  ],
  daily_targets: [
    { id: 'dt-1', date: new Date().toISOString().split('T')[0], title: 'Study DSA Array operations', completed: false },
    { id: 'dt-2', date: new Date().toISOString().split('T')[0], title: 'Watch OS process states video', completed: true },
    { id: 'dt-3', date: new Date().toISOString().split('T')[0], title: 'Revise SQL basic select syntax', completed: true }
  ]
};

export const MOCK_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    title: 'OS by Gate Smashers',
    playlist_url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
    thumbnail: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80',
    lecture_count: 75,
    completed_count: 42,
    channel: 'Gate Smashers'
  },
  {
    id: 'lec-2',
    title: 'DSA Complete Placement Course',
    playlist_url: 'https://www.youtube.com/playlist?list=PLgUwDviBHe0oF5ZASeMcZCDgndfVyLqIP',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80',
    lecture_count: 120,
    completed_count: 32,
    channel: 'take U forward'
  },
  {
    id: 'lec-3',
    title: 'DBMS for GATE',
    playlist_url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGGTA0nUXHsjSVlaCxEapsN',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    lecture_count: 45,
    completed_count: 26,
    channel: 'Gate Smashers'
  }
];

export const MOCK_REVISIONS: Revision[] = [
  { id: 'rev-1', title: 'Revision of Binary Tree Traversals', subject_id: 'sub-5', scheduled_date: new Date().toISOString().split('T')[0], stage: 1, is_completed: false },
  { id: 'rev-2', title: 'SQL Joins review session', subject_id: 'sub-3', scheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], stage: 2, is_completed: false },
  { id: 'rev-3', title: 'CPU Scheduling Algorithms recap', subject_id: 'sub-2', scheduled_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], stage: 3, is_completed: false }
];

export const MOCK_STUDY_SESSIONS: StudySession[] = [
  { id: 'ses-1', subject_id: 'sub-1', duration_seconds: 7200, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'ses-2', subject_id: 'sub-2', duration_seconds: 5400, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'ses-3', subject_id: 'sub-5', duration_seconds: 10800, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'ses-4', subject_id: 'sub-3', duration_seconds: 3600, created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'ses-5', subject_id: 'sub-2', duration_seconds: 9000, created_at: new Date().toISOString() }
];

export const MOCK_STATS: UserStats = {
  name: 'Kasven',
  email: 'kasven@prepflow.io',
  streak: 7,
  total_study_hours: 42.5,
  tasks_completed: 18,
  syllabus_completion: 58
};
