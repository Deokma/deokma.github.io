/* workshop.jsx — /workshop/: the workbench place.
   Layers, back to front: a pegboard wall with tools, the bench, a cutting mat, the build
   itself with numbered pins on its parts, then paper on top (label tape, notebook page,
   index card, blueprint spec sheet, sticky notes). Hovering a pin or an index-card row
   lights up the other. Finished builds only: no schematics, firmware or print files. */
import React from "react";
import { Nav, Footer } from "./shell.jsx";
import { WORKSHOP } from "./data.jsx";
import { useDepth, layer } from "./places.jsx";

/* Decorative tools hanging on the pegboard (original line drawings). */
function Tools() {
  return (
    <svg className="tools" viewBox="0 0 420 170" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#3b4a5e" strokeWidth="3" strokeLinecap="round">
        <path d="M40 18v12M120 18v12M206 18v12M300 18v12M372 18v12" />
      </g>
      {/* screwdriver */}
      <g transform="translate(40 30)">
        <rect x="-9" y="0" width="18" height="52" rx="7" fill="#ff8a5c" stroke="#b5532f" strokeWidth="2" />
        <path d="M-3 8v36M3 8v36" stroke="#ffd2bf" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 52v62" stroke="#8a97a8" strokeWidth="5" strokeLinecap="round" />
        <path d="M-3 114h6l-1.5 8h-3z" fill="#8a97a8" />
      </g>
      {/* flush cutters */}
      <g transform="translate(120 30)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-6 0c-14 18-16 46-8 66M6 0c14 18 16 46 8 66" stroke="#2f8fdd" strokeWidth="9" />
        <path d="M-12 66l10 34M12 66l-10 34" stroke="#5b6778" strokeWidth="5" />
        <circle cx="0" cy="70" r="4" fill="#5b6778" stroke="none" />
      </g>
      {/* solder spool */}
      <g transform="translate(206 66)">
        <circle r="34" fill="#c9d3df" stroke="#5b6778" strokeWidth="3" />
        <circle r="24" fill="none" stroke="#9aa7b7" strokeWidth="9" strokeDasharray="2 3" />
        <circle r="9" fill="#eef3f8" stroke="#5b6778" strokeWidth="3" />
        <path d="M28 18c18 10 22 32 10 52" fill="none" stroke="#9aa7b7" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* steel rule */}
      <g transform="translate(300 30) rotate(4)">
        <rect x="-8" y="0" width="16" height="128" rx="2" fill="#dfe6ee" stroke="#6c7a8c" strokeWidth="2" />
        <path d="M-8 12h7M-8 24h4M-8 36h7M-8 48h4M-8 60h7M-8 72h4M-8 84h7M-8 96h4M-8 108h7" stroke="#6c7a8c" strokeWidth="1.5" />
      </g>
      {/* hex key */}
      <g transform="translate(372 30)">
        <path d="M0 0v74q0 10 10 10h22" fill="none" stroke="#2c3644" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Wall() {
  return (
    <header className="wall">
      <div className="wall-in wrap">
        <div className="wall-text">
          <h1 className="tape"><span>the workbench</span></h1>
          <div className="hang-tag">
            <p>Physical things I design, 3D-print and wire up. These are finished builds: they show what each one does and how it works, without schematics, firmware or print files.</p>
          </div>
        </div>
        <Tools />
      </div>
    </header>
  );
}

const RULER = Array.from({ length: 21 }, (_, i) => i);

function Build({ p }) {
  const ref = React.useRef(null);
  const [hot, setHot] = React.useState(null);
  useDepth(ref);
  const titleId = p.id + "-title";
  const part = (id) => p.parts.find((x) => x.id === id);
  const lit = (id) => ({
    onMouseEnter: () => setHot(id), onMouseLeave: () => setHot(null),
    onFocus: () => setHot(id), onBlur: () => setHot(null),
  });

  return (
    <article className="bench scene" ref={ref} aria-labelledby={titleId}>
      <div className="mat">
        <div className="ruler" aria-hidden="true">{RULER.map((n) => <span key={n}>{n}</span>)}</div>

        <div className="b-grid">
          <div className="b-title layer" style={layer(7, -0.6)}>
            <h2 className="tape tape-sm" id={titleId}><span>{p.name}</span></h2>
            <span className="stamp"><span className="sr-only">Status: </span>{p.statusLabel} · {p.years}</span>
            <p className="strip">{p.tagline}</p>
          </div>

          <figure className="b-object layer" style={layer(3)}>
            <div className="b-shadow" aria-hidden="true"></div>
            <div className="b-img">
              <img src={p.image.small} srcSet={`${p.image.small} 800w, ${p.image.src} ${p.image.w}w`}
                sizes="(max-width: 820px) 92vw, 600px" width={p.image.w} height={p.image.h}
                alt={p.image.alt} decoding="async" fetchpriority="high" />
              {p.parts.map((x) => (
                <button key={x.id} type="button" className={"pin" + (hot === x.id ? " on" : "")}
                  style={{ left: x.x + "%", top: x.y + "%" }} {...lit(x.id)}
                  onClick={() => setHot((h) => (h === x.id ? null : x.id))}
                  aria-label={`${x.n}: ${x.label}, ${x.note}`}>
                  <span aria-hidden="true">{x.n}</span>
                  <span className="pin-tag" aria-hidden="true"><b>{x.label}</b>{x.note}</span>
                </button>
              ))}
            </div>
            <figcaption>render of the printed case · pins mark the parts you touch</figcaption>
          </figure>

          <div className="b-note paper notebook layer" style={layer(6, 0.7)}>
            {p.about.map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <section className="b-card paper index layer" style={layer(8, -0.8)} aria-labelledby={p.id + "-how"}>
            <h3 id={p.id + "-how"}>how it works</h3>
            <ul>
              {p.how.map(([k, v, id]) => (
                <li key={k} className={hot === id ? "on" : ""} {...lit(id)}>
                  <span className="pn" aria-hidden="true">{part(id).n}</span>
                  <span><b>{k}</b>{v}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="b-spec paper blueprint layer" style={layer(7, 1.1)} aria-labelledby={p.id + "-spec"}>
            <h3 id={p.id + "-spec"}>spec sheet <small>{p.file}.dwg</small></h3>
            <dl>
              {p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <h3 className="inside-h">inside</h3>
            <ul className="bins">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>

          <div className="b-stickies">
            <p className="sticky yellow layer" style={layer(9, -2.2)}>{p.stand}</p>
            {p.next && (
              <p className="sticky pink layer" style={layer(10, 1.8)}>
                <b>on the drawing board: {p.next.title}</b>{p.next.text}
              </p>
            )}
          </div>

          <p className="b-credit paper receipt layer" style={layer(5, 0.4)}>{p.credit}</p>
        </div>
      </div>
    </article>
  );
}

export default function Workshop() {
  return (
    <div id="site" className="lit no-anim place-workbench">
      <a className="skip" href="#content">Skip to content</a>
      <Nav active="workshop" place="workbench" />
      <main id="content" tabIndex={-1}>
        <Wall />
        <div className="wrap bench-list">
          <p className="bench-count">{WORKSHOP.length + (WORKSHOP.length === 1 ? " build" : " builds")} on the bench</p>
          {WORKSHOP.map((p) => <Build key={p.id} p={p} />)}
        </div>
        <Footer />
      </main>
    </div>
  );
}
