import React, { useMemo, useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

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
const metrics = [
  { id: '1', title: '人工成本总额', value: '15,000', suffix: '万元', trend: 'up' as const, trendValue: '5.2%' },
  { id: '2', title: '人均人工成本', value: '18.5', suffix: '万元/人', trend: 'up' as const, trendValue: '2.1%' },
  { id: '3', title: '薪酬增长率', value: '5.2', suffix: '%', trend: 'up' as const, trendValue: '1.5%' },
  { id: '4', title: '固定薪酬占比', value: '72.5', suffix: '%', trend: 'down' as const, trendValue: '1.2%' },
  { id: '5', title: '浮动薪酬占比', value: '27.5', suffix: '%', trend: 'up' as const, trendValue: '1.2%' },
];

const salaryStructureData = [
  { name: '固定工资', value: 8250, percent: 55 },
  { name: '绩效奖金', value: 3000, percent: 20 },
  { name: '社保公积金', value: 2250, percent: 15 },
  { name: '津贴补贴', value: 750, percent: 5 },
  { name: '加班费', value: 450, percent: 3 },
  { name: '福利', value: 300, percent: 2 },
];

const baseOptions = ['全部基地', '临淄基地', '青州基地', '张店基地', '越南基地', '印尼基地'];
const deptOptions = ['全部部门', '研发中心', '生产系统', '营销中心', '职能支持'];
const levelOptions = ['全部职级', 'P1', 'P2', 'P3', 'P4', 'P5'];
const jobOptions = ['全部职务', '工程师', '班长', '主管', '经理', '总监'];

// Tooltips
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{data.name}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
            <span className="text-slate-600">金额:</span>
            <span className="font-medium text-slate-800">{data.value} 万元</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm opacity-0" />
            <span className="text-slate-600">占比:</span>
            <span className="font-medium text-slate-800">{data.percent}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function CostSalaryPage() {
  const [hiddenKeys, setHiddenKeys] = useState<Record<string, boolean>>({});
  const [base, setBase] = useState('全部基地');
  const [dept, setDept] = useState('全部部门');
  const [level, setLevel] = useState('全部职级');
  const [job, setJob] = useState('全部职务');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-03-31');

  const toggleSeries = (dataKey: string) => {
    setHiddenKeys(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const dynamicSalaryData = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const validRange = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = validRange
      ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 90;
    const timeScale = Math.max(0.6, Math.min(1.8, rangeDays / 90));

    const baseFactorMap: Record<string, number> = {
      '全部基地': 1,
      '临淄基地': 1.12,
      '青州基地': 0.98,
      '张店基地': 0.92,
      '越南基地': 0.84,
      '印尼基地': 0.8,
    };
    const deptFactorMap: Record<string, number> = {
      '全部部门': 1,
      '研发中心': 0.9,
      '生产系统': 1.15,
      '营销中心': 1.05,
      '职能支持': 0.87,
    };
    const levelFactorMap: Record<string, number> = {
      '全部职级': 1,
      'P1': 0.86,
      'P2': 0.92,
      'P3': 1.0,
      'P4': 1.08,
      'P5': 1.18,
    };
    const jobFactorMap: Record<string, number> = {
      '全部职务': 1,
      '工程师': 0.95,
      '班长': 1.02,
      '主管': 1.07,
      '经理': 1.12,
      '总监': 1.18,
    };

    const factor =
      (baseFactorMap[base] ?? 1) *
      (deptFactorMap[dept] ?? 1) *
      (levelFactorMap[level] ?? 1) *
      (jobFactorMap[job] ?? 1) *
      timeScale;

    const seeded = Array.from(`${base}|${dept}|${level}|${job}|${startDate}|${endDate}`)
      .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);

    const raw = salaryStructureData.map((item, index) => {
      const wave = 1 + Math.sin((seeded % 37) * 0.05 + index * 0.85) * 0.06;
      return {
        ...item,
        value: Math.max(1, Math.round(item.value * factor * wave)),
      };
    });

    const total = raw.reduce((sum, item) => sum + item.value, 0);
    return raw.map((item) => ({
      ...item,
      percent: Number(((item.value / total) * 100).toFixed(1)),
    }));
  }, [base, dept, level, job, startDate, endDate]);

  const activeData = dynamicSalaryData.filter(item => !hiddenKeys[item.name]);

  return (
    <PageContainer title="薪酬分析">
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

      {/* Row 2: Salary Structure Chart */}
      <div className="mb-6">
        <ChartPanel title="薪酬构成结构" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <select value={base} onChange={(e) => setBase(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {baseOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {deptOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {levelOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={job} onChange={(e) => setJob(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
              {jobOptions.map((item) => <option key={item} value={item}>{item}</option>)}
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
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={160}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {activeData.map((entry, index) => {
                    const originalIndex = dynamicSalaryData.findIndex(d => d.name === entry.name);
                    return (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[originalIndex % CHART_COLORS.length]} />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  {...({
                    wrapperStyle: { fontSize: '12px', paddingTop: '20px' },
                    onClick: (e: any) => toggleSeries(e.value),
                    payload: dynamicSalaryData.map((item, index) => ({
                      id: item.name,
                      type: 'circle',
                      value: item.name,
                      color: hiddenKeys[item.name] ? '#cbd5e1' : CHART_COLORS[index % CHART_COLORS.length]
                    }))
                  } as any)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
