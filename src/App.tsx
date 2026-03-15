/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { OrgScalePage } from './pages/org/Scale';
import { OrgStructurePage } from './pages/org/Structure';
import { OrgEfficiencyPage } from './pages/org/Efficiency';
import { OrgTurnoverPage } from './pages/org/Turnover';
import { EfficiencyPerCapitaPage } from './pages/efficiency/PerCapita';
import { RecruitmentAchievementPage } from './pages/recruitment/Achievement';
import { RecruitmentHeadcountPage } from './pages/recruitment/Headcount';
import { CostSalaryPage } from './pages/cost/Salary';
import { CostOvertimePage } from './pages/cost/Overtime';
import { CostRatioPage } from './pages/cost/Ratio';
import { TalentDensityPage } from './pages/talent/Density';
import { TalentRetentionPage } from './pages/talent/Retention';
import { TalentStructurePage } from './pages/talent/Structure';
import { CompetitionRecruitmentPage } from './pages/competition/Recruitment';
import { CompetitionBPPage } from './pages/competition/BP';
import { CompetitionImprovementPage } from './pages/competition/Improvement';
import { CompetitionTrainingPage } from './pages/competition/Training';
import { PlaceholderPage } from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/org/scale" replace />} />
          
          {/* 组织分析 */}
          <Route path="org/scale" element={<OrgScalePage />} />
          <Route path="org/structure" element={<OrgStructurePage />} />
          <Route path="org/efficiency" element={<OrgEfficiencyPage />} />
          <Route path="org/turnover" element={<OrgTurnoverPage />} />
          
          {/* 人效分析 */}
          <Route path="efficiency/per-capita" element={<EfficiencyPerCapitaPage />} />
          
          {/* 招聘分析 */}
          <Route path="recruitment/achievement" element={<RecruitmentAchievementPage />} />
          <Route path="recruitment/headcount" element={<RecruitmentHeadcountPage />} />
          
          {/* 人力成本 */}
          <Route path="cost/salary" element={<CostSalaryPage />} />
          <Route path="cost/overtime" element={<CostOvertimePage />} />
          <Route path="cost/ratio" element={<CostRatioPage />} />
          
          {/* 人才分析 */}
          <Route path="talent/density" element={<TalentDensityPage />} />
          <Route path="talent/retention" element={<TalentRetentionPage />} />
          <Route path="talent/structure" element={<TalentStructurePage />} />
          
          {/* 人力赛马 */}
          <Route path="competition/recruitment" element={<CompetitionRecruitmentPage />} />
          <Route path="competition/bp" element={<CompetitionBPPage />} />
          <Route path="competition/improvement" element={<CompetitionImprovementPage />} />
          <Route path="competition/training" element={<CompetitionTrainingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
