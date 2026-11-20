/**
 * @file AQI Dashboard Panel
 * @description Real-time air quality index visualizer, pollutant breakdown, and city selector.
 * @module src/components/panels/DashboardPanel
 */

import React from 'react';
import { Warning, Info, ShieldCheck, MapPin } from '@phosphor-icons/react';
import type { AqiAssessment, PollutantDetail } from '../../types';
import { MONITORED_CITIES } from '../../constants/aqiLevels';

export interface DashboardPanelProps {
  currentCity: string;
  aqi: number;
  assessment: AqiAssessment | null;
  pollutants: PollutantDetail[];
  onCityChange: (cityName: string) => void;
  onAqiChange: (newAqi: number) => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  currentCity,
  aqi,
  assessment,
  pollutants,
  onCityChange,
  onAqiChange,
}) => {
  return (
    <div id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard" className="space-y-6">
      {/* Top Banner: City selector & Quick Simulator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <MapPin size={24} weight="bold" className="text-cyan-400 shrink-0" />
          <div className="w-full">
            <label htmlFor="city-select" className="text-xs text-slate-400 block mb-1">
              Select Monitored Metro Area:
            </label>
            <select
              id="city-select"
              value={currentCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-500 w-full"
            >
              {MONITORED_CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AQI Interactive Slider */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400">Simulate AQI Level:</span>
            <span className="font-bold text-slate-200">{aqi}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            value={aqi}
            onChange={(e) => onAqiChange(parseInt(e.target.value, 10))}
            aria-label="Air Quality Index Slider"
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0 (Good)</span>
            <span>150 (Sensitive)</span>
            <span>300 (Severe)</span>
            <span>500 (Hazardous)</span>
          </div>
        </div>
      </div>

      {/* Main AQI Meter and Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large AQI Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div
            className="w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-300 shadow-xl"
            style={{
              borderColor: assessment?.color ?? '#38bdf8',
              backgroundColor: `${assessment?.color ?? '#38bdf8'}10`,
            }}
          >
            <span className="text-4xl font-black text-slate-100">{aqi}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AQI</span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-100">{assessment?.severity}</h2>
          <p className="text-xs text-slate-400 mt-1 px-4">{assessment?.advisory}</p>
        </div>

        {/* Health Directives */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <ShieldCheck size={20} weight="bold" className="text-cyan-400" />
            <span>Health & Harm Reduction Guidance</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400 block mb-1">🏃 Outdoor Activity Advice</span>
              <p className="text-xs text-slate-200 font-medium">{assessment?.outdoorAdvice}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400 block mb-1">😷 Mask & Protection Advice</span>
              <p className="text-xs text-slate-200 font-medium">{assessment?.maskAdvice}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5">
            <Warning size={20} weight="fill" className="shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Winter Temperature Inversion Effect:</strong> Cold winter air traps vehicle exhaust and biomass smoke close to the ground between 6 AM and 10 AM. Reschedule intense outdoor tasks for the afternoon.
            </span>
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
          <Info size={18} weight="bold" className="text-cyan-400" />
          <span>Major Urban Pollutants Monitored</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((pol) => (
            <div
              key={pol.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-slate-200">{pol.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    WHO: {pol.whoGuideline} {pol.unit}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{pol.healthImpact}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500">Major Sources:</span>
                <p className="text-[11px] text-slate-300">{pol.sources.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
