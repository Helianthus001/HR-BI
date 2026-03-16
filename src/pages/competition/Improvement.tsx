import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';

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

const reportData = [
  { bu: '智能制造部', proposal: 128, completeRate: 96.1, savedCost: 420, participation: 74.3, rank: 1 },
  { bu: '新能源事业部', proposal: 112, completeRate: 95.3, savedCost: 368, participation: 71.8, rank: 2 },
  { bu: '研发中心', proposal: 86, completeRate: 93.6, savedCost: 260, participation: 66.5, rank: 3 },
  { bu: '供应链中心', proposal: 74, completeRate: 91.4, savedCost: 132, participation: 62.1, rank: 4 },
  { bu: '职能支持中心', proposal: 56, completeRate: 88.9, savedCost: 70, participation: 54.8, rank: 5 },
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

      <div className="mb-6">
        <ChartPanel title="自主改善赛马报表" className="hover:shadow-md transition-shadow duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">BU</th>
                  <th className="px-4 py-3 font-medium text-right">改善提案数</th>
                  <th className="px-4 py-3 font-medium text-right">完成率</th>
                  <th className="px-4 py-3 font-medium text-right">节省成本(万元)</th>
                  <th className="px-4 py-3 font-medium text-right">参与率</th>
                  <th className="px-4 py-3 font-medium text-right">排名</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row) => (
                  <tr key={row.bu} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.bu}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.proposal}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.completeRate}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.savedCost}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.participation}%</td>
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
