/**
 * @file Navigation Tablist Component
 * @description Accessible tab navigation adhering to WAI-ARIA tablist standards.
 * @module src/components/layout/NavBar
 */

import React from 'react';
import {
  Gauge,
  ChatCircleText,
  CalendarCheck,
  HouseLine,
  ArrowsClockwise,
  ChartLineUp,
  UsersThree,
} from '@phosphor-icons/react';
import type { ActiveTab } from '../../types';

export interface NavBarProps {
  activeTab: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ size: number; weight?: 'regular' | 'bold' | 'fill' }>;
}

const TABS: NavItem[] = [
  { id: 'dashboard', label: 'AQI Dashboard', icon: Gauge },
  { id: 'copilot', label: 'AirSense Copilot', icon: ChatCircleText },
  { id: 'routine', label: 'Daily Routines', icon: CalendarCheck },
  { id: 'indoor', label: 'Indoor Hacks', icon: HouseLine },
  { id: 'alternatives', label: 'Green Alternatives', icon: ArrowsClockwise },
  { id: 'impact', label: 'Impact Calculator', icon: ChartLineUp },
  { id: 'profile', label: 'Family Profile', icon: UsersThree },
];

export const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange, onSelectTab }) => {
  const handleSelect = (tab: ActiveTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1;
    }
    if (nextIndex >= 0) {
      e.preventDefault();
      const nextTab = TABS[nextIndex];
      handleSelect(nextTab.id);
      const nextElement = document.getElementById(`tab-${nextTab.id}`);
      nextElement?.focus();
    }
  };

  return (
    <nav
      aria-label="Air Quality Navigation Modules"
      className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-16 z-30 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div role="tablist" aria-orientation="horizontal" className="flex space-x-1 sm:space-x-2 py-2.5 min-w-max">
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => handleSelect(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} weight={isActive ? 'bold' : 'regular'} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
