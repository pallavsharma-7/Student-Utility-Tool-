'use client';

import React, { useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { RoadmapView } from '../../components/roadmap/RoadmapView';
import { useApp } from '../providers';

export default function RoadmapPage() {
  const { setActiveView } = useApp();

  useEffect(() => {
    setActiveView('roadmap');
  }, [setActiveView]);

  return (
    <AppShell>
      <RoadmapView />
    </AppShell>
  );
}
