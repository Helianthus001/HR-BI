import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';
import { Check, ChevronDown } from 'lucide-react';
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
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';
import { TreeDropdown } from '@/src/components/ui/TreeDropdown';
import { departmentTree } from '@/src/pages/org/Structure';
import { cn } from '@/src/utils/cn';

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
  { id: '1', title: '人均产值', value: '185.2', suffix: '万元/人' },
  { id: '2', title: '人均收入', value: '162.5', suffix: '万元/人' },
  { id: '3', title: '人均利润', value: '28.4', suffix: '万元/人' },
  { id: '4', title: '人效同比', value: '12.5', prefix: '+', suffix: '%' },
  { id: '5', title: 'BU人效排名第一单位', value: '临淄基地', suffix: '' },
];

// 财报营收（近五年）
const yearlyRevenueData = [
  { year: '2021', revenue: 45.2 },
  { year: '2022', revenue: 62.8 },
  { year: '2023', revenue: 88.5 },
  { year: '2024', revenue: 115.6 },
  { year: '2025', revenue: 148.2 },
];

// 最近24个月
const allMonths = [
  '2024.04', '2024.05', '2024.06', '2024.07', '2024.08', '2024.09', '2024.10', '2024.11', '2024.12',
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09',
  '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'
];

// 最近8个季度
const allQuarters = [
  '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2', '2025Q3', '2025Q4', '2026Q1'
];

// 最近5年
const allYears = ['2022', '2023', '2024', '2025', '2026'];

const DateRangeSelector = ({ start, end, onStartChange, onEndChange, options }: any) => (
  <div className="flex items-center gap-2">
    <select 
      value={start}
      onChange={(e) => onStartChange(e.target.value)}
      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((m: string) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
    <span className="text-slate-400 text-xs">-</span>
    <select 
      value={end}
      onChange={(e) => onEndChange(e.target.value)}
      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((m: string) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  </div>
);

// 各基地营业额
const bases = ['临淄基地', '青州基地', '张店基地', '越南基地', '印尼基地', '马来西亚基地'];

const generateBaseRevenueData = (timeUnit: string, start: string, end: string) => {
  let timeArray: string[] = [];
  const allOptions = timeUnit === 'month' ? allMonths : timeUnit === 'quarter' ? allQuarters : allYears;
  
  const startIndex = allOptions.indexOf(start);
  const endIndex = allOptions.indexOf(end);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
    timeArray = allOptions.slice(startIndex, endIndex + 1);
  } else {
    timeArray = allOptions.slice(-12); // Default to last 12 if invalid
  }

  return timeArray.map((time, index) => {
    const data: any = { time };
    bases.forEach((base, i) => {
      const baseVal = timeUnit === 'month' ? 5 : timeUnit === 'quarter' ? 15 : 60;
      data[base] = Number((Math.random() * (baseVal * 2) + baseVal + (5 - i) * (baseVal / 2.5)).toFixed(1));
    });
    return data;
  });
};

// Custom Tooltips
const YearlyRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}年</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
          <span className="text-slate-600">营业收入:</span>
          <span className="font-medium text-slate-800">{payload[0].value} 亿元</span>
        </div>
      </div>
    );
  }
  return null;
};

const BaseRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-slate-800">{entry.value} 亿元</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PerCapitaRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
          <span className="text-slate-600">人均营业额:</span>
          <span className="font-medium text-slate-800">{payload[0].value} 万元/人</span>
        </div>
      </div>
    );
  }
  return null;
};

const PerCapitaProfitTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color }} />
          <span className="text-slate-600">人均利润:</span>
          <span className="font-medium text-slate-800">{payload[0].value} 万元/人</span>
        </div>
      </div>
    );
  }
  return null;
};

const CombinedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-slate-800">{entry.value} 万元/人</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const generateCombinedData = (timeUnit: string, dimension: string, start: string, end: string) => {
  let timeArray: string[] = [];
  const allOptions = timeUnit === 'month' ? allMonths : timeUnit === 'quarter' ? allQuarters : allYears;
  
  const startIndex = allOptions.indexOf(start);
  const endIndex = allOptions.indexOf(end);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
    timeArray = allOptions.slice(startIndex, endIndex + 1);
  } else {
    timeArray = allOptions.slice(-12);
  }

  const seed = dimension.length + (dimension.charCodeAt(0) || 0);

  return timeArray.map((time, index) => {
    const baseRev = timeUnit === 'month' ? 15 : timeUnit === 'quarter' ? 45 : 180;
    const revVariation = Math.sin(index + seed) * (baseRev * 0.2);
    const revenue = Number((baseRev + revVariation).toFixed(1));

    const profitMargin = 0.15 + Math.cos(index + seed) * 0.05;
    const profit = Number((revenue * profitMargin).toFixed(1));

    return { time, revenue, profit };
  });
};

const baseOptions = [
  { label: '全部基地', value: 'all_base' },
  { label: '临淄基地', value: 'base_临淄' },
  { label: '青州基地', value: 'base_青州' },
  { label: '张店基地', value: 'base_张店' },
  { label: '越南基地', value: 'base_越南' },
  { label: '印尼基地', value: 'base_印尼' },
  { label: '马来西亚基地', value: 'base_马来西亚' },
];

const MultiSelect = ({ options, selected, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md hover:border-blue-500 transition-colors"
      >
        <span className="truncate text-slate-700">
          {selected.length === 0 ? placeholder : 
           selected.length === options.length ? '全部基地' : 
           `已选 ${selected.length} 个基地`}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 w-48 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div 
              className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100"
              onClick={() => {
                if (selected.length === options.length) onChange([]);
                else onChange(options.map((o: any) => o.value));
              }}
            >
              <div className={cn(
                "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
                selected.length === options.length ? "bg-blue-500 border-blue-500" : "border-slate-300"
              )}>
                {selected.length === options.length && <Check className="w-3 h-3 text-white" />}
              </div>
              全选
            </div>
            {options.map((option: any) => (
              <div
                key={option.value}
                className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                onClick={() => {
                  const newSelected = selected.includes(option.value)
                    ? selected.filter((s: any) => s !== option.value)
                    : [...selected, option.value];
                  onChange(newSelected);
                }}
              >
                <div className={cn(
                  "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
                  selected.includes(option.value) ? "bg-blue-500 border-blue-500" : "border-slate-300"
                )}>
                  {selected.includes(option.value) && <Check className="w-3 h-3 text-white" />}
                </div>
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function OrgEfficiencyPage() {
  const [timeUnit, setTimeUnit] = useState<'month' | 'quarter' | 'year'>('month');
  const [combinedTimeUnit, setCombinedTimeUnit] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedBase, setSelectedBase] = useState('all_base');
  const [selectedBasesForChart, setSelectedBasesForChart] = useState<string[]>(bases);

  // Efficiency Chart Range
  const [effStart, setEffStart] = useState('2025.04');
  const [effEnd, setEffEnd] = useState('2026.03');

  // Base Chart Range
  const [baseStart, setBaseStart] = useState('2025.04');
  const [baseEnd, setBaseEnd] = useState('2026.03');

  // Update ranges when time unit changes
  const handleEffTimeUnitChange = (unit: 'month' | 'quarter' | 'year') => {
    setCombinedTimeUnit(unit);
    if (unit === 'month') {
      setEffStart('2025.04');
      setEffEnd('2026.03');
    } else if (unit === 'quarter') {
      setEffStart('2025Q1');
      setEffEnd('2026Q1');
    } else {
      setEffStart('2022');
      setEffEnd('2026');
    }
  };

  const handleBaseTimeUnitChange = (unit: 'month' | 'quarter' | 'year') => {
    setTimeUnit(unit);
    if (unit === 'month') {
      setBaseStart('2025.04');
      setBaseEnd('2026.03');
    } else if (unit === 'quarter') {
      setBaseStart('2025Q1');
      setBaseEnd('2026Q1');
    } else {
      setBaseStart('2022');
      setBaseEnd('2026');
    }
  };

  const currentBaseRevenueData = useMemo(() => 
    generateBaseRevenueData(timeUnit, baseStart, baseEnd),
    [timeUnit, baseStart, baseEnd]
  );

  const combinedData = useMemo(() => 
    generateCombinedData(combinedTimeUnit, selectedDept + selectedBase, effStart, effEnd), 
    [combinedTimeUnit, selectedDept, selectedBase, effStart, effEnd]
  );

  return (
    <PageContainer title="组织效能分析">
      {/* Row 1: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            className="hover:shadow-md transition-shadow duration-200"
          />
        ))}
      </div>

      {/* Row 2: Two Charts in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 财报营收 */}
        <Card title="财报营收（近五年）" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyRevenueData} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis 
                  dataKey="year" 
                  {...axisProps} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  {...axisProps} 
                  tickFormatter={(val) => `${val}`}
                  label={{ value: '营业收入 (亿元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <Tooltip content={<YearlyRevenueTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar 
                  dataKey="revenue" 
                  name="营业收入" 
                  fill={CHART_COLORS[0]} 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 人均营业额与人均利润 */}
        <Card 
          title="人均营业额与人均利润" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <TreeDropdown 
                  value={selectedDept} 
                  onChange={setSelectedDept} 
                  options={departmentTree} 
                  placeholder="选择部门"
                />
                
                <select
                  value={selectedBase}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {baseOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${combinedTimeUnit === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleEffTimeUnitChange('month')}
                  >
                    月
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${combinedTimeUnit === 'quarter' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleEffTimeUnitChange('quarter')}
                  >
                    季
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${combinedTimeUnit === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleEffTimeUnitChange('year')}
                  >
                    年
                  </button>
                </div>

                <DateRangeSelector 
                  start={effStart}
                  end={effEnd}
                  onStartChange={setEffStart}
                  onEndChange={setEffEnd}
                  options={combinedTimeUnit === 'month' ? allMonths : combinedTimeUnit === 'quarter' ? allQuarters : allYears}
                />
              </div>
            </div>
          }
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis 
                  dataKey="time" 
                  {...axisProps} 
                  angle={-30} 
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  {...axisProps} 
                  label={{ value: '金额 (万元/人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }}
                />
                <Tooltip content={<CombinedTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="人均营业额" 
                  stroke={CHART_COLORS[0]} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="人均利润" 
                  stroke={CHART_COLORS[2]} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 6 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: 各基地营业额 (Full Width) */}
      <div className="mb-6">
        <Card 
          title="各基地营业额" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                <MultiSelect 
                  options={bases.map(b => ({ label: b, value: b }))}
                  selected={selectedBasesForChart}
                  onChange={setSelectedBasesForChart}
                  placeholder="选择展示基地"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${timeUnit === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleBaseTimeUnitChange('month')}
                  >
                    月
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${timeUnit === 'quarter' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleBaseTimeUnitChange('quarter')}
                  >
                    季
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${timeUnit === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleBaseTimeUnitChange('year')}
                  >
                    年
                  </button>
                </div>
                <DateRangeSelector 
                  start={baseStart}
                  end={baseEnd}
                  onStartChange={setBaseStart}
                  onEndChange={setBaseEnd}
                  options={timeUnit === 'month' ? allMonths : timeUnit === 'quarter' ? allQuarters : allYears}
                />
              </div>
            </div>
          }
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentBaseRevenueData} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis 
                  dataKey="time" 
                  {...axisProps} 
                  angle={-30} 
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  {...axisProps} 
                  tickFormatter={(val) => `${val}`}
                  label={{ value: '营业额 (亿元)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 15 }}
                />
                <Tooltip content={<BaseRevenueTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                {selectedBasesForChart.map((base, index) => (
                  <Bar 
                    key={base}
                    dataKey={base} 
                    name={base} 
                    fill={CHART_COLORS[bases.indexOf(base) % CHART_COLORS.length]} 
                    radius={[2, 2, 0, 0]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
