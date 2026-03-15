import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationConfig } from '@/src/config/navigation';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    navigationConfig.map((item) => item.path)
  );

  const toggleGroup = (path: string) => {
    setExpandedGroups((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <div
      className={cn(
        'bg-white text-slate-800 flex flex-col transition-all duration-300 border-r border-slate-200 z-10 shrink-0',
        collapsed ? 'w-20' : 'w-56'
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-slate-200 px-4 shrink-0">
        <div className="flex items-center gap-3 w-full overflow-hidden">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0 font-bold text-lg text-white">
            HR
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg truncate tracking-wide text-slate-800">
              INTCO-HR BI
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {navigationConfig.map((group) => {
            const isExpanded = expandedGroups.includes(group.path);
            const isActiveGroup = location.pathname.startsWith(group.path);
            const Icon = group.icon;

            return (
              <div key={group.path} className="mb-2">
                <button
                  onClick={() => {
                    if (collapsed) setCollapsed(false);
                    toggleGroup(group.path);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors',
                    isActiveGroup && !isExpanded ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActiveGroup ? 'text-blue-600' : 'text-slate-400'} />
                    {!collapsed && (
                      <span className={cn('text-sm font-medium', isActiveGroup ? 'text-blue-600' : 'text-slate-700')}>
                        {group.title}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <ChevronDown
                      size={16}
                      className={cn(
                        'text-slate-400 transition-transform',
                        isExpanded ? 'rotate-180' : ''
                      )}
                    />
                  )}
                </button>

                {!collapsed && isExpanded && (
                  <div className="mt-1 space-y-1">
                    {group.children.map((child) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            'block pl-10 pr-4 py-2 text-sm rounded-md transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          )}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="h-12 border-t border-slate-200 flex items-center px-4 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}
