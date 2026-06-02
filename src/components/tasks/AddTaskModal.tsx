'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../app/providers';
import { X, Sparkles } from 'lucide-react';
import { Task } from '../../lib/db';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { subjects, addTask, updateTask } = useApp();
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubjectId(taskToEdit.subject_id || '');
      setPriority(taskToEdit.priority);
      setNotes(taskToEdit.notes || '');
      setDueDate(taskToEdit.due_date || '');
    } else {
      // Reset
      setTitle('');
      setSubjectId('');
      setPriority('medium');
      setNotes('');
      setDueDate('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const subVal = subjectId === '' ? null : subjectId;
    const dueVal = dueDate === '' ? null : dueDate;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        subject_id: subVal,
        priority,
        notes: notes.trim(),
        due_date: dueVal
      });
    } else {
      addTask(title.trim(), subVal, priority, notes.trim(), dueVal);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white border border-[#EBE6DD] rounded-[28px] w-full max-w-md p-6 shadow-xl relative animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#8A8A86] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-base font-extrabold text-[#121212] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5C518]" />
            {taskToEdit ? 'Edit Study Task' : 'Add Study Task'}
          </h3>
          <p className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider mt-0.5">
            {taskToEdit ? 'Modify details' : 'Create a new study checkpoint'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-0.5">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Finish DSA Lecture 12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-semibold text-[#121212] outline-none focus:border-[#1E1E1E]"
              required
            />
          </div>

          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-0.5">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E] appearance-none"
            >
              <option value="">General Study</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-0.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-bold text-[#121212] outline-none focus:border-[#1E1E1E] appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-0.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-semibold text-[#121212] outline-none focus:border-[#1E1E1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] text-[#8A8A86] font-bold uppercase tracking-wider block mb-1.5 pl-0.5">Notes & References</label>
            <textarea
              placeholder="Write optional study notes, references or checklist sub-items..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-semibold text-[#121212] outline-none focus:border-[#1E1E1E] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl py-2.5 text-xs font-bold text-[#1E1E1E] hover:bg-[#F5F0E6] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#1E1E1E] hover:bg-[#1E1E1E]/95 text-white rounded-xl py-2.5 text-xs font-bold transition"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
