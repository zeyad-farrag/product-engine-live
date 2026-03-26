# Signal History Reference

This file defines the methodology for:
1. Signal tracking over time — how signals age, escalate, and resolve
2. False positive handling — how to acknowledge and log incorrect predictions
3. Recurring signal escalation — the 3-report rule
4. Prediction tracking protocol — how to log and check directional predictions

---

## 1. Signal Lifecycle

Every signal has a lifecycle status that must be tracked when prior reports exist:

| Status | Definition | Tag in Report |
|--------|-----------|---------------|
| **New** | First appearance in this report; not present in any prior report | `[NEW]` |
| **Recurring** | Appeared in 2 prior reports; no active initiative addressing it | `[RECURRING x N]` where N = total consecutive appearances |
| **Escalated** | Severity increased vs. prior report (e.g., WARNING → CRITICAL) | `[↑ ESCALATED from WARNING]` |
| **De-escalated** | Severity decreased vs. prior report (e.g., CRITICAL → WARNING) | `[↓ DE-ESCALATED from CRITICAL]` |
| **Resolving** | Signal was present before; deviation now below threshold but not zero | `[→ RESOLVING]` |
| **Resolved** | Signal no longer detectable; metric has returned to baseline | `[✓ RESOLVED — was [severity] for N reports]` |

### Tracking Resolved Signals

Even when a signal resolves, include a brief resolved signal note in the report:

```
RESOLVED SIGNALS (no longer active)
─────────────────────────────────────────────────────────
[Signal title] — resolved after [N] reports. Final status: [metric returned to X].
Cause identified: [yes/no — if yes, brief explanation]
```

This prevents resolved signals from being re-flagged as new in future scans.

---

## 2. The 3-Report Recurring Signal Rule

**Rule**: Any signal that has appeared in **3 or more consecutive** signal-detection reports **without a corresponding active initiative** in `initiatives/active/` is automatically escalated one severity level.

**Rationale**: Recurring unaddressed signals become background noise. Escalation forces explicit acknowledgment — either take action or formally log a decision to accept the risk.

### Escalation Chain

```
INFO (x3 consecutive) → WARNING
WARNING (x3 consecutive) → CRITICAL
CRITICAL (x3 consecutive) → CRITICAL + add note: "This signal has been CRITICAL for N consecutive reports without resolution."
```

### Check Protocol

When reading prior reports in Step 2:

1. Build a list of all signals from the **most recent prior report** (by signal title)
2. For each signal, check the 2nd and 3rd most recent prior reports for the same signal title
3. Count consecutive appearances
4. Cross-reference `initiatives/active/` to check if an initiative was created to address it
5. Apply escalation if: consecutive_count >= 3 AND no matching active initiative

### Counting Consecutive Reports

Use the signal title as the primary key. Normalize titles (lowercase, strip special characters) before comparing. A signal is "same" if the title is ≥80% similar and the category matches.

```
consecutive_count:
  report N-1: contains signal? +1
  report N-2: contains signal? +1 (only if N-1 also contained it)
  report N-3: contains signal? +1 (only if N-1 and N-2 also contained it)
```

If a signal was absent in any intervening report, the consecutive count resets to 1 (it's effectively a new signal).

### Documentation

When escalating a recurring signal, add to the detail card:

```
Signal History: RECURRING x [N] | First seen: [date] | Last escalation: [reason or "none"]
Escalation note: "This signal has appeared in [N] consecutive reports.
No active initiative found in initiatives/active/ to address it.
Severity auto-escalated from [prior] to [current].
Recommended: Log a formal decision (run pe-decision-record) or create an initiative."
```

---

## 3. False Positive Handling

A **false positive** is a signal that was flagged in a prior report but subsequent data showed the metric returned to baseline on its own, without any intervention — or the prediction attached to the signal did not materialise.

### Identifying False Positives

Compare prior signal WHAT statements to current data:
- If the prior signal said "booking volume has declined -22%" and current data shows volume is back to baseline without action → potential false positive
- If a WARNING signal said "at this trajectory, conversion will fall below 2% within 4 weeks" and 4+ weeks have passed and conversion is still above 2% → false positive prediction

### Logging False Positives

Add a False Positive Log entry in the current report's signal history section:

```
FALSE POSITIVE LOG
─────────────────────────────────────────────────────────────────
[Date of prior report] — [Signal title]
  What was flagged: [summary of the signal]
  What actually happened: [what the data shows now]
  Assessment: [One-time statistical noise | Seasonal reversion | Data quality issue | Other]
  Impact on thresholds: [Should we adjust the detection threshold? Y/N — reason]
```

### Adjusting for Systematic False Positives

If the same type of signal generates false positives in 2+ consecutive periods (e.g., every November booking velocity flags as DECLINE but it's actually the start of a seasonal dip), create a **Seasonal Baseline Adjustment** note:

```
SEASONAL BASELINE NOTE
─────────────────────────────────────────────────────────────────
Pattern: [description, e.g., "November booking velocity consistently -18% vs. prior 30d"]
Observed: [dates of false positive occurrences]
Recommendation: For [month/period], raise the detection threshold to [X]% or compare
against same-period-LY only (not prior 30d).
Apply from: [date this adjustment takes effect]
```

Store this in the signal-detection report frontmatter under tags so future scans can retrieve it.

---

## 4. Prediction Tracking Protocol

Predictions are directional statements about future outcomes made in a signal detail card's SO WHAT section. When a signal report includes a forward-looking statement, it must be trackable.

### Logging a Prediction

When writing a SO WHAT statement that is predictive, append a `PREDICTION LOG` entry at the end of the signal card:

```
PREDICTION LOG:
  Statement: "[Exact prediction, e.g.: If current trajectory continues, Product X
               bookings will fall below 80/month within 6 weeks]"
  Metric to check: [booking_count for Product X]
  Threshold: [80 bookings/month]
  Check date: [date 6 weeks from now]
  Confidence: [H/M/L]
```

### Checking Predictions in Step 2

During Source 2 (Memory Intelligence Scan), when reading prior signal reports:
1. Extract all PREDICTION LOG entries
2. Check if the check date has passed
3. Query the relevant metric from MySQL (or from the most recent health check artifact)
4. Classify the prediction:

```
PREDICTION OUTCOME:
  Original (from [date]): "[statement]"
  Check date reached: [yes/no]
  Actual metric value: [X]
  Threshold: [Y]
  Outcome: CONFIRMED | REFUTED | STILL PENDING
  
  If REFUTED → log as FALSE POSITIVE (see section 3)
  If CONFIRMED → note supporting evidence; adjust confidence score upward for this signal type
  If STILL PENDING → carry forward; note new check date
```

### Prediction Confidence Calibration

Track prediction accuracy over time. Once 10+ predictions have been evaluated:

| Signal Type | Confirmed | Refuted | Pending | Accuracy |
|-------------|-----------|---------|---------|----------|
| DECLINE     | N         | N       | N       | %        |
| GROWTH      | N         | N       | N       | %        |
| ANOMALY     | N         | N       | N       | %        |

This accuracy history should inform future confidence ratings (H/M/L) for each signal category.

---

## 5. Intelligence Freshness Definitions

| Age of Artifact | Classification |
|----------------|----------------|
| 0–30 days      | Fresh |
| 31–90 days     | Aging |
| 91–180 days    | Stale (flag as INFO in report) |
| >180 days      | Critical stale (flag as WARNING; data may be actively misleading) |

### Freshness Actions

| Artifact Type | Stale Threshold | Recommended Action |
|--------------|----------------|-------------------|
| Health Checks | >90 days | Run `pe-product-health-check` |
| Demand Signals | >90 days | Run `pe-demand-signal-mining` |
| Portfolio Health | >90 days | Run `pe-portfolio-health` |
| Decision Records | >180 days | Review decisions for continued relevance |
| Signal Reports | >30 days | Run new signal detection (this skill) |
| Active Initiatives | >90 days with no update | Flag for initiative review |

---

## 6. Signal ID Convention

For auditability, assign each signal a unique ID in the format:

```
[YYYY-MM-DD]-[CATEGORY-CODE]-[N]
```

Where:
- `YYYY-MM-DD` = date of the report
- `CATEGORY-CODE` = GRW | DEC | ANO | COM | MKT | OPS
- `N` = sequential number within that category for this report

Examples:
- `2025-06-15-DEC-1` — first DECLINE signal in the June 15 report
- `2025-06-15-OPS-2` — second OPERATIONAL signal in the June 15 report

This ID should appear in the signal table (Step 4) and in the signal card header (Step 5), and is used to reference specific signals in initiatives and decision records.
