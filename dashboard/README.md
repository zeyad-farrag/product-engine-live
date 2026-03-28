# Product Engine Dashboard

Full-stack intelligence dashboard for the Product Engine. Surfaces artifacts, initiatives, market signals, coverage matrices, skill management, and live performance metrics from a remote MySQL database.

## Prerequisites

- **Node.js 20+** and npm
- **Python 3.9+** and pip
- **MySQL** — remote database for performance metrics (optional; the dashboard runs in demo mode without it)

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | No | — | GitHub PAT (repo scope). Omit to run in demo mode with mock data. |
| `PORT` | No | `5000` | Express server port |
| `MYSQL_API_PORT` | No | `8001` | MySQL FastAPI port (docker-compose only) |
| `NODE_ENV` | No | `development` | Set to `production` for built assets |

## Modes

- **Live mode** (`GITHUB_TOKEN` set): Fetches artifacts, signals, freshness data, skills, and actions from the `zeyad-farrag/Product-Engine` GitHub repo via the Contents API. Responses are cached for 60 seconds.
- **Demo mode** (no token): Returns hardcoded mock data for all endpoints. Write operations return `403`.

## Local Development

```bash
# Install Node dependencies
npm install

# Install Python dependencies
pip install pymysql fastapi uvicorn python-dateutil

# Start the Express dev server (port 5000)
npm run dev

# In a separate terminal, start the MySQL API (port 8001)
cd server && uvicorn mysql-api:app --host 0.0.0.0 --port 8001
```

The Vite dev server runs inline with HMR. The Express API and React frontend are both served from port 5000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (Vite + tsx) |
| `npm run build` | Production build (Vite client + esbuild server) |
| `npm start` | Start production server from `dist/` |
| `npm run check` | TypeScript type check |

## Production Build

```bash
npm run build    # Builds client (Vite) + server (esbuild) into dist/
npm start        # Runs dist/index.cjs on port 5000
```

## Docker Deployment

```bash
# From the repo root
docker compose up --build

# Or build the image directly
cd dashboard
docker build -t product-engine-dashboard .
docker run -p 5000:5000 -p 8001:8001 --env-file .env product-engine-dashboard
```

The Docker image uses **supervisord** to manage both the Node.js server and the Python MySQL API in a single container.

## Render.com

A `render.yaml` at the repo root defines both services. Connect the repo to Render and it will auto-detect the blueprint.

## Heroku / Railway

A `Procfile` is included:
- `web` — starts the Node.js production server
- `worker` — starts the Python MySQL API

## Architecture

```
dashboard/
  client/src/       React frontend (Vite, TailwindCSS, shadcn/ui)
  server/           Express API server
    routes.ts       API route definitions (live/demo branching)
    github.ts       GitHub Contents API integration + caching
    mockData.ts     Demo mode fallback data
  shared/           Shared TypeScript types
  script/           Build tooling
```

## API Endpoints

### Intelligence

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/overview` | Dashboard summary stats |
| GET | `/api/artifacts` | List artifacts (query: `type`, `market`, `confidence`, `status`) |
| GET | `/api/artifacts/:id` | Single artifact with content |
| GET | `/api/initiatives` | List initiatives |
| GET | `/api/signals` | List market signals |
| GET | `/api/freshness` | Data freshness metrics |
| GET | `/api/coverage` | Coverage matrix (market × type) |
| GET | `/api/actions` | Quick action suggestions |
| GET | `/api/tree` | Repository file tree |
| POST | `/api/refresh` | Invalidate server cache |

### Actions

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/actions/rebuild-index` | Trigger index rebuild |
| POST | `/api/actions/signal-scan` | Trigger signal scan |

### Skills

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/skills` | List all skills |
| GET | `/api/skills/:name` | Skill detail + files |
| GET | `/api/skills/:name/file?path=` | Read a specific skill file |
| PUT | `/api/skills/:name/file?path=` | Update a skill file |
| POST | `/api/skills` | Create a new skill |
| DELETE | `/api/skills/:name` | Archive a skill |

### Performance (proxied to MySQL API on port 8001)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/performance/kpis` | KPI metrics (current vs previous month) |
| GET | `/api/performance/booking-velocity?period=30` | Daily booking velocity |
| GET | `/api/performance/monthly-trends?months=12` | Monthly aggregated metrics |
| GET | `/api/performance/market-breakdown` | Breakdown by country |
| GET | `/api/performance/product-mix` | Breakdown by product type |
| GET | `/api/performance/destination-mix` | Breakdown by destination |
| GET | `/api/performance/website-sources` | Breakdown by referrer |
| GET | `/api/performance/booking-funnel` | Request status funnel |
| GET | `/api/performance/ratings-summary` | Customer ratings |

### System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check (server, GitHub, MySQL API status) |
| GET | `/api/system` | System info (mode, repo, skill count) |
