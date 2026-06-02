import { ExamRoadmap, RoadmapDailyTarget, RoadmapPhase, RoadmapSubject, RoadmapWeeklyTarget } from './db';

export interface RoadmapInput {
  examName: string;
  examDate: string;
  hoursPerDay: number;
  subjects: string[];
  weakSubjects: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const topicForPhase = (phaseName: RoadmapPhase['name'], subjectName: string, sequence: number) => {
  const learningTopics = ['Basics', 'Core Concepts', 'Advanced Concepts', 'Formula Sheet', 'Notes Cleanup'];
  const practiceTopics = ['PYQs', 'Topic Practice', 'Timed Sets', 'Mixed Problems'];
  const revisionTopics = ['Revision Cycle', 'Error Log', 'Weak Area Patch', 'Flash Review'];
  const mockTopics = ['Mock Test', 'Mock Analysis', 'Accuracy Review', 'Speed Drill'];

  if (phaseName === 'Learning') return `${subjectName} ${learningTopics[sequence % learningTopics.length]}`;
  if (phaseName === 'Practice') return `${subjectName} ${practiceTopics[sequence % practiceTopics.length]}`;
  if (phaseName === 'Revision') return `${subjectName} ${revisionTopics[sequence % revisionTopics.length]}`;
  return `${subjectName} ${mockTopics[sequence % mockTopics.length]}`;
};

const buildPhases = (remainingDays: number): RoadmapPhase[] => {
  const phaseConfig: Array<{ name: RoadmapPhase['name']; ratio: number; goal: string }> = [
    { name: 'Learning', ratio: 0.45, goal: 'Build the complete syllabus foundation.' },
    { name: 'Practice', ratio: 0.3, goal: 'Convert concepts into exam-solving ability.' },
    { name: 'Revision', ratio: 0.15, goal: 'Run repeated revision cycles and patch weak areas.' },
    { name: 'Mock Tests', ratio: 0.1, goal: 'Simulate exam conditions and analyze mistakes.' }
  ];

  let startDay = 1;
  let allocated = 0;
  return phaseConfig.map((phase, index) => {
    const isLast = index === phaseConfig.length - 1;
    const length = isLast ? Math.max(1, remainingDays - allocated) : Math.max(1, Math.round(remainingDays * phase.ratio));
    allocated += length;
    const builtPhase: RoadmapPhase = {
      id: `phase-${phase.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      name: phase.name,
      start_day: startDay,
      end_day: Math.min(remainingDays, startDay + length - 1),
      goal: phase.goal,
      progress: 0
    };
    startDay = builtPhase.end_day + 1;
    return builtPhase;
  }).filter(phase => phase.start_day <= remainingDays);
};

const subjectQueue = (subjects: RoadmapSubject[]) => {
  const queue: RoadmapSubject[] = [];
  subjects.forEach(subject => {
    const repeats = subject.is_weak ? 3 : 2;
    for (let index = 0; index < repeats; index++) queue.push(subject);
  });
  return queue.length > 0 ? queue : subjects;
};

export const generateRoadmap = (input: RoadmapInput): ExamRoadmap => {
  const examName = input.examName.trim() || 'Exam';
  const examDate = new Date(input.examDate);
  if (Number.isNaN(examDate.getTime())) {
    throw new Error('Choose a valid exam date.');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);

  const remainingDays = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / DAY_MS));
  const weakSet = new Set(input.weakSubjects.map(subject => subject.trim().toLowerCase()).filter(Boolean));
  const subjects = input.subjects
    .map(subject => subject.trim())
    .filter(Boolean)
    .filter((subject, index, all) => all.findIndex(item => item.toLowerCase() === subject.toLowerCase()) === index)
    .map((subject, index): RoadmapSubject => {
      const isWeak = weakSet.has(subject.toLowerCase());
      return {
        id: `roadmap-sub-${Date.now()}-${index}`,
        name: subject,
        is_weak: isWeak,
        weight: isWeak ? 1.5 : 1
      };
    });

  if (subjects.length === 0) {
    throw new Error('Add at least one subject.');
  }

  const phases = buildPhases(remainingDays);
  const queue = subjectQueue(subjects);
  const dailyTargets: RoadmapDailyTarget[] = [];

  for (let day = 1; day <= remainingDays; day++) {
    const phase = phases.find(item => day >= item.start_day && day <= item.end_day) || phases[phases.length - 1];
    const subject = queue[(day - 1) % queue.length];
    const date = addDays(today, day - 1);
    const title = topicForPhase(phase.name, subject.name, day - 1);

    dailyTargets.push({
      id: `roadmap-day-${Date.now()}-${day}`,
      day,
      date: formatDate(date),
      subject: subject.name,
      title,
      hours: Math.max(1, input.hoursPerDay)
    });
  }

  const weeklyTargets: RoadmapWeeklyTarget[] = [];
  for (let startIndex = 0; startIndex < dailyTargets.length; startIndex += 7) {
    const weekDays = dailyTargets.slice(startIndex, startIndex + 7);
    const firstDay = weekDays[0];
    const lastDay = weekDays[weekDays.length - 1];
    const phase = phases.find(item => firstDay.day >= item.start_day && firstDay.day <= item.end_day) || phases[0];
    const targets = weekDays.map(day => day.title);

    weeklyTargets.push({
      id: `roadmap-week-${Date.now()}-${weeklyTargets.length + 1}`,
      week: weeklyTargets.length + 1,
      start_date: firstDay.date,
      end_date: lastDay.date,
      phase_id: phase.id,
      title: `${phase.name} Week ${weeklyTargets.length + 1}`,
      targets,
      daily_targets: weekDays
    });
  }

  const now = new Date().toISOString();
  return {
    id: `roadmap-${Date.now()}`,
    exam_name: examName,
    exam_date: formatDate(examDate),
    hours_per_day: Math.max(1, input.hoursPerDay),
    remaining_days: remainingDays,
    subjects,
    phases,
    weekly_targets: weeklyTargets,
    created_at: now,
    updated_at: now
  };
};

export const getCurrentPhase = (roadmap: ExamRoadmap | null) => {
  if (!roadmap || roadmap.phases.length === 0) return null;
  const elapsedDays = Math.max(1, roadmap.remaining_days - Math.ceil((new Date(roadmap.exam_date).getTime() - Date.now()) / DAY_MS));
  return roadmap.phases.find(phase => elapsedDays >= phase.start_day && elapsedDays <= phase.end_day) || roadmap.phases[0];
};
