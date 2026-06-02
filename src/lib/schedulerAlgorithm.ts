import { DailySchedule, ScheduleBlock, ScheduleSubject } from './db';

export interface SchedulerSubjectInput {
  id?: string;
  name: string;
  difficulty: number;
  isWeak?: boolean;
}

export interface SchedulerInput {
  title?: string;
  subjects: SchedulerSubjectInput[];
  availableHours: number;
  startTime?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatClock = (totalMinutes: number) => {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};

const makeBlock = (
  type: ScheduleBlock['type'],
  title: string,
  start: number,
  duration: number,
  index: number,
  subjectId?: string
): ScheduleBlock => ({
  id: `block-${Date.now()}-${index}`,
  type,
  subject_id: subjectId,
  title,
  start_time: formatClock(start),
  end_time: formatClock(start + duration),
  duration_minutes: duration
});

export const generateSchedule = (input: SchedulerInput): DailySchedule => {
  const cleanedSubjects = input.subjects
    .map((subject, index) => ({
      id: subject.id || `schedule-sub-${Date.now()}-${index}`,
      name: subject.name.trim(),
      difficulty: clamp(Math.round(subject.difficulty), 1, 10),
      is_weak: Boolean(subject.isWeak),
      allocated_minutes: 0
    }))
    .filter(subject => subject.name.length > 0);

  if (cleanedSubjects.length === 0) {
    throw new Error('Add at least one subject to generate a schedule.');
  }

  const availableMinutes = Math.max(60, Math.round(input.availableHours * 60));
  const minAllocation = availableMinutes >= cleanedSubjects.length * 30 ? 30 : 15;
  const baseMinutes = minAllocation * cleanedSubjects.length;
  const distributableMinutes = Math.max(0, availableMinutes - baseMinutes);

  const weighted = cleanedSubjects.map(subject => {
    const normalizedDifficulty = subject.difficulty / 10;
    const weakMultiplier = subject.is_weak ? 1.5 : 1;
    return {
      subject,
      weight: Math.max(0.1, normalizedDifficulty * weakMultiplier)
    };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let allocatedTotal = 0;
  const subjects: ScheduleSubject[] = weighted.map(({ subject, weight }) => {
    const weightedMinutes = Math.round((weight / totalWeight) * distributableMinutes);
    const allocated = minAllocation + weightedMinutes;
    allocatedTotal += allocated;
    return { ...subject, allocated_minutes: allocated };
  });

  let drift = availableMinutes - allocatedTotal;
  const sortedByNeed = [...subjects].sort((a, b) => {
    const aScore = a.difficulty * (a.is_weak ? 1.5 : 1);
    const bScore = b.difficulty * (b.is_weak ? 1.5 : 1);
    return bScore - aScore;
  });

  let driftIndex = 0;
  while (drift !== 0 && sortedByNeed.length > 0) {
    const target = sortedByNeed[driftIndex % sortedByNeed.length];
    const delta = drift > 0 ? Math.min(5, drift) : Math.max(-5, drift);
    if (target.allocated_minutes + delta >= minAllocation) {
      target.allocated_minutes += delta;
      drift -= delta;
    } else {
      driftIndex++;
    }
    driftIndex++;
  }

  const blocks: ScheduleBlock[] = [];
  let cursor = toMinutes(input.startTime || '08:00');
  let studyRun = 0;
  let blockIndex = 0;
  let lunchAdded = false;

  for (let subjectIndex = 0; subjectIndex < sortedByNeed.length; subjectIndex++) {
    const subject = sortedByNeed[subjectIndex];
    let remaining = subject.allocated_minutes;

    while (remaining > 0) {
      const sessionLength = clamp(remaining, Math.min(45, remaining), Math.min(120, remaining));
      blocks.push(makeBlock('study', subject.name, cursor, sessionLength, blockIndex, subject.id));
      blockIndex++;
      cursor += sessionLength;
      remaining -= sessionLength;
      studyRun += sessionLength;

      const isMoreStudyComing = remaining > 0 || subjectIndex < sortedByNeed.length - 1;
      const crossedLunchWindow = cursor >= toMinutes('12:00') && cursor <= toMinutes('14:30');
      if (!lunchAdded && crossedLunchWindow && isMoreStudyComing) {
        blocks.push(makeBlock('lunch', 'Lunch', cursor, 45, blockIndex));
        blockIndex++;
        cursor += 45;
        studyRun = 0;
        lunchAdded = true;
      } else if (studyRun >= 120 && isMoreStudyComing) {
        blocks.push(makeBlock('break', 'Break', cursor, 15, blockIndex));
        blockIndex++;
        cursor += 15;
        studyRun = 0;
      }
    }
  }

  const now = new Date().toISOString();
  return {
    id: `schedule-${Date.now()}`,
    title: input.title?.trim() || 'Smart Daily Schedule',
    date: new Date().toISOString().split('T')[0],
    available_minutes: availableMinutes,
    start_time: input.startTime || '08:00',
    subjects,
    blocks,
    created_at: now,
    updated_at: now
  };
};

export const minutesToHoursLabel = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
