// Splice Girl: the live figures in its MATH.md. Every decomposition is the
// hodge() that hodge_toy.exe uses (the same steps as src/hodge.rs, shared by
// splice-world.js), and Fig. 4 redoes the exact permutation test from
// src/permutation.rs on the crate's own synthetic example. No study data.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sg = () => window.spliceGirlFolder;

  // ---------- drawing ----------
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  }
  const html = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  function note(parent, x, y, s, { size = 12, cls = "cd-note", anchor = "start", sub } = {}) {
    const t = el("text", { class: cls, x, y, "font-size": size, "text-anchor": anchor }, parent);
    el("tspan", {}, t).textContent = s;
    if (sub) el("tspan", { "baseline-shift": "sub", "font-size": size * 0.72 }, t).textContent = sub;
    return t;
  }
  function arrow(g, [x1, y1], [x2, y2], cls, w = 2.4, head = 10) {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 0.5) return;
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, h = Math.min(head, L * 0.55);
    const bx = x2 - ux * h, by = y2 - uy * h, k = h * 0.42;
    el("line", { class: cls, x1, y1, x2: bx, y2: by, "stroke-width": w }, g);
    el("polygon", { class: `${cls} sg-head`, points: `${x2},${y2} ${bx - uy * k},${by + ux * k} ${bx + uy * k},${by - ux * k}` }, g);
  }
  const svgPoint = (svg, e) => {
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  };

  // ---------- numbers ----------
  const zero = (x) => (Math.abs(x) < 5e-13 ? 0 : x);
  const fx = (x, d = 4) => { const v = zero(x); return `${v < 0 ? "-" : " "}${Math.abs(v).toFixed(d)}`; };
  const vec = (a, d = 4) => `(${a.map((x) => fx(x, d)).join(", ")})`;
  const int = (x) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(3));
  const ivec = (a) => `(${a.map((x) => int(zero(x))).join(", ")})`;

  // ---------- a figure: toolbar, drawing, MS-DOS readout, caption (as in compdesign's MATH.md) ----------
  const halts = [];
  function frame(fig, { buttons = [], lines = 6, label, viewBox }) {
    const bar = html("div", "cd-fig-bar");
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", label);
    const btn = {}, ctl = {};
    for (const b of buttons) {
      if (b === "|") { bar.appendChild(html("span", "cd-fig-sep")); continue; }
      if (typeof b === "string") { bar.appendChild(html("span", "cd-fig-lbl", b)); continue; }
      if (Array.isArray(b)) {
        btn[b[0]] = Object.assign(html("button", "btn", b[1]), { type: "button" });
        bar.appendChild(btn[b[0]]);
        continue;
      }
      const wrap = html("label", "sg-range");
      const r = Object.assign(document.createElement("input"), { type: "range", min: b.min, max: b.max, step: b.step || 1, value: b.value });
      const o = html("output", "", String(b.value));
      wrap.append(html("span", "", b.label), r, o);
      bar.appendChild(wrap);
      ctl[b.range] = { r, o };
    }
    const box = html("div", "cd-fig-canvas");
    const svg = el("svg", { viewBox, role: "img", "aria-label": label }, box);
    const out = html("pre", "cd-fig-out");
    out.setAttribute("aria-live", "polite");
    out.style.setProperty("--lines", lines);
    const cap = fig.querySelector("figcaption");
    for (const n of [bar, box, out]) fig.insertBefore(n, cap);
    const print = (rows) => out.replaceChildren(...rows.map((r) => {
      const [t, hi] = Array.isArray(r) ? r : [r, false];
      return Object.assign(html("span", hi ? "hi" : ""), { textContent: `${t}\n` });
    }));
    let token = { dead: true };
    const fresh = () => { token.dead = true; token = { dead: false }; return token; };
    halts.push(() => { token.dead = true; });
    return { bar, btn, ctl, box, svg, out, print, fresh };
  }
  const press = (btns, on) => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", String(k === on)));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // the exon-skipping triangle, edges in the crate's sorted order
  const EDGE3 = [["E1", "E2"], ["E1", "E3"], ["E2", "E3"]];
  const NAME3 = ["E1→E2", "E1→E3", "E2→E3"];
  const tri = (c) => sg().hodge(EDGE3.map(([from, to], i) => ({ from, to, count: c[i] })));
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const add = (a, b, k = 1) => a.map((v, i) => v + k * b[i]);
  const scale = (a, k) => a.map((v) => v * k);
  const len = (a) => Math.sqrt(dot(a, a));
  const unit = (a) => { const n = len(a); return n > 1e-12 ? scale(a, 1 / n) : a; };

  const FIG = {};

  // ---------- Fig. 1: edge space. w, its two projections, and the angle between ----------
  FIG.edge = (fig) => {
    const PRE = { tri: [30, 5, 30], eq: [100, 100, 100], zero: [30, 0, 30], agree: [25, 50, 25] };
    const f = frame(fig, {
      label: "Fig. 1, the exon-skipping triangle in edge space", lines: 7, viewBox: "20 0 580 400",
      buttons: [["tri", "30 / 5 / 30"], ["eq", "100 each"], ["zero", "skip = 0"], ["agree", "routes agree"], "|",
        ...NAME3.map((n, i) => ({ range: `c${i}`, label: n, min: 0, max: 100, value: PRE.tri[i] }))],
    });
    const s3 = 1 / Math.sqrt(3), s2 = 1 / Math.sqrt(2), s6 = 1 / Math.sqrt(6);
    const Z = [s3, -s3, s3], G1 = [s2, 0, -s2], G2 = [s6, 2 * s6, s6];   // ker B1, and a basis of im B1^T
    let c = [...PRE.tri], h = tri(c), yaw = 3.93, pitch = 0.4, base = 3.93, auto = !reduced, raf = 0, seen = false;
    const S = 205, CX = 300, CY = 222;
    const P = ([x, y, z]) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = x * cy - y * sy, y1 = x * sy + y * cy;
      return [CX + S * x1, CY - S * (y1 * sp + z * cp)];
    };
    const g = el("g", {}, f.svg);
    let Cy = null;
    const path = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${P(p).map((v) => v.toFixed(1)).join(",")}`).join("") + "Z";

    function draw() {
      g.replaceChildren();
      Cy = h ? h.cycle : null;
      // the gradient plane and the simplex where every normalized sample lives
      const a = 0.6;
      el("path", { class: "sg-plane", d: path([add(scale(G1, a), scale(G2, a)), add(scale(G1, a), scale(G2, -a)), add(scale(G1, -a), scale(G2, -a)), add(scale(G1, -a), scale(G2, a))]) }, g);
      el("path", { class: "sg-simplex", d: path([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) }, g);
      // axes
      for (let i = 0; i < 3; i++) {
        const e = [0, 0, 0]; e[i] = 1;
        el("line", { class: "sg-ax sg-ax-neg", x1: P(scale(e, -0.32))[0], y1: P(scale(e, -0.32))[1], x2: P([0, 0, 0])[0], y2: P([0, 0, 0])[1] }, g);
        arrow(g, P([0, 0, 0]), P(scale(e, 1.04)), "sg-ax", 1, 7);
        const [lx, ly] = P(scale(e, 1.13));
        note(g, lx, ly + 4, NAME3[i], { size: 12, anchor: "middle", cls: "cd-note sg-axl" });
      }
      if (!h) {
        const [m1, m2] = [P(scale(Z, -0.92)), P(scale(Z, 0.92))];
        el("line", { class: "sg-cline", x1: m1[0], y1: m1[1], x2: m2[0], y2: m2[1] }, g);
        note(g, CX, 396, "no reads, nothing to split", { size: 13, anchor: "middle" });
        return;
      }
      const W = h.w, Gr = h.grad;
      // the cycle line ker B1
      const [l1, l2] = [P(scale(Z, -0.92)), P(scale(Z, 0.92))];
      el("line", { class: "sg-cline", x1: l1[0], y1: l1[1], x2: l2[0], y2: l2[1] }, g);
      const pl = P(add(scale(G1, -a), scale(G2, a)));
      note(g, pl[0], pl[1] - 6, "gradients: im B", { size: 12, cls: "cd-note sg-gl", anchor: "middle", sub: "1" }).appendChild(Object.assign(document.createElementNS(NS, "tspan"), { textContent: "ᵀ" }));
      const lc = Cy && dot(Cy, Z) > 0 ? l1 : l2;   // the end w_cycle doesn't point at
      note(g, lc[0] + (lc[0] > CX ? 8 : -8), lc[1] + 14, "cycles: ker B", { size: 12, cls: "cd-note sg-cl", sub: "1", anchor: lc[0] > CX ? "start" : "end" });
      const O = P([0, 0, 0]), pw = P(W), pg = P(Gr), pc = P(Cy);
      // dashed drops: w to each projection, at right angles
      el("line", { class: "sg-drop sg-drop-c", x1: pw[0], y1: pw[1], x2: pg[0], y2: pg[1] }, g);
      el("line", { class: "sg-drop sg-drop-g", x1: pw[0], y1: pw[1], x2: pc[0], y2: pc[1] }, g);
      const corner = (at, u, v) => {
        if (len(u) < 1e-6 || len(v) < 1e-6) return;
        const s = 0.04, U = scale(unit(u), s), V = scale(unit(v), s);
        el("path", { class: "sg-right", d: `M${P(add(at, U)).join(",")}L${P(add(add(at, U), V)).join(",")}L${P(add(at, V)).join(",")}` }, g);
      };
      if (len(Cy) > 1e-4 && len(Gr) > 1e-4) { corner(Gr, Cy, scale(Gr, -1)); corner(Cy, Gr, scale(Cy, -1)); }
      // theta: from w to the cycle line
      const u = unit(W), v0 = len(Cy) > 1e-9 ? unit(Cy) : (dot(u, Z) >= 0 ? Z : scale(Z, -1));
      const arc = [];
      for (let k = 0; k <= 18; k++) arc.push(P(scale(unit(add(scale(u, 1 - k / 18), scale(v0, k / 18))), 0.17)));
      el("polyline", { class: "sg-arc", points: arc.map((p) => p.join(",")).join(" ") }, g);
      const mid = P(scale(unit(add(u, v0)), 0.24));
      note(g, mid[0], mid[1] + 4, "θ", { size: 15, anchor: "middle", cls: "cd-note sg-m" });
      arrow(g, O, pg, "sg-g");
      arrow(g, O, pc, "sg-c");
      arrow(g, O, pw, "sg-w", 2.8, 11);
      const off = (p, q, d = 14) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [q[0] + ((q[0] - p[0]) / L) * d, q[1] + ((q[1] - p[1]) / L) * d + 4]; };
      const [wx, wy] = off(O, pw), [gx, gy] = off(O, pg, 22), [cx, cy] = off(O, pc, 26);
      note(g, wx, wy, "w", { size: 16, anchor: "middle", cls: "cd-note sg-m" });
      if (len(Gr) > 0.02) note(g, gx, gy, "w", { size: 15, anchor: "middle", cls: "cd-note sg-m sg-gl", sub: "grad" });
      if (len(Cy) > 0.02) note(g, cx, cy, "w", { size: 15, anchor: "middle", cls: "cd-note sg-m sg-cl", sub: "cycle" });
      note(g, 30, 22, "drag to turn it", { size: 11, cls: "cd-note sg-hint" });
    }

    function readout() {
      if (!h) {
        f.print(["counts (0, 0, 0): no reads, so there is no flow to split.", "the crate refuses a gene with zero support instead of guessing."]);
        return;
      }
      const tot = c.reduce((s, x) => s + x, 0), th = (Math.acos(Math.min(1, Math.sqrt(h.C))) * 180) / Math.PI;
      const ok = h.checks.every((x) => x[2]);
      f.print([
        `counts (E1->E2, E1->E3, E2->E3) = (${c.join(", ")})    w = c / ${tot}`,
        `phi     = (${h.phi.map((x) => zero(x).toFixed(4)).join(", ")})   heights on E1, E2, E3 (E1 pinned at 0)`,
        `w       = ${vec(h.w)}`,
        `w_grad  = ${vec(h.grad)}   = B1^T phi`,
        `w_cycle = ${vec(h.cycle)}   = ${fx(h.cycle[0])} x (1, -1, 1)`,
        [`C = |w_cycle|^2 / |w|^2 = cos^2(theta) = ${h.C.toFixed(10)}    theta = ${th.toFixed(1)} deg`, true],
        `checks ${ok ? "PASS" : "FAIL"}   ${h.checks.map(([n, x]) => `${n} ${x.toExponential(1)}`).join("   ")}`,
      ]);
    }

    function set(counts, which) {
      c = [...counts]; h = tri(c);
      c.forEach((v, i) => { f.ctl[`c${i}`].r.value = v; f.ctl[`c${i}`].o.textContent = v; });
      press(f.btn, which);
      draw(); readout();
    }
    for (const k of Object.keys(PRE)) f.btn[k].addEventListener("click", () => set(PRE[k], k));
    for (let i = 0; i < 3; i++) f.ctl[`c${i}`].r.addEventListener("input", (e) => { const n = [...c]; n[i] = Number(e.target.value); set(n, null); });

    // turn it by dragging; until then it rocks gently while on screen
    f.svg.classList.add("sg-drag");
    f.svg.addEventListener("pointerdown", (e) => {
      auto = false;
      const x0 = e.clientX, y0 = e.clientY, yw = yaw, pt = pitch;
      f.svg.setPointerCapture(e.pointerId);
      const move = (ev) => {
        yaw = yw - (ev.clientX - x0) * 0.01;
        pitch = Math.max(-1.35, Math.min(1.35, pt + (ev.clientY - y0) * 0.01));
        draw();
      };
      const stop = () => { f.svg.removeEventListener("pointermove", move); f.svg.removeEventListener("pointerup", stop); f.svg.removeEventListener("pointercancel", stop); };
      f.svg.addEventListener("pointermove", move); f.svg.addEventListener("pointerup", stop); f.svg.addEventListener("pointercancel", stop);
    });
    const t0 = performance.now();
    const spin = (now) => {
      raf = 0;
      if (!auto || !seen) return;
      yaw = base + 0.45 * Math.sin((now - t0) / 2600);
      draw();
      raf = requestAnimationFrame(spin);
    };
    // only while it is on screen: a hidden window or a closed desktop stops it
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; if (seen && auto && !raf) raf = requestAnimationFrame(spin); }).observe(f.svg);
    set(PRE.tri, "tri");
  };

  // ---------- Fig. 2: C over every possible exon-skipping sample ----------
  FIG.land = (fig) => {
    const f = frame(fig, {
      label: "Fig. 2, the cycle fraction over every exon-skipping sample", lines: 5, viewBox: "0 0 600 442",
      buttons: [["eq", "100 each"], ["cases", "example cases"], ["ctrl", "example controls"], ["agree", "routes agree"]],
    });
    const A = [90, 392], T = [300, 28.27], B = [510, 392];   // all E1->E2, all on the skip E1->E3, all E2->E3
    const at = ([a, b, c]) => [a * A[0] + b * T[0] + c * B[0], a * A[1] + b * T[1] + c * B[1]];
    const det = (T[1] - B[1]) * (A[0] - B[0]) + (B[0] - T[0]) * (A[1] - B[1]);
    const bary = (x, y) => {
      const a = ((T[1] - B[1]) * (x - B[0]) + (B[0] - T[0]) * (y - B[1])) / det;
      const b = ((B[1] - A[1]) * (x - B[0]) + (A[0] - B[0]) * (y - B[1])) / det;
      return [a, b, 1 - a - b];
    };
    // one loop of length 3, z = (1, -1, 1): C = (z.w)^2 / (3 |w|^2)
    const Cof = ([a, b, c]) => { const s = a * a + b * b + c * c; return s ? (a - b + c) ** 2 / (3 * s) : 0; };

    // the heat map, drawn once
    const k = 2, PW = 420 * k, PH = Math.ceil(363.73 * k);
    const cv = Object.assign(document.createElement("canvas"), { width: PW, height: PH });
    const cx = cv.getContext("2d"), img = cx.createImageData(PW, PH), lvl = new Int16Array(PW * PH).fill(-1);
    for (let py = 0; py < PH; py++) for (let px = 0; px < PW; px++) {
      const w = bary(A[0] + px / k, T[1] + py / k);
      if (Math.min(...w) < -0.001) continue;
      lvl[py * PW + px] = Math.floor(Cof(w) * 10 + 1e-9);
    }
    for (let py = 0; py < PH; py++) for (let px = 0; px < PW; px++) {
      const i = py * PW + px, L = lvl[i];
      if (L < 0) continue;
      const w = bary(A[0] + px / k, T[1] + py / k), t = Math.min(1, Cof(w) / (2 / 3)) ** 0.9;
      let r = 255, gg = 255 + (0 - 255) * t, b = 255 + (168 - 255) * t;
      const edge = (px + 1 < PW && lvl[i + 1] >= 0 && lvl[i + 1] !== L) || (py + 1 < PH && lvl[i + PW] >= 0 && lvl[i + PW] !== L);
      if (edge) { r *= 0.45; gg *= 0.45; b *= 0.45; }
      img.data.set([r, gg, b, 255], i * 4);
    }
    cx.putImageData(img, 0, 0);
    el("image", { href: cv.toDataURL(), x: A[0], y: T[1], width: 420, height: 363.73, preserveAspectRatio: "none" }, f.svg);
    el("path", { class: "sg-tri", d: `M${A}L${T}L${B}Z` }, f.svg);

    // contour labels, along a line from the bottom edge to the top corner
    const along = (s) => { const b = s, a = (1 - s) * 0.28, c = (1 - s) * 0.72; return [a, b, c]; };
    for (const level of [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]) {
      let prev = Cof(along(0));
      for (let s = 0.0025; s <= 1; s += 0.0025) {
        const cur = Cof(along(s));
        if ((prev - level) * (cur - level) <= 0 && prev !== cur) {
          const [x, y] = at(along(s));
          note(f.svg, x + 4, y + 4, level.toFixed(1), { size: 10, cls: "cd-note sg-lvl" });
        }
        prev = cur;
      }
    }
    // the zero line: both routes add up to the same, w(E1->E3) = 1/2
    const z1 = at([0.5, 0.5, 0]), z2 = at([0, 0.5, 0.5]);
    el("line", { class: "sg-zero", x1: z1[0], y1: z1[1], x2: z2[0], y2: z2[1] }, f.svg);
    note(f.svg, z2[0] + 8, z2[1] - 2, "C = 0: both routes", { size: 11.5, cls: "cd-note cd-note-b" });
    note(f.svg, z2[0] + 8, z2[1] + 12, "add up to the same", { size: 11.5, cls: "cd-note cd-note-b" });
    // corners
    note(f.svg, A[0] - 4, A[1] + 20, "all on E1→E2", { size: 11.5, anchor: "middle" });
    note(f.svg, B[0] + 4, B[1] + 20, "all on E2→E3", { size: 11.5, anchor: "middle" });
    note(f.svg, T[0] + 12, T[1] + 6, "all on the skip E1→E3", { size: 11.5 });
    for (const p of [A, B]) note(f.svg, p[0] + (p === A ? -4 : 4), p[1] + 34, "C = 1/3", { size: 10.5, anchor: "middle", cls: "cd-note sg-lvl" });
    note(f.svg, T[0] - 12, T[1] + 6, "C = 1/3", { size: 10.5, anchor: "end", cls: "cd-note sg-lvl" });
    // the crate's synthetic example: TRIANGLE in cases (30, 5, 30) and controls (30, 0, 30)
    const pc = at([6 / 13, 1 / 13, 6 / 13]), pk = at([0.5, 0, 0.5]);
    el("circle", { class: "sg-ex-case", cx: pc[0], cy: pc[1], r: 5.5 }, f.svg);
    el("circle", { class: "sg-ex-ctrl", cx: pk[0], cy: pk[1], r: 5.5 }, f.svg);
    note(f.svg, pc[0] - 10, pc[1] + 4, "example cases: 0.5525", { size: 11, anchor: "end", cls: "cd-note cd-note-b" });
    note(f.svg, pk[0], pk[1] + 22, "example controls: 2/3, the ceiling", { size: 11, anchor: "middle", cls: "cd-note cd-note-b" });
    // you
    const you = el("g", { class: "sg-you" }, f.svg);
    el("circle", { r: 9 }, you);
    el("path", { d: "M-14,0H-5M5,0H14M0,-14V-5M0,5V14" }, you);
    note(f.svg, 14, 22, "click or drag anywhere in the triangle", { size: 11, cls: "cd-note sg-hint" });

    let w = [1 / 3, 1 / 3, 1 / 3];
    function show(which) {
      const [x, y] = at(w);
      you.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      press(f.btn, which);
      const h = sg().hodge(EDGE3.map(([from, to], i) => ({ from, to, count: w[i] })));
      const zw = w[0] - w[1] + w[2], n2 = dot(w, w);
      f.print([
        `w = ${vec(w, 3)}  on (E1->E2, E1->E3, E2->E3)`,
        `routes: E1->E2->E3 adds up to ${(w[0] + w[2]).toFixed(3)}, the skip E1->E3 to ${w[1].toFixed(3)}`,
        `z.w = w(E1->E2) - w(E1->E3) + w(E2->E3) = ${fx(zw, 3).trim()}     |w|^2 = ${n2.toFixed(3)}`,
        [`C = (z.w)^2 / (3 |w|^2) = ${(zw * zw).toFixed(4)} / ${(3 * n2).toFixed(4)} = ${Cof(w).toFixed(4)}    hodge(): ${h ? h.C.toFixed(10) : "-"}`, true],
        "ceiling 2/3 at w = (1/2, 0, 1/2). C = 1 needs a loop the arrows go all the way round.",
      ]);
    }
    const PRE = { eq: [1 / 3, 1 / 3, 1 / 3], cases: [6 / 13, 1 / 13, 6 / 13], ctrl: [0.5, 0, 0.5], agree: [0.25, 0.5, 0.25] };
    for (const key of Object.keys(PRE)) f.btn[key].addEventListener("click", () => { w = [...PRE[key]]; show(key); });
    const pick = (e) => {
      const p = svgPoint(f.svg, e);
      let b = bary(p.x, p.y).map((v) => Math.max(0, v));
      const s = b[0] + b[1] + b[2];
      if (!s) return;
      w = b.map((v) => v / s);
      show(null);
    };
    f.svg.classList.add("sg-pick");
    f.svg.addEventListener("pointerdown", (e) => {
      pick(e);
      f.svg.setPointerCapture(e.pointerId);
      const stop = () => { f.svg.removeEventListener("pointermove", pick); f.svg.removeEventListener("pointerup", stop); };
      f.svg.addEventListener("pointermove", pick); f.svg.addEventListener("pointerup", stop);
    });
    show("eq");
  };

  // ---------- Fig. 3: the two Laplacians, their spectra and their zeros ----------
  function eig(M) {   // Jacobi rotations; the matrices here are tiny and symmetric
    const n = M.length, A = M.map((r) => [...r]);
    for (let sweep = 0; sweep < 80; sweep++) {
      let off = 0;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] ** 2;
      if (off < 1e-24) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-15) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const kp = A[k][p], kq = A[k][q]; A[k][p] = c * kp - s * kq; A[k][q] = s * kp + c * kq; }
        for (let k = 0; k < n; k++) { const pk = A[p][k], qk = A[q][k]; A[p][k] = c * pk - s * qk; A[q][k] = s * pk + c * qk; }
      }
    }
    return A.map((r, i) => (Math.abs(r[i]) < 1e-9 ? 0 : r[i])).sort((a, b) => a - b);
  }
  function topo(raw) {
    const E = raw.map(([a, b]) => [a, b]).sort((x, y) => (x[0] === y[0] ? x[1].localeCompare(y[1]) : x[0].localeCompare(y[0])));
    const V = [...new Set(E.flat())].sort(), n = V.length, m = E.length, ix = new Map(V.map((v, i) => [v, i]));
    const B = V.map(() => new Array(m).fill(0));
    E.forEach(([a, b], j) => { B[ix.get(a)][j] = -1; B[ix.get(b)][j] = 1; });
    const L0 = V.map((_, i) => V.map((_, k) => B[i].reduce((s, x, j) => s + x * B[k][j], 0)));
    const L1 = E.map((_, i) => E.map((_, k) => B.reduce((s, row) => s + row[i] * row[k], 0)));
    // a spanning forest, then one loop per junction left over (the fundamental cycles)
    const adj = V.map(() => []);
    E.forEach(([a, b], j) => { adj[ix.get(a)].push([ix.get(b), j]); adj[ix.get(b)].push([ix.get(a), j]); });
    const par = new Array(n).fill(-1), parE = new Array(n).fill(-1), depth = new Array(n).fill(-1), tree = new Set();
    for (let r = 0; r < n; r++) {
      if (depth[r] >= 0) continue;
      depth[r] = 0;
      const q = [r];
      while (q.length) {
        const v = q.shift();
        for (const [u, j] of adj[v]) if (depth[u] < 0) { depth[u] = depth[v] + 1; par[u] = v; parE[u] = j; tree.add(j); q.push(u); }
      }
    }
    const cycles = [];
    E.forEach(([a, b], j) => {
      if (tree.has(j)) return;
      const z = new Array(m).fill(0);
      z[j] = 1;
      let x = ix.get(b), y = ix.get(a);
      const up = [], down = [];
      while (depth[x] > depth[y]) { up.push(x); x = par[x]; }
      while (depth[y] > depth[x]) { down.push(y); y = par[y]; }
      while (x !== y) { up.push(x); x = par[x]; down.push(y); y = par[y]; }
      for (const u of up) z[parE[u]] += E[parE[u]][0] === V[u] ? 1 : -1;
      for (const u of down) z[parE[u]] += E[parE[u]][1] === V[u] ? 1 : -1;
      const lead = z.find((x) => x !== 0);
      cycles.push(lead < 0 ? z.map((x) => -x || 0) : z);
    });
    const ev0 = eig(L0), ev1 = eig(L1);
    return { V, E, B, ev0, ev1, b0: ev0.filter((x) => x === 0).length, b1: ev1.filter((x) => x === 0).length, cycles };
  }

  FIG.spec = (fig) => {
    const pre = sg().presets;
    const GRAPHS = [
      ["one", "one route", pre[1].edges],
      ["skip", "exon skipping", pre[0].edges],
      ["mxe", "mutually exclusive", pre[2].edges],
      ["two", "two skips", pre[3].edges],
      ["pieces", "two pieces", [["E1", "E2"], ["E2", "E3"], ["E1", "E3"], ["E4", "E5"]]],
    ];
    const f = frame(fig, { label: "Fig. 3, the spectra of the two graph Laplacians", lines: 10, viewBox: "0 0 600 300", buttons: GRAPHS.map(([k, l]) => [k, l]) });
    const ZC = ["sg-z1", "sg-z2"];
    const lam = (x) => 330 + x * 58;

    function draw(key) {
      const [, label, edges] = GRAPHS.find((g) => g[0] === key);
      const t = topo(edges), { V, E } = t;
      press(f.btn, key);
      f.svg.replaceChildren();
      // the graph, exons in order on a line, longer junctions arching higher
      note(f.svg, 16, 26, label, { size: 15, cls: "cd-note sg-m" });
      note(f.svg, 16, 44, `|V| = ${V.length}, |E| = ${E.length}`, { size: 11.5 });
      const gap = Math.min(84, 240 / Math.max(1, V.length - 1)), x0 = 34, y0 = 222;
      const X = new Map(V.map((v, i) => [v, x0 + i * gap]));
      const inLoop = E.map((_, j) => t.cycles.some((z) => z[j] !== 0));
      E.forEach(([a, b], j) => {
        const xa = X.get(a), xb = X.get(b), span = Math.round((xb - xa) / gap);
        const cls = `sg-e${inLoop[j] ? "" : " sg-bridge"}`;
        let mx, my;
        if (span <= 1) {
          arrow(f.svg, [xa + 13, y0], [xb - 13, y0], cls, 1.8, 8);
          mx = (xa + xb) / 2; my = y0 - 9;
        } else {
          const top = y0 - 10 - 34 * span, p0 = [xa + 4, y0 - 10], p2 = [xb - 4, y0 - 10];
          el("path", { class: `${cls} sg-arcpath`, d: `M${p0}Q${(xa + xb) / 2},${top} ${p2}` }, f.svg);
          const ang = Math.atan2(p2[1] - top, p2[0] - (xa + xb) / 2), hx = p2[0], hy = p2[1];
          el("polygon", { class: `${cls} sg-head`, points: `${hx},${hy} ${hx - 9 * Math.cos(ang) + 4 * Math.sin(ang)},${hy - 9 * Math.sin(ang) - 4 * Math.cos(ang)} ${hx - 9 * Math.cos(ang) - 4 * Math.sin(ang)},${hy - 9 * Math.sin(ang) + 4 * Math.cos(ang)}` }, f.svg);
          mx = (xa + xb) / 2; my = (y0 - 10 + top) / 2 - 2;
        }
        t.cycles.slice(0, 2).forEach((z, k) => {
          if (!z[j]) return;
          note(f.svg, mx + (k ? 13 : -13), my, z[j] > 0 ? "+1" : "−1", { size: 11, anchor: "middle", cls: `cd-note cd-note-b ${ZC[k]}` });
        });
      });
      for (const v of V) {
        el("rect", { class: "sg-exon", x: X.get(v) - 13, y: y0 - 10, width: 26, height: 20 }, f.svg);
        note(f.svg, X.get(v), y0 + 4.5, v, { size: 11, anchor: "middle", cls: "sg-exl" });
      }
      note(f.svg, 16, 262, t.cycles.length ? "pink and blue: a basis of ker L" : "no loop: every junction is a bridge", { size: 11, sub: t.cycles.length ? "1" : "" });
      if (t.cycles.length) note(f.svg, 16, 277, "(one loop per junction off a spanning tree)", { size: 11 });

      // the two spectra, on one scale
      const spectrum = (vals, y, title, sub, beta, betaName) => {
        note(f.svg, 316, y - 58, title, { size: 12.5, cls: "cd-note cd-note-b" });
        note(f.svg, 316, y - 43, sub, { size: 11 });
        el("line", { class: "sg-axis", x1: lam(0) - 10, y1: y, x2: lam(4.4), y2: y }, f.svg);
        for (let x = 0; x <= 4; x++) {
          el("line", { class: "sg-axis", x1: lam(x), y1: y, x2: lam(x), y2: y + 4 }, f.svg);
          note(f.svg, lam(x), y + 16, String(x), { size: 10.5, anchor: "middle" });
        }
        const groups = [];
        for (const v of vals) { const gp = groups.find((q) => Math.abs(q[0] - v) < 1e-6); if (gp) gp[1]++; else groups.push([v, 1]); }
        for (const [v, k] of groups) {
          el("line", { class: "sg-stem", x1: lam(v), y1: y, x2: lam(v), y2: y - 12 * k }, f.svg);
          for (let i = 1; i <= k; i++) el("circle", { class: v === 0 ? "sg-ev0" : "sg-ev", cx: lam(v), cy: y - 12 * i, r: 4.6 }, f.svg);
        }
        note(f.svg, lam(0) - 14, y - 4, `${betaName} = ${beta}`, { size: 12, anchor: "end", cls: "cd-note cd-note-b cd-note-pink" });
        return groups;
      };
      const g0 = spectrum(t.ev0, 112, "spectrum of L₀ = B₁B₁ᵀ", "on the exons", t.b0, "β₀");
      const g1 = spectrum(t.ev1, 250, "spectrum of L₁ = B₁ᵀB₁", "on the junctions", t.b1, "β₁");
      // the nonzero eigenvalues are shared
      for (const [v] of g0) if (v !== 0 && g1.some(([u]) => Math.abs(u - v) < 1e-6)) {
        const k1 = g1.find(([u]) => Math.abs(u - v) < 1e-6)[1];
        el("line", { class: "sg-same", x1: lam(v), y1: 122, x2: lam(v), y2: 250 - 12 * k1 - 8 }, f.svg);
      }

      const w = 7, head = `B1    ${E.map(([a, b]) => `${a}->${b}`.padStart(w)).join("")}`;
      const rows = V.map((v, i) => `${v.padEnd(5)} ${t.B[i].map((x) => String(x).padStart(w)).join("")}`);
      const ker = t.cycles.length ? `ker L1 = span{${t.cycles.map(ivec).join(", ")}}: where w_cycle lives` : "ker L1 = {0}: no loop, so C = 0 whatever the counts";
      f.print([
        head, ...rows,
        `spec L0 = B1 B1^T = {${t.ev0.map(int).join(", ")}}`.padEnd(42) + `zeros: beta0 = ${t.b0}`,
        `spec L1 = B1^T B1 = {${t.ev1.map(int).join(", ")}}`.padEnd(42) + `zeros: beta1 = ${t.b1}`,
        [`|V| - |E| = ${V.length} - ${E.length} = ${V.length - E.length} = beta0 - beta1`, true],
        ker,
      ]);
    }
    for (const [k] of GRAPHS) f.btn[k].addEventListener("click", () => draw(k));
    draw("skip");
  };

  // ---------- Fig. 4: the exact null, all 70 ways to pick four cases ----------
  FIG.null = (fig) => {
    // splice-girl example, gene TRIANGLE on the shared graph: S0-S3 are cases
    // (30, 5, 30 reads), S4-S7 controls (30, 0, 30). splice-girl stats prints
    // mean_difference -0.1141552511, extreme_count 2, p_value 0.0285714286.
    const EX = [121 / 219, 121 / 219, 121 / 219, 121 / 219, 2 / 3, 2 / 3, 2 / 3, 2 / 3];
    const SPLITS = [];
    for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = b + 1; c < 8; c++) for (let d = c + 1; d < 8; d++) SPLITS.push([a, b, c, d]);
    const f = frame(fig, {
      label: "Fig. 4, the exact permutation null on the crate's synthetic example", lines: 6, viewBox: "0 0 600 392",
      buttons: [["run", "▶ enumerate all 70"], "|", ["ex", "crate example"], ["same", "no difference"], ["mix", "random values"]],
    });
    let v = [...EX], mode = "ex", showing = SPLITS[0];
    const effect = (vals, s) => { let a = 0, b = 0; vals.forEach((x, i) => { if (s.includes(i)) a += x; else b += x; }); return a / 4 - b / 4; };

    const bx = (i) => 92 + i * 60, base = 176, top = 46, cy = (x) => base - x * (base - top);
    const svg = f.svg;
    note(svg, 16, 22, "cycle fraction C of TRIANGLE in each sample", { size: 12.5, cls: "cd-note cd-note-b" });
    for (const t of [0, 0.5, 1]) {
      el("line", { class: "sg-grid", x1: 66, y1: cy(t), x2: 570, y2: cy(t) }, svg);
      note(svg, 60, cy(t) + 4, String(t), { size: 10.5, anchor: "end" });
    }
    const bars = v.map((_, i) => {
      const g = el("g", { class: "sg-bar" }, svg);
      const r = el("rect", { x: bx(i) - 18, width: 36 }, g);
      const t = note(g, bx(i), 0, "", { size: 10.5, anchor: "middle" });
      note(g, bx(i), base + 15, `S${i}`, { size: 11.5, anchor: "middle", cls: "cd-note cd-note-b" });
      const hit = el("rect", { class: "sg-hit", x: bx(i) - 26, y: top - 14, width: 52, height: base - top + 22 }, g);
      hit.setAttribute("role", "slider");
      hit.setAttribute("aria-label", `C for sample S${i}`);
      return { r, t, hit };
    });
    el("path", { class: "sg-brace", d: `M${bx(0) - 18},${base + 22}v5H${bx(3) + 18}v-5M${bx(4) - 18},${base + 22}v5H${bx(7) + 18}v-5` }, svg);
    note(svg, (bx(0) + bx(3)) / 2, base + 40, "labeled cases", { size: 11, anchor: "middle", cls: "cd-note cd-note-pink" });
    note(svg, (bx(4) + bx(7)) / 2, base + 40, "labeled controls", { size: 11, anchor: "middle" });

    const hy = 372, hTop = 262, hx = (d, R) => 300 + (d / R) * 236;
    note(svg, 16, 246, "mean C(cases) − mean C(controls), for every way to call 4 of the 8 cases", { size: 12.5, cls: "cd-note cd-note-b" });
    const hist = el("g", {}, svg), marks = el("g", {}, svg);
    el("line", { class: "sg-axis", x1: 52, y1: hy, x2: 548, y2: hy }, svg);
    const ticks = el("g", {}, svg);

    function paintBars(split) {
      bars.forEach(({ r, t }, i) => {
        const h = Math.max(0.5, base - cy(v[i]));
        r.setAttribute("y", base - h); r.setAttribute("height", h);
        r.setAttribute("class", split.includes(i) ? "sg-case" : "sg-ctrl");
        t.setAttribute("y", base - h - 5); t.textContent = v[i].toFixed(3);
      });
    }
    function stats() {
      const obs = effect(v, SPLITS[0]), tol = 1e-9 * Math.max(1, Math.abs(obs));
      const all = SPLITS.map((s) => effect(v, s));
      const R = Math.max(1e-9, ...all.map(Math.abs));
      return { obs, tol, all, R, ext: all.map((d) => Math.abs(d) >= Math.abs(obs) - tol) };
    }
    function axis(st) {
      ticks.replaceChildren(); marks.replaceChildren();
      for (const k of [-1, -0.5, 0, 0.5, 1]) {
        el("line", { class: "sg-axis", x1: hx(k * st.R, st.R), y1: hy, x2: hx(k * st.R, st.R), y2: hy + 4 }, ticks);
        note(ticks, hx(k * st.R, st.R), hy + 15, k ? fx(k * st.R, 3).trim() : "0", { size: 10, anchor: "middle" });
      }
      const xo = hx(st.obs, st.R), xm = hx(-st.obs, st.R);
      el("line", { class: "sg-obs", x1: xo, y1: hTop - 2, x2: xo, y2: hy }, marks);
      note(marks, xo + (xo < 300 ? 6 : -6), hTop + 8, `observed ${fx(st.obs, 3).trim()}`, { size: 11, anchor: xo < 300 ? "start" : "end", cls: "cd-note cd-note-b cd-note-pink" });
      if (Math.abs(st.obs) > 1e-12) {
        el("line", { class: "sg-obs sg-mirror", x1: xm, y1: hTop - 2, x2: xm, y2: hy }, marks);
        note(marks, xm + (xm < 300 ? 6 : -6), hTop + 8, "its mirror", { size: 11, anchor: xm < 300 ? "start" : "end", cls: "cd-note cd-note-b cd-note-pink" });
      }
    }
    // stack one brick per split in its bin
    function bricks(st, upto) {
      hist.replaceChildren();
      const bin = (d) => Math.round((d / st.R) * 20), count = new Map();
      for (const d of st.all) count.set(bin(d), (count.get(bin(d)) || 0) + 1);
      const hb = Math.min(10, (hy - hTop - 26) / Math.max(...count.values())), seen = new Map();
      for (let i = 0; i < upto; i++) {
        const b = bin(st.all[i]), k = seen.get(b) || 0;
        seen.set(b, k + 1);
        el("rect", { class: st.ext[i] ? "sg-brick sg-ext" : "sg-brick", x: hx((b / 20) * st.R, st.R) - 5, y: hy - (k + 1) * hb, width: 10, height: Math.max(0.6, hb - (hb > 3 ? 1 : 0.25)) }, hist);
      }
      // how many splits landed in each stack, when there are few enough stacks to read
      if (seen.size <= 11) for (const [b, k] of seen) {
        const ext = Math.abs((b / 20) * st.R) >= Math.abs(st.obs) - st.tol - st.R / 40;
        note(hist, hx((b / 20) * st.R, st.R), hy - k * hb - 4, String(k), { size: 10.5, anchor: "middle", cls: `cd-note cd-note-b${ext ? " cd-note-pink" : ""}` });
      }
    }
    function readout(st, upto, split) {
      const n = st.ext.slice(0, upto).filter(Boolean).length, mc = (a) => a.reduce((s, x) => s + x, 0) / 4;
      const p = n / 70, nm = (s) => s.map((i) => `S${i}`).join(" ");
      const head = mode === "ex" ? "SYNTHETIC: the crate's own example (splice-girl example), not study data"
        : mode === "same" ? "every sample the same: no labeling can tell cases from controls"
        : "your values: S0-S3 are still the labeled cases, S4-S7 the controls";
      const rows = [
        head,
        `cases S0-S3 mean C ${mc(v.slice(0, 4)).toFixed(4)}    controls S4-S7 mean C ${mc(v.slice(4)).toFixed(4)}`,
        upto < 70 ? `split ${upto} of 70: cases {${nm(split)}}   delta ${fx(st.all[upto - 1], 4).trim()}`
          : `observed delta ${fx(st.obs, 4).trim()}    splits enumerated: 70 of 70 = C(8,4)`,
        `as extreme, |delta| >= ${Math.abs(st.obs).toFixed(4)}: ${n} so far${upto === 70 ? ` (${n} of 70)` : ""}`,
      ];
      if (upto === 70) {
        rows[3] = `as extreme, |delta| >= ${Math.abs(st.obs).toFixed(4)}: ${n} of 70${n === 2 ? ", the observed split and its mirror" : ""}`;
        rows.push([`p = ${n}/70 = ${p.toFixed(10)}${mode === "ex" ? "    splice-girl stats printed p_value 0.0285714286" : ""}`, true]);
        rows.push(n === 2 ? "that is the floor: with 4 vs 4, a two-sided p can never be smaller." : "the floor is 2/70: a split and its mirror are always equally extreme.");
      }
      f.print(rows);
    }
    function full() {
      f.fresh();
      const st = stats();
      paintBars(SPLITS[0]); axis(st); bricks(st, 70); readout(st, 70, SPLITS[0]);
      f.btn.run.disabled = false;
    }
    async function run() {
      const tk = f.fresh(), st = stats();
      axis(st);
      f.btn.run.disabled = true;
      for (let i = 1; i <= 70; i++) {
        if (tk.dead) return;
        showing = SPLITS[i - 1];
        paintBars(showing); bricks(st, i); readout(st, i, showing);
        if (!reduced) await wait(i < 6 ? 260 : 55);
      }
      if (tk.dead) return;
      paintBars(SPLITS[0]); readout(st, 70, SPLITS[0]);
      f.btn.run.disabled = false;
    }
    const setVals = (vals, m) => { v = vals; mode = m; press({ ex: f.btn.ex, same: f.btn.same, mix: f.btn.mix }, m); full(); };
    f.btn.run.addEventListener("click", run);
    f.btn.ex.addEventListener("click", () => setVals([...EX], "ex"));
    f.btn.same.addEventListener("click", () => setVals(new Array(8).fill(0.6), "same"));
    f.btn.mix.addEventListener("click", () => setVals(v.map(() => Math.round((0.3 + Math.random() * 0.5) * 1000) / 1000), "mix"));
    // drag a bar to change a sample
    bars.forEach(({ hit }, i) => {
      hit.addEventListener("pointerdown", (e) => {
        const at = (ev) => {
          const p = svgPoint(svg, ev);
          const nv = [...v];
          nv[i] = Math.round(Math.max(0, Math.min(1, (base - p.y) / (base - top))) * 1000) / 1000;
          v = nv; mode = "you"; press({ ex: f.btn.ex, same: f.btn.same, mix: f.btn.mix }, null); full();
        };
        at(e);
        hit.setPointerCapture(e.pointerId);
        const stop = () => { hit.removeEventListener("pointermove", at); hit.removeEventListener("pointerup", stop); };
        hit.addEventListener("pointermove", at); hit.addEventListener("pointerup", stop);
      });
    });
    setVals([...EX], "ex");
  };

  function mount(root) {
    root.querySelectorAll("figure.cd-fig[data-fig]:not([data-ready])").forEach((fig) => {
      fig.dataset.ready = "1";
      try { FIG[fig.dataset.fig]?.(fig); } catch (e) { console.error("figure", fig.dataset.fig, e); }
    });
  }
  window.sgFigures = { mount, stop: () => halts.forEach((h) => h()), _test: { topo, eig, tri } };
})();
