// The dreu folder. Clicking it on the SummerOS desktop plays a Windows 98
// "Copying..." dialog and opens a UIUC desktop: same windows, icons and
// taskbar as SummerOS, with a cornfield wallpaper and old-site neon signs.
// Logs open in Notepad, pictures in an image viewer, the Shor toy is an .exe.
// Built on first open so the homepage stays light. Also opens from /#dreu.
(() => {
  const IMG = "/index_me_images/web/";
  const AS = "/dreu/assets/";
  const GH = "https://github.com/simransummermalik/";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = window.matchMedia("(min-width: 900px)");

  // Each log's quotes are copied word for word from the weekly log pages.
  const WEEKS = [
    { n: "01", dates: "June 8 – 14, 2026", title: "getting oriented", img: ["uiuc.jpg", "A street on the UIUC campus"],
      quotes: ["This week was mostly focused on learning, orientation, and gathering context.",
        "The Parasol Lab meeting also made the research environment feel more concrete to me. It was helpful to see people presenting active research problems instead of only reading papers or background material on my own."],
      files: [] },
    { n: "02", dates: "June 15 – 21, 2026", title: "shor's algorithm = order finding",
      quotes: ["By the end of the week, I had a clearer understanding of how Shor's algorithm reduces factoring to order finding and why the QFT is central to extracting the period from the quantum state. I also understood that using a built-in QFT circuit is useful, but not enough for our project, because we need to understand what the transform is doing internally."],
      files: [["shors_notes.pdf", AS + "shors-notes.pdf"], ["shorsimulation repo", GH + "shorsimulation"]] },
    { n: "03", dates: "June 22 – 28, 2026", title: "the QFT, built by hand", circuit: true,
      quotes: ["By the end of the week, I had a working manual QFT and inverse QFT implementation. The manual QFT matched the built-in QFT up to global phase for the tested circuit sizes, and the QFT followed by inverse QFT worked as a round-trip identity check.",
        "When the input state has a known periodic structure, the inverse QFT concentrates probability near the expected Fourier peaks."],
      files: [["qft_n21.pdf", AS + "qft-n21.pdf"], ["qft_simulation.pdf", AS + "qftsimulation.pdf"], ["manual QFT repo", GH + "manualQuantumFourierTransformation"]] },
    { n: "04", dates: "June 29 – July 5, 2026", title: "into regev's algorithm",
      quotes: ["By the end of the week, we had started a Regev-focused implementation direction and created an initial circuit/prototype related to Regev's algorithm.",
        "Because this was also the week of the Fourth of July, the schedule felt a little different, but I still wanted to make progress and keep the project moving."],
      files: [["regevsqft repo", GH + "regevsqft"]] },
    { n: "05", dates: "July 6 – 12, 2026", title: "samples → lattice → LLL → factors",
      quotes: ["The biggest result this week was that the project moved from an exploratory Regev-style circuit notebook into a more complete finite-parameter research pipeline.",
        "This does not mean the project is a finished implementation of Regev's full factoring algorithm, but it is a much stronger experimental scaffold than the earlier circuit-only version."],
      files: [["TheoreticalComputing repo", GH + "TheoreticalComputing"]] },
    { n: "06", dates: "July 13 – 19, 2026", title: "tests, noise, and a beginner guide",
      quotes: ["The main result this week was that the project became more testable and more explainable. Adding more tests made the implementation feel less fragile. It also made it easier to separate genuine research results from accidental implementation behavior."],
      files: [["regev_manual.html", "/dreu/regev-manual/"]] },
    { n: "07", dates: "July 20 – 26, 2026", title: "the poster is done", img: ["poster-easel.jpg", "The quantum factoring poster on an easel"],
      quotes: ["This week felt like the point where the project started becoming something I could actually stand in front of people and explain.",
        "I am learning that research is not just getting one result. It is learning how to shape a messy, complicated process into something another person can inspect and understand."],
      files: [["srp_poster.pdf", AS + "quantumalgorithms%20CS%20SRP.pptx-3.pdf"]] },
    { n: "08", dates: "July 27 – August 2, 2026", title: "presenting!!", img: ["poster-me.jpg", "Summer presenting the quantum factoring poster"],
      quotes: ["This week I presented our poster. It was honestly really nice to watch the work become a conversation instead of something that only lived in code, notes, and experiment folders.",
        "Saying the work out loud also reminded me that explaining a technical result is part of doing the research."],
      files: [["presentation post", "https://lnkd.in/p/dszVZ6p9"]] },
    { n: "09", dates: "August 3 – 9, 2026", title: "factor-or-fuse", img: ["fig-heldout.png", "Stacked bar chart showing Factor-or-Fuse outcomes on 24 held-out semiprimes"],
      quotes: ["The frozen held-out test is useful precisely because it did not give the exciting answer I initially hoped for.",
        "I do not see that as a useless result."],
      files: [] },
  ];

  const CHARTS = [
    ["complexity_gap.png", "fig-complexity-gap.png", "Comparison between the implementation paper's displayed modular-addition count and the count executed by the source code (week 08)"],
    ["sim_models.png", "fig-sim-models.png", "Factor-recovery probability across four finite sampling models (week 08)"],
    ["dim_splitting.png", "fig-dim-splitting.png", "Splitting exponent bits across registers does not reduce the executed modular-addition count (week 09)"],
    ["heldout.png", "fig-heldout.png", "Factor-or-Fuse outcomes on 24 held-out semiprimes (week 09)"],
    ["cx_savings.png", "fig-cx-savings.png", "Mean quantum arithmetic CX savings with bootstrap intervals (week 09)"],
  ];
  const POSTER = [
    ["poster.jpg", "poster-me.jpg", "week 8: presenting the poster at UIUC"],
    ["poster_easel.jpg", "poster-easel.jpg", "Frontiers of Quantum Factoring Algorithms"],
  ];
  const NOTES = [
    ["shors_notes.pdf", AS + "shors-notes.pdf"],
    ["qft_n21.pdf", AS + "qft-n21.pdf"],
    ["qft_simulation.pdf", AS + "qftsimulation.pdf"],
    ["regev_implementation.pdf", AS + "RegevImplemetation.pdf"],
    ["srp_poster.pdf", AS + "quantumalgorithms%20CS%20SRP.pptx-3.pdf"],
    ["shorsimulation.url", GH + "shorsimulation"],
    ["manual_qft.url", GH + "manualQuantumFourierTransformation"],
    ["regevsqft.url", GH + "regevsqft"],
    ["theoretical_computing.url", GH + "TheoreticalComputing"],
  ];
  // photos from the summer that pop up when the folder opens
  const SNAPS = [
    { id: "talbot", title: "talbot_lab.jpg", src: IMG + "talbot-lab.jpg", w: 843, h: 1100, alt: "The entrance of Talbot Laboratory at UIUC, carved Materials Testing above the door", cap: "Talbot Laboratory, materials testing", pos: "--fx:0; --y:22px; --w:210px" },
    { id: "hal", title: "hal_9000.jpg", src: IMG + "hal-display.jpg", w: 1100, h: 794, alt: "A display case about HAL 9000 and Cyberfest at the University of Illinois, with a Wired cover and old newspaper clippings", cap: "HAL 9000 \u201cbecame operational\u201d in Urbana, Illinois", pos: "--fx:1; --y:18px; --w:290px" },
    { id: "selfie", title: "me_at_uiuc.jpg", src: IMG + "illini-selfie.jpg", w: 1000, h: 578, alt: "Summer in an Illinois hoodie with earbuds, by a window", cap: "me, mid-research", pos: "--fx:1; --y:304px; --w:290px" },
    { id: "july", title: "fourth_of_july.mp4", video: "/video/fourth-of-july.mp4", poster: "/video/fourth-of-july-poster.jpg", alt: "Fireworks on the Fourth of July in Champaign", cap: "4th of july on campus", pos: "--fx:0; --y:372px; --w:200px" },
  ];
  const CRA = "https://cra.org/crn/2026/10/dreu-qis-students-at-ieee-quantum-week-from-summer-research-to-the-quantum-research-community/";

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ext = (href) => (href.startsWith("http") || href.endsWith(".pdf") ? ' target="_blank" rel="noreferrer"' : "");

  // ---------- wallpaper: the Illinois Block I, scattered like stickers ----------
  // Shape traced from the Block I image: white outline, orange inside.
  const BLOCK_I = `<svg viewBox="-2 -2 208 296" aria-hidden="true"><path fill="#ffffff" d="M0 0H204V76H158V218H204V292H0V218H46V76H0Z"/><path fill="#e84a27" d="M11 11H193V65H147V229H193V281H11V229H57V65H11Z"/></svg>`;
  function blockIsHTML() {
    const W = Math.max(window.innerWidth, 400), H = Math.max(window.innerHeight, 500);
    const cw = W < 900 ? 110 : 150, ch = W < 900 ? 140 : 180;
    let out = "";
    for (let y = -40; y < H + 40; y += ch) {
      const row = Math.round(y / ch);
      for (let x = -40 + (row % 2 ? cw / 2 : 0); x < W + 40; x += cw) {
        const size = 70 + Math.random() * 70;
        const left = x + (Math.random() - 0.5) * cw * 0.5, top = y + (Math.random() - 0.5) * ch * 0.4;
        const tilt = (Math.random() - 0.5) * 34;
        out += `<span class="dw-i" style="left:${left.toFixed(0)}px; top:${top.toFixed(0)}px; height:${size.toFixed(0)}px; rotate:${tilt.toFixed(1)}deg; z-index:${Math.floor(Math.random() * 5)}">${BLOCK_I}</span>`;
      }
    }
    return out;
  }

  const CIRCUIT = `<svg viewBox="0 0 320 110" role="img" aria-label="A three-qubit QFT circuit: Hadamard gates, controlled phase rotations, and a final swap">
      <g stroke="#13294b" stroke-width="2" fill="none"><path d="M10 20H310M10 55H310M10 90H310"/></g>
      <g font-family="Courier New, monospace" font-size="12" font-weight="bold" text-anchor="middle">
        <rect x="24" y="8" width="28" height="24" fill="#ff5f05"/><text x="38" y="25" fill="#fff">H</text>
        <rect x="70" y="8" width="30" height="24" fill="#fff" stroke="#13294b" stroke-width="2"/><text x="85" y="25" fill="#13294b">R2</text>
        <circle cx="85" cy="55" r="4.5" fill="#13294b"/><path d="M85 32V51" stroke="#13294b" stroke-width="2"/>
        <rect x="118" y="8" width="30" height="24" fill="#fff" stroke="#13294b" stroke-width="2"/><text x="133" y="25" fill="#13294b">R3</text>
        <circle cx="133" cy="90" r="4.5" fill="#13294b"/><path d="M133 32V86" stroke="#13294b" stroke-width="2"/>
        <rect x="166" y="43" width="28" height="24" fill="#ff5f05"/><text x="180" y="60" fill="#fff">H</text>
        <rect x="212" y="43" width="30" height="24" fill="#fff" stroke="#13294b" stroke-width="2"/><text x="227" y="60" fill="#13294b">R2</text>
        <circle cx="227" cy="90" r="4.5" fill="#13294b"/><path d="M227 67V86" stroke="#13294b" stroke-width="2"/>
        <rect x="258" y="78" width="28" height="24" fill="#ff5f05"/><text x="272" y="95" fill="#fff">H</text>
        <path d="M296 14l8 12M304 14l-8 12M296 84l8 12M304 84l-8 12M300 20V90" stroke="#13294b" stroke-width="2"/>
      </g></svg>`;

  // ---------- window markup (same structure as the SummerOS page windows) ----------
  function win(id, cls, title, pos, inner, { hidden = true, label } = {}) {
    return `<section class="window ${cls}" id="${id}" tabindex="-1"${hidden ? " hidden" : ""} style="${pos}" aria-label="${esc(label || title)}">
        <header class="titlebar"><h2>${esc(title)}</h2>
          <button type="button" data-a="min" aria-label="Minimize ${esc(title)}">_</button>
          <button type="button" data-a="close" aria-label="Close ${esc(title)}">&times;</button>
        </header>${inner}</section>`;
  }
  const docIco = `<span class="ico doc"></span>`;
  const folderIco = (img) => `<span class="ico folder"><img src="${IMG + img}" alt=""></span>`;
  const picIco = (img) => `<span class="ico dw-pic"><img src="${IMG + img}" alt=""></span>`;

  const FOLDER_ITEMS = [
    ...WEEKS.map((w) => ({ act: `log:${w.n}`, ico: docIco, label: `week_${w.n}.log`, desc: `<b>week_${w.n}.log</b><br>Text Document<br><br>${esc(w.dates)}<br>${esc(w.title)}` })),
    { act: "poster", ico: picIco("poster-me.jpg"), label: "poster.jpg", desc: "<b>poster.jpg</b><br>JPEG Image<br><br>the poster I presented in week 8" },
    { act: "toy", ico: `<span class="ico exe toy"></span>`, label: "shor_toy.exe", desc: "<b>shor_toy.exe</b><br>Application<br><br>factor a number the way Shor's algorithm does: find the period, then take a gcd" },
    { act: "pics", ico: folderIco("talbot-lab.jpg"), label: "summer_pics", desc: "<b>summer_pics</b><br>File Folder<br><br>Talbot Lab, HAL 9000, me, and 4th of july fireworks" },
    { act: "results", ico: folderIco("fig-sim-models.png"), label: "results", desc: "<b>results</b><br>File Folder<br><br>5 charts from weeks 8 and 9" },
    { act: "notes", ico: folderIco("poster-easel.jpg"), label: "notes", desc: "<b>notes</b><br>File Folder<br><br>PDFs and GitHub repos from the summer" },
    { act: "cra", ico: `<span class="ico doc loud"></span>`, label: "cra_news.html", desc: "<b>cra_news.html</b><br>HTML Document<br><br>we made the news!! CRA, October 2026" },
    { act: "go:/dreu/regev-manual/", ico: docIco, label: "regev_manual.html", desc: "<b>regev_manual.html</b><br>HTML Document<br><br>my beginner-readable manual for the Regev-style circuit and lattice post-processing repository" },
    { act: "go:/dreu/", ico: docIco, label: "all_logs.html", desc: "<b>all_logs.html</b><br>HTML Document<br><br>the plain version of this whole folder" },
  ];
  const DEFAULT_DESC = `DREU-QIS @ UIUC<br>summer 2026<br>mentor: <a href="https://granha.github.io" target="_blank" rel="noreferrer">Dr. Fernando Granha Jeronimo</a><br><br>Select an item to view its description.`;

  function fileGrid(items, label) {
    return `<ul class="dw-grid" role="listbox" aria-label="${esc(label)}">${items.map((it, i) =>
      `<li><button type="button" class="dw-file" role="option" aria-selected="false" data-act="${esc(it.act)}" data-i="${i}">${it.ico}<span class="label">${esc(it.label)}</span></button></li>`).join("")}</ul>`;
  }

  function template() {
    const explorer = win("dw-explorer", "dw-explorer-win", "C:\\summer\\dreu", "--fx:0.5; --y:22px; --w:clamp(520px, 44vw, 640px)", `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div>
        <div class="dw-toolbar"><button type="button" class="btn" data-up>&uarr; Up</button><button type="button" class="btn" data-act="go:/dreu/">plain view</button></div>
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\dreu</span></div>
        <div class="pane dw-folder">
          <aside class="dw-webview" aria-live="polite">
            <span class="big" aria-hidden="true">${folderIco("uiuc.jpg")}</span>
            <h3>dreu</h3><div class="dw-rule"></div>
            <div class="dw-desc">${DEFAULT_DESC}</div>
          </aside>
          ${fileGrid(FOLDER_ITEMS, "Files in dreu")}
        </div>
        <div class="statusbar"><span>${FOLDER_ITEMS.length} object(s) &middot; double-click to open</span><span class="dw-ctime">Urbana-Champaign</span></div>`, { hidden: false, label: "dreu folder" });

    const viewer = win("dw-viewer", "dw-viewer", "poster.jpg - Image Viewer", "--fx:0.9; --y:40px; --w:380px", `
        <div class="dw-nav"><button type="button" class="btn" data-v="-1" aria-label="Previous picture">&lsaquo; prev</button><button type="button" class="btn" data-v="1" aria-label="Next picture">next &rsaquo;</button></div>
        <div class="pane"><img alt=""></div>
        <p class="dw-cap"></p>`, { label: "Image viewer" });

    const results = win("dw-results", "dw-subfolder", "C:\\summer\\dreu\\results", "--fx:0.38; --y:90px; --w:520px", `
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\dreu\\results</span></div>
        <div class="pane" style="padding:0">${fileGrid(CHARTS.map(([name, src]) => ({ act: `chart:${name}`, ico: picIco(src), label: name })), "Charts")}</div>
        <div class="statusbar"><span>${CHARTS.length} object(s)</span><span>weeks 8 + 9</span></div>`);

    const notes = win("dw-notes", "dw-subfolder", "C:\\summer\\dreu\\notes", "--fx:0.46; --y:120px; --w:540px", `
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\dreu\\notes</span></div>
        <div class="pane" style="padding:0">${fileGrid(NOTES.map(([name, href]) => ({ act: `go:${href}`, ico: docIco, label: name })), "Notes")}</div>
        <div class="statusbar"><span>${NOTES.length} object(s)</span><span>opens in a new tab</span></div>`);

    const cra = win("dw-cra", "browser", "cra_news.html - Summer Explorer", "--fx:0.62; --y:70px; --w:430px", `
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">cra.org/crn/2026/10/dreu-qis-students-at-ieee-quantum-week</span></div>
        <div class="pane"><div class="news" style="grid-template-columns:1fr">
          <img src="${IMG}cra-cohort.jpg" alt="The DREU-QIS cohort at IEEE Quantum Week 2026" width="1200" height="672" loading="lazy">
          <div><h3>we made the news!!</h3><p>CRA featured our DREU-QIS crew at IEEE Quantum Week in Toronto.</p><a href="${CRA}" target="_blank" rel="noreferrer">read the CRA story &rarr;</a></div>
        </div></div>`);

    const toy = win("dw-toy", "dw-toywin", "shor_toy.exe", "--fx:0.5; --y:36px; --w:540px", `
        <div class="pane scroll">
          <div class="dw-controls">
            <label>N = <input type="number" class="dw-n" min="6" max="999" value="15" inputmode="numeric"></label>
            <label>a = <input type="number" class="dw-a" min="2" max="998" value="7" inputmode="numeric"></label>
            <button type="button" class="btn primary dw-run">factor it</button>
            <button type="button" class="btn dw-rand">random a</button>
            <span>try: <button type="button" class="btn" data-n="15" data-a="7">15</button> <button type="button" class="btn" data-n="21" data-a="2">21</button> <button type="button" class="btn" data-n="35" data-a="3">35</button> <button type="button" class="btn" data-n="91" data-a="3">91</button></span>
          </div>
          <ol class="dw-steps" aria-live="polite"></ol>
          <div class="dw-chart-wrap" hidden>
            <canvas class="dw-chart" role="img" aria-label="Probability of each measurement outcome after the inverse QFT"></canvas>
            <p class="dw-chart-note"></p>
            <div class="dw-noise"><label for="dw-noise">depolarizing noise:</label><input type="range" id="dw-noise" min="0" max="100" step="5" value="0"><output for="dw-noise"></output></div>
            <p class="dw-chart-note"><i>week 3: depolarizing noise was the most damaging noise model I tested. slide it and watch the peaks drown.</i></p>
          </div>
        </div>
        <div class="statusbar" aria-hidden="true"><span>the quantum part finds r. everything else is classical.</span><span>shor_toy.exe</span></div>`);

    const copy = win("dw-copy", "dw-copy", "Copying...", "", `
        <div class="pane">
          <div class="dw-fly-row" aria-hidden="true">${folderIco("uiuc.jpg")}<span class="dw-paper"></span><span class="ico folder"><img src="${IMG}poster-me.jpg" alt=""></span></div>
          <div>summer_2026</div>
          <div>From 'Urbana-Champaign' to 'C:\\summer\\dreu'</div>
          <div class="dw-progress" aria-hidden="true">${"<i></i>".repeat(28)}</div>
          <div class="dw-left">9 logs remaining</div>
          <div class="actions"><button type="button" class="btn" data-skip>Cancel</button></div>
        </div>`, { hidden: true, label: "Copying" });

    const icons = [
      ["back", `<span class="ico folder"><img src="${IMG}booth-1.jpg" alt=""></span>`, "\u2190 back to summer"],
      ["folder", folderIco("uiuc.jpg"), "dreu"],
      ["toy", `<span class="ico exe toy"></span>`, "shor_toy.exe"],
      ["poster", picIco("poster-me.jpg"), "poster.jpg"],
      ["sound", `<span class="ico dw-wav"></span>`, "cicadas.wav"],
    ];

    return `
      <div class="dw-wall" aria-hidden="true">${blockIsHTML()}</div>
      <ul class="icons" aria-label="UIUC desktop">${icons.map(([act, ico, label]) => `<li><button class="icon" type="button" data-icon="${act}">${ico}<span class="label">${label}</span></button></li>`).join("")}</ul>
      ${SNAPS.map(snapWindow).join("")}${explorer}${viewer}${results}${notes}${cra}${toy}${copy}
`;
  }

  function snapWindow(p) {
    const media = p.video
      ? `<video muted loop playsinline preload="none" poster="${p.poster}" aria-label="${esc(p.alt)}"><source src="${p.video}" type="video/mp4"></video>`
      : `<img src="${p.src}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy">`;
    return win(`dw-snap-${p.id}`, "dw-snap", p.title, p.pos, `<div class="pane">${media}</div><p class="dw-cap">${esc(p.cap)}</p>`);
  }

  function popPics(delay = 0) {
    SNAPS.forEach((p, i) => setTimeout(() => {
      if (!isOpen) return;
      const w = $(`#dw-snap-${p.id}`);
      w.classList.remove("dw-popin"); void w.offsetWidth; w.classList.add("dw-popin");
      showW(w, false);
      const v = w.querySelector("video");
      if (v) v.play().catch(() => {});
    }, reduced ? 0 : delay + i * 260));
  }

  function logWindow(w, k) {
    const i = WEEKS.indexOf(w);
    const visual = w.img ? `<img src="${IMG + w.img[0]}" alt="${esc(w.img[1])}" loading="lazy">` : w.circuit ? CIRCUIT : "";
    const files = w.files.map(([label, href]) => `<a class="btn" href="${href}"${ext(href)}>${esc(label)}</a>`).join("");
    const prev = i > 0 ? `<button type="button" class="btn" data-act="log:${WEEKS[i - 1].n}">&lsaquo; week_${WEEKS[i - 1].n}</button>` : "";
    const next = i < WEEKS.length - 1 ? `<button type="button" class="btn" data-act="log:${WEEKS[i + 1].n}">week_${WEEKS[i + 1].n} &rsaquo;</button>` : "";
    return win(`dw-log-${w.n}`, "notepad", `week_${w.n}.log - Notepad`, `--fx:${(0.22 + (k % 6) * 0.05).toFixed(2)}; --y:${40 + (k % 6) * 28}px; --w:440px`, `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Format</span><span>Help</span></div>
        <div class="pane scroll dw-log">
          <h1>week ${w.n}</h1>
          <p class="when">${esc(w.dates)} &middot; UIUC</p>
          <h2>${esc(w.title)}</h2>
          ${visual}
          ${w.quotes.map((q) => `<p class="me">${esc(q)}</p>`).join("")}
          <div class="files-row"><a class="btn primary" href="/dreu/logs/week-${w.n}.html">open the full log</a>${files}</div>
          <div class="files-row" style="margin-top:10px">${prev}${next}</div>
        </div>
        <div class="statusbar" aria-hidden="true"><span>quoted from my week ${w.n} log</span><span>${i + 1} of 9</span></div>`);
  }

  // ---------- shor toy ----------
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const modpow = (b, e, m) => { let r = 1; b %= m; for (let i = 0; i < e; i++) r = (r * b) % m; return r; };
  const isPrime = (n) => { if (n < 2) return false; for (let p = 2; p * p <= n; p++) if (n % p === 0) return false; return true; };
  const primePower = (n) => { for (let p = 2; p * p <= n; p++) { if (n % p) continue; let m = n; while (m % p === 0) m /= p; return m === 1 ? p : 0; } return 0; };
  let chartState = null;

  function runToy() {
    const steps = $(".dw-steps"), chart = $(".dw-chart-wrap");
    const N = Math.round(Number($(".dw-n").value));
    let a = Math.round(Number($(".dw-a").value));
    const li = (n, html, q) => `<li${q ? ' class="quantum"' : ""}><span class="n">${n}</span><div>${html}</div></li>`;
    const res = (t, fail) => `<li class="full"><p class="dw-result${fail ? " fail" : ""}">${t}</p></li>`;
    chart.hidden = true; chartState = null;
    if (!Number.isFinite(N) || N < 6 || N > 999) { steps.innerHTML = li("!", "Pick an N between 6 and 999."); return; }
    if (N % 2 === 0) { steps.innerHTML = li(1, `N = ${N} is even, so no quantum computer needed:`) + res(`${N} = 2 \u00d7 ${N / 2}`); return; }
    if (isPrime(N)) { steps.innerHTML = li(1, `${N} is prime. Nothing to factor!`) + res(`${N} is prime`, true); return; }
    const pp = primePower(N);
    if (pp) { steps.innerHTML = li(1, `${N} is a power of one prime. Shor's trick needs two different prime factors, but a classical check catches this:`) + res(`${N} = ${pp}<sup>${Math.round(Math.log(N) / Math.log(pp))}</sup>`); return; }
    if (!Number.isFinite(a) || a < 2 || a > N - 2) { a = 2 + Math.floor(Math.random() * (N - 3)); $(".dw-a").value = a; }
    let html = "";
    const g = gcd(a, N);
    if (g > 1) { steps.innerHTML = li(1, `Check <code>gcd(${a}, ${N}) = ${g}</code>. Lucky: <i>a</i> already shares a factor with <i>N</i>.`) + res(`${N} = ${g} \u00d7 ${N / g}`); return; }
    html += li(1, `Check <code>gcd(${a}, ${N}) = 1</code>. No free factor, so we need the period.`);
    let r = 0, v = 1;
    for (let x = 1; x <= 1000; x++) { v = (v * a) % N; if (v === 1) { r = x; break; } }
    const show = Math.min(Math.max(r * 2 + 1, 8), 36);
    let tiles = "";
    for (let x = 0; x < show; x++) {
      const val = modpow(a, x, N);
      tiles += `<span class="dw-tile${x % r === 0 ? " start" : ""}" style="background:hsl(218 ${(35 + (val / N) * 30).toFixed(0)}% ${(20 + (val / N) * 42).toFixed(0)}%); animation-delay:${(x * 0.04).toFixed(2)}s" title="${a}^${x} mod ${N} = ${val}">${val}<small>x=${x}</small></span>`;
    }
    html += li(2, `Compute <code>${a}<sup>x</sup> mod ${N}</code> for x = 0, 1, 2, ... It repeats every <b>r = ${r}</b>. <i>(This is the step a quantum computer does with the QFT.)</i><div class="dw-tiles">${tiles}</div>`, true);
    if (r % 2 === 1) { steps.innerHTML = html + li(3, `r = ${r} is odd, so the trick doesn't work for this <i>a</i>.`) + res(`unlucky a. hit "random a"!`, true); drawChart(N, r); return; }
    const y = modpow(a, r / 2, N);
    if (y === N - 1) { steps.innerHTML = html + li(3, `<code>${a}<sup>${r / 2}</sup> mod ${N} = ${y} \u2261 \u22121</code>, which only gives trivial factors.`) + res(`unlucky a. hit "random a"!`, true); drawChart(N, r); return; }
    const p = gcd(y - 1, N), q = gcd(y + 1, N);
    html += li(3, `r is even, so take <code>${a}<sup>${r / 2}</sup> mod ${N} = ${y}</code>, then <code>gcd(${y} \u2212 1, ${N}) = ${p}</code> and <code>gcd(${y} + 1, ${N}) = ${q}</code>.`);
    steps.innerHTML = html + res(`${N} = ${Math.min(p, q)} \u00d7 ${Math.max(p, q)} \u2713`);
    drawChart(N, r);
  }

  function drawChart(N, r) {
    let m = 1; while ((1 << m) < N * N && m < 20) m++;
    const q = 1 << m, M = Math.ceil(q / r), P = new Float64Array(q);
    for (let y = 0; y < q; y++) {
      const s = Math.sin((Math.PI * y * r) / q);
      P[y] = Math.abs(s) < 1e-12 ? M / q : Math.sin((Math.PI * y * r * M) / q) ** 2 / (s * s) / (q * M);
    }
    chartState = { r, q, P };
    $(".dw-chart-wrap").hidden = false;
    $(".dw-chart-note").innerHTML = `Inverse QFT on a ${m}-qubit counting register (${q.toLocaleString()} outcomes). The probability piles up at multiples of q/r = ${q.toLocaleString()}/${r}${q % r === 0 ? ` = ${q / r}` : ` \u2248 ${(q / r).toFixed(1)}`}; continued fractions on a measured y/q recover r = ${r}.`;
    paint();
  }

  function paint() {
    if (!chartState || $("#dw-toy").hidden) return;
    const { r, q, P } = chartState, canvas = $(".dw-chart");
    const noise = Number($("#dw-noise").value) / 100, dpr = window.devicePixelRatio || 1;
    const W = Math.max(200, canvas.clientWidth), H = canvas.clientHeight || 150;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr);
    ctx.fillStyle = "#0b1a33"; ctx.fillRect(0, 0, W, H);
    const bins = Math.min(W, q), vals = new Float64Array(bins);
    let max = 0, onPeak = 0;
    for (let y = 0; y < q; y++) {
      const p = (1 - noise) * P[y] + noise / q, b = Math.floor((y / q) * bins);
      if (p > vals[b]) vals[b] = p;
      if (p > max) max = p;
      if (Math.abs(y - (Math.round((y * r) / q) * q) / r) < 1) onPeak += p;
    }
    const base = H - 16, bw = W / bins;
    ctx.fillStyle = "#ff5f05";
    for (let b = 0; b < bins; b++) { const h = (vals[b] / max) * (base - 8); ctx.fillRect(b * bw, base - h, Math.max(1, bw - (bw > 3 ? 1 : 0)), h); }
    ctx.fillStyle = "#f2c14e";
    for (let j = 0; j < r; j++) { const x = (j / r) * W; ctx.beginPath(); ctx.moveTo(x, base + 3); ctx.lineTo(x - 4, base + 11); ctx.lineTo(x + 4, base + 11); ctx.fill(); }
    $(".dw-noise output").textContent = `${Math.round(noise * 100)}% \u2192 lands on a peak ${Math.round(onPeak * 100)}% of the time`;
  }

  // ---------- clock + sound ----------
  const chiTime = () => new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(new Date());
  let clockTimer = 0;
  function tick() { $(".dw-ctime").textContent = `Urbana-Champaign ${chiTime()}`; }
  let audio = null;
  function startSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx(), master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const band = ctx.createBiquadFilter(); band.type = "bandpass"; band.frequency.value = 4600; band.Q.value = 6;
    const buzz = ctx.createGain(); buzz.gain.value = 0.02;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 28; const lfoAmt = ctx.createGain(); lfoAmt.gain.value = 0.015;
    const swell = ctx.createOscillator(); swell.frequency.value = 0.08; const swellAmt = ctx.createGain(); swellAmt.gain.value = 0.012;
    lfo.connect(lfoAmt).connect(buzz.gain); swell.connect(swellAmt).connect(buzz.gain);
    noise.connect(band).connect(buzz).connect(master); noise.start(); lfo.start(); swell.start();
    const notes = [523.25, 587.33, 659.25, 783.99, 880];
    const bell = () => {
      const f = notes[Math.floor(Math.random() * notes.length)], t = ctx.currentTime;
      [1, 2.76, 5.4].forEach((k, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f * k; g.gain.setValueAtTime(0.06 / (i + 1), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
        o.connect(g).connect(master); o.start(t); o.stop(t + 3.3);
      });
    };
    bell();
    audio = { ctx, timer: setInterval(bell, 9000 + Math.random() * 8000) };
    $(".dw-wav").classList.add("on");
    $('[data-icon="sound"] .label').textContent = "cicadas.wav (on)";
  }
  function stopSound() {
    if (!audio) return;
    clearInterval(audio.timer); audio.ctx.close(); audio = null;
    $(".dw-wav").classList.remove("on");
    $('[data-icon="sound"] .label').textContent = "cicadas.wav";
  }

  // ---------- windows ----------
  let root = null, z = 20, isOpen = false, pushed = false, lastTrigger = null, task = null, logCount = 0;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];

  function focusW(w) { w.style.zIndex = ++z; $$(".window").forEach((x) => x.classList.toggle("inactive", x !== w)); }
  function showW(w, moveFocus = true) {
    w.hidden = false; focusW(w);
    if (!moveFocus) return;
    w.focus({ preventScroll: wide.matches });
    if (!wide.matches) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }
  function hideW(w) {
    if (w.id === "dw-explorer") { close(); return; }
    w.hidden = true;
    if (w.id === "dw-toy") $("#dw-noise").blur();
    w.querySelector("video")?.pause();
  }
  function wireWindow(w) {
    w.addEventListener("pointerdown", () => focusW(w));
    w.querySelector('[data-a="close"]').addEventListener("click", () => hideW(w));
    w.querySelector('[data-a="min"]').addEventListener("click", () => hideW(w));
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

  let viewerList = POSTER, viewerI = 0;
  function showPictures(list, i) {
    viewerList = list; viewerI = (i + list.length) % list.length;
    const [name, src, cap] = list[viewerI], w = $("#dw-viewer"), img = w.querySelector("img");
    w.querySelector(".titlebar h2").textContent = `${name} - Image Viewer`;
    img.src = IMG + src; img.alt = cap;
    w.querySelector(".dw-cap").innerHTML = esc(cap) + (list === POSTER ? ` &middot; <a href="/dreu/logs/week-08.html">have your poster explained !!</a>` : "");
    w.querySelector(".dw-nav").hidden = list.length < 2;
    showW(w);
  }

  function act(a) {
    if (a.startsWith("log:")) {
      const w = WEEKS.find((x) => x.n === a.slice(4));
      let el = $(`#dw-log-${w.n}`);
      if (!el) {
        root.append(document.createRange().createContextualFragment(logWindow(w, logCount++)));
        el = $(`#dw-log-${w.n}`); wireWindow(el); wireActs(el);
      }
      showW(el);
    } else if (a.startsWith("chart:")) {
      const i = CHARTS.findIndex((c) => c[0] === a.slice(6));
      showPictures(CHARTS, i);
    } else if (a.startsWith("go:")) {
      const href = a.slice(3);
      if (ext(href)) window.open(href, "_blank", "noopener"); else location.href = href;
    } else if (a === "poster") showPictures(POSTER, 0);
    else if (a === "toy") { showW($("#dw-toy")); paint(); }
    else if (a === "pics") popPics();
    else if (a === "results") showW($("#dw-results"));
    else if (a === "notes") showW($("#dw-notes"));
    else if (a === "cra") showW($("#dw-cra"));
  }

  // Explorer-style files: click selects (and shows the description), double-click opens.
  function wireActs(scope) {
    scope.querySelectorAll("[data-act]").forEach((el) => {
      if (el.classList.contains("dw-file")) {
        el.addEventListener("click", (e) => {
          const list = el.closest(".dw-grid");
          list.querySelectorAll(".dw-file").forEach((f) => f.setAttribute("aria-selected", String(f === el)));
          const desc = el.closest(".dw-folder")?.querySelector(".dw-desc");
          if (desc) {
            const item = FOLDER_ITEMS[Number(el.dataset.i)];
            desc.innerHTML = `${item.desc}<br><br><a href="#" class="dw-open-link">open it &rarr;</a>`;
            desc.querySelector(".dw-open-link").addEventListener("click", (ev) => { ev.preventDefault(); act(el.dataset.act); });
          }
          if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) act(el.dataset.act); // keyboard Enter or touch
        });
        el.addEventListener("dblclick", () => act(el.dataset.act));
      } else {
        el.addEventListener("click", () => act(el.dataset.act));
      }
    });
  }

  function build() {
    root = document.createElement("div");
    root.className = "dw";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "dreu folder: summer 2026 at UIUC");
    root.innerHTML = template();
    document.body.append(root);

    $$(".window").forEach(wireWindow);
    wireActs(root);
    $("[data-up]").addEventListener("click", () => close());
    $$("[data-v]").forEach((b) => b.addEventListener("click", () => showPictures(viewerList, viewerI + Number(b.dataset.v))));
    $$("[data-icon]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.icon;
      if (k === "back") close();
      else if (k === "folder") showW($("#dw-explorer"));
      else if (k === "sound") (audio ? stopSound() : startSound());
      else act(k);
    }));

    $(".dw-run").addEventListener("click", runToy);
    $(".dw-rand").addEventListener("click", () => { const N = Math.round(Number($(".dw-n").value)) || 15; $(".dw-a").value = 2 + Math.floor(Math.random() * Math.max(1, N - 3)); runToy(); });
    $$("[data-n]").forEach((b) => b.addEventListener("click", () => { $(".dw-n").value = b.dataset.n; $(".dw-a").value = b.dataset.a; runToy(); }));
    $$(".dw-n, .dw-a").forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") runToy(); }));
    $("#dw-noise").addEventListener("input", paint);
    window.addEventListener("resize", () => { if (isOpen) { placeOverTaskbar(); paint(); } });

    root.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      const top = $$(".window:not([hidden])").filter((w) => w.id !== "dw-explorer" && w.id !== "dw-copy").sort((a, b) => (Number(b.style.zIndex) || 0) - (Number(a.style.zIndex) || 0))[0];
      if (top) hideW(top); else close();
    });
    runToy();
  }

  // keep the real SummerOS taskbar visible (bottom bar, or the platinum top bar)
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
    task.type = "button"; task.className = "task"; task.textContent = "C:\\summer\\dreu"; task.setAttribute("aria-pressed", "true");
    task.addEventListener("click", () => {
      if (root.hidden) { root.hidden = false; task.setAttribute("aria-pressed", "true"); document.documentElement.style.overflow = "hidden"; }
      else { root.hidden = true; task.setAttribute("aria-pressed", "false"); document.documentElement.style.overflow = ""; }
    });
    tasks.append(task);
  }

  function zoomFrom(trigger) {
    return new Promise((resolve) => {
      if (reduced || !trigger || !trigger.getBoundingClientRect) { resolve(); return; }
      const a = trigger.getBoundingClientRect(), top = parseFloat(root.style.top) || 0, bottom = parseFloat(root.style.bottom) || 0;
      const b = { left: 0, top, width: window.innerWidth, height: window.innerHeight - top - bottom };
      const z0 = document.createElement("div"); z0.className = "dw-zoom"; document.body.append(z0);
      const frame = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      const anim = z0.animate([frame(a), frame({ left: b.left + 20, top: b.top + 16, width: b.width - 40, height: b.height - 32 })], { duration: 260, easing: "ease-in" });
      anim.onfinish = () => { z0.remove(); resolve(); };
    });
  }

  function copyDialog() {
    return new Promise((resolve) => {
      const dlg = $("#dw-copy");
      if (reduced) { resolve(); return; }
      const box = root.getBoundingClientRect();
      dlg.style.left = `${Math.max(10, box.width / 2 - 195)}px`; dlg.style.top = `${Math.max(10, box.height / 2 - 120)}px`;
      showW(dlg, false); dlg.style.zIndex = 900;
      const blocks = dlg.querySelectorAll(".dw-progress i"), left = dlg.querySelector(".dw-left");
      let k = 0, done = false;
      const finish = () => { if (done) return; done = true; clearInterval(t); dlg.hidden = true; resolve(); };
      const t = setInterval(() => {
        if (k < blocks.length) blocks[k++].style.visibility = "visible";
        const n = Math.max(0, 9 - Math.floor((k / blocks.length) * 9));
        left.textContent = `${n} log${n === 1 ? "" : "s"} remaining`;
        if (k >= blocks.length) setTimeout(finish, 180);
      }, 48);
      dlg.querySelector("[data-skip]").onclick = finish;
    });
  }

  async function open(trigger) {
    if (!root) build();
    if (task && root.hidden && isOpen) { task.click(); return; }
    if (isOpen) return;
    isOpen = true;
    lastTrigger = trigger || document.activeElement;
    placeOverTaskbar();
    tick();
    clockTimer = setInterval(tick, 20000);
    $$(".window").forEach((w) => { w.hidden = true; });
    await zoomFrom(trigger);
    root.hidden = false;
    document.documentElement.style.overflow = "hidden";
    addTask();
    if (location.hash !== "#dreu") { history.pushState({ dreu: 1 }, "", "#dreu"); pushed = true; }
    await copyDialog();
    if (!isOpen) return;
    popPics();
    setTimeout(() => {
      if (!isOpen) return;
      showW($("#dw-explorer"), false);
      $("#dw-explorer").focus({ preventScroll: true });
    }, reduced ? 0 : SNAPS.length * 260 + 120);
  }

  function close(fromHistory) {
    if (!isOpen) return;
    isOpen = false;
    stopSound();
    $$("video").forEach((v) => v.pause());
    clearInterval(clockTimer);
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
    if (isOpen && location.hash !== "#dreu") close(true);
    else if (!isOpen && location.hash === "#dreu") open();
  });

  // the dreu folder icon, its explorer window's "Open folder" button, or anything with data-dreu-world
  document.addEventListener("click", (e) => {
    const t = e.target.closest('[data-open="win-dreu"], #win-dreu .btn.primary, [data-dreu-world]');
    if (!t || document.body.classList.contains("plain-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    open(t);
  }, true);

  if (location.hash === "#dreu") open();
  window.dreuFolder = { open, close };
})();
