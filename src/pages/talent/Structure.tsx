import React, { useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card as ChartPanel } from '@/src/components/ui/Card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
  '#4EC0E8'  // Light Blue
];

// Mock Data - Metrics
const metrics = [
  { id: '1', title: '平均年龄', value: '34.5', suffix: '岁', trend: 'down' as const, trendValue: '0.2岁' },
  { id: '2', title: '本科及以上占比', value: '65.2', suffix: '%', trend: 'up' as const, trendValue: '1.5%' },
  { id: '3', title: '研究生占比', value: '12.5', suffix: '%', trend: 'up' as const, trendValue: '0.8%' },
  { id: '4', title: '高职级人数占比', value: '8.5', suffix: '%', trend: 'up' as const, trendValue: '0.3%' },
  { id: '5', title: '平均司龄', value: '5.2', suffix: '年', trend: 'up' as const, trendValue: '0.1年' },
];

// Mock Data - Level (职级)
const levelBarData = [
  { name: 'P1', value: 120 },
  { name: 'P2', value: 350 },
  { name: 'P3', value: 280 },
  { name: 'P4', value: 150 },
  { name: 'P5', value: 80 },
  { name: 'M1', value: 50 },
  { name: 'M2', value: 30 },
  { name: 'M3', value: 10 },
];

const levelPieData = [
  { name: 'P1-P2', value: 470 },
  { name: 'P3-P4', value: 430 },
  { name: 'P5及以上', value: 80 },
  { name: 'M级', value: 90 },
];

const trend12Months = [
  { month: '24.04', mLevel: 82, p3Plus: 480, bachelorPlus: 650, ageUnder30: 480 },
  { month: '24.05', mLevel: 83, p3Plus: 485, bachelorPlus: 655, ageUnder30: 485 },
  { month: '24.06', mLevel: 83, p3Plus: 490, bachelorPlus: 660, ageUnder30: 490 },
  { month: '24.07', mLevel: 85, p3Plus: 495, bachelorPlus: 665, ageUnder30: 495 },
  { month: '24.08', mLevel: 85, p3Plus: 500, bachelorPlus: 670, ageUnder30: 500 },
  { month: '24.09', mLevel: 86, p3Plus: 505, bachelorPlus: 675, ageUnder30: 500 },
  { month: '24.10', mLevel: 88, p3Plus: 508, bachelorPlus: 680, ageUnder30: 500 },
  { month: '24.11', mLevel: 88, p3Plus: 510, bachelorPlus: 685, ageUnder30: 500 },
  { month: '24.12', mLevel: 89, p3Plus: 510, bachelorPlus: 690, ageUnder30: 500 },
  { month: '25.01', mLevel: 90, p3Plus: 512, bachelorPlus: 695, ageUnder30: 500 },
  { month: '25.02', mLevel: 90, p3Plus: 515, bachelorPlus: 698, ageUnder30: 500 },
  { month: '25.03', mLevel: 90, p3Plus: 510, bachelorPlus: 698, ageUnder30: 500 },
];

// Mock Data - Tenure (司龄)
const tenureBarData = [
  { name: '<1年', value: 150 },
  { name: '1-3年', value: 350 },
  { name: '3-5年', value: 280 },
  { name: '5-10年', value: 200 },
  { name: '>10年', value: 90 },
];

const deptTenureData = [
  { name: '研发中心', '<1年': 40, '1-3年': 120, '3-5年': 100, '5-10年': 80, '>10年': 30 },
  { name: '销售部', '<1年': 50, '1-3年': 100, '3-5年': 60, '5-10年': 40, '>10年': 10 },
  { name: '生产一部', '<1年': 30, '1-3年': 80, '3-5年': 70, '5-10年': 50, '>10年': 30 },
  { name: '供应链部', '<1年': 20, '1-3年': 30, '3-5年': 30, '5-10年': 20, '>10年': 10 },
  { name: '质量部', '<1年': 10, '1-3年': 20, '3-5年': 20, '5-10年': 10, '>10年': 10 },
];

const baseTenureData = [
  { name: '深圳', '<1年': 60, '1-3年': 150, '3-5年': 120, '5-10年': 90, '>10年': 40 },
  { name: '广州', '<1年': 40, '1-3年': 80, '3-5年': 70, '5-10年': 50, '>10年': 20 },
  { name: '东莞', '<1年': 30, '1-3年': 70, '3-5年': 50, '5-10年': 40, '>10年': 20 },
  { name: '惠州', '<1年': 10, '1-3年': 30, '3-5年': 20, '5-10年': 10, '>10年': 5 },
  { name: '苏州', '<1年': 10, '1-3年': 20, '3-5年': 20, '5-10年': 10, '>10年': 5 },
];

// Mock Data - Education (学历)
const eduBarData = [
  { name: '博士', value: 20 },
  { name: '硕士', value: 114 },
  { name: '本科', value: 564 },
  { name: '大专', value: 250 },
  { name: '高中及以下', value: 122 },
];

const deptEduData = [
  { name: '研发中心', '博士': 15, '硕士': 80, '本科': 250, '大专': 20, '高中及以下': 5 },
  { name: '销售部', '博士': 1, '硕士': 15, '本科': 180, '大专': 50, '高中及以下': 14 },
  { name: '生产一部', '博士': 2, '硕士': 8, '本科': 80, '大专': 120, '高中及以下': 50 },
  { name: '供应链部', '博士': 1, '硕士': 6, '本科': 34, '大专': 40, '高中及以下': 29 },
  { name: '质量部', '博士': 1, '硕士': 5, '本科': 20, '大专': 20, '高中及以下': 24 },
];

const baseEduData = [
  { name: '深圳', '博士': 12, '硕士': 60, '本科': 250, '大专': 90, '高中及以下': 48 },
  { name: '广州', '博士': 4, '硕士': 30, '本科': 150, '大专': 50, '高中及以下': 26 },
  { name: '东莞', '博士': 2, '硕士': 14, '本科': 100, '大专': 60, '高中及以下': 34 },
  { name: '惠州', '博士': 1, '硕士': 6, '本科': 40, '大专': 30, '高中及以下': 8 },
  { name: '苏州', '博士': 1, '硕士': 4, '本科': 24, '大专': 20, '高中及以下': 6 },
];

// Mock Data - Age (年龄)
const ageBarData = [
  { name: '<25岁', value: 150 },
  { name: '25-30岁', value: 350 },
  { name: '31-35岁', value: 300 },
  { name: '36-40岁', value: 180 },
  { name: '>40岁', value: 90 },
];

const deptAgeData = [
  { name: '研发中心', '<25岁': 40, '25-30岁': 150, '31-35岁': 120, '36-40岁': 40, '>40岁': 20 },
  { name: '销售部', '<25岁': 60, '25-30岁': 100, '31-35岁': 60, '36-40岁': 30, '>40岁': 10 },
  { name: '生产一部', '<25岁': 30, '25-30岁': 60, '31-35岁': 80, '36-40岁': 60, '>40岁': 30 },
  { name: '供应链部', '<25岁': 10, '25-30岁': 20, '31-35岁': 30, '36-40岁': 30, '>40岁': 20 },
  { name: '质量部', '<25岁': 10, '25-30岁': 20, '31-35岁': 10, '36-40岁': 20, '>40岁': 10 },
];

const baseAgeData = [
  { name: '深圳', '<25岁': 60, '25-30岁': 160, '31-35岁': 140, '36-40岁': 70, '>40岁': 30 },
  { name: '广州', '<25岁': 40, '25-30岁': 90, '31-35岁': 80, '36-40岁': 40, '>40岁': 10 },
  { name: '东莞', '<25岁': 30, '25-30岁': 60, '31-35岁': 50, '36-40岁': 40, '>40岁': 30 },
  { name: '惠州', '<25岁': 10, '25-30岁': 20, '31-35岁': 20, '36-40岁': 20, '>40岁': 15 },
  { name: '苏州', '<25岁': 10, '25-30岁': 20, '31-35岁': 10, '36-40岁': 10, '>40岁': 5 },
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
              {entry.value} 人
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{data.name}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
          <span className="text-slate-600">人数:</span>
          <span className="font-medium text-slate-800">{data.value} 人</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TalentStructurePage() {
  const [activeTab, setActiveTab] = useState<'level' | 'tenure' | 'education' | 'age'>('level');

  const tabs = [
    { id: 'level', label: '职级' },
    { id: 'tenure', label: '司龄' },
    { id: 'education', label: '学历' },
    { id: 'age', label: '年龄' },
  ];

  return (
    <PageContainer title="人才结构分析">
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

      {/* Row 2: Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tab 1: Level */}
          {activeTab === 'level' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel title="职级人数" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelBarData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="value" name="人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="职级占比结构" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={levelPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                      >
                        {levelPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="M级人数趋势" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend12Months} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 5', 'dataMax + 5']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="mLevel" name="M级人数" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="原P3及以上人数趋势" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend12Months} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 10', 'dataMax + 10']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="p3Plus" name="P3及以上人数" stroke={CHART_COLORS[3]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>
            </div>
          )}

          {/* Tab 2: Tenure */}
          {activeTab === 'tenure' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel title="司龄结构人数" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tenureBarData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="value" name="人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <div className="hidden lg:block"></div> {/* Empty placeholder for layout balance if needed, or we can just let it flow */}

              <ChartPanel title="各部门司龄分布" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptTenureData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<1年" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="1-3年" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="3-5年" stackId="a" fill={CHART_COLORS[2]} />
                      <Bar dataKey="5-10年" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">10年" stackId="a" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="各基地司龄分布" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={baseTenureData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<1年" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="1-3年" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="3-5年" stackId="a" fill={CHART_COLORS[2]} />
                      <Bar dataKey="5-10年" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">10年" stackId="a" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>
            </div>
          )}

          {/* Tab 3: Education */}
          {activeTab === 'education' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel title="学历结构人数" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eduBarData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="value" name="人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="本科及以上人数趋势" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend12Months} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 10', 'dataMax + 10']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="bachelorPlus" name="本科及以上人数" stroke={CHART_COLORS[1]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="各部门学历分布" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptEduData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="博士" stackId="a" fill={CHART_COLORS[4]} />
                      <Bar dataKey="硕士" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey="本科" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="大专" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="高中及以下" stackId="a" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="各基地学历结构" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={baseEduData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="博士" stackId="a" fill={CHART_COLORS[4]} />
                      <Bar dataKey="硕士" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey="本科" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="大专" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="高中及以下" stackId="a" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>
            </div>
          )}

          {/* Tab 4: Age */}
          {activeTab === 'age' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartPanel title="年龄结构人数" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageBarData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="value" name="人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="年龄结构变化趋势 (<30岁人数)" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend12Months} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 10', 'dataMax + 10']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="ageUnder30" name="<30岁人数" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="各部门年龄分布" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptAgeData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<25岁" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="25-30岁" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="31-35岁" stackId="a" fill={CHART_COLORS[2]} />
                      <Bar dataKey="36-40岁" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">40岁" stackId="a" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="各基地年龄分布" className="hover:shadow-md transition-shadow duration-200">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={baseAgeData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<25岁" stackId="a" fill={CHART_COLORS[0]} />
                      <Bar dataKey="25-30岁" stackId="a" fill={CHART_COLORS[1]} />
                      <Bar dataKey="31-35岁" stackId="a" fill={CHART_COLORS[2]} />
                      <Bar dataKey="36-40岁" stackId="a" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">40岁" stackId="a" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
