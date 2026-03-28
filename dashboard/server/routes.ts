import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  mockArtifacts,
  mockInitiatives,
  mockSignals,
  mockFreshness,
  mockQuickActions,
  buildCoverageMatrix,
  getOverview,
  mockSkills,
  getMockSkillDetail,
} from "./mockData";
import {
  fetchAllIndexes,
  fetchArtifactContent,
  fetchInitiatives,
  fetchTree,
  invalidateCache,
  fetchAllSkills,
  fetchSkillDetail,
  fetchSkillFile,
  updateSkillFile,
  createSkill,
  archiveSkill,
} from "./github";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "zeyad-farrag/product-engine-live";
const IS_DEMO = !GITHUB_TOKEN;

const MARKETS = ["Germany", "United Kingdom", "Australia", "France"];
const ARTIFACT_TYPES = ["Persona", "Competitor", "Demand Signal", "Health Check", "Gap Analysis", "Market Assessment"];

function buildLiveCoverageMatrix(artifacts: any[]): Array<{ market: string; type: string; count: number; depth: string; artifactIds: string[] }> {
  const matrix: Array<{ market: string; type: string; count: number; depth: string; artifactIds: string[] }> = [];
  // Collect all unique markets from artifacts + defaults
  const allMarkets = new Set([...MARKETS]);
  for (const a of artifacts) {
    for (const m of (a.markets || [])) allMarkets.add(m);
  }

  for (const market of allMarkets) {
    for (const type of ARTIFACT_TYPES) {
      const matching = artifacts.filter(a => a.type === type && (a.markets || []).includes(market));
      const freshMatching = matching.filter(a => (a.status || "").toUpperCase() !== "STALE");
      let depth = "BLIND";
      if (freshMatching.length >= 4) depth = "DEEP";
      else if (freshMatching.length >= 2) depth = "MODERATE";
      else if (freshMatching.length >= 1) depth = "THIN";
      matrix.push({ market, type, count: matching.length, depth, artifactIds: matching.map(a => a.id) });
    }
  }
  return matrix;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Overview data
  app.get("/api/overview", async (_req, res) => {
    if (IS_DEMO) {
      return res.json(getOverview());
    }
    try {
      const artifacts = await fetchAllIndexes();
      const stale = artifacts.filter((a) => a.status === "STALE").length;
      const coverageMatrix = buildLiveCoverageMatrix(artifacts);
      const totalCells = coverageMatrix.length;
      const coveredCells = coverageMatrix.filter((c) => c.depth !== "BLIND").length;
      const coverageScore = totalCells > 0 ? Math.round((coveredCells / totalCells) * 100) : 0;
      const initiatives = await fetchInitiatives();

      res.json({
        totalArtifacts: artifacts.length,
        activeInitiatives: initiatives.filter((i) => i.status === "ACTIVE").length,
        criticalSignals: mockSignals.filter((s) => s.severity === "CRITICAL").length,
        staleArtifacts: stale,
        coverageScore,
        recentActivity: [...artifacts]
          .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
          .slice(0, 10),
        activeInitiativesList: initiatives.filter((i) => i.status === "ACTIVE"),
      });
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // All artifacts
  app.get("/api/artifacts", async (req, res) => {
    if (IS_DEMO) {
      let result = [...mockArtifacts];
      const { type, market, confidence, status } = req.query;
      if (type) result = result.filter((a) => a.type === type);
      if (market) result = result.filter((a) => a.markets.includes(market as string));
      if (confidence) result = result.filter((a) => a.confidence === confidence);
      if (status) result = result.filter((a) => a.status === status);
      result.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
      return res.json(result);
    }
    try {
      let artifacts = await fetchAllIndexes();
      const { type, market, confidence, status } = req.query;
      if (type) artifacts = artifacts.filter((a) => a.type === type);
      if (market) artifacts = artifacts.filter((a) => a.markets.includes(market as string));
      if (confidence) artifacts = artifacts.filter((a) => a.confidence === confidence);
      if (status) artifacts = artifacts.filter((a) => a.status === status);
      artifacts.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
      res.json(artifacts);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Single artifact
  app.get("/api/artifacts/:id", async (req, res) => {
    if (IS_DEMO) {
      const artifact = mockArtifacts.find((a) => a.id === req.params.id);
      if (!artifact) return res.status(404).json({ error: "Not found" });
      return res.json(artifact);
    }
    try {
      const artifacts = await fetchAllIndexes();
      const artifact = artifacts.find((a) => a.id === req.params.id);
      if (!artifact) return res.status(404).json({ error: "Not found" });
      if (artifact.path) {
        const { body } = await fetchArtifactContent(artifact.path);
        artifact.content = body;
      }
      res.json(artifact);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Initiatives
  app.get("/api/initiatives", async (_req, res) => {
    if (IS_DEMO) {
      return res.json(mockInitiatives);
    }
    try {
      const initiatives = await fetchInitiatives();
      res.json(initiatives);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Signals
  app.get("/api/signals", (_req, res) => {
    res.json(mockSignals);
  });

  // Freshness data
  app.get("/api/freshness", (_req, res) => {
    res.json(mockFreshness);
  });

  // Coverage matrix
  app.get("/api/coverage", async (_req, res) => {
    if (IS_DEMO) {
      return res.json(buildCoverageMatrix());
    }
    try {
      const artifacts = await fetchAllIndexes();
      return res.json(buildLiveCoverageMatrix(artifacts));
    } catch {
      return res.json(buildCoverageMatrix());
    }
  });

  // Quick actions
  app.get("/api/actions", (_req, res) => {
    res.json(mockQuickActions);
  });

  // Repo tree (live mode)
  app.get("/api/tree", async (_req, res) => {
    if (IS_DEMO) {
      return res.json({
        demo: true,
        tree: [
          "intelligence/_index/personas.md",
          "intelligence/_index/competitors.md",
          "intelligence/_index/demand-signals.md",
          "intelligence/_index/health-checks.md",
          "intelligence/_index/gap-analyses.md",
          "intelligence/_index/market-assessments.md",
          "intelligence/personas/german-family-traveler.md",
          "intelligence/competitors/fti-touristik-de.md",
          "intelligence/demand-signals/red-sea-diving-surge.md",
          "intelligence/initiatives/au-market-entry.md",
          "intelligence/initiatives/de-premium-package.md",
        ],
      });
    }
    try {
      const data = await fetchTree();
      res.json(data);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Invalidate cache (refresh)
  app.post("/api/refresh", (_req, res) => {
    invalidateCache();
    res.json({ message: "Cache invalidated", timestamp: new Date().toISOString() });
  });

  // Action triggers
  app.post("/api/actions/rebuild-index", (_req, res) => {
    res.json({
      message: "Index rebuild triggered — run pe-memory-maintenance in Perplexity Computer.",
      triggerPhrase: "Run memory maintenance — rebuild the index",
    });
  });

  app.post("/api/actions/signal-scan", (_req, res) => {
    res.json({
      message: "Signal scan triggered — run pe-signal-detection in Perplexity Computer.",
      triggerPhrase: "Run a signal detection scan",
    });
  });

  // ─── Skill Management Routes ────────────────────────────────────────

  // List all skills
  app.get("/api/skills", async (_req, res) => {
    if (IS_DEMO) {
      return res.json(mockSkills);
    }
    try {
      const skills = await fetchAllSkills();
      res.json(skills);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Get skill detail
  app.get("/api/skills/:name", async (req, res) => {
    if (IS_DEMO) {
      const detail = getMockSkillDetail(req.params.name);
      if (!detail) return res.status(404).json({ error: "Not found" });
      return res.json(detail);
    }
    try {
      const detail = await fetchSkillDetail(req.params.name);
      res.json(detail);
    } catch (err: any) {
      res.status(err.message?.includes("404") ? 404 : 502).json({ error: err.message });
    }
  });

  // Get a specific file from a skill (uses query param for filepath to avoid path-to-regexp issues)
  app.get("/api/skills/:name/file", async (req, res) => {
    if (IS_DEMO) {
      const detail = getMockSkillDetail(req.params.name);
      if (!detail) return res.status(404).json({ error: "Not found" });
      const filepath = req.query.path as string;
      if (filepath === "SKILL.md") return res.json({ content: detail.skillMd, sha: "demo", path: filepath });
      const ref = detail.referenceFiles.find((f) => f.path === filepath);
      if (ref) return res.json({ content: ref.content, sha: "demo", path: filepath });
      return res.status(404).json({ error: "File not found" });
    }
    try {
      const filepath = req.query.path as string;
      if (!filepath) return res.status(400).json({ error: "path query parameter is required" });
      const { content, sha } = await fetchSkillFile(req.params.name, filepath);
      res.json({ content, sha, path: filepath });
    } catch (err: any) {
      res.status(err.message?.includes("404") ? 404 : 502).json({ error: err.message });
    }
  });

  // Update a file in a skill (uses query param for filepath)
  app.put("/api/skills/:name/file", async (req, res) => {
    if (IS_DEMO) {
      return res.status(403).json({ error: "Write operations are not available in demo mode" });
    }
    try {
      const filepath = req.query.path as string;
      if (!filepath) return res.status(400).json({ error: "path query parameter is required" });
      const { content, message } = req.body;
      if (!content) return res.status(400).json({ error: "content is required" });
      const result = await updateSkillFile(req.params.name, filepath, content, message);
      res.json(result);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Create a new skill
  app.post("/api/skills", async (req, res) => {
    if (IS_DEMO) {
      return res.status(403).json({ error: "Write operations are not available in demo mode" });
    }
    try {
      const { name, description, layer, displayName } = req.body;
      if (!name || !description || !layer) {
        return res.status(400).json({ error: "name, description, and layer are required" });
      }
      if (!/^pe-[a-z0-9-]+$/.test(name)) {
        return res.status(400).json({ error: "Name must start with pe- and contain only lowercase letters, numbers, and hyphens" });
      }
      const result = await createSkill(name, description, layer, displayName);
      res.json(result);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // Delete (archive) a skill
  app.delete("/api/skills/:name", async (req, res) => {
    if (IS_DEMO) {
      return res.status(403).json({ error: "Write operations are not available in demo mode" });
    }
    try {
      const result = await archiveSkill(req.params.name);
      res.json(result);
    } catch (err: any) {
      res.status(502).json({ error: err.message });
    }
  });

  // ─── Performance Proxy Routes (MySQL API on port 8001) ──────────────
  app.get("/api/performance/:endpoint", async (req, res) => {
    try {
      const query = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `http://localhost:8001/mysql/${req.params.endpoint}${query ? `?${query}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: `MySQL API returned ${response.status}` });
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(502).json({ error: "MySQL API unavailable", details: err.message });
    }
  });

  // System info
  app.get("/api/system", (_req, res) => {
    res.json({
      mode: IS_DEMO ? "demo" : "live",
      repo: REPO,
      skillCount: 16,
      layers: ["Foundation", "Capabilities", "Intelligence", "Initiatives", "Memory"],
    });
  });

  return httpServer;
}
