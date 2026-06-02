-- PrepFlow Database Schema (Supabase PostgreSQL DDL)
-- You can copy and paste this into the Supabase SQL Editor to initialize your database tables.

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    streak INTEGER DEFAULT 1 NOT NULL,
    last_active DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual read" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual insert" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10) DEFAULT 5 NOT NULL,
    is_weak BOOLEAN DEFAULT FALSE NOT NULL,
    color TEXT DEFAULT '#1E1E1E' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.subjects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.subjects FOR DELETE USING (auth.uid() = user_id);

-- 3. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'done')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- 4. SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    available_hours NUMERIC DEFAULT 6 NOT NULL,
    timeline JSONB NOT NULL, -- Array of items: { time: "08:00 - 10:00", subject: "Maths", duration: 2, type: "study" | "break" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.schedules FOR DELETE USING (auth.uid() = user_id);

-- 5. ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    hours_per_day NUMERIC DEFAULT 5 NOT NULL,
    weekly_goals JSONB NOT NULL, -- Array of weeks: { week: 1, title: "Week 1: Foundations", goals: ["DSA Basics", "OS Processes"] }
    daily_targets JSONB NOT NULL, -- Array of daily checkbox items: { id: "d1", date: "2026-06-03", title: "Study DSA Arrays", completed: false }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.roadmaps FOR DELETE USING (auth.uid() = user_id);

-- 6. LECTURES TABLE
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    playlist_url TEXT NOT NULL,
    title TEXT NOT NULL,
    thumbnail TEXT,
    lecture_count INTEGER DEFAULT 1 NOT NULL,
    completed_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.lectures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.lectures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.lectures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.lectures FOR DELETE USING (auth.uid() = user_id);

-- 7. REVISIONS TABLE
CREATE TABLE IF NOT EXISTS public.revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    stage INTEGER CHECK (stage IN (1, 2, 3)) DEFAULT 1 NOT NULL, -- Stage 1 (Tomorrow), Stage 2 (7 Days), Stage 3 (30 Days)
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.revisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.revisions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.revisions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.revisions FOR DELETE USING (auth.uid() = user_id);

-- 8. STUDY_SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user insert" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user update" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user delete" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);
