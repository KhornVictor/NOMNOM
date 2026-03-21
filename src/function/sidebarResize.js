const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const STORAGE_KEY = "sidebar-width";

export const initSidebarResize = (root = document) => {
  const resizeHandle = root.querySelector("#resize-handle");
  const leftSidebar = root.querySelector("#left-sidebar");

  if (!resizeHandle || !leftSidebar) {
    return;
  }

  // Load saved width from localStorage
  const savedWidth = localStorage.getItem(STORAGE_KEY);
  if (savedWidth) {
    leftSidebar.style.maxWidth = `${savedWidth}px`;
  }

  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  const startResize = (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = leftSidebar.offsetWidth;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const doResize = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    let newWidth = startWidth + deltaX;

    // Constrain width between min and max
    newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));

    leftSidebar.style.maxWidth = `${newWidth}px`;   
  };

  const stopResize = () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "auto";

    // Save width to localStorage
    localStorage.setItem(STORAGE_KEY, leftSidebar.offsetWidth.toString());
  };

  resizeHandle.addEventListener("mousedown", startResize);
  document.addEventListener("mousemove", doResize);
  document.addEventListener("mouseup", stopResize);
};
