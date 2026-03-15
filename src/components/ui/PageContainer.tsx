import React from 'react';
import { cn } from '@/src/utils/cn';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}

export function PageContainer({ title, children, extra, className }: PageContainerProps) {
  return (
    <div className={cn('flex-1 flex flex-col min-h-0 bg-slate-50', className)}>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
