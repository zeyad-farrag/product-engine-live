# Index Fallback — Directory Scanning Patterns

Use this when `intelligence/_index/` files don't exist or return errors. Scan artifact directories directly to gather the same information needed for query filtering.

**When to use**: If reading any index file fails (404, empty, or error), fall back to this pattern for ALL artifact types (don't mix index reads with directory scans — use one approach consistently per query run).

**Inform the user**:
> "Index files not found — scanning directories directly. Run pe-memory-maintenance to build the index for faster queries."

---

## Directory Scanning Commands

All commands use `api_credentials=["github"]` with the `gh` CLI.

### Personas

```bash
# List all persona files
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

# Read a specific persona file (repeat for each)
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/personas/[filename].md \
  --jq '.content' | base64 -d
```

### Competitors

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/competitors/[filename].md \
  --jq '.content' | base64 -d
```

### Demand Signals

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/demand-signals \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/demand-signals/[filename].md \
  --jq '.content' | base64 -d
```

### Health Checks

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/health-checks/[filename].md \
  --jq '.content' | base64 -d
```

### Gap Analyses

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/gap-analyses/[filename].md \
  --jq '.content' | base64 -d
```

### Market Assessments

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/market-assessments \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/market-assessments/[filename].md \
  --jq '.content' | base64 -d
```

### Decision Records

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/artifacts/decision-records/[filename].md \
  --jq '.content' | base64 -d
```

### Initiatives

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/initiatives \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/initiatives/[filename].md \
  --jq '.content' | base64 -d
```

### Intelligence Reports

Intelligence reports may be organized in subdirectories by type:

```bash
# Top-level listing
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

# Check for subdirectories (portfolio-health, signal-detection, cross-initiative-patterns)
gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/portfolio-health \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/signal-detection \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/intelligence/cross-initiative-patterns \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"
```

### Foundation

```bash
gh api repos/zeyad-farrag/Product-Engine/contents/foundation \
  --jq '[.[] | select(.type=="file") | {name, path}]' 2>/dev/null || echo "[]"

gh api repos/zeyad-farrag/Product-Engine/contents/foundation/[filename].md \
  --jq '.content' | base64 -d
```

---

## Batch Scan Script

Run this single script to list all artifact paths across all directories at once:

```bash
for dir in artifacts/personas artifacts/competitors artifacts/demand-signals \
            artifacts/health-checks artifacts/gap-analyses artifacts/market-assessments \
            artifacts/decision-records initiatives intelligence foundation; do
  echo "=== $dir ===" && \
  gh api "repos/zeyad-farrag/Product-Engine/contents/${dir}" \
    --jq '[.[] | select(.type=="file") | .path]' 2>/dev/null || echo "[]"
done
```

---

## Frontmatter Extraction in Fallback Mode

When reading artifacts directly (no index), extract filter dimensions from YAML frontmatter. Parse these fields:

```yaml
markets: [Germany, Australia]        # source markets
destinations: [Egypt, Jordan]        # destination countries
confidence: HIGH                     # HIGH / MEDIUM / LOW
status: active                       # active / superseded / archived
updated: 2026-03-15                  # or use `date` field
session: market-entry-germany        # initiative slug
depends_on:                          # dependency list
  - artifacts/personas/german-leisure-traveler.md
```

**Fallback column construction**: Build equivalent index rows from frontmatter:

| Frontmatter Field | Index Column |
|---|---|
| `title` or filename | Subject |
| `markets` | Markets |
| `destinations` | Destinations |
| `updated` or `date` | Updated |
| `author` (default: "unknown") | Author |
| `confidence` (default: MEDIUM) | Confidence |
| `status` (default: active) | Status |
| `session` (default: standalone) | Session |
| `depends_on` (default: —) | Depends On |

---

## Scalability Note

Directory scanning is significantly slower than index reads:
- Index path: ~1 API call per index file = 10 calls total
- Fallback path: 10 directory listings + N artifact reads = 10 + N calls

For repos with 50+ artifacts, the fallback will be slow. Strongly recommend running `pe-memory-maintenance` after any fallback query to build/rebuild the index.

---

## Error Handling

| Error | Meaning | Action |
|---|---|---|
| `404 Not Found` on directory | Directory doesn't exist yet | Skip this type; note "no [type] directory found" in coverage gaps |
| `[] ` (empty array) | Directory exists but empty | Note "0 [type] artifacts found" |
| `base64 -d` error | File content couldn't be decoded | Skip file; log path as unreadable |
| Rate limit (403) | Too many API calls | Pause and inform user; process remaining files in a follow-up |
