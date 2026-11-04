/* main.jsx — entry point bundled into assets/app.js by scripts/build.mjs.
   Each HTML page names its view in <body data-page="…">. The first render is synchronous,
   so the page is complete in its first frame (and in the snapshot of a view transition
   between places; the script tag is render-blocking where browsers support that). */
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import Site from "./app.jsx";
import Workshop from "./workshop.jsx";
import Ports from "./ports.jsx";

const PAGES = { home: Site, workshop: Workshop, ports: Ports };
const Page = PAGES[document.body.dataset.page] || Site;

document.documentElement.classList.add("js");
const root = createRoot(document.getElementById("root"));
flushSync(() => root.render(<Page />));
