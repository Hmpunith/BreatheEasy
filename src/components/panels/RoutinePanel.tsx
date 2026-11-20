/**
 * @file Daily Routine Planner Panel
 * @description Time-slotted low-emission daily routines tailored to current AQI and family vulnerabilities.
 * @module src/components/panels/RoutinePanel
 */

import React from 'react';
import { Clock, Leaf, WarningCircle, CheckCircle } from '@phosphor-icons/react';
import type { DailyRoutine } from '../../types';

export interface RoutinePanelProps {
  routine: DailyRoutine | null;
  aqi: number;
}

export const RoutinePanel: React.FC<RoutinePanelProps> = ({ routine, aqi }) => {
  if (!routine) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
        Loading personalized daily routine...
      </div>
    );
  }

  return (
    <div id="panel-routine" role="tabpanel" aria-labelledby="tab-routine" className="space-y-6">
      {/* Header Metric Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Clock size={20} weight="bold" className="text-cyan-400" aria-hidden="true" />
            <span>Low-Emission Daily Routine (AQI {aqi})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Optimized for {routine.profile.location} • Household of {routine.profile.memberCount}
          </p>
        </div>

        <div className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Leaf size={24} weight="bold" aria-hidden="true" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
              Estimated Routine Savings
            </span>
            <span className="text-sm font-black">{routine.estimatedSavingsKg} kg CO₂e / day</span>
          </div>
        </div>
      </div>

      {/* Warnings & Advisories */}
      {routine.warnings.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-rose-300 flex items-center space-x-2">
            <WarningCircle size={16} weight="fill" className="text-rose-400" aria-hidden="true" />
            <span>Vulnerability & High-Smog Alerts for Your Household</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-rose-200">
            {routine.warnings.map((warn, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span>•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Routine Timeline */}
      <div className="space-y-3">
        {routine.activities.map((act, index) => (
          <div
            key={index}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold shrink-0">
                {act.timeSlot}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{act.activity}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                  <CheckCircle size={14} weight="bold" className="text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>{act.greenTip}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  act.location === 'indoor'
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {act.location}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  act.emissionCategory === 'low'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                }`}
              >
                {act.emissionCategory} emission
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
