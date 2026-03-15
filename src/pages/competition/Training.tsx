import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: '人均培训时长', 
    value: '24.5', 
    suffix: '小时/人', 
    trend: 'up' as const, 
    trendValue: '2.5小时' 
  },
  { 
    id: '2', 
    title: '培训覆盖率', 
    value: '92.8', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '4.2%' 
  },
  { 
    id: '3', 
    title: '关键岗位培训完成率', 
    value: '96.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '1.8%' 
  },
  { 
    id: '4', 
    title: '培训满意度', 
    value: '4.8', 
    suffix: '分', 
    trend: 'up' as const, 
    trendValue: '0.1分' 
  },
  { 
    id: '5', 
    title: '培训投入产出比', 
    value: '3.5', 
    suffix: '倍', 
    trend: 'up' as const, 
    trendValue: '0.4倍' 
  },
];

export function CompetitionTrainingPage() {
  return (
    <PageContainer title="培训赛马表">
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
