import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
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
  Legend
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
  { id: '1', title: '人工成本率(成本/营收)', value: '15.2', suffix: '%', trend: 'down' as const, trendValue: '0.5%' },
  { id: '2', title: '人工成本/产值', value: '12.8', suffix: '%', trend: 'down' as const, trendValue: '0.3%' },
  { id: '3', title: '各BU人工成本占比', value: '42.5', suffix: '%', trend: 'up' as const, trendValue: '1.2%' },
  { id: '4', title: '人工成本同比', value: '5.6', suffix: '%', trend: 'up' as const, trendValue: '2.1%' },
  { id: '5', title: '人均成本', value: '18.5', suffix: '万元/人', trend: 'up' as const, trendValue: '3.2%' },
];

const trendData = [
  { month: '24.04', laborCost: 1150, totalCost: 4800, perCapitaGrowth: 2.1 },
  { month: '24.05', laborCost: 1180, totalCost: 4950, perCapitaGrowth: 2.3 },
  { month: '24.06', laborCost: 1250, totalCost: 5200, perCapitaGrowth: 2.5 },
  { month: '24.07', laborCost: 1300, totalCost: 5400, perCapitaGrowth: 2.2 },
  { month: '24.08', laborCost: 1280, totalCost: 5350, perCapitaGrowth: 2.0 },
  { month: '24.09', laborCost: 1220, totalCost: 5100, perCapitaGrowth: 1.8 },
  { month: '24.10', laborCost: 1260, totalCost: 5250, perCapitaGrowth: 1.9 },
  { month: '24.11', laborCost: 1320, totalCost: 5500, perCapitaGrowth: 2.1 },
  { month: '24.12', laborCost: 1450, totalCost: 6000, perCapitaGrowth: 2.8 },
  { month: '25.01', laborCost: 1500, totalCost: 6200, perCapitaGrowth: 3.0 },
  { month: '25.02', laborCost: 1100, totalCost: 4600, perCapitaGrowth: 1.5 },
  { month: '25.03', laborCost: 1200, totalCost: 5000, perCapitaGrowth: 2.0 },
];

const buData = [
  { name: '研发中心', ratio: 35.0, cost: 4200, perCapita: 35.5 },
  { name: '销售部', ratio: 25.0, cost: 3000, perCapita: 28.0 },
  { name: '生产一部', ratio: 20.0, cost: 2400, perCapita: 15.0 },
  { name: '供应链部', ratio: 12.0, cost: 1440, perCapita: 18.5 },
  { name: '质量部', ratio: 8.0, cost: 960, perCapita: 20.0 },
];

// Tooltips
const SingleAxisTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">
              {entry.value} {entry.name.includes('率') || entry.name.includes('占比') ? '%' : (entry.name.includes('人均') ? '万元/人' : '万元')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RatioTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[3] }} />
            <span className="text-slate-600">占比:</span>
            <span className="font-medium text-slate-800">{data.ratio}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm opacity-0" />
            <span className="text-slate-600">金额:</span>
            <span className="font-medium text-slate-800">{data.cost} 万元</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function CostRatioPage() {
  return (
    <PageContainer title="人力成本占比分析">
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

      {/* Row 2: Labor Cost Trend & Total Cost Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="人力成本趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '人工成本 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 40 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="laborCost" name="人工成本" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="总成本趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '总成本 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="totalCost" name="总成本" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Row 3: Per Capita Growth & Cost Ratio by BU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="人均人力成本增长率" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '增长率 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="perCapitaGrowth" name="增长率" stroke={CHART_COLORS[1]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="人力成本占比" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '占比 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<RatioTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="ratio" name="占比" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Row 4: Per Capita Cost by BU */}
      <div className="mb-6">
        <ChartPanel title="人均人力成本分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '人均人力成本 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 60 }} />
                <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="perCapita" name="人均人力成本" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
