import React, { useMemo, useState } from 'react';
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
  { month: '24.04', date: '2024-04-01', mLevel: 82, p3Plus: 480, bachelorPlus: 650, ageUnder30: 480 },
  { month: '24.05', date: '2024-05-01', mLevel: 83, p3Plus: 485, bachelorPlus: 655, ageUnder30: 485 },
  { month: '24.06', date: '2024-06-01', mLevel: 83, p3Plus: 490, bachelorPlus: 660, ageUnder30: 490 },
  { month: '24.07', date: '2024-07-01', mLevel: 85, p3Plus: 495, bachelorPlus: 665, ageUnder30: 495 },
  { month: '24.08', date: '2024-08-01', mLevel: 85, p3Plus: 500, bachelorPlus: 670, ageUnder30: 500 },
  { month: '24.09', date: '2024-09-01', mLevel: 86, p3Plus: 505, bachelorPlus: 675, ageUnder30: 500 },
  { month: '24.10', date: '2024-10-01', mLevel: 88, p3Plus: 508, bachelorPlus: 680, ageUnder30: 500 },
  { month: '24.11', date: '2024-11-01', mLevel: 88, p3Plus: 510, bachelorPlus: 685, ageUnder30: 500 },
  { month: '24.12', date: '2024-12-01', mLevel: 89, p3Plus: 510, bachelorPlus: 690, ageUnder30: 500 },
  { month: '25.01', date: '2025-01-01', mLevel: 90, p3Plus: 512, bachelorPlus: 695, ageUnder30: 500 },
  { month: '25.02', date: '2025-02-01', mLevel: 90, p3Plus: 515, bachelorPlus: 698, ageUnder30: 500 },
  { month: '25.03', date: '2025-03-01', mLevel: 90, p3Plus: 510, bachelorPlus: 698, ageUnder30: 500 },
];

const levelSeries = ['P1', 'P2', 'P3', 'P4', 'P5', 'M1', 'M2', 'M3'] as const;
const groupOptions = ['全部集团', '医疗集团', '再生集团'];
const levelDimOptions = [
  { key: 'dept', label: '部门', second: ['研发中心', '生产系统', '营销中心', '职能支持'] },
  { key: 'base', label: '基地', second: ['张店', '临淄', '上海', '江西'] },
  { key: 'group', label: '集团', second: ['医疗集团', '再生集团'] },
] as const;
const levelPieDimOptions = [
  { key: 'dept', label: '部门', second: ['研发中心', '生产系统', '营销中心', '职能支持'] },
  { key: 'base', label: '基地', second: ['张店', '临淄', '上海', '江西'] },
  { key: 'group', label: '集团', second: ['医疗集团', '再生集团'] },
] as const;

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
  { name: '张店', '<1年': 60, '1-3年': 150, '3-5年': 120, '5-10年': 90, '>10年': 40 },
  { name: '临淄', '<1年': 40, '1-3年': 90, '3-5年': 80, '5-10年': 50, '>10年': 25 },
  { name: '上海', '<1年': 30, '1-3年': 65, '3-5年': 55, '5-10年': 35, '>10年': 15 },
  { name: '江西', '<1年': 20, '1-3年': 45, '3-5年': 35, '5-10年': 20, '>10年': 10 },
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
  { name: '张店', '博士': 12, '硕士': 60, '本科': 250, '大专': 90, '高中及以下': 48 },
  { name: '临淄', '博士': 4, '硕士': 30, '本科': 150, '大专': 50, '高中及以下': 26 },
  { name: '上海', '博士': 2, '硕士': 14, '本科': 100, '大专': 60, '高中及以下': 34 },
  { name: '江西', '博士': 2, '硕士': 10, '本科': 64, '大专': 40, '高中及以下': 14 },
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
  { name: '张店', '<25岁': 60, '25-30岁': 160, '31-35岁': 140, '36-40岁': 70, '>40岁': 30 },
  { name: '临淄', '<25岁': 40, '25-30岁': 90, '31-35岁': 80, '36-40岁': 40, '>40岁': 10 },
  { name: '上海', '<25岁': 30, '25-30岁': 60, '31-35岁': 50, '36-40岁': 40, '>40岁': 30 },
  { name: '江西', '<25岁': 20, '25-30岁': 40, '31-35岁': 30, '36-40岁': 20, '>40岁': 10 },
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
  const [levelBarStartDate, setLevelBarStartDate] = useState('2024-04-01');
  const [levelBarEndDate, setLevelBarEndDate] = useState('2025-03-01');
  const [levelBarDim, setLevelBarDim] = useState<(typeof levelDimOptions)[number]['key']>('dept');
  const [levelBarSecond, setLevelBarSecond] = useState('研发中心');

  const [levelPieStartDate, setLevelPieStartDate] = useState('2024-04-01');
  const [levelPieEndDate, setLevelPieEndDate] = useState('2025-03-01');
  const [levelPieDim, setLevelPieDim] = useState<(typeof levelPieDimOptions)[number]['key']>('dept');
  const [levelPieSecond, setLevelPieSecond] = useState('研发中心');

  const [mTrendStartDate, setMTrendStartDate] = useState('2024-04-01');
  const [mTrendEndDate, setMTrendEndDate] = useState('2025-03-01');
  const [mTrendGroup, setMTrendGroup] = useState('全部集团');

  const [p3TrendStartDate, setP3TrendStartDate] = useState('2024-04-01');
  const [p3TrendEndDate, setP3TrendEndDate] = useState('2025-03-01');
  const [p3TrendGroup, setP3TrendGroup] = useState('全部集团');
  const [p3TrendBase, setP3TrendBase] = useState('全部基地');
  const [p3TrendDept, setP3TrendDept] = useState('全部部门');
  const [tenureStructStartDate, setTenureStructStartDate] = useState('2024-04-01');
  const [tenureStructEndDate, setTenureStructEndDate] = useState('2025-03-01');
  const [tenureStructGroup, setTenureStructGroup] = useState<'医疗集团' | '再生集团'>('医疗集团');
  const [tenureDistStartDate, setTenureDistStartDate] = useState('2024-04-01');
  const [tenureDistEndDate, setTenureDistEndDate] = useState('2025-03-01');
  const [tenureDistDim, setTenureDistDim] = useState<'dept' | 'base'>('dept');
  const [eduStructStartDate, setEduStructStartDate] = useState('2024-04-01');
  const [eduStructEndDate, setEduStructEndDate] = useState('2025-03-01');
  const [eduStructGroup, setEduStructGroup] = useState<'医疗集团' | '再生集团'>('医疗集团');
  const [eduDistStartDate, setEduDistStartDate] = useState('2024-04-01');
  const [eduDistEndDate, setEduDistEndDate] = useState('2025-03-01');
  const [eduDistDim, setEduDistDim] = useState<'dept' | 'base'>('dept');
  const [eduTrendStartDate, setEduTrendStartDate] = useState('2024-04-01');
  const [eduTrendEndDate, setEduTrendEndDate] = useState('2025-03-01');
  const [eduTrendGroup, setEduTrendGroup] = useState<'医疗集团' | '再生集团'>('医疗集团');
  const [ageStructStartDate, setAgeStructStartDate] = useState('2024-04-01');
  const [ageStructEndDate, setAgeStructEndDate] = useState('2025-03-01');
  const [ageStructGroup, setAgeStructGroup] = useState<'医疗集团' | '再生集团'>('医疗集团');
  const [ageDistStartDate, setAgeDistStartDate] = useState('2024-04-01');
  const [ageDistEndDate, setAgeDistEndDate] = useState('2025-03-01');
  const [ageDistDim, setAgeDistDim] = useState<'dept' | 'base'>('dept');
  const [ageTrendStartDate, setAgeTrendStartDate] = useState('2024-04-01');
  const [ageTrendEndDate, setAgeTrendEndDate] = useState('2025-03-01');
  const [ageTrendGroup, setAgeTrendGroup] = useState<'医疗集团' | '再生集团'>('医疗集团');

  const baseOptions = ['全部基地', '张店', '临淄', '上海', '江西'];
  const deptOptions = ['全部部门', '研发中心', '生产系统', '营销中心', '职能支持'];
  const filterByRange = <T extends { date: string }>(data: T[], startDate: string, endDate: string) => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const filtered = valid
      ? data.filter((item) => {
          const current = new Date(`${item.date}T00:00:00`);
          return current >= start && current <= end;
        })
      : data;
    return filtered.length ? filtered : data;
  };

  const buildLevelStructureTrend = (
    startDate: string,
    endDate: string,
    dim: (typeof levelDimOptions)[number]['key'],
    second: string
  ) => {
    const source = filterByRange(trend12Months, startDate, endDate);
    const baseFactorMap: Record<string, number> = {
      '研发中心': 0.9,
      '生产系统': 1.12,
      '营销中心': 1.0,
      '职能支持': 0.86,
      '张店': 1.06,
      '临淄': 1.1,
      '上海': 0.96,
      '江西': 0.9,
      '医疗集团': 1.06,
      '再生集团': 0.94,
    };
    const dimFactor = baseFactorMap[second] ?? 1;

    const gradeBase: Record<string, number> = { P1: 120, P2: 350, P3: 280, P4: 150, P5: 80, M1: 50, M2: 30, M3: 10 };
    return source.map((item, idx) => {
      const wave = 1 + Math.sin((idx + 1) * 0.7) * 0.04;
      const row: Record<string, string | number> = { period: item.month };
      levelSeries.forEach((lv, lvIdx) => {
        const levelBoost = 1 + (lvIdx - 3) * 0.02;
        row[lv] = Math.max(1, Math.round(gradeBase[lv] * dimFactor * wave * levelBoost));
      });
      return row as any;
    });
  };

  const levelBarSecondOptions = useMemo(
    () => levelDimOptions.find((item) => item.key === levelBarDim)?.second ?? [],
    [levelBarDim]
  );
  const levelPieSecondOptions = useMemo(
    () => levelPieDimOptions.find((item) => item.key === levelPieDim)?.second ?? [],
    [levelPieDim]
  );

  const levelStructureTrend = useMemo(
    () => buildLevelStructureTrend(levelBarStartDate, levelBarEndDate, levelBarDim, levelBarSecond),
    [levelBarStartDate, levelBarEndDate, levelBarDim, levelBarSecond]
  );

  const levelPieSourceTrend = useMemo(
    () => buildLevelStructureTrend(levelPieStartDate, levelPieEndDate, levelPieDim as (typeof levelDimOptions)[number]['key'], levelPieSecond),
    [levelPieStartDate, levelPieEndDate, levelPieDim, levelPieSecond]
  );

  const levelPieDynamic = useMemo(() => {
    const totalByLevel: Record<string, number> = {};
    levelSeries.forEach((lv) => { totalByLevel[lv] = 0; });
    levelPieSourceTrend.forEach((row: any) => {
      levelSeries.forEach((lv) => {
        totalByLevel[lv] += Number(row[lv] ?? 0);
      });
    });
    return levelSeries.map((lv) => ({ name: lv, value: totalByLevel[lv] }));
  }, [levelPieSourceTrend]);

  const mTrendData = useMemo(() => {
    const source = filterByRange(trend12Months, mTrendStartDate, mTrendEndDate);
    const groupFactorMap: Record<string, number> = { '全部集团': 1, '医疗集团': 1.08, '再生集团': 0.92 };
    const groupFactor = groupFactorMap[mTrendGroup] ?? 1;
    return source.map((item, idx) => ({
      ...item,
      mLevel: Math.max(1, Math.round(item.mLevel * groupFactor * (1 + Math.cos((idx + 1) * 0.6) * 0.03))),
    }));
  }, [mTrendStartDate, mTrendEndDate, mTrendGroup]);

  const p3TrendData = useMemo(() => {
    const source = filterByRange(trend12Months, p3TrendStartDate, p3TrendEndDate);
    const groupFactorMap: Record<string, number> = { '全部集团': 1, '医疗集团': 1.06, '再生集团': 0.94 };
    const baseFactorMap: Record<string, number> = { '全部基地': 1, '张店': 1.06, '临淄': 1.1, '上海': 0.96, '江西': 0.9 };
    const deptFactorMap: Record<string, number> = { '全部部门': 1, '研发中心': 0.96, '生产系统': 1.14, '营销中心': 1.03, '职能支持': 0.88 };
    const factor = (groupFactorMap[p3TrendGroup] ?? 1) * (baseFactorMap[p3TrendBase] ?? 1) * (deptFactorMap[p3TrendDept] ?? 1);
    return source.map((item, idx) => ({
      ...item,
      p3Plus: Math.max(1, Math.round(item.p3Plus * factor * (1 + Math.sin((idx + 2) * 0.55) * 0.03))),
    }));
  }, [p3TrendStartDate, p3TrendEndDate, p3TrendGroup, p3TrendBase, p3TrendDept]);

  const tenureStructureDynamic = useMemo(() => {
    const start = new Date(`${tenureStructStartDate}T00:00:00`);
    const end = new Date(`${tenureStructEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid
      ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 365;
    const timeScale = Math.max(0.7, Math.min(1.3, rangeDays / 365));
    const groupScale = tenureStructGroup === '医疗集团' ? 1.08 : 0.92;
    const seed = tenureStructGroup === '医疗集团' ? 17 : 29;

    return tenureBarData.map((item, idx) => {
      const wave = 1 + Math.sin((idx + 1) * 0.7 + seed * 0.03) * 0.04;
      return {
        ...item,
        value: Math.max(1, Math.round(item.value * groupScale * timeScale * wave)),
      };
    });
  }, [tenureStructStartDate, tenureStructEndDate, tenureStructGroup]);

  const tenureDistributionDynamic = useMemo(() => {
    const start = new Date(`${tenureDistStartDate}T00:00:00`);
    const end = new Date(`${tenureDistEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid
      ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 365;
    const timeScale = Math.max(0.7, Math.min(1.35, rangeDays / 365));
    const source = tenureDistDim === 'dept' ? deptTenureData : baseTenureData;

    return source.map((item, idx) => {
      const wave = 1 + Math.cos((idx + 1) * 0.6) * 0.05;
      return {
        ...item,
        '<1年': Math.max(1, Math.round(item['<1年'] * timeScale * wave)),
        '1-3年': Math.max(1, Math.round(item['1-3年'] * timeScale * wave)),
        '3-5年': Math.max(1, Math.round(item['3-5年'] * timeScale * wave)),
        '5-10年': Math.max(1, Math.round(item['5-10年'] * timeScale * wave)),
        '>10年': Math.max(1, Math.round(item['>10年'] * timeScale * wave)),
      };
    });
  }, [tenureDistStartDate, tenureDistEndDate, tenureDistDim]);

  const eduStructureDynamic = useMemo(() => {
    const start = new Date(`${eduStructStartDate}T00:00:00`);
    const end = new Date(`${eduStructEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1) : 365;
    const timeScale = Math.max(0.7, Math.min(1.3, rangeDays / 365));
    const groupScale = eduStructGroup === '医疗集团' ? 1.08 : 0.92;
    return eduBarData.map((item, idx) => ({
      ...item,
      value: Math.max(1, Math.round(item.value * groupScale * timeScale * (1 + Math.sin((idx + 1) * 0.75) * 0.04))),
    }));
  }, [eduStructStartDate, eduStructEndDate, eduStructGroup]);

  const eduDistributionDynamic = useMemo(() => {
    const start = new Date(`${eduDistStartDate}T00:00:00`);
    const end = new Date(`${eduDistEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1) : 365;
    const timeScale = Math.max(0.7, Math.min(1.35, rangeDays / 365));
    const source = eduDistDim === 'dept' ? deptEduData : baseEduData;
    return source.map((item, idx) => ({
      ...item,
      '博士': Math.max(1, Math.round(item['博士'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '硕士': Math.max(1, Math.round(item['硕士'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '本科': Math.max(1, Math.round(item['本科'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '大专': Math.max(1, Math.round(item['大专'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '高中及以下': Math.max(1, Math.round(item['高中及以下'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
    }));
  }, [eduDistStartDate, eduDistEndDate, eduDistDim]);

  const eduTrendData = useMemo(() => {
    const source = filterByRange(trend12Months, eduTrendStartDate, eduTrendEndDate);
    const groupScale = eduTrendGroup === '医疗集团' ? 1.07 : 0.93;
    return source.map((item, idx) => ({
      ...item,
      bachelorPlus: Math.max(1, Math.round(item.bachelorPlus * groupScale * (1 + Math.sin((idx + 1) * 0.55) * 0.03))),
    }));
  }, [eduTrendStartDate, eduTrendEndDate, eduTrendGroup]);

  const ageStructureDynamic = useMemo(() => {
    const start = new Date(`${ageStructStartDate}T00:00:00`);
    const end = new Date(`${ageStructEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1) : 365;
    const timeScale = Math.max(0.7, Math.min(1.3, rangeDays / 365));
    const groupScale = ageStructGroup === '医疗集团' ? 1.08 : 0.92;
    return ageBarData.map((item, idx) => ({
      ...item,
      value: Math.max(1, Math.round(item.value * groupScale * timeScale * (1 + Math.sin((idx + 1) * 0.72) * 0.04))),
    }));
  }, [ageStructStartDate, ageStructEndDate, ageStructGroup]);

  const ageDistributionDynamic = useMemo(() => {
    const start = new Date(`${ageDistStartDate}T00:00:00`);
    const end = new Date(`${ageDistEndDate}T00:00:00`);
    const valid = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= end;
    const rangeDays = valid ? Math.max(1, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1) : 365;
    const timeScale = Math.max(0.7, Math.min(1.35, rangeDays / 365));
    const source = ageDistDim === 'dept' ? deptAgeData : baseAgeData;
    return source.map((item, idx) => ({
      ...item,
      '<25岁': Math.max(1, Math.round(item['<25岁'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '25-30岁': Math.max(1, Math.round(item['25-30岁'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '31-35岁': Math.max(1, Math.round(item['31-35岁'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '36-40岁': Math.max(1, Math.round(item['36-40岁'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
      '>40岁': Math.max(1, Math.round(item['>40岁'] * timeScale * (1 + Math.cos((idx + 1) * 0.6) * 0.05))),
    }));
  }, [ageDistStartDate, ageDistEndDate, ageDistDim]);

  const ageTrendData = useMemo(() => {
    const source = filterByRange(trend12Months, ageTrendStartDate, ageTrendEndDate);
    const groupScale = ageTrendGroup === '医疗集团' ? 1.06 : 0.94;
    return source.map((item, idx) => ({
      ...item,
      ageUnder30: Math.max(1, Math.round(item.ageUnder30 * groupScale * (1 + Math.cos((idx + 1) * 0.5) * 0.03))),
    }));
  }, [ageTrendStartDate, ageTrendEndDate, ageTrendGroup]);

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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={levelBarDim}
                    onChange={(e) => {
                      const nextDim = e.target.value as (typeof levelDimOptions)[number]['key'];
                      setLevelBarDim(nextDim);
                      const first = levelDimOptions.find((item) => item.key === nextDim)?.second?.[0];
                      if (first) setLevelBarSecond(first);
                    }}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {levelDimOptions.map((item) => (
                      <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                  </select>
                  <select
                    value={levelBarSecond}
                    onChange={(e) => setLevelBarSecond(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {levelBarSecondOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={levelBarStartDate}
                    onChange={(e) => setLevelBarStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={levelBarEndDate}
                    onChange={(e) => setLevelBarEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelStructureTrend} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="period" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      {levelSeries.map((lv, idx) => (
                        <Bar key={lv} dataKey={lv} name={lv} fill={CHART_COLORS[idx % CHART_COLORS.length]} barSize={10} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="职级占比结构" className="hover:shadow-md transition-shadow duration-200">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={levelPieDim}
                    onChange={(e) => {
                      const nextDim = e.target.value as (typeof levelPieDimOptions)[number]['key'];
                      setLevelPieDim(nextDim);
                      const first = levelPieDimOptions.find((item) => item.key === nextDim)?.second?.[0];
                      if (first) setLevelPieSecond(first);
                    }}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {levelPieDimOptions.map((item) => (
                      <option key={item.key} value={item.key}>{item.label}</option>
                    ))}
                  </select>
                  <select
                    value={levelPieSecond}
                    onChange={(e) => setLevelPieSecond(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {levelPieSecondOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={levelPieStartDate}
                    onChange={(e) => setLevelPieStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={levelPieEndDate}
                    onChange={(e) => setLevelPieEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={levelPieDynamic}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                      >
                        {levelPieDynamic.map((entry, index) => (
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select value={mTrendGroup} onChange={(e) => setMTrendGroup(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    {groupOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <input
                    type="date"
                    value={mTrendStartDate}
                    onChange={(e) => setMTrendStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={mTrendEndDate}
                    onChange={(e) => setMTrendEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mTrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select value={p3TrendGroup} onChange={(e) => setP3TrendGroup(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    {groupOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <select value={p3TrendBase} onChange={(e) => setP3TrendBase(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    {baseOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <select value={p3TrendDept} onChange={(e) => setP3TrendDept(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500">
                    {deptOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <input
                    type="date"
                    value={p3TrendStartDate}
                    onChange={(e) => setP3TrendStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={p3TrendEndDate}
                    onChange={(e) => setP3TrendEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={p3TrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={tenureStructGroup}
                    onChange={(e) => setTenureStructGroup(e.target.value as '医疗集团' | '再生集团')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="医疗集团">医疗集团</option>
                    <option value="再生集团">再生集团</option>
                  </select>
                  <input
                    type="date"
                    value={tenureStructStartDate}
                    onChange={(e) => setTenureStructStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={tenureStructEndDate}
                    onChange={(e) => setTenureStructEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tenureStructureDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="value" name="人数" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="司龄分布（部门/基地）" className="hover:shadow-md transition-shadow duration-200">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={tenureDistDim}
                    onChange={(e) => setTenureDistDim(e.target.value as 'dept' | 'base')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="dept">部门</option>
                    <option value="base">基地</option>
                  </select>
                  <input
                    type="date"
                    value={tenureDistStartDate}
                    onChange={(e) => setTenureDistStartDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={tenureDistEndDate}
                    onChange={(e) => setTenureDistEndDate(e.target.value)}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tenureDistributionDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<1年" fill={CHART_COLORS[0]} />
                      <Bar dataKey="1-3年" fill={CHART_COLORS[1]} />
                      <Bar dataKey="3-5年" fill={CHART_COLORS[2]} />
                      <Bar dataKey="5-10年" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">10年" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={eduStructGroup}
                    onChange={(e) => setEduStructGroup(e.target.value as '医疗集团' | '再生集团')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="医疗集团">医疗集团</option>
                    <option value="再生集团">再生集团</option>
                  </select>
                  <input type="date" value={eduStructStartDate} onChange={(e) => setEduStructStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={eduStructEndDate} onChange={(e) => setEduStructEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eduStructureDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={eduTrendGroup}
                    onChange={(e) => setEduTrendGroup(e.target.value as '医疗集团' | '再生集团')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="医疗集团">医疗集团</option>
                    <option value="再生集团">再生集团</option>
                  </select>
                  <input type="date" value={eduTrendStartDate} onChange={(e) => setEduTrendStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={eduTrendEndDate} onChange={(e) => setEduTrendEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eduTrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 10', 'dataMax + 10']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="bachelorPlus" name="本科及以上人数" stroke={CHART_COLORS[1]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="学历分布（部门/基地）" className="hover:shadow-md transition-shadow duration-200 lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={eduDistDim}
                    onChange={(e) => setEduDistDim(e.target.value as 'dept' | 'base')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="dept">部门</option>
                    <option value="base">基地</option>
                  </select>
                  <input type="date" value={eduDistStartDate} onChange={(e) => setEduDistStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={eduDistEndDate} onChange={(e) => setEduDistEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eduDistributionDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="博士" fill={CHART_COLORS[4]} />
                      <Bar dataKey="硕士" fill={CHART_COLORS[3]} />
                      <Bar dataKey="本科" fill={CHART_COLORS[0]} />
                      <Bar dataKey="大专" fill={CHART_COLORS[1]} />
                      <Bar dataKey="高中及以下" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={ageStructGroup}
                    onChange={(e) => setAgeStructGroup(e.target.value as '医疗集团' | '再生集团')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="医疗集团">医疗集团</option>
                    <option value="再生集团">再生集团</option>
                  </select>
                  <input type="date" value={ageStructStartDate} onChange={(e) => setAgeStructStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={ageStructEndDate} onChange={(e) => setAgeStructEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageStructureDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
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
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={ageTrendGroup}
                    onChange={(e) => setAgeTrendGroup(e.target.value as '医疗集团' | '再生集团')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="医疗集团">医疗集团</option>
                    <option value="再生集团">再生集团</option>
                  </select>
                  <input type="date" value={ageTrendStartDate} onChange={(e) => setAgeTrendStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={ageTrendEndDate} onChange={(e) => setAgeTrendEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ageTrendData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="month" {...axisProps} />
                      <YAxis {...axisProps} domain={['dataMin - 10', 'dataMax + 10']} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} />
                      <Line type="monotone" dataKey="ageUnder30" name="<30岁人数" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanel>

              <ChartPanel title="年龄分布（部门/基地）" className="hover:shadow-md transition-shadow duration-200 lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <select
                    value={ageDistDim}
                    onChange={(e) => setAgeDistDim(e.target.value as 'dept' | 'base')}
                    className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="dept">部门</option>
                    <option value="base">基地</option>
                  </select>
                  <input type="date" value={ageDistStartDate} onChange={(e) => setAgeDistStartDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-400 text-xs">-</span>
                  <input type="date" value={ageDistEndDate} onChange={(e) => setAgeDistEndDate(e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistributionDynamic} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} label={{ value: '人数 (人)', position: 'top', offset: 15, fill: '#64748b', fontSize: 12, dx: 30 }} />
                      <Tooltip content={<SingleAxisTooltip />} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="<25岁" fill={CHART_COLORS[0]} />
                      <Bar dataKey="25-30岁" fill={CHART_COLORS[1]} />
                      <Bar dataKey="31-35岁" fill={CHART_COLORS[2]} />
                      <Bar dataKey="36-40岁" fill={CHART_COLORS[3]} />
                      <Bar dataKey=">40岁" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} />
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
