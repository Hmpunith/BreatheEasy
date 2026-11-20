# BreatheEasy System Architecture

## Overview

BreatheEasy is built with a decoupled client-serverless architecture designed for extreme performance, security, and accessibility.

```mermaid
graph TD
    User([User Browser]) -->|HTTPS / WAI-ARIA Accessible UI| ReactApp[React 19 Frontend SPA]
    ReactApp -->|REST / JSON| VercelEdge[Vercel Serverless Edge Gateway]
    
    subgraph Security Layer
        VercelEdge --> SecurityHeaders[10 Edge Security Headers]
        SecurityHeaders --> RateLimiter[Rate Limiter Flexible]
        RateLimiter --> Sanitizer[Input Sanitizer & Valibot Validation]
    end

    subgraph Core Domain Services
        Sanitizer --> AQIService[AQI Classifier & Pollutant Engine]
        Sanitizer --> RoutineService[Dynamic Low-Emission Routine Engine]
        Sanitizer --> HackService[Indoor Air Quality Hacks Engine]
        Sanitizer --> ImpactService[Physics-Based Emission Calculator]
        Sanitizer --> CopilotService[AirSense Copilot Engine]
    end

    subgraph AI Intelligence
        CopilotService --> LRUCache[(LRU Memory Cache)]
        CopilotService --> GeminiAPI[Google Gemini 2.5 Flash]
        CopilotService --> Heuristics[Deterministic Fallback Heuristics]
    end
```

## Architectural Principles

1. **Strict Modularity**: Components follow Single Responsibility Principle (SRP). Every component is kept strictly under 170 lines.
2. **Deterministic Fallbacks**: Every AI integration has an offline fallback heuristic ensuring 100% uptime regardless of upstream API quota or network connectivity.
3. **Defense-in-Depth**: Multi-layer security protecting client, edge gateway, and serverless runtime.
4. **Zero-Overhead State**: Local state management using React hooks without heavyweight external dependencies.
