'use client';

import React, { useState } from 'react';
import { useApp } from '../../app/providers';
import { AuthScreen } from '../AuthScreen';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render the Login screen if user is not authenticated
  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* 1. SIDEBAR NAVIGATION */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-col bg-white">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* TOP NAVBAR HEADER */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* CONTAINER ROUTE VIEW */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
