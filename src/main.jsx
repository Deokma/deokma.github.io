/* main.jsx — entry point bundled into assets/app.js by scripts/build.mjs.
   Each HTML page names its view in <body data-page="…">. */
import React from "react";
import { createRoot } from "react-dom/client";
import Site from "./app.jsx";
import Workshop from "./workshop.jsx";

const PAGES = { home: Site, workshop: Workshop };
const Page = PAGES[document.body.dataset.page] || Site;

document.documentElement.classList.add("js");
createRoot(document.getElementById("root")).render(<Page />);
