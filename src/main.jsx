/* main.jsx — entry point bundled into assets/app.js by scripts/build.mjs */
import React from "react";
import { createRoot } from "react-dom/client";
import Site from "./app.jsx";

document.documentElement.classList.add("js");
createRoot(document.getElementById("root")).render(<Site />);
