import React, { useState } from 'react';
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

  const toggleSeries = (dataKey: string) => {
    setHiddenKeys(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const activeData = salaryStructureData.filter(item => !hiddenKeys[item.name]);

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
                    const originalIndex = salaryStructureData.findIndex(d => d.name === entry.name);
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
                    payload: salaryStructureData.map((item, index) => ({
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
