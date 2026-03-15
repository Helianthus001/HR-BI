import React from 'react';
import { PageContainer } from '@/src/components/ui/PageContainer';
import { MetricCard } from '@/src/components/ui/MetricCard';
import { Card } from '@/src/components/ui/Card';

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PageContainer title={title}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <MetricCard
            key={i}
            title={`指标 ${i}`}
            value="--"
            className="opacity-60"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="图表区域 1" className="opacity-60">
          <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded">
            数据加载中...
          </div>
        </Card>
        <Card title="图表区域 2" className="opacity-60">
          <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded">
            数据加载中...
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
