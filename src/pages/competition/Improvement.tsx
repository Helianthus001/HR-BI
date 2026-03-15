import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: '改善项目数量', 
    value: '456', 
    suffix: '个', 
    trend: 'up' as const, 
    trendValue: '42个' 
  },
  { 
    id: '2', 
    title: '改善完成率', 
    value: '94.5', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '1.2%' 
  },
  { 
    id: '3', 
    title: '节省成本金额', 
    value: '1,250', 
    suffix: '万元', 
    trend: 'up' as const, 
    trendValue: '180万元' 
  },
  { 
    id: '4', 
    title: '改善参与率', 
    value: '68.2', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '5.4%' 
  },
  { 
    id: '5', 
    title: '改善贡献BU', 
    value: '智能制造部', 
    suffix: '', 
    trend: 'up' as const, 
    trendValue: '蝉联榜首' 
  },
];

export function CompetitionImprovementPage() {
  return (
    <PageContainer title="自主改善达成赛马表">
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
