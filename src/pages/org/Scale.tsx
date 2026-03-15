import React, { useMemo, useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/utils/cn';
import { ChevronDown, Calendar } from 'lucide-react';
import {
  ComposedChart,
  BarChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { axisProps, gridProps } from '@/src/components/charts/ChartConfig';

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

// Mock Data
const metrics = [
  { id: '1', title: '当前在职人数', value: '12,450', suffix: '人' },
  { id: '2', title: '年度净增人数', value: '320', prefix: '+', suffix: '人' },
  { id: '3', title: '人员增长率', value: '2.6', suffix: '%' },
  { id: '4', title: '在编率', value: '95.2', suffix: '%' },
  { id: '5', title: '人均管辖人数', value: '8.5', suffix: '人' },
];

// All available months (24 months)
const allMonths = [
  '2024.04', '2024.05', '2024.06', '2024.07', '2024.08', '2024.09', '2024.10', '2024.11', '2024.12',
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06', '2025.07', '2025.08', '2025.09',
  '2025.10', '2025.11', '2025.12', '2026.01', '2026.02', '2026.03'
];

// Months for table (latest 12, reversed for display)
const months = [...allMonths].slice(-12).reverse();

// Generate random data for a company (ensuring no negative numbers)
const generateData = (base: number) => {
  let current = base;
  // Generate data for all 24 months
  const allData = allMonths.map(() => {
    const change = Math.floor(Math.random() * 100 - 45);
    current = Math.max(0, current + change);
    return current;
  });
  // Return reversed latest 12 for the table
  return allData.slice(-12).reverse();
};

const tableData = [
  {
    group: '英科医疗',
    companies: [
      { name: '临淄英科医疗', data: generateData(1200) },
      { name: '张店英科医疗', data: generateData(850) },
      { name: '山东英科卫生用品有限公司', data: generateData(2100) },
      { name: '青州英科医疗', data: generateData(1500) },
      { name: '山东英科印刷科技有限公司', data: generateData(400) },
      { name: '上海英恩', data: generateData(150) },
      { name: '上海英科心电图', data: generateData(200) },
      { name: '英科医疗合计', isTotal: true, data: [] },
    ]
  },
  {
    group: '英科再生',
    companies: [
      { name: '山东英科再生', data: generateData(3100) },
      { name: '上海英科再生', data: generateData(2500) },
      { name: '杭州英卓家居', data: generateData(800) },
      { name: '江苏英科再生', data: generateData(1200) },
      { name: '英科再生合计', isTotal: true, data: [] },
    ]
  }
];

// Calculate totals
tableData.forEach(group => {
  const totalRow = group.companies.find(c => c.isTotal);
  if (totalRow) {
    totalRow.data = months.map((_, i) => 
      group.companies.filter(c => !c.isTotal).reduce((sum, child) => sum + child.data[i], 0)
    );
  }
});

// Calculate Grand Total
const grandTotalData = months.map((_, i) => {
  return tableData.reduce((sum, g) => {
    const total = g.companies.find(c => c.isTotal)?.data[i] || 0;
    return sum + total;
  }, 0);
});

// Turnover Trend Data (Oldest to Newest for charts)
const fullTurnoverData = allMonths.map((month) => {
  const hires = Math.floor(Math.random() * 200) + 100;
  const terms = Math.floor(Math.random() * 150) + 80;
  return {
    month,
    hires,
    terms,
    net: hires - terms,
  };
});

// Structure Ratio Data
const fullStructureData = allMonths.map((month) => {
  return {
    month,
    sales: Math.floor(1500 + Math.random() * 200),
    func: Math.floor(1000 + Math.random() * 100),
    prod: Math.floor(6500 + Math.random() * 300),
    mgmt: Math.floor(1000 + Math.random() * 100),
  };
});

// Custom Tooltip for Structure Chart
const StructureTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Calculate total for the month
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">{entry.value}人</span>
                <span className="text-slate-500 w-12 text-right">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Turnover Chart
const TurnoverTooltip = ({ active, payload, label }: any) => {
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
            <span className="font-medium text-slate-800">{entry.value}人</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OrgScalePage() {
  // Range selection state for Turnover Trend
  const [turnoverStartMonth, setTurnoverStartMonth] = useState('2025.04');
  const [turnoverEndMonth, setTurnoverEndMonth] = useState('2026.03');

  // Range selection state for Structure Ratio
  const [structureStartMonth, setStructureStartMonth] = useState('2025.04');
  const [structureEndMonth, setStructureEndMonth] = useState('2026.03');

  const filteredTurnoverData = useMemo(() => {
    const startIndex = fullTurnoverData.findIndex(d => d.month === turnoverStartMonth);
    const endIndex = fullTurnoverData.findIndex(d => d.month === turnoverEndMonth);
    if (startIndex === -1 || endIndex === -1) return fullTurnoverData.slice(-12);
    
    let start = Math.min(startIndex, endIndex);
    let end = Math.max(startIndex, endIndex);
    
    if (end - start >= 12) {
      end = start + 11;
    }
    
    return fullTurnoverData.slice(start, end + 1);
  }, [turnoverStartMonth, turnoverEndMonth]);

  const filteredStructureData = useMemo(() => {
    const startIndex = fullStructureData.findIndex(d => d.month === structureStartMonth);
    const endIndex = fullStructureData.findIndex(d => d.month === structureEndMonth);
    if (startIndex === -1 || endIndex === -1) return fullStructureData.slice(-12);
    
    let start = Math.min(startIndex, endIndex);
    let end = Math.max(startIndex, endIndex);
    
    if (end - start >= 12) {
      end = start + 11;
    }
    
    return fullStructureData.slice(start, end + 1);
  }, [structureStartMonth, structureEndMonth]);

  // Calculate total rows for the first column rowspan (+1 for grand total row)
  const totalRows = tableData.reduce((sum, group) => sum + group.companies.length, 0) + 1;

  const monthOptions = [...allMonths].reverse();

  const handleTurnoverStartChange = (val: string) => {
    setTurnoverStartMonth(val);
    const sIdx = allMonths.indexOf(val);
    const eIdx = allMonths.indexOf(turnoverEndMonth);
    if (eIdx < sIdx) setTurnoverEndMonth(val);
    else if (eIdx - sIdx >= 12) setTurnoverEndMonth(allMonths[sIdx + 11]);
  };

  const handleTurnoverEndChange = (val: string) => {
    setTurnoverEndMonth(val);
    const sIdx = allMonths.indexOf(turnoverStartMonth);
    const eIdx = allMonths.indexOf(val);
    if (eIdx < sIdx) setTurnoverStartMonth(val);
    else if (eIdx - sIdx >= 12) setTurnoverStartMonth(allMonths[eIdx - 11]);
  };

  const handleStructureStartChange = (val: string) => {
    setStructureStartMonth(val);
    const sIdx = allMonths.indexOf(val);
    const eIdx = allMonths.indexOf(structureEndMonth);
    if (eIdx < sIdx) setStructureEndMonth(val);
    else if (eIdx - sIdx >= 12) setStructureEndMonth(allMonths[sIdx + 11]);
  };

  const handleStructureEndChange = (val: string) => {
    setStructureEndMonth(val);
    const sIdx = allMonths.indexOf(structureStartMonth);
    const eIdx = allMonths.indexOf(val);
    if (eIdx < sIdx) setStructureStartMonth(val);
    else if (eIdx - sIdx >= 12) setStructureStartMonth(allMonths[eIdx - 11]);
  };

  const DateRangeSelector = ({ start, end, onStartChange, onEndChange }: any) => (
    <div className="flex items-center gap-2">
      <select 
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      >
        {monthOptions.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <span className="text-slate-400 text-xs">-</span>
      <select 
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
      >
        {monthOptions.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );

  return (
    <PageContainer title="组织规模趋势">
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

      {/* Table */}
      <Card title="组织总人数（在职员工报表）" className="mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-separate border-spacing-0 min-w-[1200px] border-t border-l border-slate-300">
            <thead className="text-slate-700 bg-slate-100 sticky top-0 z-20">
              <tr>
                <th className="border-b border-r border-slate-300 sticky left-0 bg-slate-100 z-30" style={{ width: 40, minWidth: 40 }}></th>
                <th className="border-b border-r border-slate-300 sticky bg-slate-100 z-30" style={{ left: 40, width: 40, minWidth: 40 }}></th>
                <th className="px-2 py-2 font-medium border-b border-r border-slate-300 sticky bg-slate-100 z-30" style={{ left: 80, width: 200, minWidth: 200 }}>公司</th>
                {months.map(month => (
                  <th key={month} className="px-2 py-2 font-medium border-b border-r border-slate-300 min-w-[70px]">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  {group.companies.map((company, cIdx) => {
                    const isTotal = company.isTotal;
                    return (
                      <tr 
                        key={company.name} 
                        className={cn(
                          "hover:bg-slate-50 transition-colors",
                          isTotal && "bg-blue-50 font-medium"
                        )}
                      >
                        {/* First column: 英科在职员工报表 (only on very first row) */}
                        {gIdx === 0 && cIdx === 0 && (
                          <td 
                            rowSpan={totalRows} 
                            className="border-b border-r border-slate-300 bg-teal-50 font-medium text-slate-700 sticky left-0 z-10"
                            style={{ width: 40, minWidth: 40, writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
                          >
                            英科在职员工报表
                          </td>
                        )}
                        
                        {/* Second column: Group Name (only on first row of each group) */}
                        {cIdx === 0 && (
                          <td 
                            rowSpan={group.companies.length} 
                            className="border-b border-r border-slate-300 bg-teal-50 font-medium text-slate-700 sticky z-10"
                            style={{ left: 40, width: 40, minWidth: 40, writingMode: 'vertical-rl', letterSpacing: '0.1em' }}
                          >
                            {group.group}
                          </td>
                        )}

                        {/* Third column: Company Name */}
                        <td 
                          className={cn(
                            "px-2 py-1.5 border-b border-r border-slate-300 text-left sticky z-10",
                            isTotal ? "bg-blue-50" : "bg-white"
                          )}
                          style={{ left: 80, minWidth: 200 }}
                        >
                          {company.name}
                        </td>

                        {/* Data columns */}
                        {company.data.map((val: number, i: number) => {
                          // Only highlight the latest month (i === 0) compared to the previous month (i === 1)
                          const isHighlighted = i === 0 && Math.abs(val - company.data[1]) > 50 && !isTotal;
                          
                          return (
                            <td 
                              key={i} 
                              className={cn(
                                "px-2 py-1.5 border-b border-r border-slate-300 tabular-nums",
                                isHighlighted && "bg-yellow-200/80 text-yellow-900 font-medium"
                              )}
                            >
                              {val.toLocaleString()}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
              {/* Grand Total Row */}
              <tr className="hover:bg-slate-50 transition-colors bg-blue-100 font-semibold">
                <td 
                  colSpan={2} 
                  className="border-b border-r border-slate-300 bg-blue-100 text-center sticky z-10"
                  style={{ left: 40, minWidth: 240 }}
                >
                  英科合计
                </td>
                {grandTotalData.map((val, i) => (
                  <td key={i} className="px-2 py-1.5 border-b border-r border-slate-300 tabular-nums">
                    {val.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="text-xs text-slate-500 mt-2 text-right">
            注：当月公司人数与上月月底人数对比，超过50人异动，使用黄色底色标出。
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="人员流动趋势" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <DateRangeSelector 
              start={turnoverStartMonth} 
              end={turnoverEndMonth} 
              onStartChange={handleTurnoverStartChange} 
              onEndChange={handleTurnoverEndChange} 
            />
          }
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredTurnoverData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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
                <YAxis {...axisProps} />
                <Tooltip content={<TurnoverTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                <Bar dataKey="hires" name="入职人数" stackId="a" fill={CHART_COLORS[0]} radius={[0, 0, 2, 2]} barSize={24} />
                <Bar dataKey="terms" name="离职人数" stackId="a" fill={CHART_COLORS[5]} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="net" name="净增人数" stroke={CHART_COLORS[3]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="组织结构占比趋势" 
          className="hover:shadow-md transition-shadow duration-200"
          extra={
            <DateRangeSelector 
              start={structureStartMonth} 
              end={structureEndMonth} 
              onStartChange={handleStructureStartChange} 
              onEndChange={handleStructureEndChange} 
            />
          }
        >
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredStructureData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} stackOffset="expand">
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
                <YAxis {...axisProps} tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
                <Tooltip content={<StructureTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
                <Bar dataKey="sales" name="营销&销售" stackId="a" fill={CHART_COLORS[0]} />
                <Bar dataKey="func" name="职能" stackId="a" fill={CHART_COLORS[1]} />
                <Bar dataKey="prod" name="生产系统" stackId="a" fill={CHART_COLORS[2]} />
                <Bar dataKey="mgmt" name="管理" stackId="a" fill={CHART_COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}


