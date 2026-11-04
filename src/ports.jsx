/* ports.jsx — /ports/: the handheld place.
   Layers, back to front: a night desk, an (original) handheld console, its screen running a
   port launcher, the screen glass; and the printed manual for the selected port on the desk
   below. The D-pad, the A button, clicks on the list and the arrow keys all drive the same
   selection. Games are never included: players bring their own copy. */
import React from "react";
import { Nav, Footer } from "./shell.jsx";
import { PORTS } from "./data.jsx";
import { useDepth, layer } from "./places.jsx";

/* Generated cover for ports without published art: original line art, no game assets. */
const ART = {
  grave: (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M18 56V26a14 14 0 0 1 28 0v30z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="2.5" />
      <path d="M32 30v16M25 36h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 57h48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 12v8m0 0 3 3h-6zM47 23h6v7h-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  bunny: (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M24 30c-5-8-7-20-3-24s9 6 9 18M40 30c5-8 7-20 3-24s-9 6-9 18" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="32" cy="40" rx="15" ry="13" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="26.5" cy="38" r="2" fill="currentColor" /><circle cx="37.5" cy="38" r="2" fill="currentColor" />
      <path d="M8 58c6-4 10-4 14 0M42 58c6-4 10-4 14 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

function Cover({ p }) {
  if (p.cover) {
    return <img className="cover" src={p.cover.src} alt={p.cover.alt} width={p.cover.w} height={p.cover.h} decoding="async" />;
  }
  return (
    <div className="cover gen" role="img" aria-label={p.title + " (generated cover)"}
      style={{ "--c1": p.art.from, "--c2": p.art.to, "--cink": p.art.ink }}>
      {ART[p.art.glyph]}
      <b>{p.title}</b>
    </div>
  );
}

const gameLine = (g) => [g.dev, g.year].filter(Boolean).join(" · ");

/* ── The handheld ─────────────────────────────────────────────────────────*/
function Handheld({ sel, onSelect, onOpen }) {
  const listRef = React.useRef(null);
  const p = PORTS[sel];
  const n = PORTS.length;
  const move = (d, focus) => {
    const i = (sel + d + n) % n;
    onSelect(i);
    if (focus) listRef.current?.querySelectorAll("button")[i]?.focus();
  };
  const onKey = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) { e.preventDefault(); move(keys[e.key], true); }
    else if (e.key === "Home") { e.preventDefault(); onSelect(0); listRef.current?.querySelector("button")?.focus(); }
    else if (e.key === "End") { e.preventDefault(); onSelect(n - 1); listRef.current?.querySelectorAll("button")[n - 1]?.focus(); }
  };

  return (
    <div className="hh">
      <span className="hh-sh l" aria-hidden="true">L1</span>
      <span className="hh-sh r" aria-hidden="true">R1</span>

      <div className="hh-left">
        <div className="dpad">
          <button type="button" className="dp up" onClick={() => move(-1)} aria-label="Previous port"></button>
          <button type="button" className="dp dn" onClick={() => move(1)} aria-label="Next port"></button>
          <span className="dp lf" onClick={() => move(-1)} aria-hidden="true"></span>
          <span className="dp rt" onClick={() => move(1)} aria-hidden="true"></span>
          <span className="dp mid" aria-hidden="true"></span>
        </div>
        <span className="stick" aria-hidden="true"></span>
      </div>

      <div className="hh-mid">
        <div className="bezel">
          <div className="screen">
            <div className="scr">
              <div className="scr-top" aria-hidden="true">
                <span>ports</span>
                <span className="scr-r">{n} games<i className="batt"></i></span>
              </div>
              <div className="scr-body">
                <ul className="scr-list" ref={listRef} role="group" aria-label="Ports" onKeyDown={onKey}>
                  {PORTS.map((x, i) => (
                    <li key={x.id}>
                      <button type="button" className={i === sel ? "on" : ""} aria-pressed={i === sel}
                        tabIndex={i === sel ? 0 : -1}
                        onClick={() => (i === sel ? onOpen() : onSelect(i))}>
                        <span className={"dot " + x.status} aria-hidden="true"></span>{x.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="scr-detail" key={p.id}>
                  <Cover p={p} />
                  <b className="scr-t">{p.title}</b>
                  <span className="scr-m">{gameLine(p.game)}</span>
                  <span className="scr-m">{[p.game.genre, p.game.engine].filter(Boolean).join(" · ")}</span>
                  <span className={"scr-s " + p.status}>{p.statusLabel}</span>
                </div>
              </div>
              <div className="scr-hints" aria-hidden="true">
                <span><i>A</i> manual</span><span><i>✥</i> choose</span>
              </div>
            </div>
            <div className="scr-boot" aria-hidden="true"><b>deokma</b><small>handheld</small></div>
            <div className="scr-glass layer" style={layer(-6)} aria-hidden="true"></div>
          </div>
        </div>
        <div className="hh-row" aria-hidden="true">
          <span className="pill-btn">select</span>
          <span className="hh-logo">DEOKMA·H</span>
          <span className="pill-btn">start</span>
        </div>
      </div>

      <div className="hh-right">
        <div className="abxy">
          <span className="fb x" aria-hidden="true">X</span>
          <span className="fb y" aria-hidden="true">Y</span>
          <button type="button" className="fb a" onClick={onOpen} aria-label={"Open the manual for " + p.title}>A</button>
          <span className="fb b" aria-hidden="true">B</span>
        </div>
        <span className="stick" aria-hidden="true"></span>
      </div>

      <span className="hh-led" aria-hidden="true"></span>
      <span className="hh-grill l" aria-hidden="true"></span>
      <span className="hh-grill r" aria-hidden="true"></span>
    </div>
  );
}

/* ── The printed manual ───────────────────────────────────────────────────*/
function Manual({ p, headRef }) {
  const full = !!p.install;
  const facts = [
    ["developer", p.game.dev], ["released", p.game.year], ["genre", p.game.genre],
    ["engine", p.game.engine], ["price", p.game.price], ["port license", p.license],
  ].filter(([, v]) => v);

  return (
    <section className="manual" aria-labelledby="man-h">
      <div className={"booklet" + (full ? "" : " single")} key={p.id}>
        <div className="man-page">
          <header className="man-head">
            <small>instruction manual · ports/{p.file}</small>
            <h2 id="man-h" tabIndex={-1} ref={headRef}>{p.title}</h2>
            <p className="man-tag">{p.tagline}</p>
            <p className="man-status"><span className={"dot " + p.status} aria-hidden="true"></span>{p.statusLabel}</p>
          </header>
          <dl className="man-facts">
            {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            {p.device && <div><dt>tested on</dt><dd>{p.device}</dd></div>}
          </dl>
          {p.about.map((t, i) => <p key={i} className="man-p">{t}</p>)}
          {p.soon && <p className="man-soon">{p.soon}</p>}
          {p.features && (<>
            <h3>what the port does</h3>
            <ul className="man-list">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </>)}
          {p.shot && (
            <figure className="man-shot">
              <img src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} loading="lazy" decoding="async" />
              <figcaption>{p.shot.cap}</figcaption>
            </figure>
          )}
          {!full && <ManualLinks p={p} />}
        </div>

        {full && (
          <div className="man-page">
            <h3>install</h3>
            <ol className="man-steps">{p.install.map((s) => <li key={s}>{s}</li>)}</ol>

            <h3>controls</h3>
            <dl className="man-ctrl">
              {p.controls.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>

            <h3>lab notes</h3>
            <dl className="man-lab">
              {p.lab.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>

            {p.numbers && (
              <div className="man-table">
                <table>
                  <caption>{p.numbers.caption}</caption>
                  <thead><tr>{p.numbers.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                  <tbody>
                    {p.numbers.rows.map((r) => (
                      <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((c, i) => <td key={i}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <ManualLinks p={p} />
          </div>
        )}
      </div>
    </section>
  );
}

function ManualLinks({ p }) {
  return (<>
    <ul className="man-links">
      {p.links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ›<span className="sr-only"> (opens in a new tab)</span></a>
        </li>
      ))}
    </ul>
    <p className="man-fine">{p.credit}</p>
  </>);
}

export default function Ports() {
  const [sel, setSel] = React.useState(() => {
    const i = PORTS.findIndex((x) => "#" + x.id === location.hash);
    return i < 0 ? 0 : i;
  });
  const scene = React.useRef(null);
  const head = React.useRef(null);
  useDepth(scene);

  const select = React.useCallback((i) => {
    setSel(i);
    history.replaceState(null, "", "#" + PORTS[i].id);
  }, []);
  const open = React.useCallback(() => {
    const h = head.current; if (!h) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    h.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    h.focus({ preventScroll: true });
  }, []);

  return (
    <div id="site" className="lit no-anim place-handheld">
      <a className="skip" href="#content">Skip to content</a>
      <Nav active="ports" place="handheld" />
      <main id="content" tabIndex={-1}>
        <header className="desk-hero wrap">
          <p className="ey">portmaster ports_</p>
          <h1>the <span className="cur">handheld</span></h1>
          <p className="lede">PC games I get running on Linux handhelds through <a href="https://portmaster.games/" target="_blank" rel="noopener noreferrer">PortMaster</a>. You bring your own copy of the game; the port makes it fit a small screen and a gamepad. Pick a port with the D-pad and press A for its manual.</p>
        </header>
        <div className="desk scene" ref={scene}>
          <div className="desk-glow layer" style={layer(2)} aria-hidden="true"></div>
          <Handheld sel={sel} onSelect={select} onOpen={open} />
        </div>
        <div className="wrap">
          <Manual p={PORTS[sel]} headRef={head} />
        </div>
        <Footer />
      </main>
    </div>
  );
}
