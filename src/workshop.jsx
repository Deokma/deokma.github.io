/* workshop.jsx — /workshop/: 3D printing & electronics, shown as finished products */
import React from "react";
import { Glyph } from "./icons.jsx";
import { Nav, Footer, Sky, WinBar } from "./shell.jsx";
import { SecHead } from "./sections.jsx";
import { GELS, WORKSHOP } from "./data.jsx";

function Build({ p }) {
  const titleId = p.id + "-title";
  return (
    <article className="product glossy" aria-labelledby={titleId}>
      <WinBar icon={Glyph.workshop} title={p.file + ".exe"} side={p.years} accent />
      <div className="pd-top">
        <figure className="pd-stage">
          <img src={p.image.small} srcSet={`${p.image.small} 800w, ${p.image.src} ${p.image.w}w`}
            sizes="(max-width: 820px) 92vw, 560px" width={p.image.w} height={p.image.h}
            alt={p.image.alt} decoding="async" />
          <figcaption>render of the printed case</figcaption>
        </figure>
        <div className="pd-info">
          <div className="meta">
            <span className="statpill"><span className={"dot " + p.status} aria-hidden="true"></span>{p.statusLabel}</span>
          </div>
          <h3 id={titleId}>{p.name}</h3>
          <p className="pd-tag">{p.tagline}</p>
          {p.about.map((para, i) => <p key={i} className="desc">{para}</p>)}
        </div>
      </div>
      <div className="pd-cols">
        <div>
          <h4 className="pm-h">how it works</h4>
          <dl className="pd-dl">
            {p.how.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div>
          <h4 className="pm-h">specs</h4>
          <dl className="pd-dl">
            {p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <h4 className="pm-h">inside</h4>
          <ul className="pm-stack">{p.stack.map(s => <li key={s} className="pill">{s}</li>)}</ul>
        </div>
      </div>
      {p.extras && <ul className="pd-extras">{p.extras.map(x => <li key={x}>{x}</li>)}</ul>}
      {p.credit && <p className="pd-credit">{p.credit}</p>}
    </article>
  );
}

export default function Workshop() {
  return (
    <div id="site" className="lit no-anim">
      <a className="skip" href="#content">Skip to content</a>
      <Sky />
      <Nav active="workshop" />
      <main id="content" tabIndex={-1}>
        <header id="hero" className="wrap">
          <div className="hero-card ws-hero glossy">
            <span className="gel lg" style={{ "--gel":GELS.workshop }} aria-hidden="true">{Glyph.workshop}</span>
            <div className="hero-main">
              <p className="ey">3d printing &amp; electronics_</p>
              <h1>the <span className="cur">workshop</span></h1>
              <p className="lede">Physical things I design, 3D-print and wire up. These are finished builds: the pages show what they do and how they work, without schematics, firmware or print files.</p>
            </div>
          </div>
        </header>

        <section className="section wrap" aria-labelledby="builds-h">
          <SecHead id="builds-h" icon="workshop" gel={GELS.workshop} label="finished builds" title="builds"
            count={WORKSHOP.length + (WORKSHOP.length === 1 ? " build" : " builds")} />
          {WORKSHOP.map(p => <Build key={p.id} p={p} />)}
        </section>
        <Footer />
      </main>
    </div>
  );
}
