import { rendering, initSidebarNavigation } from "./src/function/Rendering.js";

const main = document.getElementById("main");

const initApp = async () => {
  await rendering("./src/app.html", main);
  initSidebarNavigation(main);
};

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", initApp);
else initApp();
