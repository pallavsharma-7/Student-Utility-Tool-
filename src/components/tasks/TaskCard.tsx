'use client';

import React from 'react';
import { useApp } from '../../app/providers';
import { Edit3, Trash2, Calendar } from 'lucide-react';
import { Task } from '../../lib/db';
import { useDraggable } from '@dnd-kit/core';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { subjects, deleteTask } = useApp();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const taskSubject = subjects.find(s => s.id === task.subject_id);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${task.title}" permanently?`)) {
      deleteTask(task.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-200';
      default: return 'bg-neutral-50 text-neutral-600 border border-neutral-200';
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
    opacity: 0.8,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-[#EBE6DD] rounded-2xl p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-[#1E1E1E]/40 transition-all duration-200 group select-none relative ${
        isDragging ? 'opacity-40 border-dashed border-2 border-[#F5C518]/60' : ''
      }`}
    >
      {/* Title row & edit triggers */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h5 className="text-xs font-bold text-[#121212] tracking-tight leading-tight flex-1">
          {task.title}
        </h5>
        
        {/* Actions panel */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEditClick}
            className="p-1 rounded bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] hover:text-[#1E1E1E] transition"
            title="Edit Task"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded bg-[#FAF8F5] border border-[#EBE6DD] text-[#8A8A86] hover:text-rose-600 transition"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Task Notes Preview */}
      {task.notes && (
        <p className="text-[10px] text-[#8A8A86] font-semibold line-clamp-2 mb-3 bg-[#FAF8F4]/60 p-2 rounded-lg border border-[#EBE6DD]/40 leading-relaxed">
          {task.notes}
        </p>
      )}

      {/* Bottom Row metadata pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EBE6DD]/40 text-[9px] font-extrabold">
        {/* Priority Badge */}
        <span className={`px-2 py-0.5 rounded-full capitalize ${getPriorityStyle()}`}>
          {task.priority}
        </span>

        {/* Subject Badge */}
        {taskSubject ? (
          <span 
            className="px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: taskSubject.color }}
          >
            {taskSubject.name}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
            General
          </span>
        )}

        {/* Due Date Badge */}
        {task.due_date && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8A8A86] border border-[#EBE6DD]">
            <Calendar className="w-2.5 h-2.5" />
            {task.due_date}
          </span>
        )}
      </div>
    </div>
  );
};
