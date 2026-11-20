/**
 * @file Sustainable Alternatives Panel
 * @description Actionable green alternatives for commuting, home heating, cooking, and community action.
 * @module src/components/panels/AlternativesPanel
 */

import React, { useState } from 'react';
import { ArrowsClockwise, CheckSquareOffset, UsersThree } from '@phosphor-icons/react';
import { SUSTAINABLE_ALTERNATIVES } from '../../../server/domains/alternatives/alternativeCatalog';

export const AlternativesPanel: React.FC = () => {
  const [selectedFocus, setSelectedFocus] = useState<string>('all');

  const categories = ['all', 'commute', 'home_heating', 'food_energy', 'community_action'];

  const filtered = selectedFocus === 'all'
    ? SUSTAINABLE_ALTERNATIVES
    : SUSTAINABLE_ALTERNATIVES.filter((a) => a.category === selectedFocus);

  return (
    <div id="panel-alternatives" role="tabpanel" aria-labelledby="tab-alternatives" className="space-y-6">
      {/* Title & Filter */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ArrowsClockwise size={20} weight="bold" className="text-cyan-400" />
            <span>Sustainable Lifestyle & Clean Energy Alternatives</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Systemic shifts in transit, heating, and food preparation that eliminate neighborhood smog at the source.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFocus(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium capitalize transition-all ${
                selectedFocus === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alternatives Cards */}
      <div className="space-y-6">
        {filtered.map((alt) => (
          <div
            key={alt.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Replaces: {alt.replacesConventional}
                </span>
                <h3 className="text-base font-bold text-slate-100">{alt.title}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                  -{alt.co2eReductionPercent}% CO₂e
                </span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-black">
                  -{alt.smogReductionPercent}% Smog
                </span>
              </div>
            </div>

            {/* Implementation Steps */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                <CheckSquareOffset size={16} weight="bold" className="text-emerald-400" />
                <span>Actionable Transition Roadmap</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {alt.implementationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Co-Benefit */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 flex items-start space-x-2">
              <UsersThree size={18} weight="fill" className="text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Community Impact:</strong> {alt.communityBenefit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
