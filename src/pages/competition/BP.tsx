import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';

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

const reportData = [
  { bu: '研发中心', projectCount: 14, completeRate: 95.2, efficiencyLift: 16.4, satisfaction: 4.9, rank: 1 },
  { bu: '生产系统', projectCount: 18, completeRate: 93.8, efficiencyLift: 15.1, satisfaction: 4.8, rank: 2 },
  { bu: '营销中心', projectCount: 11, completeRate: 91.6, efficiencyLift: 13.8, satisfaction: 4.7, rank: 3 },
  { bu: '供应链中心', projectCount: 9, completeRate: 89.9, efficiencyLift: 12.6, satisfaction: 4.6, rank: 4 },
  { bu: '职能支持', projectCount: 7, completeRate: 87.5, efficiencyLift: 11.2, satisfaction: 4.5, rank: 5 },
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

      <div className="mb-6">
        <ChartPanel title="BP赋能赛马报表" className="hover:shadow-md transition-shadow duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">BU</th>
                  <th className="px-4 py-3 font-medium text-right">项目数</th>
                  <th className="px-4 py-3 font-medium text-right">完成率</th>
                  <th className="px-4 py-3 font-medium text-right">效能提升</th>
                  <th className="px-4 py-3 font-medium text-right">业务满意度</th>
                  <th className="px-4 py-3 font-medium text-right">排名</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row) => (
                  <tr key={row.bu} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.bu}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.projectCount}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.completeRate}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.efficiencyLift}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.satisfaction}</td>
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
