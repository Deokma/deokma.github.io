/* sections.jsx — Projects / Gallery / Notes / Links as Y2K desktop windows */
import React, { useState as useStateX } from "react";
import { createPortal } from "react-dom";
import { Glyph } from "./icons.jsx";
import { WinBar, WinBtns } from "./shell.jsx";
import { MediaPlayerApp } from "./mediaplayer.jsx";
import { LiveContext } from "./live.jsx";
import {
  GELS, PROJECTS, CATEGORIES, STATUS_LABEL, RELEASES, LINKCATS, BUTTONS88, STATS,
  downloadsOf, fmtNum, fmtShort, fmtDate, stampDate, loaderList,
} from "./data.jsx";

export function SecHead({ icon, gel, label, title, count, id }) {
  return (
    <div className="sec-head">
      <span className="gel" style={{ "--gel":gel }} aria-hidden="true">{Glyph[icon]}</span>
      <div>
        <div className="label">{label}</div>
        <h2 id={id} tabIndex={-1}>{title}</h2>
      </div>
      <span className="rule" aria-hidden="true"></span>
      {count && <span className="count">{count}</span>}
    </div>
  );
}

/* Modal behaviour shared by the project window and the lightbox:
   focus moves in, Tab stays inside, Escape closes, focus returns to the opener. */
function useDialog(ref, onClose) {
  React.useEffect(() => {
    const opener = document.activeElement;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const focusables = () => [...ref.current.querySelectorAll(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    (ref.current.querySelector("[data-autofocus]") || focusables()[0] || ref.current).focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab") return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      if (opener && opener.focus) opener.focus();
    };
  }, []);
}

function ProjectIcon({ p }) {
  return (
    <span className="picon" aria-hidden="true">
      {p.icon ? <img src={p.icon} alt="" width="48" height="48" loading="lazy" decoding="async" /> : (p.emoji || "🗂️")}
    </span>
  );
}

const statusText = (p) => p.statusLabel || STATUS_LABEL[p.status];

/* ── Projects ─────────────────────────────────────────────────────────────*/
export function ProjectsSection({ onOpen }) {
  const live = React.useContext(LiveContext);
  const [cat, setCat] = useStateX("all");
  const shown = PROJECTS.filter(p => cat === "all" || p.cat === cat);
  const released = PROJECTS.filter(p => p.status === "go").length;
  const hint = CATEGORIES.find(c => c.id === cat).hint;

  return (
    <section id="projects" className="section wrap" aria-labelledby="projects-h">
      <SecHead id="projects-h" icon="projects" gel={GELS.projects} label="things i've made" title="projects"
        count={`${PROJECTS.length} projects · ${released} released`} />
      <div className="ptabs" role="group" aria-label="Filter projects">
        {CATEGORIES.map(c => {
          const n = c.id === "all" ? PROJECTS.length : PROJECTS.filter(p => p.cat === c.id).length;
          return (
            <button key={c.id} className={"ptab" + (cat === c.id ? " on" : "")} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}<span className="n">{n}</span>
            </button>
          );
        })}
        {hint && <span className="ptab-hint">{hint}</span>}
      </div>
      <ul className="grid-proj">
        {shown.map(pr=>{
          const d = downloadsOf(pr, live);
          return (
            <li key={pr.id} className={"pcard glossy" + (pr.status === "dead" ? " old" : "")}>
              <div className="top">
                <ProjectIcon p={pr} />
                <div style={{ minWidth:0 }}>
                  <h3 className="nm">
                    <button className="pcard-open" onClick={()=>onOpen(pr.id)} aria-haspopup="dialog">{pr.name}</button>
                  </h3>
                  <div className="sub">{pr.file} · {pr.years}</div>
                </div>
              </div>
              <p className="bl">{pr.blurb}</p>
              <div className="ft">
                <span className="statpill"><span className={"dot "+pr.status} aria-hidden="true"></span>{statusText(pr)}</span>
                <span className="statpill">{pr.lang}</span>
                {d.total > 0 && (
                  <span className="statpill dl" title={fmtNum(d.total) + " downloads"}>
                    <span className="ico" aria-hidden="true">{Glyph.download}</span>{fmtShort(d.total)}
                    <span className="sr-only"> downloads</span>
                  </span>
                )}
                <span className="open" aria-hidden="true">details ›</span>
              </div>
            </li>
          );
        })}
      </ul>
      <a className="ws-teaser glossy" href="/workshop/">
        <span className="gel" style={{ "--gel":GELS.workshop }} aria-hidden="true">{Glyph.workshop}</span>
        <span className="ws-t">
          <b>workshop.exe</b>
          <span>3D printing &amp; electronics: finished hardware builds, like an NFC vinyl player.</span>
        </span>
        <span className="open" aria-hidden="true">open page ›</span>
      </a>
    </section>
  );
}

export function ProjectModal({ id, onClose }) {
  const live = React.useContext(LiveContext);
  const p = PROJECTS.find(x => x.id === id);
  const ref = React.useRef(null);
  const [shot, setShot] = useStateX(0);
  useDialog(ref, onClose);
  if (!p) return null;
  const d = downloadsOf(p, live);
  const mr = p.mr && STATS.modrinth[p.mr];
  const asOf = fmtDate(STATS.fetchedAt);
  const g = p.gallery || [];

  return createPortal(
    <div className="lb-back" onClick={onClose}>
      <div className="lb glossy" role="dialog" aria-modal="true" aria-labelledby="pm-title" ref={ref} onClick={e=>e.stopPropagation()}>
        <div className="winbar on">
          <span className="wb-ico" aria-hidden="true">{Glyph.projects}</span>
          <span className="wb-title">{p.file}</span>
          <span className="wb-sp"></span>
          <button className="wb-close" onClick={onClose} aria-label="Close" data-autofocus>✕</button>
        </div>
        <div className="lb-body">
          <div className="pm-head">
            <ProjectIcon p={p} />
            <div>
              <h2 id="pm-title">{p.name}</h2>
              <div className="sub">{p.years}{p.license ? " · " + p.license : ""}</div>
            </div>
          </div>
          <div className="meta">
            <span className="statpill"><span className={"dot "+p.status} aria-hidden="true"></span>{statusText(p)}</span>
            <span className="statpill">{p.lang}</span>
            {(p.platform || []).map(x => <span key={x} className="statpill">{x}</span>)}
          </div>

          {d.total > 0 && (
            <div className="pm-dl">
              <span className="ico" aria-hidden="true">{Glyph.download}</span>
              <b>{fmtNum(d.total)}</b> downloads{p.status === "contrib" ? " (whole project)" : ""}
              <small>
                Modrinth {fmtNum(d.mr)}{live ? " (live)" : ""}{p.cf ? ` · CurseForge ${fmtNum(d.cf)} (as of ${asOf})` : ""}
                {mr ? ` · ${fmtNum((live && live[p.mr] || mr).followers)} followers on Modrinth` : ""}
              </small>
            </div>
          )}

          {p.links.length > 0 && <div className="pm-links">
            {p.links.map((l, i) => (
              <a key={l.href} className={"aqua" + (i ? " ghost" : "")} href={l.href} target="_blank" rel="noopener">
                {l.label}<span className="ico" aria-hidden="true">{Glyph.external}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>}

          {g.length > 0 && (
            <figure className="pm-shot">
              <img src={g[shot].src} alt={g[shot].alt} width={g[shot].w} height={g[shot].h} decoding="async" />
              <figcaption>{g[shot].cap}</figcaption>
              {g.length > 1 && (
                <div className="pm-thumbs" role="group" aria-label="Screenshots">
                  {g.map((s, i) => (
                    <button key={s.src} className={"pm-thumb" + (i === shot ? " on" : "")} aria-pressed={i === shot}
                      aria-label={"Show screenshot: " + s.cap} onClick={() => setShot(i)}>
                      <img src={s.thumb} alt="" width="120" height={Math.round(120 * s.h / s.w)} loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              )}
            </figure>
          )}

          {(p.about || [p.blurb]).map((para, i) => <p key={i} className="desc">{para}</p>)}

          {p.features && (<>
            <h3 className="pm-h">features</h3>
            <ul className="pm-feat">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
          </>)}

          <h3 className="pm-h">built with</h3>
          <ul className="pm-stack">{p.stack.map(s => <li key={s} className="pill">{s}</li>)}</ul>

          {mr && (<>
            <h3 className="pm-h">release history</h3>
            <ol className="changelog">
              {mr.releases.map(r => (
                <li key={r.version} className="cl">
                  <b aria-hidden="true">›</b>
                  <span className="v">{r.version}</span>
                  <time dateTime={r.date}>{fmtDate(r.date)}</time>
                  <span className="lo">{loaderList(r.loaders)}</span>
                </li>
              ))}
            </ol>
          </>)}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Gallery (real screenshots from the mods) ─────────────────────────────*/
const SHOTS = PROJECTS.flatMap(p => (p.gallery || []).map(s => ({ ...s, p })));

function Lightbox({ index, onClose, onMove }) {
  const ref = React.useRef(null);
  useDialog(ref, onClose);
  const s = SHOTS[index];
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onMove]);
  return createPortal(
    <div className="lb-back" onClick={onClose}>
      <div className="lb lb-wide glossy" role="dialog" aria-modal="true" aria-labelledby="lbx-title" ref={ref} onClick={e=>e.stopPropagation()}>
        <div className="winbar on">
          <span className="wb-ico" aria-hidden="true">{Glyph.gallery}</span>
          <span className="wb-title" id="lbx-title">{s.p.name} — {s.cap}</span>
          <span className="wb-sp"></span>
          <span className="wb-side">{index + 1} / {SHOTS.length}</span>
          <button className="wb-close" onClick={onClose} aria-label="Close" data-autofocus>✕</button>
        </div>
        <figure className="lbx">
          <img src={s.src} alt={s.alt} width={s.w} height={s.h} decoding="async" />
          <figcaption>
            <button className="wbtn" onClick={()=>onMove(-1)} aria-label="Previous screenshot">‹</button>
            <span>{s.alt}</span>
            <button className="wbtn" onClick={()=>onMove(1)} aria-label="Next screenshot">›</button>
          </figcaption>
        </figure>
      </div>
    </div>,
    document.body
  );
}

export function GallerySection() {
  const [open, setOpen] = useStateX(null);
  const move = React.useCallback((dir) => setOpen(i => (i + dir + SHOTS.length) % SHOTS.length), []);
  return (
    <section id="gallery" className="section wrap" aria-labelledby="gallery-h">
      <SecHead id="gallery-h" icon="gallery" gel={GELS.gallery} label="screenshots from my projects" title="gallery" count={SHOTS.length + " screenshots"} />
      <ul className="grid-shots">
        {SHOTS.map((s, i) => (
          <li key={s.src} className="collect glossy">
            <button className="shot" onClick={() => setOpen(i)} aria-haspopup="dialog" aria-label={`View larger: ${s.p.name}, ${s.cap}`}>
              <img src={s.thumb} alt={s.alt} width="640" height={Math.round(640 * s.h / s.w)} loading="lazy" decoding="async" />
            </button>
            <div className="cap">{s.cap}<small>{s.p.name}</small></div>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onMove={move} />}
    </section>
  );
}

/* ── Notes = release notes from Modrinth ──────────────────────────────────*/
/* Minimal Markdown for changelogs: headings, bullet / numbered lists, paragraphs,
   **bold**, `code` and http(s) links. Rendered as React elements, never as raw HTML. */
function inline(text) {
  const out = []; let rest = text; let k = 0;
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/;
  let m;
  while ((m = rest.match(re))) {
    if (m.index) out.push(rest.slice(0, m.index));
    if (m[2]) out.push(<b key={k++}>{m[2]}</b>);
    else if (m[3]) out.push(<code key={k++}>{m[3]}</code>);
    else out.push(<a key={k++} href={m[5]} target="_blank" rel="noopener">{m[4]}</a>);
    rest = rest.slice(m.index + m[0].length);
  }
  if (rest) out.push(rest);
  return out;
}

function Md({ src }) {
  const blocks = []; let list = null; let k = 0;
  const flush = () => { if (list) { blocks.push(list.ordered ? <ol key={k++}>{list.items}</ol> : <ul key={k++}>{list.items}</ul>); list = null; } };
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    const h = line.match(/^#{1,4}\s+(.*)/);
    const li = line.match(/^(\s*)(?:[-*]|(\d+)\.)\s+(.*)/);
    if (!line.trim()) { flush(); continue; }
    if (h) { flush(); blocks.push(<h4 key={k++}>{inline(h[1])}</h4>); continue; }
    if (li) {
      const ordered = !!li[2];
      if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; }
      list.items.push(<li key={list.items.length} className={li[1].length >= 2 ? "sub" : ""}>{inline(li[3])}</li>);
      continue;
    }
    flush(); blocks.push(<p key={k++}>{inline(line)}</p>);
  }
  flush();
  return <div className="md">{blocks}</div>;
}

function availability(r) {
  const range = r.last !== r.date ? ` between ${fmtDate(r.date)} and ${fmtDate(r.last)}` : "";
  return `Released for ${loaderList(r.loaders)} on Minecraft ${r.game_versions.join(", ")}${range}.`;
}

export function NotesSection() {
  const [sel, setSel] = useStateX(RELEASES[0].id);
  const n = RELEASES.find(x=>x.id===sel);
  return (
    <section id="notes" className="section wrap" aria-labelledby="notes-h">
      <SecHead id="notes-h" icon="notes" gel={GELS.notes} label="what changed, and when" title="release notes" count={RELEASES.length+" releases"} />
      <div className="notes-mod glossy">
        <div className="notes-side" role="group" aria-label="Releases">
          {RELEASES.map(x=>(
            <button key={x.id} className={"nbtn"+(x.id===sel?" on":"")} aria-pressed={x.id===sel} onClick={()=>setSel(x.id)}>
              <div className="t">{x.project.name} {x.version}</div>
              <div className="d">{stampDate(x.date)}</div>
            </button>
          ))}
        </div>
        <article className="notes-read" aria-live="polite">
          <div className="written">released: <time dateTime={n.date}>{stampDate(n.date)}</time></div>
          <div className="stamp">~/releases/{n.project.file}/{n.version}.txt</div>
          <h3>{n.project.name} {n.version}</h3>
          <p className="avail">{availability(n)}</p>
          {n.changelog ? <Md src={n.changelog} />
            : <p>{n.first ? "First public release." : "No changelog was published for this version."}</p>}
          <div className="sig">
            <a href={`https://modrinth.com/mod/${n.project.mr}/changelog`} target="_blank" rel="noopener">full changelog on modrinth ›</a>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ── Links ────────────────────────────────────────────────────────────────*/
function CopyRow({ l, fav }) {
  const [done, setDone] = useStateX(false);
  const copy = () => {
    const ok = () => { setDone(true); setTimeout(() => setDone(false), 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(l.copy).then(ok, () => {});
  };
  return (
    <button className="lrow" onClick={copy} aria-label={`Copy Discord username ${l.copy}`}>
      <span className="fav" style={{ background:fav }} aria-hidden="true"></span>
      <span style={{ minWidth:0 }}>
        <span className="lt">{l.t}</span>
        <span className="lu" aria-live="polite">{done ? "copied to clipboard!" : l.u}</span>
      </span>
      <span className="lgo" aria-hidden="true">{Glyph.copy}</span>
    </button>
  );
}

export function LinksSection() {
  const pct = Math.round(BUTTONS88.length / 50 * 100);
  return (
    <section id="links" className="section wrap" aria-labelledby="links-h">
      <SecHead id="links-h" icon="links" gel={GELS.links} label="where to find me" title="links" />
      <div className="cols-2">
        <div className="linkpanel glossy">
          {LINKCATS.map(cat=>(
            <div key={cat.name} className="linkcat">
              <h3>{cat.name}</h3>
              <ul className="linkrows">
                {cat.links.map(l=>(
                  <li key={l.t}>
                    {l.copy ? <CopyRow l={l} fav={cat.fav} /> : (
                      <a className="lrow" href={l.href} target="_blank" rel="noopener">
                        <span className="fav" style={{ background:cat.fav }} aria-hidden="true"></span>
                        <span style={{ minWidth:0 }}>
                          <span className="lt">{l.t}</span>
                          <span className="lu">{l.u}</span>
                        </span>
                        <span className="lgo" aria-hidden="true">{Glyph.external}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="collect-panel glossy">
          <WinBar icon={Glyph.stuff} title="badge.collector" side={BUTTONS88.length+" / 50"} accent />
          <div className="bcoll-body">
            <div className="btn88wrap" aria-label="88×31 badges" role="img">
              {BUTTONS88.map((b,i)=>(
                <span key={i} className="btn88" style={{ background:b.bg, borderColor:b.b }} aria-hidden="true">
                  <span className="b88-in" style={{ color:b.c }}>{b.txt}</span>
                </span>
              ))}
            </div>
            <div className="bcoll-foot">
              <span>collecting stickers like pokemon.</span>
              <div className="bcoll-bar" aria-hidden="true"><i style={{ width:pct+"%" }}></i></div>
              <span>{pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Jukebox (embedded mini player, uses the visualizer) ───────────────────*/
export function Jukebox({ onOpen }) {
  return (
    <div className="jukebox glossy">
      <div className="jb-head">
        <span className="gel sm" style={{ "--gel":GELS.media }} aria-hidden="true">{Glyph.media}</span>
        <span className="lab">now.playing</span>
        <span className="eq">— released mods —</span>
        <WinBtns />
      </div>
      <MediaPlayerApp onOpen={onOpen} />
    </div>
  );
}
