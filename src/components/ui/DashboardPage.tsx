import React, { useState } from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';
import { cn } from '@/src/utils/cn';

export interface Metric {
  id: string;
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  colSpan?: 1 | 2 | 3 | 4;
  height?: number;
  renderChart: () => React.ReactNode;
}

interface DashboardPageProps {
  title: string;
  metrics: Metric[];
  charts: ChartConfig[];
}

export function DashboardPage({ title, metrics, charts }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageContainer title={title}>
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
        {['概览分析', '明细数据', '趋势对比'].map((tab, idx) => {
          const id = ['overview', 'details', 'trends'][idx];
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative',
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Metrics */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
        metrics.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
      )}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            trend={metric.trend}
            trendValue={metric.trendValue}
            className="hover:shadow-md transition-shadow duration-200"
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => (
          <Card
            key={chart.id}
            title={chart.title}
            className={cn(
              chart.colSpan === 2 ? 'lg:col-span-2' : '',
              'hover:shadow-md transition-shadow duration-200'
            )}
            bodyClassName="flex flex-col"
          >
            <div
              className="w-full flex-1 min-h-[300px] flex items-center justify-center bg-slate-50/50 rounded border border-slate-100/50"
              style={{ height: chart.height || 300 }}
            >
              {chart.renderChart()}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
