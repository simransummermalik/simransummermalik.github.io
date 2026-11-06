// hackathon wins: pops up on the SummerOS desktop as a timeline window.
// Clicking a project opens its README write-up (from its repo / Devpost)
// beside its photos in a clean grid; the other windows step aside until you
// close the README. Opens from the desktop icon, the start menu, or /#hackathons.
(() => {
  const IMG = "/index_me_images/web/hack/";
  const GH = "https://github.com/";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = window.matchMedia("(min-width: 900px)");

  // ---- the wins. "quote" is Summer's own words; the rest is the write-up. ----
  // pics: [file, caption, width, height, "fig" = show whole image (charts, slides, screenshots)]
  const HACKS = [
    {
      id: "duquantum", folder: "duquantum_2026", project: "Cat qubit readout", event: "DuQuantum 2026", where: "Duke University", when: "Oct 2026",
      awards: ["1st Place Overall", "1st Place, Alice & Bob track", "Best Use of ElevenLabs (MLH)"],
      tagline: "Can a cat qubit\u2019s own ringing be used to read it, without wrecking it?",
      quote: "Essentially, I explored whether letting a quantum state change during measurement could actually help protect it.",
      problem: "Cat qubits store information in superpositions of light, named after Schr\u00f6dinger\u2019s cat. They naturally resist bit flips, which makes them a promising path to fault-tolerant quantum computing, but reading one out without disturbing it is still an open problem.",
      built: "We built every introductory task from scratch (photon loss, two-photon stabilization, Wigner snapshots, bit- and phase-flip scaling, buffer readout), then designed a new cross-Kerr-aware readout. During a 1.5 \u00b5s pulse it briefly expands the cat through the buffer drive, cancels the frequency shift that expansion causes with synchronized drive and pump phases, and reads the buffer with a matched filter whose reference follows that phase.",
      results: [
        "20% less measurement damage than a matched flat pulse (0.003073 \u2192 0.002458) while keeping the same signal information (0.791 vs 0.796)",
        "14 errors in 1,024 simulated records after 21 \u00b5s (1.37%, 95% CI 0.82\u20132.28%)",
        "Honest about the gaps: it doesn\u2019t beat flat readout on accuracy yet, and idle protection isn\u2019t preserved. Both are documented, along with a log of every method that failed",
        "A 105-cell notebook that reruns end to end in a fresh, pinned environment",
      ],
      stack: ["Python", "Dynamiqs", "JAX", "QuTiP", "Jupyter"],
      team: "with Raphael F. Bastos \u00b7 thanks to Wes Roberts for judging our track",
      links: [["GitHub repo + technical report", GH + "simransummermalik/solvingalice-bob"]],
      cover: "stage.jpg",
      pics: [
        ["stage.jpg", "on stage at the DuQuantum awards", 1200, 991],
        ["duq-damage.jpg", "coordinating the controls: 20% less endpoint damage", 1200, 467, "fig"],
        ["duq-cat.jpg", "a cat state forming (Wigner function over time)", 1400, 269, "fig"],
        ["prize.jpg", "prize: beats solo buds", 1100, 619],
        ["alice-bob-tote.jpg", "Alice & Bob \u201cBeyond Chill\u201d tote", 825, 1100],
      ],
    },
    {
      id: "colab", folder: "colab_agrizone", project: "AgriZone", event: "CO-LAB Pitch Competition 2026", where: "UNC Charlotte Center City", when: "2026",
      awards: ["1st Place / Grand Prize: $2,500"],
      tagline: "Farmers don\u2019t just need climate alerts. They need a path to adapt.",
      quote: "I\u2019m really proud of this one. We put a lot into it, and it was such a good feeling to see something we worked hard on actually land the way we hoped it would.",
      problem: "Climate change is reshaping what grows where faster than farms can adapt: volatile weather, legacy crops that stop being viable, financial pressure to switch, and support scattered across too many places.",
      built: "AgriZone spots at-risk crops, recommends climate-resilient alternatives for each region, and connects farmers with the buyers, investors and advisors who can fund the switch. We pitched it with an app prototype, a business model (B2B subscriptions, buyer and investor match fees, premium analytics) and a region-by-region rollout plan.",
      results: [
        "Four ML models: climate-risk forecasting, crop-pivot recommendation (ranked by region, soil, water and future climate fit), market matching, and investor / funding matching",
        "Won 1st place and the $2,500 Grand Prize in a room full of really strong ideas",
      ],
      stack: ["React / React Native", "Python FastAPI", "PostgreSQL", "Mapbox / GIS", "AWS", "Supabase"],
      team: "with Ayemhenre Isikhuemhen and Elijah James \u00b7 thanks to Kourtney S. Peterson, MPA",
      links: [["AgriZone MVP repo", GH + "simransummermalik/AgriZoneMVP"]],
      deckLink: "flip through the whole pitch deck",
      deck: Array.from({ length: 16 }, (_, i) => [`agrizone/slide-${String(i + 1).padStart(2, "0")}.jpg`, `AgriZone pitch deck, slide ${i + 1} of 16`]),
      cover: "agrizone/slide-01.jpg",
      pics: [
        ["agrizone/slide-01.jpg", "AgriZone: climate resilience & smart geography", 1280, 720, "fig"],
        ["agrizone/slide-04.jpg", "the problem", 1280, 720, "fig"],
        ["agrizone/slide-07.jpg", "the app", 1280, 720, "fig"],
        ["agrizone/slide-09.jpg", "tech stack + ML engine", 1280, 720, "fig"],
        ["agrizone/slide-11.jpg", "how AgriZone makes money", 1280, 720, "fig"],
        ["agrizone/slide-15.jpg", "impact", 1280, 720, "fig"],
      ],
    },
    {
      id: "pacifica", folder: "method_pacifica", project: "Pacifica", event: "Method x Havk Hackathon", where: "Method", when: "2026",
      awards: ["3rd Place"],
      tagline: "Most banking apps show a number. Pacifica shows a relationship.",
      quote: "It was incredible getting to experience this event as both an organizer and a participant, and seeing what everyone created in such a short amount of time!",
      problem: "Each team got a random real-world client challenge and one day to build and pitch. Ours: a regional bank whose under-30 customers are about a third of its accounts but under 6% of deposits. They route paychecks through the bank, then drift to Cash App, Venmo and AI chatbots, and stop opening the app exactly when money gets tight.",
      built: "Pacifica is an iOS social-banking app where your friend circle lives in a reef. Every friend is a fish, and spending in a category sinks you deeper. It adds small, specific goals (\u201cno Starbucks this week\u201d), a shared purchase feed with applause and downvotes, a BeReal-style check-in, peer-to-peer pay / request / pool, and an Ask Pacifica assistant.",
      results: [
        "Spending and peer-to-peer transfers live in separate tables, so a coffee never gets confused with a payment",
        "Privacy controls decide whether friends see the amount or the merchant, so accountability doesn\u2019t become surveillance",
        "3rd place, at an event I also helped organize through Havk",
      ],
      stack: ["SwiftUI", "Supabase", "PostgreSQL"],
      team: "with Joseph Posas, Raey Assefa, Keven Le\u00f3n and Gabriel Sprenger \u00b7 thanks to JT Bicket, the Method team and Havk leadership",
      links: [["GitHub repo", GH + "simransummermalik/pacifica"]],
      cover: "pacifica-reef.jpg",
      pics: [
        ["pacifica-reef.jpg", "the reef: your circle as fish", 556, 1100, "fig"],
        ["pacifica-transactions.jpg", "circle score + a broken spending goal", 550, 1100, "fig"],
        ["pacifica-bank.jpg", "the bank home", 524, 1100, "fig"],
        ["pacifica-pay.jpg", "pay, request or pool", 533, 1100, "fig"],
        ["pacifica-demo.jpg", "demoing Pacifica at Method", 1100, 825],
      ],
    },
    {
      id: "coroner", folder: "hackuncp_coroner", project: "Coroner", event: "HackUNCP 2026", where: "UNC Pembroke", when: "Feb 2026",
      awards: ["Best Use of Solana (MLH)"],
      tagline: "Three AI-powered investigation tools under one roof.",
      quote: "My general development strategy was: write code, get error, google error, read documentation, realize documentation knew this would happen, repeat. Surprisingly, reading the documentation actually does wonders.",
      problem: "Digital forensics means jumping between a dozen tools and sifting through huge amounts of data by hand. The idea came from real frustration on a security internship.",
      built: "Coroner runs a full forensic suite on uploaded files automatically and returns an interactive report you can question in plain English and export as a PDF. Wallet Trace maps a Solana wallet\u2019s transaction history and key connections in seconds. Digital Sketching reads a ransomware note and identifies the likely threat actor, with a language analysis and risk assessment.",
      results: [
        "An MCP server (Python + FastMCP) exposes custom forensic tools that an AI agent calls on its own, alongside VirusTotal and Falcon Sandbox",
        "Custom PyTorch and scikit-learn models for threat-actor classification",
        "Our first time building an MCP server and our first time touching Solana, and it won Best Use of Solana",
      ],
      stack: ["Python", "FastMCP", "FastAPI", "Solana", "PyTorch", "scikit-learn", "VirusTotal"],
      team: "with Kento Hopkins, Adithya Chakka and Henry Greene",
      links: [["Devpost", "https://devpost.com/software/coroner-9g73nq"], ["GitHub repo", GH + "AChakka/HackUNCP2026"]],
      cover: "coroner.jpg",
      pics: [["coroner.jpg", "Coroner", 1200, 376, "fig"]],
    },
    {
      id: "bioforge", folder: "astrohack_bioforge", project: "BioForge", event: "AstroHack 2025", where: "solo, 36 hours", when: "2025",
      awards: ["3rd Place out of 142 (public vote)"],
      tagline: "A space-survival sim that pushes back.",
      quote: "Ban water? They\u2019ll remember. Mess up? They\u2019ll email you. Running low? You can raid your friends.",
      problem: "I didn\u2019t want to build just another Mars survival game. I wanted a system that reacts to you, evolves, and uses real space data to challenge how you lead under pressure.",
      built: "Built solo in 36 hours: manage oxygen, food, water, energy and morale across a colony, write your own laws and live with the consequences, evolve colonists with traits like resilience and stress tolerance, unlock Europa and Titan, and raid friends when your own systems fail.",
      results: [
        "Live NASA feeds (Mars weather, solar flares, asteroids, APOD) trigger real in-game events",
        "OpenAI writes laws and predicts how colonists will react to them",
        "An email engine checks colony conditions every 2 seconds and escalates through six levels of colonist anger",
        "3rd place out of 142 by public vote",
      ],
      stack: ["React 18", "Next.js 14", "Python", "PostgreSQL", "OpenAI", "NASA APIs"],
      team: "solo",
      links: [["Devpost", "https://devpost.com/software/bioforge"], ["GitHub repo", GH + "simransummermalik/BioForge"], ["play the demo", "https://bio-forge-self.vercel.app/"]],
      cover: "bioforge.jpg",
      pics: [["bioforge.jpg", "BioForge: planetary selection", 1200, 765, "fig"]],
    },
    {
      id: "syn", folder: "cair_syn", project: "SYN", event: "CAIR Hackathon", where: "UNC Charlotte", when: "Apr 2025",
      awards: ["1st Place"],
      tagline: "Sign in front of your webcam, and SYN tells you what you\u2019re signing.",
      quote: "6 months ago I didn\u2019t even know what a return statement was. Now I\u2019ve helped build an end-to-end AI system for something that actually matters.",
      problem: "Real-time ASL translation tools are rare and often inaccurate, and most need downloads. We wanted something fast, accessible and fully in the browser.",
      built: "A browser-based ASL fingerspelling tutor: live camera, hand tracking, real-time letter predictions and feedback, plus login and a dashboard. We focused on posture as well as handshape, because in ASL your posture is part of the message.",
      results: [
        "MediaPipe tracks 21 3D hand landmarks, flattened into a 63-dimensional vector",
        "Classified by a model we trained ourselves on our own labeled dataset, with no gesture libraries",
        "1st place, six months into computer science. I kept going: later repos explore multiclass and quantum-vs-classical ASL recognition",
      ],
      stack: ["MediaPipe", "Python", "OpenCV", "React", "Node.js", "Supabase"],
      team: "with Vedanth Shenoy, Pranav Rao and Sowmyahasa Ravuri",
      links: [["Devpost", "https://devpost.com/software/syn-uthl6w"], ["GitHub repo", GH + "LavaV9/CAIRHackathon"], ["quantum vs classical ASL", GH + "simransummermalik/trainingQuantumASLvsClassicalASLrecognition"]],
      cover: "syn-home.jpg",
      pics: [["syn-home.jpg", "SYN home", 1200, 689, "fig"], ["syn-login.jpg", "SYN login", 1200, 722, "fig"]],
    },
    {
      id: "binbuddy", folder: "hackclt_binbuddy", project: "BinBuddy", event: "Hack CLT Fall 2024", where: "UNC Charlotte", when: "Fall 2024",
      awards: ["Most Technical"],
      tagline: "Snap a photo of trash, and BinBuddy tells you exactly where it goes.",
      quote: "Building this app gave me the opportunity to integrate my background in biology and computer science in a meaningful way.",
      problem: "Most people don\u2019t know precisely how to dispose of different materials, and one wrong item contaminates a whole recycling stream.",
      built: "An AI waste-sorting app that goes past \u201crecyclable or not\u201d: it tells metals and plastics apart, gives location-based instructions for e-waste and hazardous items, adds tips like rinsing containers or removing labels, and awards points redeemable for campus rewards.",
      results: [
        "Transfer learning on MobileNetV2 (ImageNet weights, frozen) with a custom classification head",
        "Trained on a garbage-classification dataset with heavy augmentation, served through a Flask /predict API",
        "Most Technical at Hack CLT, in the sustainability category",
      ],
      stack: ["TensorFlow / Keras", "MobileNetV2", "Flask", "React", "TypeScript"],
      team: "with Vedanth Shenoy, Sai Pradyumna Mudigonda, Veer Pothapragada and Dev Patel",
      links: [["GitHub repo", GH + "simransummermalik/BinBuddy"]],
      cover: null,
      pics: [],
    },
  ];
  const AWARD_COUNT = HACKS.reduce((n, h) => n + h.awards.length, 0);

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // each project's sticker marks its spot on the timeline
  const STICKER = {
    duquantum: `<span class="st st-duq"><b>DuQuantum</b><i>=^.^= cat qubits</i></span>`,
    colab: `<span class="st st-agri"><b>AgriZone</b><i>$2,500 grand prize</i></span>`,
    coroner: `<span class="st st-cor"><b>CORONER</b><i>best use of solana</i></span>`,
    bioforge: `<span class="st st-bio"><b>BIOFORGE</b><i>3rd / 142</i></span>`,
    pacifica: `<span class="st st-pac"><b>pacifica</b><i>&gt;&lt;((\u00b0&gt;</i></span>`,
    syn: `<span class="st st-syn"><b>SYN</b><i>\u2022 \u2022 \u2022 \u2022 \u2022</i></span>`,
    binbuddy: `<span class="st st-bin"><b>BinBuddy</b><i>most technical</i></span>`,
  };
  // oldest first, left to right
  const ORDER = ["binbuddy", "syn", "bioforge", "coroner", "colab", "pacifica", "duquantum"];

  function win(id, cls, title, pos, inner, { label } = {}) {
    return `<section class="window hk-win ${cls}" id="${id}" tabindex="-1" hidden style="${pos}" aria-label="${esc(label || title)}">
        <header class="titlebar"><h2>${esc(title)}</h2>
          <button type="button" data-a="min" aria-label="Minimize ${esc(title)}">_</button>
          <button type="button" data-a="close" aria-label="Close ${esc(title)}">&times;</button>
        </header>${inner}</section>`;
  }

  function readme(h) {
    const links = h.links.map(([label, href]) => `<a class="btn" href="${href}" target="_blank" rel="noreferrer">${esc(label)} &rarr;</a>`).join("")
      + (h.deck ? `<button type="button" class="btn" data-deck="${h.id}">${esc(h.deckLink)} &rarr;</button>` : "");
    return win(`hk-readme-${h.id}`, "hk-readme", `README.md \u2014 ${h.folder}`, "--w:470px", `
        <div class="pane hk-doc">
          <p class="hk-event">${esc(h.event)} &middot; ${esc(h.where)} &middot; ${esc(h.when)}</p>
          <h3>${esc(h.project)}</h3>
          <p class="hk-tag">${esc(h.tagline)}</p>
          <ul class="hk-awards">${h.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          <blockquote>\u201c${esc(h.quote)}\u201d</blockquote>
          <h4>the problem</h4><p>${esc(h.problem)}</p>
          <h4>what we built</h4><p>${esc(h.built)}</p>
          <h4>highlights</h4><ul class="hk-points">${h.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          <h4>built with</h4><p class="hk-stack">${h.stack.map((t) => `<span>${esc(t)}</span>`).join("")}</p>
          <p class="hk-team">${esc(h.team)}</p>
          <p class="hk-links">${links}</p>
        </div>
        <div class="statusbar" aria-hidden="true"><span>close me to go back to the timeline</span><span>${esc(h.when)}</span></div>`, { label: `${h.project} write-up` });
  }

  function template() {
    const timeline = win("hk-timeline", "hk-tlwin", "C:\\summer\\hackathon_wins", "--fx:0.5; --y:40px; --w:min(1060px, calc(100% - 232px))", `
        <div class="pane hk-tl-pane">
          <p class="hk-tl-head"><b>hackathon wins</b> ${HACKS.length} hackathons &middot; ${AWARD_COUNT} awards &middot; Fall 2024 \u2192 Oct 2026 &middot; click one to open it</p>
          <ol class="hk-tl">${ORDER.map((id) => HACKS.find((h) => h.id === id)).map((h) => `<li>
            <button type="button" data-open-hk="${h.id}" aria-label="${esc(`${h.project}, ${h.event}: ${h.awards.join(", ")}`)}">
              <span class="hk-tl-when">${esc(h.when)}</span>
              <span class="hk-tl-st" aria-hidden="true">${STICKER[h.id]}</span>
              <span class="hk-tl-dot" aria-hidden="true"></span>
              <span class="hk-tl-card"><b>${esc(h.project)}</b><span>${esc(h.event)}</span>${h.awards.map((a) => `<em>&#9733; ${esc(a)}</em>`).join("")}</span>
            </button></li>`).join("")}</ol>
        </div>
        <div class="statusbar" aria-hidden="true"><span>summer is here to win !!</span><span>${HACKS.length} object(s)</span></div>`, { label: "hackathon wins timeline" });

    const sets = HACKS.map((h) => readme(h) + h.pics.map(([src, cap, w, hh, fig], k) =>
      win(`hk-pic-${h.id}-${k}`, `dw-snap dw-qwsnap hk-pic-${h.id}`, src.split("/").pop(), "--w:240px",
        `<div class="pane"><img src="${IMG + src}" alt="${esc(cap)}" width="${w}" height="${hh}" loading="lazy" data-full="${k}" class="${fig ? "hk-fig" : ""}${hh > w * 1.2 ? " hk-tall" : ""}"></div><p class="dw-cap">${esc(cap)}</p>`)).join("")).join("");

    const viewer = win("hk-viewer", "dw-viewer", "Image Viewer", "--fx:0.5; --y:30px; --w:min(820px, 72vw)", `
        <div class="dw-nav"><button type="button" class="btn" data-v="-1" aria-label="Previous picture">&lsaquo; prev</button><button type="button" class="btn" data-v="1" aria-label="Next picture">next &rsaquo;</button></div>
        <div class="pane"><img alt=""></div>
        <p class="dw-cap"></p>`, { label: "Image viewer" });

    return timeline + sets + viewer;
  }

  // ---------- window plumbing: the SummerOS page's own functions ----------
  // activate / addTask / minimize / closeWindow come from the page script, so
  // these windows stack, focus and show in the taskbar like every other window.
  const OS = window;
  let desk = null, openSet = null, tucked = [], timers = [], lastTrigger = null, z = 400;
  const $ = (s) => desk.querySelector(s);
  const $$ = (s) => [...desk.querySelectorAll(s)];

  function focusW(w) {
    if (typeof OS.activate === "function") { OS.activate(w); return; }
    w.style.zIndex = ++z;
    $$(".window").forEach((x) => x.classList.toggle("inactive", x !== w));
  }
  function showW(w, moveFocus = true) {
    w.hidden = false; focusW(w);
    if (!moveFocus) return;
    w.focus({ preventScroll: wide.matches });
    if (!wide.matches) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }
  function hideW(w, how) {
    if (openSet && w.id === `hk-readme-${openSet}`) { toggleSet(openSet); return; }
    if (w.id === "hk-timeline") {
      if (how === "min" && typeof OS.minimize === "function") OS.minimize(w);
      else if (typeof OS.closeWindow === "function") OS.closeWindow(w);
      else w.hidden = true;
      if (how !== "min" && location.hash === "#hackathons") history.replaceState(null, "", location.pathname + location.search);
      if (how !== "min" && lastTrigger && lastTrigger.focus && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
      return;
    }
    w.hidden = true;
    w.classList.add("inactive");
  }
  function wireWindow(w) {
    w.addEventListener("pointerdown", () => focusW(w));
    w.querySelector('[data-a="close"]').addEventListener("click", () => hideW(w, "close"));
    w.querySelector('[data-a="min"]').addEventListener("click", () => hideW(w, "min"));
    w.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      hideW(w, "close");
    });
    const bar = w.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (!wide.matches || e.button !== 0 || e.target.closest("button")) return;
      const box = w.getBoundingClientRect(), area = desk.getBoundingClientRect();
      const dx = e.clientX - box.left, dy = e.clientY - box.top;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        w.style.left = `${Math.min(Math.max(ev.clientX - area.left - dx, 80 - box.width), area.width - 80)}px`;
        w.style.top = `${Math.min(Math.max(ev.clientY - area.top - dy, 0), area.height - 40)}px`;
      };
      const stop = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", stop); bar.removeEventListener("pointercancel", stop); };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", stop); bar.addEventListener("pointercancel", stop);
    });
  }
  function pop(w, delay, check = () => true, scrollTo = false) {
    timers.push(setTimeout(() => {
      if (!check()) return;
      w.classList.remove("dw-popin");
      showW(w, false);
      if (scrollTo) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      void w.offsetWidth; w.classList.add("dw-popin");
      if (w.id === "hk-timeline") { w.classList.remove("hk-tl-in"); void w.offsetWidth; w.classList.add("hk-tl-in"); }
    }, reduced ? 0 : delay));
  }

  // the part of the desktop you can see right now (it can be taller than the screen)
  function visible() {
    const r = desk.getBoundingClientRect();
    const bar = document.querySelector(".taskbar");
    const floor = Math.min(window.innerHeight, bar ? bar.getBoundingClientRect().top : window.innerHeight);
    const top = Math.max(0, -r.top);
    const bottom = Math.min(r.height, floor - r.top);
    return { width: r.width, top, height: Math.max(240, bottom - top) };
  }

  // ---------- one project: README on the left, photos in a clean grid ----------
  // The other windows step aside while it's open and come back when you close the README.
  const GAP = 10, LEFT = 214, TOP = 12, DOC_W = 470;
  function toggleSet(id) {
    timers.forEach(clearTimeout); timers = [];
    const closing = openSet === id;
    if (openSet) {
      $$(`#hk-readme-${openSet}, .hk-pic-${openSet}`).forEach((w) => { w.hidden = true; });
      tucked.forEach(([w, video]) => { w.hidden = false; if (video) video.play().catch(() => {}); });
      tucked = [];
      openSet = null;
      const tl = $("#hk-timeline");
      if (closing && !tl.hidden) { focusW(tl); tl.focus({ preventScroll: true }); }
    }
    if (closing) return;
    openSet = id;
    const doc = $(`#hk-readme-${id}`), pics = $$(`.hk-pic-${id}`);
    const still = () => openSet === id;
    if (!wide.matches) {
      [doc, ...pics].forEach((w, k) => pop(w, k * 90, still, k === 0));
      timers.push(setTimeout(() => { if (still()) doc.focus({ preventScroll: true }); }, 20));
      return;
    }
    tucked = $$(".window:not([hidden])").map((w) => {
      const video = w.querySelector("video");
      const playing = video && !video.paused ? video : null;
      if (playing) playing.pause();
      w.hidden = true;
      return [w, playing];
    });
    const area = visible(), y0 = area.top + TOP;
    const docLeft = pics.length ? LEFT : Math.max(LEFT, area.width / 2 - DOC_W / 2);
    Object.assign(doc.style, { left: `${docLeft}px`, top: `${y0}px` });
    doc.style.setProperty("--w", `${DOC_W}px`);
    doc.querySelector(".pane").style.maxHeight = `${area.height - TOP * 2 - 60}px`;
    pop(doc, 0, still);
    timers.push(setTimeout(() => { if (still()) doc.focus({ preventScroll: true }); }, reduced ? 0 : 40));
    if (!pics.length) return;
    // biggest tiles that fit, left to right then top to bottom.
    // Tall phone screenshots get 9:16 tiles, everything else 4:3.
    const x0 = LEFT + DOC_W + GAP, availW = area.width - x0 - GAP, availH = area.height - TOP - GAP;
    const ratio = pics.map((w) => (w.querySelector("img.hk-tall") ? 16 / 9 : 0.75));
    const height = (c, w) => {
      let total = 0;
      for (let r = 0; r * c < pics.length; r++) total += Math.max(...ratio.slice(r * c, r * c + c)) * w + 52 + GAP;
      return total - GAP;
    };
    let best = null;
    for (let c = 1; c <= pics.length && !best; c++) {
      const w = Math.min(420, Math.floor((availW - (c - 1) * GAP) / c));
      if (height(c, w) <= availH) best = { c, w };
    }
    if (!best) {
      const c = pics.length;
      let w = Math.floor((availW - (c - 1) * GAP) / c);
      while (w > 80 && height(c, w) > availH) w -= 4;
      best = { c, w };
    }
    pics.forEach((w) => w.style.setProperty("--w", `${best.w}px`));
    // measure each row's real height, then place
    const heights = pics.map((w) => { w.style.visibility = "hidden"; w.hidden = false; const h = w.offsetHeight; w.hidden = true; w.style.visibility = ""; return h; });
    let y = y0;
    for (let r = 0; r * best.c < pics.length; r++) {
      const row = pics.slice(r * best.c, r * best.c + best.c);
      row.forEach((w, k) => {
        w.style.left = `${x0 + k * (best.w + GAP)}px`;
        w.style.top = `${y}px`;
        pop(w, 180 + (r * best.c + k) * 110, still);
      });
      y += Math.max(...heights.slice(r * best.c, r * best.c + best.c)) + GAP;
    }
    // once the photos are in, the README is the active window again
    timers.push(setTimeout(() => { if (still()) focusW(doc); }, reduced ? 0 : 180 + pics.length * 110 + 40));
  }

  let viewerList = [], viewerI = 0;
  function showPicture(list, i) {
    viewerList = list; viewerI = (i + list.length) % list.length;
    const [src, cap] = list[viewerI], w = $("#hk-viewer"), img = w.querySelector("img");
    w.querySelector(".titlebar h2").textContent = `${src.split("/").pop()} - Image Viewer`;
    img.src = IMG + src; img.alt = cap;
    w.querySelector(".dw-cap").textContent = cap;
    w.querySelector(".dw-nav").hidden = list.length < 2;
    if (wide.matches && w.hidden && !w.dataset.moved) w.style.top = `${visible().top + 30}px`;
    showW(w);
  }

  function build() {
    desk = document.getElementById("desktop");
    if (!desk) return;
    const holder = document.createElement("div");
    holder.innerHTML = template();
    const wins = [...holder.children];
    desk.append(...wins);
    wins.forEach(wireWindow);
    $("#hk-viewer .titlebar").addEventListener("pointerdown", () => { $("#hk-viewer").dataset.moved = "1"; });

    $$("[data-open-hk]").forEach((b) => b.addEventListener("click", () => toggleSet(b.dataset.openHk)));
    HACKS.forEach((h) => $$(`.hk-pic-${h.id} img[data-full]`).forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        const pic = h.pics[Number(img.dataset.full)];
        if (h.deck) showPicture(h.deck, h.deck.findIndex((d) => d[0] === pic[0]));
        else showPicture(h.pics, Number(img.dataset.full));
      });
    }));
    $$("[data-deck]").forEach((b) => b.addEventListener("click", () => showPicture(HACKS.find((h) => h.id === b.dataset.deck).deck, 0)));
    $$("[data-v]").forEach((b) => b.addEventListener("click", () => showPicture(viewerList, viewerI + Number(b.dataset.v))));
  }

  // ---------- open: the timeline pops up on the desktop ----------
  function open(trigger) {
    if (!desk) build();
    if (!desk) return;
    if (typeof OS.setStart === "function") OS.setStart(false);
    lastTrigger = trigger || document.activeElement;
    if (openSet) toggleSet(openSet);
    const tl = $("#hk-timeline");
    if (typeof OS.addTask === "function") OS.addTask(tl);
    if (!tl.hidden) { focusW(tl); tl.focus({ preventScroll: wide.matches }); return; }
    if (wide.matches && !tl.style.left) tl.style.top = `${visible().top + 40}px`;
    timers.forEach(clearTimeout); timers = [];
    pop(tl, 0, undefined, !wide.matches);
    timers.push(setTimeout(() => tl.focus({ preventScroll: true }), 20));
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-hackathons]");
    if (!t || document.body.classList.contains("plain-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    open(t);
  }, true);
  window.addEventListener("hashchange", () => { if (location.hash === "#hackathons") open(); });
  if (location.hash === "#hackathons") open();
  window.hackathonWins = { open, close: () => { const tl = desk && $("#hk-timeline"); if (tl && !tl.hidden) hideW(tl, "close"); } };
})();
