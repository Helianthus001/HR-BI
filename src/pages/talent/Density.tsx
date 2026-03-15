import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: '关键岗位人数', 
    value: '156', 
    suffix: '人', 
    trend: 'up' as const, 
    trendValue: '12人' 
  },
  { 
    id: '2', 
    title: '人才密度', 
    value: '18.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '1.2%' 
  },
  { 
    id: '3', 
    title: '关键岗位人效', 
    value: '125.0', 
    suffix: '万元/人', 
    trend: 'up' as const, 
    trendValue: '8.5%' 
  },
  { 
    id: '4', 
    title: '核心人才占比', 
    value: '8.2', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '0.5%' 
  },
  { 
    id: '5', 
    title: '关键岗位覆盖率', 
    value: '92.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '2.1%' 
  },
];

export function TalentDensityPage() {
  return (
    <PageContainer title="人才密度分析">
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
