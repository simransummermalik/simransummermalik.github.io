// The splice girl folder. Opening it from the research folder boots the real
// command-line tool (the banner and menu are the program's own output, byte for
// byte), then opens a Splice Girl desktop: the project folder, hodge_toy.exe
// (the same Hodge decomposition as the Rust crate, live in the browser),
// hpc_run.exe (one real sample on the UNC Charlotte cluster, as a time-lapse),
// an MS-DOS Prompt with real terminal output, the lab notebook (quotes copied
// word for word from my dated logs in the repo) and the figures.
// Same windows, icons and taskbar as SummerOS; reuses the dreu folder styles
// (.dw ...). Opens from /#splice-girl, or straight into a window with
// /#splice-girl/toy, /math, /hpc, /dos or /notebook. MATH.md's live figures
// are in sg-figures.js, loaded the first time it opens.
(() => {
  const SG = "/research/splice-girl/";
  const IMG = SG + "img/";
  const REPO = "https://github.com/simransummermalik/TopologicalAnalysisofRNASplicinginEndometriosis";
  const BLOB = REPO + "/blob/main/";
  const CRATE = "https://crates.io/crates/splice-girl";
  const DOCSRS = "https://docs.rs/splice-girl";
  const HASH = "#splice-girl";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = window.matchMedia("(min-width: 900px)");
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ext = (href) => /^https?:|\.pdf$/.test(href);
  const blank = ' target="_blank" rel="noreferrer"';

  // ---------- the math: the same steps as src/hodge.rs ----------
  // Checked against splice-girl 0.2.2 on 157 graphs (the four patterns below
  // with random counts, plus random graphs, some disconnected): every cycle
  // fraction and edge component agrees to the 10 decimals the crate prints.
  function hodge(edges) {
    const names = [...new Set(edges.flatMap((e) => [e.from, e.to]))].sort();
    const at = new Map(names.map((v, i) => [v, i]));
    const n = names.length, m = edges.length;
    const total = edges.reduce((a, e) => a + e.count, 0);
    if (!(total > 0)) return null;
    const w = edges.map((e) => e.count / total);
    const s = edges.map((e) => at.get(e.from)), t = edges.map((e) => at.get(e.to));
    // L = B1 B1^T and b = B1 w, with B1 = -1 where an edge leaves, +1 where it enters
    const L = names.map(() => new Float64Array(n)), b = new Float64Array(n);
    for (let e = 0; e < m; e++) {
      L[s[e]][s[e]] += 1; L[t[e]][t[e]] += 1; L[s[e]][t[e]] -= 1; L[t[e]][s[e]] -= 1;
      b[s[e]] -= w[e]; b[t[e]] += w[e];
    }
    // pin the first node of each connected piece to 0, solve the rest
    const seen = new Uint8Array(n), pinned = new Uint8Array(n);
    let pieces = 0;
    for (let i = 0; i < n; i++) {
      if (seen[i]) continue;
      pieces++; pinned[i] = 1; seen[i] = 1;
      const stack = [i];
      while (stack.length) {
        const v = stack.pop();
        for (let e = 0; e < m; e++) {
          const u = s[e] === v ? t[e] : t[e] === v ? s[e] : -1;
          if (u >= 0 && !seen[u]) { seen[u] = 1; stack.push(u); }
        }
      }
    }
    const free = names.map((_, i) => i).filter((i) => !pinned[i]);
    const k = free.length, A = free.map((i) => [...free.map((j) => L[i][j]), b[i]]);
    for (let c = 0; c < k; c++) {   // Gaussian elimination, partial pivoting
      let p = c;
      for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]];
      for (let r = c + 1; r < k; r++) {
        const f = A[r][c] / A[c][c];
        for (let j = c; j <= k; j++) A[r][j] -= f * A[c][j];
      }
    }
    const x = new Float64Array(k);
    for (let r = k - 1; r >= 0; r--) {
      let v = A[r][k];
      for (let j = r + 1; j < k; j++) v -= A[r][j] * x[j];
      x[r] = v / A[r][r];
    }
    const phi = new Float64Array(n);
    free.forEach((i, j) => { phi[i] = x[j]; });
    const grad = w.map((_, e) => phi[t[e]] - phi[s[e]]);
    const cycle = w.map((v, e) => v - grad[e]);
    const dot = (a, c) => a.reduce((acc, v, i) => acc + v * c[i], 0);
    const div = new Float64Array(n);
    for (let e = 0; e < m; e++) { div[s[e]] -= cycle[e]; div[t[e]] += cycle[e]; }
    const signal = dot(w, w), scale = Math.max(1, Math.sqrt(signal));
    const recon = Math.sqrt(w.reduce((a, v, e) => a + (v - grad[e] - cycle[e]) ** 2, 0));
    const kernel = Math.sqrt(dot(div, div)), orth = Math.abs(dot(grad, cycle));
    return {
      names, w, phi: names.map((_, i) => phi[i]), grad, cycle, rank: m - n + pieces,
      C: dot(cycle, cycle) / signal,
      checks: [["reconstruction", recon, recon <= 1e-9 * scale], ["kernel", kernel, kernel <= 1e-9 * scale], ["orthogonality", orth, orth <= 1e-9 * scale * scale]],
    };
  }

  // ---------- hodge_toy.exe: four splicing patterns ----------
  // edges: [from, to, reads]. routes: edge indices of every route from the
  // first exon to the last. tries: [button, counts, what it shows].
  const PRESETS = [
    { label: "exon skipping", exons: 3, edges: [["E1", "E2", 30], ["E2", "E3", 30], ["E1", "E3", 5]], routes: [[0, 1], [2]],
      note: "exon skipping: E1 can join E2, or skip it and join E3 directly. two routes between the same two exons make one loop.",
      tries: [
        ["30 / 30 / 5", [30, 30, 5], "the packaged example's TRIANGLE gene: C = 121/219 = 0.5525, the same value the crate prints."],
        ["100 each", [100, 100, 100], "Figure 1 from our presentation: 100 reads on every junction gives exactly 1/9."],
        ["skip = 0", [30, 30, 0], "zero reads on the skip, and C is 2/3, not 0. the edge is still in the graph, so the loop is too. (the crate's own example warns about exactly this.)"],
        ["25 / 25 / 50", [25, 25, 50], "the skip carries as much as the two steps: same total on both routes, so C = 0."],
      ] },
    { label: "one route", exons: 3, edges: [["E1", "E2", 30], ["E2", "E3", 30]], routes: [[0, 1]],
      note: "one route: every read takes the same path. there is no loop, so C = 0 whatever the counts are.", tries: [] },
    { label: "mutually exclusive", exons: 4, edges: [["E1", "E2", 40], ["E1", "E3", 10], ["E2", "E4", 40], ["E3", "E4", 10]], routes: [[0, 2], [1, 3]],
      note: "mutually exclusive exons: a transcript keeps E2 or E3, never both. the two routes from E1 to E4 make one loop.",
      tries: [
        ["40 / 10", [40, 10, 40, 10], "mostly E2, a little E3."],
        ["25 each", [25, 25, 25, 25], "both exons used equally: the two routes carry the same total, so C = 0."],
        ["only E2", [50, 0, 50, 0], "every read keeps E2. C = 1/2: the E3 route is still in the graph."],
      ] },
    { label: "two skips", exons: 4, edges: [["E1", "E2", 30], ["E2", "E3", 30], ["E3", "E4", 30], ["E1", "E3", 8], ["E2", "E4", 4]], routes: [[0, 1, 2], [3, 2], [0, 4]],
      note: "two skips: E2 and E3 can each be skipped. two independent loops (cycle rank 2).",
      tries: [
        ["30s, 8, 4", [30, 30, 30, 8, 4], "mostly the long way round."],
        ["balanced", [20, 20, 20, 40, 40], "every route from E1 to E4 carries 60 reads: C = 0."],
      ] },
  ];

  // ---------- hpc_run.exe: SRR36710386, November 19, 2026 (from my log) ----------
  // [label, value, when it shows]: "n" counts up during the stage, "end" appears when it finishes
  const STAGES = [
    { name: "FASTQ conversion", job: "Slurm job 27843675", secs: 159,
      out: [["paired FASTQ files", "about 36 GB", "end"]] },
    { name: "HISAT2 alignment + junction counting", job: "Slurm job 27844959", secs: 6107,
      out: [["read pairs", 54679380, "n"], ["SAM records", 118356885, "n"], ["overall alignment rate", "97.54%", "end"], ["junction observations kept", 28844691, "n"], ["ambiguous, excluded", 1274883, "n"], ["junction table rows", "210,520", "end"]] },
    { name: "Splice Girl: Hodge analysis (Rust)", job: "Slurm job 27866517", secs: 5, hodge: true,
      out: [["sample_metrics.tsv", "3.8 MB", "end"], ["junction_components.tsv", "34 MB", "end"]] },
  ];

  // ---------- MS-DOS Prompt: real output of the published crate ----------
  // Run with splice-girl 0.2.2 on November 24, 2026, on its own synthetic example.
  const DOS = [
    ["C:\\SUMMER>", "splice-girl --version", "splice-girl 0.2.2"],
    ["C:\\SUMMER>", "splice-girl example --output splice-girl-example", "Synthetic example: splice-girl-example\nRead README.md inside that folder for the next commands."],
    ["C:\\SUMMER>", "cd splice-girl-example", ""],
    ["C:\\SUMMER\\SPLICE~1>", "splice-girl validate junctions.tsv samples.tsv", `validation summary
  junction_rows: 59
  samples: 8
  genes: 3
  sample_gene_groups: 24
  total_read_support: 12131.0000000000
  group_support_range: 1.0000000000 to 10050.0000000000
  mathematical_checks_passed: 24
  mathematical_checks_failed: 0
manifest summary
  manifest_samples: 8
  case_samples: 4
  control_samples: 4
  junction_samples_without_metadata: none
  manifest_samples_without_junctions: none
validation_status: PASS`],
    ["C:\\SUMMER\\SPLICE~1>", "splice-girl check --config analysis.json", `Preflight: PASS
Input kind: "synthetic"
Samples: 8
Primary eligible genes: 1
Scenarios: 7
No output files written.`],
  ];
  // what `splice-girl --start` prints after its banner
  const MENU = ["", "", "  Splice Girl", "  -----------", "  [1] Analyze a junction TSV", "  [2] Compare one gene across case/control samples",
    "  [3] Save one splice graph as an SVG", "  [4] Validate inputs and mathematical checks", "  [5] Compare every observed gene",
    "  [6] Save a comparison report and graph figures", "  [7] Run exact statistical tests and save a report", "  [q] Quit", ""];

  // ---------- lab notebook: quotes copied word for word from my dated logs ----------
  const LOGS = [
    { f: "sep_10", file: "september_10_summer.md", short: "sept 10", date: "September 10, 2026", title: "the first splice girl",
      quotes: ["I prepared the first basic version of <b>Splice Girl</b>, the project's Rust command-line software. This is the synthetic mathematical foundation, not the complete research tool."],
      checks: ["The linear graph reports a cycle fraction of <code>0.0</code>.", "The equal-weight directed cycle reports a cycle fraction of <code>1.0</code>.", "All four Rust tests pass."],
      go: ["toy", "try a loop in hodge_toy.exe"] },
    { f: "sep_15", file: "september_15th_summer.md", short: "sept 15", date: "September 15, 2026", title: "a banner and a menu",
      quotes: ["Starting the program now displays the detailed ASCII artwork and opens a small interactive menu around the one analysis feature currently implemented."],
      pre: "[1] Analyze a junction TSV\n[q] Quit",
      go: ["start", "watch it boot"] },
    { f: "sep_24", file: "september_24th_summer.md", short: "sept 24", date: "September 24, 2026", title: "rules for bad data",
      quotes: ["I wrote down the first data rules for Splice Girl and added them to <code>docs/data_contract.md</code>.",
        "I also added parser tests for these bad inputs so the program gives an error instead of quietly using wrong data.",
        "These changes connected the biology notes, the math idea, and the software rules in one place."] },
    { f: "sep_30", file: "september_30th_summer.md", short: "sept 30", date: "September 30, 2026", title: "from raw reads",
      quotes: ["I built the first small preprocessing workflow for raw RNA sequencing reads.",
        "I also added the junction-to-gene helper, small test fixtures, preprocessing notes, and tests that check the commands without needing large biological files."] },
    { f: "oct_20", file: "october_20th_summer.md", short: "oct 20", date: "October 20, 2026", title: "a website, and a folder called incorrect",
      quotes: ["I built the first plain HTML and CSS website for Splice Girl and added a graph view to the Rust tool so a completed analysis can be opened as an SVG report.",
        "An initial MultiQC download did not contain the complete reports, so I moved it into an <code>incorrect</code> folder instead of presenting it as valid."] },
    { f: "oct_22", file: "october_22nd_summer.md", short: "oct 22", date: "October 22, 2026", title: "save everything, overwrite nothing",
      quotes: ["Today I completed Rust task <b>R13</b>, which makes Splice Girl save its analysis instead of leaving the results only in terminal text.",
        "The program refuses to use an existing output folder so an old result is not silently overwritten.",
        "The genome, annotation, alignment, and junction fields are clearly marked as pending instead of being guessed."] },
    { f: "oct_24", file: "october_24th_summer.md", short: "oct 24", date: "October 24, 2026", title: "three panels",
      img: ["three-panel-triangle.svg", "The program's three-panel figure: observed, gradient and cycle parts of one small graph"],
      quotes: ["I expanded the Splice Girl graph output so the same sample and gene can be viewed as three matching panels: the original normalized junction signal, the gradient part, and the cycle part. The panels use the same node positions and edge order, which makes the mathematical split easier to compare."] },
    { f: "oct_28", file: "october_28th_summer.md", short: "oct 28", date: "October 28, 2026", title: "more than visual polish",
      quotes: ["Today I made the Rust tool much more complete instead of only adding visual polish.",
        "It does not make up p-values or rankings before our statistics rules are approved.",
        "The project now has 56 passing tests."],
      go: ["dos", "run validate in the MS-DOS Prompt"] },
    { f: "nov_17", file: "november_17th_summer.md", short: "nov 17", date: "November 17, 2026", title: "the first real reads",
      img: ["junction-assignment.png", "Bar chart of why junction observations in the pilot were kept or excluded"],
      quotes: ["I built the full human HISAT2 index from our verified GENCODE files and ran the first one million already-cleaned read pairs from our local control sample through alignment and junction extraction. The alignment rate was 97.23%.",
        "I looked into the ambiguous junctions instead of just leaving that huge number unexplained."] },
    { f: "nov_18", file: "november_18th_summer.md", short: "nov 18", date: "November 18, 2026", title: "243 genes, checked twice",
      quotes: ["All 1,388 junction counts matched a separate recount from the BAM, and all 243 Hodge results matched an independent NumPy SVD calculation.",
        "A first-time reviewer exercise and blank feedback sheet are ready, but a real person still needs to try them; I did not mark that review complete or invent feedback."] },
    { f: "nov_19", file: "november_19th_summer.md", short: "nov 19", date: "November 19, 2026", title: "on the cluster",
      quotes: ["Its first FASTQ conversion attempt failed because the SRA file was nested one directory deeper than the command expected.",
        "I ran the Rust Hodge analysis on the resulting junction table as Slurm job 27866517; it completed in 5 seconds and wrote <code>sample_metrics.tsv</code> (3.8 MB) and <code>junction_components.tsv</code> (34 MB).",
        "The 28.8 million figure is an observation count from the junction-assignment stage, not a claim that the whole analysis ran in five seconds."],
      go: ["hpc", "replay it in hpc_run.exe"] },
    { f: "nov_21", file: "november_21st_summer.md", short: "nov 21", date: "November 21, 2026", title: "three of eight",
      quotes: ["The remaining five samples\u2014two cases and three controls\u2014still need to be processed before a four-versus-four comparison can be made.",
        "The sample outputs are still on HPC scratch; no biological conclusion is claimed."] },
  ];

  const FIGS = [
    ["hodge_decomposition.png", "hodge-decomposition.png", "the decomposition on the exon-skipping test graph, 100 reads on every junction: 1/9 of the signal goes around the loop. from the team's presentation"],
    ["three_panel.svg", "three-panel-triangle.svg", "the program's own figure, unedited: observed, gradient and cycle panels for gene TRIANGLE in sample S0, C = 0.5525. synthetic data"],
    ["report.png", "demo-report.png", "the offline HTML report from the same run. it states its limits at the top: the checks verify the math, not biological comparability"],
    ["junction_audit.png", "junction-assignment.png", "the November 17 pilot: why junction observations were kept or excluded. this audit is why the node rule changed on November 18"],
    ["code_overview.jpg", "code-overview.jpg", "how the code works: build the graph, split the flow, check the math, compare cases and controls. from the team's presentation"],
  ];

  // ---------- documents ----------
  const DOCS = {
    readme: { title: "README.txt", w: 520, html: `
      <p class="sgw-kick">research software &middot; BINF 2111 team project &middot; UNC Charlotte &middot; fall 2026</p>
      <h3>Splice Girl</h3>
      <p class="sgw-sub">topological analysis of RNA splicing in endometriosis</p>
      <hr>
      <p><b>Do endometriosis samples organize their RNA splice connections differently from control samples?</b></p>
      <p>A gene is copied into an early RNA made of <i>exons</i> and <i>introns</i>. Splicing cuts the introns out and joins exons back together, and different joining choices (alternative splicing) can make different finished RNAs from the same gene. RNA sequencing catches short reads that span the joint between two exons. Those joints are <i>splice junctions</i>.</p>
      <p>The usual summary counts reads per junction. Splice Girl asks how all of a gene's junctions fit together. Every exon becomes a node, every junction an arrow, every read count a weight:</p>
<pre>E1 ──→ E2 ──→ E3     one route

E1 ──→ E2 ──→ E3     exon skipping: a second route,
│             ↑      straight from E1 to E3
└─────────────┘</pre>
      <p>Then Hodge theory splits that flow in two: a <b>gradient</b> part, which one value per exon can explain, and a <b>cycle</b> part, which only exists because there is more than one route. The share of the signal in the cycle part is the <b>cycle fraction</b>, <i>C</i>. That's the number we compare between four endometriosis and four control samples.</p>
      <p class="sgw-links"><button type="button" class="btn primary" data-act="toy">play with it: hodge_toy.exe</button><button type="button" class="btn" data-act="math">MATH.md: the math, live</button></p>
      <h4>my part</h4>
      <p>I'm the lead programmer and do the mathematical modeling. From the dated logs:</p>
      <ul>
        <li>wrote the first Rust version, the synthetic mathematical foundation the rest is built on</li>
        <li>the data contract and the parser tests that reject bad input, the plain-language Hodge explanation, and the math spec's equations and checks</li>
        <li>the read-preprocessing workflow (Cleaver/fastp, HISAT2, junction assignment) and the validated dataset manifests</li>
        <li>the three-panel figure, <code>validate</code>, the all-gene comparison, install checks, CI and the benchmark</li>
        <li>published the first crates.io releases (0.1.0, 0.2.0 and 0.2.1)</li>
        <li>the cluster runs: 3 of the 8 samples downloaded, aligned, counted and analyzed so far</li>
      </ul>
      <h4>where it stands</h4>
      <p>The software is done and tested: 127 Rust tests pass, and on real reads all 243 genes matched an independent NumPy check. Three of the eight samples are aligned. <b>There is no case/control result yet, and none is claimed.</b></p>
      <p class="sgw-links"><a class="btn" href="${SG}">all_about_it.html (plain page)</a><a class="btn" href="${REPO}"${blank}>GitHub &rarr;</a><a class="btn" href="${CRATE}"${blank}>crates.io &rarr;</a></p>` },
    design: { title: "study_design.txt", w: 520, html: `
      <p class="sgw-kick">splice_girl &middot; the study</p>
      <h3>4 vs 4</h3>
      <p class="sgw-sub">rules written down before the full run</p>
      <hr>
      <ul>
        <li><b>Data:</b> public paired-end RNA-seq of proliferative endometrium, <a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE315857"${blank}>GEO GSE315857</a>: four control (SRR36710387&ndash;390) and four endometriosis (SRR36710383&ndash;386) samples, 49.5 to 89.7 million read pairs each.</li>
        <li><b>Reads to junctions:</b> clean, align to GENCODE v50 GRCh38.p14 with HISAT2, check strand (a sample is held back if fewer than 95% of read 1s agree). Junctions come from uniquely mapped reads with at least 8 bases on each side, mapped to annotated exon pairs. Ambiguous ones are excluded, not guessed.</li>
        <li><b>One shared graph per gene,</b> chosen without looking at case/control labels: an edge stays if it has at least 5 reads in at least 4 of the 8 samples. A gene stays if its graph has a loop (cycle rank &ge; 1) and every sample has at least 50 reads on it.</li>
        <li><b>Comparison:</b> mean <i>C</i>(cases) &minus; mean <i>C</i>(controls) per gene, an exact permutation test over all 70 ways to call 4 of the 8 samples cases, and Benjamini&ndash;Hochberg across genes.</li>
        <li><b>Baseline:</b> a simpler measure (junction-usage entropy) goes through the same test. If Hodge does no better, that gets reported.</li>
        <li><b>On the record:</b> the thresholds were written on November 18. An exploratory one-versus-one table was viewed on November 20, and the values were approved unchanged on November 22. Any later change has to be reported as made after the data were seen.</li>
      </ul>
      <p class="sgw-links"><a class="btn" href="${BLOB}analysis/cohort_primary/README.md"${blank}>the frozen settings &rarr;</a><a class="btn" href="${BLOB}docs/interpretation_plan.md"${blank}>interpretation plan &rarr;</a></p>` },
    team: { title: "team.txt", w: 420, html: `
      <p class="sgw-kick">splice_girl &middot; the team</p>
      <h3>the Splice Girls</h3>
      <hr>
      <p><b>Summer Malik</b> (me): lead programmer and mathematical modeling.</p>
      <p><b>Vania Zeledon</b>: computational development and mathematical theory, including the statistics specification, the exact permutation test, the junction-usage baseline, the cohort configuration and the interpretation plan.</p>
      <p><b>Sydney Holmes</b>: biological research.</p>
      <p><b>Wynn Oo</b>: RNA-seq data and splice-junction research.</p>
      <hr>
      <p>Every contribution is in the repo's dated logs. Since 0.2.0 the project is CC BY 4.0, with authorization from all four contributors. To cite it: <code>splice-girl cite</code>.</p>` },
  };

  // ---------- MATH.md: the math as a short paper, with live figures (sg-figures.js) ----------
  const M = (s) => `<var>${s}</var>`;
  const B1 = `${M("B")}<sub>1</sub>`, B1T = `${M("B")}<sub>1</sub><sup>&#8868;</sup>`;
  const wg = `${M("w")}<sub>grad</sub>`, wc = `${M("w")}<sub>cycle</sub>`;
  const mat3 = (...xs) => `<span class="cd-mat sg-mat3">${xs.map((x) => `<i>${String(x).replace("-", "&minus;")}</i>`).join("")}</span>`;
  const MATH = `
      <p class="cd-kicker">splice_girl &middot; MATH.md</p>
      <h3>Can one number per exon explain the reads?</h3>
      <p class="cd-sub">the Hodge decomposition of a splice graph, with live figures</p>
      <p class="sg-byline"><b>Summer Malik</b>, Sydney Holmes, Vania Zeledon, Wynn Oo<br>BINF 2111 &middot; UNC Charlotte &middot; fall 2026 &middot; <code>splice-girl</code> 0.2.2</p>
      <div class="sg-abstract"><p><b>Abstract</b> Alternative splicing is usually summarized one junction at a time. Splice Girl looks at all of a gene's junctions together, as a flow on a directed graph of its exons, and splits that flow with the discrete Hodge decomposition: a <i>gradient</i> part that one value per exon can explain, and a <i>cycle</i> part that only exists where the graph offers more than one route. The share of the signal in the cycle part, the cycle fraction ${M("C")}, is one number per gene per sample. Multiplying every count by the same factor doesn't change it, and neither does reordering the input. We compare ${M("C")} between four endometriosis and four control samples with an exact permutation test over all 70 relabelings. The software is released and tested, three of the eight samples are aligned, and there is no case/control result yet.</p></div>
      <p>The README says what it's for. This is the math, the way the code does it. Every figure runs the crate's steps in your browser, with the same <code>hodge()</code> as hodge_toy.exe, which matches <code>splice-girl</code> 0.2.2 to within 5&times;10<sup>&minus;11</sup> on 157 test graphs. The graphs are toys or the crate's own synthetic example. No study data is shown.</p>
      <p class="cd-links cd-figgo"><span>Jump to a figure:</span>
        <button type="button" class="btn" data-fig-go="edge">1 &middot; edge space</button>
        <button type="button" class="btn" data-fig-go="land">2 &middot; every triangle</button>
        <button type="button" class="btn" data-fig-go="spec">3 &middot; two Laplacians</button>
        <button type="button" class="btn" data-fig-go="null">4 &middot; the 70 splits</button>
      </p>

      <h4>1 &middot; reads become a flow</h4>
      <p>For one gene in one sample, the exons are vertices ${M("V")} and the junctions are directed edges ${M("E")}, pointing the way the transcript reads (toward higher coordinates on the plus strand). Each junction has a read count ${M("c")}<sub>${M("e")}</sub> &ge; 0. Divide by the gene's total:</p>
      <p class="cd-eq">${M("w")}<sub>${M("e")}</sub> = ${M("c")}<sub>${M("e")}</sub> / &Sigma;<sub>${M("j")}</sub> ${M("c")}<sub>${M("j")}</sub>, &nbsp;&nbsp; ${M("w")} &isin; &#8477;<sup>${M("E")}</sup></p>
      <p>That vector is a 1-cochain: one number on every oriented edge, which would flip sign if the edge were turned around. Everything below depends only on which way ${M("w")} points in &#8477;<sup>${M("E")}</sup>, so multiplying every count by the same factor changes nothing, and ${M("C")} comes out the same for a sample sequenced ten times deeper. Normalizing just makes the printed energies comparable between genes and samples.</p>

      <h4>2 &middot; the boundary matrix</h4>
      <p>Exons and junctions are sorted by name, so row order in the input never matters. The incidence matrix ${B1} &isin; &#8477;<sup>${M("V")}&times;${M("E")}</sup> has a column per junction: &minus;1 at the exon it leaves, +1 at the exon it enters. For the exon-skipping triangle, with rows E1, E2, E3 and columns E1&rarr;E2, E1&rarr;E3, E2&rarr;E3:</p>
      <p class="cd-eq">${B1} = ${mat3(-1, -1, 0, 1, 0, -1, 0, 1, 1)}</p>
      <p>It works in both directions. ${B1}${M("w")} is the net flow into each exon, what arrives minus what leaves. ${B1T}&phi; takes a height &phi;<sub>${M("v")}</sub> on every exon and returns the climb along every junction, (${B1T}&phi;)<sub>${M("u")}&rarr;${M("v")}</sub> = &phi;<sub>${M("v")}</sub> &minus; &phi;<sub>${M("u")}</sub>.</p>

      <h4>3 &middot; two subspaces at right angles</h4>
      <p>Those two maps split edge space in two, with nothing left over and nothing counted twice:</p>
      <p class="cd-eq">&#8477;<sup>${M("E")}</sup> = im ${B1T} &oplus; ker ${B1}, &nbsp;&nbsp; &lang;${B1T}&phi;, ${M("z")}&rang; = &lang;&phi;, ${B1}${M("z")}&rang; = 0 &nbsp; for every ${M("z")} &isin; ker ${B1}</p>
      <p>The first piece holds every flow that heights on the exons can explain: the <b>gradients</b>. The second holds every flow that never piles up at an exon, where what arrives always equals what leaves: the <b>cycles</b>. The identity on the right is why the two meet at right angles. So ${M("w")} splits one way only, and each part is the closest point to ${M("w")} in its own subspace:</p>
      <p class="cd-eq">${M("w")} = ${wg} + ${wc}, &nbsp;&nbsp; ${wg} = ${B1T}&phi;*, &nbsp;&nbsp; &phi;* = argmin<sub>&phi;</sub> &Vert;${M("w")} &minus; ${B1T}&phi;&Vert;<sup>2</sup> &nbsp; &rArr; &nbsp; ${M("L")}<sub>0</sub>&phi;* = ${B1}${M("w")}</p>
      <p>Here ${M("L")}<sub>0</sub> = ${B1}${B1T} is the graph Laplacian. Adding a constant to every height changes nothing, so <code>src/hodge.rs</code> pins the first exon of each connected piece at 0 and solves for the rest by Gaussian elimination. The cycle fraction is the share of the signal's energy in the cycle part. The two parts are perpendicular, so it's a squared cosine:</p>
      <p class="cd-eq">${M("C")} = &Vert;${wc}&Vert;<sup>2</sup> / &Vert;${M("w")}&Vert;<sup>2</sup> = cos<sup>2</sup>&theta;, &nbsp;&nbsp; &theta; = the angle between ${M("w")} and ker ${B1}</p>
      <p>Fig. 1 draws it. The triangle has three junctions, so its edge space is ordinary 3-D space. The gradients are a plane, and the cycles are the line through (1, &minus;1, 1), at right angles to that plane. Every normalized sample sits on the grey triangle, where the three weights add up to 1.</p>
      <figure class="cd-fig" data-fig="edge"><figcaption><b>Fig. 1</b> Edge space for exon skipping. Black: the sample ${M("w")}. Blue: its shadow on the gradient plane. Pink: its shadow on the cycle line. 30 / 5 / 30 is the crate's example gene TRIANGLE in sample S0. Drag the picture to turn it, or move the reads.</figcaption></figure>

      <h4>4 &middot; the triangle by hand</h4>
      <p>S0 has 30, 5 and 30 reads on E1&rarr;E2, E1&rarr;E3 and E2&rarr;E3, so ${M("w")} = (6, 1, 6)/13 and ${B1}${M("w")} = (&minus;7, 0, 7)/13. Pin &phi;<sub>E1</sub> = 0 and solve the last two rows of</p>
      <p class="cd-eq">${M("L")}<sub>0</sub> = ${mat3(2, -1, -1, -1, 2, -1, -1, -1, 2)} &nbsp;&nbsp; &phi;* = (0, 7, 14) / 39</p>
      <p class="cd-eq">${wg} = (7, 14, 7) / 39, &nbsp;&nbsp; ${wc} = (11, &minus;11, 11) / 39, &nbsp;&nbsp; ${M("C")} = (363/1521) / (73/169) = 121/219</p>
      <p>The crate prints <code>signal_energy 0.4319526627</code>, <code>gradient_energy 0.1932938856</code>, <code>cycle_energy 0.2386587771</code> and <code>cycle_fraction 0.5525114155</code>. Those are 73/169, 294/1521, 363/1521 and 121/219.</p>

      <h4>5 &middot; one loop, one formula</h4>
      <p>Take a graph with exactly one independent loop. Let ${M("z")} be its loop vector: +1 on a junction that runs with the loop, &minus;1 on one that runs against it, 0 off the loop. Let &#8467; be the number of junctions on the loop. Then ker ${B1} is the line through ${M("z")}, and projecting onto a line gives</p>
      <p class="cd-eq">${M("C")} = (${M("z")} &middot; ${M("w")})<sup>2</sup> / (&#8467; &Vert;${M("w")}&Vert;<sup>2</sup>)</p>
      <p>${M("z")} &middot; ${M("w")} is one route's total minus the other's, so hodge_toy.exe's rule of thumb is exact: ${M("C")} = 0 exactly when the routes agree. The formula reproduces the repo's hand-checked fixtures. Equal reads on a triangle give 1/9 (<code>exon_skip.tsv</code>), and 103, 100 and 97 reads give 5618/45027 &asymp; 0.1247695827 (<code>noise.tsv</code>).</p>
      <div class="sg-thm">
        <p><b>A ceiling.</b> Say ${M("p")} junctions on the loop run with it and ${M("m")} against it. Read counts are never negative, so if ${M("z")} &middot; ${M("w")} &ge; 0, then (${M("z")} &middot; ${M("w")})<sup>2</sup> &le; (&Sigma;<sub>with</sub> ${M("w")}<sub>${M("e")}</sub>)<sup>2</sup> &le; ${M("p")}&thinsp;&Vert;${M("w")}&Vert;<sup>2</sup> by Cauchy&ndash;Schwarz. The other sign works the same way with ${M("m")}, so</p>
        <p class="cd-eq">${M("C")} &le; max(${M("p")}, ${M("m")}) / &#8467;</p>
        <p>Equality holds when all the reads sit, evenly, on the bigger side. When every junction follows transcript order, no loop can go all the way round with the arrows, so both sides have at least one junction and ${M("C")} &lt; 1. A triangle tops out at 2/3, and a mutually exclusive square at 1/2.</p>
      </div>
      <p>That's why the crate's example controls, with no reads on the skip, sit exactly at 2/3. The repo's <code>cycle.tsv</code> fixture closes the loop with a junction from E3 back to E1, and only then does ${M("C")} reach 1. In the math spec's words, &ldquo;absence of a directed cycle is not the same as absence of graph cycle-space structure.&rdquo;</p>
      <figure class="cd-fig" data-fig="land"><figcaption><b>Fig. 2</b> Every exon-skipping sample is a point in this triangle (the grey triangle from Fig. 1, laid flat). The color is ${M("C")}, with a contour every 0.1. The black line is where both routes agree, so ${M("C")} = 0 there. Click anywhere to make a sample.</figcaption></figure>

      <h4>6 &middot; the topology: two Laplacians</h4>
      <p>The same matrix gives two Laplacians, one on the exons and one on the junctions. A splice graph has no filled-in faces, so ${M("B")}<sub>2</sub> = 0, and the Hodge 1-Laplacian loses its second term:</p>
      <p class="cd-eq">${M("L")}<sub>0</sub> = ${B1}${B1T}, &nbsp;&nbsp; ${M("L")}<sub>1</sub> = ${B1T}${B1} + ${M("B")}<sub>2</sub>${M("B")}<sub>2</sub><sup>&#8868;</sup> = ${B1T}${B1}</p>
      <p>Their zeros describe the graph's shape. dim ker ${M("L")}<sub>0</sub> = &beta;<sub>0</sub> is the number of connected pieces. dim ker ${M("L")}<sub>1</sub> = &beta;<sub>1</sub> is the number of independent loops, which the crate reports as <code>cycle_rank</code>. And ker ${M("L")}<sub>1</sub> = ker ${B1} is exactly where ${wc} lives: the harmonic 1-forms. In general, Hodge theory splits a flow three ways (gradient, curl and harmonic). With no faces the curl part is empty, so the cycle part <em>is</em> the harmonic part.</p>
      <p>${M("B")}${M("B")}<sup>&#8868;</sup> and ${M("B")}<sup>&#8868;</sup>${M("B")} always have the same nonzero eigenvalues, so the two spectra differ only in their zeros. Counting dimensions gives Euler's formula:</p>
      <p class="cd-eq">|${M("V")}| &minus; |${M("E")}| = &beta;<sub>0</sub> &minus; &beta;<sub>1</sub>, &nbsp;&nbsp; so &nbsp; &beta;<sub>1</sub> = |${M("E")}| &minus; |${M("V")}| + &beta;<sub>0</sub></p>
      <p>A gene with &beta;<sub>1</sub> = 0 has ${M("C")} = 0 whatever its reads, so the study leaves it out instead of counting a guaranteed zero. The crate marks it <code>no_cycle_in_shared_graph</code>.</p>
      <figure class="cd-fig" data-fig="spec"><figcaption><b>Fig. 3</b> Five splice graphs, their incidence matrices and the spectra of both Laplacians. Pink: the zero eigenvalues, which give &beta;<sub>0</sub> and &beta;<sub>1</sub>. Dotted: the eigenvalues the two spectra share. Grey junctions are bridges, which lie on no loop at all.</figcaption></figure>

      <h4>7 &middot; from one sample to eight</h4>
      <p>One gene gives eight numbers, ${M("C")}<sub>S0</sub> &hellip; ${M("C")}<sub>S7</sub>. The effect is the difference in means:</p>
      <p class="cd-eq">&Delta; = mean ${M("C")}(cases) &minus; mean ${M("C")}(controls)</p>
      <p>If the labels don't matter, every way of calling four of the eight samples &ldquo;cases&rdquo; was equally likely. There are only (8 choose 4) = 70 ways, so the test checks every one of them instead of sampling:</p>
      <p class="cd-eq">${M("p")} = #{ splits &pi; : |&Delta;<sub>&pi;</sub>| &ge; |&Delta;<sub>obs</sub>| } / 70</p>
      <p>Calling the other four samples the cases turns every &Delta; into &minus;&Delta;. So extreme splits come in pairs, and a two-sided ${M("p")} can never be smaller than 2/70 &asymp; 0.0286. Vania's statistics spec works out what that means. Under Benjamini&ndash;Hochberg at 0.05 with ${M("m")} genes, a gene at 2/70 passes only if about 0.57${M("m")} genes are also at 2/70. So the inference rules, fixed before any real result existed, name one primary gene-set test as the only result that may be called significant. In the spec's words: &ldquo;This is a hard limit imposed by the sample size (S1's 4-vs-4 design), not a flaw in the method.&rdquo;</p>
      <figure class="cd-fig" data-fig="null"><figcaption><b>Fig. 4</b> The exact null for TRIANGLE in the crate's synthetic example (<code>splice-girl example</code>, then <code>run</code>). These are made-up reads for testing the software, not samples from the study. All 70 splits are stacked by their &Delta;. Drag a bar to change a sample.</figcaption></figure>

      <h4>8 &middot; every answer checks itself</h4>
      <p>No number is reported unless all three of these hold, to a tolerance of 10<sup>&minus;9</sup> scaled by max(1, &Vert;${M("w")}&Vert;):</p>
      <p class="cd-eq">${M("w")} &asymp; ${wg} + ${wc}, &nbsp;&nbsp; ${B1}${wc} &asymp; 0, &nbsp;&nbsp; ${wg}<sup>&#8868;</sup>${wc} &asymp; 0</p>
      <p>The split is complete, the cycle part really never piles up at an exon, and the two parts don't double-count. Fig. 1 prints all three. Beyond those checks, 127 Rust tests pass, and on real reads all 243 genes matched an independent NumPy check.</p>

      <h4>9 &middot; what it does not claim</h4>
      <p>${M("C")} describes the shape of a junction flow. It isn't a mechanism, and reads aren't molecules. A large ${M("C")} says the routes through a gene disagree in a way that no single value per exon can explain, but it doesn't say why. A simpler measure, junction-usage entropy, goes through the same test, and if Hodge does no better, that gets reported.</p>
      <p><b>No case/control result is claimed.</b> Three of the eight samples are aligned. The only result that may ever be called significant is the primary gene-set test in the interpretation plan. Everything on this page is a toy, the crate's synthetic example, or numbers you entered.</p>
      <p class="cd-links">
        <button type="button" class="btn" data-act="toy">open hodge_toy.exe</button>
        <a class="btn" href="${BLOB}docs/math_spec.md"${blank}>math_spec.md &rarr;</a>
        <a class="btn" href="${BLOB}docs/statistics_spec.md"${blank}>statistics_spec.md &rarr;</a>
        <a class="btn" href="${BLOB}src/hodge.rs"${blank}>src/hodge.rs &rarr;</a>
        <a class="btn" href="${BLOB}src/permutation.rs"${blank}>src/permutation.rs &rarr;</a>
        <a class="btn" href="${BLOB}assets/hodgetheorynew.pdf"${blank}>proposal.pdf &rarr;</a>
      </p>`;

  // ---------- files in the folder ----------
  const docIco = `<span class="ico doc"></span>`;
  const folderIco = (src) => `<span class="ico folder"><img src="${src}" alt=""></span>`;
  const urlIco = `<span class="ico sgw-url"></span>`;
  const ICON = {
    toy: `<span class="ico exe sgw-grad"></span>`,
    hpc: `<span class="ico exe sgw-hpc"></span>`,
    dos: `<span class="ico sgw-dos"></span>`,
    math: `<span class="ico doc cd-mathico"></span>`,
    notebook: folderIco(IMG + "demo-report.png"),
    figures: folderIco(IMG + "hodge-decomposition.png"),
  };
  const FILES = [
    { act: "readme", ico: docIco, label: "README.txt", desc: "<b>README.txt</b><br>Text Document<br><br>what it is, in plain words" },
    { act: "math", ico: ICON.math, label: "MATH.md", desc: "<b>MATH.md</b><br>Markdown Document<br><br>the math, written up like a paper: the Hodge split, a ceiling on C, the two Laplacians, and the exact 70-split test. four live figures" },
    { act: "toy", ico: ICON.toy, label: "hodge_toy.exe", desc: "<b>hodge_toy.exe</b><br>Application<br><br>the math from my code, running in your browser. drag the reads around and watch what goes around the loop" },
    { act: "hpc", ico: ICON.hpc, label: "hpc_run.exe", desc: "<b>hpc_run.exe</b><br>Application<br><br>one real sample on the university cluster: 1 h 41 min of alignment, then 5 seconds of Rust. sped up" },
    { act: "dos", ico: ICON.dos, label: "MS-DOS Prompt", desc: "<b>MS-DOS Prompt</b><br>Application<br><br>the published crate, run on its own example. real output" },
    { act: "notebook", ico: ICON.notebook, label: "lab_notebook", desc: `<b>lab_notebook</b><br>File Folder<br><br>my dated logs, sept to nov, quoted word for word` },
    { act: "figures", ico: ICON.figures, label: "figures", desc: `<b>figures</b><br>File Folder<br><br>${FIGS.length} pictures` },
    { act: "design", ico: docIco, label: "study_design.txt", desc: "<b>study_design.txt</b><br>Text Document<br><br>4 cases vs 4 controls, with the rules written down before the run" },
    { act: "team", ico: docIco, label: "team.txt", desc: "<b>team.txt</b><br>Text Document<br><br>the Splice Girls: who did what" },
    { act: `go:${CRATE}`, ico: urlIco, label: "crates.io.url", desc: "<b>crates.io.url</b><br>Internet Shortcut<br><br><code>cargo install splice-girl --locked</code>" },
    { act: `go:${REPO}`, ico: urlIco, label: "github.url", desc: "<b>github.url</b><br>Internet Shortcut<br><br>the source code, the full README, and every log" },
    { act: `go:${DOCSRS}`, ico: urlIco, label: "docs.rs.url", desc: "<b>docs.rs.url</b><br>Internet Shortcut<br><br>the API documentation" },
    { act: `go:${BLOB}assets/hodgetheorynew.pdf`, ico: docIco, label: "proposal.pdf", desc: "<b>proposal.pdf</b><br>PDF Document<br><br>the research proposal, 24 pages, September 2, 2026" },
    { act: `go:${SG}`, ico: docIco, label: "all_about_it.html", desc: "<b>all_about_it.html</b><br>HTML Document<br><br>the plain version of this whole folder, with sources" },
  ];
  const DESC = new Map(FILES.map((f) => [f.act, f.desc]));
  const DEFAULT_DESC = `RNA splice junctions as graphs, split with Hodge theory. a team project for our bioinformatics class, fall 2026. I'm the lead programmer.<br><br>3 of 8 samples aligned so far. no case/control result yet.<br><br>Select an item to view its description.`;

  // ---------- window markup (same structure as the SummerOS page windows) ----------
  function win(id, cls, title, pos, inner, { label } = {}) {
    return `<section class="window ${cls}" id="${id}" tabindex="-1" hidden style="${pos}" aria-label="${esc(label || title)}">
        <header class="titlebar"><h2>${esc(title)}</h2>
          <button type="button" data-a="min" aria-label="Minimize ${esc(title)}">_</button>
          <button type="button" data-a="close" aria-label="Close ${esc(title)}">&times;</button>
        </header>${inner}</section>`;
  }
  function fileGrid(items, label) {
    return `<ul class="dw-grid" role="listbox" aria-label="${esc(label)}">${items.map((it) =>
      `<li><button type="button" class="dw-file" role="option" aria-selected="false" data-act="${esc(it.act)}">${it.ico}<span class="label">${esc(it.label)}</span></button></li>`).join("")}</ul>`;
  }
  const docWindow = (key, d, k) => win(`sgw-doc-${key}`, "notepad sgw-docwin", `${d.title} - Notepad`, `--fx:${(0.3 + k * 0.07).toFixed(2)}; --y:${30 + k * 26}px; --w:${d.w}px`, `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Format</span><span>Help</span></div>
        <div class="pane scroll sgw-doc">${d.html}</div>
        <div class="statusbar" aria-hidden="true"><span>C:\\summer\\research\\splice_girl\\${esc(d.title)}</span><span>Ln 1</span></div>`);

  function template() {
    const explorer = win("sgw-explorer", "sgw-explorer-win", "C:\\summer\\research\\splice_girl", "--fx:0; --y:16px; --w:clamp(480px, 38vw, 560px)", `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div>
        <div class="dw-toolbar"><button type="button" class="btn" data-up>&uarr; Up</button><button type="button" class="btn" data-act="go:${SG}">plain view</button></div>
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\research\\splice_girl</span></div>
        <div class="pane dw-folder">
          <aside class="dw-webview" aria-live="polite">
            <span class="big" aria-hidden="true">${folderIco("/index_me_images/web/research-thumb.jpg")}</span>
            <h3>splice_girl</h3><div class="dw-rule"></div>
            <div class="dw-desc">${DEFAULT_DESC}</div>
          </aside>
          ${fileGrid(FILES, "Files in splice_girl")}
        </div>
        <div class="statusbar"><span>${FILES.length} object(s) &middot; double-click to open</span><span>v0.2.2</span></div>`, { label: "splice_girl folder" });

    // pop up when the folder opens: things I made, in my own logged words
    const diary = win("sgw-diary", "notepad dw-qwnote sgw-diary", "hpc_at_midnight.txt - Notepad", "--fx:1; --y:16px; --w:320px", `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Format</span><span>Help</span></div>
        <div class="pane">
          <p class="dw-qw-kicker">UNC Charlotte HPC &middot; november 2026</p>
          <p>I started downloading case sample SRR36710385 to HPC scratch with <code>prefetch</code> at 23:59:47 on Friday. It finished at 00:11:28 on Saturday (about 11 minutes 41 seconds)&hellip;</p>
          <p>Its first FASTQ conversion attempt failed because the SRA file was nested one directory deeper than the command expected.</p>
          <p>A module conflict involving HDF5 also interrupted the first attempt to load the alignment tools; unloading the SRA-Tools module resolved it.</p>
          <p><button type="button" class="btn" data-act="hpc">replay a run: hpc_run.exe</button> <a href="${BLOB}logs/november_19th_summer.md"${blank}>the log &rarr;</a></p>
        </div>
        <div class="statusbar" aria-hidden="true"><span>quoted from my logs, nov 19 + 20</span><span>Ln 1</span></div>`, { label: "hpc_at_midnight.txt, quoted from my logs" });
    const math = win("sgw-math", "cd-readme sgw-math", "MATH.md - splice_girl", "--fx:1; --y:16px; --w:680px", `
        <div class="pane cd-doc">${MATH}</div>
        <div class="statusbar" aria-hidden="true"><span>C:\\summer\\research\\splice_girl\\MATH.md</span><span>9 sections &middot; 4 live figures</span></div>`, { label: "MATH.md: the math of Splice Girl, with live figures" });

    const toy = win("sgw-toy", "sgw-toywin", "hodge_toy.exe", "--fx:1; --y:10px; --w:min(600px, 50vw)", `
        <div class="pane sgw-toy-pane">
          <div class="sgw-presets" role="group" aria-label="Splicing pattern">${PRESETS.map((p, i) => `<button type="button" class="btn" data-preset="${i}" aria-pressed="false">${esc(p.label)}</button>`).join("")}</div>
          <svg class="sgw-graph" viewBox="0 0 560 396" role="img" aria-label="Splice graph"></svg>
          <div class="sgw-read">
            <span class="sgw-cbig" aria-live="polite"></span><span class="sgw-cbar" aria-hidden="true"><i></i></span>
            <p class="sgw-say"></p>
            <p class="sgw-checks"></p>
          </div>
          <div class="sgw-sliders"></div>
          <div class="sgw-tries"></div>
          <p class="sgw-note"></p>
          <p class="sgw-legend">drawn the way the program draws its own figures: one line-width scale for all three panels, solid = positive, dashed = negative, and arrows always keep the junction's direction.${reduced ? "" : " the pink dots are the flow."}</p>
        </div>
        <div class="statusbar" aria-hidden="true"><span>same math as src/hodge.rs</span><span>hodge_toy.exe</span></div>`, { label: "hodge_toy.exe: the Hodge decomposition, live" });

    const hpc = win("sgw-hpc", "sgw-hpc", "hpc_run.exe - SRR36710386", "--fx:0.62; --y:36px; --w:470px", `
        <div class="dw-toolbar"><button type="button" class="btn primary" data-hpc-run>&#9654; run</button><button type="button" class="btn" data-hpc-skip>skip to the end</button><span>&nbsp;speed:</span>${[60, 600, 3600].map((x) => `<button type="button" class="btn" data-speed="${x}" aria-pressed="${x === 600}">${x}&times;</button>`).join("")}</div>
        <div class="pane sgw-hpc-pane">
          <p class="sgw-clock"><span class="sgw-t">00:00:00</span><small>cluster time &middot; time-lapse at <b class="sgw-x">600&times;</b></small></p>
          ${STAGES.map((st, i) => `
          <section class="sgw-stage${st.hodge ? " hodge" : ""}" data-stage="${i}">
            <h4><span>${i + 1}. ${esc(st.name)}</span><span class="sgw-el">&ndash;</span></h4>
            <p class="job">${esc(st.job)}</p>
            <div class="sgw-bar" aria-hidden="true">${"<i></i>".repeat(28)}</div>
            <dl class="sgw-stats">${st.out.map(([k, v, mode]) => `<dt>${esc(k)}</dt><dd data-mode="${mode}" data-v="${esc(v)}">&nbsp;</dd>`).join("")}</dl>
          </section>`).join("")}
          <div class="sgw-hpc-end" hidden>
            <p><b>drawn to scale:</b> alignment, then Hodge</p>
            <div class="sgw-scale" role="img" aria-label="Time bar: 6,107 seconds of alignment and 5 seconds of Hodge analysis, to scale"><span></span><span></span></div>
            <p>the pink sliver is the 5-second Hodge stage, about 0.08% of the 1 h 41 min 47 s before it.</p>
            <p class="sgw-me">The 28.8 million figure is an observation count from the junction-assignment stage, not a claim that the whole analysis ran in five seconds.</p>
            <p>3 of the 8 samples have been through this so far. Another case sample, SRR36710385, took 2 h 53 min 36 s on November 21. <a href="${BLOB}logs/november_19th_summer.md"${blank}>the full log &rarr;</a></p>
          </div>
        </div>
        <div class="statusbar" aria-hidden="true"><span>one endometriosis sample &middot; November 19, 2026</span><span>UNC Charlotte HPC</span></div>`, { label: "hpc_run.exe: one sample on the cluster" });

    const dos = win("sgw-dos", "cd-dos sgw-doswin", "MS-DOS Prompt", "--fx:0.45; --y:120px; --w:600px", `
        <div class="dw-toolbar"><button type="button" class="btn" data-dos="run">Run the example</button><button type="button" class="btn" data-dos="start">splice-girl --start</button></div>
        <div class="pane cd-dos-pane"><pre class="cd-dos-out sgw-dos-out" aria-live="polite"></pre></div>`, { label: "MS-DOS Prompt running splice-girl" });

    const notebook = win("sgw-notebook", "sgw-subfolder", "C:\\summer\\research\\splice_girl\\lab_notebook", "--fx:0.3; --y:64px; --w:540px", `
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\research\\splice_girl\\lab_notebook</span></div>
        <div class="pane" style="padding:0">${fileGrid(LOGS.map((l) => ({ act: `log:${l.f}`, ico: docIco, label: `${l.f}.log` })), "Lab notebook")}</div>
        <div class="statusbar"><span>${LOGS.length} object(s)</span><span>september &ndash; november 2026</span></div>`);

    const figures = win("sgw-figures", "sgw-subfolder", "C:\\summer\\research\\splice_girl\\figures", "--fx:0.4; --y:90px; --w:520px", `
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\research\\splice_girl\\figures</span></div>
        <div class="pane" style="padding:0">${fileGrid(FIGS.map(([name, src]) => ({ act: `fig:${name}`, ico: `<span class="ico sgw-pic"><img src="${IMG + src}" alt=""></span>`, label: name })), "Figures")}</div>
        <div class="statusbar"><span>${FIGS.length} object(s)</span><span>click a picture to open it</span></div>`);

    const viewer = win("sgw-viewer", "dw-viewer sgw-viewer", "Image Viewer", "--fx:0.5; --y:24px; --w:min(900px, 66vw)", `
        <div class="dw-nav"><button type="button" class="btn" data-v="-1" aria-label="Previous picture">&lsaquo; prev</button><button type="button" class="btn" data-v="1" aria-label="Next picture">next &rsaquo;</button></div>
        <div class="pane"><img alt=""></div>
        <p class="dw-cap"></p>`, { label: "Image viewer" });

    const docs = Object.entries(DOCS).map(([key, d], k) => docWindow(key, d, k)).join("");

    const icons = [
      ["back", folderIco("/index_me_images/web/booth-1.jpg"), "\u2190 back to summer"],
      ["folder", folderIco("/index_me_images/web/research-thumb.jpg"), "splice_girl"],
      ["toy", ICON.toy, "hodge_toy.exe"],
      ["hpc", ICON.hpc, "hpc_run.exe"],
      ["math", ICON.math, "MATH.md"],
      ["dos", ICON.dos, "MS-DOS Prompt"],
      ["notebook", ICON.notebook, "lab_notebook"],
      ["figures", ICON.figures, "figures"],
    ];
    return `
      <div class="dw-wall" aria-hidden="true"></div>
      <ul class="icons" aria-label="Splice Girl desktop">${icons.map(([k, ico, label]) => `<li><button class="icon" type="button" data-icon="${k}">${ico}<span class="label">${esc(label)}</span></button></li>`).join("")}</ul>
      ${explorer}${diary}${math}${toy}${hpc}${dos}${notebook}${figures}${docs}${viewer}
      <div class="sgw-boot" hidden aria-hidden="true"><span class="sgw-boot-hint">click or press any key to skip</span><pre class="sgw-boot-out"></pre></div>`;
  }

  function logWindow(l, k) {
    const i = LOGS.indexOf(l);
    const prev = i > 0 ? `<button type="button" class="btn" data-act="log:${LOGS[i - 1].f}">&lsaquo; ${LOGS[i - 1].f}</button>` : "";
    const next = i < LOGS.length - 1 ? `<button type="button" class="btn" data-act="log:${LOGS[i + 1].f}">${LOGS[i + 1].f} &rsaquo;</button>` : "";
    return win(`sgw-log-${l.f}`, "notepad", `${l.f}.log - Notepad`, `--fx:${(0.24 + (k % 5) * 0.06).toFixed(2)}; --y:${44 + (k % 5) * 26}px; --w:460px`, `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>Format</span><span>Help</span></div>
        <div class="pane scroll dw-log">
          <h1>${esc(l.short)}</h1>
          <p class="when">${esc(l.date)} &middot; lab notebook</p>
          <h2>${esc(l.title)}</h2>
          ${l.img ? `<img src="${IMG + l.img[0]}" alt="${esc(l.img[1])}" loading="lazy">` : ""}
          ${l.quotes.map((q) => `<p class="me">${q}</p>`).join("")}
          ${l.checks ? `<ul class="sgw-checklist">${l.checks.map((c) => `<li>${c}</li>`).join("")}</ul>` : ""}
          ${l.pre ? `<pre class="sgw-menu">${esc(l.pre)}</pre>` : ""}
          <div class="files-row"><a class="btn primary" href="${BLOB}logs/${l.file}"${blank}>the full log on GitHub &rarr;</a>${l.go ? `<button type="button" class="btn" data-act="${l.go[0]}">${esc(l.go[1])}</button>` : ""}</div>
          <div class="files-row" style="margin-top:10px">${prev}${next}</div>
        </div>
        <div class="statusbar" aria-hidden="true"><span>quoted word for word from my log</span><span>${i + 1} of ${LOGS.length}</span></div>`);
  }

  // ---------- window plumbing (same behavior as the dreu folder) ----------
  let root = null, z = 20, isOpen = false, pushed = false, lastTrigger = null, task = null, logCount = 0;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];

  function focusW(w) { w.style.zIndex = ++z; $$(".window").forEach((x) => x.classList.toggle("inactive", x !== w)); }
  function showW(w, moveFocus = true) {
    const was = w.hidden;
    w.hidden = false; focusW(w);
    if (was && !reduced) { w.classList.remove("dw-popin"); void w.offsetWidth; w.classList.add("dw-popin"); }
    if (w.id === "sgw-toy") startToy();
    if (!moveFocus) return;
    w.focus({ preventScroll: wide.matches });
    if (!wide.matches) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }
  function hideW(w) {
    if (w.id === "sgw-explorer") { close(); return; }
    w.hidden = true;
    if (w.id === "sgw-dos") dosRun++;
    if (w.id === "sgw-math") window.sgFigures?.stop();
    if (w.id === "sgw-hpc") hpcRun++;
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

  function act(a) {
    if (a.startsWith("go:")) {
      const href = a.slice(3);
      if (ext(href)) window.open(href, "_blank", "noopener"); else location.href = href;
    } else if (a.startsWith("log:")) {
      const l = LOGS.find((x) => x.f === a.slice(4));
      let el = $(`#sgw-log-${l.f}`);
      if (!el) {
        root.querySelector(".sgw-boot").before(document.createRange().createContextualFragment(logWindow(l, logCount++)));
        el = $(`#sgw-log-${l.f}`); wireWindow(el); wireActs(el);
      }
      showW(el);
    } else if (a.startsWith("fig:")) showFigure(FIGS.findIndex((f) => f[0] === a.slice(4)));
    else if (a === "math") openMath();
    else if (DOCS[a]) showW($(`#sgw-doc-${a}`));
    else if (a === "toy") showW($("#sgw-toy"));
    else if (a === "hpc") { const w = $("#sgw-hpc"), fresh = w.hidden; showW(w); if (fresh) runHPC(); }
    else if (a === "dos") { const w = $("#sgw-dos"), fresh = w.hidden; showW(w); if (fresh) runDos("run"); }
    else if (a === "start") { showW($("#sgw-dos")); runDos("start"); }
    else if (a === "notebook") showW($("#sgw-notebook"));
    else if (a === "figures") showW($("#sgw-figures"));
  }

  // Explorer-style files: click selects (and shows the description), double-click opens.
  function wireActs(scope) {
    scope.querySelectorAll("[data-act]").forEach((el) => {
      if (!el.classList.contains("dw-file")) { el.addEventListener("click", () => act(el.dataset.act)); return; }
      el.addEventListener("click", (e) => {
        el.closest(".dw-grid").querySelectorAll(".dw-file").forEach((f) => f.setAttribute("aria-selected", String(f === el)));
        const desc = el.closest(".dw-folder")?.querySelector(".dw-desc");
        if (desc && DESC.has(el.dataset.act)) {
          desc.innerHTML = `${DESC.get(el.dataset.act)}<br><br><a href="#" class="dw-open-link">open it &rarr;</a>`;
          desc.querySelector(".dw-open-link").addEventListener("click", (ev) => { ev.preventDefault(); act(el.dataset.act); });
        }
        // keyboard Enter, a tap, or anything in a subfolder opens on one click
        if (e.detail === 0 || matchMedia("(pointer: coarse)").matches || !desc) act(el.dataset.act);
      });
      el.addEventListener("dblclick", () => { if (el.closest(".dw-folder")) act(el.dataset.act); });
    });
  }

  // MATH.md's figures live in their own file, loaded the first time it opens
  let figsP = null;
  function openMath(moveFocus = true) {
    const m = $("#sgw-math");
    showW(m, moveFocus);
    figsP ||= new Promise((ok, no) => document.head.appendChild(Object.assign(document.createElement("script"), { src: "/summeros/sg-figures.js", onload: ok, onerror: no })));
    figsP.then(() => window.sgFigures.mount(m)).catch(() => {});
  }
  function figGo(key) {
    const fig = $(`#sgw-math figure[data-fig="${key}"]`), pane = $("#sgw-math .cd-doc");
    if (!fig) return;
    if (!wide.matches) { fig.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" }); return; }
    const top = pane.scrollTop + fig.getBoundingClientRect().top - pane.getBoundingClientRect().top - 12;
    pane.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }

  let figI = 0;
  function showFigure(i) {
    figI = (i + FIGS.length) % FIGS.length;
    const [name, src, cap] = FIGS[figI], w = $("#sgw-viewer"), img = w.querySelector("img");
    w.querySelector(".titlebar h2").textContent = `${name} - Image Viewer`;
    img.src = IMG + src; img.alt = cap;
    w.querySelector(".dw-cap").textContent = cap;
    showW(w);
  }

  // ---------- hodge_toy.exe ----------
  const TRACKS = [
    ["1. Observed signal", "reads / total", (h) => h.w],
    ["2. Gradient part", "one height per exon", (h) => h.grad],
    ["3. Cycle part", "what goes around", (h) => h.cycle],
  ];
  const TH = 132;
  let toy = { p: 0, counts: [] }, arcs = [], dots = [], phases = {}, raf = 0, last = 0;
  const exX = (name, n) => 70 + (Number(name.slice(1)) - 1) * (420 / (n - 1));
  const num = (v, d = 3) => `${v < 0 ? "\u2212" : ""}${Math.abs(v).toFixed(d)}`;
  const pct = (x) => `${(x * 100).toFixed(x > 0 && x < 0.1 ? 1 : 0)}%`;

  function geom(a, b, n, base) {
    const span = Number(b.slice(1)) - Number(a.slice(1)), above = span > 1;
    const x0 = exX(a, n) + 18, x2 = exX(b, n) - 18, y = above ? base - 9 : base + 9;
    const d = above ? 30 + 16 * (span - 2) : 18;
    const cx = (x0 + x2) / 2, cy = above ? y - 2 * d : y + 2 * d;
    return { above, P: [[x0, y], [cx, cy], [x2, y]], apex: [cx, above ? y - d : y + d] };
  }
  const bez = (P, t) => { const u = 1 - t; return [u * u * P[0][0] + 2 * u * t * P[1][0] + t * t * P[2][0], u * u * P[0][1] + 2 * u * t * P[1][1] + t * t * P[2][1]]; };

  function setPreset(i, counts, note) {
    const p = PRESETS[i];
    if (i !== toy.p) phases = {};
    toy = { p: i, counts: counts ? [...counts] : p.edges.map((e) => e[2]) };
    $$("[data-preset]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.preset) === i)));
    $(".sgw-sliders").innerHTML = p.edges.map(([a, b], k) => `<label class="sgw-edge"><span>${a}&rarr;${b}</span><input type="range" min="0" max="100" step="1" value="${toy.counts[k]}" data-k="${k}" aria-label="reads on the junction ${a} to ${b}"><output>${toy.counts[k]} reads</output></label>`).join("");
    $$(".sgw-edge input").forEach((inp) => inp.addEventListener("input", () => {
      const k = Number(inp.dataset.k);
      toy.counts[k] = Number(inp.value);
      inp.nextElementSibling.textContent = `${inp.value} reads`;
      $(".sgw-note").textContent = p.note;
      drawToy();
    }));
    $(".sgw-tries").innerHTML = p.tries.length ? `<span>try:</span>${p.tries.map(([label], k) => `<button type="button" class="btn" data-try="${k}">${esc(label)}</button>`).join("")}` : "";
    $$("[data-try]").forEach((b) => b.addEventListener("click", () => { const [, c, n] = p.tries[Number(b.dataset.try)]; setPreset(i, c, n); }));
    $(".sgw-note").textContent = note || p.note;
    drawToy();
  }

  function drawToy() {
    const p = PRESETS[toy.p], n = p.exons;
    const edges = p.edges.map(([from, to], k) => ({ from, to, count: toy.counts[k] }));
    const h = hodge(edges);
    const maxW = h ? Math.max(...h.w) : 1;
    let svg = "", dotSvg = "";
    arcs = [];
    TRACKS.forEach(([name, sub, pick], t) => {
      const y0 = t * TH, base = y0 + 82;
      if (t) svg += `<line class="sep" x1="0" x2="560" y1="${y0}" y2="${y0}"/>`;
      svg += `<text class="tl" x="12" y="${y0 + 19}">${name}<tspan class="ts" dx="10">${esc(sub)}</tspan></text>`;
      for (let i = 1; i < n; i++) svg += `<line class="intron" x1="${exX(`E${i}`, n) + 23}" x2="${exX(`E${i + 1}`, n) - 23}" y1="${base}" y2="${base}"/>`;
      const vals = h ? pick(h) : edges.map(() => 0);
      p.edges.forEach(([a, b], k) => {
        const v = vals[k], g = geom(a, b, n, base);
        const cls = Math.abs(v) < 1e-12 ? "zero" : v > 0 ? "pos" : "neg";
        const sw = cls === "zero" ? 1.2 : 1.5 + (10 * Math.abs(v)) / maxW;
        const [P0, P1, P2] = g.P;
        svg += `<path class="arc ${cls}" stroke-width="${sw.toFixed(2)}" d="M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}"/>`;
        if (cls !== "zero") {
          const dir = 1, [ax, ay] = g.apex, s = 4 + sw * 0.3;
          svg += `<path class="head ${cls}" d="M${(ax + dir * s).toFixed(1)} ${ay} L${(ax - dir * s).toFixed(1)} ${(ay - s * 0.85).toFixed(1)} L${(ax - dir * s).toFixed(1)} ${(ay + s * 0.85).toFixed(1)}Z"/>`;
        }
        const label = t === 0 ? String(toy.counts[k]) : `${v > 1e-12 ? "+" : ""}${num(Math.abs(v) < 1e-12 ? 0 : v)}`;
        svg += `<text class="val ${cls}" x="${g.apex[0]}" y="${(g.above ? g.apex[1] - sw / 2 - 9 : g.apex[1] + sw / 2 + 15).toFixed(1)}">${label}</text>`;
        const j = arcs.length;
        arcs.push({ P: g.P, v: cls === "zero" ? 0 : v / maxW });
        if (!reduced && cls !== "zero") {
          const key = `${t}-${k}`;
          phases[key] ||= [0, 1 / 3, 2 / 3];
          phases[key].forEach((_, d) => { dotSvg += `<circle class="dot" r="2.4" data-j="${j}" data-key="${key}" data-d="${d}" cx="-9" cy="-9"/>`; });
        }
      });
      for (let i = 1; i <= n; i++) {
        const x = exX(`E${i}`, n);
        svg += `<rect class="ex" x="${x - 23}" y="${base - 9}" width="46" height="18" rx="2"/><text class="exl" x="${x}" y="${base + 4}">E${i}</text>`;
      }
    });
    const el = $(".sgw-graph");
    el.innerHTML = svg + dotSvg;
    dots = [...el.querySelectorAll(".dot")].map((c) => ({ c, j: Number(c.dataset.j), ph: phases[c.dataset.key], d: Number(c.dataset.d) }));
    placeDots();
    el.setAttribute("aria-label", `${p.label}: ${p.edges.map(([a, b], k) => `${a} to ${b}, ${toy.counts[k]} reads`).join("; ")}. ${h ? `Cycle fraction ${h.C.toFixed(4)}.` : "No reads."}`);

    // the readout
    const bar = $(".sgw-cbar i");
    if (!h) {
      $(".sgw-cbig").textContent = "cycle fraction \u2014";
      bar.style.width = "0";
      $(".sgw-say").textContent = "no reads at all. the crate stops here too: zero total support is an error, not a zero.";
      $(".sgw-checks").textContent = "";
      return;
    }
    const C = h.C < 1e-12 ? 0 : h.C;
    $(".sgw-cbig").textContent = `cycle fraction ${C.toFixed(4)}`;
    bar.style.width = `calc(${(C * 100).toFixed(2)}% - ${(C * 4).toFixed(2)}px)`;
    const route = (r) => [p.edges[r[0]][0], ...r.map((e) => p.edges[e][1])].join("\u2192");
    const sums = p.routes.map((r) => r.reduce((a, e) => a + h.w[e], 0));
    const agree = sums.every((x) => Math.abs(x - sums[0]) < 1e-9);
    const parts = p.routes.map((r, k) => `${route(r)} ${k ? "to" : "adds up to"} ${sums[k].toFixed(2)}`);
    const listed = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
    $(".sgw-say").textContent = h.rank === 0
      ? "only one way through, so there's nothing to go around. C is 0 whatever the counts."
      : agree
        ? `${listed}. they match, so one height per exon explains all of it: C = 0.`
        : `${listed}. they don't match, so ${pct(C)} of the signal energy goes around ${h.rank > 1 ? "the loops" : "the loop"}.`;
    const ok = h.checks.every((c) => c[2]);
    $(".sgw-checks").textContent = `checks ${ok ? "PASS" : "FAIL"} \u00b7 ${h.checks.map(([nm, v]) => `${nm} ${v.toExponential(1)}`).join(" \u00b7 ")}`;
  }

  function placeDots() {
    dots.forEach(({ c, j, ph, d }) => {
      const [x, y] = bez(arcs[j].P, ph[d]);
      c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1));
    });
  }
  const toyLive = () => isOpen && root && !root.hidden && !$("#sgw-toy").hidden && !reduced;
  function frame(now) {
    if (!toyLive()) { raf = 0; return; }
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    const moved = new Set();
    dots.forEach(({ j, ph, d }) => {
      if (moved.has(ph)) return;
      moved.add(ph);
      for (let q = 0; q < ph.length; q++) ph[q] = (((ph[q] + dt * 0.5 * arcs[j].v) % 1) + 1) % 1;
    });
    placeDots();
    raf = requestAnimationFrame(frame);
  }
  function startToy() {
    if (raf || !toyLive()) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // ---------- hpc_run.exe ----------
  let hpcRun = 0, speed = 600;
  const hms = (s) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60)].map((x) => String(x).padStart(2, "0")).join(":");
  const span = (s) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min ${s % 60} s` : s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s} s`);
  async function runHPC(skip = false) {
    const id = ++hpcRun, clock = $(".sgw-t");
    $(".sgw-hpc-end").hidden = true;
    $$(".sgw-stage").forEach((sec) => {
      sec.querySelectorAll(".sgw-bar i").forEach((i) => { i.style.visibility = "hidden"; });
      sec.querySelector(".sgw-el").textContent = "\u2013";
      sec.querySelectorAll("dd").forEach((dd) => { dd.innerHTML = "&nbsp;"; });
    });
    let before = 0;
    for (const [i, st] of STAGES.entries()) {
      const sec = $(`[data-stage="${i}"]`), bars = sec.querySelectorAll(".sgw-bar i"), el = sec.querySelector(".sgw-el"), dds = sec.querySelectorAll("dd");
      const dur = skip || reduced ? 0 : (st.secs / speed) * 1000, t0 = performance.now();
      await new Promise((done) => {
        const step = () => {
          if (id !== hpcRun) { done(); return; }
          const f = dur ? Math.min(1, (performance.now() - t0) / dur) : 1;
          const lit = Math.round(f * bars.length);
          bars.forEach((b, k) => { b.style.visibility = k < lit ? "visible" : "hidden"; });
          el.textContent = hms(f * st.secs);
          clock.textContent = hms(before + f * st.secs);
          dds.forEach((dd) => { if (dd.dataset.mode === "n") dd.textContent = Math.round(f * Number(dd.dataset.v)).toLocaleString("en-US"); });
          if (f < 1) requestAnimationFrame(step); else done();
        };
        step();
      });
      if (id !== hpcRun) return;
      before += st.secs;
      el.textContent = `${span(st.secs)} \u2713`;
      dds.forEach((dd) => { if (dd.dataset.mode === "end") dd.textContent = dd.dataset.v; });
      if (!skip) await sleep(260);
      if (id !== hpcRun) return;
    }
    $(".sgw-hpc-end").hidden = false;
  }

  // ---------- MS-DOS Prompt ----------
  let dosRun = 0;
  let bannerP = null;
  const getBanner = () => (bannerP ||= fetch(SG + "banner.txt").then((r) => (r.ok ? r.text() : "")).catch(() => ""));
  const mark = (line) => esc(line).replace(/\bPASS\b/g, '<span class="pass">PASS</span>');
  async function runDos(kind) {
    const id = ++dosRun, out = $(".sgw-dos-out"), pane = out.parentElement;
    const live = () => id === dosRun && isOpen;
    const cursor = '<span class="cd-cursor" aria-hidden="true">_</span>';
    const scroll = () => { pane.scrollTop = pane.scrollHeight; };
    let text = "";
    const paint = (extra = "") => { out.innerHTML = text + extra + cursor; scroll(); };
    const type = async (prompt, cmd) => {
      text += esc(prompt);
      for (let k = 1; k <= cmd.length; k++) {
        if (!live()) return false;
        paint(`<span class="hi">${esc(cmd.slice(0, k))}</span>`);
        await sleep(cmd.length > 30 ? 14 : 26);
      }
      text += `<span class="hi">${esc(cmd)}</span>\n`;
      paint();
      await sleep(240);
      return live();
    };
    if (kind === "start") {
      const banner = await getBanner();
      if (!(await type("C:\\SUMMER>", "splice-girl --start"))) return;
      text += `<span class="art">${esc(banner.replace(/\n$/, ""))}</span>\n`;
      paint();
      for (const line of MENU) { if (!live()) return; text += `${esc(line)}\n`; paint(); await sleep(30); }
      text += "  Choose an option: ";
      paint();
      return;
    }
    for (const [prompt, cmd, output] of DOS) {
      if (!(await type(prompt, cmd))) return;
      for (const line of output ? output.split("\n") : []) {
        if (!live()) return;
        text += `${mark(line)}\n`;
        paint();
        await sleep(32);
      }
      text += "\n";
      paint();
      await sleep(300);
    }
    text += esc("C:\\SUMMER\\SPLICE~1>");
    paint();
  }

  // ---------- boot: the real `splice-girl --start` ----------
  let skipBoot = null;
  async function boot() {
    const el = $(".sgw-boot"), out = $(".sgw-boot-out");
    const banner = await getBanner();
    if (!isOpen) return;
    el.hidden = false; el.classList.remove("off");
    out.classList.remove("full");
    out.innerHTML = "";
    let skip = false;
    const done = new Promise((resolve) => { skipBoot = () => { skip = true; resolve(); }; });
    // focus is still back on the SummerOS desktop, so listen on the document
    const onKey = (e) => { if (skipBoot) { e.preventDefault(); skipBoot(); } };
    document.addEventListener("keydown", onKey);
    done.then(() => document.removeEventListener("keydown", onKey));
    const wait = (ms) => Promise.race([sleep(ms), done]);
    const fit = () => out.classList.toggle("full", out.offsetHeight > el.clientHeight - 20);
    out.innerHTML = `C:\\SUMMER\\RESEARCH&gt;<span class="cmd"></span><span class="cd-cursor">_</span>`;
    const cmd = out.querySelector(".cmd");
    for (const ch of "splice-girl --start") { if (skip) break; cmd.textContent += ch; await wait(42); }
    if (!skip) await wait(260);
    if (!skip && banner) {
      out.querySelector(".cd-cursor").remove();
      out.append("\n");
      const art = document.createElement("span");
      art.className = "art";
      art.style.fontSize = `${Math.max(4, Math.min((el.clientHeight - 30) / 94, (el.clientWidth - 30) / (117 * 0.6))).toFixed(2)}px`;
      out.append(art);
      const lines = banner.replace(/\n$/, "").split("\n");
      for (let i = 0; i < lines.length && !skip; i += 3) {
        art.textContent += `${lines.slice(i, i + 3).join("\n")}\n`;
        fit();
        await wait(18);
      }
      for (const line of MENU) { if (skip) break; out.append(`${line}\n`); fit(); await wait(45); }
      if (!skip) { out.insertAdjacentHTML("beforeend", `  Choose an option: <span class="cd-cursor">_</span>`); fit(); await wait(900); }
    }
    if (skipBoot) skipBoot();   // resolves `done`, which removes the key listener
    skipBoot = null;
    el.classList.add("off");
    await sleep(250);
    el.hidden = true;
  }

  // ---------- the desktop ----------
  // wallpaper: the startup banner I drew for the CLI, as stickers, the way
  // the dreu folder scatters Block I's. Drawn once into an image per color.
  function stickerSrc(text, card, ink) {
    const lines = text.replace(/\s+$/, "").split("\n");
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const rows = lines.map((l) => l.slice(indent)), cols = Math.max(...rows.map((l) => l.length));
    const fs = 8, pad = 18, k = 2, c = document.createElement("canvas"), x = c.getContext("2d");
    const font = `bold ${fs}px "Courier New", Courier, monospace`;
    x.font = font;
    const cw = x.measureText("M").width, W = cols * cw + pad * 2, H = rows.length * fs + pad * 2;
    c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    x.scale(k, k);
    x.fillStyle = card;
    if (x.roundRect) { x.beginPath(); x.roundRect(0, 0, W, H, 12); x.fill(); } else x.fillRect(0, 0, W, H);
    x.fillStyle = ink; x.font = font; x.textBaseline = "top";
    rows.forEach((l, i) => x.fillText(l, pad, pad + i * fs));
    return { src: c.toDataURL("image/png"), ratio: W / H };
  }
  let wallFor = "";
  function paintWall(text) {
    const W = Math.max(window.innerWidth, 400), H = Math.max(window.innerHeight, 500);
    if (!text || wallFor === `${W}x${H}`) return;
    wallFor = `${W}x${H}`;
    const looks = [stickerSrc(text, "#ffffff", "#4a2640"), stickerSrc(text, "#000000", "#ffafaf")];
    const cw = W < 900 ? 170 : 250, ch = W < 900 ? 210 : 300;
    let out = "";
    for (let y = -60; y < H + 40; y += ch) {
      const row = Math.round(y / ch);
      for (let x = -60 + (row % 2 ? cw / 2 : 0); x < W + 40; x += cw) {
        const look = looks[Math.floor(Math.random() * looks.length)];
        const h = (W < 900 ? 140 : 200) + Math.random() * 80;
        const left = x + (Math.random() - 0.5) * cw * 0.5, top = y + (Math.random() - 0.5) * ch * 0.4;
        out += `<img class="sgw-st" src="${look.src}" alt="" style="left:${left.toFixed(0)}px; top:${top.toFixed(0)}px; height:${h.toFixed(0)}px; width:${(h * look.ratio).toFixed(0)}px; rotate:${((Math.random() - 0.5) * 32).toFixed(1)}deg; z-index:${Math.floor(Math.random() * 5)}">`;
      }
    }
    $(".dw-wall").innerHTML = out;
  }

  // the folder on the left; my midnight HPC note on the right; the two
  // figures I made in between (or under the note on a narrower screen)
  const measure = (el) => {
    const was = el.hidden;
    el.style.visibility = "hidden"; el.hidden = false;
    const r = { left: el.offsetLeft, top: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    el.hidden = was; el.style.visibility = "";
    return r;
  };
  function layout() {
    if (!wide.matches) return;
    const ex = measure($("#sgw-explorer")), m = $("#sgw-math"), di = $("#sgw-diary");
    const W = root.clientWidth, H = root.clientHeight, gap = 16, exRight = ex.left + ex.w;
    let mw = Math.min(720, W - 20 - exRight - gap), ml = exRight + gap;
    if (mw < 540) { mw = Math.min(660, W - 240); ml = W - 20 - mw; }
    m.style.setProperty("--w", `${mw}px`);
    Object.assign(m.style, { left: `${ml}px`, top: "16px", height: `${Math.max(360, H - 32)}px` });
    // hpc_at_midnight.txt: to the right of the paper on a very wide screen, otherwise under the folder
    const right = ml + mw + gap;
    di.classList.toggle("sgw-docked", W - 20 - right < 300);
    if (W - 20 - right >= 300) {
      di.style.setProperty("--w", `${Math.min(340, W - 20 - right)}px`);
      Object.assign(di.style, { left: `${right}px`, top: "16px" });
    } else {
      const room = ml - gap - (ex.left + 20);   // between the folder's left edge and the paper
      di.style.setProperty("--w", `${room >= 260 ? Math.min(520, ex.w - 40, room) : 300}px`);
      const h = measure(di).h;
      Object.assign(di.style, { left: `${ex.left + 20}px`, top: `${Math.max(16, Math.min(ex.top + ex.h + gap, H - h - 14))}px` });
    }
  }

  function build() {
    root = document.createElement("div");
    root.className = "dw sgw";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "splice_girl: topological analysis of RNA splicing");
    root.innerHTML = template();
    document.body.append(root);

    $$(".window").forEach(wireWindow);
    wireActs(root);
    $("[data-up]").addEventListener("click", () => close());
    $$("[data-icon]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.icon;
      if (k === "back") close();
      else if (k === "folder") showW($("#sgw-explorer"));
      else act(k);
    }));
    $$("[data-preset]").forEach((b) => b.addEventListener("click", () => setPreset(Number(b.dataset.preset))));
    $("[data-hpc-run]").addEventListener("click", () => runHPC());
    $("[data-hpc-skip]").addEventListener("click", () => runHPC(true));
    $$("[data-speed]").forEach((b) => b.addEventListener("click", () => {
      speed = Number(b.dataset.speed);
      $$("[data-speed]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      $(".sgw-x").textContent = `${speed}\u00d7`;
      runHPC();
    }));
    $$("[data-dos]").forEach((b) => b.addEventListener("click", () => runDos(b.dataset.dos)));
    $$("[data-v]").forEach((b) => b.addEventListener("click", () => showFigure(figI + Number(b.dataset.v))));
    $("#sgw-viewer img").addEventListener("click", () => showFigure(figI + 1));
    $(".sgw-boot").addEventListener("click", () => skipBoot && skipBoot());
    window.addEventListener("resize", () => { if (isOpen) { placeOverTaskbar(); layout(); } });
    $$("[data-fig-go]").forEach((b) => b.addEventListener("click", () => figGo(b.dataset.figGo)));
    root.addEventListener("keydown", (e) => {
      if (skipBoot) { e.preventDefault(); skipBoot(); return; }
      if (e.key !== "Escape") return;
      e.preventDefault();
      const top = $$(".window:not([hidden])").filter((w) => w.id !== "sgw-explorer").sort((a, b) => (Number(b.style.zIndex) || 0) - (Number(a.style.zIndex) || 0))[0];
      if (top) hideW(top); else close();
    });
    setPreset(0);
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
    task.type = "button"; task.className = "task"; task.textContent = "C:\\summer\\research\\splice_girl"; task.setAttribute("aria-pressed", "true");
    task.addEventListener("click", () => {
      if (root.hidden) { root.hidden = false; task.setAttribute("aria-pressed", "true"); document.documentElement.style.overflow = "hidden"; startToy(); }
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
      const frameOf = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      const anim = z0.animate([frameOf(a), frameOf({ left: b.left + 20, top: b.top + 16, width: b.width - 40, height: b.height - 32 })], { duration: 260, easing: "ease-in" });
      anim.onfinish = () => { z0.remove(); resolve(); };
    });
  }

  async function open(trigger, opts = {}) {
    if (!root) build();
    if (task && root.hidden && isOpen) { task.click(); return; }
    if (isOpen) return;
    isOpen = true;
    lastTrigger = trigger || document.activeElement;
    placeOverTaskbar();
    $$(".window").forEach((w) => { w.hidden = true; });
    await zoomFrom(trigger);
    root.hidden = false;
    root.scrollTop = 0;
    document.documentElement.style.overflow = "hidden";
    addTask();
    getBanner().then(paintWall);
    if (!location.hash.startsWith(HASH)) { history.pushState({ sg: 1 }, "", HASH); pushed = true; }
    const quick = Boolean(opts.then) || sessionStorage.getItem("sgw-seen") === "1";
    try { sessionStorage.setItem("sgw-seen", "1"); } catch {}
    if (!quick && !reduced) await boot();
    if (!isOpen) return;
    // the folder, my note from the cluster, then the paper on top
    showW($("#sgw-explorer"), false);
    layout();
    await sleep(quick ? 80 : 280);
    if (!isOpen) return;
    showW($("#sgw-diary"), false);
    await sleep(quick ? 80 : 420);
    if (!isOpen) return;
    openMath(false);
    if (!isOpen) return;
    if (opts.then) act(opts.then);
    else $("#sgw-explorer").focus({ preventScroll: true });
  }

  function close(fromHistory) {
    if (!isOpen) return;
    isOpen = false;
    if (skipBoot) skipBoot();
    dosRun++; hpcRun++;
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

  // /#splice-girl opens the desktop; /#splice-girl/toy (or hpc, dos, notebook,
  // figures, readme, math) opens straight into that window.
  const SUB = new Set(["toy", "hpc", "dos", "notebook", "figures", "readme", "math", "design", "team"]);
  function openFromHash() {
    const m = location.hash.match(/^#splice-girl\/([a-z]+)$/);
    if (m) history.replaceState(null, "", HASH);
    open(null, m && SUB.has(m[1]) ? { then: m[1] } : {});
  }
  window.addEventListener("popstate", () => {
    if (isOpen && !location.hash.startsWith(HASH)) close(true);
    else if (!isOpen && location.hash.startsWith(HASH)) openFromHash();
  });
  window.addEventListener("hashchange", () => { if (!isOpen && location.hash.startsWith(HASH)) openFromHash(); });

  // anything with data-splice-world (the research folder's splice_girl.exe)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-splice-world]");
    if (!t || document.body.classList.contains("plain-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    open(t);
  }, true);

  if (location.hash.startsWith(HASH)) openFromHash();
  window.spliceGirlFolder = { open, close, hodge, presets: PRESETS };
})();
