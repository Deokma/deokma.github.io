# deokma.web

A personal homepage. Static site — plain HTML/CSS with React loaded from a CDN and
JSX transpiled in the browser via Babel Standalone, so there is **no build step**.

## Run locally

Because the page loads `.jsx` files with `fetch`, opening `index.html` directly from
the filesystem (`file://`) won't work — serve it over HTTP:

```sh
# any static server works, e.g.
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. In the repo: **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. The site goes live at `https://<user>.github.io/<repo>/`.

`index.html` is the entry point and `.nojekyll` disables Jekyll so files are served
as-is.

> Note: in-page image editing (`image-slot.js`) only works in the original authoring
> host that provides `window.omelette.writeFile`. On GitHub Pages the page is
> read-only, which is the intended published behavior.
