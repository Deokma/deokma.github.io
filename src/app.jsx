/* app.jsx — deokma.web shell: sky, preloader, nav scroll-spy, sections */
import React, { useState, useEffect, useCallback } from "react";
import { Nav, Hero, SystemLog, Footer, Preloader, shouldBoot } from "./shell.jsx";
import { ProjectsSection, ProjectModal, GallerySection, NotesSection, LinksSection, Jukebox } from "./sections.jsx";
import { LiveContext, useLiveModrinth } from "./live.jsx";

/* ── Decorative sky (brushed-steel wall glow, grain and vignette) ─────────*/
const Sky = React.memo(function Sky() {
  return (
    <div id="sky" aria-hidden="true">
      <div className="glow"></div>
      <div className="grain"></div>
      <div className="vig"></div>
    </div>
  );
});

/* ── Scroll spy ───────────────────────────────────────────────────────────*/
const SECTIONS = ["top","projects","gallery","notes","links"];
function useScrollSpy(ids, ready) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY + 120;
      let cur = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      if (window.scrollY < 60) cur = "top";
      // the last section can be too short to reach the top of the viewport
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = ids[ids.length - 1];
      setActive(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [ready]);
  return active;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Site() {
  const [ready, setReady] = useState(() => !shouldBoot()); // preloader done
  const [lit, setLit] = useState(false);       // rise-in animation
  const [noAnim, setNoAnim] = useState(false); // hard-visible fallback
  const [project, setProject] = useState(null);
  const live = useLiveModrinth();
  const active = useScrollSpy(SECTIONS, ready);

  const jump = useCallback((id, smooth = true) => {
    const el = id === "top" ? null : document.getElementById(id);
    if (id !== "top" && !el) return;
    const y = el ? el.getBoundingClientRect().top + window.scrollY - 84 : 0;
    if (smooth && !reducedMotion()) {
      window.scrollTo({ top:y, behavior:"smooth" });
    } else {
      // "auto" would inherit html{scroll-behavior:smooth}; switch it off for an instant jump
      const root = document.documentElement;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      root.style.scrollBehavior = "";
    }
    history.replaceState(null, "", el ? "#" + id : location.pathname + location.search);
    el?.querySelector("h2")?.focus({ preventScroll:true });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const a = setTimeout(()=>setLit(true), 60);
    // Timers fire even when the compositor is frozen (backgrounded tab) — force
    // content visible after the entrance would have finished, so it can never
    // get stuck mid-transition.
    const b = setTimeout(()=>setNoAnim(true), 1100);
    // deep links (#projects etc.): content is rendered by script, so scroll once it exists
    const id = location.hash.slice(1);
    if (SECTIONS.includes(id)) jump(id, false);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]);

  return (
    <LiveContext.Provider value={live}>
      <div id="site" className={(lit ? "lit" : "") + (noAnim ? " no-anim" : "")}>
        <a className="skip" href="#content">Skip to content</a>
        <Sky />

        {ready && <Nav active={active} onJump={jump} />}

        <main id="content" tabIndex={-1}>
          <Hero onJump={jump} />

          {/* system.log terminal + jukebox row */}
          <section className="wrap" style={{ paddingTop:14 }} aria-label="Latest activity">
            <div className="cols-2">
              <div className="rise d1"><SystemLog /></div>
              <div className="rise d2"><Jukebox onOpen={setProject} /></div>
            </div>
          </section>

          <ProjectsSection onOpen={setProject} />
          <GallerySection />
          <NotesSection />
          <LinksSection />
          <Footer />
        </main>

        {project && <ProjectModal id={project} onClose={()=>setProject(null)} />}
        {!ready && <Preloader onDone={()=>setReady(true)} />}
      </div>
    </LiveContext.Provider>
  );
}

export default Site;
