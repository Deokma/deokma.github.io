/* mediaplayer.jsx — Windows-Media-Player-style widget with a live canvas visualizer.
   The "playlist" is the list of released mods; the seek bar shows each mod's share of
   downloads. No audio. The visualizer is a generated, smoothed signal that idles softly,
   bursts briefly when the selection changes, and stops while off-screen or when the
   user prefers reduced motion. */
import React, { useState as useStateMP, useRef as useRefMP, useEffect as useEffectMP } from "react";
import { PROJECTS, STATS, downloadsOf, fmtShort, fmtNum, fmtDate, loaderList } from "./data.jsx";
import { LiveContext } from "./live.jsx";

export function Visualizer({ playing }) {
  const ref = useRefMP(null);
  const raf = useRefMP(0);
  const t = useRefMP(0);
  const bars = useRefMP(new Array(40).fill(0));
  const visible = useRefMP(true);

  useEffectMP(() => {
    const cvs = ref.current; if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size(){ const r = cvs.getBoundingClientRect();
      cvs.width = r.width*dpr; cvs.height = r.height*dpr; if (still) draw(); }
    size();
    const ro = new ResizeObserver(size); ro.observe(cvs);
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting && !still) { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(frame); }
    });
    io.observe(cvs);

    function step(){
      t.current += playing ? 0.045 : 0.006;
      const n = bars.current.length;
      // smoothed pseudo-spectrum
      for (let i=0;i<n;i++){
        const f = i/n;
        let target = playing
          ? (0.32 + 0.68*Math.abs(Math.sin(t.current*1.6 + i*0.5)
              * Math.cos(t.current*0.7 + i*0.21))) * (1 - f*0.45)
              * (0.6 + 0.4*Math.sin(t.current*3 + i))
          : 0.12 + 0.08*Math.sin(t.current + i*0.6);
        target = Math.max(0.02, Math.min(1, target));
        bars.current[i] += (target - bars.current[i]) * (playing?0.28:0.12);
      }
    }
    function draw(){
      const W = cvs.width, H = cvs.height;
      ctx.clearRect(0,0,W,H);
      const n = bars.current.length;
      const bw = W / n;
      for (let i=0;i<n;i++){
        const h = bars.current[i]*H*0.82;
        const x = i*bw;
        const grad = ctx.createLinearGradient(0,H,0,H-h);
        grad.addColorStop(0,"#1c5fb0");
        grad.addColorStop(0.5,"#48b0ff");
        grad.addColorStop(1,"#bdf0ff");
        ctx.fillStyle = grad;
        ctx.fillRect(x+bw*0.16, H-h, bw*0.68, h);
        // reflected cap glow
        ctx.fillStyle = "rgba(190,240,255,.85)";
        ctx.fillRect(x+bw*0.16, H-h, bw*0.68, 2*dpr);
      }
      // waveform overlay
      ctx.beginPath();
      for (let x=0;x<=W;x+=4*dpr){
        const p = x/W;
        const y = H*0.5 + Math.sin(p*Math.PI*8 + t.current*4)*H*0.12*(playing?1:0.25)
          * Math.sin(p*Math.PI);
        if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = "rgba(155,232,255,.55)";
      ctx.lineWidth = 1.5*dpr; ctx.stroke();
    }
    function frame(){
      step(); draw();
      if (visible.current) raf.current = requestAnimationFrame(frame);
    }
    if (still) {
      for (let k=0;k<40;k++) step();
      draw();
    } else {
      raf.current = requestAnimationFrame(frame);
    }
    return ()=>{ cancelAnimationFrame(raf.current); ro.disconnect(); io.disconnect(); };
  }, [playing]);

  return (
    <div className="mp-vis" aria-hidden="true">
      <canvas ref={ref}></canvas>
      <div className="sheen"></div>
    </div>
  );
}

export function MediaPlayerApp({ onOpen }) {
  const live = React.useContext(LiveContext);
  const mods = PROJECTS.filter(p => p.cat === "mods" && p.status === "go")
    .map(p => ({ p, d: downloadsOf(p, live), latest: STATS.modrinth[p.mr].releases[0] }))
    .sort((a, b) => b.d.total - a.d.total);
  const max = mods.length ? mods[0].d.total : 1;
  const [idx, setIdx] = useStateMP(0);
  const [burst, setBurst] = useStateMP(false);
  const cur = mods[idx];

  useEffectMP(()=>{
    if (!burst) return;
    const id = setTimeout(()=>setBurst(false), 2400);
    return ()=>clearTimeout(id);
  }, [burst, idx]);

  const pick = (i) => { setIdx((i + mods.length) % mods.length); setBurst(true); };

  return (
    <div className="mp">
      <Visualizer playing={burst} />
      <div className="mp-info" aria-live="polite">
        <div className="mp-track">{cur.p.name}</div>
        <div className="mp-artist">v{cur.latest.version} · {loaderList(cur.latest.loaders)} · {fmtDate(cur.latest.date)}</div>
        <div className="mp-seek" aria-hidden="true">
          <div className="fill" style={{ transform:`scaleX(${Math.max(0.02, cur.d.total / max)})` }}></div>
        </div>
        <div className="mp-time">
          <span>{fmtNum(cur.d.mr)} on modrinth</span>
          <span>{cur.d.cf ? fmtNum(cur.d.cf) + " on curseforge" : "modrinth only"}</span>
        </div>
      </div>
      <div className="mp-ctrls">
        <button className="mp-btn" onClick={()=>pick(idx-1)} aria-label="Previous mod">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M7 5v14h2.4V5zm3 7 9 7V5z"/></svg>
        </button>
        <button className="mp-btn play" onClick={()=>onOpen(cur.p.id)} aria-label={"Open details for " + cur.p.name} title="Open details">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button className="mp-btn" onClick={()=>pick(idx+1)} aria-label="Next mod">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M14.6 5v14H17V5zM5 19l9-7-9-7z"/></svg>
        </button>
      </div>
      <ol className="mp-list" aria-label="Released mods by downloads">
        {mods.map((m,i)=>(
          <li key={m.p.id}>
            <button className={"mp-li"+(i===idx?" on":"")} aria-current={i===idx ? "true" : undefined} onClick={()=>pick(i)}>
              <span className="num" aria-hidden="true">{i===idx && burst ? "♪" : String(i+1).padStart(2,"0")}</span>
              <span className="nm">{m.p.name}</span>
              <span className="dur" title={fmtNum(m.d.total) + " downloads"}>{fmtShort(m.d.total)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
