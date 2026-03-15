import React from 'react';
import { UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { navigationConfig } from '@/src/config/navigation';

export function Header() {
  const location = useLocation();
  
  // Find the current page title from navigation config
  let pageTitle = '';
  for (const group of navigationConfig) {
    const child = group.children.find(c => c.path === location.pathname);
    if (child) {
      pageTitle = child.title;
      break;
    }
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer pl-6">
          <UserCircle size={28} className="text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700">Admin User</span>
            <span className="text-xs text-slate-500">HRBP Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
