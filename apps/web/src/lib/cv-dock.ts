export const CV_POINTER_KEY = "garden-cv-pointer-v1";
export const CV_POINTER_MS = 5000;

export function initCvDock() {
  const dock = document.querySelector<HTMLElement>(".chrome-dock");
  const cv = document.querySelector<HTMLAnchorElement>(".cv-download-trigger");
  const pointer = document.querySelector<HTMLElement>(".cv-dock-pointer");
  if (!dock || !cv || cv.hidden || !pointer) return;

  const hide = () => {
    pointer.hidden = true;
    delete dock.dataset.cvPointer;
    try {
      sessionStorage.setItem(CV_POINTER_KEY, "1");
    } catch {
      /* private mode */
    }
  };

  try {
    if (sessionStorage.getItem(CV_POINTER_KEY)) {
      hide();
      return;
    }
  } catch {
    /* show once this page load */
  }

  pointer.hidden = false;
  dock.dataset.cvPointer = "on";
  const timer = window.setTimeout(hide, CV_POINTER_MS);
  const stop = () => {
    window.clearTimeout(timer);
    hide();
  };
  cv.addEventListener("click", stop, { once: true });
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") stop();
    },
    { once: true },
  );
}
