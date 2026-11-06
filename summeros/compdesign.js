// computational design: a SummerOS folder that opens its own desktop, with an
// impossible-architecture etching tiled as the wallpaper. The folder is empty
// for now. Reuses the dreu folder styles (.dw ...). Opens from /#computational-design.
(() => {
  const IMG = "/index_me_images/web/compdesign/";
  const HASH = "#computational-design";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = window.matchMedia("(min-width: 900px)");

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const folderIco = (src) => `<span class="ico folder">${src ? `<img src="${src}" alt="">` : ""}</span>`;

  function win(id, cls, title, pos, inner, { label } = {}) {
    return `<section class="window ${cls}" id="${id}" tabindex="-1" hidden style="${pos}" aria-label="${esc(label || title)}">
        <header class="titlebar"><h2>${esc(title)}</h2>
          <button type="button" data-a="min" aria-label="Minimize ${esc(title)}">_</button>
          <button type="button" data-a="close" aria-label="Close ${esc(title)}">&times;</button>
        </header>${inner}</section>`;
  }

  function template() {
    const explorer = win("cd-explorer", "cd-explorer", "C:\\summer\\computational_design", "--fx:0.5; --y:40px; --w:clamp(480px, 40vw, 580px)", `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div>
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\computational_design</span></div>
        <div class="pane dw-folder">
          <aside class="dw-webview">
            <span class="big" aria-hidden="true">${folderIco(IMG + "tower.jpg")}</span>
            <h3>computational design</h3><div class="dw-rule"></div>
            <p>Coming soon.</p>
          </aside>
          <p class="cd-empty">This folder is empty.</p>
        </div>
        <div class="statusbar"><span>0 object(s)</span><span>coming soon</span></div>`, { label: "computational design folder" });

    const icons = [
      ["back", folderIco("/index_me_images/web/booth-1.jpg"), "\u2190 back to summer"],
      ["folder", folderIco(IMG + "tower.jpg"), "computational design"],
    ];
    return `
      <div class="dw-wall" aria-hidden="true"></div>
      <ul class="icons" aria-label="computational design desktop">${icons.map(([k, ico, label]) => `<li><button class="icon" type="button" data-icon="${k}">${ico}<span class="label">${esc(label)}</span></button></li>`).join("")}</ul>
      ${explorer}`;
  }

  // ---------- window plumbing (same behavior as the dreu folder) ----------
  let root = null, z = 20, isOpen = false, pushed = false, lastTrigger = null, task = null;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];

  function focusW(w) { w.style.zIndex = ++z; $$(".window").forEach((x) => x.classList.toggle("inactive", x !== w)); }
  function showW(w, moveFocus = true) {
    w.hidden = false; focusW(w);
    if (moveFocus) w.focus({ preventScroll: true });
  }
  function wireWindow(w) {
    w.addEventListener("pointerdown", () => focusW(w));
    // the folder is the whole desktop, so closing or minimizing it goes back to summer
    w.querySelector('[data-a="close"]').addEventListener("click", () => close());
    w.querySelector('[data-a="min"]').addEventListener("click", () => close());
    const bar = w.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (!wide.matches || e.button !== 0 || e.target.closest("button")) return;
      const box = w.getBoundingClientRect(), area = root.getBoundingClientRect();
      const dx = e.clientX - box.left, dy = e.clientY - box.top;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        w.style.left = `${Math.min(Math.max(ev.clientX - area.left - dx, 80 - box.width), area.width - 80)}px`;
        w.style.top = `${Math.min(Math.max(ev.clientY - area.top - dy, 0), area.height - 30)}px`;
      };
      const stop = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", stop); bar.removeEventListener("pointercancel", stop); };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", stop); bar.addEventListener("pointercancel", stop);
    });
  }

  function build() {
    root = document.createElement("div");
    root.className = "dw cd";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "computational design");
    root.innerHTML = template();
    document.body.append(root);
    $$(".window").forEach(wireWindow);
    $$("[data-icon]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.icon === "back") close();
      else showW($("#cd-explorer"));
    }));
    window.addEventListener("resize", () => { if (isOpen) placeOverTaskbar(); });
    root.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      close();
    });
  }

  function placeOverTaskbar() {
    const bar = document.querySelector(".taskbar");
    const r = bar ? bar.getBoundingClientRect() : null;
    if (r && r.top < window.innerHeight / 2) { root.style.top = `${r.bottom}px`; root.style.bottom = "0px"; }
    else { root.style.top = "0px"; root.style.bottom = r ? `${Math.max(0, window.innerHeight - r.top)}px` : "0px"; }
  }

  function addTask() {
    const tasks = document.getElementById("tasks");
    if (!tasks || task) return;
    task = document.createElement("button");
    task.type = "button"; task.className = "task"; task.textContent = "C:\\summer\\computational_design"; task.setAttribute("aria-pressed", "true");
    task.addEventListener("click", () => {
      root.hidden = !root.hidden;
      task.setAttribute("aria-pressed", String(!root.hidden));
      document.documentElement.style.overflow = root.hidden ? "" : "hidden";
    });
    tasks.append(task);
  }

  // the Windows 98 zoom rectangle from the icon to the full desktop
  function zoomFrom(trigger) {
    return new Promise((resolve) => {
      if (reduced || !trigger || !trigger.getBoundingClientRect) { resolve(); return; }
      const a = trigger.getBoundingClientRect(), top = parseFloat(root.style.top) || 0, bottom = parseFloat(root.style.bottom) || 0;
      const b = { left: 0, top, width: window.innerWidth, height: window.innerHeight - top - bottom };
      const zr = document.createElement("div"); zr.className = "dw-zoom"; document.body.append(zr);
      const frame = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      zr.animate([frame(a), frame({ left: b.left + 20, top: b.top + 16, width: b.width - 40, height: b.height - 32 })], { duration: 260, easing: "ease-in" }).onfinish = () => { zr.remove(); resolve(); };
    });
  }

  async function open(trigger) {
    if (!root) build();
    if (task && root.hidden && isOpen) { task.click(); return; }
    if (isOpen) return;
    isOpen = true;
    lastTrigger = trigger || document.activeElement;
    if (typeof window.setStart === "function") window.setStart(false);
    placeOverTaskbar();
    const w = $("#cd-explorer");
    w.hidden = true;
    await zoomFrom(trigger);
    if (!isOpen) return;
    root.hidden = false;
    document.documentElement.style.overflow = "hidden";
    addTask();
    if (location.hash !== HASH) { history.pushState({ cd: 1 }, "", HASH); pushed = true; }
    w.classList.remove("dw-popin"); void w.offsetWidth; w.classList.add("dw-popin");
    showW(w);
  }

  function close(fromHistory) {
    if (!isOpen) return;
    isOpen = false;
    root.hidden = true;
    if (task) { task.remove(); task = null; }
    document.documentElement.style.overflow = "";
    if (lastTrigger && lastTrigger.focus && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
    if (!fromHistory) {
      if (pushed) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    }
    pushed = false;
  }

  window.addEventListener("popstate", () => {
    if (isOpen && location.hash !== HASH) close(true);
    else if (!isOpen && location.hash === HASH) open();
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-compdesign]");
    if (!t || document.body.classList.contains("plain-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    open(t);
  }, true);
  if (location.hash === HASH) open();
  window.computationalDesign = { open, close };
})();
