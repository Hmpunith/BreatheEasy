# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Defense-in-Depth

BreatheEasy enforces multi-layer defense-in-depth across the application lifecycle:

1. **Edge Gateway Headers (Vercel CDN)**:
   - `Content-Security-Policy`: Restricts scripts, frames, and connect endpoints.
   - `Strict-Transport-Security`: Enforces HSTS with 2-year max-age and preload.
   - `Permissions-Policy`: Hardens browser features (`camera=(), microphone=(), geolocation=(), payment=(), usb=()`).
   - `X-Content-Type-Options`: `nosniff` prevents MIME confusion attacks.
   - `X-Frame-Options`: `DENY` prevents clickjacking.
   - `Cross-Origin-Opener-Policy`: `same-origin` guarantees process isolation.
   - `X-Permitted-Cross-Domain-Policies`: `none` restricts Flash/PDF cross-domain policies.
   - `X-Request-Id`: Unique UUID tracing across every serverless transaction.

2. **Input Sanitization & Schema Validation**:
   - Zero-trust input boundaries via Valibot schema validation.
   - String inputs stripped of HTML and script tags via deterministic regex sanitization.
   - Rate limiting enforced via `rate-limiter-flexible` per client IP.

3. **Dependency Scanning & Auditing**:
   - Automated CodeQL static code analysis on push and pull requests.
   - Zero unvetted runtime dependencies.

## Reporting a Vulnerability

If you discover a security vulnerability, please submit a report through GitHub Security Advisories or contact the maintainer directly at `hmpunith8748@gmail.com`. We aim to acknowledge reports within 24 hours.
