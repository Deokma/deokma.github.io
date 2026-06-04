/* sections2.jsx — Projects / Notes / Links / Stuff as glossy web modules */
const { useState: useStateX } = React;

function SecHead({ icon, gel, label, title, count }) {
  return (
    <div className="sec-head">
      <span className="gel" style={{ "--gel":gel }}>{Glyph[icon]}</span>
      <div>
        <div className="label">{label}</div>
        <h2>{title}</h2>
      </div>
      <span className="rule"></span>
      {count && <span className="count">{count}</span>}
    </div>
  );
}

/* ── Projects ─────────────────────────────────────────────────────────────*/
function ProjectsSection() {
  const [open, setOpen] = useStateX(null);
  const p = PROJECTS.find(x=>x.id===open);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e)=>{ if (e.key==="Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="projects" className="section wrap">
      <SecHead icon="projects" gel={GELS.projects} label="things i've made" title="Projects" count={PROJECTS.length+" modules · mostly unfinished"} />
      <div className="grid-proj">
        {PROJECTS.map(pr=>(
          <button key={pr.id} className="pcard glossy" onClick={()=>setOpen(pr.id)}>
            <div className="top">
              <FileBadge ext={pr.ext} status={pr.status} />
              <div className="nm">{pr.name}<em>{pr.ext}</em></div>
            </div>
            <div className="bl">{pr.blurb}</div>
            <div className="ft">
              <span className="statpill"><span className={"dot "+pr.status}></span>{pr.lang}</span>
              <span className="open">open ›</span>
            </div>
          </button>
        ))}
      </div>
      {p && <ProjectModal p={p} onClose={()=>setOpen(null)} />}
    </section>
  );
}

function FileBadge({ ext, status }) {
  const hue = { go:"#56cf8e", wip:"#ffb14d", dead:"#9aa6bf" }[status];
  return (
    <span style={{ position:"relative", display:"inline-block", width:42, height:38, flex:"0 0 auto" }}>
      <span style={{ position:"absolute", inset:0, borderRadius:"3px 8px 8px 8px",
        background:"linear-gradient(160deg,#fff,"+hue+" 165%)", border:"1px solid rgba(0,40,90,.25)",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,.9), 0 2px 6px rgba(20,40,90,.2)" }}></span>
      <span style={{ position:"absolute", left:0, top:0, width:14, height:11, background:hue,
        borderRadius:"3px 0 7px 0", boxShadow:"inset 0 1px 0 rgba(255,255,255,.5)" }}></span>
      <span style={{ position:"absolute", left:0, right:0, bottom:5, fontFamily:"var(--pixel)", fontSize:7,
        textAlign:"center", color:"rgba(10,40,90,.65)" }}>{(ext.replace(/[^a-z]/g,'').toUpperCase().slice(0,3))||"DIR"}</span>
    </span>
  );
}

function ProjectModal({ p, onClose }) {
  const slabel = { go:"running", wip:"in progress", dead:"abandoned, fondly" }[p.status];
  return (
    <div className="lb-back" onClick={onClose}>
      <div className="lb glossy" onClick={e=>e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="close">✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:13 }}>
          <FileBadge ext={p.ext} status={p.status} />
          <h3>{p.name}<em>{p.ext}</em></h3>
        </div>
        <div className="meta">
          <span className="statpill"><span className={"dot "+p.status}></span>{slabel}</span>
          <span className="statpill">{p.lang}</span>
          <span className="statpill">{p.year}</span>
        </div>
        <p className="desc">{p.blurb}</p>
        <div className="changelog">
          {p.log.map((l,i)=>(<div key={i} className="cl"><b>›</b>{l}</div>))}
        </div>
      </div>
    </div>
  );
}

/* ── Notes ────────────────────────────────────────────────────────────────*/
function NotesSection() {
  const [sel, setSel] = useStateX(NOTES[0].id);
  const n = NOTES.find(x=>x.id===sel);
  return (
    <section id="notes" className="section wrap">
      <SecHead icon="notes" gel={GELS.notes} label="a small digital journal" title="Notes" count={NOTES.length+" entries"} />
      <div className="notes-mod glossy">
        <div className="notes-side">
          {NOTES.map(x=>(
            <button key={x.id} className={"nbtn"+(x.id===sel?" on":"")} onClick={()=>setSel(x.id)}>
              <div className="t">{x.title}</div>
              <div className="d">{x.date}</div>
            </button>
          ))}
        </div>
        <div className="notes-read">
          <div className="stamp">{n.stamp}</div>
          <h3>{n.title}</h3>
          {n.body.map((para,i)=>(<p key={i}>{para}</p>))}
          {n.code && <div className="code">{n.code}</div>}
          <div className="sig">— written {n.date.replace(/ /g,'')} · saved automatically</div>
        </div>
      </div>
    </section>
  );
}

/* ── Links ────────────────────────────────────────────────────────────────*/
function LinksSection() {
  return (
    <section id="links" className="section wrap">
      <SecHead icon="links" gel={GELS.links} label="favourite corners of the web" title="Links" />
      <div className="cols-2">
        <div className="linkpanel glossy">
          {LINKCATS.map(cat=>(
            <div key={cat.name} className="linkcat">
              <h4>{cat.name}</h4>
              <div className="linkrows">
                {cat.links.map(l=>(
                  <a key={l.t} className="lrow" href="#" onClick={e=>e.preventDefault()}>
                    <span className="fav" style={{ background:cat.fav }}></span>
                    <span style={{ minWidth:0 }}>
                      <div className="lt">{l.t}</div>
                      <div className="lu">{l.u}</div>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="collect-panel glossy">
          <h4>88×31 — collected buttons</h4>
          <div className="btn88wrap">
            {BUTTONS88.map((b,i)=>(
              <span key={i} className="btn88" style={{ background:b.bg, borderColor:b.b }}>
                <span className="b88-in" style={{ color:b.c }}>{b.txt}</span>
              </span>
            ))}
          </div>
          <div className="webring">
            <span style={{ fontFamily:"var(--pixel)", fontSize:9, letterSpacing:".08em", color:"var(--accent)", textTransform:"uppercase" }}>member of the personal web ring</span>
            <a className="wbtn" href="#" onClick={e=>e.preventDefault()}>‹</a>
            <a className="wbtn" href="#" onClick={e=>e.preventDefault()}>✦</a>
            <a className="wbtn" href="#" onClick={e=>e.preventDefault()}>›</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stuff ────────────────────────────────────────────────────────────────*/
function StuffSection() {
  return (
    <section id="stuff" className="section wrap">
      <SecHead icon="stuff" gel={GELS.stuff} label="a drawer of curiosities" title="Stuff" />
      <div className="grid-stuff">
        {STUFF.map((s,i)=>(
          <div key={i} className="collect glossy">
            {s.kind==="slot" && (
              <image-slot id={s.id} shape="rect" placeholder="drop image" style={{ width:"100%", height:"116px", display:"block" }}></image-slot>
            )}
            {s.kind==="palette" && (
              <div className="swatchrow">{s.cols.map((c,j)=>(<i key={j} style={{ background:c }}></i>))}</div>
            )}
            {s.kind==="gadget" && (
              <div className="gadgetbox">{s.items.map((it,j)=>(<span key={j} className="gtag">{it}</span>))}</div>
            )}
            <div className="cap">{s.cap}<small>{s.sub}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Jukebox (embedded mini player, uses the visualizer) ───────────────────*/
function Jukebox() {
  return (
    <div className="jukebox glossy">
      <div className="jb-head">
        <span className="gel sm" style={{ "--gel":GELS.media }}>{Glyph.media}</span>
        <span className="lab">deokma's jukebox</span>
        <span className="eq">~ now playing ~</span>
      </div>
      <MediaPlayerApp />
    </div>
  );
}

Object.assign(window, { SecHead, ProjectsSection, NotesSection, LinksSection, StuffSection, Jukebox });
