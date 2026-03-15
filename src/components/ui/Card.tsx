import React from 'react';
import { cn } from '@/src/utils/cn';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bodyClassName?: string;
}

export function Card({ className, title, extra, children, bodyClassName, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col',
        className
      )}
      {...props}
    >
      {(title || extra) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          {title && <h3 className="text-base font-medium text-slate-800">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className={cn('p-5 flex-1', bodyClassName)}>{children}</div>
    </div>
  );
}
