/* Certificate of Nonexistence: the live figures in MATH.md.
   compdesign.js loads this file the first time MATH.md opens. Every figure is
   computed here, in the browser, from the house file, with the same arithmetic
   as verify.py: whole quarter inches and whole quarter turns, nothing rounded. */
(() => {
  "use strict";

  // building.json, plus the three loops from certificate.json (out/proof in the repo)
  const DATA = {"rooms":{"BR1":{"w":696,"d":672,"doors":{"D10":["S",384,0,144],"D12":["E",336,0,136]},"stair":null},"BR2":{"w":720,"d":672,"doors":{"D11":["S",336,0,144],"D12":["W",336,0,136]},"stair":null},"BTH":{"w":480,"d":732,"doors":{"D13":["W",372,0,144]},"stair":null},"COR":{"w":1849,"d":240,"doors":{"D05":["W",120,0,192],"D07":["N",552,0,192],"D08":["N",1032,0,144],"HALL":["E",120,0,192]},"stair":null},"DIN":{"w":768,"d":960,"doors":{"D01":["W",480,0,144],"D02":["E",480,0,240]},"stair":null},"ENT":{"w":480,"d":1224,"doors":{"D03":["W",480,0,192],"D04":["E",576,0,144],"HALL":["W",1104,0,192],"front":["S",240,0,168]},"stair":null},"G1":{"w":1440,"d":336,"doors":{"D07":["N",360,0,192],"in":["S",168,0,192],"out":["E",168,0,192]},"stair":null},"G2":{"w":1440,"d":336,"doors":{"D09":["W",168,0,144],"in":["S",168,0,192],"out":["E",168,0,192]},"stair":null},"G3":{"w":1440,"d":336,"doors":{"D10":["N",384,0,144],"D11":["N",1056,0,144],"in":["S",168,0,192],"out":["E",168,0,192]},"stair":null},"G4":{"w":1440,"d":336,"doors":{"D13":["N",360,0,144],"in":["S",168,0,192],"out":["E",168,0,192]},"stair":null},"G5":{"w":1440,"d":336,"doors":{"in":["S",168,0,192],"out":["E",168,0,192]},"stair":null},"KIT":{"w":768,"d":1224,"doors":{"D04":["W",576,0,144]},"stair":null},"LIB":{"w":864,"d":1224,"doors":{"D01":["E",480,0,144],"D05":["E",1104,0,192],"D09":["N",168,0,144]},"stair":null},"LIV":{"w":1056,"d":960,"doors":{"D02":["W",480,0,240],"D03":["E",480,0,192]},"stair":null},"ST1":{"w":852,"d":192,"doors":{"D08":["S",96,0,144],"in":["N",96,0,192],"out":["E",96,464,192]},"stair":[192,16,29,44,192]},"ST2":{"w":852,"d":192,"doors":{"in":["N",96,0,192],"out":["E",96,464,192]},"stair":[192,16,29,44,192]},"ST3":{"w":852,"d":192,"doors":{"in":["N",96,0,192],"out":["E",96,464,192]},"stair":[192,16,29,44,192]},"ST4":{"w":852,"d":192,"doors":{"in":["N",96,0,192],"out":["E",96,464,192]},"stair":[192,16,29,44,192]}},"doorways":[{"key":"F1","a":"ST1","b":"ST2","wall":0,"da":"out","db":"in"},{"key":"F2","a":"ST2","b":"ST3","wall":0,"da":"out","db":"in"},{"key":"F3","a":"ST3","b":"ST4","wall":0,"da":"out","db":"in"},{"key":"F4","a":"ST4","b":"ST1","wall":0,"da":"out","db":"in"},{"key":"C1","a":"G1","b":"G2","wall":24,"da":"out","db":"in"},{"key":"C2","a":"G2","b":"G3","wall":24,"da":"out","db":"in"},{"key":"C3","a":"G3","b":"G4","wall":24,"da":"out","db":"in"},{"key":"C4","a":"G4","b":"G5","wall":24,"da":"out","db":"in"},{"key":"C5","a":"G5","b":"G1","wall":24,"da":"out","db":"in"},{"key":"D01","a":"LIB","b":"DIN","wall":24,"da":"D01","db":"D01"},{"key":"D02","a":"DIN","b":"LIV","wall":24,"da":"D02","db":"D02"},{"key":"D03","a":"LIV","b":"ENT","wall":24,"da":"D03","db":"D03"},{"key":"D04","a":"ENT","b":"KIT","wall":24,"da":"D04","db":"D04"},{"key":"D05","a":"LIB","b":"COR","wall":24,"da":"D05","db":"D05"},{"key":"HALL","a":"COR","b":"ENT","wall":24,"da":"HALL","db":"HALL"},{"key":"D07","a":"COR","b":"G1","wall":24,"da":"D07","db":"D07"},{"key":"D08","a":"COR","b":"ST1","wall":24,"da":"D08","db":"D08"},{"key":"D09","a":"LIB","b":"G2","wall":24,"da":"D09","db":"D09"},{"key":"D10","a":"G3","b":"BR1","wall":24,"da":"D10","db":"D10"},{"key":"D11","a":"G3","b":"BR2","wall":24,"da":"D11","db":"D11"},{"key":"D12","a":"BR1","b":"BR2","wall":24,"da":"D12","db":"D12"},{"key":"D13","a":"G4","b":"BTH","wall":24,"da":"D13","db":"D13"}],"seams":["F4","C5","HALL"],"loops":{"F4":[["ST1","F1","ST2"],["ST2","F2","ST3"],["ST3","F3","ST4"],["ST4","F4","ST1"]],"C5":[["G1","C1","G2"],["G2","C2","G3"],["G3","C3","G4"],["G4","C4","G5"],["G5","C5","G1"]],"HALL":[["ENT","D03","LIV"],["LIV","D02","DIN"],["DIN","D01","LIB"],["LIB","D05","COR"],["COR","HALL","ENT"]]},"stone":[-1860,2148],"labels":{"ENT":"ENTRANCE","LIV":"LIVING ROOM","DIN":"DINING ROOM","LIB":"LIBRARY","KIT":"KITCHEN","COR":"THE HALL","BR1":"BEDROOM I","BR2":"BEDROOM II","BTH":"BATH","G1":"GALLERY I","G2":"GALLERY II","G3":"GALLERY III","G4":"GALLERY IV","G5":"GALLERY V"},"names":{"BR1":"Bedroom I","BR2":"Bedroom II","BTH":"Bath","COR":"The Hall","DIN":"Dining Room","ENT":"Entrance Hall","G1":"Gallery I","G2":"Gallery II","G3":"Gallery III","G4":"Gallery IV","G5":"Gallery V","KIT":"Kitchen","LIB":"Library","LIV":"Living Room","ST1":"Stair Hall, Flight I","ST2":"Stair Hall, Flight II","ST3":"Stair Hall, Flight III","ST4":"Stair Hall, Flight IV"}};

  const NS = "http://www.w3.org/2000/svg";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- moves, exactly as verify.py does them ----------
  const NORMAL = { E: 0, N: 1, W: 2, S: 3 };
  const ROT = [[1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0]];
  const mod4 = (r) => ((r % 4) + 4) % 4;
  const rot = (r, x, y) => { const [a, b, c, d] = ROT[mod4(r)]; return [a * x + b * y, c * x + d * y]; };
  const move = (r = 0, x = 0, y = 0, z = 0) => ({ r: mod4(r), t: [x, y, z] });
  const ID = move();
  const compose = (m, n) => { const [x, y] = rot(m.r, n.t[0], n.t[1]); return move(m.r + n.r, x + m.t[0], y + m.t[1], n.t[2] + m.t[2]); };
  const inverse = (m) => { const [x, y] = rot(-m.r, -m.t[0], -m.t[1]); return move(-m.r, x, y, -m.t[2]); };
  const apply = (m, [x, y, z = 0]) => { const [a, b] = rot(m.r, x, y); return [a + m.t[0], b + m.t[1], z + m.t[2]]; };
  const same = (m, n) => m.r === n.r && m.t.every((v, i) => v === n.t[i]);

  const ROOMS = DATA.rooms, DOORWAYS = DATA.doorways, SEAMS = DATA.seams;
  const DOOR = Object.fromEntries(DOORWAYS.map((d) => [d.key, d]));
  const KEYS = DOORWAYS.map((d) => d.key);
  const STAIRS = Object.keys(ROOMS).filter((k) => ROOMS[k].stair);
  const GALLERIES = ["G1", "G2", "G3", "G4"];

  function doorFrame(k, dk) {
    const r = ROOMS[k], [wall, at, z] = r.doors[dk];
    const [x, y] = { E: [r.w, at], W: [0, at], N: [at, r.d], S: [at, 0] }[wall];
    return move(NORMAL[wall], x, y, z);
  }
  // through a doorway: to the door, through the wall, turn round, out of the other door
  function crossing(d, forward = true) {
    const T = [doorFrame(d.a, d.da), move(0, d.wall), move(2), inverse(doorFrame(d.b, d.db))].reduce(compose);
    return forward ? T : inverse(T);
  }

  // quarter inches -> feet and inches, the way verify.py prints them
  function feet(u) {
    const s = u < 0 ? "-" : "";
    u = Math.abs(u);
    return `${s}${Math.floor(u / 48)}'-${Math.floor((u % 48) / 4)}${["", " 1/4", " 1/2", " 3/4"][u % 4]}"`;
  }
  // ...and the way the README writes them
  function pretty(u) {
    const s = u < 0 ? "\u2212" : "";
    u = Math.abs(u);
    return `${s}${Math.floor(u / 48)}\u2032-${Math.floor((u % 48) / 4)}${["", "\u00bc", "\u00bd", "\u00be"][u % 4]}\u2033`;
  }
  const total = ({ a, key, b, acc }) =>
    `   ${a.padStart(4)} -> ${b.padEnd(4)} through ${key.padEnd(5)} running total: ${String(acc.r * 90).padStart(3)} deg, (${feet(acc.t[0])}, ${feet(acc.t[1])}, ${feet(acc.t[2])})`;
  function describe(m) {
    if (m.r) return `turned ${m.r * 90} deg`;
    const [x, y, z] = m.t, out = [];
    if (z) out.push(`rise ${feet(z)}`);
    if (x || y) out.push(`shifted (${feet(x)}, ${feet(y)})`);
    return out.join(", ");
  }

  // The certificate's loop through a seam, step by step, with the running total.
  function walk(seam) {
    let acc = ID;
    return DATA.loops[seam].map(([a, key, b]) => {
      const d = DOOR[key];
      acc = compose(acc, crossing(d, d.a === a));
      return { a, key, b, acc };
    });
  }

  // The architect's drawing (prove.py's layout): from the front door, breadth first,
  // seams last. Every doorway left over is a check: does it line up?
  function layout(active) {
    const adj = Object.fromEntries(Object.keys(ROOMS).map((k) => [k, []]));
    for (const d of DOORWAYS) if (active.has(d.key)) { adj[d.a].push([d, true]); adj[d.b].push([d, false]); }
    for (const k in adj) adj[k].sort((e, f) => (e[0].key < f[0].key ? -1 : 1));
    const pose = {}, via = {}, order = [], tree = new Set();
    const place = (v, u, d, fwd) => { pose[v] = compose(pose[u], crossing(d, fwd)); via[v] = d.key; tree.add(d.key); order.push(v); };
    const grow = (start) => {
      const q = [start];
      while (q.length) {
        const u = q.shift();
        for (const [d, fwd] of adj[u]) {
          const v = fwd ? d.b : d.a;
          if (v in pose || SEAMS.includes(d.key)) continue;
          place(v, u, d, fwd);
          q.push(v);
        }
      }
    };
    for (const root of ["ENT", ...Object.keys(ROOMS).sort()]) {
      if (root in pose) continue;
      pose[root] = ID; via[root] = null; order.push(root);
      grow(root);
      for (let more = true; more;) {          // rooms reachable only through a seam
        more = false;
        for (const d of DOORWAYS) {
          if (!active.has(d.key)) continue;
          for (const [u, v, fwd] of [[d.a, d.b, true], [d.b, d.a, false]]) {
            if (u in pose && !(v in pose)) { place(v, u, d, fwd); grow(v); more = true; }
          }
        }
      }
    }
    const checks = DOORWAYS.filter((d) => active.has(d.key) && !tree.has(d.key)).map((d) => {
      const hol = [pose[d.a], crossing(d), inverse(pose[d.b])].reduce(compose);
      return { key: d.key, hol, closes: same(hol, ID) };
    });
    return { pose, via, order, tree, checks };
  }
  const ALL = layout(new Set(KEYS));

  // ---------- drawing ----------
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const poly = (m, list) => list.map((p) => { const [x, y] = apply(m, p); return `${x},${-y}`; }).join(" ");   // north up
  const bounds = (ps) => {
    const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  };
  const roomBox = (k, m) => bounds(rect(0, 0, ROOMS[k].w, ROOMS[k].d).map((p) => apply(m, p)));
  const unionBox = (ks, pose) => bounds(ks.flatMap((k) => { const b = roomBox(k, pose[k]); return [[b[0], b[1]], [b[2], b[3]]]; }));
  const H = 36;               // walls drawn 9" past each room face, as on the architect's plan
  const STONE = DATA.stone;

  // a point at a doorway's face, in the shared plan
  const doorPoint = (pose, k, dk, along = 0) => apply(compose(pose[k], doorFrame(k, dk)), [along, 0]);

  // The plan, as poché: black walls, white floors, the court raked round the stone.
  function drawPlan(parent, pose, { lines = false, labels = true } = {}) {
    const g = el("g", { class: `pl${lines ? " pl-lines" : ""}${labels === "quiet" ? " pl-quiet" : ""}` }, parent);
    const L = {};
    for (const n of ["walls", "floors", "court", "open", "detail", "text"]) L[n] = el("g", { class: `pl-${n}` }, g);
    const parts = {};
    const add = (k, e) => { (parts[k] ||= []).push(e); return e; };
    const rooms = Object.keys(ROOMS).filter((k) => k !== "G5" && !ROOMS[k].stair);   // gallery V stands where gallery I does

    for (const k of rooms) add(k, el("polygon", { points: poly(pose[k], rect(-H, -H, ROOMS[k].w + H, ROOMS[k].d + H)) }, L.walls));
    const sq = unionBox(STAIRS, pose), wd = ROOMS.ST1.stair[4];
    add("ST1", el("polygon", { points: poly(ID, rect(sq[0] - H, sq[1] - H, sq[2] + H, sq[3] + H)) }, L.walls));
    for (const k of [...rooms, ...STAIRS]) add(k, el("polygon", { "data-room": k, points: poly(pose[k], rect(0, 0, ROOMS[k].w, ROOMS[k].d)) }, L.floors));
    add("ST1", el("polygon", { class: "pl-well", points: poly(ID, rect(sq[0] + wd, sq[1] + wd, sq[2] - wd, sq[3] - wd)) }, L.floors));

    // the court: raked in rings round the stone, and in squares out to the colonnade
    const gb = unionBox(GALLERIES, pose), gd = ROOMS.G1.d;
    const court = [gb[0] + gd + H, gb[1] + gd + H, gb[2] - gd - H, gb[3] - gd - H];
    const cg = add("court", el("g", {}, L.court));
    el("polygon", { class: "pl-gravel", points: poly(ID, rect(...court)) }, cg);
    const half = (court[2] - court[0]) / 2, [sx, sy] = STONE;
    for (let r = 84; r <= half * 0.62; r += 26) el("circle", { cx: sx, cy: -sy, r }, cg);
    for (let r = Math.ceil((half * 0.62) / 26) * 26 + 26; r < half; r += 26) el("rect", { x: sx - r, y: -sy - r, width: 2 * r, height: 2 * r }, cg);
    el("circle", { class: "pl-stone", cx: sx, cy: -sy, r: 46 }, cg);

    // openings: every doorway through a wall, the front door, and the colonnades
    const holes = {};
    for (const d of DOORWAYS) {
      if (d.wall <= 0 || d.a === "G5") continue;
      const hw = ROOMS[d.a].doors[d.da][3] / 2;
      holes[d.key] = el("polygon", { points: poly(compose(pose[d.a], doorFrame(d.a, d.da)), rect(-2, -hw, d.wall + 2, hw)) }, L.open);
    }
    const fw = ROOMS.ENT.doors.front[3] / 2;
    add("ENT", el("polygon", { points: poly(compose(pose.ENT, doorFrame("ENT", "front")), rect(-2, -fw, H + 2, fw)) }, L.open));
    for (const k of GALLERIES) {
      const span = (ROOMS[k].w - 48 - 384) / 5;
      for (let i = 0; i < 5; i++) {
        const a = 384 + i * span + 43.2;
        add(k, el("polygon", { points: poly(pose[k], rect(a, -H - 2, a + span - 86.4, 2)) }, L.open));
      }
    }

    // the four flights: treads, a parapet on the well side, and an arrow going up
    for (const k of STAIRS) {
      const [x0, n, , tr, w] = ROOMS[k].stair, m = pose[k], c = (w - 24) / 2, end = ROOMS[k].w - 40;
      for (let i = 0; i < n; i++) add(k, el("polyline", { points: poly(m, [[x0 + i * tr, 0], [x0 + i * tr, w - 24]]) }, L.detail));
      add(k, el("polyline", { points: poly(m, [[0, w - 24], [ROOMS[k].w, w - 24]]) }, L.detail));
      add(k, el("polyline", { class: "pl-up", points: poly(m, [[x0 * 0.5, c], [end - 30, c]]) }, L.detail));
      add(k, el("polygon", { class: "pl-arrow", points: poly(m, [[end - 70, c - 34], [end, c], [end - 70, c + 34]]) }, L.detail));
    }

    if (labels) {
      for (const k of rooms) {
        const b = roomBox(k, pose[k]), x = (b[0] + b[2]) / 2, y = -(b[1] + b[3]) / 2;
        const t = el("text", { x, y, transform: b[3] - b[1] > b[2] - b[0] ? `rotate(-90 ${x} ${y})` : null }, L.text);
        t.textContent = DATA.labels[k];
        add(k, t);
      }
      const t = el("text", { x: (sq[0] + sq[2]) / 2, y: -(sq[1] + sq[3]) / 2 }, L.text);
      t.textContent = "STAIR";
      add("ST1", t);
    }
    return { g, parts, holes, court, sq };
  }

  // ---------- animation ----------
  const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - (2 - 2 * k) ** 2 / 2);
  function tween(ms, fn, token, curve = (k) => k) {
    return new Promise((done) => {
      if (reduced || ms <= 0) { fn(1); done(); return; }
      const t0 = performance.now();
      const tick = (now) => {
        if (token.dead) { done(); return; }
        const k = Math.min(1, (now - t0) / ms);
        fn(curve(k));
        if (k < 1) requestAnimationFrame(tick); else done();
      };
      requestAnimationFrame(tick);
    });
  }
  const wait = (ms, token) => tween(ms, () => {}, token);
  // a point k of the way along a polyline
  function along(pts) {
    const seg = [];
    let len = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; }
    const at = (k) => {
      let d = k * len;
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i] || i === seg.length - 1) {
          const u = seg[i] ? Math.min(1, d / seg[i]) : 1;
          return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, i];
        }
        d -= seg[i];
      }
      return [...pts[pts.length - 1], seg.length - 1];
    };
    return { at, len };
  }
  // a dot walking a path, leaving a trail
  async function stroll(dot, trail, pts, speed, token, each) {
    if (pts.length < 2) return;
    const done = trail ? trail.getAttribute("points") || "" : "";
    const path = along(pts);
    await tween(Math.max(250, path.len / speed), (k) => {
      const [x, y, i] = path.at(k);
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      if (trail) trail.setAttribute("points", `${done} ${pts.slice(0, i + 1).map((p) => p.join(",")).join(" ")} ${x},${y}`.trim());
      if (each) each(k);
    }, token);
  }

  // ---------- a figure: toolbar, picture, MS-DOS readout, caption ----------
  const halts = [];
  function frame(fig, { buttons, lines = 6, label }) {
    const bar = document.createElement("div");
    bar.className = "cd-fig-bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", label);
    const btn = {};
    for (const b of buttons) {
      if (b === "|") { bar.appendChild(Object.assign(document.createElement("span"), { className: "cd-fig-sep" })); continue; }
      if (b[0] === "#") { bar.appendChild(Object.assign(document.createElement("span"), { className: "cd-fig-lbl", textContent: b.slice(1) })); continue; }
      const [key, text] = b;
      btn[key] = Object.assign(document.createElement("button"), { type: "button", className: "btn", textContent: text });
      bar.appendChild(btn[key]);
    }
    const box = Object.assign(document.createElement("div"), { className: "cd-fig-canvas" });
    const svg = el("svg", { role: "img", "aria-label": label }, box);
    const out = Object.assign(document.createElement("pre"), { className: "cd-fig-out" });
    out.setAttribute("aria-live", "polite");
    out.style.setProperty("--lines", lines);
    const cap = fig.querySelector("figcaption");
    for (const n of [bar, box, out]) fig.insertBefore(n, cap);
    let rows = [];
    const draw = () => {
      out.replaceChildren(...rows.map(([s, hi]) => Object.assign(document.createElement("span"), { className: hi ? "hi" : "", textContent: `${s}\n` })));
      out.scrollTop = out.scrollHeight;
    };
    const print = (s, hi = false) => { rows.push([s, hi]); draw(); };
    const clear = () => { rows = []; draw(); };
    let token = { dead: true };
    const fresh = () => { token.dead = true; token = { dead: false }; return token; };
    halts.push(() => { token.dead = true; });
    const view = (b, pad = 0) => { svg.setAttribute("viewBox", `${b[0] - pad} ${b[1] - pad} ${b[2] - b[0] + 2 * pad} ${b[3] - b[1] + 2 * pad}`); return b; };
    return { bar, btn, box, svg, out, print, clear, fresh, view, busy: () => !token.dead };
  }
  // for figures that walk: Walk runs every step, Step runs one, Reset starts over
  function stepper(f, steps, { reset, before = () => {}, after = () => {} }) {
    let i = 0, running = false;
    const sync = () => {
      f.btn.walk.disabled = running || i >= steps.length;
      f.btn.step.disabled = running || i >= steps.length;
    };
    async function one(token) {
      if (i === 0) before();
      await steps[i++](token);
      if (i === steps.length && !token.dead) after();
    }
    async function go(all) {
      if (running || i >= steps.length) return;
      running = true; sync();
      const token = f.fresh();
      do { await one(token); } while (all && i < steps.length && !token.dead);
      running = false; sync();
    }
    f.btn.walk.addEventListener("click", () => go(true));
    f.btn.step.addEventListener("click", () => go(false));
    f.btn.reset.addEventListener("click", () => { f.fresh(); running = false; i = 0; reset(); sync(); });
    reset(); sync();
    return { go, done: () => i >= steps.length, running: () => running };
  }
  const WALKER = (parent, r) => el("circle", { class: "cd-walker", r, cx: -1e6, cy: -1e6 }, parent);
  const toSvg = ([x, y]) => [x, -y];
  const planBox = () => { const b = unionBox(Object.keys(ROOMS), ALL.pose); return [b[0] - H, -b[3] - H, b[2] + H, -b[1] + H]; };

  function keyAt(parent, d, x, y, S, split) {
    const n = mod4(ALL.pose[d.a].r + NORMAL[ROOMS[d.a].doors[d.da][0]]);
    if (d.key === "C1") return note(parent, x - S * 1.2, -y + S * 0.45, d.key, S * 1.25, "cd-note cd-note-b", "end");   // D09 sits just below it
    if (split) return note(parent, x, -y - S * 1.45, d.key, S * 1.25, "cd-note cd-note-b", "middle");
    if (n % 2 === 0) return note(parent, x, -y + S * 2.25, d.key, S * 1.25, "cd-note cd-note-b", "middle");
    return note(parent, x + S * 1.2, -y + S * 0.45, d.key, S * 1.25, "cd-note cd-note-b");
  }

  // a small label in the drawing, sized to the drawing
  function note(parent, x, y, text, size, cls = "cd-note", anchor = "start") {
    const t = el("text", { class: cls, x, y, "font-size": size, "text-anchor": anchor }, parent);
    t.textContent = text;
    return t;
  }

  const FIG = {};

  // ---------- Fig. 1: laying the rooms down ----------
  FIG.plan = (fig) => {
    const f = frame(fig, { label: "Fig. 1, the architect's drawing", lines: 7, buttons: [["walk", "\u25b6 Lay it out"], ["step", "Step"], ["reset", "Reset"]] });
    const box = f.view(planBox(), 60);
    const plan = drawPlan(f.svg, ALL.pose);
    const marks = el("g", { class: "cd-marks" }, f.svg);
    const S = (box[2] - box[0]) / 60;
    const lastGallery = ALL.order.filter((k) => GALLERIES.includes(k)).pop();
    const floor = (k) => f.svg.querySelector(`.pl-floors [data-room="${k === "G5" ? "G1" : k}"]`);
    const flash = (k) => { const e = floor(k); e.classList.add("hot"); setTimeout(() => e.classList.remove("hot"), 700); };

    function mark(key, ok) {
      const d = DOOR[key];
      const A = doorPoint(ALL.pose, d.a, d.da), B = doorPoint(ALL.pose, d.b, d.db);
      let [x, y] = doorPoint(ALL.pose, d.a, d.da, d.wall / 2);
      const split = Math.hypot(A[0] - B[0], A[1] - B[1]) > d.wall + 8;   // its two halves can't meet on paper
      if (split) {
        el("line", { class: "cd-gap", x1: A[0], y1: -A[1], x2: B[0], y2: -B[1] }, marks);
        [x, y] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      }
      const g = el("g", { class: `cd-mark ${ok ? "ok" : "bad"}` }, marks);
      el("circle", { cx: x, cy: -y, r: S * 1.25 }, g);
      const s = S * 0.6;
      el("polyline", { points: ok ? `${x - s},${-y} ${x - s * 0.25},${-y + s * 0.7} ${x + s},${-y - s * 0.7}` : `${x - s},${-y - s} ${x + s},${-y + s}` }, g);
      if (!ok) el("polyline", { points: `${x - s},${-y + s} ${x + s},${-y - s}` }, g);
      keyAt(g, d, x, y, S * 1.15, split);
    }

    const steps = [
      ...ALL.order.map((k, n) => async (token) => {
        const via = ALL.via[k];
        (plan.parts[k === "G5" ? "none" : k] || []).forEach((e) => e.classList.remove("off"));
        if (via && plan.holes[via]) plan.holes[via].classList.remove("off");
        if (k === lastGallery) plan.parts.court.forEach((e) => e.classList.remove("off"));
        flash(k);
        f.print(via
          ? `   place  ${k.padEnd(4)} through ${via.padEnd(5)} (${String(n + 1).padStart(2)} of 18)${k === "G5" ? "   lands exactly on G1" : ""}`
          : `   place  ${k.padEnd(4)} at the front door  ( 1 of 18)`);
        await wait(k === "G5" ? 900 : 260, token);
      }),
      ...ALL.checks.map((c) => async (token) => {
        if (plan.holes[c.key]) plan.holes[c.key].classList.remove("off");
        mark(c.key, c.closes);
        f.print(`   check  ${c.key.padEnd(5)}    ${c.closes ? "comes home unchanged" : `comes home CHANGED: ${describe(c.hol)}`}`, !c.closes);
        await wait(700, token);
      }),
    ];
    stepper(f, steps, {
      reset() {
        for (const k in plan.parts) plan.parts[k].forEach((e) => e.classList.add("off"));
        Object.values(plan.holes).forEach((e) => e.classList.add("off"));
        marks.replaceChildren();
        f.clear();
        f.print("C:\\> the inspector starts at the front door");
      },
      after() {
        const bad = ALL.checks.filter((c) => !c.closes).length;
        f.print(`   ${bad} of ${ALL.checks.length} checks fail: no placement of these rooms exists`, true);
      },
    });
  };

  // ---------- Fig. 2: the stair, in isometric ----------
  FIG.stair = (fig) => {
    const f = frame(fig, { label: "Fig. 2, the stair", lines: 6, buttons: [["walk", "\u25b6 Climb"], ["step", "One flight"], ["reset", "Reset"]] });
    const loop = walk("F4");
    const frames = [ID, ...loop.map((s) => s.acc)].map((acc) => compose(ALL.pose.ST1, acc));   // flights I-IV, then flight I again
    const [x0, n, rs, tr, wd] = ROOMS.ST1.stair, len = ROOMS.ST1.w;
    const C = Math.cos(Math.PI / 6);
    const iso = ([x, y, z]) => [(x - y) * C, -(x + y) * 0.5 - z];

    // a flight is a landing and fifteen floating treads, with a parapet on the well side
    const local = [[0, 0, -36, x0, wd, 0]];
    for (let i = 1; i < n; i++) {
      const top = i * rs, xa = x0 + (i - 1) * tr, xb = x0 + i * tr;
      local.push([xa, 0, top - 36, xb, wd - 24, top], [xa, wd - 24, top - 36, xb, wd, top + 120]);
    }
    const world = (m, [ax, ay, az, bx, by, bz]) => {
      const p = apply(m, [ax, ay, az]), q = apply(m, [bx, by, bz]);
      return [Math.min(p[0], q[0]), Math.min(p[1], q[1]), p[2], Math.max(p[0], q[0]), Math.max(p[1], q[1]), q[2]];
    };
    const faces = ([a, b, c, x, y, z]) => [
      ["fz", [[a, b, z], [x, b, z], [x, y, z], [a, y, z]]],
      ["fy", [[a, b, c], [x, b, c], [x, b, z], [a, b, z]]],
      ["fx", [[a, b, c], [a, y, c], [a, y, z], [a, b, z]]],
    ];
    const pp = (ps) => ps.map((p) => iso(p).join(",")).join(" ");

    // where everything is, to size the drawing
    const sq = unionBox(STAIRS, ALL.pose), z4 = frames[4].t[2];
    const pole = [sq[2] + 300, sq[1] - 300];
    const pts = [];
    for (const m of frames) for (const b of local) { const w = world(m, b); pts.push(iso([w[0], w[1], w[2]]), iso([w[3], w[4], w[5]]), iso([w[0], w[4], w[5]]), iso([w[3], w[1], w[2]])); }
    pts.push(iso([...pole, 0]), iso([...pole, z4 + 200]));
    const bb = bounds(pts);
    f.view([bb[0] - 120, bb[1] - 260, bb[2] + 520, bb[3] + 90]);
    const S = (bb[2] - bb[0] + 640) / 60;

    // the ground: the stair hall's square, flat
    el("polygon", { class: "iso-ground", points: pp(rect(sq[0], sq[1], sq[2], sq[3]).map(([x, y]) => [x, y, -36])) }, f.svg);
    // painter's order: far and low first
    const boxes = [];
    frames.slice(0, 4).forEach((m) => local.forEach((b) => boxes.push(world(m, b))));
    boxes.sort((p, q) => (q[0] + q[3] + q[1] + q[4] - q[2] - q[5]) - (p[0] + p[3] + p[1] + p[4] - p[2] - p[5]));
    const solid = el("g", { class: "iso" }, f.svg);
    for (const b of boxes) for (const [cls, ps] of faces(b)) el("polygon", { class: cls, points: pp(ps) }, solid);

    // the height pole, a storey a flight
    const scale = el("g", { class: "iso-scale" }, f.svg);
    const [px, py] = iso([...pole, 0]);
    el("line", { x1: px, y1: py, x2: px, y2: py - z4 }, scale);
    for (let s = 0; s <= 4; s++) {
      el("line", { x1: px - S * 0.5, y1: py - s * 464, x2: px + S * 0.5, y2: py - s * 464 }, scale);
      note(scale, px + S * 0.9, py - s * 464 + S * 0.45, s ? pretty(s * 464) : "0", S * 1.3);
    }

    // flight I again, where the stair says it is
    const ghost = el("g", { class: "cd-ghost-g off" }, f.svg);
    for (const b of local) for (const [, ps] of faces(world(frames[4], b)).slice(0, 1)) el("polygon", { class: "cd-ghost", points: pp(ps) }, ghost);
    const land = (m) => iso(apply(m, [x0 / 2, wd / 2, 0]));
    const [gx, gy] = land(frames[4]), [hx, hy] = land(frames[0]);
    el("line", { class: "cd-burgers", x1: hx, y1: hy, x2: gx, y2: gy }, ghost);
    note(ghost, gx + S * 1.4, gy + S * 0.5, "landing 1, by your count", S * 1.3, "cd-note cd-note-pink cd-note-b");
    note(ghost, hx - S * 0.8, (hy + gy) / 2, "38\u2032-8\u2033", S * 1.7, "cd-note cd-note-pink cd-note-b", "end");
    note(ghost, hx - S * 1.2, hy + S * 2.4, "landing 1", S * 1.3, "cd-note", "end");

    const dot = WALKER(f.svg, S * 0.7);
    const route = (k) => {
      const ps = [[x0 / 2, wd / 2, 0], [x0, wd / 2, 0]];
      for (let i = 1; i < n; i++) ps.push([x0 + (i - 0.5) * tr, wd / 2, i * rs]);
      ps.push([len, wd / 2, n * rs]);
      return [...ps.map((p) => iso(apply(frames[k], p))), land(frames[k + 1])];
    };
    const steps = loop.map((s, k) => async (token) => {
      await stroll(dot, null, route(k), 700, token);
      f.print(total(s), k === 3);
    });
    stepper(f, steps, {
      reset() {
        ghost.classList.add("off");
        dot.setAttribute("cx", hx); dot.setAttribute("cy", hy);
        f.clear();
        f.print("C:\\> loop through doorway F4:");
      },
      after() {
        ghost.classList.remove("off");
        f.print("   comes home CHANGED: you are on landing 1, and 38'-8\" above it", true);
      },
    });
  };

  // ---------- Fig. 3: the cloister ----------
  FIG.cloister = (fig) => {
    const f = frame(fig, { label: "Fig. 3, the cloister", lines: 7, buttons: [["walk", "\u25b6 Walk round"], ["step", "One gallery"], ["reset", "Reset"]] });
    const gb = unionBox(GALLERIES, ALL.pose);
    f.view([gb[0] - H, -gb[3] - H, gb[2] + H, -gb[1] + H], 90);
    const S = (gb[2] - gb[0] + 300) / 60;
    drawPlan(f.svg, ALL.pose, { labels: "quiet" });
    const loop = walk("C5");
    const frames = [ID, ...loop.map((s) => s.acc)].map((acc) => compose(ALL.pose.G1, acc));
    const g = ROOMS.G1, mid = 92, [sx, sy] = STONE;

    // the turning gauge round the stone: 90 degrees for every right turn
    const gauge = el("g", { class: "cd-gauge" }, f.svg);
    const arc = el("polyline", { class: "cd-arc" }, gauge), extra = el("polyline", { class: "cd-arc cd-arc-x" }, gauge);
    const deg = note(gauge, sx, -sy + S * 3.4, "0\u00b0", S * 2.2, "cd-note cd-note-b cd-deg", "middle");
    const a0 = Math.atan2(...(() => { const [dx, dy] = rot(frames[0].r, 1, 0); return [dy, dx]; })());   // heading in gallery I
    const spiral = (from, to) => {
      const ps = [];
      for (let t = from; t <= to + 0.01; t += 3) {
        const r = S * 3.1 + (t / 360) * S * 2.6, a = a0 - (t * Math.PI) / 180;
        ps.push(`${sx + r * Math.cos(a)},${-(sy + r * Math.sin(a))}`);
      }
      return ps.join(" ");
    };
    const turned = (t) => {
      arc.setAttribute("points", spiral(0, Math.min(t, 360)));
      extra.setAttribute("points", t > 360 ? spiral(360, t) : "");
      deg.textContent = `${Math.round(t)}\u00b0`;
      deg.classList.toggle("over", t > 360);
    };

    // gallery I, where the fifth doorway puts it
    const ghost = el("g", { class: "cd-ghost-g off" }, f.svg);
    el("polygon", { class: "cd-ghost", points: poly(frames[5], rect(0, 0, g.w, g.d)) }, ghost);
    const gc = apply(frames[5], [g.w / 2, g.d / 2]), hc = apply(frames[0], [g.w / 2, g.d / 2]);
    const lx = gc[0] + g.d / 2 + H + S * 1.6;
    note(ghost, lx, -gc[1], "gallery I, by the fifth doorway", S * 1.3, "cd-note cd-note-pink cd-note-b", "middle").setAttribute("transform", `rotate(-90 ${lx} ${-gc[1]})`);
    const R0 = Math.hypot(hc[0] - sx, hc[1] - sy), b0 = Math.atan2(hc[1] - sy, hc[0] - sx);
    const swing = [];
    for (let t = 0; t <= 84; t += 3) swing.push(`${sx + R0 * Math.cos(b0 - (t * Math.PI) / 180)},${-(sy + R0 * Math.sin(b0 - (t * Math.PI) / 180))}`);
    el("polyline", { class: "cd-swing", points: swing.join(" ") }, ghost);
    const tip = b0 - (90 * Math.PI) / 180, tx = sx + R0 * Math.cos(tip), ty = -(sy + R0 * Math.sin(tip));
    el("polygon", { class: "cd-swing-head", points: `${tx},${ty} ${tx - S * 0.9},${ty - S * 1.4} ${tx + S * 0.9},${ty - S * 1.4}`, transform: `rotate(${(-tip * 180) / Math.PI} ${tx} ${ty})` }, ghost);

    const dot = WALKER(f.svg, S * 0.7);
    const trail = el("polyline", { class: "cd-trail" }, f.svg);
    f.svg.appendChild(dot);
    const P = (k, p) => toSvg(apply(frames[k], p));
    const start = P(0, [168, mid]);
    const steps = loop.map((s, k) => async (token) => {
      const pts = [P(k, [168, mid]), P(k, [g.w - 168, mid]), P(k, [g.w - 168, 168]), P(k, [g.w, 168]), P(k + 1, [168, 0]), P(k + 1, [168, mid])];
      await stroll(dot, trail, pts, 900, token, (u) => turned(k * 90 + 90 * Math.min(1, Math.max(0, (u - 0.62) / 0.3))));
      f.print(total(s), k === 4);
    });
    stepper(f, steps, {
      reset() {
        ghost.classList.add("off");
        trail.setAttribute("points", "");
        dot.setAttribute("cx", start[0]); dot.setAttribute("cy", start[1]);
        turned(0);
        f.clear();
        f.print("C:\\> loop through doorway C5:");
      },
      after() {
        ghost.classList.remove("off");
        f.print("   comes home CHANGED: five right turns, 450 degrees, round a square", true);
      },
    });
  };

  // ---------- Fig. 4: the hall, and a magnifier ----------
  FIG.hall = (fig) => {
    const f = frame(fig, { label: "Fig. 4, the hall", lines: 7, buttons: [["walk", "\u25b6 Walk"], ["step", "Step"], ["reset", "Reset"], "|", "#Magnifier:", ["z1", "1\u00d7"], ["z10", "10\u00d7"], ["z100", "100\u00d7"], ["z1000", "1000\u00d7"]] });
    const lb = unionBox(["LIB", "DIN", "LIV", "ENT", "COR"], ALL.pose);
    const v0 = [lb[0] - H - 90, -lb[3] - H - 90, lb[2] + H + 140, -lb[1] + H + 90];
    f.view(v0);
    drawPlan(f.svg, ALL.pose, { labels: "quiet" });
    const loop = walk("HALL");
    const frames = [ID, ...loop.map((s) => s.acc)].map((acc) => compose(ALL.pose.ENT, acc));
    const room = ["ENT", "LIV", "DIN", "LIB", "COR", "ENT"];
    const P = (k, p) => toSvg(apply(frames[k], typeof p === "string" ? apply(doorFrame(room[k], p), [0, 0]) : p));
    const route = [
      [[0, "D03"], [1, "D03"]],
      [[1, "D02"], [2, "D02"]],
      [[2, "D01"], [3, "D01"]],
      [[3, [720, 480]], [3, [720, 1104]], [3, "D05"], [4, "D05"]],
      [[4, "HALL"], [5, "HALL"], [5, [120, 1104]], [5, [120, 480]]],
    ].map((leg) => leg.map(([k, p]) => P(k, p)));
    const start = P(0, [120, 480]), end = route[4][route[4].length - 1];

    // ENT, where the loop puts it
    const ghost = el("polygon", { class: "cd-ghost off", points: poly(frames[5], rect(0, 0, ROOMS.ENT.w, ROOMS.ENT.d)) }, f.svg);
    const trail = el("polyline", { class: "cd-trail" }, f.svg);
    const home = el("circle", { class: "cd-home" }, f.svg);
    const dot = WALKER(f.svg, 1);
    const tags = el("g", { class: "off" }, f.svg);
    const tLeft = note(tags, 0, 0, "left from here", 1, "cd-note", "end");
    const tHome = note(tags, 0, 0, "came home here", 1, "cd-note cd-note-pink");
    const tGap = note(tags, 0, 0, "\u00bc\u2033", 1, "cd-note cd-note-pink cd-note-b", "middle");
    const dim = el("polyline", { class: "cd-dim off" }, f.svg);

    // everything that should stay the same size on screen as the view zooms
    let vb = v0.slice();
    const size = () => {
      const w = vb[2] - vb[0], u = w / 60;
      dot.setAttribute("r", u * 0.7); home.setAttribute("r", u * 0.55);
      home.setAttribute("cx", start[0]); home.setAttribute("cy", start[1]);
      for (const [t, dx, dy] of [[tLeft, -u * 1.2, -u * 1.4], [tHome, u * 1.2, u * 2.4]]) {
        const p = t === tLeft ? start : end;
        t.setAttribute("x", p[0] + dx); t.setAttribute("y", p[1] + dy); t.setAttribute("font-size", u * 1.3);
      }
      tGap.setAttribute("x", (start[0] + end[0]) / 2); tGap.setAttribute("y", start[1] - u * 3.6); tGap.setAttribute("font-size", u * 2);
      dim.setAttribute("points", `${start[0]},${start[1] - u * 2.6} ${end[0]},${end[1] - u * 2.6}`);
    };
    const setView = (b) => { vb = b; f.svg.setAttribute("viewBox", `${b[0]} ${b[1]} ${b[2] - b[0]} ${b[3] - b[1]}`); size(); };
    setView(v0);

    let zoom = 1;
    const target = [(start[0] + end[0]) / 2, start[1]];
    const viewAt = (z) => {
      const w = (v0[2] - v0[0]) / z, h = (v0[3] - v0[1]) / z;
      const k = (1000 / z - 1) / 999;      // 1 at 1x, 0 at 1000x: the point stays put, then centres
      const cx = target[0] + ((v0[0] + v0[2]) / 2 - target[0]) * k, cy = target[1] + ((v0[1] + v0[3]) / 2 - target[1]) * k;
      return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
    };
    const zoomBtns = { 1: f.btn.z1, 10: f.btn.z10, 100: f.btn.z100, 1000: f.btn.z1000 };
    const pressZoom = () => { for (const z in zoomBtns) zoomBtns[z].setAttribute("aria-pressed", String(Number(z) === zoom)); };
    let walker;
    async function magnify(to) {
      if (to === zoom || walker.running()) return;
      if (!walker.done()) await walker.go(true);
      const token = f.fresh(), from = zoom;
      zoom = to; pressZoom();
      tags.classList.toggle("off", to < 100);
      dim.classList.toggle("off", to < 1000);
      await tween(1400, (k) => setView(viewAt(Math.exp(Math.log(from) + (Math.log(to) - Math.log(from)) * k))), token, ease);
      const w = Math.round((v0[2] - v0[0]) / to);
      f.print(`   magnifier ${String(to).padStart(4)}x   this window is ${feet(Math.max(1, w))} across`);
      if (to === 1000) f.print("   left from one spot, came home 0'-0 1/4\" east of it. Every step was right.", true);
    }
    for (const z in zoomBtns) zoomBtns[z].addEventListener("click", () => magnify(Number(z)));

    const steps = loop.map((s, k) => async (token) => {
      await stroll(dot, trail, [k ? route[k - 1][route[k - 1].length - 1] : start, ...route[k]], 1400, token);
      f.print(total(s), k === 4);
    });
    walker = stepper(f, steps, {
      reset() {
        zoom = 1; pressZoom(); setView(v0);
        tags.classList.add("off"); dim.classList.add("off"); ghost.classList.add("off");
        trail.setAttribute("points", "");
        dot.setAttribute("cx", start[0]); dot.setAttribute("cy", start[1]);
        f.clear();
        f.print("C:\\> loop through doorway HALL:");
      },
      after() {
        ghost.classList.remove("off");
        f.print("   comes home CHANGED, by one unit. Too small to see? Use the magnifier.", true);
      },
    });
  };

  // ---------- Fig. 5: brick it up ----------
  FIG.brick = (fig) => {
    const f = frame(fig, { label: "Fig. 5, brick up doorways", lines: 6, buttons: [["one", "Show me one that works"], ["clear", "Clear"]] });
    const box = f.view(planBox(), 60);
    const S = (box[2] - box[0]) / 60;
    drawPlan(f.svg, ALL.pose, { labels: "quiet" });
    const layer = el("g", { class: "cd-doors" }, f.svg);
    const bricked = new Set(), mk = {};
    const name = (k) => DATA.names[k];

    for (const d of DOORWAYS) {
      const A = doorPoint(ALL.pose, d.a, d.da), B = doorPoint(ALL.pose, d.b, d.db);
      let [x, y] = doorPoint(ALL.pose, d.a, d.da, d.wall / 2);
      const g = el("g", { class: "cd-door", tabindex: "0", role: "button", "aria-pressed": "false", "aria-label": `Doorway ${d.key}, ${name(d.a)} to ${name(d.b)}` }, layer);
      const split = Math.hypot(A[0] - B[0], A[1] - B[1]) > d.wall + 8;
      if (split) {
        el("line", { class: "cd-gap", x1: A[0], y1: -A[1], x2: B[0], y2: -B[1] }, g);
        [x, y] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      }
      const hw = ROOMS[d.a].doors[d.da][3] / 2;
      if (d.a !== "G5") el("polygon", { class: "cd-brick", points: poly(compose(ALL.pose[d.a], doorFrame(d.a, d.da)), rect(-10, -hw, Math.max(d.wall, 0) + 10, hw)) }, g);
      el("circle", { class: "cd-hit", cx: x, cy: -y, r: S * 1.7 }, g);     // a bigger target for fingers
      el("rect", { x: x - S * 0.85, y: -y - S * 0.85, width: S * 1.7, height: S * 1.7 }, g);
      keyAt(g, d, x, y, S, split);
      const toggle = () => { bricked.has(d.key) ? bricked.delete(d.key) : bricked.add(d.key); update(); };
      g.addEventListener("click", toggle);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
      mk[d.key] = g;
    }

    let wins = null;
    const exists = (out) => layout(new Set(KEYS.filter((k) => !out.has(k)))).checks.every((c) => c.closes);
    const winners = () => {
      if (wins) return wins;
      wins = [];
      for (let i = 0; i < KEYS.length; i++) for (let j = i + 1; j < KEYS.length; j++) for (let k = j + 1; k < KEYS.length; k++) {
        if (exists(new Set([KEYS[i], KEYS[j], KEYS[k]]))) wins.push([KEYS[i], KEYS[j], KEYS[k]]);
      }
      return wins;
    };

    function update() {
      for (const k in mk) mk[k].setAttribute("aria-pressed", String(bricked.has(k)));
      const lay = layout(new Set(KEYS.filter((k) => !bricked.has(k))));
      const bad = lay.checks.filter((c) => !c.closes);
      f.clear();
      f.print(`C:\\> bricked up: ${bricked.size ? [...bricked].sort().join(" ") : "nothing yet"}`);
      for (const c of bad) f.print(`   loop through ${c.key.padEnd(5)} comes home CHANGED: ${describe(c.hol)}`);
      if (bad.length) { f.print("   no placement of these rooms exists", true); return; }
      if (bricked.size === 3) f.print(`   every loop closes. The house exists. That's one of the ${winners().length} ways.`, true);
      else f.print(`   every loop closes. The house exists. (It only ever needed three.)`, true);
    }
    f.btn.clear.addEventListener("click", () => { bricked.clear(); update(); });
    f.btn.one.addEventListener("click", () => {
      const w = winners(), pick = w[Math.floor(Math.random() * w.length)];
      bricked.clear(); pick.forEach((k) => bricked.add(k)); update();
    });
    update();
  };

  // ---------- Fig. 6: built anyway ----------
  FIG.anyway = (fig) => {
    const f = frame(fig, { label: "Fig. 6, the house built anyway", lines: 6, buttons: [["turn", "\u21bb Turn about the stone"], ["all", "All four"], ["reset", "Reset"]] });
    const [sx, sy] = STONE, pb = planBox();
    const R = Math.max(...[[pb[0], pb[1]], [pb[2], pb[3]], [pb[0], pb[3]], [pb[2], pb[1]]].map(([x, y]) => Math.max(Math.abs(x - sx), Math.abs(y + sy)))) + 60;
    f.view([sx - R, -sy - R, sx + R, -sy + R]);
    drawPlan(f.svg, ALL.pose, { labels: false });
    const copies = [1, 2, 3].map(() => {
      const g = el("g", { class: "cd-copy off" }, f.svg);
      drawPlan(g, ALL.pose, { lines: true, labels: false });
      return g;
    });
    const S = R / 30;
    const stone = el("g", { class: "cd-stone-mark" }, f.svg);
    el("circle", { cx: sx, cy: -sy, r: 46 }, stone);
    const tag = note(f.svg, sx, -sy + S * 2.2, "", S * 1.05, "cd-note cd-note-b", "middle");
    const tag2 = note(f.svg, sx, -sy + S * 3.4, "", S * 0.9, "cd-note", "middle");
    let shown = 0;
    const setAngle = (g, a) => g.setAttribute("transform", `rotate(${a} ${sx} ${-sy})`);
    const lines = [
      "   copy 1: the house as it was drawn                 q^0",
      "   copy 2: the house turned 90 deg about the stone   q^1",
      "   copy 3: the house turned 180 deg about the stone  q^2",
      "   copy 4: the house turned 270 deg about the stone  q^3",
    ];
    async function turn(token) {
      if (shown >= 3) return;
      const g = copies[shown++];
      g.classList.remove("off");
      await tween(1100, (k) => setAngle(g, 90 * (shown - 1) + 90 * k), token, ease);
      f.print(lines[shown]);
      if (shown === 3) {
        tag.textContent = "THE COURT";
        tag2.textContent = "where all four houses agree";
        f.print("   q^4 = 1: one more turn lands on copy 1. Four houses, one stone.", true);
        f.print("   ...and all four again every 38'-8\" up the stair, and down, forever (s).");
      }
      sync();
    }
    const sync = () => { f.btn.turn.disabled = shown >= 3; f.btn.all.disabled = shown >= 3; };
    f.btn.turn.addEventListener("click", () => turn(f.fresh()));
    f.btn.all.addEventListener("click", async () => { const t = f.fresh(); while (shown < 3 && !t.dead) await turn(t); });
    f.btn.reset.addEventListener("click", () => {
      f.fresh(); shown = 0;
      copies.forEach((g) => { g.classList.add("off"); setAngle(g, 0); });
      tag.textContent = ""; tag2.textContent = "";
      f.clear(); f.print("C:\\> build it anyway: through every doorway, every route"); f.print(lines[0]);
      sync();
    });
    f.btn.reset.click();
  };

  function mount(root) {
    root.querySelectorAll("figure.cd-fig[data-fig]:not([data-ready])").forEach((fig) => {
      fig.dataset.ready = "1";
      try { FIG[fig.dataset.fig]?.(fig); } catch (e) { console.error("figure", fig.dataset.fig, e); }
    });
  }
  window.coeFigures = { mount, stop: () => halts.forEach((h) => h()), _test: { layout, walk, KEYS, ALL, describe, total } };
})();
