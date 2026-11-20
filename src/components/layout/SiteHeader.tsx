/**
 * @file Application Header Component
 * @description Header landmark presenting brand identity, live status, and emergency smog alert banner.
 * @module src/components/layout/SiteHeader
 */

import React from 'react';
import { Wind, WarningCircle } from '@phosphor-icons/react';
import type { AqiAssessment } from '../../types';

export interface SiteHeaderProps {
  currentCity: string;
  assessment: AqiAssessment | null;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentCity, assessment }) => {
  const isSmogEmergency = (assessment?.aqi ?? 0) >= 200;

  return (
    <header role="banner" className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Wind size={24} weight="bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">BreatheEasy</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Urban AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Winter Smog & Urban Air Quality Assistant</p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Monitoring Station</p>
            <p className="text-xs font-medium text-slate-200">{currentCity}</p>
          </div>

          {assessment && (
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all shadow-sm"
              style={{
                backgroundColor: `${assessment.color}20`,
                borderColor: `${assessment.color}50`,
                color: assessment.color,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: assessment.color }} />
              <span>AQI {assessment.aqi}</span>
              <span className="hidden md:inline">({assessment.severity})</span>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Smog Alert Banner */}
      {isSmogEmergency && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-rose-950/90 border-t border-b border-rose-800 text-rose-200 text-xs py-2 px-4 flex items-center justify-center space-x-2"
        >
          <WarningCircle size={18} weight="fill" className="text-rose-400 animate-bounce" />
          <span>
            <strong>Severe Winter Smog Alert:</strong> AQI is {assessment?.aqi}. Limit outdoor exposure, seal window drafts, and run indoor air filtration.
          </span>
        </div>
      )}
    </header>
  );
};
