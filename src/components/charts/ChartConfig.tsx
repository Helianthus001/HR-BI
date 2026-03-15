import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// 科技蓝配色体系
export const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

// 统一的 Tooltip 样式
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
        <p className="font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-slate-600">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold text-slate-800">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 统一的坐标轴样式配置
export const axisProps = {
  tick: { fill: '#64748b', fontSize: 12 },
  axisLine: { stroke: '#e2e8f0' },
  tickLine: { stroke: '#e2e8f0' },
};

// 统一的网格线样式
export const gridProps = {
  strokeDasharray: '3 3',
  vertical: false,
  stroke: '#f1f5f9',
};
