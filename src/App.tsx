/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

const OrgScalePage = lazy(() =>
  import('./pages/org/Scale').then((module) => ({ default: module.OrgScalePage })),
);
const OrgStructurePage = lazy(() =>
  import('./pages/org/Structure').then((module) => ({ default: module.OrgStructurePage })),
);
const OrgEfficiencyPage = lazy(() =>
  import('./pages/org/Efficiency').then((module) => ({ default: module.OrgEfficiencyPage })),
);
const OrgTurnoverPage = lazy(() =>
  import('./pages/org/Turnover').then((module) => ({ default: module.OrgTurnoverPage })),
);
const EfficiencyPerCapitaPage = lazy(() =>
  import('./pages/efficiency/PerCapita').then((module) => ({
    default: module.EfficiencyPerCapitaPage,
  })),
);
const RecruitmentAchievementPage = lazy(() =>
  import('./pages/recruitment/Achievement').then((module) => ({
    default: module.RecruitmentAchievementPage,
  })),
);
const RecruitmentHeadcountPage = lazy(() =>
  import('./pages/recruitment/Headcount').then((module) => ({
    default: module.RecruitmentHeadcountPage,
  })),
);
const CostSalaryPage = lazy(() =>
  import('./pages/cost/Salary').then((module) => ({ default: module.CostSalaryPage })),
);
const CostOvertimePage = lazy(() =>
  import('./pages/cost/Overtime').then((module) => ({ default: module.CostOvertimePage })),
);
const CostRatioPage = lazy(() =>
  import('./pages/cost/Ratio').then((module) => ({ default: module.CostRatioPage })),
);
const TalentDensityPage = lazy(() =>
  import('./pages/talent/Density').then((module) => ({ default: module.TalentDensityPage })),
);
const TalentRetentionPage = lazy(() =>
  import('./pages/talent/Retention').then((module) => ({ default: module.TalentRetentionPage })),
);
const TalentStructurePage = lazy(() =>
  import('./pages/talent/Structure').then((module) => ({ default: module.TalentStructurePage })),
);
const CompetitionRecruitmentPage = lazy(() =>
  import('./pages/competition/Recruitment').then((module) => ({
    default: module.CompetitionRecruitmentPage,
  })),
);
const CompetitionBPPage = lazy(() =>
  import('./pages/competition/BP').then((module) => ({ default: module.CompetitionBPPage })),
);
const CompetitionImprovementPage = lazy(() =>
  import('./pages/competition/Improvement').then((module) => ({
    default: module.CompetitionImprovementPage,
  })),
);
const CompetitionTrainingPage = lazy(() =>
  import('./pages/competition/Training').then((module) => ({
    default: module.CompetitionTrainingPage,
  })),
);

function RouteFallback() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-slate-50 text-sm text-slate-500">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/org/scale" replace />} />
            <Route path="org/scale" element={<OrgScalePage />} />
            <Route path="org/structure" element={<OrgStructurePage />} />
            <Route path="org/efficiency" element={<OrgEfficiencyPage />} />
            <Route path="org/turnover" element={<OrgTurnoverPage />} />
            <Route path="efficiency/per-capita" element={<EfficiencyPerCapitaPage />} />
            <Route path="recruitment/achievement" element={<RecruitmentAchievementPage />} />
            <Route path="recruitment/headcount" element={<RecruitmentHeadcountPage />} />
            <Route path="cost/salary" element={<CostSalaryPage />} />
            <Route path="cost/overtime" element={<CostOvertimePage />} />
            <Route path="cost/ratio" element={<CostRatioPage />} />
            <Route path="talent/density" element={<TalentDensityPage />} />
            <Route path="talent/retention" element={<TalentRetentionPage />} />
            <Route path="talent/structure" element={<TalentStructurePage />} />
            <Route path="competition/recruitment" element={<CompetitionRecruitmentPage />} />
            <Route path="competition/bp" element={<CompetitionBPPage />} />
            <Route path="competition/improvement" element={<CompetitionImprovementPage />} />
            <Route path="competition/training" element={<CompetitionTrainingPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
