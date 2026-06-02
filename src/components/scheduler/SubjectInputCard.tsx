'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

export interface EditableSchedulerSubject {
  id: string;
  name: string;
  difficulty: number;
  isWeak: boolean;
}

interface SubjectInputCardProps {
  subject: EditableSchedulerSubject;
  canRemove: boolean;
  onChange: (subject: EditableSchedulerSubject) => void;
  onRemove: () => void;
}

export const SubjectInputCard: React.FC<SubjectInputCardProps> = ({ subject, canRemove, onChange, onRemove }) => {
  return (
    <div className="bg-white border border-[#EBE6DD] rounded-[22px] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <input
            type="text"
            value={subject.name}
            onChange={(event) => onChange({ ...subject, name: event.target.value })}
            placeholder="Subject name"
            className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-sm font-bold text-[#121212] outline-none focus:border-[#1E1E1E]"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider">Difficulty</label>
              <span className="text-xs font-extrabold text-[#121212]">{subject.difficulty}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={subject.difficulty}
              onChange={(event) => onChange({ ...subject, difficulty: Number(event.target.value) })}
              className="w-full accent-[#1E1E1E]"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E]">
            <input
              type="checkbox"
              checked={subject.isWeak}
              onChange={(event) => onChange({ ...subject, isWeak: event.target.checked })}
              className="w-4 h-4 accent-[#F5C518]"
            />
            Weak subject boost
          </label>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="p-2 rounded-xl border border-[#EBE6DD] text-[#8A8A86] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#8A8A86] transition"
          title="Remove subject"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
