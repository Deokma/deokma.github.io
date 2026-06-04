/* icons.jsx — glossy "gel" icons + glyphs for DeokmaOS */

// Simple stroke glyphs (Frutiger-friendly, rounded)
const Glyph = {
  about: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 19.5c.8-3.8 3.6-5.5 7-5.5s6.2 1.7 7 5.5"/></svg>),
  projects: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5 11 7l1.8 2H21v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 7.5V6a1 1 0 0 1 1-1h5.5l1.5 2"/></svg>),
  notes: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5h8.5L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h5"/><path d="M8.5 12.5h7M8.5 16h5"/></svg>),
  links: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 14.5 14.5 9.5"/><path d="M11 7.5 13 5.5a3.7 3.7 0 0 1 5.3 5.3l-2 2"/><path d="M13 16.5 11 18.5a3.7 3.7 0 0 1-5.3-5.3l2-2"/></svg>),
  stuff: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><circle cx="16.5" cy="16.5" r="3.6"/></svg>),
  media: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.4"/><path d="M10.2 8.8 15.4 12l-5.2 3.2z" fill="currentColor" stroke="none"/></svg>),
  computer: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="11" rx="1.6"/><path d="M8.5 19.5h7M12 15.5v4"/></svg>),
  globe: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c2.4 2.3 3.6 5.2 3.6 8.4S14.4 18.1 12 20.4C9.6 18.1 8.4 15.2 8.4 12S9.6 5.9 12 3.6z"/></svg>),
  power: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5v8"/><path d="M6.6 7.2a8 8 0 1 0 10.8 0"/></svg>),
  sound: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9.5h3l4-3.5v12l-4-3.5H5z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>),
  wifi: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5a12 12 0 0 1 16 0"/><path d="M7 13a8 8 0 0 1 10 0"/><path d="M10 16.3a3.5 3.5 0 0 1 4 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>),
  battery: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="16" height="9" rx="2"/><path d="M21 11v3"/><rect x="5" y="10" width="9" height="5" rx="1" fill="currentColor" stroke="none"/></svg>),
};

// Gel icon = glossy rounded badge with a glyph. hue sets the body gradient.
function Gel({ kind, size = "", gel }) {
  return (
    <span className={"gel " + size} style={{ "--gel": gel }}>
      {Glyph[kind] || Glyph.computer}
    </span>
  );
}

Object.assign(window, { Glyph, Gel });
