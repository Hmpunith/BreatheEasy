/**
 * @file Indoor Air Quality Hacks Panel
 * @description Curated, ranked indoor air quality hacks with instructions and effectiveness metrics.
 * @module src/components/panels/IndoorPanel
 */

import React, { useState } from 'react';
import { HouseLine, Wrench, ShieldCheck, Tag } from '@phosphor-icons/react';
import type { RankedHack } from '../../types';

export interface IndoorPanelProps {
  hacks: RankedHack[];
}

export const IndoorPanel: React.FC<IndoorPanelProps> = ({ hacks }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'filtration', 'diy', 'source_control', 'plants', 'ventilation'];

  const filtered = selectedCategory === 'all'
    ? hacks
    : hacks.filter((item) => item.hack.category === selectedCategory);

  return (
    <div id="panel-indoor" role="tabpanel" aria-labelledby="tab-indoor" className="space-y-6">
      {/* Overview and Category Filter */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <HouseLine size={20} weight="bold" className="text-cyan-400" />
              <span>Indoor Air Quality Hacks & DIY Smog Defenses</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Scientifically vetted strategies to lower indoor PM2.5, VOCs, and combustion gases.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Hacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(({ hack, score, personalFitReason }) => (
          <div
            key={hack.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-100 leading-snug">{hack.title}</h3>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black shrink-0">
                  {hack.effectivenessPercent}% Reduction
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3 text-[10px] font-semibold">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize flex items-center space-x-1">
                  <Tag size={12} weight="bold" />
                  <span>{hack.category.replace('_', ' ')}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                  Cost: {hack.costTier.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize flex items-center space-x-1">
                  <Wrench size={12} weight="bold" />
                  <span>{hack.effortLevel} effort</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                  Score: {score}/100
                </span>
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{hack.instructions}</p>

              {/* Rationale */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-400">
                <strong className="text-slate-300 block mb-0.5">Direct Health Impact:</strong>
                {hack.impactRationale}
              </div>
            </div>

            {/* Fit Reason Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center space-x-1 text-cyan-400">
                <ShieldCheck size={14} weight="bold" />
                <span>{personalFitReason}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
