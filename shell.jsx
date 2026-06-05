/* shell.jsx — preloader, title-bar tabs, CRT hero, system.log, taskbar */

const NAVITEMS = [
  { id:"top", label:"home" },
  { id:"projects", label:"projects" },
  { id:"notes", label:"notes" },
  { id:"links", label:"links" },
  { id:"stuff", label:"stuff" },
];

/* Reusable window title-bar (icon · title · side · — ▢ ✕) */
function WinBar({ icon, title, side, accent }) {
  return (
    <div className={"winbar" + (accent ? " on" : "")}>
      {icon && <span className="wb-ico">{icon}</span>}
      <span className="wb-title">{title}</span>
      <span className="wb-sp"></span>
      {side && <span className="wb-side">{side}</span>}
      <span className="wb-btns"><i>—</i><i>▢</i><i className="x">✕</i></span>
    </div>
  );
}

/* Boot-style preloader (loading bar + skip) */
function Preloader({ onDone }) {
  const [pct, setPct] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const done = React.useRef(false);
  const finish = () => {
    if (done.current) return; done.current = true;
    setGone(true); setTimeout(onDone, 560);
  };
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + (4 + Math.random()*8)); setPct(Math.round(p));
      if (p >= 100) { clearInterval(id); setTimeout(finish, 480); }
    }, 150);
    return () => clearInterval(id);
  }, []);
  return (
    <div id="pre" className={gone ? "gone" : ""}>
      <div className="pre-card">
        <div className="pre-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.4 2.3 3.6 5.2 3.6 8.4S14.4 18.1 12 20.4C9.6 18.1 8.4 15.2 8.4 12S9.6 5.9 12 3.6z"/>
          </svg>
        </div>
        <div className="pre-name">deokma<b>.exe</b></div>
        <div className="pre-tag">booting personal site v1.0…</div>
        <div className="pre-bar"><div className="fill" style={{ width: pct+"%" }}></div></div>
        <div className="pre-pct">loading… {pct}%</div>
      </div>
      <button className="pre-skip" onClick={finish}>skip intro »</button>
    </div>
  );
}

/* Top title-bar with folder tabs */
function Nav({ active, onJump }) {
  const [open, setOpen] = React.useState(false);
  const go = (id) => (e) => { e.preventDefault(); setOpen(false); onJump(id); };
  return (
    <nav id="nav" className={open ? "open" : ""}>
      <div className="wrap">
        <div className="bar glossy">
          <a className="brand" href="#top" onClick={go("top")}>
            <span className="orb"></span>
            <span className="who"><b>deokma.exe</b><small>// personal site v1.0</small></span>
          </a>
          <div className="links">
            {NAVITEMS.map(n=>(
              <a key={n.id} href={"#"+n.id} onClick={go(n.id)}
                className={"navlink"+(active===n.id?" on":"")}>{n.label}</a>
            ))}
          </div>
          <span className="nav-status"><span className="dot"></span>online — tinkering</span>
          <button className="nav-burger" aria-label="menu" onClick={()=>setOpen(o=>!o)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* Hero with a CRT monitor instead of an avatar drop-slot */
function Hero({ onJump }) {
  return (
    <header id="hero" className="wrap">
      <div className="hero-card glossy rise">
        <span className="hero-wbtns wb-btns"><i>—</i><i>▢</i><i className="x">✕</i></span>
        <div className="hero-ava">
          <div className="crt">
            <div className="crt-screen">
              <div className="crt-checker"></div>
              <div className="crt-globe">{Glyph.globe}</div>
              <div className="crt-scan"></div>
              <div className="crt-tag">deokma.web<br/>est. 2024</div>
            </div>
          </div>
          <span className="hero-status"><span className="dot"></span>status: online</span>
        </div>
        <div className="hero-main">
          <div className="ey">welcome to my corner of the web_</div>
          <h1>hi, i'm <span className="cur">deokma</span><span className="caret">_</span></h1>
          <p className="lede">{ABOUT.tagline} i make small software for the joy of it and keep this little homepage because the web used to feel like somebody's bedroom, not a feed.</p>
          <div className="hero-chips">
            {ABOUT.interests.slice(0,6).map(t=>(<span key={t} className="pill">{t}</span>))}
          </div>
          <div className="hero-cta">
            <a className="aqua" href="#projects" onClick={(e)=>{e.preventDefault();onJump("projects");}}>&gt;&gt; explore projects</a>
            <a className="aqua ghost" href="#notes" onClick={(e)=>{e.preventDefault();onJump("notes");}}>_ read the notes</a>
          </div>
        </div>
        <span className="hero-tick">:01</span>
      </div>
    </header>
  );
}

/* system.log — a terminal window built from ABOUT.now */
function SystemLog() {
  const stamps = ["10:24","10:12","09:47","09:02","08:30","07:58"];
  return (
    <div className="syslog glossy">
      <WinBar icon={Glyph.computer} title="system.log" />
      <div className="term">
        {ABOUT.now.map((n,i)=>(
          <div key={i} className="ln">
            <span className="ts">[{stamps[i] || "00:00"}]</span>
            <span className={"kw "+n.k}>{n.k}</span>
            <span className="val">{n.v}</span>
          </div>
        ))}
        <div className="prompt">C:\&gt; <span className="cr">_</span></div>
      </div>
    </div>
  );
}

/* Live taskbar clock */
function Clock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(()=>setNow(new Date()), 1000*20);
    return ()=>clearInterval(id);
  }, []);
  let h = now.getHours(); const m = now.getMinutes();
  const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return <span className="tb-clock">{h}:{String(m).padStart(2,"0")} {ap}</span>;
}

/* Footer rendered as a Windows-style taskbar */
function Footer() {
  return (
    <footer className="wrap">
      <div className="taskbar">
        <span className="tb-start">
          <span className="gel sm" style={{ "--gel":GELS.about }}>{Glyph.globe}</span>
          <span><b>deokma.web</b> — built with care for a future that never happened. © 2026</span>
        </span>
        <span className="tb-tray">
          <span className="ico">{Glyph.sound}</span>
          <span className="ico">{Glyph.computer}</span>
          <Clock />
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, { NAVITEMS, WinBar, Preloader, Nav, Hero, SystemLog, Clock, Footer });
