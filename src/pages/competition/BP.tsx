import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: 'BP项目完成率', 
    value: '92.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '3.2%' 
  },
  { 
    id: '2', 
    title: '组织效能提升率', 
    value: '15.2', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '2.1%' 
  },
  { 
    id: '3', 
    title: '人效改善幅度', 
    value: '12.8', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '1.5%' 
  },
  { 
    id: '4', 
    title: '离职率改善幅度', 
    value: '2.5', 
    suffix: '%', 
    trend: 'down' as const, 
    trendValue: '0.5%' 
  },
  { 
    id: '5', 
    title: '业务满意度', 
    value: '4.8', 
    suffix: '分', 
    trend: 'up' as const, 
    trendValue: '0.2分' 
  },
];

export function CompetitionBPPage() {
  return (
    <PageContainer title="BP赋能达成赛马表">
      {/* Row 1: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
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
