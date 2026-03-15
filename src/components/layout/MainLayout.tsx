import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 flex flex-col min-h-0 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
