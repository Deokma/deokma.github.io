/* shell.jsx — preloader, title-bar tabs, CRT hero, system.log, taskbar */
import React from "react";
import { Glyph } from "./icons.jsx";
import { ABOUT, GELS, PROFILES, PROJECTS, ACTIVITY, STATS, fmtNum, fmtDate, stampDate } from "./data.jsx";
import { useTotals } from "./live.jsx";

/* Home-page sections plus separate pages (href). */
export const NAVITEMS = [
  { id:"top", label:"home" },
  { id:"projects", label:"projects" },
  { id:"gallery", label:"gallery" },
  { id:"notes", label:"notes" },
  { id:"links", label:"links" },
  { id:"workshop", label:"workshop", href:"/workshop/" },
];

/* ── Decorative sky (brushed-steel wall glow, grain and vignette) ─────────*/
export const Sky = React.memo(function Sky() {
  return (
    <div id="sky" aria-hidden="true">
      <div className="glow"></div>
      <div className="grain"></div>
      <div className="vig"></div>
    </div>
  );
});

/* Decorative window controls (— ▢ ✕); purely visual, hidden from assistive tech */
export function WinBtns({ className = "" }) {
  return <span className={"wb-btns " + className} aria-hidden="true"><i>—</i><i>▢</i><i className="x">✕</i></span>;
}

/* Reusable window title-bar (icon · title · side · — ▢ ✕) */
export function WinBar({ icon, title, side, accent }) {
  return (
    <div className={"winbar" + (accent ? " on" : "")}>
      {icon && <span className="wb-ico">{icon}</span>}
      <span className="wb-title">{title}</span>
      <span className="wb-sp"></span>
      {side && <span className="wb-side">{side}</span>}
      <WinBtns />
    </div>
  );
}

/* Boot-style preloader (loading bar + skip). Short, and only once per browser session. */
const BOOT_KEY = "deokma.booted";
export function shouldBoot() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (location.hash && location.hash !== "#top") return false;
  try { return !sessionStorage.getItem(BOOT_KEY); } catch { return true; }
}

export function Preloader({ onDone }) {
  const [pct, setPct] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const done = React.useRef(false);
  const finish = () => {
    if (done.current) return; done.current = true;
    try { sessionStorage.setItem(BOOT_KEY, "1"); } catch {}
    setGone(true); setTimeout(onDone, 380);
  };
  React.useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + (9 + Math.random()*9)); setPct(Math.round(p));
      if (p >= 100) { clearInterval(id); setTimeout(finish, 200); }
    }, 70);
    return () => clearInterval(id);
  }, []);
  return (
    <div id="pre" className={gone ? "gone" : ""}>
      <div className="pre-card">
        <div className="pre-logo" aria-hidden="true">{Glyph.globe}</div>
        <div className="pre-name">deokma<b>.exe</b></div>
        <div className="pre-tag">booting personal site v2.0…</div>
        <div className="pre-bar" role="progressbar" aria-label="Loading" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="fill" style={{ width: pct+"%" }}></div>
        </div>
        <div className="pre-pct" aria-hidden="true">loading… {pct}%</div>
      </div>
      <button className="pre-skip" onClick={finish}>skip intro »</button>
    </div>
  );
}

/* Top title-bar with folder tabs. On the home page section tabs scroll (onJump);
   on other pages they link back to the home page sections. */
export function Nav({ active, onJump }) {
  const [open, setOpen] = React.useState(false);
  const go = (id) => (e) => { if (!onJump) return; e.preventDefault(); setOpen(false); onJump(id); };
  const hrefOf = (n) => n.href || (onJump ? "#" + n.id : (n.id === "top" ? "/" : "/#" + n.id));
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <nav id="nav" className={open ? "open" : ""} aria-label="Main">
      <div className="wrap">
        <div className="bar glossy">
          <a className="brand" href={onJump ? "#top" : "/"} onClick={go("top")} aria-label={onJump ? "deokma.exe, back to top" : "deokma.exe, home page"}>
            <span className="orb" aria-hidden="true"></span>
            <span className="who"><b>deokma.exe</b><small>// personal site v2.0</small></span>
          </a>
          <div className="links" id="nav-links">
            {NAVITEMS.map(n=>(
              <a key={n.id} href={hrefOf(n)} onClick={n.href ? undefined : go(n.id)}
                className={"navlink"+(active===n.id?" on":"")+(n.href?" page":"")}
                aria-current={active===n.id ? (n.href ? "page" : "location") : undefined}>{n.label}</a>
            ))}
          </div>
          <span className="nav-status"><span className="dot" aria-hidden="true"></span>{ABOUT.status}</span>
          <button className="nav-burger" aria-label="Menu" aria-expanded={open} aria-controls="nav-links" onClick={()=>setOpen(o=>!o)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* LCD-style counters under the hero text */
function HeroStats() {
  const totals = useTotals();
  const released = PROJECTS.filter(p => p.cat === "mods" && p.status === "go").length;
  const asOf = fmtDate(STATS.fetchedAt);
  return (
    <dl className="hero-stats">
      <div className="lcd">
        <dt>mods released</dt>
        <dd>{String(released).padStart(2, "0")}</dd>
      </div>
      <div className="lcd" title={`Modrinth ${totals.live ? "(live)" : `(as of ${asOf})`}: ${fmtNum(totals.mr)} · CurseForge (as of ${asOf}): ${fmtNum(totals.cf)}`}>
        <dt>downloads</dt>
        <dd>{fmtNum(totals.total)}</dd>
        <small>modrinth + curseforge</small>
      </div>
      <div className="lcd">
        <dt>minecraft versions</dt>
        <dd>1.18.2–26.1</dd>
      </div>
    </dl>
  );
}

/* Hero with a CRT monitor instead of an avatar drop-slot */
export function Hero({ onJump }) {
  return (
    <header id="hero" className="wrap">
      <div className="hero-card glossy rise">
        <WinBtns className="hero-wbtns" />
        <div className="hero-ava" aria-hidden="true">
          <div className="crt">
            <div className="crt-screen">
              <div className="crt-checker"></div>
              <div className="crt-globe">{Glyph.globe}</div>
              <div className="crt-scan"></div>
              <div className="crt-tag">deokma.web<br/>est. 2020</div>
            </div>
          </div>
          <span className="hero-status"><span className="dot"></span>status: online</span>
        </div>
        <div className="hero-main">
          <p className="ey">welcome to my corner of the web_</p>
          <h1>hi, i'm <span className="cur">deokma</span><span className="caret" aria-hidden="true">_</span></h1>
          <p className="lede">{ABOUT.lede}</p>
          <ul className="hero-chips" aria-label="Skills">
            {ABOUT.skills.map(t=>(<li key={t} className="pill">{t}</li>))}
          </ul>
          <HeroStats />
          <div className="hero-cta">
            <a className="aqua" href="#projects" onClick={(e)=>{e.preventDefault();onJump("projects");}}>&gt;&gt; explore projects</a>
            <a className="aqua ghost" href="#notes" onClick={(e)=>{e.preventDefault();onJump("notes");}}>_ release notes</a>
          </div>
          <p className="hero-find">
            <span>find me on</span>
            <a href={PROFILES.github} target="_blank" rel="noopener">github</a>
            <a href={PROFILES.modrinth} target="_blank" rel="noopener">modrinth</a>
            <a href={PROFILES.curseforge} target="_blank" rel="noopener">curseforge</a>
          </p>
        </div>
        <span className="hero-tick" aria-hidden="true">:01</span>
      </div>
    </header>
  );
}

/* system.log — a terminal window with the latest real activity */
export function SystemLog() {
  return (
    <div className="syslog glossy">
      <WinBar icon={Glyph.computer} title="system.log" side="latest activity" />
      <ol className="term">
        {ACTIVITY.map((n,i)=>(
          <li key={i} className="ln">
            <span className="ts"><time dateTime={n.ts}>[{stampDate(n.ts)}]</time></span>
            <span className={"kw "+n.k}>{n.k}</span>
            <span className="val">{n.v}<small>{n.sub}</small></span>
          </li>
        ))}
        <li className="prompt" aria-hidden="true">C:\&gt; <span className="cr">_</span></li>
      </ol>
    </div>
  );
}

/* Live taskbar clock */
export function Clock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(()=>setNow(new Date()), 1000*20);
    return ()=>clearInterval(id);
  }, []);
  let h = now.getHours(); const m = now.getMinutes();
  const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return <span className="tb-clock" aria-hidden="true">{h}:{String(m).padStart(2,"0")} {ap}</span>;
}

/* Footer rendered as a Windows-style taskbar */
export function Footer() {
  return (
    <footer className="wrap">
      <div className="taskbar">
        <span className="tb-start">
          <span className="gel sm" style={{ "--gel":GELS.about }} aria-hidden="true">{Glyph.globe}</span>
          <span><b>deokma.web</b> — built with care for a future that never happened. © 2020–2026</span>
        </span>
        <span className="tb-tray">
          <a className="tb-src" href={PROFILES.source} target="_blank" rel="noopener">source</a>
          <span className="ico" aria-hidden="true">{Glyph.sound}</span>
          <span className="ico" aria-hidden="true">{Glyph.computer}</span>
          <Clock />
        </span>
      </div>
    </footer>
  );
}
