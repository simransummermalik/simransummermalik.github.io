// Judgment Geometry: the live figures in its MATH.md, and the editorial covers
// in its pictures. The covers come from the project's own renderer
// (visualControls in web/render_contract.js and renderLayout in web/app.js),
// so the four corners of a square here are the four covers the study shows.
// The loop arithmetic follows src/judgment_geometry/complex.py.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- the renderer contract, as in web/render_contract.js ----------
  const clamp = (value) => Math.min(1, Math.max(0, Number(value) || 0));
  const fixed = (value) => Number(Number(value).toFixed(6));
  function publicationName(publication, prestige) {
    if (publication === "luxury") return "ÉLAN";
    if (publication === "editorial") return "FORM";
    if (publication === "neutral") return "FIELD NOTES";
    if (prestige > 0.72) return "ÉLAN";
    if (prestige > 0.42) return "FORM";
    return "FIELD NOTES";
  }
  function visualControls(spec = {}, context = {}) {
    const margin = clamp(spec.margin), alignment = clamp(spec.alignment), typeScale = clamp(spec.type_scale);
    const whitespace = clamp(spec.whitespace), density = clamp(spec.density), hierarchy = clamp(spec.hierarchy);
    const imageTextRatio = clamp(spec.image_text_ratio), contrast = clamp(spec.contrast);
    const mastheadPrestige = clamp(context.masthead_prestige), provenancePrestige = clamp(context.provenance_prestige);
    const priceSignal = clamp(context.price_signal), presentationPolish = clamp(context.presentation_polish);
    return {
      publication: publicationName(context.publication, mastheadPrestige),
      textAlign: alignment < 0.333 ? "left" : alignment < 0.666 ? "center" : "right",
      marginCqw: fixed(3.8 + margin * 7.2),
      copyShiftCqw: fixed((alignment - 0.5) * 3.2),
      copyInsetStartCqw: fixed(alignment * 1.8),
      copyInsetEndCqw: fixed((1 - alignment) * 1.8),
      gapCqw: fixed(1.1 + whitespace * 4.4),
      deckLineHeight: fixed(1.08 + whitespace * 0.52),
      titleCqw: fixed(5.4 + typeScale * 7.4 + hierarchy * 1.8),
      titleWeight: Math.round(350 + hierarchy * 350),
      imageSharePercent: fixed(31 + imageTextRatio * 49),
      posterImageBottomCqw: fixed(2.8 + (1 - imageTextRatio) * 12),
      imageScale: fixed(1 + density * 0.08),
      verticalAlign: whitespace > 0.66 ? "center" : "flex-start",
      inkMixAmount: fixed((1 - contrast) * 0.48),
      mastheadSizeCqw: fixed(5.9 + mastheadPrestige * 2.6),
      mastheadWeight: Math.round(380 + mastheadPrestige * 320),
      mastheadTrackingEm: fixed(-0.025 - mastheadPrestige * 0.055),
      provenanceMarkPercent: fixed(14 + provenancePrestige * 78),
      provenanceRuleCqw: fixed(0.08 + provenancePrestige * 0.16),
      provenanceLabel: provenancePrestige > 0.66 ? "Independent research edition" : provenancePrestige > 0.42 ? "Curated visual archive" : "Visual studies",
      priceLabel: `$${Math.round(8 + priceSignal * 44)} / No. 07`,
      paperMixAmount: fixed(0.08 + presentationPolish * 0.86),
      polishKeylineCqw: fixed(0.04 + presentationPolish * 0.16),
    };
  }

  // ---------- one cover, as in renderLayout() in web/app.js ----------
  const COPY = [
    ["The Shape of Quiet", "A study in proportion, material, and measured space.", "Form"],
    ["Objects in Relation", "How structure changes the way an image is read.", "Archive"],
    ["A Different Measure", "Notes on scale, sequence, and visual attention.", "Review"],
    ["Systems of Looking", "An inquiry into order across image and type.", "Research"],
    ["Material Evidence", "Surface, rhythm, and the logic of composition.", "Index"],
    ["The New Structure", "Reading the space between information and form.", "Study"],
  ];
  const PALETTES = [
    ["#d9c9b8", "#6f493b", "#1c1a18", "#d65633"],
    ["#c5d0cc", "#315052", "#171c1d", "#da5c3a"],
    ["#dad6c7", "#65614f", "#161713", "#a2392e"],
    ["#c5c0cd", "#4e435b", "#19151d", "#d38c32"],
    ["#c7d3dc", "#36536a", "#141a1e", "#bf3d31"],
  ];
  function hashString(value) {
    let hash = 2166136261;
    for (const char of String(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
    return hash >>> 0;
  }
  function mixHex(a, b, amount) {
    const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const aa = parse(a), bb = parse(b);
    return `#${aa.map((n, i) => Math.round(n + (bb[i] - n) * amount).toString(16).padStart(2, "0")).join("")}`;
  }
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const html = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };
  // The repo fills the image slot with abstract shapes. Here it holds a real
  // photograph: an evening dress by the House of Worth, ca. 1880, from The
  // Met's open-access collection (CC0, object 157913).
  const PHOTOS = [{ src: "/index_me_images/web/compdesign/jg/gown.jpg", pos: "50% 26%", bg: "#3d1619", alt: "an evening dress by the House of Worth, ca. 1880" }];
  function photo(seed) {
    const p = PHOTOS[seed % PHOTOS.length];
    const img = Object.assign(document.createElement("img"), { src: p.src, alt: "", decoding: "async", draggable: false });
    img.style.setProperty("--photo-pos", p.pos);
    return [img, p];
  }
  // the first anchor the generator makes with the project's seed (layout:0000,
  // seed 20260731), shown in the "editorial" presentation context
  const ANCHOR = {
    layout_id: "layout:0000", content_id: "content:0000", template: "split", domain: "editorial",
    margin: 0.515861622239248, alignment: 0.19601159050232853, type_scale: 0.6687809412277759, whitespace: 0.3429533224778183,
    density: 0.8012424411326069, hierarchy: 0.45591115544943045, image_text_ratio: 0.8152750600834782, contrast: 0.22392725281262382,
  };
  const CONTEXT = { context_id: "context:editorial", publication: "editorial", masthead_prestige: 0.52, provenance_prestige: 0.56, price_signal: 0.48, presentation_polish: 0.62 };
  function cover(target, spec = ANCHOR, context = CONTEXT) {
    target.replaceChildren();
    const ed = html("article", "editorial");
    const template = spec.template.toLowerCase();
    if (template.includes("full") || template.includes("bleed") || template.includes("poster")) ed.classList.add("poster");
    else if (template.includes("column")) ed.classList.add("stack");
    else if (template.includes("asym")) ed.classList.add("image-right");
    const contentSeed = hashString(spec.content_id);
    const copy = COPY[contentSeed % COPY.length], palette = PALETTES[contentSeed % PALETTES.length];
    const c = visualControls(spec, context);
    const set = (k, v) => ed.style.setProperty(k, v);
    set("--ed-paper", mixHex("#dfd9cc", "#fbf8f0", c.paperMixAmount));
    set("--ed-ink", mixHex(palette[2], palette[0], c.inkMixAmount));
    set("--ed-accent", palette[3]);
    set("--ed-margin", `${c.marginCqw}cqw`);
    set("--ed-gap", `${c.gapCqw}cqw`);
    set("--ed-title", `${c.titleCqw}cqw`);
    set("--ed-title-weight", `${c.titleWeight}`);
    set("--image-share", `${c.imageSharePercent}%`);
    set("--poster-image-bottom", `${c.posterImageBottomCqw}cqw`);
    set("--image-scale", `${c.imageScale}`);
    set("--vertical-align", c.verticalAlign);
    set("--copy-shift", `${c.copyShiftCqw}cqw`);
    set("--copy-inset-start", `${c.copyInsetStartCqw}cqw`);
    set("--copy-inset-end", `${c.copyInsetEndCqw}cqw`);
    set("--masthead-size", `${c.mastheadSizeCqw}cqw`);
    set("--masthead-weight", `${c.mastheadWeight}`);
    set("--masthead-tracking", `${c.mastheadTrackingEm}em`);
    set("--provenance-width", `${c.provenanceMarkPercent}%`);
    set("--rail-rule", `${c.provenanceRuleCqw}cqw`);
    set("--polish-keyline", `${c.polishKeylineCqw}cqw`);
    ed.style.textAlign = c.textAlign;
    const rail = html("div", "ed-rail"), provenance = html("span", "ed-provenance", c.provenanceLabel);
    provenance.append(html("span", "ed-provenance-mark"));
    rail.append(provenance, html("span", "", c.priceLabel));
    const body = html("div", "ed-body"), art = html("div", "ed-art"), copyBlock = html("div", "ed-copy");
    const [img, p] = photo(contentSeed);
    art.style.setProperty("--photo-bg", p.bg);
    art.append(img);
    const deck = html("p", "ed-deck", copy[1]);
    deck.style.lineHeight = String(c.deckLineHeight);
    copyBlock.append(html("div", "ed-kicker", copy[2]), html("h2", "ed-headline", copy[0]), deck, html("span", "ed-rule"),
      html("span", "ed-folio", context.provenance_prestige > 0.66 ? "Studio archive · verified edition" : "Composition study"));
    body.append(art, copyBlock);
    ed.append(rail, html("div", "ed-masthead", c.publication), body);
    target.append(ed);
    return ed;
  }

  // ---------- the square: two style moves and four covers ----------
  const DIRS = ["margin", "alignment", "type_scale", "whitespace", "density", "hierarchy", "image_text_ratio", "contrast"];
  const NAMES = { margin: "margin", alignment: "alignment", type_scale: "type scale", whitespace: "whitespace", density: "density", hierarchy: "hierarchy", image_text_ratio: "image/text ratio", contrast: "contrast" };
  // as symmetric_values() in interventions.py: near an edge of [0, 1] both sides shrink together
  const symmetric = (a, d) => { const e = Math.min(d, a, 1 - a); return [a - e, a + e]; };
  const SQ = { i: "margin", j: "whitespace", delta: 0.12 };
  const squareListeners = [];
  function setSquare(change) { Object.assign(SQ, change); squareListeners.forEach((fn) => fn()); }
  function corners(sq = SQ, anchor = ANCHOR) {
    const [i0, i1] = symmetric(anchor[sq.i], sq.delta), [j0, j1] = symmetric(anchor[sq.j], sq.delta);
    const at = (a, b) => ({ ...anchor, [sq.i]: a ? i1 : i0, [sq.j]: b ? j1 : j0 });
    return { "00": at(0, 0), "10": at(1, 0), "01": at(0, 1), "11": at(1, 1) };
  }
  // vertices 00 = x, 10 = Ti x, 01 = Tj x, 11 = TiTj x. Each edge runs from low to
  // high; the face's boundary is +u-bottom +v-right -u-top -v-left (complex.py).
  const V = ["00", "10", "11", "01"];
  const UV = { "00": [0, 0], "10": [1, 0], "11": [1, 1], "01": [0, 1] };
  const EDGES = [
    { id: "ub", tail: "00", head: "10", sign: 1 },
    { id: "vr", tail: "10", head: "11", sign: 1 },
    { id: "ut", tail: "01", head: "11", sign: -1 },
    { id: "vl", tail: "00", head: "01", sign: -1 },
  ];
  const VN = { "00": "x", "10": "Ti x", "01": "Tj x", "11": "TiTj x" };
  const VH = { "00": "<var>x</var>", "10": "<var>T</var><sub>i</sub><var>x</var>", "01": "<var>T</var><sub>j</sub><var>x</var>", "11": "<var>T</var><sub>i</sub><var>T</var><sub>j</sub><var>x</var>" };

  // F = d omega, and the best single score: least squares with x pinned at 0.
  // On one square the residual is F/4 on every edge, with the boundary's signs.
  function project(om) {
    const F = EDGES.reduce((a, e) => a + e.sign * om[e.id], 0);
    const r = {}, star = {};
    for (const e of EDGES) { r[e.id] = (e.sign * F) / 4; star[e.id] = om[e.id] - r[e.id]; }
    const U = { "00": 0, "10": star.ub, "01": star.vl, "11": star.ub + star.vr };
    const total = EDGES.reduce((a, e) => a + om[e.id] ** 2, 0);
    const energy = EDGES.reduce((a, e) => a + r[e.id] ** 2, 0);
    const agree = EDGES.filter((e) => Math.abs(om[e.id]) > 1e-12 && Math.sign(om[e.id]) === Math.sign(star[e.id])).length;
    const decided = EDGES.filter((e) => Math.abs(om[e.id]) > 1e-12).length;
    return { F, r, star, U, total, energy, fraction: total ? energy / total : 0, agree, decided };
  }

  // ---------- numbers ----------
  const zero = (x) => (Math.abs(x) < 5e-12 ? 0 : x);
  const sg = (x, d = 3) => { const v = zero(x); return `${v > 0 ? "+" : v < 0 ? "-" : " "}${Math.abs(v).toFixed(d)}`; };
  const pad = (s, n) => String(s).padEnd(n);
  const sigma = (x) => 1 / (1 + Math.exp(-x));
  const logit = (p) => Math.log(p / (1 - p));

  // ---------- animation ----------
  function tween(ms, fn, token) {
    return new Promise((done) => {
      if (reduced || ms <= 0) { fn(1); done(); return; }
      const t0 = performance.now();
      const tick = (now) => {
        if (token.dead) { done(); return; }
        const k = Math.min(1, (now - t0) / ms);
        fn(k < 0.5 ? 2 * k * k : 1 - (2 - 2 * k) ** 2 / 2);
        if (k < 1) requestAnimationFrame(tick); else done();
      };
      requestAnimationFrame(tick);
    });
  }
  const wait = (ms, token) => tween(ms, () => {}, token);

  // ---------- a figure: toolbar, drawing, MS-DOS readout, caption ----------
  const halts = [];
  function frame(fig, { buttons, lines = 6, label, svg = true }) {
    const bar = html("div", "cd-fig-bar");
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", label);
    const btn = {}, ctl = {};
    for (const b of buttons) {
      if (b === "|") { bar.appendChild(html("span", "cd-fig-sep")); continue; }
      if (typeof b === "string") { const s = html("span", "cd-fig-lbl"); s.innerHTML = b.slice(1); bar.appendChild(s); continue; }
      if (Array.isArray(b)) {
        btn[b[0]] = Object.assign(html("button", "btn", b[1]), { type: "button" });
        bar.appendChild(btn[b[0]]);
      } else if (b.select) {
        const s = html("select", "jg-sel");
        s.setAttribute("aria-label", b.label);
        for (const [v, t] of b.options) s.appendChild(Object.assign(html("option", "", t), { value: v }));
        bar.appendChild((ctl[b.select] = s));
      } else if (b.range) {
        const r = Object.assign(html("input", "jg-range"), { type: "range", min: b.min, max: b.max, step: b.step, value: b.value });
        r.setAttribute("aria-label", b.label);
        bar.appendChild((ctl[b.range] = r));
      }
    }
    const box = html("div", "cd-fig-canvas");
    const s = svg ? el("svg", { role: "img", "aria-label": label }, box) : null;
    const out = html("pre", "cd-fig-out");
    out.setAttribute("aria-live", "polite");
    out.style.setProperty("--lines", lines);
    const cap = fig.querySelector("figcaption");
    for (const n of [bar, box, out]) fig.insertBefore(n, cap);
    let rows = [];
    const draw = () => {
      out.replaceChildren(...rows.map(([t, hi]) => Object.assign(html("span", hi ? "hi" : ""), { textContent: `${t}\n` })));
      out.scrollTop = out.scrollHeight;
    };
    const print = (t, hi = false) => { rows.push([t, hi]); draw(); };
    const clear = () => { rows = []; draw(); };
    let token = { dead: true };
    const fresh = () => { token.dead = true; token = { dead: false }; return token; };
    halts.push(() => { token.dead = true; });
    return { bar, btn, ctl, box, svg: s, out, print, clear, fresh, busy: () => !token.dead };
  }
  const press = (btns, on) => Object.entries(btns).forEach(([k, b]) => b.setAttribute("aria-pressed", String(k === on)));
  function note(parent, x, y, text, size, cls = "cd-note", anchor = "start") {
    const t = el("text", { class: cls, x, y, "font-size": size, "text-anchor": anchor }, parent);
    t.textContent = text;
    return t;
  }
  // a vertex name in the drawing: x, Tix, Tjx, TiTjx, in italics with subscripts
  function vname(parent, x, y, v, size, anchor = "middle", cls = "jg-m") {
    const t = el("text", { class: cls, x, y, "font-size": size, "text-anchor": anchor }, parent);
    const part = (s, sub) => { const p = el("tspan", sub ? { "baseline-shift": "sub", "font-size": size * 0.68 } : {}, t); p.textContent = s; };
    if (v === "10" || v === "11") { part("T"); part("i", true); }
    if (v === "01" || v === "11") { part("T"); part("j", true); }
    part("x");
    return t;
  }

  // ---------- the loop as a stair ----------
  // A staircase runs round the square: a stone landing at each cover, and a
  // flight of steps along each edge that climbs (or drops) by what that edge
  // measured. Three flights end level with the next landing. The fourth comes
  // back to x: if one score explains every edge it lands level too. If not, it
  // arrives exactly F above or below where the walk began, like the stair in
  // Certificate of Nonexistence that comes home 38'-8" up.
  let uid = 0;
  // compact: a small stair with no labels, scale or axes (Fig. 4). hs fixes
  // the height of one logit, so several stairs can share a scale.
  function drawStair(svg, om, { names = [NAMES[SQ.i], NAMES[SQ.j]], compact = false, hs = null } = {}) {
    svg.replaceChildren();
    const fit = project(om);
    const loop = [[EDGES[0], 1], [EDGES[1], 1], [EDGES[2], -1], [EDGES[3], -1]];   // 00 -> 10 -> 11 -> 01 -> 00
    const order = ["00", "10", "11", "01", "00"];
    const H = [0];
    for (const [e, s] of loop) H.push(H[H.length - 1] + s * om[e.id]);
    const F = H[4];

    // a ring of equal stones on a 6 x 6 grid: 4 landings, 4 flights of 4 steps
    const n = 4, t = 1 / (n + 1);
    const stones = [];
    order.slice(0, 4).forEach((v, k) => {
      const [u0, v0] = UV[v], [u1, v1] = UV[order[k + 1]];
      stones.push({ u: u0, v: v0, z: H[k], landing: v });
      for (let s = 1; s <= n; s++) {
        const a = s * t;
        stones.push({ u: u0 + (u1 - u0) * a, v: v0 + (v1 - v0) * a, z: H[k] + ((H[k + 1] - H[k]) * s) / (n + 1), k });
      }
    });
    const tops = [...stones.map((s) => s.z), F];
    const lo = Math.min(...tops), hi = Math.max(...tops), range = Math.max(hi - lo, 0.4);
    // seen from well above, and kept low, so no flight hides another
    const L = 340, AU = [0.9, 0.34], AV = [-0.56, 0.47], Hs = hs ?? Math.min(72, 96 / range);
    const ground = lo - Math.max(0.16 * range, 16 / Hs);
    const P = (u, w, z) => [(u * AU[0] + w * AV[0]) * L, (u * AU[1] + w * AV[1]) * L - (z - ground) * Hs];
    const pts = (list) => list.map((p) => p.map((c) => +c.toFixed(2)).join(",")).join(" ");

    // frame: everything drawn, plus room for the labels
    const xs = [], ys = [];
    for (const s of stones) for (const [du, dv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const top = P(s.u + (du * t) / 2, s.v + (dv * t) / 2, s.z), bot = P(s.u + (du * t) / 2, s.v + (dv * t) / 2, ground);
      xs.push(top[0], bot[0]); ys.push(top[1], bot[1]);
    }
    if (!compact) ys.push(P(0, 0, Math.max(0, F))[1] - 40);
    const [ml, mr, mt, mb] = compact ? [8, 8, 8, 8] : [120, 40, 14, 44];
    const x0 = Math.min(...xs) - ml, x1 = Math.max(...xs) + mr, y0 = Math.min(...ys) - mt, y1 = Math.max(...ys) + mb;
    svg.setAttribute("viewBox", `${x0.toFixed(1)} ${y0.toFixed(1)} ${(x1 - x0).toFixed(1)} ${(y1 - y0).toFixed(1)}`);

    // engraving hatches for the two faces we can see
    const id = `jg-h${uid++}`;
    const defs = el("defs", {}, svg);
    for (const [name, gap, ang] of compact ? [["u", 12, 45], ["v", 7, -45]] : [["u", 5, 45], ["v", 3, -45]]) {
      const p = el("pattern", { id: `${id}${name}`, patternUnits: "userSpaceOnUse", width: gap, height: gap, patternTransform: `rotate(${ang})` }, defs);
      el("line", { x1: 0, y1: 0, x2: 0, y2: gap, class: "jg-hatch" }, p);
    }
    // the floor
    // the floor, and the two moves along its near edges
    const floor = el("g", {}, svg);
    el("polygon", { class: "jg-floor", points: pts([P(-0.2, -0.2, ground), P(1.2, -0.2, ground), P(1.2, 1.2, ground), P(-0.2, 1.2, ground)]) }, floor);
    const deg = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
    const axis = (u, w, text, rot) => {
      const [x, y] = P(u, w, ground);
      note(floor, x, y, text, 13, "cd-note", "middle").setAttribute("transform", `rotate(${rot.toFixed(2)} ${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    // the two moves along the near edges, and a scale: one logit
    if (!compact) {
      axis(0.5, 1.33, `Tᵢ: ${names[0]} →`, deg(...AU));
      axis(1.33, 0.5, `Tⱼ: ${names[1]} →`, deg(...AV) + 180);
      const sx = x0 + 56, sy = P(-0.2, 1.2, ground)[1];
      const scale = el("g", { class: "iso-scale" }, svg);
      el("line", { x1: sx, y1: sy, x2: sx, y2: sy - Hs }, scale);
      el("line", { x1: sx - 5, y1: sy, x2: sx + 5, y2: sy }, scale);
      el("line", { x1: sx - 5, y1: sy - Hs, x2: sx + 5, y2: sy - Hs }, scale);
      note(scale, sx - 9, sy - Hs / 2 + 4, "1 logit", 12, "cd-note", "end");
    }

    // the stones, back to front: the viewer looks along +u, +v from above
    const body = el("g", { class: "jg-stones" }, svg);
    for (const s of [...stones].sort((a, b) => 0.45 * a.u + 0.95 * a.v - (0.45 * b.u + 0.95 * b.v))) {
      const g = el("g", { class: s.landing ? "jg-stone jg-landing" : "jg-stone" }, body);
      const q = (du, dv, z) => P(s.u + (du * t) / 2, s.v + (dv * t) / 2, z);
      for (const [cls, fill, face] of [["jg-fv", "v", [[-1, 1], [1, 1]]], ["jg-fu", "u", [[1, -1], [1, 1]]]]) {
        const [a, b] = face;
        const quad = [q(...a, ground), q(...b, ground), q(...b, s.z), q(...a, s.z)];
        el("polygon", { class: cls, points: pts(quad) }, g);
        el("polygon", { class: "jg-hatched", fill: `url(#${id}${fill})`, points: pts(quad) }, g);
      }
      s.top = el("polygon", { class: "jg-ft", points: pts([q(-1, -1, s.z), q(1, -1, s.z), q(1, 1, s.z), q(-1, 1, s.z)]) }, g);
      if (s.landing && !compact) {
        // in the landing's outer corner, clear of the walk
        const [cu, cv] = UV[s.landing], o = t / 4, [lx, ly] = P(s.u + (cu ? o : -o), s.v + (cv ? o : -o), s.z);
        vname(g, lx, ly + 5, s.landing, 15);
      }
    }

    // the walk: a hop from stone to stone, lighting each tread it lands on.
    // The last hop goes back to x, at the height the fourth flight arrives at.
    const seq = [...stones, { u: 0, v: 0, z: F }];
    const at = (s) => P(s.u, s.v, s.z);
    const marks = el("g", {}, svg);
    const dot = el("circle", { class: "cd-walker", r: 7, cx: -1e6, cy: -1e6 }, svg);
    const home = at(seq[0]), back = at(seq[seq.length - 1]);
    const light = (upto) => stones.forEach((s, i) => s.top.classList.toggle("jg-on", i <= upto));

    function ending() {
      marks.replaceChildren();
      const y = Math.min(home[1], back[1]) - 22;
      if (Math.abs(fit.F) > 5e-12) {
        // where the last flight arrives: a stone that is not there
        const q = (du, dv, z) => P((du * t) / 2, (dv * t) / 2, z);
        el("polygon", { class: "jg-ghost", points: pts([q(-1, -1, F), q(1, -1, F), q(1, 1, F), q(-1, 1, F)]) }, marks);
        for (const c of [[-1, 1], [1, 1], [1, -1]]) {
          const [a, b] = [q(...c, 0), q(...c, F)];
          el("line", { class: "cd-gap", x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, marks);
        }
        if (!compact) note(marks, home[0], y, `comes home F = ${sg(fit.F)}`, 16, "cd-note cd-note-b cd-note-pink", "middle");
      } else {
        if (!compact) note(marks, home[0], y, "comes home level, F = 0", 15, "cd-note cd-note-b jg-blue", "middle");
      }
    }
    function full() {
      // a small stair is shown at rest: no walker, nothing lit
      if (!compact) {
        light(stones.length - 1);
        dot.setAttribute("cx", back[0]); dot.setAttribute("cy", back[1]);
      }
      ending();
    }
    function reset() {
      light(-1); marks.replaceChildren();
      dot.setAttribute("cx", home[0]); dot.setAttribute("cy", home[1]);
    }
    async function walk(token, each = () => {}) {
      reset();
      light(0);
      await wait(250, token);
      for (let i = 1; i < seq.length && !token.dead; i++) {
        const a = at(seq[i - 1]), b = at(seq[i]), lift = 8 + Math.max(0, a[1] - b[1]) * 0.6;
        await tween(150, (f) => {
          dot.setAttribute("cx", a[0] + (b[0] - a[0]) * f);
          dot.setAttribute("cy", a[1] + (b[1] - a[1]) * f - lift * 4 * f * (1 - f));
        }, token);
        if (token.dead) return false;
        if (i < stones.length) light(i);
        if (i % (n + 1) === 0) { each(i / (n + 1) - 1, H[i / (n + 1)]); await wait(160, token); }
      }
      if (token.dead) return false;
      ending();
      return true;
    }
    return { fit, H, full, reset, walk };
  }

  // the four lines the MS-DOS readout prints while the loop is walked
  function walkLine(om, k, total) {
    const rows = [
      ["x", "Ti x", "+w(x, Ti x)", om.ub],
      ["Ti x", "TiTj x", "+w(Ti x, TiTj x)", om.vr],
      ["TiTj x", "Tj x", "-w(Tj x, TiTj x)", -om.ut],
      ["Tj x", "x", "-w(x, Tj x)", -om.vl],
    ];
    const [a, b, w, v] = rows[k];
    return `${pad(a, 6)} -> ${pad(b, 7)}${pad(w, 18)}${sg(v)}   running total ${sg(total)}`;
  }
  const homeLine = (F, who) => (Math.abs(zero(F)) === 0
    ? `comes home level: F = 0.000. One score explains all four edges.`
    : `comes home ${Math.abs(F).toFixed(3)} ${F > 0 ? "higher" : "lower"}: F = ${sg(F)}. No single score gives ${who}.`);

  const FIG = {};

  // ---------- Fig. 1: four covers, one square ----------
  FIG.square = (fig) => {
    const f = frame(fig, {
      label: "Fig. 1, four covers, one square", lines: 8, svg: false,
      buttons: [
        "#<var>T</var><sub>i</sub>", { select: "i", label: "first style move", options: DIRS.map((d) => [d, NAMES[d]]) },
        "#<var>T</var><sub>j</sub>", { select: "j", label: "second style move", options: DIRS.map((d) => [d, NAMES[d]]) },
        ["swap", "Swap"], "|", "#&delta;", ["d12", "0.12"], ["d24", "0.24"],
      ],
    });
    const grid = html("div", "jg-sq");
    f.box.appendChild(grid);
    const cell = {};
    const corner = (v) => {
      const d = html("div", `jg-corner jg-c${v}`);
      const lab = html("p", "jg-vlab"); lab.innerHTML = `${v} &middot; ${VH[v]}`;
      const cov = html("div", "jg-cover"), vals = html("p", "jg-vals");
      d.append(lab, cov, vals);
      cell[v] = { cov, vals };
      return d;
    };
    const arrow = (cls, text) => { const a = html("div", `jg-arr ${cls}`); a.innerHTML = `<span>${text}</span>`; a.setAttribute("aria-hidden", "true"); return a; };
    const Ti = "<var>T</var><sub>i</sub>", Tj = "<var>T</var><sub>j</sub>";
    const mid = html("div", "jg-mid", "↺");
    mid.setAttribute("aria-hidden", "true");
    grid.append(corner("01"), arrow("jg-arr-h", Ti), corner("11"), arrow("jg-arr-v", Tj), mid, arrow("jg-arr-v", Tj), corner("00"), arrow("jg-arr-h", Ti), corner("10"));

    const LABEL = {
      textAlign: ["text alignment", ""], marginCqw: ["padding", " cqw"], copyShiftCqw: ["copy shift", " cqw"], copyInsetStartCqw: ["copy inset", " cqw"],
      gapCqw: ["block gap", " cqw"], deckLineHeight: ["deck line height", ""], titleCqw: ["headline size", " cqw"], titleWeight: ["headline weight", ""],
      imageSharePercent: ["image share", "%"], imageScale: ["image scale", ""], verticalAlign: ["vertical alignment", ""], inkMixAmount: ["ink mix", ""],
    };
    const short = (v) => (typeof v === "number" ? +v.toFixed(3) : v);
    function changes(a, b) {
      const A = visualControls(a, CONTEXT), B = visualControls(b, CONTEXT);
      const list = Object.keys(LABEL).filter((k) => A[k] !== B[k]).map((k) => `${LABEL[k][0]} ${short(A[k])} -> ${short(B[k])}${LABEL[k][1]}`);
      return list.length ? list.slice(0, 2).join(", ") : "nothing visible: the audit would reject this move";
    }
    function render() {
      const C = corners();
      for (const v of V) {
        cover(cell[v].cov, C[v]);
        cell[v].vals.textContent = `${NAMES[SQ.i]} ${C[v][SQ.i].toFixed(2)} · ${NAMES[SQ.j]} ${C[v][SQ.j].toFixed(2)}`;
      }
      f.ctl.i.value = SQ.i; f.ctl.j.value = SQ.j;
      [...f.ctl.i.options].forEach((o) => { o.disabled = o.value === SQ.j; });
      [...f.ctl.j.options].forEach((o) => { o.disabled = o.value === SQ.i; });
      press({ d12: f.btn.d12, d24: f.btn.d24 }, SQ.delta === 0.12 ? "d12" : "d24");
      const ij = { ...C["00"], [SQ.i]: C["10"][SQ.i] }, ji = { ...C["00"], [SQ.j]: C["01"][SQ.j] };
      const same = JSON.stringify(visualControls({ ...ij, [SQ.j]: C["01"][SQ.j] }, CONTEXT)) === JSON.stringify(visualControls({ ...ji, [SQ.i]: C["10"][SQ.i] }, CONTEXT));
      const w = Math.max(NAMES[SQ.i].length, 6);
      f.clear();
      f.print(`square  ${NAMES[SQ.i]} x ${NAMES[SQ.j]} on layout:0000, delta = ${SQ.delta}, context "editorial"`);
      for (const v of V) f.print(`${pad(VN[v], 7)} ${pad(NAMES[SQ.i], w)} ${C[v][SQ.i].toFixed(3)}   ${NAMES[SQ.j]} ${C[v][SQ.j].toFixed(3)}`);
      f.print(`Ti moves ${changes(C["00"], C["10"])}`);
      f.print(`Tj moves ${changes(C["00"], C["01"])}`);
      f.print(same ? "TiTj x = TjTi x: both orders give the same renderer state. Words, image, template stay." : "the two orders disagree: not a square", true);
    }
    f.ctl.i.addEventListener("change", () => setSquare({ i: f.ctl.i.value }));
    f.ctl.j.addEventListener("change", () => setSquare({ j: f.ctl.j.value }));
    f.btn.swap.addEventListener("click", () => setSquare({ i: SQ.j, j: SQ.i }));
    f.btn.d12.addEventListener("click", () => setSquare({ delta: 0.12 }));
    f.btn.d24.addEventListener("click", () => setSquare({ delta: 0.24 }));
    squareListeners.push(render);
    render();
  };

  // ---------- Fig. 2: you are the evaluator ----------
  FIG.judge = (fig) => {
    const f = frame(fig, {
      label: "Fig. 2, judge the square yourself", lines: 9, svg: false,
      buttons: ["#Which is more", ["beautiful", "beautiful"], ["luxurious", "luxurious"], ["timeless", "timeless"], "|", ["again", "Start over"]],
    });
    const crits = { beautiful: f.btn.beautiful, luxurious: f.btn.luxurious, timeless: f.btn.timeless };
    let crit = "beautiful", trials = [], k = 0, wins = {}, asking = false;
    // every edge twice, sides swapped the second time, the repeats later on
    function schedule() {
      const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const first = shuffle(EDGES.map((e) => ({ e, headLeft: Math.random() < 0.5 })));
      const again = shuffle(first.map((t) => ({ e: t.e, headLeft: !t.headLeft })));
      return [...first, ...again];
    }
    function start() {
      f.fresh();
      trials = schedule(); k = 0; wins = { ub: 0, vr: 0, ut: 0, vl: 0 };
      press(crits, crit);
      f.clear();
      f.print(`8 pairs from the square in Fig. 1 (${NAMES[SQ.i]} x ${NAMES[SQ.j]}).`);
      f.print(`Each edge comes up twice, sides swapped. Pick with a click, or 1 and 2.`);
      ask();
    }
    function ask() {
      asking = true;
      const C = corners(), t = trials[k];
      const [L, R] = t.headLeft ? [t.e.head, t.e.tail] : [t.e.tail, t.e.head];
      const wrap = html("div", "jg-ask");
      const q = html("p", "jg-q"); q.innerHTML = `<span>Which composition is more <b>${crit}</b>?</span><span class="jg-n">${k + 1} / 8</span>`;
      const pair = html("div", "jg-pair");
      [[L, "1 · left"], [R, "2 · right"]].forEach(([v, tag]) => {
        const b = Object.assign(html("button", "jg-pick"), { type: "button" });
        b.setAttribute("aria-label", `choose the ${tag.slice(4)} composition`);
        const cov = html("span", "jg-cover");
        cover(cov, C[v]);
        b.append(cov, html("span", "jg-tag", tag));
        b.addEventListener("click", () => pick(v));
        pair.appendChild(b);
      });
      wrap.append(q, pair);
      f.box.replaceChildren(wrap);
    }
    function pick(v) {
      if (!asking) return;
      const t = trials[k];
      if (v === t.e.head) wins[t.e.id]++;
      f.print(`pair ${k + 1} of 8: you chose the ${v === (t.headLeft ? t.e.head : t.e.tail) ? "left" : "right"} one`);
      k++;
      if (k < trials.length) { ask(); fig.querySelector(".jg-pick")?.focus({ preventScroll: true }); return; }
      asking = false;
      result();
    }
    // add half a choice to each side, so 2 of 2 is not infinitely sure
    const pHat = (won) => (won + 0.5) / 3;
    // exact chance: if one consistent taste (the best score) answered twice per
    // edge, how often would the loop come out at least this far from level?
    function chance(F, star) {
      const p = EDGES.map((e) => sigma(star[e.id]));
      const pr = (q, n) => [(1 - q) ** 2, 2 * q * (1 - q), q * q][n];
      let hit = 0;
      for (let m = 0; m < 81; m++) {
        const n = [m % 3, Math.floor(m / 3) % 3, Math.floor(m / 9) % 3, Math.floor(m / 27)];
        const Fm = EDGES.reduce((a, e, i) => a + e.sign * logit(pHat(n[i])), 0);
        if (Math.abs(Fm) >= Math.abs(F) - 1e-9) hit += n.reduce((a, ni, i) => a * pr(p[i], ni), 1);
      }
      return hit;
    }
    async function result() {
      const om = {};
      for (const e of EDGES) om[e.id] = logit(pHat(wins[e.id]));
      const svg = el("svg", { role: "img", "aria-label": "your four answers, walked round the square" });
      f.box.replaceChildren(svg);
      const st = drawStair(svg, om);
      f.clear();
      f.print(`"${crit}"   edge              head won  P (add half)  w = logit P`);
      const rowName = { ub: "x    -> Ti x  ", vr: "Ti x -> TiTj x", ut: "Tj x -> TiTj x", vl: "x    -> Tj x  " };
      for (const e of EDGES) f.print(`          ${rowName[e.id]}    ${wins[e.id]} of 2     ${pHat(wins[e.id]).toFixed(3)}      ${sg(om[e.id])}`);
      const token = f.fresh();
      const ok = await st.walk(token, (i, total) => f.print(walkLine(om, i, total)));
      if (!ok) { st.full(); }
      const fit = st.fit;
      f.print(homeLine(fit.F, "all four of your answers"), true);
      if (Math.abs(zero(fit.F)) > 0) {
        f.print(`best single score, from x: ${V.map((v) => `${VN[v]} ${sg(fit.U[v], 2)}`).join("  ")}`);
        f.print(`it agrees with ${fit.agree} of your ${fit.decided} decided edges, and still has no loop.`);
        f.print(`chance: one consistent taste, asked twice per edge, loops this far ${Math.round(chance(fit.F, fit.star) * 100)}% of the time.`);
        f.print("so 8 clicks are not a finding. The study repeats every edge, for every person.");
      }
    }
    for (const [name, b] of Object.entries(crits)) b.addEventListener("click", () => { crit = name; start(); });
    f.btn.again.addEventListener("click", start);
    fig.addEventListener("keydown", (e) => {
      if (!asking || !["1", "2"].includes(e.key)) return;
      e.preventDefault();
      fig.querySelectorAll(".jg-pick")[Number(e.key) - 1]?.click();
    });
    squareListeners.push(start);
    start();
  };

  // ---------- Fig. 3: interaction is not circulation ----------
  // the curvature demo's square: margin x contrast on layout:0000, delta 0.12
  const DEMO = corners({ i: "margin", j: "contrast", delta: 0.12 });
  FIG.curl = (fig) => {
    const f = frame(fig, {
      label: "Fig. 3, the curvature demo, live", lines: 10,
      buttons: [["a", "Case A"], ["b", "Case B"], "|", "#interaction &gamma;", { range: "g", min: 0, max: 6, step: 0.05, value: 2.4, label: "interaction" },
        "#nudge one edge", { range: "n", min: -1, max: 1, step: 0.05, value: 0, label: "nudge" }, "|", ["walk", "▶ Walk the loop"]],
    });
    const U = (s, g) => { const x = s.margin, y = s.contrast; return 1.25 * x - 0.75 * y + g * x * y + 0.8 * x * x * y; };
    let st = null, om = null;
    function field() {
      const g = Number(f.ctl.g.value), n = Number(f.ctl.n.value);
      om = {};
      for (const e of EDGES) om[e.id] = U(DEMO[e.head], g) - U(DEMO[e.tail], g);
      om.ub += n;        // the demo perturbs the first edge by id: u-bottom
      const mixed = U(DEMO["11"], g) - U(DEMO["10"], g) - U(DEMO["01"], g) + U(DEMO["00"], g);
      return { g, n, mixed };
    }
    function summary({ g, n, mixed }) {
      const fit = st.fit;
      f.print(`U(x,y) = 1.25x - 0.75y + ${g.toFixed(2)}xy + 0.80x^2y   x = margin, y = contrast${n ? `, u-bottom ${sg(n, 2)}` : ""}`);
      f.print(`mixed difference  DiDjU = ${zero(mixed).toFixed(10)}   ${Math.abs(mixed) > 1e-9 ? "the interaction is real" : "no interaction"}`);
      f.print(`circulation       F = dw = ${sg(fit.F, 10).trim()}   ${Math.abs(zero(fit.F)) ? "the loop does not close" : "the loop still closes"}`, true);
      f.print(`residual energy   ${zero(fit.energy).toFixed(10)}   fraction ${zero(fit.fraction).toFixed(10)}`);
      if (Math.abs(zero(fit.F)) > 0) f.print(`the best score still picks the winner on ${fit.agree} of ${fit.decided} edges: right answers, wrong geometry.`, true);
    }
    function draw(animate = false) {
      const g = Number(f.ctl.g.value), n = Number(f.ctl.n.value);
      press({ a: f.btn.a, b: f.btn.b }, Math.abs(g - 2.4) < 1e-9 ? (n === 0 ? "a" : n === 0.5 ? "b" : "") : "");
      const info = field();
      st = drawStair(f.svg, om, { names: ["margin", "contrast"] });
      f.clear();
      if (!animate) { st.full(); summary(info); return; }
      f.btn.walk.disabled = true;
      const token = f.fresh();
      st.walk(token, (i, total) => f.print(walkLine(om, i, total))).then((ok) => {
        f.btn.walk.disabled = false;
        if (!ok) return;
        f.print(homeLine(st.fit.F, "these four edges"), true);
        summary(info);
      });
    }
    const set = (g, n) => { f.fresh(); f.btn.walk.disabled = false; f.ctl.g.value = g; f.ctl.n.value = n; draw(true); };
    f.btn.a.addEventListener("click", () => set(2.4, 0));
    f.btn.b.addEventListener("click", () => set(2.4, 0.5));
    f.ctl.g.addEventListener("input", () => { f.fresh(); f.btn.walk.disabled = false; draw(); });
    f.ctl.n.addEventListener("input", () => { f.fresh(); f.btn.walk.disabled = false; draw(); });
    f.btn.walk.addEventListener("click", () => draw(true));
    draw();
  };

  // ---------- Fig. 4: pooling can make a loop nobody has ----------
  FIG.pool = (fig) => {
    const f = frame(fig, {
      label: "Fig. 4, three consistent people, pooled", lines: 8, svg: false,
      buttons: [["three", "Three people"], ["random", "New people"], ["same", "One person, three times"]],
    });
    // each person has one score per cover; higher wins more often
    const PRESET = [
      { "00": 0, "10": 1.5, "11": 3, "01": 4.5 },
      { "00": 1.5, "10": 3, "11": 4.5, "01": 0 },
      { "00": 3, "10": 4.5, "11": 0, "01": 1.5 },
    ];
    const rank = (U) => [...V].sort((a, b) => U[b] - U[a]).map((v) => VN[v]).join(" > ");
    // three small stairs, one per person, on one scale; the pooled stair below
    const wrap = html("div", "jg-pool"), row = html("div", "jg-people");
    const solo = [0, 1, 2].map((n) => {
      const d = html("div", "jg-person"), s = el("svg", { role: "img", "aria-label": `person ${n + 1}'s stair` }, d), cap = html("p", "jg-who");
      d.appendChild(cap);
      row.appendChild(d);
      return { s, cap };
    });
    const big = el("svg", { role: "img", "aria-label": "everyone's choices pooled, walked round the square" });
    const bigBox = html("div", "jg-pooled");
    bigBox.appendChild(big);
    wrap.append(row, html("p", "jg-pool-arrow", "average their choices, then take logits ↓"), bigBox);
    f.box.appendChild(wrap);
    function draw(people, animate) {
      const P = (e) => people.reduce((a, U) => a + sigma(U[e.head] - U[e.tail]), 0) / people.length;
      const om = {};
      for (const e of EDGES) om[e.id] = logit(P(e));
      const lift = (U) => V.map((v) => U[v] - U["00"]);
      const hs = Math.min(72, 96 / Math.max(0.4, ...people.map((U) => Math.max(...lift(U)) - Math.min(...lift(U)))));
      people.forEach((U, n) => {
        const w = {};
        for (const e of EDGES) w[e.id] = U[e.head] - U[e.tail];
        drawStair(solo[n].s, w, { compact: true, hs }).full();
        solo[n].cap.innerHTML = `person ${n + 1}: <b>F = 0</b>`;
      });
      const st = drawStair(big, om, { names: ["first move", "second move"] });
      const F = st.fit.F;
      f.clear();
      people.forEach((U, n) => f.print(`person ${n + 1}  ${rank(U)}   one score, so F = 0.000`));
      f.print(`pooled    P(head wins) = ${EDGES.map((e) => P(e).toFixed(3)).join("  ")}`);
      f.print(`pooled    w = logit P  = ${EDGES.map((e) => sg(om[e.id])).join(" ")}`);
      f.print(`pooled    F = dw       = ${sg(F)}`, true);
      f.print(Math.abs(F) > 1e-9 ? "Nobody in the room has a loop. The room does." : "Same taste three times: pooling adds nothing, and nothing circulates.", true);
      f.print("So the study estimates each person first, and pools second.");
      if (animate) st.walk(f.fresh()); else st.full();
    }
    let seed = 1;
    const rnd = () => { let t = (seed += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const someone = () => Object.fromEntries(V.map((v) => [v, Math.round((rnd() * 8 - 4) * 2) / 2]));
    f.btn.three.addEventListener("click", () => { press(f.btn, "three"); draw(PRESET, true); });
    f.btn.random.addEventListener("click", () => { press(f.btn, "random"); seed = (Math.random() * 1e9) | 0; draw([someone(), someone(), someone()], true); });
    f.btn.same.addEventListener("click", () => { press(f.btn, "same"); seed = (Math.random() * 1e9) | 0; const one = someone(); draw([one, { ...one }, { ...one }], true); });
    press(f.btn, "three");
    draw(PRESET, false);
  };

  // ---------- Fig. 5: every pair of moves, one matrix ----------
  FIG.matrix = (fig) => {
    const f = frame(fig, {
      label: "Fig. 5, the judgment 2-form as a wedge of two tensions", lines: 4,
      buttons: [["random", "New tension"], ["swap", "Swap a ↔ b"], ["reset", "Reset"], "|", "#drag the bars"],
    });
    const LET = ["M", "A", "T", "W", "D", "H", "I", "C"];
    const A0 = [0.8, 0.1, 0.0, 0.6, -0.2, 0.0, 0.1, -0.1], B0 = [0.0, -0.1, 0.5, 0.1, 0.2, 0.7, -0.3, 0.3];
    let a = [...A0], b = [...B0], point = null;
    const n = 8, cs = 46, ox = 120, oy = 40, barH = 84, gapB = 22;
    const svg = f.svg;
    svg.setAttribute("viewBox", `0 0 ${ox + n * cs + 40} ${oy + n * cs + 2 * (barH + gapB) + 20}`);
    const Fij = (i, j) => a[i] * b[j] - a[j] * b[i];
    const g = el("g", {}, svg), cells = [];
    LET.forEach((L, k) => {
      note(g, ox + k * cs + cs / 2, oy - 10, L, 14, "cd-note cd-note-b", "middle");
      note(g, ox - 10, oy + k * cs + cs / 2 + 5, `${NAMES[DIRS[k]]} ${L}`, 12, "cd-note", "end");
    });
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const c = el("g", { class: "jg-cell", tabindex: i === j ? null : 0, role: i === j ? null : "button" }, g);
      const r = el("rect", { x: ox + j * cs, y: oy + i * cs, width: cs, height: cs }, c);
      const t = note(c, ox + j * cs + cs / 2, oy + i * cs + cs / 2 + 5, "", 12, "jg-cell-t", "middle");
      if (i !== j) {
        c.setAttribute("aria-label", `${NAMES[DIRS[i]]} then ${NAMES[DIRS[j]]}`);
        const go = () => { point = [i, j]; paint(); };
        c.addEventListener("pointerenter", go); c.addEventListener("focus", go); c.addEventListener("click", go);
      }
      cells.push({ i, j, r, t, c });
    }
    const outline = el("g", { class: "jg-outline" }, g);
    // the two vectors, one bar per direction, under the columns they feed
    const rows = [["a", () => a, (v) => { a = v; }], ["b", () => b, (v) => { b = v; }]].map(([name, get, put], row) => {
      const y0 = oy + n * cs + gapB + row * (barH + gapB), mid = y0 + barH / 2;
      const rg = el("g", { class: "jg-bars" }, svg);
      note(rg, ox - 14, mid + 6, name, 18, "jg-m", "end");
      el("line", { class: "jg-zero", x1: ox, y1: mid, x2: ox + n * cs, y2: mid }, rg);
      const bars = LET.map((_, k) => {
        const hit = el("rect", { class: "jg-hit", x: ox + k * cs + 2, y: y0, width: cs - 4, height: barH, tabindex: 0, role: "slider", "aria-label": `${name}, ${NAMES[DIRS[k]]}`, "aria-valuemin": -1, "aria-valuemax": 1 }, rg);
        const bar = el("rect", { class: `jg-bar jg-bar-${name}`, x: ox + k * cs + 9, width: cs - 18 }, rg);
        const setFrom = (y) => { const v = get().slice(); v[k] = Math.max(-1, Math.min(1, Math.round(((mid - y) / (barH / 2)) * 20) / 20)); put(v); point = null; paint(); };
        const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()).y; };
        hit.addEventListener("pointerdown", (e) => { hit.setPointerCapture(e.pointerId); setFrom(toSvg(e)); });
        hit.addEventListener("pointermove", (e) => { if (hit.hasPointerCapture(e.pointerId)) setFrom(toSvg(e)); });
        hit.addEventListener("keydown", (e) => {
          const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 }[e.key];
          if (!step) return;
          e.preventDefault();
          const v = get().slice(); v[k] = Math.max(-1, Math.min(1, Math.round((v[k] + step) * 20) / 20)); put(v); point = null; paint();
        });
        return { bar, hit, mid };
      });
      return { bars, get };
    });
    const color = (v) => {
      const k = Math.min(1, Math.abs(v) / 0.8), to = v > 0 ? [255, 0, 168] : [21, 21, 255];
      return `rgb(${to.map((c) => Math.round(255 + (c - 255) * k)).join(",")})`;
    };
    function paint() {
      let best = [0, 1], norm = 0;
      for (const { i, j, r, t } of cells) {
        const v = i === j ? 0 : Fij(i, j);
        norm += v * v;
        if (i < j && Math.abs(v) > Math.abs(Fij(...best))) best = [i, j];
        r.setAttribute("fill", i === j ? "#e4e4e0" : color(v));
        t.textContent = i === j ? "0" : Math.abs(v) < 0.005 ? "0" : `${v > 0 ? "+" : "-"}${Math.abs(v).toFixed(2).replace(/^0/, "")}`;
        t.setAttribute("class", `jg-cell-t${Math.abs(v) > 0.45 ? " on" : ""}`);
      }
      for (const { bars, get } of rows) bars.forEach(({ bar, hit, mid }, k) => {
        const v = get()[k], h = (Math.abs(v) * barH) / 2;
        bar.setAttribute("y", v >= 0 ? mid - h : mid);
        bar.setAttribute("height", Math.max(h, 0.5));
        hit.setAttribute("aria-valuenow", v);
      });
      const [i, j] = point || best;
      outline.replaceChildren();
      for (const [r, c] of [[i, j], [j, i]]) el("rect", { x: ox + c * cs + 1, y: oy + r * cs + 1, width: cs - 2, height: cs - 2 }, outline);
      const nm = (k) => NAMES[DIRS[k]];
      const [bi, bj] = best;
      f.clear();
      f.print(`F = a ^ b     F[i][j] = a_i b_j - a_j b_i     |F| (Frobenius) = ${Math.sqrt(norm).toFixed(3)}`);
      f.print(`largest loop: ${nm(bi)} x ${nm(bj)} = ${sg(Fij(bi, bj))}   and ${nm(bj)} x ${nm(bi)} = ${sg(Fij(bj, bi))}`);
      f.print(`F[${nm(i)}][${nm(j)}] = (${a[i].toFixed(2)})(${b[j].toFixed(2)}) - (${a[j].toFixed(2)})(${b[i].toFixed(2)}) = ${sg(Fij(i, j))}`, true);
      f.print("28 loops from 16 numbers: swap the axes and every sign flips.");
    }
    f.btn.random.addEventListener("click", () => {
      const r = () => Math.round((Math.random() * 2 - 1) ** 3 * 20) / 20;
      a = DIRS.map(r); b = DIRS.map(r); point = null; paint();
    });
    f.btn.swap.addEventListener("click", () => { [a, b] = [b, a]; paint(); });
    f.btn.reset.addEventListener("click", () => { a = [...A0]; b = [...B0]; point = null; paint(); });
    paint();
  };

  function mount(root) {
    root.querySelectorAll("figure.cd-fig[data-fig]:not([data-ready])").forEach((fig) => {
      fig.dataset.ready = "1";
      try { FIG[fig.dataset.fig]?.(fig); } catch (e) { console.error("figure", fig.dataset.fig, e); }
    });
  }
  window.jgFigures = { mount, stop: () => halts.forEach((h) => h()), cover, corners, _test: { project, visualControls, SQ, DEMO, ANCHOR } };
})();
