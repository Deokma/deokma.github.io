/* live.jsx — refreshes Modrinth download counts in the browser.
   Modrinth's public API allows cross-origin requests and needs no key; if the request
   fails, the snapshot in data/stats.json is used as-is. */
import React from "react";
import { STATS, PROJECTS, downloadsOf } from "./data.jsx";

export const LiveContext = React.createContext(null);

export function useLiveModrinth() {
  const [live, setLive] = React.useState(null);
  React.useEffect(() => {
    const ids = Object.values(STATS.modrinth).map((p) => p.id);
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    fetch("https://api.modrinth.com/v2/projects?ids=" + encodeURIComponent(JSON.stringify(ids)), { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list) => {
        const out = {};
        for (const p of list) out[p.slug] = { downloads: p.downloads, followers: p.followers };
        setLive(out);
      })
      .catch(() => {})
      .finally(() => clearTimeout(t));
    return () => { clearTimeout(t); ctl.abort(); };
  }, []);
  return live;
}

/* Totals across my own projects published on Modrinth or CurseForge
   (contributions to other people's mods are not counted). */
export function useTotals() {
  const live = React.useContext(LiveContext);
  return PROJECTS.filter((p) => p.status !== "contrib").reduce((acc, p) => {
    const d = downloadsOf(p, live);
    acc.mr += d.mr; acc.cf += d.cf; acc.total += d.total;
    return acc;
  }, { mr: 0, cf: 0, total: 0, live: !!live });
}
