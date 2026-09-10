import {
  readPreferences,
  writePreferences,
  type Preferences,
} from "./preferences";
let preferences = readPreferences();
writePreferences(preferences);
const settings = document.querySelector<HTMLDialogElement>(
  "#experience-settings",
);
const menu = document.querySelector<HTMLDialogElement>("#mobile-menu");
const menuToggle =
  document.querySelector<HTMLButtonElement>("[data-menu-open]");
let restorePageScroll: (() => void) | undefined;

function syncDialogs(scrollPosition = window.scrollY) {
  const open = !!document.querySelector("dialog[open]");
  menuToggle?.setAttribute("aria-expanded", String(!!menu?.open));
  if (open && !restorePageScroll) {
    const y = scrollPosition;
    const body = document.body;
    const saved = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
    };
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add("dialog-open");
    Object.assign(body.style, {
      position: "fixed",
      top: `-${y}px`,
      left: "0",
      right: `${gutter}px`,
    });
    restorePageScroll = () => {
      Object.assign(body.style, saved);
      document.documentElement.classList.remove("dialog-open");
      window.scrollTo({ top: y, behavior: "instant" });
    };
  } else if (!open && restorePageScroll) {
    restorePageScroll();
    restorePageScroll = undefined;
  }
}

function showDialog(dialog: HTMLDialogElement | null) {
  if (!dialog || dialog.open) return;
  const scrollPosition = window.scrollY;
  dialog.showModal();
  syncDialogs(scrollPosition);
  if (dialog === menu && preferences.motion) {
    dialog.animate(
      [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }],
      {
        duration: 280,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
  }
}

function closeDialog(dialog: HTMLDialogElement, animate = true) {
  if (!dialog.open || dialog.dataset.closing) return;
  const finish = () => {
    delete dialog.dataset.closing;
    dialog.close();
    syncDialogs();
  };
  if (dialog === menu && animate && preferences.motion) {
    dialog.dataset.closing = "true";
    const animation = dialog.animate(
      [
        { transform: getComputedStyle(dialog).transform },
        { transform: "translateX(100%)" },
      ],
      { duration: 180, easing: "ease-in", fill: "forwards" },
    );
    void animation.finished.then(() => {
      finish();
      animation.cancel();
    }, finish);
  } else {
    finish();
  }
}
document
  .querySelector("[data-settings-open]")
  ?.addEventListener("click", () => showDialog(settings));
menuToggle?.addEventListener("click", () => showDialog(menu));

matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
  if (event.matches && menu?.open) closeDialog(menu, false);
});
document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog
    .querySelector("[data-dialog-close]")
    ?.addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("close", () => syncDialogs());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        closeDialog(dialog);
    }
  });
  dialog.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      // Restore page scrolling before the browser follows a same-page anchor.
      closeDialog(dialog, false);
    }),
  );
});
(["motion", "sound", "night", "blueprint"] as (keyof Preferences)[]).forEach(
  (key) => {
    const input = document.querySelector<HTMLInputElement>(`#pref-${key}`);
    if (!input) return;
    input.checked = preferences[key];
    input.addEventListener("change", () => {
      preferences = { ...preferences, [key]: input.checked };
      writePreferences(preferences);
      if (key === "sound" && input.checked) ping();
    });
  },
);
let audioContext: AudioContext | undefined;
function ping() {
  try {
    audioContext ||= new AudioContext();
    void audioContext.resume();
    const oscillator = audioContext.createOscillator(),
      gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      780,
      audioContext.currentTime + 0.08,
    );
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.12,
    );
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.13);
  } catch {}
}
document.addEventListener("click", (e) => {
  if (preferences.sound && (e.target as HTMLElement).closest("a,button"))
    ping();
});
const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
mediaQuery.addEventListener("change", (e) => {
  preferences = { ...preferences, motion: !e.matches };
  writePreferences(preferences);
  const input = document.querySelector<HTMLInputElement>("#pref-motion");
  if (input) input.checked = preferences.motion;
});
const timeElement = document.querySelector("[data-local-time]");
function clock() {
  if (timeElement)
    timeElement.textContent =
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Riyadh",
      }).format(new Date()) + " AST";
}
clock();
if (timeElement) setInterval(clock, 60000);
document.querySelectorAll<HTMLElement>("[data-copy]").forEach((button) =>
  button.addEventListener("click", async () => {
    const value =
      button.dataset.copy === "url" ? location.href : button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(value);
      const toast = document.querySelector<HTMLElement>("#toast");
      if (toast) {
        toast.textContent = "Copied to clipboard";
        toast.classList.add("visible");
        setTimeout(() => toast.classList.remove("visible"), 2200);
      }
    } catch {
      button.textContent = value;
    }
  }),
);
document
  .querySelector("[data-print]")
  ?.addEventListener("click", () => window.print());
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    if (menu?.open) closeDialog(menu, false);
    settings?.open ? closeDialog(settings) : showDialog(settings);
  }
});
