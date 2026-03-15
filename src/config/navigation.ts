import {
  Users,
  TrendingUp,
  UserPlus,
  DollarSign,
  Award,
  Trophy,
} from 'lucide-react';

export const navigationConfig = [
  {
    title: '组织分析',
    icon: Users,
    path: '/org',
    children: [
      { title: '组织规模趋势', path: '/org/scale' },
      { title: '组织结构分析', path: '/org/structure' },
      { title: '组织效能分析', path: '/org/efficiency' },
      { title: '人员流动分析', path: '/org/turnover' },
    ],
  },
  {
    title: '人效分析',
    icon: TrendingUp,
    path: '/efficiency',
    children: [
      { title: '人均产值', path: '/efficiency/per-capita' },
    ],
  },
  {
    title: '招聘分析',
    icon: UserPlus,
    path: '/recruitment',
    children: [
      { title: '招聘达成', path: '/recruitment/achievement' },
      { title: '关键岗位编制', path: '/recruitment/headcount' },
    ],
  },
  {
    title: '人力成本',
    icon: DollarSign,
    path: '/cost',
    children: [
      { title: '薪酬分析', path: '/cost/salary' },
      { title: '生产系统加班费分析', path: '/cost/overtime' },
      { title: '人力成本占比', path: '/cost/ratio' },
    ],
  },
  {
    title: '人才分析',
    icon: Award,
    path: '/talent',
    children: [
      { title: '人才密度', path: '/talent/density' },
      { title: '人员留存', path: '/talent/retention' },
      { title: '人才结构', path: '/talent/structure' },
    ],
  },
  {
    title: '人力赛马',
    icon: Trophy,
    path: '/competition',
    children: [
      { title: '招聘达成', path: '/competition/recruitment' },
      { title: 'BP赋能达成', path: '/competition/bp' },
      { title: '自主改善达成', path: '/competition/improvement' },
      { title: '培训赛马表', path: '/competition/training' },
    ],
  },
];
