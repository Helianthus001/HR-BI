import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';

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

const reportData = [
  { bu: '新能源事业部', target: 42, onboard: 39, rate: 92.9, cycle: 34, rank: 1 },
  { bu: '智能制造部', target: 36, onboard: 31, rate: 86.1, cycle: 38, rank: 2 },
  { bu: '海外业务部', target: 28, onboard: 23, rate: 82.1, cycle: 41, rank: 3 },
  { bu: '医疗装备部', target: 30, onboard: 24, rate: 80.0, cycle: 45, rank: 4 },
  { bu: '职能支持中心', target: 18, onboard: 13, rate: 72.2, cycle: 49, rank: 5 },
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

      <div className="mb-6">
        <ChartPanel title="招聘赛马报表" className="hover:shadow-md transition-shadow duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">BU</th>
                  <th className="px-4 py-3 font-medium text-right">需求目标</th>
                  <th className="px-4 py-3 font-medium text-right">入职人数</th>
                  <th className="px-4 py-3 font-medium text-right">达成率</th>
                  <th className="px-4 py-3 font-medium text-right">平均周期(天)</th>
                  <th className="px-4 py-3 font-medium text-right">排名</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row) => (
                  <tr key={row.bu} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.bu}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.target}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.onboard}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.rate}%</td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.cycle}</td>
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
