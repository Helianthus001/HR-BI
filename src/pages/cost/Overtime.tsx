import React, { useMemo, useState } from 'react';
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
  Legend,
  ComposedChart
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
  { id: '1', title: '加班费总额', value: '850.5', suffix: '万元', trend: 'up' as const, trendValue: '4.2%' },
  { id: '2', title: '人均加班费', value: '1,250', suffix: '元/人', trend: 'up' as const, trendValue: '3.5%' },
  { id: '3', title: '加班率', value: '45.2', suffix: '%', trend: 'down' as const, trendValue: '1.2%' },
  { id: '4', title: '加班费占人工成本比', value: '8.5', suffix: '%', trend: 'up' as const, trendValue: '0.5%' },
  { id: '5', title: '加班最多基地', value: '临淄基地', suffix: '', trend: 'up' as const, trendValue: '持续3个月' },
];

const trendData = [
  { month: '24.04', totalCost: 65, perCapitaCost: 1100, totalHours: 32000, perCapitaHours: 35, headcount: 910, ratio: 7.5 },
  { month: '24.05', totalCost: 70, perCapitaCost: 1150, totalHours: 34000, perCapitaHours: 36, headcount: 930, ratio: 7.8 },
  { month: '24.06', totalCost: 85, perCapitaCost: 1300, totalHours: 42000, perCapitaHours: 42, headcount: 980, ratio: 8.5 },
  { month: '24.07', totalCost: 95, perCapitaCost: 1400, totalHours: 48000, perCapitaHours: 46, headcount: 1020, ratio: 9.2 },
  { month: '24.08', totalCost: 90, perCapitaCost: 1350, totalHours: 45000, perCapitaHours: 44, headcount: 1000, ratio: 8.9 },
  { month: '24.09', totalCost: 75, perCapitaCost: 1200, totalHours: 36000, perCapitaHours: 38, headcount: 950, ratio: 8.0 },
  { month: '24.10', totalCost: 80, perCapitaCost: 1250, totalHours: 38000, perCapitaHours: 40, headcount: 960, ratio: 8.2 },
  { month: '24.11', totalCost: 85, perCapitaCost: 1300, totalHours: 41000, perCapitaHours: 41, headcount: 980, ratio: 8.4 },
  { month: '24.12', totalCost: 100, perCapitaCost: 1500, totalHours: 49000, perCapitaHours: 48, headcount: 1050, ratio: 9.5 },
  { month: '25.01', totalCost: 110, perCapitaCost: 1600, totalHours: 52000, perCapitaHours: 50, headcount: 1080, ratio: 10.2 },
  { month: '25.02', totalCost: 60, perCapitaCost: 1050, totalHours: 28000, perCapitaHours: 32, headcount: 880, ratio: 7.0 },
  { month: '25.03', totalCost: 72, perCapitaCost: 1180, totalHours: 35000, perCapitaHours: 37, headcount: 920, ratio: 7.9 },
];

const baseDistributionData = [
  { name: '临淄基地', workday: 120, weekend: 180, holiday: 80, dayShift: 150, nightShift: 230 },
  { name: '青州基地', workday: 90, weekend: 140, holiday: 60, dayShift: 110, nightShift: 180 },
  { name: '张店基地', workday: 70, weekend: 110, holiday: 40, dayShift: 90, nightShift: 130 },
  { name: '越南基地', workday: 50, weekend: 80, holiday: 20, dayShift: 60, nightShift: 90 },
  { name: '印尼基地', workday: 40, weekend: 60, holiday: 15, dayShift: 45, nightShift: 70 },
];

const baseOptions = ['全部基地', '临淄基地', '青州基地', '张店基地', '越南基地', '印尼基地'];
const deptOptions = ['全部部门', '生产一部', '生产二部', '设备运维', '质量管理', '供应链'];
const genderOptions = ['全部性别', '男', '女'];
const levelOptions = ['全部职级', '一线', '班组长', '主管', '经理'];
const jobOptions = ['全部职务', '操作工', '质检员', '设备工程师', '班长', '仓储专员'];
const dimensionOptions = [
  { key: 'base', label: '基地', categories: ['临淄基地', '青州基地', '张店基地', '越南基地', '印尼基地'] },
  { key: 'dept', label: '部门', categories: ['生产一部', '生产二部', '设备运维', '质量管理', '供应链'] },
  { key: 'gender', label: '性别', categories: ['男', '女'] },
  { key: 'level', label: '职级', categories: ['一线', '班组长', '主管', '经理'] },
  { key: 'job', label: '职务', categories: ['操作工', '质检员', '设备工程师', '班长', '仓储专员'] },
] as const;

type TrendFilterState = {
  base: string;
  dept: string;
  gender: string;
  level: string;
  job: string;
  startDate: string;
  endDate: string;
};

type DistributionFilterState = {
  dimension: (typeof dimensionOptions)[number]['key'];
  startDate: string;
  endDate: string;
};

// Tooltips
const DualAxisTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">
              {entry.value} {entry.name.includes('总额') ? '万元' : (entry.name.includes('人均加班费') ? '元/人' : (entry.name.includes('工时') ? '小时' : ''))}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
              {entry.value} {entry.name.includes('占比') || entry.name.includes('比例') ? '%' : (entry.name.includes('人数') ? '人' : '万元')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StackedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">
              {entry.value} 万元 ({((entry.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
          <span className="text-slate-600 font-medium">总计:</span>
          <span className="font-bold text-slate-800">{total} 万元</span>
        </div>
      </div>
    );
  }
  return null;
};

export function CostOvertimePage() {
  const [hiddenKeys1, setHiddenKeys1] = useState<Record<string, boolean>>({});
  const [hiddenKeys2, setHiddenKeys2] = useState<Record<string, boolean>>({});
  const [costTrendFilter, setCostTrendFilter] = useState<TrendFilterState>({
    base: '全部基地',
    dept: '全部部门',
    gender: '全部性别',
    level: '全部职级',
    job: '全部职务',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
  });
  const [hoursTrendFilter, setHoursTrendFilter] = useState<TrendFilterState>({
    base: '全部基地',
    dept: '全部部门',
    gender: '全部性别',
    level: '全部职级',
    job: '全部职务',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
  });
  const [headcountTrendFilter, setHeadcountTrendFilter] = useState<TrendFilterState>({
    base: '全部基地',
    dept: '全部部门',
    gender: '全部性别',
    level: '全部职级',
    job: '全部职务',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
  });
  const [ratioTrendFilter, setRatioTrendFilter] = useState<TrendFilterState>({
    base: '全部基地',
    dept: '全部部门',
    gender: '全部性别',
    level: '全部职级',
    job: '全部职务',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
  });
  const [dayTypeFilter, setDayTypeFilter] = useState<DistributionFilterState>({
    dimension: 'base',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
  });
  const [shiftFilter, setShiftFilter] = useState<DistributionFilterState>({
    dimension: 'base',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
  });

  const toggleSeries1 = (dataKey: string) => {
    setHiddenKeys1(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const toggleSeries2 = (dataKey: string) => {
    setHiddenKeys2(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const generateTrendDataByFilter = (filter: TrendFilterState, seedTag: string) => {
    const parseMonthLabel = (monthLabel: string) => {
      const [yy, mm] = monthLabel.split('.');
      return new Date(`20${yy}-${mm}-01T00:00:00`);
    };

    const safeStart = new Date(`${filter.startDate}T00:00:00`);
    const safeEnd = new Date(`${filter.endDate}T00:00:00`);
    const isDateRangeValid = !Number.isNaN(safeStart.getTime()) && !Number.isNaN(safeEnd.getTime());

    const baseScaleMap: Record<string, number> = {
      '全部基地': 1,
      '临淄基地': 1.15,
      '青州基地': 0.98,
      '张店基地': 0.9,
      '越南基地': 0.82,
      '印尼基地': 0.76,
    };
    const deptScaleMap: Record<string, number> = {
      '全部部门': 1,
      '生产一部': 1.12,
      '生产二部': 1.04,
      '设备运维': 0.93,
      '质量管理': 0.88,
      '供应链': 0.9,
    };
    const genderScaleMap: Record<string, number> = {
      '全部性别': 1,
      '男': 1.03,
      '女': 0.97,
    };
    const levelScaleMap: Record<string, number> = {
      '全部职级': 1,
      '一线': 1.12,
      '班组长': 0.98,
      '主管': 0.91,
      '经理': 0.84,
    };
    const jobScaleMap: Record<string, number> = {
      '全部职务': 1,
      '操作工': 1.1,
      '质检员': 0.94,
      '设备工程师': 0.9,
      '班长': 0.88,
      '仓储专员': 0.86,
    };

    const seed = Array.from(`${seedTag}|${filter.base}|${filter.dept}|${filter.gender}|${filter.level}|${filter.job}`)
      .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
    const dimScale =
      (baseScaleMap[filter.base] ?? 1) *
      (deptScaleMap[filter.dept] ?? 1) *
      (genderScaleMap[filter.gender] ?? 1) *
      (levelScaleMap[filter.level] ?? 1) *
      (jobScaleMap[filter.job] ?? 1);

    const rangeDays = isDateRangeValid
      ? Math.max(1, Math.floor((safeEnd.getTime() - safeStart.getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 365;
    const timeScale = Math.max(0.5, Math.min(1.4, rangeDays / 365));

    const filteredBase = trendData.filter((item) => {
      if (!isDateRangeValid) return true;
      const current = parseMonthLabel(item.month);
      return current >= safeStart && current <= safeEnd;
    });
    const source = filteredBase.length ? filteredBase : trendData;

    return source.map((item, index) => {
      const noise = 1 + Math.sin((seed % 47) * 0.04 + index * 0.8) * 0.03;
      const scale = dimScale * (0.96 + index * 0.006) * noise * timeScale;
      return {
        ...item,
        totalCost: Math.max(1, Math.round(item.totalCost * scale)),
        perCapitaCost: Math.max(1, Math.round(item.perCapitaCost * scale)),
        totalHours: Math.max(1, Math.round(item.totalHours * scale)),
        perCapitaHours: Math.max(1, Math.round(item.perCapitaHours * scale)),
        headcount: Math.max(1, Math.round(item.headcount * scale)),
        ratio: Number((item.ratio * Math.max(0.85, Math.min(1.25, scale))).toFixed(1)),
      };
    });
  };

  const costTrendData = useMemo(() => generateTrendDataByFilter(costTrendFilter, 'cost'), [costTrendFilter]);
  const hoursTrendData = useMemo(() => generateTrendDataByFilter(hoursTrendFilter, 'hours'), [hoursTrendFilter]);
  const headcountTrendData = useMemo(() => generateTrendDataByFilter(headcountTrendFilter, 'headcount'), [headcountTrendFilter]);
  const ratioTrendData = useMemo(() => generateTrendDataByFilter(ratioTrendFilter, 'ratio'), [ratioTrendFilter]);

  const generateDistributionData = (filter: DistributionFilterState, seedTag: string) => {
    const selectedDimension = dimensionOptions.find((item) => item.key === filter.dimension) ?? dimensionOptions[0];
    const categories = selectedDimension.categories;
    const safeStart = new Date(`${filter.startDate}T00:00:00`);
    const safeEnd = new Date(`${filter.endDate}T00:00:00`);
    const isRangeValid = !Number.isNaN(safeStart.getTime()) && !Number.isNaN(safeEnd.getTime()) && safeStart <= safeEnd;
    const rangeDays = !isRangeValid
      ? 30
      : Math.max(1, Math.floor((safeEnd.getTime() - safeStart.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    const timeScale = Math.max(0.6, Math.min(2.2, rangeDays / 31));
    const seedText = [seedTag, filter.dimension, filter.startDate, filter.endDate].join('|');
    const seed = Array.from(seedText).reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);

    return categories.map((category, index) => {
      const categoryWave = 1 + Math.sin((seed % 41) * 0.06 + (index + 1) * 0.9) * 0.08;
      const baseAmount = (130 - index * 16 + (seed % 11)) * timeScale * categoryWave;

      return {
        category,
        workday: Math.max(8, Math.round(baseAmount * 0.34)),
        weekend: Math.max(10, Math.round(baseAmount * 0.46)),
        holiday: Math.max(5, Math.round(baseAmount * 0.2)),
        dayShift: Math.max(12, Math.round(baseAmount * 0.42)),
        nightShift: Math.max(14, Math.round(baseAmount * 0.58)),
      };
    });
  };

  const dayTypeDistributionData = useMemo(() => generateDistributionData(dayTypeFilter, 'day-type'), [dayTypeFilter]);
  const shiftDistributionData = useMemo(() => generateDistributionData(shiftFilter, 'shift'), [shiftFilter]);

  const renderDistributionFilters = (
    filter: DistributionFilterState,
    setFilter: React.Dispatch<React.SetStateAction<DistributionFilterState>>
  ) => (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filter.dimension}
        onChange={(e) => setFilter((prev) => ({ ...prev, dimension: e.target.value as (typeof dimensionOptions)[number]['key'] }))}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      >
        {dimensionOptions.map((item) => (
          <option key={item.key} value={item.key}>{item.label}</option>
        ))}
      </select>
      <input
        type="date"
        value={filter.startDate}
        onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e.target.value }))}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      />
      <span className="text-slate-400 text-xs">-</span>
      <input
        type="date"
        value={filter.endDate}
        onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value }))}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );

  const renderTrendFilters = (
    filter: TrendFilterState,
    setFilter: React.Dispatch<React.SetStateAction<TrendFilterState>>
  ) => (
    <div className="flex flex-wrap items-center gap-2">
      <select value={filter.base} onChange={(e) => setFilter((prev) => ({ ...prev, base: e.target.value }))} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
        {baseOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={filter.dept} onChange={(e) => setFilter((prev) => ({ ...prev, dept: e.target.value }))} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
        {deptOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={filter.gender} onChange={(e) => setFilter((prev) => ({ ...prev, gender: e.target.value }))} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
        {genderOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={filter.level} onChange={(e) => setFilter((prev) => ({ ...prev, level: e.target.value }))} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
        {levelOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={filter.job} onChange={(e) => setFilter((prev) => ({ ...prev, job: e.target.value }))} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
        {jobOptions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <input
        type="date"
        value={filter.startDate}
        onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e.target.value }))}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      />
      <span className="text-slate-400 text-xs">-</span>
      <input
        type="date"
        value={filter.endDate}
        onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value }))}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <PageContainer title="生产系统加班费分析">
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

      {/* Row 2: Overtime Cost Trend & Overtime Hours Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="加班费趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderTrendFilters(costTrendFilter, setCostTrendFilter)}
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={costTrendData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis yAxisId="left" {...axisProps} label={{ value: '人均加班费 (元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <YAxis yAxisId="right" orientation="right" {...axisProps} label={{ value: '加班费总额 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -30 }} />
                <Tooltip content={<DualAxisTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                  onClick={(e) => toggleSeries1(e.value)}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="perCapitaCost" 
                  name="人均加班费" 
                  stroke={CHART_COLORS[0]} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  hide={hiddenKeys1['人均加班费']}
                />
                <Bar
                  yAxisId="right" 
                  dataKey="totalCost" 
                  name="加班费总额" 
                  fill={CHART_COLORS[2]}
                  fillOpacity={0.28}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                  hide={hiddenKeys1['加班费总额']}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="加班时长趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderTrendFilters(hoursTrendFilter, setHoursTrendFilter)}
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hoursTrendData} margin={{ top: 30, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis yAxisId="left" {...axisProps} label={{ value: '人均加班工时 (小时)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <YAxis yAxisId="right" orientation="right" {...axisProps} label={{ value: '加班总工时 (小时)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -30 }} />
                <Tooltip content={<DualAxisTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                  onClick={(e) => toggleSeries2(e.value)}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="perCapitaHours" 
                  name="人均加班工时" 
                  stroke={CHART_COLORS[1]} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  hide={hiddenKeys2['人均加班工时']}
                />
                <Bar
                  yAxisId="right" 
                  dataKey="totalHours" 
                  name="加班总工时" 
                  fill={CHART_COLORS[3]}
                  fillOpacity={0.28}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                  hide={hiddenKeys2['加班总工时']}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Row 3: Overtime Headcount Trend & Overtime Cost Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="加班人数趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderTrendFilters(headcountTrendFilter, setHeadcountTrendFilter)}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={headcountTrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '加班人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="headcount" name="加班人数" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="加班费占人工成本比例" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderTrendFilters(ratioTrendFilter, setRatioTrendFilter)}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratioTrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '占比 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<SingleAxisTooltip />} />
                <Line type="monotone" dataKey="ratio" name="占比" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Row 4: Overtime Cost by Day Type & Overtime Cost by Shift */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartPanel title="工作日/休息日/法定节假日加班费分布" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderDistributionFilters(dayTypeFilter, setDayTypeFilter)}
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayTypeDistributionData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '加班费金额 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 40 }} />
                <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="workday" name="工作日" fill={CHART_COLORS[0]} barSize={18} radius={[4, 4, 0, 0]} />
                <Bar dataKey="weekend" name="休息日" fill={CHART_COLORS[1]} barSize={18} radius={[4, 4, 0, 0]} />
                <Bar dataKey="holiday" name="法定节假日" fill={CHART_COLORS[4]} barSize={18} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="白班/夜班加班费分布" className="hover:shadow-md transition-shadow duration-200">
          <div className="mb-4">
            {renderDistributionFilters(shiftFilter, setShiftFilter)}
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftDistributionData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '加班费金额 (万元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 40 }} />
                <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="dayShift" name="白班" fill={CHART_COLORS[2]} barSize={22} radius={[4, 4, 0, 0]} />
                <Bar dataKey="nightShift" name="夜班" fill={CHART_COLORS[3]} barSize={22} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>
    </PageContainer>
  );
}
