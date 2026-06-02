'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Task } from '../../lib/db';
import { Circle, Hourglass, CheckCircle2 } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onEditTask }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const getIcon = () => {
    switch (status) {
      case 'in_progress': return <Hourglass className="w-4 h-4 text-amber-500" />;
      case 'done': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Circle className="w-4 h-4 text-[#8A8A86]" />;
    }
  };

  const getColumnBg = () => {
    if (isOver) return 'bg-[#F5F0E6] border-[#1E1E1E]/40 scale-[1.01]';
    return 'bg-[#FAF8F4]/50 border-[#EBE6DD]';
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 border rounded-[22px] p-4 flex flex-col min-h-[450px] transition-all duration-300 ${getColumnBg()}`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EBE6DD]/60">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="text-xs font-extrabold text-[#121212] uppercase tracking-wider">{title}</h4>
        </div>
        <span className="text-[10px] bg-white border border-[#EBE6DD] text-[#8A8A86] px-2.5 py-0.5 rounded-full font-bold">
          {tasks.length}
        </span>
      </div>

      {/* Cards Scrollable Panel */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-0.5">
        {tasks.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-[#EBE6DD]/50 rounded-2xl flex items-center justify-center text-center text-[#8A8A86] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider">Drag study tasks here</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>
    </div>
  );
};
