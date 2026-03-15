import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';
import { TreeDropdown } from '@/src/components/ui/TreeDropdown';
import { Calendar } from 'lucide-react';
import {
  ComposedChart,
  BarChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLog } from 'd3-scale';

// Custom Colors
const CHART_COLORS = [
  '#1A93FC',
  '#79D2FB',
  '#66CD7F',
  '#F9D258',
  '#FF9D32',
  '#FF6F73',
  '#9F8EFF',
  '#4EC0E8'
];

// Mock Data for Metrics
const metrics = [
  { id: '1', title: '管理人员占比', value: '11.1', suffix: '%' },
  { id: '2', title: '一线员工占比', value: '68.5', suffix: '%' },
  { id: '3', title: '职能人员占比', value: '20.4', suffix: '%' },
  { id: '4', title: '组织层级数', value: '5', suffix: '' },
  { id: '5', title: '人岗匹配率', value: '92.4', suffix: '%' },
];

// Mock Data for Map
const mapData = [
  { name: "China", cnName: "中国大陆", value: 14719, percent: "76.9%" },
  { name: "Vietnam", cnName: "越南", value: 3015, percent: "15.8%" },
  { name: "Indonesia", cnName: "印度尼西亚", value: 1146, percent: "6%" },
  { name: "Malaysia", cnName: "马来西亚", value: 191, percent: "1%" },
  { name: "United States of America", cnName: "美国", value: 14, percent: "0.1%" },
  { name: "Bangladesh", cnName: "孟加拉国", value: 6, percent: "0.03%" },
  { name: "Hong Kong", cnName: "香港", value: 4, percent: "0.02%" },
  { name: "Germany", cnName: "德国", value: 2, percent: "0.01%" },
  { name: "Canada", cnName: "加拿大", value: 2, percent: "0.01%" },
  { name: "Nepal", cnName: "尼泊尔", value: 2, percent: "0.01%" },
  { name: "Taiwan", cnName: "台湾", value: 1, percent: "0.01%" },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type TreeNode = {
  label: string;
  value: string;
  children?: TreeNode[];
};

export const departmentTree: TreeNode[] = [
  { label: '全部部门', value: 'all' },
  {
    label: '营销&销售', value: '营销&销售', children: [
      { label: '产品', value: '营销&销售/产品' },
      { label: '市场', value: '营销&销售/市场' },
      { label: '销售', value: '营销&销售/销售' },
    ]
  },
  {
    label: '职能', value: '职能', children: [
      { label: '行政', value: '职能/行政' },
      { label: '法务', value: '职能/法务' },
      { label: '证券', value: '职能/证券' },
      { label: 'IT', value: '职能/IT' },
      { label: '人力资源', value: '职能/人力资源' },
      { label: '财务', value: '职能/财务' },
    ]
  },
  {
    label: '生产系统', value: '生产系统', children: [
      { label: '供应链', value: '生产系统/供应链' },
      {
        label: '装备', value: '生产系统/装备', children: [
          { label: '装备办公室类-越南', value: '生产系统/装备/装备办公室类-越南' }
        ]
      },
      { label: '物流', value: '生产系统/物流' },
      { label: '生产', value: '生产系统/生产' },
      { label: '研发', value: '生产系统/研发' },
    ]
  },
  {
    label: '管理', value: '管理', children: [
      { label: '基地管理', value: '管理/基地管理' },
      { label: '高层管理', value: '管理/高层管理' },
    ]
  }
];

const colorScale = scaleLog<string>()
  .domain([1, 15000])
  .range(["#E1F0FF", "#1A93FC"]);

// All available months (24 months)
const allMonths = [
  '2024.04', '2024.05', '2024.06', '2024.07', '2024.08', '2024.09', '2024.10', '2024.11', '2024.12',
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09',
  '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'
];

// Mock Data for Trend Chart
const fullTrendData = allMonths.map((month, index) => {
  const baseSpan = 8.0;
  const baseRatio = 12.5;
  return {
    month,
    span: Number((baseSpan + index * 0.05 + Math.random() * 0.2).toFixed(1)),
    ratio: Number((baseRatio - index * 0.05 + Math.random() * 0.3).toFixed(1))
  };
});

// Mock Data for Rank Distribution Trend
const rankSeries = [
  { name: 'P1\\S1\\T1\\O2', base: 29.6 },
  { name: 'P2\\S2\\T2\\O3\\R1', base: 23.7 },
  { name: 'P3\\S3\\T3\\O4\\R2', base: 19.6 },
  { name: 'P4\\S4\\T4\\O5\\R3', base: 9.0 },
  { name: 'P5\\S5\\T5\\R4', base: 1.6 },
  { name: 'P6\\S6\\T6\\R5', base: 0.2 },
  { name: '管理人员', base: 16.3 },
];

const fullRankData = allMonths.map((month, index) => {
  const data: any = { month };
  rankSeries.forEach(series => {
    // Add some random fluctuation, ensure no negative values
    data[series.name] = Math.max(0, Number((series.base + (Math.random() * 2 - 1)).toFixed(1)));
  });
  return data;
});

const RankTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-800">
              {(entry.value * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-800">
              {entry.value}{entry.dataKey === 'ratio' ? '%' : '人'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OrgStructurePage() {
  const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number; x: number; y: number } | null>(null);
  const [selectedDept, setSelectedDept] = useState('all');

  // Range selection state for Management Span
  const [spanStartMonth, setSpanStartMonth] = useState('2025.04');
  const [spanEndMonth, setSpanEndMonth] = useState('2026.03');

  // Range selection state for Rank Distribution
  const [rankStartMonth, setRankStartMonth] = useState('2025.04');
  const [rankEndMonth, setRankEndMonth] = useState('2026.03');

  const filteredTrendData = useMemo(() => {
    const startIndex = fullTrendData.findIndex(d => d.month === spanStartMonth);
    const endIndex = fullTrendData.findIndex(d => d.month === spanEndMonth);
    if (startIndex === -1 || endIndex === -1) return fullTrendData.slice(-12);
    
    let start = Math.min(startIndex, endIndex);
    let end = Math.max(startIndex, endIndex);
    
    if (end - start >= 12) end = start + 11;
    
    return fullTrendData.slice(start, end + 1);
  }, [spanStartMonth, spanEndMonth]);

  const filteredRankData = useMemo(() => {
    const startIndex = fullRankData.findIndex(d => d.month === rankStartMonth);
    const endIndex = fullRankData.findIndex(d => d.month === rankEndMonth);
    if (startIndex === -1 || endIndex === -1) return fullRankData.slice(-12);
    
    let start = Math.min(startIndex, endIndex);
    let end = Math.max(startIndex, endIndex);
    
    if (end - start >= 12) end = start + 11;
    
    return fullRankData.slice(start, end + 1);
  }, [rankStartMonth, rankEndMonth]);

  const handleSpanStartChange = (val: string) => {
    setSpanStartMonth(val);
    const sIdx = allMonths.indexOf(val);
    const eIdx = allMonths.indexOf(spanEndMonth);
    if (eIdx < sIdx) setSpanEndMonth(val);
    else if (eIdx - sIdx >= 12) setSpanEndMonth(allMonths[sIdx + 11]);
  };

  const handleSpanEndChange = (val: string) => {
    setSpanEndMonth(val);
    const sIdx = allMonths.indexOf(spanStartMonth);
    const eIdx = allMonths.indexOf(val);
    if (eIdx < sIdx) setSpanStartMonth(val);
    else if (eIdx - sIdx >= 12) setSpanStartMonth(allMonths[eIdx - 11]);
  };

  const handleRankStartChange = (val: string) => {
    setRankStartMonth(val);
    const sIdx = allMonths.indexOf(val);
    const eIdx = allMonths.indexOf(rankEndMonth);
    if (eIdx < sIdx) setRankEndMonth(val);
    else if (eIdx - sIdx >= 12) setRankEndMonth(allMonths[sIdx + 11]);
  };

  const handleRankEndChange = (val: string) => {
    setRankEndMonth(val);
    const sIdx = allMonths.indexOf(rankStartMonth);
    const eIdx = allMonths.indexOf(val);
    if (eIdx < sIdx) setRankStartMonth(val);
    else if (eIdx - sIdx >= 12) setRankStartMonth(allMonths[eIdx - 11]);
  };

  const DateRangeSelector = ({ start, end, onStartChange, onEndChange }: any) => (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-slate-400" />
      <select 
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white outline-none focus:border-blue-500"
      >
        {allMonths.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <span className="text-slate-400 text-xs">-</span>
      <select 
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white outline-none focus:border-blue-500"
      >
        {allMonths.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );

  const currentMapData = useMemo(() => {
    if (selectedDept === 'all') return mapData;
    
    // Deterministic mock data based on the selected department
    const scaleFactor = 0.1 + (selectedDept.length % 5) * 0.1; // 0.1 to 0.5
    
    let total = 0;
    const newData = mapData.map(item => {
      const variation = 0.8 + ((item.name.length + selectedDept.length) % 5) * 0.1;
      const newValue = Math.max(1, Math.floor(item.value * scaleFactor * variation));
      total += newValue;
      return { ...item, value: newValue };
    });
    
    // Recalculate percentages and sort
    return newData.map(item => ({
      ...item,
      percent: ((item.value / total) * 100).toFixed(1) + '%'
    })).sort((a, b) => b.value - a.value);
  }, [selectedDept]);

  return (
    <PageContainer title="组织结构分析">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            suffix={metric.suffix}
            className="hover:shadow-md transition-shadow duration-200"
          />
        ))}
      </div>

      {/* Charts Row 2: Map and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Map Chart */}
        <Card title="全球人力分布" className="hover:shadow-md transition-shadow duration-200 relative">
          <div className="h-[400px] w-full bg-slate-50/50 rounded-lg overflow-hidden relative">
            <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400}>
              <ZoomableGroup center={[0, 20]}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const d = currentMapData.find((s) => s.name === geo.properties.name);
                      // Fallback for Taiwan and Hong Kong if they are mapped differently in the topojson
                      let matchedData = d;
                      if (!matchedData && geo.properties.name === "Taiwan") {
                        matchedData = currentMapData.find(s => s.name === "Taiwan");
                      }
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={matchedData ? (colorScale(matchedData.value) as string) : "#F1F5F9"}
                          stroke="#CBD5E1"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: matchedData ? "#FF9D32" : "#E2E8F0", outline: "none", cursor: matchedData ? "pointer" : "default" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={(e) => {
                            if (matchedData) {
                              const { clientX, clientY } = e;
                              // Get relative position to the card container
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltipContent({
                                name: matchedData.cnName,
                                value: matchedData.value,
                                x: clientX,
                                y: clientY
                              });
                            }
                          }}
                          onMouseMove={(e) => {
                            if (matchedData) {
                              setTooltipContent(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                            }
                          }}
                          onMouseLeave={() => {
                            setTooltipContent(null);
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            
            {/* Custom Map Tooltip */}
            {tooltipContent && (
              <div 
                className="fixed bg-white px-3 py-2 border border-slate-200 shadow-lg rounded-md text-sm pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mt-[-10px]"
                style={{ left: tooltipContent.x, top: tooltipContent.y }}
              >
                <div className="font-medium text-slate-800 mb-1">{tooltipContent.name}</div>
                <div className="text-slate-600">人数: <span className="font-semibold text-slate-900">{tooltipContent.value.toLocaleString()}</span></div>
              </div>
            )}
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-sm border border-slate-200 text-xs flex items-center gap-2">
              <span className="text-slate-500 font-medium">1人</span>
              <div className="w-24 h-3 rounded" style={{ background: `linear-gradient(to right, #E1F0FF, #1A93FC)` }} />
              <span className="text-slate-500 font-medium">15,000人</span>
            </div>
          </div>
        </Card>

        {/* Region Table */}
        <Card 
          title="各地区人力分布明细" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <TreeDropdown 
              value={selectedDept} 
              onChange={setSelectedDept} 
              options={departmentTree} 
            />
          }
        >
          <div className="h-[400px] overflow-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-600 bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 font-medium border-b border-slate-200 text-center w-16">排名</th>
                  <th className="py-3 px-4 font-medium border-b border-slate-200">地区</th>
                  <th className="py-3 px-4 font-medium border-b border-slate-200 text-right">人数</th>
                  <th className="py-3 px-4 font-medium border-b border-slate-200 text-right">占比</th>
                </tr>
              </thead>
              <tbody>
                {currentMapData.map((item, index) => {
                  const rank = index + 1;
                  const isTop1 = rank === 1;
                  return (
                    <tr key={item.name} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isTop1 ? 'bg-green-50/60' : 'bg-white'}`}>
                      <td className={`py-2.5 px-4 text-center font-medium ${isTop1 ? 'text-green-600' : 'text-slate-700'}`}>{rank}</td>
                      <td className="py-2.5 px-4 text-slate-700">{item.cnName}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-700">{item.value.toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">{item.percent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Charts Row 3: Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card 
          title="管理幅度 / 管理者占比趋势" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <DateRangeSelector 
              start={spanStartMonth} 
              end={spanEndMonth} 
              onStartChange={handleSpanStartChange} 
              onEndChange={handleSpanEndChange} 
            />
          }
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredTrendData} margin={{ top: 30, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis 
                  dataKey="month" 
                  {...axisProps} 
                  angle={-45} 
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  {...axisProps} 
                  tickFormatter={(val) => `${val}人`}
                  domain={['auto', 'auto']}
                  label={{ value: '管理幅度 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: -10 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  {...axisProps} 
                  tickFormatter={(val) => `${val}%`}
                  domain={['auto', 'auto']}
                  label={{ value: '管理者占比 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 10 }}
                />
                <RechartsTooltip content={<TrendTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', bottom: -10 }} />
                <Bar 
                  yAxisId="left"
                  dataKey="span" 
                  name="管理幅度" 
                  fill={CHART_COLORS[0]} 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ratio" 
                  name="管理者占比" 
                  stroke={CHART_COLORS[2]} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="各职级占比趋势图" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <DateRangeSelector 
              start={rankStartMonth} 
              end={rankEndMonth} 
              onStartChange={handleRankStartChange} 
              onEndChange={handleRankEndChange} 
            />
          }
        >
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredRankData} margin={{ top: 30, right: 20, left: 20, bottom: 20 }} stackOffset="expand">
                <CartesianGrid {...gridProps} />
                <XAxis 
                  dataKey="month" 
                  {...axisProps} 
                  angle={-45} 
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  {...axisProps} 
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                  label={{ value: '占比 (%)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 10 }}
                />
                <RechartsTooltip content={<RankTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: -15 }} />
                {rankSeries.map((series, index) => (
                  <Area 
                    key={series.name}
                    type="monotone"
                    dataKey={series.name} 
                    name={series.name} 
                    stackId="1"
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
