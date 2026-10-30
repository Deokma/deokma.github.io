# deokma.web

My personal homepage at **https://deokma.github.io/**: a Y2K, brushed-steel desktop with my
Minecraft mods, apps and tools, screenshots and release notes, plus a workshop page for
3D printing and electronics builds.

It's a static site: React components written in JSX under `src/`, bundled by esbuild into a
single `assets/app.js` that is committed to the repo, so GitHub Pages serves it as-is
without a build on their side.

## Layout

```
index.html            home page (meta tags, fonts, no-JS fallback)
workshop/index.html   workshop page: 3D printing & electronics
404.html              page shown by GitHub Pages for unknown URLs
site.css              all styles and theme tokens
src/
  main.jsx            entry point; picks the page from <body data-page="…">
  app.jsx             home page: preloader, nav scroll-spy, sections
  workshop.jsx        workshop page (finished builds, no schematics or print files)
  shell.jsx           nav, hero, system.log, taskbar footer
  sections.jsx        projects, project window, gallery, release notes, links
  mediaplayer.jsx     the "now.playing" mod player + visualizer
  data.jsx            ALL site content: projects, workshop builds, links, badges
  data/stats.json     download counts + release history snapshot (generated)
  live.jsx            refreshes Modrinth counts in the browser
assets/
  app.js              build output (do not edit by hand)
  img/                mod icons and screenshots (WebP)
scripts/
  build.mjs           esbuild bundle
  update-stats.mjs    refreshes src/data/stats.json from public APIs
```

## Working on it

Requires Node.js 18 or newer.

```sh
npm install
npm run dev      # http://localhost:8000, rebuilds on save (in memory)
npm run build    # writes assets/app.js; run this before committing
```

### Updating content

- **Projects, links, text**: edit `src/data.jsx`, then `npm run build`.
- **Workshop builds**: add an entry to `WORKSHOP` in `src/data.jsx`. Image paths start with
  `/` because the site has more than one page.
- **A new page**: copy `workshop/index.html`, set its `data-page`, and register the
  component in `PAGES` in `src/main.jsx`.
- **Download counts and release notes**: `npm run stats`, then `npm run build`.
  - Modrinth: official API v2, no key needed. The page also refreshes Modrinth counts
    live in the browser, so those stay current between rebuilds.
  - CurseForge: the official API requires a private key, which must never ship in a public
    repo or in client-side code. The script reads totals from the public
    [CFWidget](https://www.cfwidget.com/) mirror instead, and the page shows them as a
    dated snapshot.
  - GitHub: official REST API. Optional: set `GITHUB_TOKEN` in your shell to avoid the
    60 requests/hour anonymous limit. Never commit a token.
- **Screenshots**: add WebP files to `assets/img/` (a 1280 px wide version plus a
  `-640` thumbnail) and list them in the project's `gallery` in `src/data.jsx`.

## Deploying

GitHub Pages serves the `master` branch from the repository root
(**Settings → Pages → Deploy from a branch**). Commit the rebuilt `assets/app.js`
together with your source changes and push. `.nojekyll` makes Pages serve files as-is.
