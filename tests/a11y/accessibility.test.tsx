/**
 * @file Accessibility (a11y) & WCAG AA Compliance Tests
 * @description Verifies semantic landmarks, ARIA tablist patterns, skip links, and screen reader friendliness.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { App } from '../../src/App';
import { SiteHeader } from '../../src/components/layout/SiteHeader';
import { NavBar } from '../../src/components/layout/NavBar';
import { SiteFooter } from '../../src/components/layout/SiteFooter';

describe('Accessibility & WCAG AA Compliance Landmark Tests', () => {
  it('renders skip link as accessible jump navigation to #main-content', () => {
    render(<App />);
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders role="banner" landmark on SiteHeader', () => {
    render(
      <SiteHeader
        currentCity="New Delhi, India"
        assessment={{
          aqi: 220,
          severity: 'Very Unhealthy',
          color: '#a855f7',
          advisory: 'Limit outdoor time.',
          outdoorAdvice: 'Stay indoors.',
          maskAdvice: 'N95 required.',
        }}
      />,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument(); // Smog emergency banner
  });

  it('renders role="tablist" with accessible tab buttons and aria-selected', () => {
    render(<NavBar activeTab="dashboard" onTabChange={() => {}} />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(7);

    const activeTab = screen.getByRole('tab', { name: /AQI Dashboard/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');

    const inactiveTab = screen.getByRole('tab', { name: /AirSense Copilot/i });
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders role="contentinfo" landmark on SiteFooter', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/WCAG AA Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/Strict CSP & Permissions-Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript Strict Mode/i)).toBeInTheDocument();
  });
});
