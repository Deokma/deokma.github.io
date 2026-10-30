/* update-stats.mjs — refreshes src/data/stats.json from public APIs.
     npm run stats
   Sources (no API keys needed):
     - Modrinth API v2 (official)             downloads, followers, versions + changelogs
     - CFWidget (public CurseForge mirror)     CurseForge download totals; the official
                                               CurseForge API requires a private key, which
                                               must never ship in a public repo
     - GitHub REST API (official)              repo activity; set GITHUB_TOKEN to raise the
                                               60 requests/hour anonymous limit (optional)
   Modrinth numbers are refreshed again in the browser at runtime; the rest is a snapshot. */
import { writeFile } from "node:fs/promises";

const UA = "Deokma/deokma.github.io (stats script; github.com/Deokma)";

const MODRINTH = ["create-stock-market", "charta-casino", "notely", "molten-vents-fabric-port"];
const CURSEFORGE = { "create-stock-market": 1549447, "charta-casino": 1536082, "notely": 1510287 };
const GITHUB_REPOS = [
  "create-stockmarket", "charta-casino-addon", "Notely", "create-molten-vents-fabric",
  "waystones-model-replacer", "BTA-Map", "VortexAiHelper", "LedControl",
];

async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

/* Several Modrinth uploads share one version number (one file per loader / MC range).
   Collapse them into a single release entry. */
function groupVersions(versions) {
  const byNumber = new Map();
  for (const v of versions) {
    const g = byNumber.get(v.version_number) || {
      version: v.version_number, first: v.date_published, last: v.date_published,
      loaders: new Set(), game_versions: new Set(), changelog: [], downloads: 0,
    };
    if (v.date_published < g.first) g.first = v.date_published;
    if (v.date_published > g.last) g.last = v.date_published;
    v.loaders.forEach((l) => g.loaders.add(l));
    v.game_versions.forEach((x) => g.game_versions.add(x));
    const log = (v.changelog || "").trim();
    if (log && !g.changelog.includes(log)) g.changelog.push(log);
    g.downloads += v.downloads;
    byNumber.set(v.version_number, g);
  }
  return [...byNumber.values()]
    .sort((a, b) => b.first.localeCompare(a.first))
    .map((g) => ({
      version: g.version, date: g.first.slice(0, 10), last: g.last.slice(0, 10),
      loaders: [...g.loaders], game_versions: [...g.game_versions],
      changelog: g.changelog.join("\n\n"), downloads: g.downloads,
    }));
}

async function modrinth() {
  const ids = encodeURIComponent(JSON.stringify(MODRINTH));
  const projects = await getJSON(`https://api.modrinth.com/v2/projects?ids=${ids}`);
  const out = {};
  for (const p of projects) {
    const versions = await getJSON(`https://api.modrinth.com/v2/project/${p.id}/version`);
    out[p.slug] = {
      id: p.id, slug: p.slug, title: p.title, downloads: p.downloads, followers: p.followers,
      published: p.published.slice(0, 10), updated: p.updated.slice(0, 10),
      license: p.license?.id, loaders: p.loaders, game_versions: p.game_versions,
      client_side: p.client_side, server_side: p.server_side,
      releases: groupVersions(versions),
    };
  }
  return out;
}

async function curseforge() {
  const out = {};
  for (const [key, id] of Object.entries(CURSEFORGE)) {
    try {
      const d = await getJSON(`https://api.cfwidget.com/${id}`);
      out[key] = { id, url: d.urls?.curseforge, downloads: d.downloads?.total ?? null, files: d.files?.length ?? null };
    } catch (e) {
      console.warn("curseforge:", e.message);
    }
  }
  return out;
}

async function github() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const out = {};
  for (const repo of GITHUB_REPOS) {
    try {
      const r = await getJSON(`https://api.github.com/repos/Deokma/${repo}`, headers);
      out[repo] = {
        stars: r.stargazers_count, language: r.language, archived: r.archived,
        created: r.created_at.slice(0, 10), pushed: r.pushed_at.slice(0, 10),
      };
    } catch (e) {
      console.warn("github:", e.message);
    }
  }
  return out;
}

const stats = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  modrinth: await modrinth(),
  curseforge: await curseforge(),
  github: await github(),
};
await writeFile(new URL("../src/data/stats.json", import.meta.url), JSON.stringify(stats, null, 1) + "\n");
console.log("wrote src/data/stats.json", stats.fetchedAt);
