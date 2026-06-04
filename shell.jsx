/* shell.jsx — preloader, chrome nav, hero, footer for deokma.web */

const NAVITEMS = [
  { id:"top", label:"Home" },
  { id:"projects", label:"Projects" },
  { id:"notes", label:"Notes" },
  { id:"links", label:"Links" },
  { id:"stuff", label:"Stuff" },
];

/* Flash-era preloader (loading bar + skip intro) — not an OS boot */
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
            <path d="M5 15a4 4 0 0 1 .8-7.9 5.5 5.5 0 0 1 10.6 1.2A3.8 3.8 0 0 1 17 15z"/>
          </svg>
        </div>
        <div className="pre-name">deokma<b>.web</b></div>
        <div className="pre-tag">a personal corner of the internet</div>
        <div className="pre-bar"><div className="fill" style={{ width: pct+"%" }}></div></div>
        <div className="pre-pct">loading… {pct}%</div>
      </div>
      <button className="pre-skip" onClick={finish}>skip intro »</button>
    </div>
  );
}

function Nav({ active, onJump }) {
  const [open, setOpen] = React.useState(false);
  const go = (id) => (e) => {
    e.preventDefault(); setOpen(false); onJump(id);
  };
  return (
    <nav id="nav" className={open ? "open" : ""}>
      <div className="wrap">
        <div className="bar glossy" style={{ "--rad":"30px" }}>
          <a className="brand" href="#top" onClick={go("top")}>
            <span className="orb"></span>
            <span className="who"><b>deokma</b><small>personal site · est. 2026</small></span>
          </a>
          <div className="links" style={ open ? { background:"var(--glass)", border:"1px solid var(--edge)",
              borderRadius:18, boxShadow:"inset 0 1px 0 rgba(255,255,255,.6), 0 16px 36px rgba(10,28,72,.28)",
              backdropFilter:"blur(20px) saturate(170%)", WebkitBackdropFilter:"blur(20px) saturate(170%)" } : null }>
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

function Hero({ onJump }) {
  return (
    <header id="hero" className="wrap">
      <div className="hero-card glossy rise">
        <div className="hero-ava">
          <div className="frame">
            <image-slot id="deokma-avatar" shape="rounded" radius="20" placeholder="drop a pic"></image-slot>
          </div>
          <span className="st"><span className="dot"></span>online — tinkering</span>
        </div>
        <div className="hero-main">
          <div className="ey">✦ welcome to my corner of the web</div>
          <h1>hi, i'm Deokma <span className="spark">✦</span></h1>
          <p className="lede">{ABOUT.tagline} i make small software for the joy of it and keep this little homepage because the web used to feel like somebody's bedroom, not a feed.</p>
          <div className="hero-chips">
            {ABOUT.interests.slice(0,6).map(t=>(<span key={t} className="pill">{t}</span>))}
          </div>
          <div className="hero-cta">
            <a className="aqua" href="#projects" onClick={(e)=>{e.preventDefault();onJump("projects");}}>
              <span className="gel sm" style={{ "--gel":GELS.projects, width:24, height:24, borderRadius:7 }}>{Glyph.projects}</span>
              explore projects
            </a>
            <a className="aqua ghost" href="#notes" onClick={(e)=>{e.preventDefault();onJump("notes");}}>read the notes</a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="wrap">
      <div className="foot glossy">
        <span className="gel sm" style={{ "--gel":GELS.about }}>{Glyph.globe}</span>
        <span className="ftxt"><b>deokma.web</b> — built with care for a future that never happened. © 2026</span>
        <span className="fspace"></span>
        <div className="webring" style={{ margin:0, padding:0, border:"none" }}>
          <span className="fmono">webring</span>
          <a className="wbtn" href="#" onClick={e=>e.preventDefault()} title="previous">‹</a>
          <a className="wbtn" href="#" onClick={e=>e.preventDefault()} title="random">✦</a>
          <a className="wbtn" href="#" onClick={e=>e.preventDefault()} title="next">›</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { NAVITEMS, Preloader, Nav, Hero, Footer });
