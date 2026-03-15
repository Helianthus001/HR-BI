import React, { useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { Card as ChartPanel } from '@/src/components/ui/Card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';

// Custom Colors
const CHART_COLORS = [
  '#1A93FC', // Blue
  '#66CD7F', // Green
  '#FF9D32', // Orange
  '#9F8EFF', // Purple
  '#FF6F73', // Red
  '#4EC0E8'  // Light Blue
];

// Mock Data
const months = ['2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'];

const trendData = months.map((month, index) => {
  const baseRevenue = 170 + index * 1.5 + (Math.random() - 0.5) * 5;
  const baseCost = 25 + (Math.random() - 0.5) * 1;
  return {
    month,
    revenue: Number(baseRevenue.toFixed(1)),
    cost: Number(baseCost.toFixed(1)),
  };
});

const deptData = [
  { name: '生产一部', revenue: 225.4 },
  { name: '研发中心', revenue: 218.6 },
  { name: '销售一部', revenue: 205.2 },
  { name: '生产二部', revenue: 195.8 },
  { name: '供应链部', revenue: 188.5 },
  { name: '销售二部', revenue: 182.4 },
  { name: '质量部', revenue: 175.6 },
  { name: '财务部', revenue: 168.2 },
  { name: '人力资源部', revenue: 162.5 },
  { name: '行政部', revenue: 155.8 },
].sort((a, b) => a.revenue - b.revenue);

const SingleAxisTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
          <span className="text-slate-600">{payload[0].name}:</span>
          <span className="font-medium text-slate-800">{payload[0].value} 万元/人</span>
        </div>
      </div>
    );
  }
  return null;
};

const deptNames = ['生产一部', '研发中心', '销售一部', '生产二部', '供应链部', '销售二部', '质量部', '财务部', '人力资源部', '行政部'];
const bubbleData = months.reduce((acc, month) => {
  acc[month] = deptNames.map((name, index) => ({
    name,
    cost: Number((15 + Math.random() * 15).toFixed(1)), // 15-30
    revenue: Number((150 + Math.random() * 100).toFixed(1)), // 150-250
    headcount: Math.floor(20 + Math.random() * 80), // 20-100
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
  return acc;
}, {} as Record<string, any[]>);

// Tooltip for Bubble Chart
const BubbleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{data.name}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-600">人均人工成本:</span>
          <span className="font-medium text-slate-800">{data.cost} 万元/人</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-600">人均产值:</span>
          <span className="font-medium text-slate-800">{data.revenue} 万元/人</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">部门人数:</span>
          <span className="font-medium text-slate-800">{data.headcount} 人</span>
        </div>
      </div>
    );
  }
  return null;
};

export function EfficiencyPerCapitaPage() {
  const [trendStart, setTrendStart] = useState(months[0]);
  const [trendEnd, setTrendEnd] = useState(months[months.length - 1]);
  const [rankMonth, setRankMonth] = useState(months[months.length - 1]);
  const [bubbleMonth, setBubbleMonth] = useState(months[months.length - 1]);

  return (
    <PageContainer title="人均产值分析">
      {/* Row 1: Combined Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel 
          title="人均产值 vs 人均人工成本" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <select 
              value={bubbleMonth}
              onChange={(e) => setBubbleMonth(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              {months.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          }
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis type="number" dataKey="cost" name="人均人工成本" unit=" 万" {...axisProps} label={{ value: '人均人工成本 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <YAxis type="number" dataKey="revenue" name="人均产值" unit=" 万" {...axisProps} label={{ value: '人均产值 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <ZAxis type="number" dataKey="headcount" name="人数" range={[50, 500]} />
                <Tooltip content={<BubbleTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {bubbleData[bubbleMonth].map((entry: any, index: number) => (
                  <Scatter key={entry.name} name={entry.name} data={[entry]} fill={entry.fill} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel 
          title="人均产值月度趋势" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex items-center gap-2">
              <select 
                value={trendStart}
                onChange={(e) => setTrendStart(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {months.map((m: string) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className="text-slate-400 text-xs">-</span>
              <select 
                value={trendEnd}
                onChange={(e) => setTrendEnd(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {months.map((m: string) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          }
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 30, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis {...axisProps} domain={['auto', 'auto']} label={{ value: '人均产值 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="revenue" name="人均产值" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Row 2: Ranking Chart */}
      <div className="mb-6">
        <ChartPanel 
          title="部门人均产值排名" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <select 
              value={rankMonth}
              onChange={(e) => setRankMonth(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              {months.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          }
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 30, right: 60, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} horizontal={false} vertical={true} />
                <XAxis type="number" {...axisProps} label={{ value: '人均产值 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 40 }} />
                <YAxis type="category" dataKey="name" {...axisProps} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="revenue" name="人均产值" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748b', fontSize: 12, formatter: (val: number) => `${val} 万` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
