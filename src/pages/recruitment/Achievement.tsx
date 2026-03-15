import React, { useState } from 'react';
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

const todayOnboardTrend = [
  { day: '10-01', count: 12 },
  { day: '10-02', count: 15 },
  { day: '10-03', count: 8 },
  { day: '10-04', count: 20 },
  { day: '10-05', count: 18 },
  { day: '10-06', count: 25 },
  { day: '10-07', count: 32 },
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
              {entry.value} {entry.name.includes('率') || entry.name.includes('比') ? '%' : (entry.name.includes('周期') ? '天' : '人')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
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
  const [onboardDim, setOnboardDim] = useState('基地');
  const [campusCancelDim, setCampusCancelDim] = useState('学校');
  const [onboardDateRange, setOnboardDateRange] = useState('今天');
  const [achievementGroup, setAchievementGroup] = useState('医疗');

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
        <div className="flex justify-end mb-4">
          <select 
            value={onboardDateRange}
            onChange={(e) => setOnboardDateRange(e.target.value)}
            className="text-sm border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="今天">今天</option>
            <option value="本周">本周</option>
            <option value="本月">本月</option>
          </select>
        </div>
        <ChartPanel title="今日入职数量" className="hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 text-center md:text-left md:w-48">
              <div className="text-sm text-slate-500 mb-2">今日入职人数</div>
              <div className="text-5xl font-bold text-blue-600">32<span className="text-xl text-slate-500 font-normal ml-2">人</span></div>
              <div className="text-sm text-emerald-500 mt-2 font-medium">↑ 15% 较昨日</div>
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

      {/* Module 3: 招聘漏斗 */}
      <div className="mb-6">
        <ChartPanel title="招聘漏斗" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[400px] w-full flex justify-center">
            <ResponsiveContainer width="80%" height="100%">
              <FunnelChart>
                <RechartsTooltip />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                  <LabelList position="center" fill="#fff" stroke="none" dataKey="value" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 4: 招聘渠道分析 */}
      <div className="mb-6">
        <ChartPanel title="招聘渠道转化率分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                <CartesianGrid {...gridProps} horizontal={false} vertical={true} />
                <XAxis type="number" {...axisProps} label={{ value: '转化率 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <YAxis type="category" dataKey="name" {...axisProps} width={80} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="rate" name="转化率" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#64748b', fontSize: 12, formatter: (val: number) => `${val}%` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 5: 校招签约结构 */}
      <div className="mb-6">
        <ChartPanel title="校招签约结构 (学校类型)" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={campusStructureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                >
                  {campusStructureData.map((entry, index) => (
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

      {/* Module 6: 待招需求 */}
      <div className="mb-6">
        <ChartPanel title="待招需求" className="hover:shadow-md transition-shadow duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">岗位</th>
                  <th className="px-6 py-3 font-medium">部门</th>
                  <th className="px-6 py-3 font-medium">基地</th>
                  <th className="px-6 py-3 font-medium text-right">需求人数</th>
                  <th className="px-6 py-3 font-medium text-right">已入职人数</th>
                  <th className="px-6 py-3 font-medium text-right">缺口人数</th>
                  <th className="px-6 py-3 font-medium text-right">招聘周期</th>
                </tr>
              </thead>
              <tbody>
                {pendingDemands.map((row) => (
                  <tr key={row.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{row.position}</td>
                    <td className="px-6 py-4 text-slate-600">{row.dept}</td>
                    <td className="px-6 py-4 text-slate-600">{row.base}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{row.demand}</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">{row.onboard}</td>
                    <td className="px-6 py-4 text-right text-rose-500 font-medium">{row.gap}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{row.cycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartPanel>
      </div>

      {/* Module 7: 解约人数 */}
      <div className="mb-6">
        <ChartPanel title="解约人数趋势" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cancelData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '解约人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" name="解约人数" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 8: 签约解约比 */}
      <div className="mb-6">
        <ChartPanel title="签约解约比" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={signCancelRatioData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis yAxisId="left" {...axisProps} label={{ value: '人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 20 }} />
                <YAxis yAxisId="right" orientation="right" {...axisProps} label={{ value: '解约比 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -20 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="sign" name="签约人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="left" dataKey="cancel" name="解约人数" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} barSize={24} />
                <Line yAxisId="right" type="monotone" dataKey="ratio" name="签约解约比" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 9: 入职人数分析 */}
      <div className="mb-6">
        <ChartPanel 
          title="入职人数分析" 
          extra={<Tabs options={['基地', '部门', '招聘类型']} active={onboardDim} onChange={setOnboardDim} />}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={onboardAnalysisData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '入职人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="社招" stackId="a" fill={CHART_COLORS[0]} barSize={40} />
                <Bar dataKey="校招" stackId="a" fill={CHART_COLORS[1]} />
                <Bar dataKey="内推" stackId="a" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 10: 校招解约分析 */}
      <div className="mb-6">
        <ChartPanel 
          title="校招解约分析" 
          extra={<Tabs options={['学校', '专业', '基地']} active={campusCancelDim} onChange={setCampusCancelDim} />}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campusCancelData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="name" {...axisProps} />
                <YAxis {...axisProps} label={{ value: '解约人数', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" name="解约人数" fill={CHART_COLORS[5]} radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>
      </div>

      {/* Module 11: 解约原因分析 */}
      <div className="mb-6">
        <ChartPanel title="解约原因分析" className="hover:shadow-md transition-shadow duration-200">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cancelReasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
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
