'use client';

import React, { useEffect } from 'react';
import { useApp } from '../providers';
import { AppShell } from '../../components/layout/AppShell';
import { TaskBoard } from '../../components/tasks/TaskBoard';

export default function TasksPage() {
  const { setActiveView } = useApp();

  useEffect(() => {
    setActiveView('tasks');
  }, [setActiveView]);

  return (
    <AppShell>
      <TaskBoard />
    </AppShell>
  );
}
