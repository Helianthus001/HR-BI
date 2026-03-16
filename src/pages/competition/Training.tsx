import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';

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

const reportData = [
  { bu: '研发中心', planned: 28, finished: 27, coverage: 96.4, satisfaction: 4.9, roi: 3.9, rank: 1 },
  { bu: '生产系统', planned: 36, finished: 34, coverage: 94.2, satisfaction: 4.8, roi: 3.6, rank: 2 },
  { bu: '营销中心', planned: 22, finished: 21, coverage: 93.7, satisfaction: 4.7, roi: 3.4, rank: 3 },
  { bu: '供应链中心', planned: 18, finished: 16, coverage: 90.8, satisfaction: 4.6, roi: 3.1, rank: 4 },
  { bu: '职能支持', planned: 14, finished: 12, coverage: 88.5, satisfaction: 4.5, roi: 2.8, rank: 5 },
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

      <div className="mb-6">
        <ChartPanel title="培训赛马报表" className="hover:shadow-md transition-shadow duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">BU</th>
                  <th className="px-4 py-3 font-medium text-right">计划场次</th>
                  <th className="px-4 py-3 font-medium text-right">完成场次</th>
                  <th className="px-4 py-3 font-medium text-right">覆盖率</th>
                  <th className="px-4 py-3 font-medium text-right">满意度</th>
                  <th className="px-4 py-3 font-medium text-right">投入产出比</th>
                  <th className="px-4 py-3 font-medium text-right">排名</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row) => (
                  <tr key={row.bu} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.bu}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.planned}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.finished}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.coverage}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.satisfaction}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.roi}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">Top {row.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
