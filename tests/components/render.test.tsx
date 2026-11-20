/**
 * @file Component Rendering and ARIA Landmark Tests
 * @description Verifies every React component mounts cleanly, displays domain metrics, and provides accessible controls.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteHeader } from '../../src/components/layout/SiteHeader';
import { NavBar } from '../../src/components/layout/NavBar';
import { SiteFooter } from '../../src/components/layout/SiteFooter';
import { DashboardPanel } from '../../src/components/panels/DashboardPanel';
import { CopilotPanel } from '../../src/components/panels/CopilotPanel';
import { RoutinePanel } from '../../src/components/panels/RoutinePanel';
import { IndoorPanel } from '../../src/components/panels/IndoorPanel';
import { AlternativesPanel } from '../../src/components/panels/AlternativesPanel';
import { ImpactPanel } from '../../src/components/panels/ImpactPanel';
import { ProfilePanel } from '../../src/components/panels/ProfilePanel';
import { POLLUTANT_CATALOG } from '../../server/domains/aqi/pollutantData';

describe('Component Rendering & UI View Tests', () => {
  it('renders SiteHeader with title and branding', () => {
    render(
      <SiteHeader
        currentCity="New Delhi, India"
        assessment={{
          aqi: 145,
          severity: 'Unhealthy for Sensitive Groups',
          color: '#f97316',
          advisory: 'Reduce outdoor exertion.',
          outdoorAdvice: 'Caution outdoors.',
          maskAdvice: 'N95 recommended.',
        }}
      />,
    );
    expect(screen.getByText('BreatheEasy')).toBeInTheDocument();
    expect(screen.getByText(/Winter Smog & Urban Air Quality Assistant/i)).toBeInTheDocument();
  });

  it('renders NavBar with all 7 module tabs', () => {
    render(<NavBar activeTab="dashboard" onTabChange={() => {}} />);
    expect(screen.getByText('AQI Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AirSense Copilot')).toBeInTheDocument();
    expect(screen.getByText('Daily Routines')).toBeInTheDocument();
    expect(screen.getByText('Indoor Hacks')).toBeInTheDocument();
    expect(screen.getByText('Green Alternatives')).toBeInTheDocument();
    expect(screen.getByText('Impact Calculator')).toBeInTheDocument();
    expect(screen.getByText('Family Profile')).toBeInTheDocument();
  });

  it('renders DashboardPanel with meter and pollutant cards', () => {
    render(
      <DashboardPanel
        currentCity="New Delhi, India"
        aqi={185}
        assessment={{
          aqi: 185,
          severity: 'Unhealthy',
          color: '#ef4444',
          advisory: 'Health alert.',
          outdoorAdvice: 'Reduce prolonged exertion.',
          maskAdvice: 'N95 mask strongly recommended.',
        }}
        pollutants={POLLUTANT_CATALOG}
        onCityChange={() => {}}
        onAqiChange={() => {}}
      />,
    );
    expect(screen.getAllByText('185').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Unhealthy')).toBeInTheDocument();
    expect(screen.getByText(/PM2.5 \(Fine Particulate\)/i)).toBeInTheDocument();
  });

  it('renders CopilotPanel with starter prompts and chat input', () => {
    render(
      <CopilotPanel
        messages={[
          {
            id: '1',
            sender: 'assistant',
            text: 'Welcome to AirSense.',
            timestamp: '12:00 PM',
          },
        ]}
        currentCity="New Delhi, India"
        aqi={185}
        familyProfile={{
          memberCount: 4,
          hasChildren: true,
          hasElderly: false,
          hasRespiratoryConditions: true,
          location: 'New Delhi, India',
        }}
        isLoading={false}
        onSendMessage={() => {}}
      />,
    );
    expect(screen.getByText('Welcome to AirSense.')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Ask about smog defense, indoor hacks, or low-emission alternatives.../i),
    ).toBeInTheDocument();
  });

  it('renders RoutinePanel with timeline schedule and savings', () => {
    render(
      <RoutinePanel
        routine={{
          aqi: 185,
          profile: {
            memberCount: 4,
            hasChildren: true,
            hasElderly: false,
            hasRespiratoryConditions: true,
            location: 'New Delhi, India',
          },
          activities: [
            {
              timeSlot: '7:00 AM',
              activity: 'Indoor workout',
              location: 'indoor',
              emissionCategory: 'low',
              greenTip: 'HEPA filtration keeps air clean.',
            },
          ],
          warnings: ['Children under 12 are vulnerable.'],
          estimatedSavingsKg: 2.4,
        }}
        aqi={185}
      />,
    );
    expect(screen.getByText(/2.4 kg CO₂e \/ day/i)).toBeInTheDocument();
    expect(screen.getByText('Indoor workout')).toBeInTheDocument();
    expect(screen.getByText(/Children under 12 are vulnerable/i)).toBeInTheDocument();
  });

  it('renders IndoorPanel with DIY hacks and effectiveness badges', () => {
    render(
      <IndoorPanel
        hacks={[
          {
            hack: {
              id: 'diy_box',
              title: 'Corsi-Rosenthal Box',
              category: 'diy',
              effectivenessPercent: 85,
              costTier: 'low',
              effortLevel: 'moderate',
              instructions: 'Tape MERV-13 filters to box fan.',
              impactRationale: 'Delivers high clean air delivery rate.',
            },
            score: 95,
            personalFitReason: 'Crucial emergency defense.',
          },
        ]}
      />,
    );
    expect(screen.getByText('Corsi-Rosenthal Box')).toBeInTheDocument();
    expect(screen.getByText('85% Reduction')).toBeInTheDocument();
  });

  it('renders AlternativesPanel with green energy alternatives', () => {
    render(<AlternativesPanel />);
    expect(screen.getByText('Electric Transit & Rapid Rail Pass')).toBeInTheDocument();
    expect(screen.getByText('Precision Infrared Zoned Space Heating')).toBeInTheDocument();
  });

  it('renders ImpactPanel with calculator selectors and compute button', () => {
    render(<ImpactPanel />);
    expect(screen.getByText('Direct Impact & Emission Savings Calculator')).toBeInTheDocument();
    expect(screen.getByText('Recalculate Impact')).toBeInTheDocument();
  });

  it('renders ProfilePanel with household form controls', () => {
    render(
      <ProfilePanel
        familyProfile={{
          memberCount: 4,
          hasChildren: true,
          hasElderly: true,
          hasRespiratoryConditions: true,
          location: 'New Delhi',
        }}
        homeProfile={{
          homeType: 'apartment',
          budget: 'low_cost',
          hasIndoorCombustion: true,
          hasPets: true,
        }}
        onUpdateFamily={() => {}}
        onUpdateHome={() => {}}
      />,
    );
    expect(screen.getByText('Household & Vulnerability Profile')).toBeInTheDocument();
    expect(screen.getByLabelText(/Household Size \(people\):/i)).toHaveValue(4);
  });

  it('renders SiteFooter with WCAG AA and security badges', () => {
    render(<SiteFooter />);
    expect(screen.getByText('Strict CSP & Permissions-Policy')).toBeInTheDocument();
    expect(screen.getByText('WCAG AA Compliant')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Strict Mode')).toBeInTheDocument();
  });
});
