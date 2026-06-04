/* mediaplayer.jsx — Windows-Media-Player-style widget with a live canvas visualizer.
   No real audio (respecting "no autoplay") — the visualizer is a generated,
   smoothed signal driven by requestAnimationFrame while "playing". */
const { useState: useStateMP, useRef: useRefMP, useEffect: useEffectMP } = React;

function Visualizer({ playing }) {
  const ref = useRefMP(null);
  const raf = useRefMP(0);
  const t = useRefMP(0);
  const bars = useRefMP(new Array(40).fill(0));

  useEffectMP(() => {
    const cvs = ref.current; if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size(){ const r = cvs.getBoundingClientRect();
      cvs.width = r.width*dpr; cvs.height = r.height*dpr; }
    size();
    const ro = new ResizeObserver(size); ro.observe(cvs);

    function frame(){
      const W = cvs.width, H = cvs.height;
      t.current += playing ? 0.045 : 0.006;
      ctx.clearRect(0,0,W,H);
      const n = bars.current.length;
      const bw = W / n;
      // smoothed pseudo-spectrum
      for (let i=0;i<n;i++){
        const f = i/n;
        let target = playing
          ? (0.32 + 0.68*Math.abs(Math.sin(t.current*1.6 + i*0.5)
              * Math.cos(t.current*0.7 + i*0.21))) * (1 - f*0.45)
              * (0.6 + 0.4*Math.sin(t.current*3 + i))
          : 0.05 + 0.04*Math.sin(t.current + i*0.6);
        target = Math.max(0.02, Math.min(1, target));
        bars.current[i] += (target - bars.current[i]) * (playing?0.28:0.12);
      }
      // bars
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

      raf.current = requestAnimationFrame(frame);
    }
    raf.current = requestAnimationFrame(frame);
    return ()=>{ cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, [playing]);

  return (
    <div className="mp-vis">
      <canvas ref={ref}></canvas>
      <div className="sheen"></div>
    </div>
  );
}

function MediaPlayerApp() {
  const [playing, setPlaying] = useStateMP(false);
  const [idx, setIdx] = useStateMP(0);
  const [pos, setPos] = useStateMP(0.28);
  const trk = TRACKS[idx];

  useEffectMP(()=>{
    if (!playing) return;
    const id = setInterval(()=>{
      setPos(p=>{ if (p>=1){ setIdx(i=>(i+1)%TRACKS.length); return 0; } return p+0.0016; });
    }, 60);
    return ()=>clearInterval(id);
  }, [playing]);

  const dur = (s)=>{ const m = Math.floor(s/60), x = Math.floor(s%60); return m+":"+String(x).padStart(2,"0"); };
  const total = (()=>{ const [m,s]=trk.d.split(":").map(Number); return m*60+s; })();

  const seek = (e)=>{ const r = e.currentTarget.getBoundingClientRect();
    setPos(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))); };

  return (
    <div className="mp">
      <Visualizer playing={playing} />
      <div className="mp-info">
        <div className="mp-track">{trk.t}</div>
        <div className="mp-artist">{trk.a}</div>
        <div className="mp-seek" onClick={seek}>
          <div className="fill" style={{ transform:`scaleX(${pos})` }}></div>
        </div>
        <div className="mp-time"><span>{dur(pos*total)}</span><span>{trk.d}</span></div>
      </div>
      <div className="mp-ctrls">
        <button className="mp-btn" onClick={()=>{ setIdx(i=>(i-1+TRACKS.length)%TRACKS.length); setPos(0); }} aria-label="previous">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M7 5v14h2.4V5zm3 7 9 7V5z"/></svg>
        </button>
        <button className="mp-btn play" onClick={()=>setPlaying(p=>!p)} aria-label="play/pause">
          {playing
            ? <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>
            : <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <button className="mp-btn" onClick={()=>{ setIdx(i=>(i+1)%TRACKS.length); setPos(0); }} aria-label="next">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M14.6 5v14H17V5zM5 19l9-7-9-7z"/></svg>
        </button>
      </div>
      <div className="mp-list">
        {TRACKS.map((tr,i)=>(
          <div key={i} className={"mp-li"+(i===idx?" on":"")} onClick={()=>{ setIdx(i); setPos(0); setPlaying(true); }}>
            <span className="num">{i===idx&&playing ? "♪" : String(i+1).padStart(2,"0")}</span>
            <span style={{ minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tr.t}</span>
            <span className="dur">{tr.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MediaPlayerApp, Visualizer });
