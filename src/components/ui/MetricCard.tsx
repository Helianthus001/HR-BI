import React from 'react';
import { Card } from './Card';
import { cn } from '@/src/utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('', className)} bodyClassName="flex flex-col justify-center">
      <div className="text-sm text-slate-500 mb-2 font-medium">{title}</div>
      <div className="flex items-baseline gap-2">
        {prefix && <span className="text-slate-500 text-lg">{prefix}</span>}
        <span className="text-3xl font-semibold text-slate-800">{value}</span>
        {suffix && <span className="text-slate-500 text-base">{suffix}</span>}
      </div>
    </Card>
  );
}
