import React, { useMemo, useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';

const CHART_COLORS = ['#1A93FC', '#66CD7F', '#FF9D32', '#9F8EFF', '#FF6F73'];

const metrics = [
  { id: '1', title: '人工成本率(成本/营收)', value: '15.2', suffix: '%', trend: 'down' as const, trendValue: '0.5%' },
  { id: '2', title: '人工成本/产值', value: '12.8', suffix: '%', trend: 'down' as const, trendValue: '0.3%' },
  { id: '3', title: '人力成本占比', value: '42.5', suffix: '%', trend: 'up' as const, trendValue: '1.2%' },
  { id: '4', title: '人均人力成本增长率', value: '5.6', suffix: '%', trend: 'up' as const, trendValue: '2.1%' },
  { id: '5', title: '人均人力成本', value: '18.5', suffix: '万元/人', trend: 'up' as const, trendValue: '3.2%' },
];

const baseTrendData = [
  { date: '2024-04-01', period: '24.04', laborCost: 1150, totalCost: 4800, perCapitaCost: 17.1 },
  { date: '2024-05-01', period: '24.05', laborCost: 1180, totalCost: 4950, perCapitaCost: 17.4 },
  { date: '2024-06-01', period: '24.06', laborCost: 1250, totalCost: 5200, perCapitaCost: 18.0 },
  { date: '2024-07-01', period: '24.07', laborCost: 1300, totalCost: 5400, perCapitaCost: 18.4 },
  { date: '2024-08-01', period: '24.08', laborCost: 1280, totalCost: 5350, perCapitaCost: 18.1 },
  { date: '2024-09-01', period: '24.09', laborCost: 1220, totalCost: 5100, perCapitaCost: 17.6 },
  { date: '2024-10-01', period: '24.10', laborCost: 1260, totalCost: 5250, perCapitaCost: 17.9 },
  { date: '2024-11-01', period: '24.11', laborCost: 1320, totalCost: 5500, perCapitaCost: 18.5 },
  { date: '2024-12-01', period: '24.12', laborCost: 1450, totalCost: 6000, perCapitaCost: 19.3 },
  { date: '2025-01-01', period: '25.01', laborCost: 1500, totalCost: 6200, perCapitaCost: 19.8 },
  { date: '2025-02-01', period: '25.02', laborCost: 1100, totalCost: 4600, perCapitaCost: 16.7 },
  { date: '2025-03-01', period: '25.03', laborCost: 1200, totalCost: 5000, perCapitaCost: 17.5 },
];

const baseOptions = ['全部基地', '临淄基地', '青州基地', '张店基地', '越南基地', '印尼基地'];
const deptOptions = ['全部部门', '研发中心', '生产系统', '营销中心', '职能支持'];
const jobOptions = ['全部职务', '工程师', '班长', '主管', '经理', '总监'];
const levelOptions = ['全部职级', 'P1', 'P2', 'P3', 'P4', 'P5'];
const sequenceOptions = ['全部序列', 'P序列', 'M序列', 'S序列', 'T序列'];

const CombinedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const unitMap: Record<string, string> = {
    laborCost: '万元',
    totalCost: '万元',
    perCapitaCost: '万元/人',
    perCapitaGrowth: '%',
    laborRatio: '%',
  };

  return (
    <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
      <p className="font-medium text-slate-800 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-medium text-slate-800">
            {entry.value}
            {unitMap[entry.dataKey] ? ` ${unitMap[entry.dataKey]}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export function CostRatioPage() {
  const [base, setBase] = useState('全部基地');
  const [dept, setDept] = useState('全部部门');
  const [job, setJob] = useState('全部职务');
  const [level, setLevel] = useState('全部职级');
  const [sequence, setSequence] = useState('全部序列');
  const [startDate, setStartDate] = useState('2024-04-01');
  const [endDate, setEndDate] = useState('2025-03-31');

  const combinedData = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const validRange = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;

    const filtered = validRange
      ? baseTrendData.filter((item) => {
          const current = new Date(`${item.date}T00:00:00`);
          return current >= start && current <= end;
        })
      : baseTrendData;

    const source = filtered.length > 0 ? filtered : baseTrendData;

    const baseFactorMap: Record<string, number> = {
      '全部基地': 1,
      '临淄基地': 1.14,
      '青州基地': 0.98,
      '张店基地': 0.9,
      '越南基地': 0.83,
      '印尼基地': 0.78,
    };
    const deptFactorMap: Record<string, number> = {
      '全部部门': 1,
      '研发中心': 0.92,
      '生产系统': 1.15,
      '营销中心': 1.06,
      '职能支持': 0.86,
    };
    const jobFactorMap: Record<string, number> = {
      '全部职务': 1,
      '工程师': 0.96,
      '班长': 1.05,
      '主管': 1.08,
      '经理': 1.12,
      '总监': 1.18,
    };
    const levelFactorMap: Record<string, number> = {
      '全部职级': 1,
      'P1': 0.86,
      'P2': 0.92,
      'P3': 1.0,
      'P4': 1.09,
      'P5': 1.2,
    };
    const sequenceFactorMap: Record<string, number> = {
      '全部序列': 1,
      'P序列': 1.03,
      'M序列': 1.08,
      'S序列': 0.92,
      'T序列': 0.95,
    };

    const factor =
      (baseFactorMap[base] ?? 1) *
      (deptFactorMap[dept] ?? 1) *
      (jobFactorMap[job] ?? 1) *
      (levelFactorMap[level] ?? 1) *
      (sequenceFactorMap[sequence] ?? 1);

    const transformed = source.map((item, idx) => {
      const wave = 1 + Math.sin((idx + 1) * 0.8) * 0.04;
      const laborCost = Math.max(1, Math.round(item.laborCost * factor * wave));
      const totalCost = Math.max(1, Math.round(item.totalCost * factor * wave * 1.02));
      const perCapitaCost = Number((item.perCapitaCost * (0.92 + factor * 0.08) * wave).toFixed(1));
      const laborRatio = Number(((laborCost / totalCost) * 100).toFixed(1));
      return {
        period: item.period,
        laborCost,
        perCapitaCost,
        totalCost,
        laborRatio,
      };
    });

    return transformed.map((item, idx) => {
      const prev = transformed[idx - 1]?.perCapitaCost;
      const perCapitaGrowth = idx === 0 || !prev ? 0 : Number((((item.perCapitaCost - prev) / prev) * 100).toFixed(1));
      return { ...item, perCapitaGrowth };
    });
  }, [base, dept, job, level, sequence, startDate, endDate]);

  return (
    <PageContainer title="人力成本占比分析">
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
        <ChartPanel title="人力成本组合趋势图" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <select value={base} onChange={(e) => setBase(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {baseOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {deptOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={job} onChange={(e) => setJob(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {jobOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {levelOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={sequence} onChange={(e) => setSequence(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {sequenceOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="period" {...axisProps} />
                <YAxis
                  yAxisId="cost"
                  {...axisProps}
                  label={{ value: '成本 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <YAxis
                  yAxisId="ratio"
                  orientation="right"
                  {...axisProps}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: '占比/增长率 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                />
                <YAxis yAxisId="perCapita" hide />
                <RechartsTooltip content={<CombinedTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="cost" dataKey="laborCost" name="人力成本" fill={CHART_COLORS[0]} barSize={14} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="perCapita" dataKey="perCapitaCost" name="人均人力成本" fill={CHART_COLORS[1]} barSize={14} radius={[3, 3, 0, 0]} />
                <Bar yAxisId="cost" dataKey="totalCost" name="总成本" fill={CHART_COLORS[2]} barSize={14} radius={[3, 3, 0, 0]} />
                <Line yAxisId="ratio" type="monotone" dataKey="perCapitaGrowth" name="人均人力成本增长率" stroke={CHART_COLORS[3]} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="ratio" type="monotone" dataKey="laborRatio" name="人力成本占比" stroke={CHART_COLORS[4]} strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}

