/* data.jsx — Deokma's world. All site content lives here. */

const GELS = {
  about:    "#7c9cff",
  projects: "#ffb14d",
  notes:    "#56cf8e",
  links:    "#5ec6ff",
  stuff:    "#c98bff",
  media:    "#3f6fe0",
};

const ABOUT = {
  handle: "deokma",
  status: "online — tinkering",
  tagline: "Programmer, tinkerer & explorer of forgotten corners of the internet.",
  blurb: [
    "hi, i'm Deokma. i make small software for the joy of it and keep a little homepage like this one because the web used to feel like somebody's bedroom, not a feed.",
    "i like the future people imagined around 2003 — glossy, hopeful, a bit dreamlike. this place is my attempt to keep a piece of it running.",
  ],
  interests: ["open-source", "self-hosting", "linux", "frutiger aero", "personal sites", "retro-futurism", "old gadgets", "making things for fun"],
  now: [
    { k: "building", v: "a tiny self-hosted link archive" },
    { k: "reading",  v: "old web design zines (1999–2004)" },
    { k: "playing",  v: "with WebGL clouds at 2am" },
    { k: "running",  v: "DeokmaOS 5.1 · uptime 1,284 days" },
  ],
};

const PROJECTS = [
  { id:"cloudpaint", name:"cloudpaint", ext:".glsl", status:"wip", lang:"WebGL",
    blurb:"a little shader toy that paints frutiger-aero skies from noise. drag to move the sun.",
    log:["spent all night on the bokeh","clouds finally look soft enough","needs a save button someday"], year:"2025" },
  { id:"linklog", name:"linklog", ext:".db", status:"go", lang:"Go + SQLite",
    blurb:"self-hosted bookmark archive that snapshots pages so the good links never rot.",
    log:["3,012 links saved","full-text search works","exports to a static site"], year:"2024" },
  { id:"boombox", name:"boombox.js", ext:".js", status:"go", lang:"Canvas",
    blurb:"the audio visualizer powering the player on this desktop. ~4kb, no deps.",
    log:["bars + waveform modes","theme-aware colours","might add a spectrum view"], year:"2025" },
  { id:"frutiger", name:"frutiger.css", ext:".css", status:"wip", lang:"CSS",
    blurb:"a tiny css kit for glossy aero buttons, glass panels and gel icons.",
    log:["buttons + panels done","working on the scrollbars","docs are... aspirational"], year:"2025" },
  { id:"tinytube", name:"tinytube", ext:".py", status:"dead", lang:"Python",
    blurb:"a self-hosted video corner for friends. lovely idea, ran out of weekends.",
    log:["uploads worked","transcoding ate my cpu","shelved, fondly"], year:"2023" },
  { id:"garden", name:"garden", ext:"/", status:"wip", lang:"notes",
    blurb:"a digital garden of half-thoughts that link to each other. always growing.",
    log:["41 notes planted","backlinks render","needs weeding"], year:"ongoing" },
  { id:"pixelpet", name:"pixelpet", ext:".svg", status:"dead", lang:"JS",
    blurb:"a desktop creature that wandered your taskbar. cute, slightly haunted.",
    log:["it blinked!","it followed the cursor","i got attached, then it crashed"], year:"2022" },
  { id:"webring", name:"webring", ext:".php", status:"go", lang:"PHP",
    blurb:"a small webring for personal sites i love. join if you keep a corner too.",
    log:["18 members","next/prev work","badges in the links window"], year:"2024" },
];

const NOTES = [
  { id:1, title:"on keeping a homepage", date:"2026 · 05 · 28", stamp:"~/notes/homepage.txt",
    body:[
      "i opened an old backup drive tonight and found my first website from when i was a teenager. blue gradient, a glittery title, a hit counter that lied. it made me unreasonably happy.",
      "the feed era trained us to perform. a homepage doesn't ask you to perform — it just sits there being yours. so here i am again, building little rooms nobody asked for.",
    ],
    code:null },
  { id:2, title:"clouds, finally soft", date:"2026 · 05 · 21", stamp:"~/dev/cloudpaint.log",
    body:[
      "two weeks fighting the cloud shader. the trick wasn't more octaves of noise, it was lowering the contrast and letting the light bleed. the future was always about soft light.",
    ],
    code:"// the line that fixed everything\ncol = mix(sky, cloud, smoothstep(0.42, 0.78, n));\ncol += pow(sun, 8.0) * 0.35; // gentle bloom" },
  { id:3, title:"the web i miss", date:"2026 · 05 · 09", stamp:"~/notes/the-web.txt",
    body:[
      "i miss stumbling onto a stranger's site at 1am — their playlist, their wallpaper, their weird little fan page. no algorithm sent me there. i just wandered in.",
      "if you're reading this: make a page. it doesn't have to be good. it just has to be yours.",
    ], code:null },
  { id:4, title:"things that should still be glossy", date:"2026 · 04 · 30", stamp:"~/notes/glossy.txt",
    body:[
      "a list, for no reason: progress bars, play buttons, weather widgets, the little orb on a start button, bubbles, app icons that look wet, and the inside of a media player at night.",
      "somewhere we decided flat was honest. i think we just got tired. i'm not tired.",
    ], code:null },
  { id:5, title:"uptime", date:"2026 · 04 · 12", stamp:"~/dev/server.log",
    body:[
      "the little box under my desk has been running for 1,284 days. it hosts this page, the link archive, a clock that nobody but me checks. it gets warm in summer. i like that something i made is just... quietly alive.",
    ],
    code:"$ uptime\n 02:14  up 1284 days,  load avg: 0.04 0.06 0.05" },
];

const LINKCATS = [
  { name:"webrings & corners", fav:"linear-gradient(135deg,#7c9cff,#c98bff)", links:[
    { t:"the personal web", u:"sites like this one" },
    { t:"melonland", u:"a forum for homepages" },
    { t:"neocities surf club", u:"random personal sites" },
    { t:"the cloud index", u:"frutiger aero archive" },
  ]},
  { name:"tools i keep open", fav:"linear-gradient(135deg,#56cf8e,#5ec6ff)", links:[
    { t:"caddy", u:"the friendly web server" },
    { t:"shadertoy", u:"glsl playground" },
    { t:"excalidraw", u:"thinking out loud" },
    { t:"oklch.com", u:"colour picking" },
  ]},
  { name:"reading", fav:"linear-gradient(135deg,#ffb14d,#ff7a59)", links:[
    { t:"web design museum", u:"interfaces 1995–2010" },
    { t:"gifcities", u:"the geocities gif archive" },
    { t:"cameron's world", u:"a collage of old web" },
    { t:"low-tech magazine", u:"solar-powered & lovely" },
  ]},
];

// original 88x31 buttons (no real-brand copies)
const BUTTONS88 = [
  { txt:"DEOKMA OS", bg:"linear-gradient(180deg,#bfe6ff,#3a86d4)", c:"#fff", b:"#1c5fb0" },
  { txt:"MADE WITH <3", bg:"linear-gradient(180deg,#ffd1f0,#e066b0)", c:"#fff", b:"#b03a86" },
  { txt:"FRUTIGER\nAERO 4EVER", bg:"linear-gradient(180deg,#d8f5e0,#2fb39b)", c:"#063", b:"#1c7a6a" },
  { txt:"BEST VIEWED\nWITH WONDER", bg:"#101a3a", c:"#9be8ff", b:"#5fd0ff" },
  { txt:"NO ALGO\nZONE", bg:"linear-gradient(180deg,#fff3c0,#ffb14d)", c:"#7a3d00", b:"#c87a1c" },
  { txt:"POWERED BY\nCAFFEINE", bg:"linear-gradient(180deg,#e9dcc8,#9c7a4f)", c:"#fff", b:"#6a4f2f" },
  { txt:"LINUX\nINSIDE", bg:"linear-gradient(180deg,#cfd8ff,#5a6fe0)", c:"#fff", b:"#3a4ab0" },
  { txt:"KEEP THE\nWEB WEIRD", bg:"linear-gradient(135deg,#c98bff,#5ec6ff)", c:"#fff", b:"#7a3ab0" },
];

const STUFF = [
  { kind:"slot", id:"shot1", cap:"my desktop, today", sub:"screenshot.png" },
  { kind:"palette", cap:"sky palette", sub:"saved swatches", cols:["#cfeaff","#9be8ff","#5ec6ff","#2f8fdd","#1c5fb0"] },
  { kind:"slot", id:"shot2", cap:"a cloud i liked", sub:"clouds/0427.jpg" },
  { kind:"palette", cap:"dream palette", sub:"saved swatches", cols:["#ffd9f2","#e9c7ff","#c7c9ff","#a6ecff","#9be8ff"] },
  { kind:"gadget", cap:"gadgets i love", sub:"a small museum", items:["iPod-era click wheels","translucent iMacs","flip phones","MD players","clear gameboys"] },
  { kind:"slot", id:"shot3", cap:"found on an old drive", sub:"backup/1999/??.bmp" },
  { kind:"palette", cap:"twilight palette", sub:"saved swatches", cols:["#0e1838","#1a2a5c","#2a4a8c","#4aa0d8","#9be8ff"] },
  { kind:"gadget", cap:"things i collect", sub:"the curio shelf", items:["88×31 buttons","desktop wallpapers","boot sounds","cursor packs","webring badges"] },
];

const TRACKS = [
  { t:"Sky Highway (Demo Mix)", a:"Deokma", d:"3:42" },
  { t:"Loading Screen Forever", a:"Frutiger Aero", d:"4:18" },
  { t:"Bubbles & Bloom", a:"Aqua Soft", d:"2:55" },
  { t:"Default Wallpaper", a:"DeokmaOS", d:"3:10" },
  { t:"1284 Days of Uptime", a:"the little box", d:"5:01" },
];

Object.assign(window, { GELS, ABOUT, PROJECTS, NOTES, LINKCATS, BUTTONS88, STUFF, TRACKS });
