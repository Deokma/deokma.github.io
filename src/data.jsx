/* data.jsx — deokma.web content. All site content lives here.
   Project facts were checked against the GitHub repos (README + source), Modrinth and
   CurseForge. Download counts and release history come from data/stats.json
   (`npm run stats`); Modrinth numbers are refreshed live in the browser. */
import STATS from "./data/stats.json";

export { STATS };

export const GELS = {
  about:    "#7c9cff",
  projects: "#ffb14d",
  notes:    "#56cf8e",
  links:    "#5ec6ff",
  gallery:  "#c98bff",
  media:    "#3f6fe0",
  workshop: "#ff8a5c",
};

export const PROFILES = {
  github:     "https://github.com/Deokma",
  modrinth:   "https://modrinth.com/user/Deokma",
  curseforge: "https://www.curseforge.com/members/deokma/projects",
  source:     "https://github.com/Deokma/deokma.github.io",
};

export const ABOUT = {
  handle: "deokma",
  status: "online — tinkering",
  // From the GitHub profile README (github.com/Deokma/Deokma).
  lede: "I'm Denis, a software engineer focused on C++, systems programming and secure software. In my spare time I build Minecraft mods in Java, mostly addons for Create and Charta, along with Android apps and 3D-printed electronics. This is where I keep them.",
  skills: ["java", "c++", "fabric · neoforge · forge", "create addons", "information security"],
};

/* ── Projects ─────────────────────────────────────────────────────────────
   status: go = released · wip = in development · contrib = contribution · dead = archived
   mr / cf: keys into STATS.modrinth / STATS.curseforge                          */
const img = (name, w, h, alt, cap, thumb = true) => ({
  src: `/assets/img/${name}.webp`,
  thumb: thumb ? `/assets/img/${name}-640.webp` : `/assets/img/${name}.webp`,
  w, h, alt, cap,
});

export const CATEGORIES = [
  { id: "all",     label: "all" },
  { id: "mods",    label: "game mods" },
  { id: "tools",   label: "apps & tools" },
];

export const PROJECTS = [
  {
    id: "stockmarket", cat: "mods", status: "go",
    name: "Create: Stock Market", file: "create-stockmarket",
    icon: "/assets/img/stockmarket-icon.webp",
    lang: "Java", years: "2026", license: "AGPL-3.0",
    platform: ["NeoForge", "MC 1.21.1", "client + server"],
    mr: "create-stock-market", cf: "create-stock-market", repo: "create-stockmarket",
    blurb: "A Create addon that turns a server's player shops into a live stock exchange: every shop, price trends and a top-sellers board in one screen.",
    about: [
      "Create: Stock Market adds a Market Terminal block that collects every shop on the server into one searchable screen: what is being sold, by whom, where and for how much. Shops are indexed automatically as chunks load, so players never have to register anything.",
      "The server records prices every 10 minutes and keeps 24 hours of history by default, so each item reads like a stock, with average and lowest price, recent change, volume, a sparkline and a trend arrow. History is saved with the world and survives restarts.",
    ],
    features: [
      "Shops tab: search, sort and filter every Numismatics Vendor and Create Table Cloth shop by mode, type, currency, item, owner or dimension",
      "Market tab: per-item price history with sparklines, percentage change and trend arrows",
      "Top Sellers leaderboard ranked by completed sales",
      "Market Remote item and /shoplist command to open the market from anywhere",
      "Create Display Link support for showing market data on signs, display boards and nixie tubes",
      "Optional Xaero's Minimap integration: right-click a shop to add a waypoint",
      "Translated into 15 languages through Crowdin",
    ],
    stack: ["Java 21", "NeoForge", "Create 6", "Numismatics", "Gradle"],
    links: [
      { kind: "modrinth", label: "Modrinth", href: "https://modrinth.com/mod/create-stock-market" },
      { kind: "curseforge", label: "CurseForge", href: "https://www.curseforge.com/minecraft/mc-mods/create-stock-market" },
      { kind: "github", label: "Source", href: "https://github.com/Deokma/create-stockmarket" },
      { kind: "link", label: "Translate on Crowdin", href: "https://crowdin.com/project/create-stock-market" },
    ],
    gallery: [
      img("stockmarket-shops-tab", 1280, 642, "Shops tab: a table of player shops with item, price, owner, mode and dimension, and filters for mode, type and owner on the left", "Shops tab"),
      img("stockmarket-market-tab", 1280, 633, "Market tab: items listed like stocks with average price, change, volume and a price chart per row", "Market tab"),
      img("stockmarket-top-sellers-tab", 1280, 626, "Top Sellers tab: a leaderboard of players ranked by completed sales", "Top Sellers tab"),
    ],
  },
  {
    id: "casino", cat: "mods", status: "go",
    name: "Charta: Casino", file: "charta-casino-addon",
    icon: "/assets/img/casino-icon.webp",
    lang: "Java", years: "2026", license: "MPL-2.0",
    platform: ["Fabric", "NeoForge", "MC 1.21.1", "client + server"],
    mr: "charta-casino", cf: "charta-casino", repo: "charta-casino-addon",
    blurb: "An addon for the Charta card-game mod that adds Blackjack and multiplayer Texas Hold'em, with betting, side pots and chips on the table.",
    about: [
      "Charta: Casino adds two casino games that you play with other players at a Charta card table. Blackjack is played against a dealer that plays automatically; Texas Hold'em has blinds, a rotating dealer button, betting rounds, side pots and automatic hand evaluation at showdown.",
      "Both games started in my fork of Charta in March 2026 and were then rebuilt as a standalone addon on Charta's addon API, with API changes contributed by Charta's author, lucaargolo.",
    ],
    features: [
      "Blackjack: hit, stand, double down, soft and hard aces, quick-bet buttons and an automatic dealer",
      "Texas Hold'em: fold, check, call, raise or go all-in, with blinds, side pots and showdown evaluation",
      "3D chip stacks rendered on the card table",
      "Several players at one table, with folded and all-in status visible to everyone",
      "JEI and REI recipe viewer support",
    ],
    stack: ["Java 21", "Fabric", "NeoForge", "Charta API", "Gradle"],
    links: [
      { kind: "modrinth", label: "Modrinth", href: "https://modrinth.com/mod/charta-casino" },
      { kind: "curseforge", label: "CurseForge", href: "https://www.curseforge.com/minecraft/mc-mods/charta-sasino" },
      { kind: "github", label: "Source", href: "https://github.com/Deokma/charta-casino-addon" },
      { kind: "link", label: "Charta (base mod)", href: "https://modrinth.com/mod/charta" },
    ],
    gallery: [
      img("casino-chips-on-texas-hold-em", 1280, 661, "Players seated around a Charta card table with community cards and stacks of chips in the middle", "Chips on the table"),
      img("casino-blackjack-menu", 1280, 661, "The Blackjack screen with the dealer's and player's hands and betting buttons", "Blackjack"),
      img("casino-texas-hold-em-menu", 1280, 661, "The Texas Hold'em screen with community cards, the pot and fold, call and raise buttons", "Texas Hold'em"),
    ],
  },
  {
    id: "notely", cat: "mods", status: "go",
    name: "Notely", file: "Notely",
    icon: "/assets/img/notely-icon.webp",
    lang: "Java", years: "2026", license: "MPL-2.0",
    platform: ["Fabric", "Forge", "NeoForge", "MC 1.18.2 – 26.1", "client-only"],
    mr: "notely", cf: "notely", repo: "Notely",
    blurb: "A client-side notepad for Minecraft with live Markdown rendering, checklists and sticky notes you can pin to the HUD.",
    about: [
      "Notely opens a full notepad in game (N by default). Notes render Markdown as you type, including headings, quotes, code, dividers and to-do checkboxes, and any note can be pinned to the HUD as a sticky note that stays on screen while you play.",
      "Notes are stored separately for every world and server, and the mod runs entirely on the client, so it works anywhere. It is my most widely ported mod: Fabric, Forge and NeoForge, from Minecraft 1.18.2 to 26.1.",
    ],
    features: [
      "Markdown editor with headings, blockquotes, inline code, dividers and clickable checkboxes",
      "Sticky notes on the HUD in six colours that you can drag, resize and make transparent",
      "Separate notes for each singleplayer world and multiplayer server",
      "Full text editing: selection, clipboard, undo and word navigation",
      "Available in 16 languages, including Belarusian in both Cyrillic and Łacinka",
    ],
    stack: ["Java", "Fabric", "Forge", "NeoForge", "Gradle"],
    links: [
      { kind: "modrinth", label: "Modrinth", href: "https://modrinth.com/mod/notely" },
      { kind: "curseforge", label: "CurseForge", href: "https://www.curseforge.com/minecraft/mc-mods/notely" },
      { kind: "github", label: "Source", href: "https://github.com/Deokma/Notely" },
    ],
    gallery: [
      img("notely-main-notepad-menu", 1280, 661, "The Notely notepad with a list of notes and a Markdown note open in the editor", "Notepad"),
      img("notely-pinned-notes", 1280, 661, "Three sticky notes pinned to the HUD over a Minecraft landscape: coordinates, server rules and a to-do list", "Pinned sticky notes"),
    ],
  },
  {
    id: "moltenvents", cat: "mods", status: "go",
    name: "Create: Molten Vents — Fabric Port", file: "create-molten-vents-fabric",
    icon: "/assets/img/moltenvents-icon.webp",
    lang: "Java", years: "2025", license: "MIT",
    platform: ["Fabric", "MC 1.20.1", "client + server"],
    mr: "molten-vents-fabric-port", repo: "create-molten-vents-fabric",
    blurb: "A Fabric port of Create: Molten Vents, made with the original author's permission: volcanic vents as a renewable source of Create's orestones.",
    about: [
      "Create: Molten Vents, by Apothicon02, adds volcanic vents to the world. Blow up a vent's dormant core to activate it, pour lava onto it and the lava turns into the matching Create orestone, a renewable source of everything those stones process into.",
      "I ported it to Fabric for Minecraft 1.20.1 with the original author's permission. The port is published on Modrinth by Brassburg, a Create Mod SMP I'm a developer for.",
    ],
    features: [
      "Six default vents: Veridium, Asurine, Crimsite, Ochrum, Scorchia and Scoria",
      "Vents generate on the surface and more often underwater (configurable)",
      "Custom vents can be added with a config list and a datapack",
    ],
    stack: ["Java", "Fabric", "Create (Fabric)", "Gradle"],
    links: [
      { kind: "modrinth", label: "Modrinth", href: "https://modrinth.com/mod/molten-vents-fabric-port" },
      { kind: "github", label: "Source", href: "https://github.com/Deokma/create-molten-vents-fabric" },
      { kind: "link", label: "Original mod", href: "https://modrinth.com/mod/create-molten-vents" },
    ],
    gallery: [
      img("moltenvents-dormant-vent", 550, 309, "A dormant molten vent made of dark orestone on the sea floor, surrounded by seagrass", "Dormant vent", false),
    ],
  },
  {
    id: "waystones", cat: "mods", status: "wip",
    name: "Waystones Model Replacer", file: "waystones-model-replacer", emoji: "🗿",
    lang: "Java", years: "2026", license: "MIT",
    platform: ["Fabric", "NeoForge", "MC 1.21.1"],
    repo: "waystones-model-replacer",
    blurb: "A cosmetic addon for Waystones that replaces the waystone model, textures, runes and particles with a new design. Gameplay is unchanged.",
    about: [
      "A visual-only addon for BlayTheNinth's Waystones mod, built for Minecraft 1.21.1 on Fabric and NeoForge. The new model and textures are by Xanth, who also adjusted the hitbox to fit them.",
      "It is still in development and has not been released yet.",
    ],
    stack: ["Java", "Fabric", "NeoForge", "Waystones / Balm API"],
    links: [{ kind: "github", label: "Source", href: "https://github.com/Deokma/waystones-model-replacer" }],
  },
  {
    id: "stardew3d", cat: "mods", status: "wip",
    name: "Stardew Valley 3D", file: "starwdew3d", emoji: "🌱",
    lang: "C#", years: "2026",
    platform: ["SMAPI 4", "Stardew Valley 1.6"],
    blurb: "My rework of PixelReyn's SMAPI mod that renders Stardew Valley in 3D, rebuilding the world as textured 3D geometry from the live game.",
    about: [
      "Stardew Valley 3D, started by PixelReyn, is a SMAPI mod that rebuilds the farm and towns as textured 3D geometry (boxes, planes and billboards) straight from the running game and renders it with MonoGame, with hardware instancing for repeated tiles.",
      "My version adds a location editor (F4) that lists every tile and object type in the current location and lets you change how each one is rendered, and reworks the rendering pipeline and the world builder. It is not published yet.",
    ],
    stack: ["C#", ".NET", "SMAPI", "MonoGame", "HLSL"],
    links: [{ kind: "github", label: "Original by PixelReyn", href: "https://github.com/pixelreyn/starwdew3d" }],
  },
  {
    id: "toolsnweapons", cat: "mods", status: "contrib",
    name: "Create: Tools n Weapons", file: "create-tools-n-weapons",
    icon: "/assets/img/toolsnweapons-icon.webp",
    lang: "Java", years: "2025", license: "MIT",
    platform: ["Fabric", "Forge", "NeoForge", "MC 1.20.1 · 1.21.1"],
    mr: "createtools-n-weapons", repo: "create-tools-n-weapons",
    blurb: "A Create addon with gear-styled tools and weapons, published by the Brassburg team. I wrote its break mode: vein mining and tree felling.",
    about: [
      "Create: Tools n Weapons, started by Tur87 and published by the Brassburg team, adds a Gear Sword, Pickaxe, Axe, Shovel and Hoe in Create's style, crafted on the Mechanical Crafter and slightly stronger than netherite.",
      "I wrote the break mode for the Fabric 1.20.1 version: press V to toggle it, and the Gear Pickaxe mines a whole connected ore vein while the Gear Axe fells the whole tree. The number of blocks is capped in a config file, every block broken costs durability, and a HUD indicator shows when the mode is on.",
    ],
    features: [
      "Break mode toggled with V (rebindable), with a HUD indicator",
      "Gear Pickaxe: mines every connected block of the same ore",
      "Gear Axe: fells every connected log of the tree",
      "Configurable block limit and durability cost per block",
    ],
    stack: ["Java", "Fabric API", "Create (Fabric)"],
    links: [
      { kind: "modrinth", label: "Modrinth", href: "https://modrinth.com/mod/createtools-n-weapons" },
      { kind: "github", label: "Source", href: "https://github.com/Brassburg/create-tools-n-weapons" },
    ],
    gallery: [
      img("toolsnweapons-set", 1280, 673, "The five gear tools (sword, pickaxe, axe, shovel and hoe) displayed on stands", "The gear tool set"),
    ],
  },
  {
    id: "btamap", cat: "mods", status: "contrib",
    name: "BTA Minimap: PNG map export", file: "BTA-Map", emoji: "🗺️",
    lang: "Java", years: "2025",
    repo: "BTA-Map",
    blurb: "Added a PNG map export to my fork of bestsoft100's minimap mod for Better Than Adventure!.",
    about: [
      "BTA Minimap is a minimap mod for Better Than Adventure! by bestsoft100. In my fork I added a full-screen map viewer backed by stored chunk data, which can export the explored map as a PNG image.",
    ],
    stack: ["Java"],
    links: [
      { kind: "github", label: "My fork", href: "https://github.com/Deokma/BTA-Map" },
      { kind: "modrinth", label: "Original mod", href: "https://modrinth.com/mod/bta-minimap" },
    ],
  },
  {
    id: "metro", cat: "tools", status: "wip", statusLabel: "unreleased",
    name: "Minsk Metro", file: "Metro", emoji: "🚇",
    lang: "Kotlin", years: "2026",
    platform: ["Android", "Jetpack Compose"],
    blurb: "An Android app for the Minsk metro: a live map with moving trains, departures, a route planner and travel-card reminders.",
    about: [
      "The metro doesn't publish live train positions, so the app works them out from the official timetables on metropoliten.by: the morning and evening departure PDFs, the daytime interval tables and the end-to-end travel times. A simulator turns them into every run of the day and moves the trains along the map in real time.",
      "Tap a station for the next departures in both directions and the first and last trains, or tap a train for its timetable. The route planner (Connection Scan) counts waiting and transfer time, and the time machine replays any day at ×10 or ×60. Travel cards are checked on metropoliten.by, with reminders before they run out. Russian and Belarusian.",
    ],
    features: [
      "Schematic and real-geography map modes with trains moving in real time",
      "Next departures, first and last trains, and transfers for every station",
      "Station-to-station routes with waiting and transfer time, highlighted on the map",
      "Travel cards checked by number, with expiry and low-balance notifications",
      "Home-screen widget with the next trains from your station",
      "Belarusian public holidays treated as weekends; timetable updated weekly",
    ],
    stack: ["Kotlin", "Jetpack Compose", "Glance", "WorkManager", "PDFBox", "Robolectric"],
    links: [],
    gallery: [
      img("metro-map-route-station", 1280, 720, "Three app screens: the metro map with trains on all three lines, a route from Nemiga to Uruchye, and next departures at Kastrychnitskaya", "Map, route and departures"),
      img("metro-dark-city-be", 1280, 720, "Three app screens: the map in dark mode at night, the real-geography map mode, and a station card in Belarusian", "Dark mode, city map and Belarusian"),
    ],
  },
  {
    id: "brassburgsite", cat: "tools", status: "dead", statusLabel: "draft",
    name: "Brassburg website draft", file: "BrassburgWebSite", emoji: "🌐",
    lang: "HTML + Go", years: "2024",
    blurb: "An early landing page for the Brassburg Create server: server status, a gallery, a trailer and a step-by-step modpack install guide.",
    about: ["A 2024 draft of a landing page for Brassburg, the Create Mod SMP I develop for: server status, gallery, trailer and two ways to install the modpack (Modrinth App or any launcher), set in a Minecraft-style font, with a small Go server to host it."],
    stack: ["HTML", "CSS", "Go"],
    links: [],
  },
  {
    id: "vortex", cat: "tools", status: "wip", statusLabel: "experimental",
    name: "VortexAI Helper", file: "VortexAiHelper", emoji: "🤖",
    lang: "Python", years: "2026",
    repo: "VortexAiHelper",
    blurb: "A desktop helper that learns the repetitive clicks of downloading mods through Vortex Mod Manager and repeats them for you.",
    about: [
      "You record the download sequence once. The helper trains a small scikit-learn neural network (MLPClassifier) on screenshots of each step and uses OpenCV template matching to find the buttons again, then clicks through a single download or keeps looping until you press F8.",
    ],
    features: [
      "Guided training: record each click step by step",
      "Button detection with OpenCV template matching plus the trained model",
      "Single-run and auto-loop modes, stopped with F8 or Esc",
      "Model and training screenshots saved between sessions",
    ],
    stack: ["Python", "OpenCV", "scikit-learn", "PyAutoGUI", "Tkinter"],
    links: [{ kind: "github", label: "Source", href: "https://github.com/Deokma/VortexAiHelper" }],
  },
  {
    id: "ledcontrol", cat: "tools", status: "wip", statusLabel: "prototype",
    name: "LedControl", file: "LedControl", emoji: "💡",
    lang: "Rust + JS", years: "2024",
    repo: "LedControl",
    blurb: "A small Tauri desktop app that finds a Bluetooth Low Energy LED strip, connects to it and sets its colour and brightness.",
    about: ["A Tauri app with a Rust backend that talks to the device over Bluetooth Low Energy (btleplug) and a plain HTML, CSS and JavaScript interface with red, green, blue and brightness controls. An early prototype."],
    stack: ["Rust", "Tauri", "btleplug", "JavaScript"],
    links: [{ kind: "github", label: "Source", href: "https://github.com/Deokma/LedControl" }],
  },
];

export const STATUS_LABEL = { go: "released", wip: "in development", contrib: "contribution", dead: "archived" };

/* ── Download counts ──────────────────────────────────────────────────────*/
export function downloadsOf(p, live) {
  const mr = p.mr ? ((live && live[p.mr]) || STATS.modrinth[p.mr] || {}).downloads || 0 : 0;
  const cf = p.cf ? (STATS.curseforge[p.cf] || {}).downloads || 0 : 0;
  return { mr, cf, total: mr + cf };
}

export const fmtNum = (n) => n.toLocaleString("en-US");
export const fmtShort = (n) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
  : n >= 1e4 ? Math.round(n / 1e3) + "k"
  : n >= 1e3 ? (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k" : String(n);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
export const stampDate = (iso) => iso.split("-").join(" · ");

/* ── Release notes (from Modrinth version history) ───────────────────────*/
const LOADER_NAME = { fabric: "Fabric", forge: "Forge", neoforge: "NeoForge", quilt: "Quilt" };
export const loaderList = (ls) => ls.map((l) => LOADER_NAME[l] || l).join(", ");

export const RELEASES = PROJECTS.filter((p) => p.mr && p.status === "go").flatMap((p) => {
  const rel = STATS.modrinth[p.mr].releases;
  return rel.map((r, i) => ({
    id: `${p.mr}@${r.version}`, project: p, version: r.version,
    date: r.date, last: r.last, loaders: r.loaders, game_versions: r.game_versions,
    changelog: r.changelog, first: i === rel.length - 1,
  }));
}).sort((a, b) => b.date.localeCompare(a.date) || b.version.localeCompare(a.version));

/* ── system.log: latest activity, newest first ───────────────────────────*/
export const ACTIVITY = [
  ...RELEASES.slice(0, 4).map((r) => ({
    ts: r.date, k: "release",
    v: `${r.project.name} ${r.version}`,
    sub: `${loaderList(r.loaders)} · ${r.game_versions.length > 2 ? r.game_versions[0] + "–" + r.game_versions[r.game_versions.length - 1] : r.game_versions.join(", ")}`,
  })),
  { ts: STATS.github["waystones-model-replacer"]?.pushed || "2026-06-12", k: "build", v: "Waystones Model Replacer", sub: "in development" },
].sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 5);

/* ── Links ────────────────────────────────────────────────────────────────*/
export const LINKCATS = [
  { name: "find me", fav: "linear-gradient(135deg,#7c9cff,#c98bff)", links: [
    { t: "GitHub", u: "github.com/Deokma", href: PROFILES.github },
    { t: "Modrinth", u: "modrinth.com/user/Deokma", href: PROFILES.modrinth },
    { t: "CurseForge", u: "curseforge.com/members/deokma", href: PROFILES.curseforge },
    { t: "Discord", u: "username: deokma", copy: "deokma" },
    { t: "Brassburg", u: "the Create Mod SMP I develop for", href: "https://brassburg.se" },
    { t: "Support my mods", u: "donate via PayPal", href: "https://www.paypal.com/donate/?hosted_button_id=93BSWS4G3WWAS" },
  ]},
  { name: "what my mods build on", fav: "linear-gradient(135deg,#ffb14d,#ff7a59)", links: [
    { t: "Create", u: "modrinth.com/mod/create", href: "https://modrinth.com/mod/create" },
    { t: "Charta", u: "card games by lucaargolo", href: "https://modrinth.com/mod/charta" },
    { t: "Create: Numismatics", u: "currency & vendors", href: "https://modrinth.com/mod/numismatics" },
    { t: "Fabric", u: "fabricmc.net", href: "https://fabricmc.net" },
    { t: "NeoForge", u: "neoforged.net", href: "https://neoforged.net" },
    { t: "Crowdin", u: "translate Stock Market (sign-in)", href: "https://crowdin.com/project/create-stock-market" },
  ]},
  { name: "tools i use", fav: "linear-gradient(135deg,#56cf8e,#5ec6ff)", links: [
    { t: "IntelliJ IDEA", u: "jetbrains.com/idea", href: "https://www.jetbrains.com/idea/" },
    { t: "Visual Studio", u: "visualstudio.microsoft.com", href: "https://visualstudio.microsoft.com" },
    { t: "VS Code", u: "code.visualstudio.com", href: "https://code.visualstudio.com" },
    { t: "CMake", u: "cmake.org", href: "https://cmake.org" },
    { t: "Git", u: "git-scm.com", href: "https://git-scm.com" },
    { t: "Obsidian", u: "obsidian.md", href: "https://obsidian.md" },
  ]},
];

// original 88x31 buttons (no real-brand copies)
export const BUTTONS88 = [
  { txt:"DEOKMA OS", bg:"linear-gradient(180deg,#bfe6ff,#3a86d4)", c:"#fff", b:"#1c5fb0" },
  { txt:"MADE WITH <3", bg:"linear-gradient(180deg,#ffd1f0,#e066b0)", c:"#fff", b:"#b03a86" },
  { txt:"FRUTIGER\nAERO 4EVER", bg:"linear-gradient(180deg,#d8f5e0,#2fb39b)", c:"#063", b:"#1c7a6a" },
  { txt:"BEST VIEWED\nWITH WONDER", bg:"#101a3a", c:"#9be8ff", b:"#5fd0ff" },
  { txt:"NO ALGO\nZONE", bg:"linear-gradient(180deg,#fff3c0,#ffb14d)", c:"#7a3d00", b:"#c87a1c" },
  { txt:"POWERED BY\nCAFFEINE", bg:"linear-gradient(180deg,#e9dcc8,#9c7a4f)", c:"#fff", b:"#6a4f2f" },
  { txt:"LINUX\nINSIDE", bg:"linear-gradient(180deg,#cfd8ff,#5a6fe0)", c:"#fff", b:"#3a4ab0" },
  { txt:"KEEP THE\nWEB WEIRD", bg:"linear-gradient(135deg,#c98bff,#5ec6ff)", c:"#fff", b:"#7a3ab0" },
];

/* ── Workshop: 3D printing & electronics (separate page, /workshop/) ──────
   Finished builds only: no schematics, firmware or print files are published. */
export const WORKSHOP = [
  {
    id: "vinyl", status: "go", statusLabel: "built",
    name: "NFC Vinyl Player", file: "nfc-vinyl", years: "2026",
    tagline: "A miniature Technics-style turntable that plays music from NFC-tagged mini records.",
    image: { src: "/assets/img/vinyl-player.webp", small: "/assets/img/vinyl-player-800.webp", w: 1424, h: 882,
             alt: "Render of the NFC vinyl player: a grey deck on a black base with a black record and an orange label on the platter, a red volume knob and a START/STOP button" },
    about: [
      "Put a record on the platter and its track starts. Lift it off and the music pauses; put the same record back and it carries on from the same spot. It runs on its own, with no computer or phone involved.",
      "Each record is a 100 mm printed disc with an NFC tag hidden in its centre, read through 4 mm of plastic platter. A new record is taught its track right on the player: hold START/STOP for three seconds, step to the track and hold again to save.",
    ],
    how: [
      ["Record on the platter", "plays its track, or resumes where it stopped"],
      ["Record lifted off", "pauses after 0.6 s"],
      ["START/STOP", "pause and resume; restarts a finished track"],
      ["Left knob", "volume, capped to protect the small speakers"],
      ["Hold START/STOP 3 s", "assign a track to the record on the platter"],
    ],
    specs: [
      ["Footprint", "180 × 130 mm at the base"],
      ["Records", "Ø 100 mm, 2.4 mm thick, NFC tag inside"],
      ["Sound", "stereo, two side speakers; 3.5 mm output with a speaker cut-off switch"],
      ["Music", "MP3 files on a microSD card"],
      ["Power", "one USB-C cable"],
      ["Case", "3D-printed in matte PLA"],
    ],
    stack: ["Arduino Nano", "RC522 NFC reader", "DFPlayer Mini", "PAM8403 amplifier", "3D-printed case"],
    extras: [
      "A matching comb stand holds ten records, leaned back at 15° (129 × 96 × 18 mm).",
      "Version 2.0 is being designed: all the electronics on a single board and a seamless one-piece case.",
    ],
    credit: "The case is adapted from “Vinyl Record Coaster Turntable Stand” by Fixit7650 on MakerWorld; the electronics, records and firmware are my own.",
  },
];
