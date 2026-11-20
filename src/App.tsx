/**
 * @file BreatheEasy Main Application Orchestrator
 * @description Root view orchestrator assembling layout landmarks and active tab modules.
 * @module src/App
 */

import React from 'react';
import { SiteHeader } from './components/layout/SiteHeader';
import { NavBar } from './components/layout/NavBar';
import { SiteFooter } from './components/layout/SiteFooter';
import { DashboardPanel } from './components/panels/DashboardPanel';
import { CopilotPanel } from './components/panels/CopilotPanel';
import { RoutinePanel } from './components/panels/RoutinePanel';
import { IndoorPanel } from './components/panels/IndoorPanel';
import { AlternativesPanel } from './components/panels/AlternativesPanel';
import { ImpactPanel } from './components/panels/ImpactPanel';
import { ProfilePanel } from './components/panels/ProfilePanel';
import { useAirQuality } from './hooks/useAirQuality';
import { POLLUTANT_CATALOG } from '../server/domains/aqi/pollutantData';

/**
 * Root Application Component.
 */
export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentCity,
    aqi,
    assessment,
    routine,
    hacks,
    familyProfile,
    homeProfile,
    chatMessages,
    isLoading,
    handleCitySelect,
    handleAqiChange,
    setFamilyProfile,
    setHomeProfile,
    handleSendMessage,
  } = useAirQuality();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* WCAG AA Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header Landmark */}
      <SiteHeader currentCity={currentCity} assessment={assessment} />

      {/* Navigation Landmark */}
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Landmark */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardPanel
            currentCity={currentCity}
            aqi={aqi}
            assessment={assessment}
            pollutants={POLLUTANT_CATALOG}
            onCityChange={handleCitySelect}
            onAqiChange={handleAqiChange}
          />
        )}

        {activeTab === 'copilot' && (
          <CopilotPanel
            messages={chatMessages}
            currentCity={currentCity}
            aqi={aqi}
            familyProfile={familyProfile}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'routine' && <RoutinePanel routine={routine} aqi={aqi} />}

        {activeTab === 'indoor' && <IndoorPanel hacks={hacks} />}

        {activeTab === 'alternatives' && <AlternativesPanel />}

        {activeTab === 'impact' && <ImpactPanel />}

        {activeTab === 'profile' && (
          <ProfilePanel
            familyProfile={familyProfile}
            homeProfile={homeProfile}
            onUpdateFamily={setFamilyProfile}
            onUpdateHome={setHomeProfile}
          />
        )}
      </main>

      {/* Footer Landmark */}
      <SiteFooter />
    </div>
  );
};

export default App;
