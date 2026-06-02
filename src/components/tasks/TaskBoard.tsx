'use client';

import React, { useState } from 'react';
import { useApp } from '../../app/providers';
import { TaskColumn } from './TaskColumn';
import { AddTaskModal } from './AddTaskModal';
import { Task } from '../../lib/db';
import { Plus, ListTodo, CheckCircle2, Percent, Sparkles, AlertCircle } from 'lucide-react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

export const TaskBoard: React.FC = () => {
  const { tasks, updateTask } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Set up pointer sensor with distance activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const nextStatus = over.id as 'pending' | 'in_progress' | 'done';

    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask && currentTask.status !== nextStatus) {
      updateTask(taskId, { status: nextStatus });
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasksCount = tasks.filter(t => 
    t.status !== 'done' && 
    t.due_date && 
    t.due_date < todayStr
  ).length;

  // Filter tasks for columns
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. KANBAN HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#121212] flex items-center gap-2">
            Kanban Study Board
            <Sparkles className="w-5 h-5 text-[#F5C518] animate-pulse" />
          </h3>
          <p className="text-xs text-[#8A8A86] font-semibold uppercase tracking-wider mt-0.5">
            Manage preparation phases and checkpoint status
          </p>
        </div>
        <button
          onClick={handleCreateTask}
          className="bg-[#1E1E1E] hover:bg-[#1E1E1E]/95 text-white px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#F5C518]" /> Add New Task
        </button>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#EBE6DD] rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] text-[#1E1E1E] border border-[#EBE6DD]/60">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider">Total Tasks</p>
            <h4 className="text-xl font-extrabold text-[#121212] mt-0.5">{totalTasks}</h4>
          </div>
        </div>

        <div className="bg-white border border-[#EBE6DD] rounded-[22px] p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider">Completed Tasks</p>
            <h4 className="text-xl font-extrabold text-[#121212] mt-0.5">{completedTasks}</h4>
          </div>
        </div>

        <div className={`border rounded-[22px] p-5 shadow-sm flex items-center gap-4 transition-all duration-300 ${
          overdueTasksCount > 0 
            ? 'bg-rose-50 border-rose-200 text-rose-900 animate-pulse' 
            : 'bg-white border-[#EBE6DD] text-[#121212]'
        }`}>
          <div className={`p-3 rounded-2xl border ${
            overdueTasksCount > 0 
              ? 'bg-rose-100 text-rose-600 border-rose-200' 
              : 'bg-[#FAF8F5] text-[#8A8A86] border-[#EBE6DD]/60'
          }`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${overdueTasksCount > 0 ? 'text-rose-600' : 'text-[#8A8A86]'}`}>Overdue Tasks</p>
            <h4 className="text-xl font-extrabold mt-0.5">{overdueTasksCount}</h4>
          </div>
        </div>

        <div className="bg-white border border-[#EBE6DD] rounded-[22px] p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Percent className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] text-[#8A8A86] font-bold uppercase tracking-wider">Completion Rate</span>
            </div>
            <span className="text-xs font-extrabold text-[#121212]">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#EBE6DD]/40 overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#1E1E1E] transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }} 
            />
          </div>
        </div>
      </div>

      {/* 3. KANBAN GRID WITH DND-KIT */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          <TaskColumn
            title="Pending"
            status="pending"
            tasks={pendingTasks}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            title="In Progress"
            status="in_progress"
            tasks={inProgressTasks}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            title="Completed"
            status="done"
            tasks={doneTasks}
            onEditTask={handleEditTask}
          />
        </div>
      </DndContext>

      {/* 4. TASK FORM MODAL */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
