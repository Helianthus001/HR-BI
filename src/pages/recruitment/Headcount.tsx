import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';

// Custom Colors
const CHART_COLORS = [
  '#1A93FC', // Blue
  '#66CD7F', // Green
  '#FF9D32', // Orange
  '#9F8EFF', // Purple
  '#FF6F73', // Red
];

// Mock Data
const metrics = [
  { id: '1', title: '关键岗位编制数', value: '500', suffix: '人', trend: 'up' as const, trendValue: '2.5%' },
  { id: '2', title: '关键岗位在岗人数', value: '420', suffix: '人', trend: 'up' as const, trendValue: '3.1%' },
  { id: '3', title: '关键岗位缺口人数', value: '80', suffix: '人', trend: 'down' as const, trendValue: '5.0%' },
  { id: '4', title: '关键岗位缺口率', value: '16.0', suffix: '%', trend: 'down' as const, trendValue: '1.2%' },
  { id: '5', title: '关键岗位招聘周期', value: '52', suffix: '天', trend: 'down' as const, trendValue: '2天' },
];

const deptData = [
  { name: '研发中心', quota: 150, actual: 120, gap: 30, gapRate: 20.0 },
  { name: '生产一部', quota: 100, actual: 90, gap: 10, gapRate: 10.0 },
  { name: '销售部', quota: 120, actual: 100, gap: 20, gapRate: 16.7 },
  { name: '供应链部', quota: 80, actual: 70, gap: 10, gapRate: 12.5 },
  { name: '质量部', quota: 50, actual: 40, gap: 10, gapRate: 20.0 },
];

const trendData = [
  { month: '2025.04', gap: 120, gapRate: 24.0 },
  { month: '2025.05', gap: 115, gapRate: 23.0 },
  { month: '2025.06', gap: 105, gapRate: 21.0 },
  { month: '2025.07', gap: 110, gapRate: 22.0 },
  { month: '2025.08', gap: 95, gapRate: 19.0 },
  { month: '2025.09', gap: 85, gapRate: 17.0 },
  { month: '2025.10', gap: 90, gapRate: 18.0 },
  { month: '2025.11', gap: 80, gapRate: 16.0 },
];

// Tooltips
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">
              {entry.value} {entry.name.includes('率') ? '%' : '人'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RecruitmentHeadcountPage() {
  return (
    <PageContainer title="关键岗位编制分析">
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

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="各部门关键岗位缺口情况" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={deptData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis yAxisId="left" {...axisProps} label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <YAxis yAxisId="right" orientation="right" {...axisProps} label={{ value: '缺口率 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="quota" name="编制数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="left" dataKey="actual" name="在岗人数" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} barSize={24} />
                <Line yAxisId="right" type="monotone" dataKey="gapRate" name="缺口率" stroke={CHART_COLORS[4]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="关键岗位缺口趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis yAxisId="left" {...axisProps} label={{ value: '缺口人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <YAxis yAxisId="right" orientation="right" {...axisProps} label={{ value: '缺口率 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="gap" name="缺口人数" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="gapRate" name="缺口率" stroke={CHART_COLORS[4]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
