# I/O Contract: pe-signal-detection

## Skill-Level Contract

| | Details |
|---|---|
| **Required Inputs** | At least one artifact type in the repo (health-checks, demand-signals, decision-records, signal-detection reports, initiatives, or portfolio-health) |
| **Optional Inputs** | `foundation/business-model-summary.md`, `foundation/domains/11-strategic-priorities.md` (business framing); `intelligence/_index/{category}.md` index files (accelerate lookup); prior `intelligence/signal-detection/` reports (enable prediction tracking, signal history, recurring escalation); MySQL database connection (Source 1 — pymysql direct connection via env vars to `system_travelapp`) |
| **Produces** | `intelligence/signal-detection/YYYY-MM-DD.md` (signal report with classified signal table, CRITICAL/WARNING detail cards, opportunity table, summary dashboard, recommended actions, intelligence freshness report) |
| **Updates** | `intelligence/_index/` — relevant index file for `intelligence-report` artifact type (report_type: signal-detection); prior signal-detection report frontmatter set to `status: superseded` |

---

## Step-Level Contracts

### Step 0: State Detection (Where Am I?)

| Field | Details |
|---|---|
| **Inputs** | `artifacts/health-checks/`, `artifacts/demand-signals/`, `artifacts/decision-records/`, `intelligence/signal-detection/`, `intelligence/portfolio-health/`, `initiatives/active/`; `intelligence/_index/{category}.md` (fast-path); `foundation/business-model-summary.md`, `foundation/domains/11-strategic-priorities.md` |
| **Outputs** | Intelligence Manifest (counts, newest/oldest dates per artifact type, prior signal report date, foundation load status) |
| **Feeds Into** | Step 1 (DB scan — determines business context); Step 2 (Memory scan — files to read); Step 3 (Web scan — search topics derived from context); Step 9 (Freshness Report — manifest data reused) |

---

### Step 0b: Foundation Check (Graceful Degradation)

| Field | Details |
|---|---|
| **Inputs** | `foundation/business-model-summary.md` existence check (from Step 0) |
| **Outputs** | Nudge if foundation missing; note if proceeding without context |
| **Feeds Into** | Step 3 (Web scan topics adapt to available business context) |

---

### Step 1: Source 1 — Internal Database Scan (MySQL)

| Field | Details |
|---|---|
| **Inputs** | MySQL database (pymysql direct connection via env vars — query templates in `references/scan-templates.md`); 5 sub-scans: booking velocity (current 30d vs. prior 30d, YoY, 90d rolling avg), revenue anomaly (avg booking value, top-10 revenue concentration), cancellation/postponement signals (cancellation rate, postponement rate), conversion signals (request-to-booking rate by destination/source), customer behavior (lead time, destination preference shifts, new market activity) |
| **Outputs** | DB signals per sub-scan: flagged metrics with GROWTH (>+15%), DECLINE (>-15%), or ANOMALY tags |
| **Feeds Into** | Step 4 (Signal Report — rows sourced as DB-1.1 through DB-1.5); Step 5 (Priority Detail Cards for CRITICAL/WARNING signals) |

---

### Step 2: Source 2 — Memory Intelligence Scan

| Field | Details |
|---|---|
| **Inputs** | All files from Step 0 manifest: `artifacts/health-checks/`, `artifacts/demand-signals/`, `artifacts/decision-records/`, `initiatives/active/`, `intelligence/portfolio-health/`, prior `intelligence/signal-detection/` reports |
| **Outputs** | (2.1) Stale artifact flags (>90 days): WARNING for decision-records and health-checks, INFO for demand-signals; (2.2) Unactioned findings: high-priority recommendations with no active initiative after >30 days; (2.3) Prediction tracking: CONFIRMED / REFUTED / STILL PENDING vs. prior signal report predictions; (2.4) Pattern completion: recurring signals escalated if appearing in 3+ consecutive reports |
| **Feeds Into** | Step 4 (Signal Report — rows with signal history notation); Step 5 (Priority Detail Cards); Step 9 (Freshness Report — stale counts) |

---

### Step 3: Source 3 — External Signal Scan (Quick Web Search)

| Field | Details |
|---|---|
| **Inputs** | Business context from Step 0 (competitor names, key markets, destinations from foundation); any "watch" topics flagged in prior signal report; 4–6 parallel web searches: competitor pricing/launches, travel industry news (current month), regulatory/visa changes, economic/currency movements in source markets, major events/disruptions in destination markets |
| **Outputs** | Web findings classified by signal taxonomy — only recent (≤30 days), portfolio-relevant, actionable items retained |
| **Feeds Into** | Step 4 (Signal Report — rows sourced as Web); Step 5 (Priority Detail Cards for CRITICAL/WARNING web signals) |

---

### Step 4: Signal Report

| Field | Details |
|---|---|
| **Inputs** | All signals from Steps 1, 2, 3; signal taxonomy from `references/scan-templates.md` (categories: GROWTH, DECLINE, ANOMALY, COMPETITIVE, MARKET, OPERATIONAL; severities: CRITICAL, WARNING, OPPORTUNITY, INFO); prior signal report (for [NEW] / [↑ ESCALATED] / [↓ RESOLVED] / [→ RECURRING x3] notation) |
| **Outputs** | Classified signal table (signal title, category, severity, source, key metric, vs. baseline, signal history notation) |
| **Feeds Into** | Step 5 (CRITICAL/WARNING signals → detail cards); Step 6 (OPPORTUNITY signals → opportunity table); Step 7 (Dashboard — count matrix by category × severity) |

---

### Step 5: Priority Signal Detail Cards

| Field | Details |
|---|---|
| **Inputs** | Every CRITICAL or WARNING signal from Step 4; `references/scan-templates.md` (detail card format); pe-skill name mapping |
| **Outputs** | WHAT / SO WHAT / WHAT NOW cards per signal: exact numbers, impact assessment, recommended pe-skill, data needed, decision owner, confidence (H/M/L), signal history |
| **Feeds Into** | Step 8 (Recommended Actions — actions derived from WHAT NOW fields) |

---

### Step 6: Opportunity Signals

| Field | Details |
|---|---|
| **Inputs** | All OPPORTUNITY-severity signals from Step 4 |
| **Outputs** | Opportunity table (title, category, source, why now, recommended next step + skill) |
| **Feeds Into** | Step 8 (Recommended Actions — THIS QUARTER items) |

---

### Step 7: Signal Summary Dashboard

| Field | Details |
|---|---|
| **Inputs** | Complete signal table from Step 4 (all rows with category and severity) |
| **Outputs** | Count matrix (category × severity); top signal one-liner; scan coverage summary (DB connected/disconnected, repo file count, web search count) |
| **Feeds Into** | Step 10 (Storage — `signals_found`, `critical`, `warning`, `opportunity`, `info` frontmatter fields) |

---

### Step 8: Recommended Actions

| Field | Details |
|---|---|
| **Inputs** | WHAT NOW fields from Step 5 detail cards; OPPORTUNITY table from Step 6; urgency/severity classifications |
| **Outputs** | Prioritized action list in three tiers: THIS WEEK (Critical/time-sensitive), THIS MONTH (Warning/moderate), THIS QUARTER (Opportunity/strategic) — each with pe-skill and owner role |
| **Feeds Into** | Step 10 (Storage — surfaced in report body) |

---

### Step 9: Intelligence Freshness Report

| Field | Details |
|---|---|
| **Inputs** | Manifest counts and date ranges from Step 0; stale flags from Step 2.1 |
| **Outputs** | Freshness table (type, count, newest, oldest, stale count) for: health-checks, demand-signals, decision-records, signal-reports, portfolio-health, active-initiatives; overall health (GREEN/YELLOW/RED); recommended refresh order |
| **Feeds Into** | Step 10 (Storage — surfaced in report body) |

---

### Step 10: Storage

| Field | Details |
|---|---|
| **Inputs** | All analysis sections (Steps 4–9); signal counts from Step 7; `top_signal` from Step 4 |
| **Outputs** | `intelligence/signal-detection/YYYY-MM-DD.md` (committed to GitHub); prior report updated to `status: superseded`; `intelligence/_index/` index row added/updated; Perplexity memory pointer |
| **Feeds Into** | Future signal-detection runs (Step 0 — prior report for prediction tracking and signal history); pe-portfolio-health Step 0; pe-cross-initiative-patterns Step 1 |

---

## Dependency Graph

```
foundation docs ──────────────────────┐
                                       │
Step 0: State Detection ───────────────┤
    (repo artifact manifest)           │
    │                                  │
    ├──► Step 1: MySQL DB Scan ─────┐  │
    │    (booking, revenue,          │  │
    │     amendments, conversion,    │  │
    │     customer behavior)         │  │
    │                                │  │
    ├──► Step 2: Memory Scan ───────►│  │
    │    (health-checks,             │  │
    │     demand-signals,            │  │
    │     decision-records,          │  │
    │     initiatives, prior         │  │
    │     signal reports)            │  │
    │                                │  │
    └──► Step 3: Web Search ────────►│  │
         (competitor/industry/        │  │
          macro/event signals)        │  │
                                      │  │
                                      ▼  │
                             Step 4: Signal Report
                             (classified signal table)
                                      │
                 ┌────────────────────┼────────────────────┐
                 ▼                    ▼                     ▼
        Step 5: Detail Cards  Step 6: Opportunities  Step 7: Dashboard
        (CRITICAL/WARNING)    (OPPORTUNITY signals)  (count matrix)
                 │                    │                     │
                 └────────────────────┘                     │
                              │                             │
                              ▼                             │
                    Step 8: Recommended Actions             │
                              │                             │
Step 0 ──► Step 9: Freshness Report ◄───────────────────────┘
                              │
                              ▼
                   Step 10: Storage
                   → intelligence/signal-detection/YYYY-MM-DD.md
                   → intelligence/_index/ (updated)
                   → prior report (status: superseded)
```

---

## Artifact Registry

| Artifact | Path Pattern | Frontmatter Type | Depends On |
|---|---|---|---|
| Signal Detection Report | `intelligence/signal-detection/YYYY-MM-DD.md` | `intelligence-report` (report_type: `signal-detection`) | health-checks, demand-signals, decision-records, initiatives, MySQL (pymysql direct), web search results |
| Intelligence Index (signal-detection) | `intelligence/_index/intelligence-reports.md` | index | Signal Detection Report |
