/* app2.jsx — deokma.web shell: sky, preloader, nav scroll-spy, sections, tweaks */
const { useState, useEffect, useRef, useCallback } = React;

/* ── Theme system (shared with the material in site.css) ──────────────────── */
const THEMES = {
  dream: {
    wall:"linear-gradient(177deg,#ffdcf2 0%,#e7ccff 28%,#c8cdff 54%,#aed8ff 80%,#a6f0ff 100%)",
    glow:"radial-gradient(42% 30% at 80% 10%,rgba(255,255,255,.95),transparent 64%),radial-gradient(34% 26% at 14% 24%,rgba(255,214,246,.66),transparent 70%),radial-gradient(56% 42% at 58% 100%,rgba(176,228,255,.55),transparent 72%)",
    glassRGB:"255,255,255", dark:false,
    ink:"#2c2c55", inkSoft:"#4d4d78", inkFaint:"#8e8eb6",
    edge:"rgba(255,255,255,.6)", chip:"rgba(255,255,255,.56)",
    card:"rgba(255,255,255,.5)", cardHi:"rgba(255,255,255,.72)",
    code:"rgba(120,110,200,.1)",
  },
  sky: {
    wall:"linear-gradient(178deg,#dcf5ff 0%,#a3dbff 30%,#5ea7e6 60%,#3f86cf 82%,#74c46b 100%)",
    glow:"radial-gradient(36% 28% at 82% 11%,rgba(255,255,255,.97),transparent 62%),radial-gradient(64% 44% at 50% 100%,rgba(150,235,150,.46),transparent 72%),radial-gradient(26% 20% at 22% 26%,rgba(255,255,255,.55),transparent 70%)",
    glassRGB:"255,255,255", dark:false,
    ink:"#143049", inkSoft:"#2f5474", inkFaint:"#6c93b3",
    edge:"rgba(255,255,255,.58)", chip:"rgba(255,255,255,.54)",
    card:"rgba(255,255,255,.5)", cardHi:"rgba(255,255,255,.72)",
    code:"rgba(40,110,170,.12)",
  },
  twilight: {
    wall:"linear-gradient(178deg,#081636 0%,#132a5c 40%,#274a8c 72%,#3f7bb0 100%)",
    glow:"radial-gradient(52% 32% at 50% 4%,rgba(120,180,255,.4),transparent 70%),radial-gradient(40% 28% at 80% 20%,rgba(95,208,255,.34),transparent 72%),radial-gradient(64% 40% at 28% 100%,rgba(70,150,210,.38),transparent 74%)",
    glassRGB:"20,34,72", dark:true,
    ink:"#eaf3ff", inkSoft:"#bacfee", inkFaint:"#8099c2",
    edge:"rgba(150,200,255,.24)", chip:"rgba(120,180,255,.16)",
    card:"rgba(24,40,82,.5)", cardHi:"rgba(46,68,120,.55)",
    code:"rgba(6,16,40,.55)",
  },
};
const ACCENTS = { violet:["#8a6fff","#6a4fe0"], sky:["#2f8fdd","#1f72be"], aqua:["#1cb39a","#0d8a76"], rose:["#ef6fb0","#c83a8c"] };
const GLASS = { aero:[0.5,22], crystal:[0.34,14], frost:[0.72,30] };
const FONTS = { nunito:'"Nunito", system-ui, sans-serif', round:'"Varela Round","Nunito",sans-serif', system:'system-ui,-apple-system,"Segoe UI",sans-serif' };

function buildVars(t) {
  const th = THEMES[t.theme] || THEMES.dream;
  const [a, ai] = ACCENTS[t.accent] || ACCENTS.violet;
  const [alpha, blur] = GLASS[t.glass] || GLASS.aero;
  return {
    "--wall":th.wall, "--wall-glow":th.glow,
    "--glass":`rgba(${th.glassRGB},${alpha})`, "--blur":blur+"px",
    "--ink":th.ink, "--ink-soft":th.inkSoft, "--ink-faint":th.inkFaint,
    "--edge":th.edge, "--chip":th.chip, "--card":th.card, "--card-hi":th.cardHi, "--code-bg":th.code,
    "--accent":a, "--accent-ink": th.dark ? "#bfeaff" : ai,
    "--ui":FONTS[t.font] || FONTS.nunito, "--cloud-op": t.clouds ? 0.62 : 0,
  };
}

const PALS = [["#ffdcf2","#c8cdff","#a6f0ff"],["#dcf5ff","#5ea7e6","#74c46b"],["#0e1b3e","#274a8c","#5fd0ff"]];
const PAL_NAME = { 0:"dream", 1:"sky", 2:"twilight" };

/* ── Decorative sky ───────────────────────────────────────────────────────*/
const Sky = React.memo(function Sky({ clouds }) {
  const cl = [
    { w:300, h:96, top:"8%", dur:70, delay:-12 },
    { w:200, h:64, top:"26%", dur:92, delay:-44 },
    { w:360, h:116, top:"58%", dur:82, delay:-24 },
    { w:170, h:56, top:"78%", dur:100, delay:-66 },
  ];
  const bb = [
    { s:70, left:"10%", top:"64%", dur:7.4, delay:0 },
    { s:34, left:"26%", top:"82%", dur:5.6, delay:-1.6 },
    { s:96, left:"86%", top:"40%", dur:8.6, delay:-3 },
    { s:48, left:"92%", top:"70%", dur:6.6, delay:-2 },
  ];
  return (
    <div id="sky">
      <div className="glow"></div>
      {clouds && <>
        {cl.map((c,i)=>(<div key={"c"+i} className="cloud" style={{ width:c.w, height:c.h, top:c.top, animationDuration:c.dur+"s", animationDelay:c.delay+"s" }}></div>))}
        {bb.map((b,i)=>(<div key={"b"+i} className="bubble" style={{ width:b.s, height:b.s, left:b.left, top:b.top, animationDuration:b.dur+"s", animationDelay:b.delay+"s" }}></div>))}
      </>}
      <div className="grain"></div>
      <div className="vig"></div>
    </div>
  );
});

/* ── Scroll spy ───────────────────────────────────────────────────────────*/
function useScrollSpy(ids, ready) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    if (!ready) return;
    const onScroll = () => {
      const y = window.scrollY + 120;
      let cur = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      if (window.scrollY < 60) cur = "top";
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);
  return active;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dream",
  "accent": "violet",
  "glass": "aero",
  "font": "nunito",
  "clouds": true
}/*EDITMODE-END*/;

function Site() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [ready, setReady] = useState(false);   // preloader done
  const [lit, setLit] = useState(false);       // rise-in animation
  const [noAnim, setNoAnim] = useState(false); // hard-visible fallback
  const active = useScrollSpy(["top","projects","notes","links","stuff"], ready);
  const vars = buildVars(t);

  useEffect(() => {
    if (!ready) return;
    const a = setTimeout(()=>setLit(true), 60);
    // Timers fire even when the compositor is frozen (backgrounded tab) — force
    // content visible after the entrance would have finished, so it can never
    // get stuck mid-transition.
    const b = setTimeout(()=>setNoAnim(true), 1100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]);

  const jump = useCallback((id) => {
    if (id === "top") { window.scrollTo({ top:0, behavior:"smooth" }); return; }
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top:y, behavior:"smooth" });
    }
  }, []);

  return (
    <div id="site" className={(lit ? "lit" : "") + (noAnim ? " no-anim" : "")} style={vars}>
      <Sky clouds={t.clouds} />

      {ready && <Nav active={active} onJump={jump} />}

      <main>
        <Hero onJump={jump} />

        {/* About-extras + jukebox row */}
        <section className="wrap" style={{ paddingTop:18 }}>
          <div className="cols-2">
            <div className="linkpanel glossy rise d1">
              <h4 style={{ fontFamily:"var(--pixel)", fontSize:10, letterSpacing:".1em", textTransform:"uppercase", color:"var(--accent)", margin:"0 0 12px" }}>currently</h4>
              {ABOUT.now.map((n,i)=>(
                <div key={i} style={{ display:"flex", gap:12, padding:"9px 2px",
                  borderTop: i ? "1px solid var(--edge)" : "none" }}>
                  <span style={{ fontFamily:"var(--mono)", fontSize:11.5, color:"var(--accent)", width:62, flex:"0 0 auto" }}>{n.k}</span>
                  <span style={{ fontSize:13.5, color:"var(--ink)", fontWeight:600 }}>{n.v}</span>
                </div>
              ))}
            </div>
            <div className="rise d2"><Jukebox /></div>
          </div>
        </section>

        <ProjectsSection />
        <NotesSection />
        <LinksSection />
        <StuffSection />
        <Footer />
      </main>

      {!ready && <Preloader onDone={()=>setReady(true)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosphere" />
        <TweakColor label="Palette" value={t.theme === "dream" ? PALS[0] : t.theme === "sky" ? PALS[1] : PALS[2]}
          options={PALS}
          onChange={(v)=>{ const idx = PALS.findIndex(p=>JSON.stringify(p)===JSON.stringify(v)); setTweak("theme", PAL_NAME[idx]); }} />
        <TweakColor label="Accent" value={ACCENTS[t.accent][0]}
          options={[ACCENTS.violet[0],ACCENTS.sky[0],ACCENTS.aqua[0],ACCENTS.rose[0]]}
          onChange={(v)=>{ const k=Object.keys(ACCENTS).find(k=>ACCENTS[k][0]===v); setTweak("accent",k); }} />
        <TweakToggle label="Clouds & bubbles" value={t.clouds} onChange={(v)=>setTweak("clouds",v)} />
        <TweakSection label="Material" />
        <TweakRadio label="Glass" value={t.glass} options={["aero","crystal","frost"]} onChange={(v)=>setTweak("glass",v)} />
        <TweakSection label="Type" />
        <TweakRadio label="UI font" value={t.font}
          options={[{value:"nunito",label:"Nunito"},{value:"round",label:"Varela"},{value:"system",label:"System"}]}
          onChange={(v)=>setTweak("font",v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Site />);
