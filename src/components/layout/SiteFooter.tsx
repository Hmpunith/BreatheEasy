/**
 * @file Site Footer Component
 * @description Application footer adhering to HTML5 contentinfo landmark semantics with security and accessibility badges.
 * @module src/components/layout/SiteFooter
 */

import React from 'react';
import { ShieldCheck, Eye, Terminal } from '@phosphor-icons/react';

export const SiteFooter: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Problem Statement */}
        <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-300">
            BreatheEasy — Urban Air Quality & Winter Smog Assistant
          </p>
          <p className="text-[11px] text-slate-500">
            Engineered for Hack2Skill PromptWars [Challenge 6] • Low-Emission Routines & Indoor Hacks
          </p>
          <p className="text-[10px] text-slate-600">
            MIT Licensed • Zero Persistent Cookies • Client-Side Privacy Guaranteed
          </p>
        </div>

        {/* Right: Security & A11y Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <ShieldCheck size={14} weight="bold" className="text-emerald-400" aria-hidden="true" />
            <span>Strict CSP & Permissions-Policy</span>
          </span>

          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <Eye size={14} weight="bold" className="text-amber-400" aria-hidden="true" />
            <span>WCAG AA Compliant</span>
          </span>

          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <Terminal size={14} weight="bold" className="text-cyan-400" aria-hidden="true" />
            <span>TypeScript Strict Mode</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
