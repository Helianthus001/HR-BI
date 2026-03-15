import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';

// Mock Data
const metrics = [
  { 
    id: '1', 
    title: '招聘完成率排名', 
    value: 'Top 1', 
    suffix: '', 
    trend: 'up' as const, 
    trendValue: '上升2名' 
  },
  { 
    id: '2', 
    title: '关键岗位达成率', 
    value: '95.8', 
    suffix: '%', 
    trend: 'up' as const, 
    trendValue: '4.2%' 
  },
  { 
    id: '3', 
    title: '招聘周期排名', 
    value: 'Top 3', 
    suffix: '', 
    trend: 'down' as const, 
    trendValue: '下降1名' 
  },
  { 
    id: '4', 
    title: '入职人数', 
    value: '128', 
    suffix: '人', 
    trend: 'up' as const, 
    trendValue: '15人' 
  },
  { 
    id: '5', 
    title: '招聘贡献BU', 
    value: '新能源事业部', 
    suffix: '', 
    trend: 'up' as const, 
    trendValue: '连续2月第一' 
  },
];

export function CompetitionRecruitmentPage() {
  return (
    <PageContainer title="招聘达成赛马表">
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
