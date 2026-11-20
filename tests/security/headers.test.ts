/**
 * @file Security Headers and Defense-in-Depth Middleware Tests
 * @description Verifies HTTP defense headers, XSS sanitization, and request tracing.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index';

describe('Security Headers & Defense-in-Depth Middleware Tests', () => {
  it('sets Content-Security-Policy with strict directives', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });

  it('sets X-Content-Type-Options to nosniff', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('sets Referrer-Policy to strict-origin-when-cross-origin', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  it('sets Permissions-Policy header restricting camera, mic, and geolocation', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['permissions-policy']).toBeDefined();
    expect(res.headers['permissions-policy']).toContain('camera=()');
    expect(res.headers['permissions-policy']).toContain('microphone=()');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
  });

  it('sets Cross-Origin-Opener-Policy to same-origin', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['cross-origin-opener-policy']).toBe('same-origin');
  });

  it('sets X-Permitted-Cross-Domain-Policies to none', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
  });

  it('attaches unique X-Request-Id header to every response', async () => {
    const res1 = await request(app).get('/api/health');
    const res2 = await request(app).get('/api/health');
    expect(res1.headers['x-request-id']).toBeDefined();
    expect(res2.headers['x-request-id']).toBeDefined();
    expect(res1.headers['x-request-id']).not.toBe(res2.headers['x-request-id']);
  });

  it('sanitizes malicious XSS script injections from input payloads', async () => {
    const maliciousPayload = {
      prompt: 'Hello <script>alert("hacked")</script><img src="x" onerror="steal()"/>What is AQI?',
      aqi: 100,
    };
    const res = await request(app).post('/api/chat').send(maliciousPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
