import type { Artifact, Initiative, Skill, SkillDetail, SkillReferenceFile } from "@shared/schema";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "zeyad-farrag/product-engine-live";

// 60-second in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 60_000; // 60 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(): void {
  cache.clear();
}

async function githubFetch(path: string): Promise<string> {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

async function githubFetchRaw(path: string): Promise<{ content: string; sha: string }> {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

async function githubListDir(path: string): Promise<Array<{ name: string; path: string; type: string }>> {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  return res.json();
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const yamlStr = match[1];
  const body = match[2];
  const frontmatter: Record<string, any> = {};

  for (const line of yamlStr.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.substring(0, colonIdx).trim();
    let value: any = line.substring(colonIdx + 1).trim();
    // Handle YAML arrays [item1, item2]
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
    }
    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

// Parse a markdown table from index files into artifact records
function parseIndexTable(content: string, indexType: string): Partial<Artifact>[] {
  const { body } = parseFrontmatter(content);
  const lines = body.split("\n").filter((l) => l.trim().startsWith("|"));

  if (lines.length < 2) return [];

  // First line is header, second is separator, rest are data
  const headerLine = lines[0];
  const headers = headerLine.split("|").map((h) => h.trim()).filter(Boolean);

  const artifacts: Partial<Artifact>[] = [];

  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.toLowerCase().replace(/\s+/g, "_")] = cells[idx] || "";
    });

    const markets = (row.markets || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    const destinations = (row.destinations || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    const dependsOn = (row.depends_on || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const artifact: Partial<Artifact> = {
      id: row.path || `${indexType}-${i}`,
      type: indexType,
      subject: row.subject || "",
      markets,
      destinations,
      updated: row.updated || "",
      created: row.updated || "",
      author: row.author || "",
      confidence: (row.confidence as any) || "MEDIUM",
      status: (row.status as any) || "ACTIVE",
      path: row.path || "",
      session: row.session || undefined,
      dependsOn: dependsOn.length > 0 ? dependsOn : undefined,
    };

    artifacts.push(artifact);
  }

  return artifacts;
}

// Map index file names to artifact types
const INDEX_TYPE_MAP: Record<string, string> = {
  "personas.md": "Persona",
  "competitors.md": "Competitor",
  "demand-signals.md": "Demand Signal",
  "health-checks.md": "Health Check",
  "gap-analyses.md": "Gap Analysis",
  "market-assessments.md": "Market Assessment",
  "decision-records.md": "Decision Record",
  "playbooks.md": "Playbook",
  "benchmarks.md": "Benchmark",
  "frameworks.md": "Framework",
};

// Fallback: scan artifact directories directly when indexes are empty
const ARTIFACT_DIRS: Record<string, string> = {
  "artifacts/personas": "Persona",
  "artifacts/competitors": "Competitor",
  "artifacts/demand-signals": "Demand Signal",
  "artifacts/health-checks": "Health Check",
  "artifacts/gap-analyses": "Gap Analysis",
  "artifacts/market-assessments": "Market Assessment",
  "artifacts/decision-records": "Decision Record",
};

async function scanArtifactDirectories(): Promise<Artifact[]> {
  const allArtifacts: Artifact[] = [];

  for (const [dir, type] of Object.entries(ARTIFACT_DIRS)) {
    try {
      const files = await githubListDir(dir);
      const mdFiles = files.filter((f) => f.name.endsWith(".md"));

      for (const file of mdFiles) {
        try {
          const content = await githubFetch(file.path);
          const { frontmatter, body } = parseFrontmatter(content);

          const markets = frontmatter.market
            ? (Array.isArray(frontmatter.market) ? frontmatter.market : [frontmatter.market])
            : [];
          const destinations = frontmatter.destinations
            ? (Array.isArray(frontmatter.destinations) ? frontmatter.destinations : [frontmatter.destinations])
            : [];
          const dependsOn = frontmatter.depends_on
            ? (Array.isArray(frontmatter.depends_on) ? frontmatter.depends_on : [frontmatter.depends_on])
            : undefined;

          const artifact: Artifact = {
            id: file.path,
            type,
            subject: frontmatter.name || frontmatter.subject || frontmatter.product || frontmatter.focus || file.name.replace(".md", ""),
            markets,
            destinations,
            updated: frontmatter.updated || frontmatter.created || "",
            created: frontmatter.created || "",
            author: frontmatter.author || "unknown",
            confidence: (frontmatter.confidence as any) || "MEDIUM",
            status: ((frontmatter.status || "active").toUpperCase() as any),
            path: file.path,
            session: frontmatter.session || frontmatter.initiative || "standalone",
            dependsOn,
            summary: body.trim().split("\n").slice(0, 3).join(" ").substring(0, 200),
          };

          allArtifacts.push(artifact);
        } catch {
          // Skip files that fail to parse
        }
      }
    } catch {
      // Directory might not exist yet
    }
  }

  return allArtifacts;
}

export async function fetchAllIndexes(): Promise<Artifact[]> {
  const cached = getCached<Artifact[]>("all-indexes");
  if (cached) return cached;

  try {
    // Try indexes first
    const files = await githubListDir("intelligence/_index");
    const indexFiles = files.filter((f) => f.name.endsWith(".md"));

    const allArtifacts: Artifact[] = [];

    for (const file of indexFiles) {
      const type = INDEX_TYPE_MAP[file.name] || file.name.replace(".md", "");
      try {
        const content = await githubFetch(file.path);
        const parsed = parseIndexTable(content, type);
        allArtifacts.push(...(parsed as Artifact[]));
      } catch {
        // Skip files that fail to parse
      }
    }

    // If indexes returned nothing, fall back to scanning directories
    if (allArtifacts.length === 0) {
      console.log("[github] Index files empty — falling back to directory scan");
      const scanned = await scanArtifactDirectories();
      setCache("all-indexes", scanned);
      return scanned;
    }

    setCache("all-indexes", allArtifacts);
    return allArtifacts;
  } catch (err) {
    // If index directory fails entirely, try directory scan
    console.log("[github] Index fetch failed — falling back to directory scan");
    try {
      const scanned = await scanArtifactDirectories();
      setCache("all-indexes", scanned);
      return scanned;
    } catch {
      throw new Error(`Failed to fetch artifacts: ${(err as Error).message}`);
    }
  }
}

export async function fetchArtifactContent(path: string): Promise<{ frontmatter: Record<string, any>; body: string }> {
  const cacheKey = `artifact-${path}`;
  const cached = getCached<{ frontmatter: Record<string, any>; body: string }>(cacheKey);
  if (cached) return cached;

  const content = await githubFetch(path);
  const parsed = parseFrontmatter(content);
  setCache(cacheKey, parsed);
  return parsed;
}

export async function fetchInitiatives(): Promise<Initiative[]> {
  const cached = getCached<Initiative[]>("initiatives");
  if (cached) return cached;

  const initiatives: Initiative[] = [];

  for (const folder of ["initiatives/active", "initiatives/closed"]) {
    try {
      const files = await githubListDir(folder);
      const mdFiles = files.filter((f) => f.name.endsWith(".md"));

      for (const file of mdFiles) {
        try {
          const content = await githubFetch(file.path);
          const { frontmatter, body } = parseFrontmatter(content);

          const initiative: Initiative = {
            id: file.name.replace(".md", ""),
            type: (frontmatter.type as any) || "OPTIMIZATION",
            subject: frontmatter.subject || frontmatter.title || file.name.replace(".md", ""),
            phase: (frontmatter.phase as any) || "FRAME",
            status: folder.includes("closed") ? "CLOSED" : "ACTIVE",
            started: frontmatter.started || frontmatter.created || "",
            updated: frontmatter.updated || "",
            decision: frontmatter.decision || undefined,
            artifacts: frontmatter.artifacts
              ? (typeof frontmatter.artifacts === "string"
                  ? frontmatter.artifacts.split(",").map((a: string) => a.trim())
                  : frontmatter.artifacts)
              : [],
          };

          initiatives.push(initiative);
        } catch {
          // Skip files that fail
        }
      }
    } catch {
      // Folder might not exist
    }
  }

  setCache("initiatives", initiatives);
  return initiatives;
}

// ─── Skill Management Functions ───────────────────────────────────────────

// Deep YAML frontmatter parser that handles nested metadata blocks and multi-line scalars
function parseSkillFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yamlStr = match[1];
  const result: Record<string, any> = {};
  let currentKey = "";
  let currentIndent = 0;
  let parentKey = "";
  let multilineKey = ""; // Track which key is collecting multi-line content
  let multilineIndent = -1; // The indent level of multi-line continuation

  for (const line of yamlStr.split("\n")) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    const indent = line.search(/\S/);
    const colonIdx = line.indexOf(":");

    // Check if this is a continuation of a multi-line scalar (description: >)
    if (multilineKey && indent > 0 && (colonIdx === -1 || indent >= multilineIndent)) {
      // If no colon, or indented beyond the multi-line start, it's continuation
      if (colonIdx === -1 || indent > multilineIndent) {
        result[multilineKey] = ((result[multilineKey] || "") + " " + line.trim()).trim();
        continue;
      }
    }

    if (colonIdx === -1) {
      // Plain continuation line
      if (currentKey && parentKey) {
        if (typeof result[parentKey] === "object") {
          result[parentKey][currentKey] = ((result[parentKey][currentKey] || "") + " " + line.trim()).trim();
        }
      } else if (currentKey) {
        result[currentKey] = ((result[currentKey] || "") + " " + line.trim()).trim();
      }
      continue;
    }

    const key = line.substring(0, colonIdx).trim();
    let value: any = line.substring(colonIdx + 1).trim();

    // Handle YAML arrays
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
    }

    // Handle multiline indicator (> or |)
    if (value === ">" || value === ">-" || value === "|") {
      value = "";
      multilineKey = indent === 0 ? key : "";
      multilineIndent = indent + 2; // Continuation lines are indented further
    } else {
      // Stop multi-line collection if we hit a new key at same or lower indent
      if (indent <= (multilineIndent - 2)) {
        multilineKey = "";
        multilineIndent = -1;
      }
    }

    if (indent === 0) {
      result[key] = value;
      currentKey = key;
      currentIndent = indent;
      parentKey = "";
    } else if (indent > 0 && currentKey && indent > currentIndent) {
      // Nested under previous key — but only if the parent isn't a multi-line string
      if (typeof result[currentKey] === "string" && result[currentKey] === "") {
        result[currentKey] = {};
      }
      if (typeof result[currentKey] === "object" && !Array.isArray(result[currentKey])) {
        result[currentKey][key] = value;
        parentKey = currentKey;
      }
    }
  }

  return result;
}

export async function fetchAllSkills(): Promise<Skill[]> {
  const cached = getCached<Skill[]>("all-skills");
  if (cached) return cached;

  const entries = await githubListDir("_skills");
  const skillDirs = entries.filter(
    (e) => e.type === "dir" && e.name.startsWith("pe-") && !e.name.startsWith("_")
  );

  const skills: Skill[] = [];

  for (const dir of skillDirs) {
    try {
      const files = await githubListDir(dir.path);
      const fileNames = files.map((f) => f.name);

      // Collect all nested files (including references/)
      const allFiles: string[] = [];
      for (const f of files) {
        if (f.type === "dir") {
          try {
            const subFiles = await githubListDir(f.path);
            for (const sf of subFiles) {
              allFiles.push(`${f.name}/${sf.name}`);
            }
          } catch {
            // subdirectory might be empty
          }
        } else {
          allFiles.push(f.name);
        }
      }

      // Check for io-contract.md
      const hasIoContract = allFiles.some(
        (f) => f === "references/io-contract.md" || f === "io-contract.md"
      );

      // Read SKILL.md frontmatter
      let displayName = dir.name;
      let description = "";
      let layer = "unknown";
      let version: string | undefined;

      if (fileNames.includes("SKILL.md")) {
        try {
          const skillMdContent = await githubFetch(`${dir.path}/SKILL.md`);
          const fm = parseSkillFrontmatter(skillMdContent);

          displayName = fm.name || dir.name;
          // Handle description: could be string, object (from bad parse), or missing
          if (typeof fm.description === "string") {
            description = fm.description;
          } else if (fm.description && typeof fm.description === "object") {
            // If parser produced an object, try to extract readable text
            description = Object.values(fm.description).filter(v => typeof v === "string").join(" ");
          } else {
            description = "";
          }

          if (fm.metadata && typeof fm.metadata === "object") {
            layer = fm.metadata.layer || "unknown";
            version = fm.metadata.version;
          }
        } catch {
          // SKILL.md might fail to parse
        }
      }

      skills.push({
        name: dir.name,
        displayName,
        description: description.trim(),
        layer,
        version,
        files: allFiles,
        fileCount: allFiles.length,
        hasIoContract,
      });
    } catch {
      // Skip directories that fail
    }
  }

  setCache("all-skills", skills);
  return skills;
}

export async function fetchSkillDetail(name: string): Promise<SkillDetail> {
  const cacheKey = `skill-detail-${name}`;
  const cached = getCached<SkillDetail>(cacheKey);
  if (cached) return cached;

  const skillPath = `_skills/${name}`;
  const entries = await githubListDir(skillPath);

  const allFiles: string[] = [];
  const referenceFiles: SkillReferenceFile[] = [];

  for (const entry of entries) {
    if (entry.type === "dir") {
      try {
        const subFiles = await githubListDir(entry.path);
        for (const sf of subFiles) {
          allFiles.push(`${entry.name}/${sf.name}`);
          if (sf.name.endsWith(".md")) {
            try {
              const content = await githubFetch(sf.path);
              referenceFiles.push({
                name: sf.name,
                path: `${entry.name}/${sf.name}`,
                content,
              });
            } catch {
              // skip unreadable files
            }
          }
        }
      } catch {
        // skip inaccessible subdirs
      }
    } else {
      allFiles.push(entry.name);
    }
  }

  // Read SKILL.md
  let skillMd = "";
  let displayName = name;
  let description = "";
  let layer = "unknown";
  let version: string | undefined;

  try {
    skillMd = await githubFetch(`${skillPath}/SKILL.md`);
    const fm = parseSkillFrontmatter(skillMd);
    displayName = fm.name || name;
    if (typeof fm.description === "string") {
      description = fm.description;
    } else if (fm.description && typeof fm.description === "object") {
      description = Object.values(fm.description).filter(v => typeof v === "string").join(" ");
    }
    if (fm.metadata && typeof fm.metadata === "object") {
      layer = fm.metadata.layer || "unknown";
      version = fm.metadata.version;
    }
  } catch {
    // SKILL.md might not exist
  }

  const hasIoContract = allFiles.some(
    (f) => f === "references/io-contract.md" || f === "io-contract.md"
  );

  const detail: SkillDetail = {
    name,
    displayName,
    description: description.trim(),
    layer,
    version,
    files: allFiles,
    fileCount: allFiles.length,
    hasIoContract,
    skillMd,
    referenceFiles,
  };

  setCache(cacheKey, detail);
  return detail;
}

export async function fetchSkillFile(name: string, filepath: string): Promise<{ content: string; sha: string }> {
  const fullPath = `_skills/${name}/${filepath}`;
  return githubFetchRaw(fullPath);
}

export async function updateSkillFile(
  name: string,
  filepath: string,
  content: string,
  message?: string
): Promise<any> {
  const fullPath = `_skills/${name}/${filepath}`;
  // Get current SHA
  let sha: string | undefined;
  try {
    const existing = await githubFetchRaw(fullPath);
    sha = existing.sha;
  } catch {
    // File doesn't exist yet, that's OK for creation
  }

  const url = `https://api.github.com/repos/${REPO}/contents/${fullPath}`;
  const body: any = {
    message: message || `Product Engine: update ${name}/${filepath}`,
    content: Buffer.from(content).toString("base64"),
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API ${res.status}: ${errText}`);
  }

  // Invalidate related caches
  cache.delete("all-skills");
  cache.delete(`skill-detail-${name}`);

  return res.json();
}

export async function createSkill(
  name: string,
  description: string,
  layer: string,
  displayName?: string
): Promise<any> {
  const skillMdContent = `---
name: ${displayName || name}
description: >
  ${description}
metadata:
  layer: ${layer}
  system: product-engine
  repo: zeyad-farrag/product-engine-live
---

# ${displayName || name}

## When to Use This Skill

[Describe when this skill should be loaded]

## Instructions

[Step-by-step workflow]

## Storage

[How and where artifacts are stored]

## Operating Principles

[Quality criteria and design principles]
`;

  const ioContractContent = `# I/O Contract — ${displayName || name}

## Trigger

[What triggers this skill]

## Required Inputs

| Input | Source | Description |
|-------|--------|-------------|
| | | |

## Outputs

| Output | Format | Destination |
|--------|--------|-------------|
| | | |

## Quality Criteria

- [ ] [Define quality checks]
`;

  // Create SKILL.md
  await updateSkillFile(name, "SKILL.md", skillMdContent, `Product Engine: create skill ${name}`);
  // Create io-contract.md
  await updateSkillFile(name, "references/io-contract.md", ioContractContent, `Product Engine: create ${name}/references/io-contract.md`);

  // Invalidate caches
  cache.delete("all-skills");

  return { success: true, name };
}

export async function archiveSkill(name: string): Promise<any> {
  // Move skill files to _skills/_archived/{name}/
  const skillPath = `_skills/${name}`;
  const entries = await githubListDir(skillPath);

  for (const entry of entries) {
    if (entry.type === "dir") {
      try {
        const subFiles = await githubListDir(entry.path);
        for (const sf of subFiles) {
          const { content, sha } = await githubFetchRaw(sf.path);
          // Create in archive
          await updateSkillFile(`_archived/${name}`, `${entry.name}/${sf.name}`, content, `Product Engine: archive ${name}/${entry.name}/${sf.name}`);
          // Delete original
          const deleteUrl = `https://api.github.com/repos/${REPO}/contents/${sf.path}`;
          await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
              ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
            },
            body: JSON.stringify({
              message: `Product Engine: archive ${name} — remove ${sf.name}`,
              sha,
            }),
          });
        }
      } catch {
        // skip
      }
    } else {
      try {
        const { content, sha } = await githubFetchRaw(entry.path);
        // Create in archive
        await updateSkillFile(`_archived/${name}`, entry.name, content, `Product Engine: archive ${name}/${entry.name}`);
        // Delete original
        const deleteUrl = `https://api.github.com/repos/${REPO}/contents/${entry.path}`;
        await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
          },
          body: JSON.stringify({
            message: `Product Engine: archive ${name} — remove ${entry.name}`,
            sha,
          }),
        });
      } catch {
        // skip
      }
    }
  }

  // Invalidate caches
  cache.delete("all-skills");
  cache.delete(`skill-detail-${name}`);

  return { success: true, archived: name };
}

export async function fetchTree(): Promise<any> {
  const cached = getCached<any>("tree");
  if (cached) return cached;

  const url = `https://api.github.com/repos/${REPO}/git/trees/main?recursive=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const data = await res.json();
  setCache("tree", data);
  return data;
}
