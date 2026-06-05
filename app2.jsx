/* app2.jsx — deokma.web shell: sky, preloader, nav scroll-spy, sections, tweaks */
const { useState, useEffect, useRef, useCallback } = React;

/* ── Theme system (shared with the material in site.css) ──────────────────── */
/* Brushed-steel desktop palettes. Windows stay light in every theme; the wall
   is a metallic gradient with a faint vertical "brushed" texture. */
const BRUSH = "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 2px, rgba(30,60,100,.045) 2px 4px), ";
const THEMES = {
  dream: { /* cool steel-blue (default) */
    wall:BRUSH+"linear-gradient(180deg,#d4e2f0 0%,#aac4df 46%,#bdd1e7 100%)",
    glow:"radial-gradient(42% 30% at 80% 8%,rgba(255,255,255,.7),transparent 64%),radial-gradient(56% 42% at 50% 100%,rgba(180,210,240,.4),transparent 74%)",
    glassRGB:"250,253,255", dark:false,
    ink:"#16283f", inkSoft:"#3a557a", inkFaint:"#6f86a0",
    edge:"#7e9bbe", chip:"#e9f0f9",
    card:"#eef4fb", cardHi:"#ffffff",
    code:"#0a1020",
  },
  sky: { /* aqua-green steel */
    wall:BRUSH+"linear-gradient(180deg,#d8f1ff 0%,#a6d4ec 44%,#a6cfdc 100%)",
    glow:"radial-gradient(40% 28% at 82% 9%,rgba(255,255,255,.75),transparent 62%),radial-gradient(60% 44% at 50% 100%,rgba(160,225,200,.4),transparent 74%)",
    glassRGB:"250,253,255", dark:false,
    ink:"#10303a", inkSoft:"#2f5462", inkFaint:"#6c93a0",
    edge:"#7ea6b4", chip:"#e9f4f7",
    card:"#eef6f9", cardHi:"#ffffff",
    code:"#08121f",
  },
  twilight: { /* dusk lavender-steel */
    wall:BRUSH+"linear-gradient(180deg,#cdd2ec 0%,#a9aedd 44%,#b6bce0 100%)",
    glow:"radial-gradient(44% 30% at 50% 6%,rgba(255,255,255,.65),transparent 70%),radial-gradient(60% 42% at 28% 100%,rgba(180,180,235,.42),transparent 74%)",
    glassRGB:"250,252,255", dark:false,
    ink:"#241f44", inkSoft:"#473f6e", inkFaint:"#7a73a0",
    edge:"#9088b8", chip:"#efecf8",
    card:"#f2f0fa", cardHi:"#ffffff",
    code:"#0c0a20",
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

const PALS = [["#d4e2f0","#aac4df","#7e9bbe"],["#d8f1ff","#a6d4ec","#7ea6b4"],["#cdd2ec","#a9aedd","#9088b8"]];
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
  "accent": "sky",
  "glass": "aero",
  "font": "nunito",
  "clouds": false
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

        {/* system.log terminal + jukebox row */}
        <section className="wrap" style={{ paddingTop:14 }}>
          <div className="cols-2">
            <div className="rise d1"><SystemLog /></div>
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
