/**
 * @file Family and Household Profile Settings Panel
 * @description Manages family demographic vulnerabilities and home layout constraints.
 * @module src/components/panels/ProfilePanel
 */

import React from 'react';
import { UsersThree, HouseLine } from '@phosphor-icons/react';
import type { FamilyProfile, HomeProfile } from '../../types';

export interface ProfilePanelProps {
  familyProfile: FamilyProfile;
  homeProfile: HomeProfile;
  onUpdateFamily: (profile: FamilyProfile) => void;
  onUpdateHome: (profile: HomeProfile) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({
  familyProfile,
  homeProfile,
  onUpdateFamily,
  onUpdateHome,
}) => {
  return (
    <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <UsersThree size={20} weight="bold" className="text-cyan-400" />
          <span>Household & Vulnerability Profile</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Personalize air quality safety thresholds, warnings, and indoor recommendations to your family.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Demographics */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
            <UsersThree size={16} weight="bold" />
            <span>Family Demographics & Health</span>
          </h3>

          <div>
            <label htmlFor="member-count" className="text-xs text-slate-400 block mb-1">
              Household Size (people):
            </label>
            <input
              id="member-count"
              type="number"
              min="1"
              max="20"
              value={familyProfile.memberCount}
              onChange={(e) =>
                onUpdateFamily({ ...familyProfile, memberCount: Number(e.target.value) })
              }
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs w-full"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={familyProfile.hasChildren}
                onChange={(e) =>
                  onUpdateFamily({ ...familyProfile, hasChildren: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Children under 12 in household</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={familyProfile.hasElderly}
                onChange={(e) =>
                  onUpdateFamily({ ...familyProfile, hasElderly: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Elderly family members (65+)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={familyProfile.hasRespiratoryConditions}
                onChange={(e) =>
                  onUpdateFamily({ ...familyProfile, hasRespiratoryConditions: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Asthma, COPD, or chronic respiratory conditions</span>
            </label>
          </div>
        </div>

        {/* Living Space Constraints */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
            <HouseLine size={16} weight="bold" />
            <span>Living Space & Budget</span>
          </h3>

          <div>
            <label htmlFor="home-type" className="text-xs text-slate-400 block mb-1">
              Dwelling Type:
            </label>
            <select
              id="home-type"
              value={homeProfile.homeType}
              onChange={(e) =>
                onUpdateHome({
                  ...homeProfile,
                  homeType: e.target.value as HomeProfile['homeType'],
                })
              }
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs w-full"
            >
              <option value="apartment">Multi-Story Urban Apartment</option>
              <option value="detached">Detached / Single-Family House</option>
              <option value="compact_studio">Compact Studio</option>
            </select>
          </div>

          <div>
            <label htmlFor="budget-preference" className="text-xs text-slate-400 block mb-1">
              Budget Constraint for IAQ Hacks:
            </label>
            <select
              id="budget-preference"
              value={homeProfile.budget}
              onChange={(e) =>
                onUpdateHome({
                  ...homeProfile,
                  budget: e.target.value as HomeProfile['budget'],
                })
              }
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs w-full"
            >
              <option value="free_only">Zero-Cost Habits Only (Free)</option>
              <option value="low_cost">Low Cost (DIY & Inexpensive Tools)</option>
              <option value="open">Open (Includes Commercial HEPA)</option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={homeProfile.hasIndoorCombustion}
                onChange={(e) =>
                  onUpdateHome({ ...homeProfile, hasIndoorCombustion: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Cooks with open gas flame or indoor burner</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={homeProfile.hasPets}
                onChange={(e) =>
                  onUpdateHome({ ...homeProfile, hasPets: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Has furry pets indoors (cats/dogs)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
