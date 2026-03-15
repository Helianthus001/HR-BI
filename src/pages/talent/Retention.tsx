import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: '今年留存率', 
    value: '85.4', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '2.1%' 
  },
  { 
    id: '2', 
    title: '关键人才留存率', 
    value: '94.2', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '1.5%' 
  },
  { 
    id: '3', 
    title: '高绩效留存率', 
    value: '96.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '0.8%' 
  },
  { 
    id: '4', 
    title: '新员工90天留存率', 
    value: '78.6', 
    suffix: '%', 
    trend: 'down' as const, 
    trendValue: '3.2%' 
  },
];

export function TalentRetentionPage() {
  return (
    <PageContainer title="人员留存分析">
      {/* Row 1: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            suffix={metric.suffix}
            trend={metric.trend}
            trendValue={metric.trendValue}
            className="hover:shadow-md transition-shadow duration-200"
          />
        ))}
      </div>
    </PageContainer>
  );
}
