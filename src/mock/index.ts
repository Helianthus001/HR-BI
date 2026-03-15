// 统一的 Mock Data Schema 初版
// 采用统一的数据结构，便于后续替换为真实接口

export const mockData = {
  // 1. 组织分析 (Organization)
  org: {
    scale: {
      metrics: [
        { id: 'total', title: '集团总人数', value: 12450, suffix: '人', trend: 'up', trendValue: '2.4%' },
        { id: 'new', title: '本月入职', value: 342, suffix: '人', trend: 'up', trendValue: '15.2%' },
        { id: 'leave', title: '本月离职', value: 128, suffix: '人', trend: 'down', trendValue: '5.1%' },
        { id: 'net', title: '净增人数', value: 214, suffix: '人', trend: 'up', trendValue: '8.3%' },
      ],
      trendData: [
        { month: '1月', total: 11800, new: 210, leave: 150 },
        { month: '2月', total: 11950, new: 280, leave: 130 },
        { month: '3月', total: 12100, new: 300, leave: 150 },
        { month: '4月', total: 12250, new: 250, leave: 100 },
        { month: '5月', total: 12380, new: 260, leave: 130 },
        { month: '6月', total: 12450, new: 342, leave: 128 },
      ],
      distributionData: [
        { name: '生产制造', value: 6500 },
        { name: '研发技术', value: 2800 },
        { name: '销售市场', value: 1500 },
        { name: '职能支持', value: 1650 },
      ],
    },
    // 其他组织分析模块...
  },

  // 2. 人效分析 (Efficiency)
  efficiency: {
    perCapita: {
      metrics: [
        { id: 'revenue', title: '人均营收', value: '125.4', prefix: '¥', suffix: '万', trend: 'up', trendValue: '4.2%' },
        { id: 'profit', title: '人均利润', value: '18.2', prefix: '¥', suffix: '万', trend: 'up', trendValue: '6.5%' },
        { id: 'cost', title: '人均成本', value: '24.5', prefix: '¥', suffix: '万', trend: 'down', trendValue: '1.2%' },
        { id: 'roi', title: '人力资本投资回报率', value: '5.12', trend: 'up', trendValue: '0.15' },
      ],
      trendData: [
        { month: '1月', revenue: 118, profit: 16.5, cost: 24.8 },
        { month: '2月', revenue: 120, profit: 17.0, cost: 24.6 },
        { month: '3月', revenue: 122, profit: 17.2, cost: 24.5 },
        { month: '4月', revenue: 121, profit: 17.1, cost: 24.7 },
        { month: '5月', revenue: 124, profit: 17.8, cost: 24.6 },
        { month: '6月', revenue: 125.4, profit: 18.2, cost: 24.5 },
      ],
    },
  },

  // 3. 招聘分析 (Recruitment)
  recruitment: {
    achievement: {
      metrics: [
        { id: 'target', title: '年度招聘目标', value: 1500, suffix: '人' },
        { id: 'actual', title: '已入职人数', value: 845, suffix: '人', trend: 'up', trendValue: '12%' },
        { id: 'rate', title: '目标达成率', value: '56.3', suffix: '%', trend: 'up', trendValue: '4.5%' },
        { id: 'cycle', title: '平均招聘周期', value: 32, suffix: '天', trend: 'down', trendValue: '3天' },
      ],
      funnelData: [
        { name: '简历收取', value: 15000 },
        { name: '简历初筛', value: 4500 },
        { name: '面试邀约', value: 2100 },
        { name: '面试通过', value: 1200 },
        { name: 'Offer发放', value: 950 },
        { name: '成功入职', value: 845 },
      ],
    },
  },

  // 4. 人力成本 (Cost)
  cost: {
    salary: {
      metrics: [
        { id: 'total', title: '年度薪酬总额', value: '3.2', prefix: '¥', suffix: '亿', trend: 'up', trendValue: '5.4%' },
        { id: 'fixed', title: '固定薪酬占比', value: '68.5', suffix: '%', trend: 'neutral', trendValue: '0%' },
        { id: 'variable', title: '浮动薪酬占比', value: '31.5', suffix: '%', trend: 'neutral', trendValue: '0%' },
        { id: 'avg', title: '平均薪酬', value: '18.5', prefix: '¥', suffix: 'k/月', trend: 'up', trendValue: '2.1%' },
      ],
      structureData: [
        { name: '基本工资', value: 60 },
        { name: '绩效奖金', value: 25 },
        { name: '津贴补贴', value: 8 },
        { name: '加班费', value: 7 },
      ],
    },
  },

  // 5. 人才分析 (Talent)
  talent: {
    density: {
      metrics: [
        { id: 'high', title: '高绩效人才占比', value: '15.2', suffix: '%', trend: 'up', trendValue: '1.5%' },
        { id: 'core', title: '核心岗位满足率', value: '92.5', suffix: '%', trend: 'up', trendValue: '2.0%' },
        { id: 'degree', title: '本科及以上学历占比', value: '68.4', suffix: '%', trend: 'up', trendValue: '3.2%' },
        { id: 'age', title: '平均年龄', value: '28.5', suffix: '岁', trend: 'down', trendValue: '0.5岁' },
      ],
      educationData: [
        { name: '博士', value: 5 },
        { name: '硕士', value: 25 },
        { name: '本科', value: 45 },
        { name: '大专及以下', value: 25 },
      ],
    },
  },

  // 6. 人力赛马 (Competition)
  competition: {
    recruitment: {
      metrics: [
        { id: 'top', title: '本月招聘冠军部门', value: '研发中心' },
        { id: 'avg_rate', title: '平均达成率', value: '85.4', suffix: '%' },
        { id: 'best_hr', title: '最佳招聘HR', value: '张三' },
        { id: 'total_offers', title: '本月发放Offer', value: 452, suffix: '个' },
      ],
      rankingData: [
        { name: '研发中心', value: 98, target: 100 },
        { name: '销售一部', value: 92, target: 100 },
        { name: '生产制造部', value: 88, target: 100 },
        { name: '市场部', value: 85, target: 100 },
        { name: '财务部', value: 75, target: 100 },
      ],
    },
  },
};
