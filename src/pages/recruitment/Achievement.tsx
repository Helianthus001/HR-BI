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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';

interface AchievementReport {
  rank: number;
  company: string;
  hrm: string;
  target: number;
  achievement: number;
  rate: number;
}

const AchievementTable = ({ title, data, type }: { title: string, data: AchievementReport[], type: string }) => {
  const getRateColor = (rate: number) => {
    if (rate >= 100) return 'text-emerald-600';
    if (rate >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">排名</th>
              <th className="px-4 py-3 font-medium">公司</th>
              <th className="px-4 py-3 font-medium">HRM</th>
              <th className="px-4 py-3 font-medium text-right">{type}指标</th>
              <th className="px-4 py-3 font-medium text-right">{type}达成</th>
              <th className="px-4 py-3 font-medium text-right">{type}达成率</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.company} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-600">{row.rank}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{row.company}</td>
                <td className="px-4 py-3 text-slate-600">{row.hrm}</td>
                <td className="px-4 py-3 text-right text-slate-600">{row.target}</td>
                <td className="px-4 py-3 text-right text-slate-600">{row.achievement}</td>
                <td className={`px-4 py-3 text-right font-medium ${getRateColor(row.rate)}`}>
                  {row.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Custom Colors
const CHART_COLORS = [
  '#1A93FC', '#66CD7F', '#FF9D32', '#9F8EFF', '#FF6F73', '#4EC0E8', '#F5A623', '#D0021B'
];

// Mock Data
const metrics = [
  { id: '1', title: '招聘需求人数', value: '1,250', suffix: '人', trend: 'up' as const, trendValue: '5.2%' },
  { id: '2', title: '累计入职人数', value: '890', suffix: '人', trend: 'up' as const, trendValue: '8.1%' },
  { id: '3', title: '招聘完成率', value: '71.2', suffix: '%', trend: 'up' as const, trendValue: '2.4%' },
  { id: '4', title: '关键岗位招聘完成率', value: '65.5', suffix: '%', trend: 'down' as const, trendValue: '1.5%' },
  { id: '5', title: '平均招聘周期', value: '45', suffix: '天', trend: 'down' as const, trendValue: '3天' },
  { id: '6', title: 'P3及以上入职数量', value: '120', suffix: '人', trend: 'up' as const, trendValue: '12.5%' },
  { id: '7', title: '一线员工入职数量', value: '560', suffix: '人', trend: 'up' as const, trendValue: '6.3%' },
  { id: '8', title: 'offer接受率', value: '85.6', suffix: '%', trend: 'up' as const, trendValue: '1.2%' },
];

const dailyOnboardSeries = [
  { date: '2026-02-14', count: 11 },
  { date: '2026-02-15', count: 12 },
  { date: '2026-02-16', count: 10 },
  { date: '2026-02-17', count: 14 },
  { date: '2026-02-18', count: 13 },
  { date: '2026-02-19', count: 15 },
  { date: '2026-02-20', count: 16 },
  { date: '2026-02-21', count: 14 },
  { date: '2026-02-22', count: 17 },
  { date: '2026-02-23', count: 18 },
  { date: '2026-02-24', count: 16 },
  { date: '2026-02-25', count: 19 },
  { date: '2026-02-26', count: 21 },
  { date: '2026-02-27', count: 20 },
  { date: '2026-02-28', count: 22 },
  { date: '2026-03-01', count: 18 },
  { date: '2026-03-02', count: 19 },
  { date: '2026-03-03', count: 17 },
  { date: '2026-03-04', count: 21 },
  { date: '2026-03-05', count: 20 },
  { date: '2026-03-06', count: 23 },
  { date: '2026-03-07', count: 24 },
  { date: '2026-03-08', count: 22 },
  { date: '2026-03-09', count: 25 },
  { date: '2026-03-10', count: 26 },
  { date: '2026-03-11', count: 24 },
  { date: '2026-03-12', count: 27 },
  { date: '2026-03-13', count: 29 },
  { date: '2026-03-14', count: 30 },
  { date: '2026-03-15', count: 32 },
];

const funnelData = [
  { name: '简历', value: 10000, fill: CHART_COLORS[0] },
  { name: '初筛', value: 5000, fill: CHART_COLORS[1] },
  { name: '面试', value: 2000, fill: CHART_COLORS[2] },
  { name: 'offer', value: 1000, fill: CHART_COLORS[3] },
  { name: '入职', value: 890, fill: CHART_COLORS[4] },
];

const channelData = [
  { name: '招聘网站', rate: 12.5 },
  { name: '内推', rate: 25.4 },
  { name: '猎头', rate: 35.2 },
  { name: '校招', rate: 18.6 },
  { name: '社招', rate: 15.3 },
].sort((a, b) => a.rate - b.rate);

const baseFunnelStages = [
  { name: '投递', value: 10000, fill: CHART_COLORS[0] },
  { name: '初筛', value: 5000, fill: CHART_COLORS[1] },
  { name: '面试', value: 2000, fill: CHART_COLORS[2] },
  { name: 'Offer', value: 1000, fill: CHART_COLORS[3] },
  { name: '入职', value: 890, fill: CHART_COLORS[4] },
];

const baseOptions = ['全部', '张店基地', '临淄基地', '青州基地', '越南基地'];
const deptOptions = ['全部', '研发中心', '生产系统', '营销中心', '职能支持'];
const groupOptions = ['全部集团', '医疗集团', '再生集团'];
const sequenceOptions = ['全部序列', 'P序列', 'M序列', 'S序列', 'T序列'];
const funnelDatePresets = ['本月', '本季度', '本年', '自定义'];

const channelConversionData = [
  { channel: 'BOSS直聘', delivery: 3200, offer: 760, onboard: 530 },
  { channel: '智联招聘', delivery: 2600, offer: 590, onboard: 420 },
  { channel: '猎聘', delivery: 1500, offer: 520, onboard: 350 },
  { channel: '内推', delivery: 900, offer: 460, onboard: 390 },
  { channel: '校招', delivery: 1800, offer: 640, onboard: 510 },
];

const onboardTrendBaseData = [
  { period: '1月', social: 95, campus: 52, referral: 24, newRate: 23.4 },
  { period: '2月', social: 102, campus: 58, referral: 26, newRate: 24.1 },
  { period: '3月', social: 118, campus: 66, referral: 28, newRate: 25.5 },
  { period: '4月', social: 126, campus: 72, referral: 31, newRate: 26.2 },
  { period: '5月', social: 121, campus: 70, referral: 29, newRate: 25.8 },
  { period: '6月', social: 134, campus: 76, referral: 34, newRate: 27.1 },
];

const campusMetricOptions = [
  { key: 'keySchool', label: '重点院校占比', baseRatio: 42.5 },
  { key: 'postgraduate', label: '研究生占比', baseRatio: 31.8 },
  { key: 'localSource', label: '本地生源占比', baseRatio: 55.2 },
];

const campusStructureData = [
  { name: '985', value: 150 },
  { name: '211', value: 250 },
  { name: '普通本科', value: 400 },
  { name: '专科', value: 100 },
];

const pendingDemands = [
  { id: 1, position: '高级前端工程师', dept: '研发中心', base: '张店基地', demand: 5, onboard: 2, gap: 3, cycle: '45天' },
  { id: 2, position: '产品经理', dept: '产品部', base: '张店基地', demand: 3, onboard: 1, gap: 2, cycle: '30天' },
  { id: 3, position: '生产主管', dept: '生产一部', base: '临淄基地', demand: 10, onboard: 6, gap: 4, cycle: '60天' },
  { id: 4, position: '销售代表', dept: '销售部', base: '青州基地', demand: 20, onboard: 15, gap: 5, cycle: '20天' },
  { id: 5, position: '财务专员', dept: '财务部', base: '张店基地', demand: 2, onboard: 0, gap: 2, cycle: '40天' },
];

const cancelMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'];
const cancelData = cancelMonths.map(month => ({
  month,
  count: Math.floor(Math.random() * 20) + 5
}));

const signCancelRatioData = cancelMonths.map((month, index) => {
  const sign = Math.floor(Math.random() * 100) + 50;
  const cancel = cancelData[index].count;
  return {
    month,
    sign,
    cancel,
    ratio: Number(((cancel / sign) * 100).toFixed(1))
  };
});

const onboardAnalysisData = [
  { name: '临淄基地', 社招: 120, 校招: 80, 内推: 20 },
  { name: '青州基地', 社招: 100, 校招: 60, 内推: 20 },
  { name: '张店基地', 社招: 80, 校招: 50, 内推: 20 },
  { name: '越南基地', 社招: 60, 校招: 20, 内推: 10 },
  { name: '印尼基地', 社招: 40, 校招: 10, 内推: 10 },
];

const campusCancelData = [
  { name: '清华大学', count: 2 },
  { name: '北京大学', count: 1 },
  { name: '浙江大学', count: 3 },
  { name: '复旦大学', count: 2 },
  { name: '上海交通大学', count: 4 },
];

const cancelReasonData = [
  { name: '薪资原因', value: 35 },
  { name: '岗位原因', value: 20 },
  { name: '城市原因', value: 15 },
  { name: '家庭原因', value: 10 },
  { name: '其他机会', value: 20 },
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
              {entry.value} {entry.dataKey === 'cancelRate' || entry.name.includes('率') || entry.name.includes('比') ? '%' : (entry.name.includes('周期') ? '天' : '人')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChannelConversionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm z-50">
      <p className="font-medium text-slate-800 mb-2">{label}</p>
      <div className="space-y-1 text-slate-600">
        <div>投递人数: <span className="font-medium text-slate-800">{row.delivery}</span></div>
        <div>Offer人数: <span className="font-medium text-slate-800">{row.offer}</span></div>
        <div>入职人数: <span className="font-medium text-slate-800">{row.onboard}</span></div>
        <div>Offer转化率: <span className="font-medium text-slate-800">{row.offerRate}%</span></div>
        <div>入职转化率: <span className="font-medium text-slate-800">{row.onboardRate}%</span></div>
      </div>
    </div>
  );
};

const MiniDonutWithLegend = ({
  title,
  data,
  colorOffset = 0,
}: {
  title: string;
  data: Array<{ name: string; value: number }>;
  colorOffset?: number;
}) => {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/30 p-2">
      <div className="h-[116px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={44}>
              {data.map((entry, index) => (
                <Cell key={`${title}-${entry.name}`} fill={CHART_COLORS[(index + colorOffset) % CHART_COLORS.length]} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[10px] font-medium">
              {title}
            </text>
            <RechartsTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((entry, index) => (
          <div key={`${title}-legend-${entry.name}`} className="flex items-center gap-1 text-[11px] text-slate-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: CHART_COLORS[(index + colorOffset) % CHART_COLORS.length] }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tabs Component
const Tabs = ({ options, active, onChange }: { options: string[], active: string, onChange: (val: string) => void }) => (
  <div className="flex bg-slate-100/50 p-1 rounded-md">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          active === opt 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export function RecruitmentAchievementPage() {
  const [achieveDim, setAchieveDim] = useState('基地');
  const [onboardBase, setOnboardBase] = useState('全部');
  const [onboardDept, setOnboardDept] = useState('全部');
  const [onboardGroup, setOnboardGroup] = useState('全部集团');
  const [onboardSequence, setOnboardSequence] = useState('全部序列');
  const [onboardPeriod, setOnboardPeriod] = useState('月');
  const [cancelCompositionType, setCancelCompositionType] = useState<'学历' | '学校类型'>('学历');
  const [cancelBase, setCancelBase] = useState('全部');
  const [cancelDept, setCancelDept] = useState('全部');
  const [cancelGroup, setCancelGroup] = useState('全部集团');
  const [cancelSequence, setCancelSequence] = useState('全部序列');
  const [onboardStartDate, setOnboardStartDate] = useState('2026-03-01');
  const [onboardEndDate, setOnboardEndDate] = useState('2026-03-07');
  const [achievementGroup, setAchievementGroup] = useState('医疗');
  const [funnelBase, setFunnelBase] = useState('全部');
  const [funnelDept, setFunnelDept] = useState('全部');
  const [funnelGroup, setFunnelGroup] = useState('全部集团');
  const [funnelSequence, setFunnelSequence] = useState('全部序列');
  const [funnelDatePreset, setFunnelDatePreset] = useState('本月');
  const [funnelStartDate, setFunnelStartDate] = useState('2026-01-01');
  const [funnelEndDate, setFunnelEndDate] = useState('2026-03-31');
  const [campusStructBase, setCampusStructBase] = useState('全部');
  const [campusStructDept, setCampusStructDept] = useState('全部');
  const [campusStructGroup, setCampusStructGroup] = useState('全部集团');
  const [campusStructSequence, setCampusStructSequence] = useState('全部序列');
  const [demandBase, setDemandBase] = useState('全部');
  const [demandDept, setDemandDept] = useState('全部');
  const [demandGroup, setDemandGroup] = useState('全部集团');
  const [demandSequence, setDemandSequence] = useState('全部序列');

  const getAchievementData = (group: string): AchievementReport[] => {
    const companies = group === '医疗' 
      ? ['张店英科医疗', '上海心电图/英恩', '江苏康养/理疗', '安庆英科医疗', '英科医疗印尼']
      : ['山东英科再生', '上海英科再生', '英科再生越南', '杭州英卓家居', '六安英科再生'];
    
    return companies.map((company, index) => ({
      rank: index + 1,
      company,
      hrm: `HRM-${index + 1}`,
      target: 100 + index * 10,
      achievement: Math.floor(50 + Math.random() * 80),
      rate: 0,
    })).map(item => ({ ...item, rate: Number(((item.achievement / item.target) * 100).toFixed(1)) }));
  };

  const monthlyData = getAchievementData(achievementGroup);
  const annualData = getAchievementData(achievementGroup).map(item => ({ ...item, target: item.target * 12, achievement: item.achievement * 12 })).map(item => ({ ...item, rate: Number(((item.achievement / item.target) * 100).toFixed(1)) }));

  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const dateDiffDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.floor((e.getTime() - s.getTime()) / 86400000);
  };

  const handleOnboardStartDateChange = (value: string) => {
    if (!value) return;
    let nextEnd = onboardEndDate;
    if (value > onboardEndDate) nextEnd = value;
    if (dateDiffDays(value, nextEnd) > 14) nextEnd = addDays(value, 14);
    setOnboardStartDate(value);
    setOnboardEndDate(nextEnd);
  };

  const handleOnboardEndDateChange = (value: string) => {
    if (!value) return;
    let nextStart = onboardStartDate;
    if (value < onboardStartDate) nextStart = value;
    if (dateDiffDays(nextStart, value) > 14) nextStart = addDays(value, -14);
    setOnboardStartDate(nextStart);
    setOnboardEndDate(value);
  };

  const todayOnboardTrend = useMemo(() => {
    const filtered = dailyOnboardSeries
      .filter((item) => item.date >= onboardStartDate && item.date <= onboardEndDate)
      .map((item) => ({ day: item.date.slice(5), count: item.count }));
    return filtered.length ? filtered : dailyOnboardSeries.slice(-7).map((item) => ({ day: item.date.slice(5), count: item.count }));
  }, [onboardStartDate, onboardEndDate]);

  const todayOnboardSummary = useMemo(() => {
    const last = todayOnboardTrend[todayOnboardTrend.length - 1]?.count ?? 0;
    const prev = todayOnboardTrend[todayOnboardTrend.length - 2]?.count ?? last;
    const change = prev === 0 ? 0 : Number((((last - prev) / prev) * 100).toFixed(1));
    const sign = change >= 0 ? '↑' : '↓';
    return { last, changeText: `${sign} ${Math.abs(change)}% 较前一日` };
  }, [todayOnboardTrend]);

  const funnelChartData = useMemo(() => {
    const baseFactorMap: Record<string, number> = {
      '全部': 1,
      '张店基地': 0.32,
      '临淄基地': 0.24,
      '青州基地': 0.2,
      '越南基地': 0.15,
    };
    const deptFactorMap: Record<string, number> = {
      '全部': 1,
      '研发中心': 0.28,
      '生产系统': 0.34,
      '营销中心': 0.25,
      '职能支持': 0.18,
    };
    const groupFactorMap: Record<string, number> = {
      '全部集团': 1,
      '医疗集团': 0.62,
      '再生集团': 0.38,
    };
    const sequenceFactorMap: Record<string, number> = {
      '全部序列': 1,
      'P序列': 0.46,
      'M序列': 0.18,
      'S序列': 0.14,
      'T序列': 0.22,
    };
    const presetFactorMap: Record<string, number> = {
      '本月': 1,
      '本季度': 2.7,
      '本年': 10.8,
      '自定义': 1,
    };

    let periodFactor = presetFactorMap[funnelDatePreset] ?? 1;
    if (funnelDatePreset === '自定义') {
      const start = new Date(funnelStartDate);
      const end = new Date(funnelEndDate);
      const diff = Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())
        ? 30
        : Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
      periodFactor = Math.min(12, Math.max(0.4, diff / 30));
    }

    const factor =
      (baseFactorMap[funnelBase] ?? 1) *
      (deptFactorMap[funnelDept] ?? 1) *
      (groupFactorMap[funnelGroup] ?? 1) *
      (sequenceFactorMap[funnelSequence] ?? 1) *
      periodFactor;

    return baseFunnelStages.map((item) => ({
      ...item,
      value: Math.max(1, Math.round(item.value * factor)),
    }));
  }, [
    funnelBase,
    funnelDept,
    funnelGroup,
    funnelSequence,
    funnelDatePreset,
    funnelStartDate,
    funnelEndDate,
  ]);

  const channelChartData = useMemo(
    () =>
      channelConversionData.map((item) => ({
        ...item,
        offerRate: Number(((item.offer / item.delivery) * 100).toFixed(1)),
        onboardRate: Number(((item.onboard / item.delivery) * 100).toFixed(1)),
      })),
    [],
  );

  const campusStructureMetricsData = useMemo(() => {
    const baseFactorMap: Record<string, number> = {
      '全部': 0,
      '张店基地': 3.2,
      '临淄基地': -1.5,
      '青州基地': -2.1,
      '越南基地': -3.6,
    };
    const deptFactorMap: Record<string, number> = {
      '全部': 0,
      '研发中心': 2.5,
      '生产系统': -1.8,
      '营销中心': -0.9,
      '职能支持': 1.2,
    };
    const groupFactorMap: Record<string, number> = {
      '全部集团': 0,
      '医疗集团': 2.2,
      '再生集团': -2.2,
    };
    const sequenceFactorMap: Record<string, number> = {
      '全部序列': 0,
      'P序列': 2.8,
      'M序列': 0.6,
      'S序列': -1.3,
      'T序列': -2.1,
    };
    const delta =
      (baseFactorMap[campusStructBase] ?? 0) +
      (deptFactorMap[campusStructDept] ?? 0) +
      (groupFactorMap[campusStructGroup] ?? 0) +
      (sequenceFactorMap[campusStructSequence] ?? 0);

    return campusMetricOptions.map((metric) => {
      const ratioRaw = metric.baseRatio + delta;
      const ratio = Math.max(5, Math.min(95, Number(ratioRaw.toFixed(1))));
      return {
        key: metric.key,
        label: metric.label,
        ratio,
        pieData: [
          { name: metric.label, value: ratio },
          { name: '其他签约人员', value: Number((100 - ratio).toFixed(1)) },
        ],
      };
    });
  }, [campusStructBase, campusStructDept, campusStructGroup, campusStructSequence]);

  const demandSummary = useMemo(() => {
    const baseFactorMap: Record<string, number> = {
      '全部': 1,
      '张店基地': 0.35,
      '临淄基地': 0.26,
      '青州基地': 0.22,
      '越南基地': 0.17,
    };
    const deptFactorMap: Record<string, number> = {
      '全部': 1,
      '研发中心': 0.3,
      '生产系统': 0.36,
      '营销中心': 0.22,
      '职能支持': 0.12,
    };
    const groupFactorMap: Record<string, number> = {
      '全部集团': 1,
      '医疗集团': 0.62,
      '再生集团': 0.38,
    };
    const sequenceFactorMap: Record<string, number> = {
      '全部序列': 1,
      'P序列': 0.44,
      'M序列': 0.2,
      'S序列': 0.16,
      'T序列': 0.2,
    };

    const factor =
      (baseFactorMap[demandBase] ?? 1) *
      (deptFactorMap[demandDept] ?? 1) *
      (groupFactorMap[demandGroup] ?? 1) *
      (sequenceFactorMap[demandSequence] ?? 1);

    const pending = Math.max(1, Math.round(380 * factor));
    const cancel = Math.max(1, Math.round(62 * factor));
    const signed = Math.max(cancel + 1, Math.round(620 * factor));
    const ratio = Number(((cancel / signed) * 100).toFixed(1));

    return { pending, cancel, ratio };
  }, [demandBase, demandDept, demandGroup, demandSequence]);

  const onboardComposite = useMemo(() => {
    const baseFactorMap: Record<string, number> = {
      '全部': 1,
      '张店基地': 0.34,
      '临淄基地': 0.24,
      '青州基地': 0.22,
      '越南基地': 0.2,
    };
    const deptFactorMap: Record<string, number> = {
      '全部': 1,
      '研发中心': 0.27,
      '生产系统': 0.38,
      '营销中心': 0.2,
      '职能支持': 0.15,
    };
    const groupFactorMap: Record<string, number> = {
      '全部集团': 1,
      '医疗集团': 0.61,
      '再生集团': 0.39,
    };
    const sequenceFactorMap: Record<string, number> = {
      '全部序列': 1,
      'P序列': 0.46,
      'M序列': 0.2,
      'S序列': 0.14,
      'T序列': 0.2,
    };

    const factor =
      (baseFactorMap[onboardBase] ?? 1) *
      (deptFactorMap[onboardDept] ?? 1) *
      (groupFactorMap[onboardGroup] ?? 1) *
      (sequenceFactorMap[onboardSequence] ?? 1);

    const trendData = onboardTrendBaseData.map((item, idx) => {
      const periodScale = onboardPeriod === '年' ? 12 : 1;
      const seasonal = 0.94 + idx * 0.02;
      const social = Math.max(1, Math.round(item.social * factor * seasonal * periodScale));
      const campus = Math.max(1, Math.round(item.campus * factor * seasonal * periodScale));
      const referral = Math.max(1, Math.round(item.referral * factor * seasonal * periodScale));
      const total = social + campus + referral;
      const newRate = Number(((campus / total) * 100 + item.newRate * 0.08).toFixed(1));
      return { period: item.period, social, campus, referral, newRate };
    });

    const sequenceData = [
      { name: 'P序列', value: Math.max(1, Math.round(45 * factor)) },
      { name: 'M序列', value: Math.max(1, Math.round(20 * factor)) },
      { name: 'S序列', value: Math.max(1, Math.round(15 * factor)) },
      { name: 'T序列', value: Math.max(1, Math.round(20 * factor)) },
    ];
    const gradeData = [
      { name: '初级', value: Math.max(1, Math.round(38 * factor)) },
      { name: '中级', value: Math.max(1, Math.round(34 * factor)) },
      { name: '高级', value: Math.max(1, Math.round(18 * factor)) },
      { name: '专家', value: Math.max(1, Math.round(10 * factor)) },
    ];
    const ageData = [
      { name: '18-25', value: Math.max(1, Math.round(42 * factor)) },
      { name: '26-30', value: Math.max(1, Math.round(33 * factor)) },
      { name: '31-35', value: Math.max(1, Math.round(17 * factor)) },
      { name: '36+', value: Math.max(1, Math.round(8 * factor)) },
    ];

    return { trendData, sequenceData, gradeData, ageData };
  }, [onboardBase, onboardDept, onboardGroup, onboardSequence, onboardPeriod]);

  const cancelComposite = useMemo(() => {
    const baseVolumeMap: Record<string, number> = {
      '全部': 1,
      '张店基地': 1.12,
      '临淄基地': 0.97,
      '青州基地': 0.9,
      '越南基地': 0.82,
    };
    const deptVolumeMap: Record<string, number> = {
      '全部': 1,
      '研发中心': 0.88,
      '生产系统': 1.16,
      '营销中心': 1.04,
      '职能支持': 0.8,
    };
    const groupVolumeMap: Record<string, number> = {
      '全部集团': 1,
      '医疗集团': 1.08,
      '再生集团': 0.92,
    };
    const sequenceVolumeMap: Record<string, number> = {
      '全部序列': 1,
      'P序列': 1.15,
      'M序列': 0.94,
      'S序列': 0.84,
      'T序列': 0.9,
    };

    const volumeScale =
      (baseVolumeMap[cancelBase] ?? 1) *
      (deptVolumeMap[cancelDept] ?? 1) *
      (groupVolumeMap[cancelGroup] ?? 1) *
      (sequenceVolumeMap[cancelSequence] ?? 1);

    const categories = cancelCompositionType === '学历'
      ? [
          { category: '大专及以下', signBase: 96, rateBase: 11.8 },
          { category: '本科', signBase: 210, rateBase: 8.6 },
          { category: '硕士', signBase: 84, rateBase: 6.2 },
          { category: '博士', signBase: 22, rateBase: 4.3 },
        ]
      : [
          { category: '985211', signBase: 62, rateBase: 5.1 },
          { category: '双非一本', signBase: 132, rateBase: 7.3 },
          { category: '普通本科', signBase: 156, rateBase: 8.8 },
          { category: '专科', signBase: 74, rateBase: 11.5 },
        ];

    const seedText = `${cancelCompositionType}|${cancelBase}|${cancelDept}|${cancelGroup}|${cancelSequence}`;
    const seed = Array.from(seedText).reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
    const dimRateShift = ((seed % 9) - 4) * 0.32;

    const data = categories.map((item, index) => {
      const volumeNoise =
        1 +
        Math.sin((seed % 71) * 0.04 + (index + 1) * 0.9) * 0.06 +
        Math.cos((seed % 37) * 0.07 + (index + 2) * 0.8) * 0.04;
      const signCount = Math.max(16, Math.round(item.signBase * volumeScale * volumeNoise));

      const rateNoise =
        Math.sin((seed % 53) * 0.06 + (index + 1) * 1.2) * 0.7 +
        Math.cos((seed % 29) * 0.09 + (index + 1) * 0.75) * 0.45;
      const cancelRate = Math.max(2.5, Math.min(19.5, item.rateBase + dimRateShift + rateNoise));
      const cancelCount = Math.max(1, Math.round(signCount * cancelRate / 100));

      return {
        category: item.category,
        signCount,
        cancelCount,
        cancelRate: Number(cancelRate.toFixed(1)),
      };
    });

    return { data };
  }, [cancelCompositionType, cancelBase, cancelDept, cancelGroup, cancelSequence]);

  return (
    <PageContainer title="招聘达成分析">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      {/* Module 1: 今日入职数量 */}
      <div className="mb-6">
        <ChartPanel
          title="今日入职数量"
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">时间范围</span>
              <input
                type="date"
                value={onboardStartDate}
                onChange={(e) => handleOnboardStartDateChange(e.target.value)}
                className="border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={onboardEndDate}
                onChange={(e) => handleOnboardEndDateChange(e.target.value)}
                className="border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-slate-400">最多15天</span>
            </div>
          }
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 text-center md:text-left md:w-48">
              <div className="text-sm text-slate-500 mb-2">今日入职人数</div>
              <div className="text-5xl font-bold text-blue-600">{todayOnboardSummary.last}<span className="text-xl text-slate-500 font-normal ml-2">人</span></div>
              <div className="text-sm text-emerald-500 mt-2 font-medium">{todayOnboardSummary.changeText}</div>
            </div>
            <div className="h-[200px] flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={todayOnboardTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridProps} vertical={false} />
                  <XAxis dataKey="day" {...axisProps} />
                  <YAxis {...axisProps} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="入职人数" stroke={CHART_COLORS[0]} strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartPanel>
      </div>

      {/* Module 2: 招聘达成 */}
      <div className="mb-6">
        <ChartPanel 
          title="招聘达成" 
          extra={
            <div className="flex items-center gap-4">
              <select 
                value={achievementGroup}
                onChange={(e) => setAchievementGroup(e.target.value)}
                className="text-sm border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="医疗">医疗</option>
                <option value="再生">再生</option>
              </select>
            </div>
          }
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AchievementTable title="月度招聘达成率报表" data={monthlyData} type="月度" />
            <AchievementTable title="年度招聘达成率报表" data={annualData} type="年度" />
          </div>
        </ChartPanel>
      </div>

      {/* Module 3 + 4: 招聘漏斗 + 招聘渠道转化率分析 */}
      <div className="mb-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartPanel
          title="招聘漏斗"
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <span className="text-xs text-slate-500">基地</span>
              <select
                value={funnelBase}
                onChange={(e) => setFunnelBase(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {baseOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部基地' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">部门</span>
              <select
                value={funnelDept}
                onChange={(e) => setFunnelDept(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {deptOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部部门' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">集团</span>
              <select
                value={funnelGroup}
                onChange={(e) => setFunnelGroup(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部集团' ? '全部集团' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">序列</span>
              <select
                value={funnelSequence}
                onChange={(e) => setFunnelSequence(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sequenceOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部序列' ? '全部序列' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">日期</span>
              <select
                value={funnelDatePreset}
                onChange={(e) => setFunnelDatePreset(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {funnelDatePresets.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <input
                type="date"
                value={funnelStartDate}
                onChange={(e) => setFunnelStartDate(e.target.value)}
                disabled={funnelDatePreset !== '自定义'}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              <input
                type="date"
                value={funnelEndDate}
                onChange={(e) => setFunnelEndDate(e.target.value)}
                disabled={funnelDatePreset !== '自定义'}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          }
        >
          <div className="h-[380px] w-full flex justify-center">
            <ResponsiveContainer width="90%" height="100%">
              <FunnelChart>
                <RechartsTooltip content={<CustomTooltip />} />
                <Funnel dataKey="value" data={funnelChartData} isAnimationActive>
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                  <LabelList position="center" fill="#fff" stroke="none" dataKey="value" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        <ChartPanel title="招聘渠道转化率分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={channelChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="channel" {...axisProps} />
                <YAxis
                  yAxisId="left"
                  {...axisProps}
                  label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  {...axisProps}
                  tickFormatter={(val) => `${val}%`}
                  label={{ value: '转化率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                />
                <RechartsTooltip content={<ChannelConversionTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="delivery" name="投递人数" stackId="count" fill={CHART_COLORS[0]} />
                <Bar yAxisId="left" dataKey="offer" name="Offer人数" stackId="count" fill={CHART_COLORS[2]} />
                <Bar yAxisId="left" dataKey="onboard" name="入职人数" stackId="count" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="offerRate" name="Offer转化率" stroke={CHART_COLORS[3]} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="onboardRate" name="入职转化率" stroke={CHART_COLORS[4]} strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 5: 校招签约结构 */}
      <div className="mb-6">
        <ChartPanel
          title="校招签约结构"
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">基地</span>
              <select
                value={campusStructBase}
                onChange={(e) => setCampusStructBase(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {baseOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部基地' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">部门</span>
              <select
                value={campusStructDept}
                onChange={(e) => setCampusStructDept(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {deptOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部部门' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">集团</span>
              <select
                value={campusStructGroup}
                onChange={(e) => setCampusStructGroup(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">序列</span>
              <select
                value={campusStructSequence}
                onChange={(e) => setCampusStructSequence(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sequenceOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campusStructureMetricsData.map((metric, metricIndex) => (
              <div key={metric.key} className="h-[320px] w-full">
                <div className="text-sm font-medium text-slate-700 mb-2 text-center">{metric.label}</div>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={metric.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                    >
                      {metric.pieData.map((entry, index) => (
                        <Cell
                          key={`${metric.key}-cell-${index}`}
                          fill={index === 0 ? CHART_COLORS[metricIndex % CHART_COLORS.length] : '#E2E8F0'}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </ChartPanel>
      </div>

      {/* Module 6/7/8: 需求与解约核心指标 */}
      <div className="mb-6">
        <ChartPanel
          title="需求与解约核心指标"
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">基地</span>
              <select
                value={demandBase}
                onChange={(e) => setDemandBase(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {baseOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部基地' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">部门</span>
              <select
                value={demandDept}
                onChange={(e) => setDemandDept(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {deptOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部部门' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">集团</span>
              <select
                value={demandGroup}
                onChange={(e) => setDemandGroup(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部集团' ? '全部集团' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">序列</span>
              <select
                value={demandSequence}
                onChange={(e) => setDemandSequence(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sequenceOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部序列' ? '全部序列' : item}</option>
                ))}
              </select>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="待招需求"
              value={demandSummary.pending.toLocaleString()}
              suffix="人"
              className="hover:shadow-md transition-shadow duration-200"
            />
            <MetricCard
              title="解约人数"
              value={demandSummary.cancel.toLocaleString()}
              suffix="人"
              className="hover:shadow-md transition-shadow duration-200"
            />
            <MetricCard
              title="签约解约比"
              value={demandSummary.ratio}
              suffix="%"
              className="hover:shadow-md transition-shadow duration-200"
            />
          </div>
        </ChartPanel>
      </div>

      {/* Module 9: 入职人数分析 */}
      <div className="mb-6">
        <ChartPanel 
          title="入职人数分析" 
          extra={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">基地</span>
              <select
                value={onboardBase}
                onChange={(e) => setOnboardBase(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {baseOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部基地' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">部门</span>
              <select
                value={onboardDept}
                onChange={(e) => setOnboardDept(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {deptOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部部门' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">集团</span>
              <select
                value={onboardGroup}
                onChange={(e) => setOnboardGroup(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">序列</span>
              <select
                value={onboardSequence}
                onChange={(e) => setOnboardSequence(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sequenceOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">周期</span>
              <select
                value={onboardPeriod}
                onChange={(e) => setOnboardPeriod(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="月">月</option>
                <option value="年">年</option>
              </select>
            </div>
          }
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 h-[360px] xl:h-[588px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={onboardComposite.trendData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="period" {...axisProps} />
                  <YAxis
                    yAxisId="left"
                    {...axisProps}
                    label={{ value: '入职人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    {...axisProps}
                    tickFormatter={(val) => `${val}%`}
                    label={{ value: '新员工占比', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="social" name="社招入职" stackId="onboard" fill={CHART_COLORS[0]} />
                  <Bar yAxisId="left" dataKey="campus" name="校招入职" stackId="onboard" fill={CHART_COLORS[1]} />
                  <Bar yAxisId="left" dataKey="referral" name="内推入职" stackId="onboard" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="newRate" name="新员工占比" stroke={CHART_COLORS[4]} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <MiniDonutWithLegend title="序列分布" data={onboardComposite.sequenceData} colorOffset={0} />
              <MiniDonutWithLegend title="职等分布" data={onboardComposite.gradeData} colorOffset={1} />
              <MiniDonutWithLegend title="年龄分布" data={onboardComposite.ageData} colorOffset={2} />
            </div>
          </div>
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Module 10: 校招解约分析 */}
        <ChartPanel 
          title="校招解约分析" 
          extra={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">构成维度</span>
              <select
                value={cancelCompositionType}
                onChange={(e) => setCancelCompositionType(e.target.value as '学历' | '学校类型')}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="学历">学历</option>
                <option value="学校类型">学校类型</option>
              </select>
              <span className="text-xs text-slate-500">基地</span>
              <select
                value={cancelBase}
                onChange={(e) => setCancelBase(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {baseOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部基地' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">部门</span>
              <select
                value={cancelDept}
                onChange={(e) => setCancelDept(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {deptOptions.map((item) => (
                  <option key={item} value={item}>{item === '全部' ? '全部部门' : item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">集团</span>
              <select
                value={cancelGroup}
                onChange={(e) => setCancelGroup(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">序列</span>
              <select
                value={cancelSequence}
                onChange={(e) => setCancelSequence(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {sequenceOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          }
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cancelComposite.data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis
                  yAxisId="left"
                  {...axisProps}
                  label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  {...axisProps}
                  tickFormatter={(val) => `${val}%`}
                  label={{ value: '解约率', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="signCount" name="签约人数" fill={CHART_COLORS[0]} barSize={20} />
                <Bar yAxisId="left" dataKey="cancelCount" name="解约人数" fill={CHART_COLORS[2]} barSize={20} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cancelRate"
                  name="解约率"
                  stroke={CHART_COLORS[4]}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        {/* Module 11: 解约原因分析 */}
        <ChartPanel title="解约原因分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cancelReasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={96}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {cancelReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

    </PageContainer>
  );
}
