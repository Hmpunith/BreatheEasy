/**
 * @file Environmental Impact Report Visualization Card
 * @description Renders comparative metrics, executive summary, and visual emission progress bars.
 * @module src/components/panels/ImpactReportCard
 */

import React from 'react';
import { Tree, Sparkle } from '@phosphor-icons/react';
import type { ImpactReport } from '../../types';

interface ImpactReportCardProps {
  /** Environmental calculation report to display. */
  report: ImpactReport;
}

/**
 * Visual report card presenting calculated CO2e and PM2.5 reduction metrics.
 * @param props - Component properties containing report data.
 */
export const ImpactReportCard: React.FC<ImpactReportCardProps> = ({ report }) => {
  const percentage = Math.min(
    100,
    (report.alternativeCo2eKg / (report.baselineCo2eKg || 1)) * 100,
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Executive Summary */}
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-start space-x-3">
        <Sparkle size={24} weight="fill" className="text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">{report.executiveSummary}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Net CO₂e Saved
          </span>
          <span className="text-2xl font-black text-slate-100">{report.netCo2eSavedKg}</span>
          <span className="text-xs text-slate-400 block">kilograms</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            PM2.5 Smog Eliminated
          </span>
          <span className="text-2xl font-black text-slate-100">{report.netPm25ReducedGrams}</span>
          <span className="text-xs text-slate-400 block">grams of toxic soot</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center space-x-1 mb-1">
            <Tree size={14} weight="fill" />
            <span>Tree Equivalent</span>
          </span>
          <span className="text-2xl font-black text-slate-100">{report.treeSeedlingsEquivalent}</span>
          <span className="text-xs text-slate-400 block">urban trees grown 10 yrs</span>
        </div>
      </div>

      {/* Before vs After Progress Comparison */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-3">
        <h4 className="text-xs font-bold text-slate-300">Emission Comparison</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-rose-400 font-semibold">Baseline Footprint</span>
              <span className="font-mono text-slate-300">{report.baselineCo2eKg} kg CO₂e</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-emerald-400 font-semibold">Sustainable Alternative</span>
              <span className="font-mono text-slate-300">{report.alternativeCo2eKg} kg CO₂e</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
