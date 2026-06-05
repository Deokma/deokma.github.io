/* sections2.jsx — Projects / Notes / Links / Stuff as Y2K desktop windows */
const { useState: useStateX } = React;

const PROJECT_ICONS = {
  cloudpaint:"☁️", linklog:"🔗", boombox:"📻", frutiger:"💎",
  tinytube:"📺", garden:"🌼", pixelpet:"🐱", webring:"🌐",
};
const STUFF_ICONS = { shot1:"🖥️", shot2:"☁️", shot3:"💾" };

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
      <SecHead icon="projects" gel={GELS.projects} label="things i've made" title="projects" count={PROJECTS.length+" modules · mostly unfinished"} />
      <div className="grid-proj">
        {PROJECTS.map(pr=>(
          <button key={pr.id} className="pcard glossy" onClick={()=>setOpen(pr.id)}>
            <div className="top">
              <span className="picon">{PROJECT_ICONS[pr.id] || "🗂️"}</span>
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

function ProjectModal({ p, onClose }) {
  const slabel = { go:"running", wip:"in progress", dead:"abandoned, fondly" }[p.status];
  return (
    <div className="lb-back" onClick={onClose}>
      <div className="lb glossy" onClick={e=>e.stopPropagation()}>
        <div className="winbar on">
          <span className="wb-ico">{Glyph.projects}</span>
          <span className="wb-title">{p.name}{p.ext}</span>
          <span className="wb-sp"></span>
          <span className="wb-btns"><i>—</i><i>▢</i><i className="x" style={{ cursor:"pointer" }} onClick={onClose}>✕</i></span>
        </div>
        <div className="lb-body">
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
    </div>
  );
}

/* ── Notes ────────────────────────────────────────────────────────────────*/
function NotesSection() {
  const [sel, setSel] = useStateX(NOTES[0].id);
  const n = NOTES.find(x=>x.id===sel);
  return (
    <section id="notes" className="section wrap">
      <SecHead icon="notes" gel={GELS.notes} label="a small digital journal" title="notes" count={NOTES.length+" entries"} />
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
          <div className="written">written: {n.date}</div>
          <div className="stamp">{n.stamp}</div>
          <h3>{n.title}</h3>
          {n.body.map((para,i)=>(<p key={i}>{para}</p>))}
          {n.code && <div className="code">{n.code}</div>}
          <div className="sig">— saved automatically</div>
        </div>
      </div>
    </section>
  );
}

/* ── Links ────────────────────────────────────────────────────────────────*/
function LinksSection() {
  return (
    <section id="links" className="section wrap">
      <SecHead icon="links" gel={GELS.links} label="favourite corners of the web" title="links" />
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
          <WinBar icon={Glyph.stuff} title="badge.collector" side={BUTTONS88.length+" / 50"} accent />
          <div className="bcoll-body">
            <div className="btn88wrap">
              {BUTTONS88.map((b,i)=>(
                <span key={i} className="btn88" style={{ background:b.bg, borderColor:b.b }}>
                  <span className="b88-in" style={{ color:b.c }}>{b.txt}</span>
                </span>
              ))}
            </div>
            <div className="bcoll-foot">
              <span>collecting stickers like pokemon.</span>
              <div className="bcoll-bar"><i style={{ width:"100%" }}></i></div>
              <span>100%</span>
              <a className="wbtn" href="#" onClick={e=>e.preventDefault()}>‹</a>
              <a className="wbtn" href="#" onClick={e=>e.preventDefault()}>›</a>
            </div>
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
      <SecHead icon="stuff" gel={GELS.stuff} label="a drawer of curiosities" title="stuff" />
      <div className="grid-stuff">
        {STUFF.map((s,i)=>(
          <div key={i} className="collect glossy">
            {s.kind==="slot" && (
              <div className="dicon-tile">{STUFF_ICONS[s.id] || "🗂️"}</div>
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
        <div className="collect glossy">
          <div className="filelist">
            <div className="fl">readme.txt</div>
            <div className="fl">todo.txt</div>
            <div className="fl">ideas.txt</div>
            <div className="fl">glossy.gif</div>
            <div className="fl">pixelcat.cur</div>
          </div>
          <div className="cap">old snippets<small>~/stuff</small></div>
        </div>
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
        <span className="lab">now.playing</span>
        <span className="eq">— winamp vibes —</span>
        <span className="wb-btns"><i>—</i><i>▢</i><i className="x">✕</i></span>
      </div>
      <MediaPlayerApp />
    </div>
  );
}

Object.assign(window, { SecHead, ProjectsSection, NotesSection, LinksSection, StuffSection, Jukebox });
