# Product Engine — Staging

Development environment for the Product Engine system. Build and test skills here before promoting to production.

**Production repo**: [`product-engine-live`](https://github.com/zeyad-farrag/product-engine-live) — where the team runs skills and intelligence accumulates.

## What's here

- `_prompts/` — Original prompt archive (the source material skills were built from)
- `_skills/` — Development versions of all 16 skills
- `dashboard/` — Dashboard web app source code (Express + React + Python MySQL API)
- `ARCHITECTURE.md` — System architecture spec

## Workflow

1. **Develop** here — create or modify skills, test against the dashboard
2. **Promote** to `product-engine-live` — copy validated skills to production
3. **Team uses** production — artifacts accumulate in the live repo
4. **Dashboard** reads from production — points to `product-engine-live`

## Dashboard

```bash
cd dashboard
pip install fastapi uvicorn pymysql
python3 server/mysql-api.py &    # MySQL API on port 8001
npm install && npm run dev       # Dashboard on port 5000
```

Set `GITHUB_TOKEN` to read from the production repo.
