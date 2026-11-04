// SummerOS screensaver: after 15 seconds with no mouse, keyboard, touch or
// scrolling, the screen goes black and a DVD logo bounces around like on an
// old DVD player. It changes color every time it hits a wall, and celebrates if it
// ever hits a corner exactly. Any movement wakes the page back up.
(() => {
  const IDLE_MS = 15000;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; // a bouncing, color-flashing logo is exactly what reduced motion asks us not to do

  const COLORS = ["#e84a27", "#ff00a8", "#ccff00", "#00ffe1", "#fff600", "#1515ff", "#39ff14"];
  // a DVD-style logo: chunky slanted letters over a flat disc with VIDEO cut out of it
  const LOGO = `<svg viewBox="0 0 240 132" aria-hidden="true">
      <g class="ss-fill" transform="skewX(-14)">
        <text x="134" y="74" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif" font-weight="900" font-size="86" letter-spacing="-4">DVD</text>
      </g>
      <mask id="ss-cut"><rect width="240" height="132" fill="#fff"/><text x="120" y="119" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif" font-weight="900" font-size="19" letter-spacing="3" fill="#000">VIDEO</text></mask>
      <ellipse class="ss-fill" cx="120" cy="112" rx="92" ry="17" mask="url(#ss-cut)"/>
    </svg>`;

  let el = null, logo = null, corner = null;
  let timer = 0, raf = 0, active = false, wakeX = 0, wakeY = 0, swallowClick = false;
  let x = 0, y = 0, vx = 0, vy = 0, last = 0, color = 0;

  function build() {
    el = document.createElement("div");
    el.className = "ss";
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<div class="ss-logo">${LOGO}</div><p class="ss-corner">CORNER!!</p><p class="ss-hint">move the mouse to wake summer.os</p>`;
    document.body.append(el);
    logo = el.querySelector(".ss-logo");
    corner = el.querySelector(".ss-corner");
  }

  function setColor(i) {
    color = i % COLORS.length;
    logo.style.setProperty("--ss-color", COLORS[color]);
  }

  function start() {
    if (active || document.hidden || document.body.classList.contains("plain-mode")) return;
    if (!el) build();
    active = true;
    el.hidden = false;
    el.classList.remove("ss-on");
    requestAnimationFrame(() => el.classList.add("ss-on"));
    const w = logo.offsetWidth, h = logo.offsetHeight;
    x = Math.random() * Math.max(1, innerWidth - w);
    y = Math.random() * Math.max(1, innerHeight - h);
    const speed = Math.max(120, Math.min(innerWidth, innerHeight) * 0.22); // px per second
    const angle = (Math.PI / 4) * (Math.random() < 0.5 ? 1 : 3) + (Math.random() - 0.5) * 0.4;
    vx = Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1);
    vy = Math.sin(angle) * speed;
    setColor(Math.floor(Math.random() * COLORS.length));
    last = performance.now();
    raf = requestAnimationFrame(step);
  }

  function step(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const w = logo.offsetWidth, h = logo.offsetHeight;
    const maxX = innerWidth - w, maxY = innerHeight - h;
    x += vx * dt;
    y += vy * dt;
    let hitX = false, hitY = false;
    if (x <= 0) { x = 0; vx = Math.abs(vx); hitX = true; }
    else if (x >= maxX) { x = maxX; vx = -Math.abs(vx); hitX = true; }
    if (y <= 0) { y = 0; vy = Math.abs(vy); hitY = true; }
    else if (y >= maxY) { y = maxY; vy = -Math.abs(vy); hitY = true; }
    // a "corner" is hitting one wall while already within a few pixels of the other
    const nearX = x <= 4 || x >= maxX - 4, nearY = y <= 4 || y >= maxY - 4;
    if (hitX || hitY) setColor(color + 1 + Math.floor(Math.random() * (COLORS.length - 1)));
    if ((hitX && nearY) || (hitY && nearX)) {
      corner.classList.remove("ss-pop");
      void corner.offsetWidth;
      corner.classList.add("ss-pop");
    }
    logo.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    raf = requestAnimationFrame(step);
  }

  function stop() {
    active = false;
    cancelAnimationFrame(raf);
    if (el) { el.classList.remove("ss-on"); el.hidden = true; }
  }

  function arm() {
    clearTimeout(timer);
    timer = setTimeout(start, IDLE_MS);
  }

  function wake(e) {
    if (active) {
      // ignore tiny mouse jitter so the screensaver doesn't flicker off by itself
      if (e.type === "mousemove") {
        if (!wakeX && !wakeY) { wakeX = e.clientX; wakeY = e.clientY; return; }
        if (Math.hypot(e.clientX - wakeX, e.clientY - wakeY) < 6) return;
      }
      // the click/tap/key that wakes the page shouldn't also press whatever is underneath
      if (e.type !== "mousemove" && e.type !== "scroll" && e.type !== "wheel") {
        e.preventDefault();
        e.stopPropagation();
        swallowClick = true;
        setTimeout(() => { swallowClick = false; }, 600);
      }
      stop();
    }
    wakeX = 0; wakeY = 0;
    arm();
  }

  ["mousemove", "pointerdown", "keydown", "wheel", "touchstart"].forEach((t) =>
    window.addEventListener(t, wake, { capture: true, passive: t === "mousemove" || t === "wheel" }));
  window.addEventListener("scroll", wake, { capture: true, passive: true });
  // swallow the click that follows a waking tap or press
  window.addEventListener("click", (e) => { if (swallowClick) { e.preventDefault(); e.stopPropagation(); swallowClick = false; } }, true);

  document.addEventListener("visibilitychange", () => { if (document.hidden) { stop(); clearTimeout(timer); } else arm(); });
  arm();
  window.summerScreensaver = { start, stop };
})();
