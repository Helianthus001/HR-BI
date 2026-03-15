import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/utils/cn';
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

// Custom Colors
const CHART_COLORS = [
  '#1A93FC', // Blue
  '#66CD7F', // Green
  '#FF9D32', // Orange
  '#9F8EFF', // Purple
  '#FF6F73', // Red
  '#4EC0E8'  // Light Blue
];

const metrics = [
  { id: '1', title: '整体离职率', value: '12.4', prefix: '', suffix: '%' },
  { id: '2', title: '主动离职率', value: '8.2', prefix: '', suffix: '%' },
  { id: '3', title: '关键岗位离职率', value: '3.5', prefix: '', suffix: '%' },
  { id: '4', title: '试用期离职率', value: '15.6', prefix: '', suffix: '%' },
  { id: '5', title: '内部流动率', value: '5.8', prefix: '', suffix: '%' },
];

const ChartTabs = ({ tabs, active, onChange }: { tabs: string[], active: string, onChange: (t: string) => void }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {tabs.map(t => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={cn(
          "px-3 py-1 text-xs rounded-full transition-colors",
          active === t ? "bg-blue-100 text-blue-700 font-medium" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        )}
      >
        {t}
      </button>
    ))}
  </div>
);

// Mock Data Generators or Static Data
const baseData = [
  { name: '临淄', campus: 120, social: 80, rate: 95, voluntary: 30, involuntary: 10 },
  { name: '青州', campus: 80, social: 60, rate: 88, voluntary: 20, involuntary: 5 },
  { name: '张店', campus: 50, social: 40, rate: 92, voluntary: 15, involuntary: 8 },
  { name: '越南', campus: 40, social: 30, rate: 85, voluntary: 10, involuntary: 4 },
  { name: '印尼', campus: 30, social: 20, rate: 82, voluntary: 8, involuntary: 3 },
];

const timeData = [
  { month: '25.10', net: 50, rate: 98, tenure: 3.2, percent: 75 },
  { month: '25.11', net: 30, rate: 97, tenure: 3.3, percent: 76 },
  { month: '25.12', net: 80, rate: 97.5, tenure: 3.4, percent: 76.5 },
  { month: '26.01', net: -10, rate: 96, tenure: 3.4, percent: 76.2 },
  { month: '26.02', net: 40, rate: 98, tenure: 3.5, percent: 77 },
  { month: '26.03', net: 60, rate: 98.2, tenure: 3.6, percent: 78 },
];

const retentionData = [
  { month: '第1个月', rate: 98 },
  { month: '第2个月', rate: 95 },
  { month: '第3个月', rate: 90 },
  { month: '第6个月', rate: 85 },
  { month: '第12个月', rate: 80 },
];

// Tooltips
const CustomTooltip = ({ active, payload, label, suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-medium text-slate-800">{entry.value}{suffix}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const bases = ['临淄', '青州', '张店', '越南', '印尼', '马来西亚'];
const months = ['25.10', '25.11', '25.12', '26.01', '26.02', '26.03'];
const quarters = ['25Q1', '25Q2', '25Q3', '25Q4'];
const halfYears = ['24H2', '25H1', '25H2', '26H1'];
const years = ['2024', '2025', '2026'];
const last5Years = ['2022', '2023', '2024', '2025', '2026'];
const departments = ['营销&销售', '职能', '生产系统', '管理'];
const schoolTypes = ['985/211', '双非一本', '普通一本', '专科'];
const tenures = ['<1年', '1-3年', '3-5年', '>5年'];
const performances = ['0.8', '0.9', '1.0', '1.1', '1.2'];
const recruitmentProcesses = ['校招', '社招'];
const educationLevels = ['大专及以下', '本科', '硕士', '博士'];
const talentPlacements = ['核心人才', '关键人才', '稳健人才', '待观察人才'];

// Time Constants
const allMonths = [
  '2024.04', '2024.05', '2024.06', '2024.07', '2024.08', '2024.09', '2024.10', '2024.11', '2024.12',
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09',
  '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'
];
const allQuarters = ['2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2', '2025Q3', '2025Q4', '2026Q1'];
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

const MultiSelect = ({ options, selected, onChange, placeholder, labelPrefix = '已选' }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[160px] px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md hover:border-blue-500 transition-colors"
      >
        <span className="truncate text-slate-700">
          {selected.length === 0 ? placeholder : 
           selected.length === options.length ? '全部' : 
           `${labelPrefix} ${selected.length} 个`}
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
                else onChange(options.map((o: any) => o.value || o));
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
            {options.map((option: any) => {
              const val = option.value || option;
              const label = option.label || option;
              return (
                <div
                  key={val}
                  className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    const newSelected = selected.includes(val)
                      ? selected.filter((s: any) => s !== val)
                      : [...selected, val];
                    onChange(newSelected);
                  }}
                >
                  <div className={cn(
                    "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
                    selected.includes(val) ? "bg-blue-500 border-blue-500" : "border-slate-300"
                  )}>
                    {selected.includes(val) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {label}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const generateOnboardData = (timeUnit: string, start: string, end: string, selectedBases: string[]) => {
  let timeArray: string[] = [];
  const allOptions = timeUnit === '月' ? allMonths : timeUnit === '季' ? allQuarters : allYears;
  
  const startIndex = allOptions.indexOf(start);
  const endIndex = allOptions.indexOf(end);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
    timeArray = allOptions.slice(startIndex, endIndex + 1);
  } else {
    timeArray = allOptions.slice(-6);
  }

  return timeArray.map(time => {
    const data: any = { time };
    selectedBases.forEach((base) => {
      const campus = Math.floor(Math.random() * 50 + 10);
      const social = Math.floor(Math.random() * 30 + 5);
      data[`${base}_campus`] = campus;
      data[`${base}_social`] = social;
      data[`${base}_total`] = campus + social;
    });
    return data;
  });
};

const OnboardTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const baseData: Record<string, { campus: number, social: number, total: number, color: string }> = {};
    payload.forEach((entry: any) => {
      const [base, type] = entry.dataKey.split('_');
      if (!baseData[base]) {
        baseData[base] = { campus: 0, social: 0, total: 0, color: entry.color };
      }
      if (type === 'campus') baseData[base].campus = entry.value;
      if (type === 'social') baseData[base].social = entry.value;
      baseData[base].total = entry.payload[`${base}_total`];
    });

    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50 min-w-[200px]">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {Object.entries(baseData).map(([base, data]) => (
          <div key={base} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }} />
                <span className="font-medium text-slate-700">{base}</span>
              </div>
              <span className="font-bold text-slate-800">{data.total} 人</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pl-5">
              <span>校招: {data.campus}</span>
              <span>社招: {data.social}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const OnboardLegend = () => {
  return (
    <div className="flex flex-col items-center mt-2">
      <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mb-2">
        {bases.map((base, i) => (
          <div key={base} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
            <span>{base}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-400 rounded-sm" />
          <span>校招 (实心)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-400 rounded-sm opacity-60" />
          <span>社招 (半透明)</span>
        </div>
      </div>
    </div>
  );
};

const generateFulfillmentData = (start: string, end: string, selectedBases: string[], selectedDepts: string[], dim: string) => {
  const startIndex = allYears.indexOf(start);
  const endIndex = allYears.indexOf(end);
  const timeArray = (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) 
    ? allYears.slice(startIndex, endIndex + 1) 
    : allYears.slice(-5);

  return timeArray.map(year => {
    const data: any = { year, groupRate: Math.floor(Math.random() * 10 + 90) };
    
    if (dim === '基地') {
      selectedBases.forEach(base => {
        data[`base_${base}`] = Math.floor(Math.random() * 20 + 80);
      });
    } else {
      selectedDepts.forEach(dept => {
        data[`dept_${dept}`] = Math.floor(Math.random() * 20 + 80);
      });
    }

    return data;
  });
};

const FulfillmentTooltip = ({ active, payload, label, dim }: any) => {
  if (active && payload && payload.length) {
    const groupRateEntry = payload.find((p: any) => p.dataKey === 'groupRate');
    const groupRate = groupRateEntry ? groupRateEntry.value : null;
    const barPayloads = payload.filter((p: any) => p.dataKey !== 'groupRate');

    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50 min-w-[200px]">
        <p className="font-medium text-slate-800 mb-2">{label}年</p>
        {groupRate !== null && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">集团达成率:</span>
            <span className="font-bold text-blue-600">{groupRate}%</span>
          </div>
        )}
        {barPayloads.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-slate-800">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FulfillmentLegend = ({ dim }: { dim: string }) => {
  const items = dim === '基地' ? bases : departments;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
          <span>{item}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 ml-4">
        <div className="w-3 h-0.5 bg-slate-800" />
        <span>集团达成率</span>
      </div>
    </div>
  );
};

const generateTurnoverData = (timeUnit: string, start: string, end: string, dim: string, selectedOptions: string[]) => {
  let timeArray: string[] = [];
  const allOptions = timeUnit === '月' ? allMonths : allYears;
  
  const startIndex = allOptions.indexOf(start);
  const endIndex = allOptions.indexOf(end);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
    timeArray = allOptions.slice(startIndex, endIndex + 1);
  } else {
    timeArray = allOptions.slice(-6);
  }

  return timeArray.map(time => {
    const data: any = { time, groupTotal: Math.floor(Math.random() * 50 + 100) };
    
    const prefix = dim === '基地' ? 'base_' : 
                   dim === '部门' ? 'dept_' : 
                   dim === '学校类型' ? 'school_' : 
                   dim === '司龄段' ? 'tenure_' : 'perf_';

    selectedOptions.forEach(opt => {
      data[`${prefix}${opt}`] = Math.floor(Math.random() * 20 + 10);
    });

    return data;
  });
};

const TurnoverTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const groupTotalEntry = payload.find((p: any) => p.dataKey === 'groupTotal');
    const groupTotal = groupTotalEntry ? groupTotalEntry.value : null;
    const barPayloads = payload.filter((p: any) => p.dataKey !== 'groupTotal');

    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50 min-w-[200px]">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {groupTotal !== null && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">集团总离职:</span>
            <span className="font-bold text-blue-600">{groupTotal} 人</span>
          </div>
        )}
        {barPayloads.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-slate-800">{entry.value} 人</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TurnoverLegend = ({ dim }: { dim: string }) => {
  let items: string[] = [];
  if (dim === '基地') items = bases;
  else if (dim === '部门') items = departments;
  else if (dim === '学校类型') items = schoolTypes;
  else if (dim === '司龄段') items = tenures;
  else if (dim === '绩效系数') items = performances;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
          <span>{item}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 ml-4">
        <div className="w-3 h-0.5 bg-slate-800" />
        <span>集团总离职</span>
      </div>
    </div>
  );
};

const generateNetGrowthData = (timeUnit: string, start: string, end: string, dim: string, selectedOptions: string[]) => {
  let timeArray: string[] = [];
  const allOptions = timeUnit === '月' ? allMonths : timeUnit === '半年' ? allQuarters : allYears; // Using Quarters for half-year mock
  
  const startIndex = allOptions.indexOf(start);
  const endIndex = allOptions.indexOf(end);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
    timeArray = allOptions.slice(startIndex, endIndex + 1);
  } else {
    timeArray = allOptions.slice(-6);
  }

  return timeArray.map(time => {
    const data: any = { time, groupTotal: Math.floor(Math.random() * 60 - 20) };
    
    const prefix = dim === '基地' ? 'base_' : 'dept_';
    selectedOptions.forEach(opt => {
      data[`${prefix}${opt}`] = Math.floor(Math.random() * 30 - 10);
    });

    return data;
  });
};

const NetGrowthTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const groupTotalEntry = payload.find((p: any) => p.dataKey === 'groupTotal');
    const groupTotal = groupTotalEntry ? groupTotalEntry.value : null;
    const barPayloads = payload.filter((p: any) => p.dataKey !== 'groupTotal');

    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50 min-w-[200px]">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {groupTotal !== null && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">集团总净增长:</span>
            <span className={`font-bold ${groupTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {groupTotal > 0 ? '+' : ''}{groupTotal} 人
            </span>
          </div>
        )}
        {barPayloads.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className={`font-medium ${entry.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {entry.value > 0 ? '+' : ''}{entry.value} 人
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const NetGrowthLegend = ({ dim }: { dim: string }) => {
  const items = dim === '基地' ? bases : departments;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
          <span>{item}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 ml-4">
        <div className="w-3 h-0.5 bg-slate-800" />
        <span>集团总净增长</span>
      </div>
    </div>
  );
};

const generateRateData = (dim: string, selectedOptions: string[], start: string, end: string) => {
  const startIndex = allMonths.indexOf(start);
  const endIndex = allMonths.indexOf(end);
  const timeArray = (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) 
    ? allMonths.slice(startIndex, endIndex + 1) 
    : allMonths.slice(-6);

  return timeArray.map(time => {
    const data: any = { time, groupRate: Math.floor(Math.random() * 15 + 80) };
    
    const prefixMap: Record<string, string> = {
      '基地': 'base_',
      '部门': 'dept_',
      '序列': 'dept_',
      '绩效系数': 'perf_',
      '人才盘点落位': 'place_',
      '学校类型': 'school_',
      '招聘流程': 'proc_',
      '学历': 'edu_'
    };

    const prefix = prefixMap[dim] || 'base_';
    selectedOptions.forEach(opt => {
      data[`${prefix}${opt}`] = Math.floor(Math.random() * 20 + 75);
    });

    return data;
  });
};

const RateTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const groupRateEntry = payload.find((p: any) => p.dataKey === 'groupRate');
    const groupRate = groupRateEntry ? groupRateEntry.value : null;
    const barPayloads = payload.filter((p: any) => p.dataKey !== 'groupRate');

    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50 min-w-[200px]">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {groupRate !== null && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <span className="text-slate-600 font-medium">集团整体:</span>
            <span className="font-bold text-blue-600">{groupRate}%</span>
          </div>
        )}
        {barPayloads.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-slate-800">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RateLegend = ({ dim }: { dim: string }) => {
  let items: string[] = [];
  if (dim === '基地') items = bases;
  else if (dim === '部门' || dim === '序列') items = departments;
  else if (dim === '绩效系数') items = performances;
  else if (dim === '人才盘点落位') items = talentPlacements;
  else if (dim === '学校类型') items = schoolTypes;
  else if (dim === '招聘流程') items = recruitmentProcesses;
  else if (dim === '学历') items = educationLevels;
  
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-2">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
          <span>{item}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 ml-4">
        <div className="w-3 h-0.5 bg-slate-800" />
        <span>集团整体</span>
      </div>
    </div>
  );
};

export function OrgTurnoverPage() {
  // M1: 入职分析
  const [m1Period, setM1Period] = useState('月');
  const [m1Start, setM1Start] = useState(allMonths[allMonths.length - 6]);
  const [m1End, setM1End] = useState(allMonths[allMonths.length - 1]);
  const [m1Bases, setM1Bases] = useState(bases);

  const handleM1PeriodChange = (p: string) => {
    setM1Period(p);
    const options = p === '月' ? allMonths : p === '季' ? allQuarters : allYears;
    setM1Start(options[options.length - 6] || options[0]);
    setM1End(options[options.length - 1]);
  };

  // M2: 编制达成率分析
  const [m2Dim, setM2Dim] = useState('基地');
  const [m2Bases, setM2Bases] = useState(bases);
  const [m2Depts, setM2Depts] = useState(departments);
  const [m2Start, setM2Start] = useState(allYears[allYears.length - 5]);
  const [m2End, setM2End] = useState(allYears[allYears.length - 1]);

  // M3: 离职分析
  const [m3Dim, setM3Dim] = useState('基地');
  const [m3Period, setM3Period] = useState('月');
  const [m3Start, setM3Start] = useState(allMonths[allMonths.length - 6]);
  const [m3End, setM3End] = useState(allMonths[allMonths.length - 1]);
  const [m3Options, setM3Options] = useState(bases);

  const handleM3DimChange = (d: string) => {
    setM3Dim(d);
    if (d === '基地') setM3Options(bases);
    else if (d === '部门') setM3Options(departments);
    else if (d === '学校类型') setM3Options(schoolTypes);
    else if (d === '司龄段') setM3Options(tenures);
    else if (d === '绩效系数') setM3Options(performances);
  };

  const handleM3PeriodChange = (p: string) => {
    setM3Period(p);
    const options = p === '月' ? allMonths : allYears;
    setM3Start(options[options.length - 6] || options[0]);
    setM3End(options[options.length - 1]);
  };

  // M4: 组织净增长人数
  const [m4Dim, setM4Dim] = useState('基地');
  const [m4Period, setM4Period] = useState('月');
  const [m4Start, setM4Start] = useState(allMonths[allMonths.length - 6]);
  const [m4End, setM4End] = useState(allMonths[allMonths.length - 1]);
  const [m4Options, setM4Options] = useState(bases);

  const handleM4DimChange = (d: string) => {
    setM4Dim(d);
    if (d === '基地') setM4Options(bases);
    else setM4Options(departments);
  };

  const handleM4PeriodChange = (p: string) => {
    setM4Period(p);
    const options = p === '月' ? allMonths : p === '半年' ? allQuarters : allYears;
    setM4Start(options[options.length - 6] || options[0]);
    setM4End(options[options.length - 1]);
  };

  // M5: 部门留存率分析
  const [m5Dim, setM5Dim] = useState('基地');
  const [m5Options, setM5Options] = useState(bases);
  const [m5Start, setM5Start] = useState(allMonths[allMonths.length - 6]);
  const [m5End, setM5End] = useState(allMonths[allMonths.length - 1]);

  const handleM5DimChange = (d: string) => {
    setM5Dim(d);
    setM5Start(allMonths[allMonths.length - 6]);
    setM5End(allMonths[allMonths.length - 1]);
    if (d === '基地') setM5Options(bases);
    else if (d === '部门' || d === '序列') setM5Options(departments);
    else if (d === '绩效系数') setM5Options(performances);
    else if (d === '人才盘点落位') setM5Options(talentPlacements);
  };

  // M6: 新员工留存率
  const [m6Dim, setM6Dim] = useState('基地');
  const [m6Options, setM6Options] = useState(bases);
  const [m6Start, setM6Start] = useState(allMonths[allMonths.length - 6]);
  const [m6End, setM6End] = useState(allMonths[allMonths.length - 1]);

  const handleM6DimChange = (d: string) => {
    setM6Dim(d);
    setM6Start(allMonths[allMonths.length - 6]);
    setM6End(allMonths[allMonths.length - 1]);
    if (d === '基地') setM6Options(bases);
    else if (d === '部门') setM6Options(departments);
    else if (d === '学校类型') setM6Options(schoolTypes);
    else if (d === '招聘流程') setM6Options(recruitmentProcesses);
    else if (d === '学历') setM6Options(educationLevels);
  };

  // M7: 试用期通过率
  const [m7Dim, setM7Dim] = useState('基地');
  const [m7Options, setM7Options] = useState(bases);
  const [m7Start, setM7Start] = useState(allMonths[allMonths.length - 6]);
  const [m7End, setM7End] = useState(allMonths[allMonths.length - 1]);

  const handleM7DimChange = (d: string) => {
    setM7Dim(d);
    setM7Start(allMonths[allMonths.length - 6]);
    setM7End(allMonths[allMonths.length - 1]);
    if (d === '基地') setM7Options(bases);
    else if (d === '部门') setM7Options(departments);
    else if (d === '招聘流程') setM7Options(recruitmentProcesses);
  };

  // M8: 员工稳定性分析
  const [m8Dim, setM8Dim] = useState('基地');
  const [m8Options, setM8Options] = useState(bases);
  const [m8Start, setM8Start] = useState(allMonths[allMonths.length - 6]);
  const [m8End, setM8End] = useState(allMonths[allMonths.length - 1]);

  const handleM8DimChange = (d: string) => {
    setM8Dim(d);
    setM8Start(allMonths[allMonths.length - 6]);
    setM8End(allMonths[allMonths.length - 1]);
    if (d === '基地') setM8Options(bases);
    else if (d === '部门' || d === '序列') setM8Options(departments);
  };

  const onboardData = useMemo(() => generateOnboardData(m1Period, m1Start, m1End, m1Bases), [m1Period, m1Start, m1End, m1Bases]);
  const fulfillmentData = useMemo(() => generateFulfillmentData(m2Start, m2End, m2Bases, m2Depts, m2Dim), [m2Start, m2End, m2Bases, m2Depts, m2Dim]);
  const turnoverData = useMemo(() => generateTurnoverData(m3Period, m3Start, m3End, m3Dim, m3Options), [m3Period, m3Start, m3End, m3Dim, m3Options]);
  const netGrowthData = useMemo(() => generateNetGrowthData(m4Period, m4Start, m4End, m4Dim, m4Options), [m4Period, m4Start, m4End, m4Dim, m4Options]);
  const retentionData = useMemo(() => generateRateData(m5Dim, m5Options, m5Start, m5End), [m5Dim, m5Options, m5Start, m5End]);
  const newEmployeeRetentionData = useMemo(() => generateRateData(m6Dim, m6Options, m6Start, m6End), [m6Dim, m6Options, m6Start, m6End]);
  const probationPassData = useMemo(() => generateRateData(m7Dim, m7Options, m7Start, m7End), [m7Dim, m7Options, m7Start, m7End]);
  const stabilityData = useMemo(() => generateRateData(m8Dim, m8Options, m8Start, m8End), [m8Dim, m8Options, m8Start, m8End]);

  return (
    <PageContainer title="人员流动分析">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {metrics.map((metric) => (
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

      {/* Row 1: M1 & M2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Module 1: 入职分析 */}
        <Card title="入职分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <MultiSelect 
                options={bases}
                selected={m1Bases}
                onChange={setM1Bases}
                placeholder="选择基地"
                labelPrefix="已选基地"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                {['月', '季', '年'].map(p => (
                  <button 
                    key={p}
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${m1Period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleM1PeriodChange(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <DateRangeSelector 
                start={m1Start}
                end={m1End}
                onStartChange={setM1Start}
                onEndChange={setM1End}
                options={m1Period === '月' ? allMonths : m1Period === '季' ? allQuarters : allYears}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={onboardData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip content={<OnboardTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<OnboardLegend />} />
                {m1Bases.map((base, i) => (
                  <React.Fragment key={base}>
                    <Bar dataKey={`${base}_campus`} stackId={base} name={`${base}校招`} fill={CHART_COLORS[i % CHART_COLORS.length]} barSize={20} />
                    <Bar dataKey={`${base}_social`} stackId={base} name={`${base}社招`} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.6} radius={[4, 4, 0, 0]} />
                  </React.Fragment>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Module 2: 编制达成率分析 */}
        <Card title="编制达成率分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m2Dim}
                onChange={(e) => setM2Dim(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
              </select>
              <MultiSelect 
                options={m2Dim === '基地' ? bases : departments}
                selected={m2Dim === '基地' ? m2Bases : m2Depts}
                onChange={m2Dim === '基地' ? setM2Bases : setM2Depts}
                placeholder={`选择${m2Dim}`}
                labelPrefix={`已选${m2Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector 
                start={m2Start}
                end={m2End}
                onStartChange={setM2Start}
                onEndChange={setM2End}
                options={allYears}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={fulfillmentData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis 
                  yAxisId="left"
                  {...axisProps} 
                  tickFormatter={(val) => `${val}%`}
                  label={{ value: '达成率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <Tooltip content={<FulfillmentTooltip dim={m2Dim} />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<FulfillmentLegend dim={m2Dim} />} />
                
                {m2Dim === '基地' && m2Bases.map((base, i) => (
                  <Bar 
                    key={base}
                    yAxisId="left"
                    dataKey={`base_${base}`} 
                    name={base} 
                    fill={CHART_COLORS[i % CHART_COLORS.length]} 
                    radius={[4, 4, 0, 0]} 
                    barSize={16} 
                  />
                ))}

                {m2Dim === '部门' && m2Depts.map((dept, i) => (
                  <Bar 
                    key={dept}
                    yAxisId="left"
                    dataKey={`dept_${dept}`} 
                    name={dept} 
                    fill={CHART_COLORS[i % CHART_COLORS.length]} 
                    radius={[4, 4, 0, 0]} 
                    barSize={16} 
                  />
                ))}

                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="groupRate" 
                  name="集团达成率" 
                  stroke="#1e293b" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 6 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: M3 & M4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Module 3: 离职分析 */}
        <Card title="离职分析（离职人数）" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m3Dim}
                onChange={(e) => handleM3DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
                <option value="学校类型">按学校类型</option>
                <option value="司龄段">按司龄段</option>
                <option value="绩效系数">按绩效系数</option>
              </select>
              <MultiSelect 
                options={m3Dim === '基地' ? bases : m3Dim === '部门' ? departments : m3Dim === '学校类型' ? schoolTypes : m3Dim === '司龄段' ? tenures : performances}
                selected={m3Options}
                onChange={setM3Options}
                placeholder={`选择${m3Dim}`}
                labelPrefix={`已选${m3Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                {['月', '年'].map(p => (
                  <button 
                    key={p}
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${m3Period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleM3PeriodChange(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <DateRangeSelector 
                start={m3Start}
                end={m3End}
                onStartChange={setM3Start}
                onEndChange={setM3End}
                options={m3Period === '月' ? allMonths : allYears}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={turnoverData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis 
                  yAxisId="left"
                  {...axisProps} 
                  label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  {...axisProps} 
                  label={{ value: '集团总离职', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                />
                <Tooltip content={<TurnoverTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<TurnoverLegend dim={m3Dim} />} />
                
                {m3Dim === '基地' && m3Options.map((base, i) => (
                  <Bar key={base} yAxisId="left" dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m3Dim === '部门' && m3Options.map((dept, i) => (
                  <Bar key={dept} yAxisId="left" dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m3Dim === '学校类型' && m3Options.map((type, i) => (
                  <Bar key={type} yAxisId="left" dataKey={`school_${type}`} name={type} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m3Dim === '司龄段' && m3Options.map((tenure, i) => (
                  <Bar key={tenure} yAxisId="left" dataKey={`tenure_${tenure}`} name={tenure} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m3Dim === '绩效系数' && m3Options.map((perf, i) => (
                  <Bar key={perf} yAxisId="left" dataKey={`perf_${perf}`} name={perf} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line yAxisId="right" type="monotone" dataKey="groupTotal" name="集团总离职" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Module 4: 组织净增长人数 */}
        <Card title="组织净增长人数" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m4Dim}
                onChange={(e) => handleM4DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
              </select>
              <MultiSelect 
                options={m4Dim === '基地' ? bases : departments}
                selected={m4Options}
                onChange={setM4Options}
                placeholder={`选择${m4Dim}`}
                labelPrefix={`已选${m4Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                {['月', '半年', '年'].map((period) => (
                  <button 
                    key={period}
                    className={`px-3 py-1 text-sm rounded-sm transition-colors ${m4Period === period ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                    onClick={() => handleM4PeriodChange(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <DateRangeSelector 
                start={m4Start}
                end={m4End}
                onStartChange={setM4Start}
                onEndChange={setM4End}
                options={m4Period === '月' ? allMonths : m4Period === '半年' ? allQuarters : allYears}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={netGrowthData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis 
                  yAxisId="left"
                  {...axisProps} 
                  label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  {...axisProps} 
                  label={{ value: '集团净增长', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                />
                <Tooltip content={<NetGrowthTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<NetGrowthLegend dim={m4Dim} />} />
                
                {m4Dim === '基地' && m4Options.map((base, i) => (
                  <Bar key={base} yAxisId="left" dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m4Dim === '部门' && m4Options.map((dept, i) => (
                  <Bar key={dept} yAxisId="left" dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line yAxisId="right" type="monotone" dataKey="groupTotal" name="集团总净增长" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: M5 & M6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Module 5: 部门留存率分析 */}
        <Card title="部门留存率分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m5Dim}
                onChange={(e) => handleM5DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
                <option value="序列">按序列</option>
                <option value="绩效系数">按绩效系数</option>
                <option value="人才盘点落位">按人才盘点落位</option>
              </select>
              <MultiSelect 
                options={m5Dim === '基地' ? bases : (m5Dim === '部门' || m5Dim === '序列') ? departments : m5Dim === '绩效系数' ? performances : talentPlacements}
                selected={m5Options}
                onChange={setM5Options}
                placeholder={`选择${m5Dim}`}
                labelPrefix={`已选${m5Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector 
                start={m5Start}
                end={m5End}
                onStartChange={setM5Start}
                onEndChange={setM5End}
                options={allMonths}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={retentionData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(val) => `${val}%`} label={{ value: '留存率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<RateTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<RateLegend dim={m5Dim} />} />
                
                {m5Dim === '基地' && m5Options.map((base, i) => (
                  <Bar key={base} dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {(m5Dim === '部门' || m5Dim === '序列') && m5Options.map((dept, i) => (
                  <Bar key={dept} dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m5Dim === '绩效系数' && m5Options.map((perf, i) => (
                  <Bar key={perf} dataKey={`perf_${perf}`} name={perf} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m5Dim === '人才盘点落位' && m5Options.map((place, i) => (
                  <Bar key={place} dataKey={`place_${place}`} name={place} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line type="monotone" dataKey="groupRate" name="集团整体" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Module 6: 新员工留存率 */}
        <Card title="新员工留存率" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m6Dim}
                onChange={(e) => handleM6DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
                <option value="学校类型">按学校类型</option>
                <option value="招聘流程">按招聘流程</option>
                <option value="学历">按学历</option>
              </select>
              <MultiSelect 
                options={m6Dim === '基地' ? bases : m6Dim === '部门' ? departments : m6Dim === '学校类型' ? schoolTypes : m6Dim === '招聘流程' ? recruitmentProcesses : educationLevels}
                selected={m6Options}
                onChange={setM6Options}
                placeholder={`选择${m6Dim}`}
                labelPrefix={`已选${m6Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector 
                start={m6Start}
                end={m6End}
                onStartChange={setM6Start}
                onEndChange={setM6End}
                options={allMonths}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={newEmployeeRetentionData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(val) => `${val}%`} label={{ value: '留存率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<RateTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<RateLegend dim={m6Dim} />} />
                
                {m6Dim === '基地' && m6Options.map((base, i) => (
                  <Bar key={base} dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m6Dim === '部门' && m6Options.map((dept, i) => (
                  <Bar key={dept} dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m6Dim === '学校类型' && m6Options.map((type, i) => (
                  <Bar key={type} dataKey={`school_${type}`} name={type} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m6Dim === '招聘流程' && m6Options.map((proc, i) => (
                  <Bar key={proc} dataKey={`proc_${proc}`} name={proc} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m6Dim === '学历' && m6Options.map((edu, i) => (
                  <Bar key={edu} dataKey={`edu_${edu}`} name={edu} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line type="monotone" dataKey="groupRate" name="集团整体" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 4: M7 & M8 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 7: 试用期通过率 */}
        <Card title="试用期通过率" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m7Dim}
                onChange={(e) => handleM7DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
                <option value="招聘流程">按招聘流程</option>
              </select>
              <MultiSelect 
                options={m7Dim === '基地' ? bases : m7Dim === '部门' ? departments : recruitmentProcesses}
                selected={m7Options}
                onChange={setM7Options}
                placeholder={`选择${m7Dim}`}
                labelPrefix={`已选${m7Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector 
                start={m7Start}
                end={m7End}
                onStartChange={setM7Start}
                onEndChange={setM7End}
                options={allMonths}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={probationPassData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(val) => `${val}%`} label={{ value: '通过率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<RateTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<RateLegend dim={m7Dim} />} />
                
                {m7Dim === '基地' && m7Options.map((base, i) => (
                  <Bar key={base} dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m7Dim === '部门' && m7Options.map((dept, i) => (
                  <Bar key={dept} dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {m7Dim === '招聘流程' && m7Options.map((proc, i) => (
                  <Bar key={proc} dataKey={`proc_${proc}`} name={proc} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line type="monotone" dataKey="groupRate" name="集团整体" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Module 8: 员工稳定性分析 */}
        <Card title="员工稳定性分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-4">
              <select 
                value={m8Dim}
                onChange={(e) => handleM8DimChange(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="基地">按基地</option>
                <option value="部门">按部门</option>
                <option value="序列">按序列</option>
              </select>
              <MultiSelect 
                options={m8Dim === '基地' ? bases : departments}
                selected={m8Options}
                onChange={setM8Options}
                placeholder={`选择${m8Dim}`}
                labelPrefix={`已选${m8Dim}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <DateRangeSelector 
                start={m8Start}
                end={m8End}
                onStartChange={setM8Start}
                onEndChange={setM8End}
                options={allMonths}
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stabilityData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="time" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(val) => `${val}%`} label={{ value: '稳定性', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <Tooltip content={<RateTooltip />} cursor={{ fill: '#f1f5f9' }} wrapperStyle={{ zIndex: 100 }} />
                <Legend content={<RateLegend dim={m8Dim} />} />
                
                {m8Dim === '基地' && m8Options.map((base, i) => (
                  <Bar key={base} dataKey={`base_${base}`} name={base} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}
                {(m8Dim === '部门' || m8Dim === '序列') && m8Options.map((dept, i) => (
                  <Bar key={dept} dataKey={`dept_${dept}`} name={dept} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} barSize={16} />
                ))}

                <Line type="monotone" dataKey="groupRate" name="集团整体" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
