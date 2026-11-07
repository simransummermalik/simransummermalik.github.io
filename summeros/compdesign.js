// computational design: a SummerOS folder that opens its own desktop, with an
// impossible-architecture etching tiled as the wallpaper. Opening a project
// pops up its windows on that desktop, the same way the hackathon wins do:
// the README, the pictures in a clean grid, an MS-DOS Prompt that runs the
// project's check, and a MATH.md with live figures. Reuses the dreu folder
// styles (.dw ...).
// Opens from /#computational-design, or straight into a project from
// /#computational-design/<project-id>.
(() => {
  const IMG = "/index_me_images/web/compdesign/";
  const HASH = "#computational-design";
  const REPO = "https://github.com/simransummermalik/CERTIFICATE-OF-NONEXISTENCE";
  const JG = "https://github.com/simransummermalik/ComputationalEditorialism";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = window.matchMedia("(min-width: 900px)");
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  // ---------- the projects ----------
  const PROJECTS = [
    {
      id: "certificate-of-nonexistence",
      file: "certificate_of_nonexistence",
      title: "Certificate of Nonexistence",
      thumb: IMG + "coe-thumb.jpg",
      repo: REPO,
      dir: "coe/",
      run: "verify.py",
      figures: { src: "/summeros/coe-figures.js", api: "coeFigures" },
      sections: "13 sections",
      desc: "<b>Certificate of Nonexistence</b><br>2026 &middot; Python, Z3, Blender<br><br>A house where every room passes inspection, and a theorem prover proves the house cannot exist.",
      // [file in dir, window title, caption, width, height]
      pics: [
        ["house", "the_house_built_anyway.jpg", "The House, Built Anyway (ink, drawn from above)", 1800, 2400],
        ["stair-down", "looking_down.jpg", "looking down the stair hall from the first landing", 1800, 2400],
        ["stair-up", "looking_up.jpg", "looking up, they turn above you the same way", 2000, 1333],
        ["hall", "the_hall.jpg", "the hall, a quarter of an inch longer than the rooms beside it", 2000, 1333],
      ],
      prompt: "C:\\SUMMER\\COMPUT~1\\CERTIF~1>",
      command: "python3 verify.py",
      // the real output of verify.py on the house file
      output: `building     No. 1 Holonomy Lane
sha-256      21a49c12b72bc4eeca1a84054d9370f2dc2892ccea497a614e95113e833b472a
certificate  21a49c12b72bc4eeca1a84054d9370f2dc2892ccea497a614e95113e833b472a

loop through doorway F4:
    ST1 -> ST2  through F1    running total:  90 deg, (21'-9", 0'-0", 9'-8")
    ST2 -> ST3  through F2    running total: 180 deg, (21'-9", 21'-9", 19'-4")
    ST3 -> ST4  through F3    running total: 270 deg, (0'-0", 21'-9", 29'-0")
    ST4 -> ST1  through F4    running total:   0 deg, (0'-0", 0'-0", 38'-8")
   comes home CHANGED: no placement of these rooms exists

loop through doorway C5:
     G1 -> G2   through C1    running total: 270 deg, (30'-6", 7'-0", 0'-0")
     G2 -> G3   through C2    running total: 180 deg, (37'-6", -23'-6", 0'-0")
     G3 -> G4   through C3    running total:  90 deg, (7'-0", -30'-6", 0'-0")
     G4 -> G5   through C4    running total:   0 deg, (0'-0", 0'-0", 0'-0")
     G5 -> G1   through C5    running total: 270 deg, (30'-6", 7'-0", 0'-0")
   comes home CHANGED: no placement of these rooms exists

loop through doorway HALL:
    ENT -> LIV  through D03   running total:   0 deg, (-22'-6", 0'-0", 0'-0")
    LIV -> DIN  through D02   running total:   0 deg, (-39'-0", 0'-0", 0'-0")
    DIN -> LIB  through D01   running total:   0 deg, (-57'-6", 0'-0", 0'-0")
    LIB -> COR  through D05   running total:   0 deg, (-39'-0", 20'-6", 0'-0")
    COR -> ENT  through HALL  running total:   0 deg, (0'-0 1/4", 0'-0", 0'-0")
   comes home CHANGED: no placement of these rooms exists

3 loop(s) fail to close. The building cannot exist in Euclidean space.`,
      // the repo's README
      readme: `
        <p class="cd-kicker">computational design &middot; 2026 &middot; Python, Z3, Blender</p>
        <h3>Certificate of Nonexistence</h3>
        <p class="cd-sub">No. 1 Holonomy Lane</p>
        <hr>
        <p>The listing went up on a Thursday in November.</p>
        <p><i>Hilbert &amp; Co. Fine properties. Rooms without end.</i> No. 1 Holonomy Lane, Charlotte, North Carolina. Two bedrooms, one bath, four storeys, eighteen rooms. Price upon request.</p>
        <p>The photographs were very good. They showed a stair hall of board-formed concrete. From the parapet on the first landing you could look straight down the well and see the flights turning beneath you, landing after landing, smaller and smaller, until the light gave out. They showed a long hall in white oak with a slot of sky along its ceiling and a dark ceramic sphere on a table at the far end. And they showed a tape measure lying along the skirting with its case pressed against the wall, as though someone had just stepped away from it.</p>
        <p>The copy said the hall was generous by exactly one quarter of an inch. Nobody asked what that meant.</p>
        <hr>
        <p>The inspector came the following week and did what inspectors do.</p>
        <p>Every room in the house had been drawn on its own sheet, in its own frame. Each sheet showed where that room's walls were, where its doors were, and how high its ceiling ran. No room knew where any other room was. A room knew only its doors, and each door knew which door on the far side it met.</p>
        <p>So the inspector went room by room. Ceiling heights: fourteen of fourteen. Door widths and heights: seventeen of seventeen. Hallway widths, stair widths, headroom, risers, treads. Every doorway matched its partner. Ninety-two checks against the residential building code, and ninety-two passed.</p>
        <p>Then the inspector did the one thing the building code never asks for. Starting at the front door, the inspector laid the rooms down one at a time on a single sheet of paper. Each room was placed by the doorway that led into it, the way you would assemble a house if all you had were its rooms.</p>
        <p>All eighteen rooms went down. Then three doorways would not close. Each one, when the inspector came round to it from the other side, opened onto the wrong place.</p>
        <p><b>The stair.</b> The stair hall has four flights. Each one climbs a storey: sixteen risers of seven and a quarter inches, nine feet eight inches in all. Each arrives on a landing, turns, and climbs again. At the top of the fourth flight is a landing with a door, a lamp, and a numeral painted on the wall: <b>1</b>. It is the landing you started from. Every flight is correct. Carry your sense of height up all four, though, and bring it home, and it says you are thirty-eight feet eight inches above the place where you are standing.</p>
        <p><b>The cloister.</b> Five galleries enclose a court of raked gravel with a single stone at its centre. Each gallery turns right into the next. Walk once round and you have made five right turns, four hundred and fifty degrees, where any walk around a square court should turn three hundred and sixty. The fifth gallery stands in the place of the first, a quarter turn askew. The stone, if you could ask it, sees more horizon than there is.</p>
        <p><b>The hall.</b> The hall runs from the library to the entrance and measures thirty-eight feet six and a quarter inches. Beside it, the dining room, a wall and the living room together measure thirty-eight feet six. The tape was right both times.</p>
        <hr>
        <p>Mathematicians have a word for what goes wrong here: <i>holonomy</i>. You carry something around a closed loop, a direction or a height or a ruler, and see whether it comes home the same. On a flat floor it always does. In this house it fails three times. Every room is flat, but the house, taken together, is not. There is nowhere in ordinary space to put it.</p>
        <p>The inspector did not take this on faith. The question went to a theorem prover. Here are eighteen rooms and twenty-two doorways: give each room a position and a heading so that every door meets its partner exactly. In under a fifth of a second the prover answered with one word, <b>unsat</b>, and a proof one hundred and ninety-six lines long. It named the smallest contradiction it could find: the four flights of the stair.</p>
        <p>It also found the cure. Brick up one stair door, one cloister door and one hall door, and the house can exist. That works for sixty-four of the 1,540 ways of closing three doorways. Close only one or two, and it still cannot.</p>
        <hr>
        <p>Nobody bricked up a door. The house was built anyway.</p>
        <p>It can only be built one way: room by room, through every doorway, putting each room exactly where its door says it must go. Go once round the cloister and the whole house must stand again, turned a quarter turn about the stone. Go round again, and again: four houses at once, sharing one courtyard and one stone, their walls running straight through each other's rooms. Climb the stair and all four must stand again, thirty-eight feet eight inches higher. Then again. It does not stop.</p>
        <p><b>The House, Built Anyway</b> is that building, drawn in ink from above the way an architect draws a plan. The top storey is cut open at five feet so you can see into every room, its cut walls filled black. Every room is furnished, four times over: four dining tables, four grand pianos, twelve beds, each turned a quarter turn from the last, standing in one another's walls. Below, the tower falls away, storey after storey of the same four houses, until the lines grow too faint to draw. Every wall is where the proof says it has to be.</p>
        <p>At the centre is the court, the one place all four houses agree on. Its gravel is raked in rings around the stone and in squares out to the colonnade, the only patterns a quarter turn leaves unchanged. A man in an overcoat and a bowler hat stands beside the stone. His footprints cross the gravel from the colonnade. He is the only one there.</p>
        <p>The photographs are from inside. <b>Looking down</b> the stair hall from the first landing, the flights turn beneath you, landing after landing, smaller and smaller, until the light gives out. <b>Looking up</b>, they turn above you the same way. <b>The hall</b> runs east under its slot of sky, a quarter of an inch longer than the rooms beside it, which no photograph can show. The rooms were built to the same quarter-inch dimensions the inspector checked, and lit by simulated sunlight. Nothing was painted in to make the impossible look plausible.</p>
        <p class="cd-last">The property has passed every inspection except existence.</p>
        <hr>
        <h4>inspect it yourself</h4>
        <p>You don't have to trust the inspector. <code>verify.py</code> uses whole numbers and Python's standard library, nothing else. It rereads the house, carries a frame of reference through the doorways around each loop, and reports what comes home.</p>
        <p class="cd-links">
          <button type="button" class="btn" data-math>read the math &rarr;</button>
          <button type="button" class="btn" data-run>run verify.py</button>
          <a class="btn" href="${REPO}" target="_blank" rel="noreferrer">GitHub repo &rarr;</a>
          <a class="btn" href="${REPO}/blob/main/BUILD.md" target="_blank" rel="noreferrer">how it's built &rarr;</a>
        </p>`,
      // the math behind it, from the house file, the certificate and the code
      math: `
        <p class="cd-kicker">certificate_of_nonexistence &middot; the math</p>
        <h3>Why the house cannot exist</h3>
        <p class="cd-sub">and what it looks like when it's built anyway</p>
        <hr>
        <p>The README tells the story. This is the same story in numbers. Every number here comes from the house file and the certificate in the repo, and <code>verify.py</code> checks them with nothing but whole-number arithmetic. The figures are live: your browser works every one of them out from the house file, the same way <code>verify.py</code> does, and prints what it finds the way the MS-DOS Prompt does.</p>
        <p class="cd-links cd-figgo"><span>Jump to a figure:</span>
          <button type="button" class="btn" data-fig-go="plan">1 &middot; lay it out</button>
          <button type="button" class="btn" data-fig-go="stair">2 &middot; climb the stair</button>
          <button type="button" class="btn" data-fig-go="cloister">3 &middot; walk the cloister</button>
          <button type="button" class="btn" data-fig-go="hall">4 &middot; the quarter inch, 1000&times;</button>
          <button type="button" class="btn" data-fig-go="brick">5 &middot; brick it up</button>
          <button type="button" class="btn" data-fig-go="anyway">6 &middot; built anyway</button>
        </p>

        <h4>1 &middot; every room is its own sheet of paper</h4>
        <p>Each room is described in its own coordinates: the origin at its south-west corner, <var>x</var> east, <var>y</var> north, <var>z</var> up. Every length is a whole number of quarter inches. One unit is &frac14;&Prime;, so a storey of 9&prime;-8&Prime; is 464 units and the side of the stair hall, 21&prime;-9&Prime;, is 1044. Nothing is ever rounded, so when a loop fails, it fails by an exact amount.</p>

        <h4>2 &middot; moves</h4>
        <p>A room can only be turned by whole quarter turns about the vertical, and only moved by whole quarter inches. Write a move as</p>
        <p class="cd-eq">(<var>r</var> ; <var>x</var>, <var>y</var>, <var>z</var>)</p>
        <p>meaning: turn <var>r</var> quarter turns counter-clockwise, then shift by (<var>x</var>, <var>y</var>, <var>z</var>). One move followed by another is again a move:</p>
        <p class="cd-eq">(<var>r</var> ; <b>t</b>) &middot; (<var>r</var>&prime; ; <b>t</b>&prime;) = (<var>r</var> + <var>r</var>&prime; mod 4 ; <var>R</var><sup><var>r</var></sup><b>t</b>&prime; + <b>t</b>)</p>
        <p>where <var>R</var> = <span class="cd-mat"><i>0</i><i>&minus;1</i><i>1</i><i>0</i></span> turns the plan part a quarter turn, and heights simply add. Order matters: turning and then walking ten feet is not walking ten feet and then turning. These moves form a group, the symmetries of a quarter-inch grid that never tip the floor or mirror a room: (&#8484;&sup2; &#8906; &#8484;/4) &times; &#8484;.</p>

        <h4>3 &middot; a doorway is a move</h4>
        <p>Each door knows only where it is on its own room's wall: which wall (east, north, west or south, that is 0, 1, 2 or 3 quarter turns), how far along, and how high. Call that the door's frame, <var>D</var>. To get from room <var>a</var> to room <var>b</var>: go to the door in <var>a</var>, step through the wall, turn round, and undo the frame of the door you came out of in <var>b</var>:</p>
        <p class="cd-eq"><var>T</var>(<var>a</var>&rarr;<var>b</var>) = <var>D<sub>a</sub></var> &middot; (0 ; <var>w</var>, 0, 0) &middot; (2 ; 0, 0, 0) &middot; <var>D<sub>b</sub></var><sup>&minus;1</sup></p>
        <p>Here <var>w</var> is the wall's thickness: 6&Prime; between rooms, nothing between one flight of the stair and the next. <var>T</var>(<var>a</var>&rarr;<var>b</var>) says where room <var>b</var> sits, seen from room <var>a</var>. Walking back the other way is the inverse move. This is the whole of <code>crossing()</code> in <code>verify.py</code>.</p>

        <h4>4 &middot; laying the rooms down</h4>
        <p>To build the house is to give every room a move <var>P</var>(room): where it sits in one shared space. The rooms only fit if every doorway agrees:</p>
        <p class="cd-eq"><var>P</var>(<var>b</var>) = <var>P</var>(<var>a</var>) &middot; <var>T</var>(<var>a</var>&rarr;<var>b</var>) &nbsp; for all 22 doorways</p>
        <p>The inspector puts the entrance hall at the origin and works outward through doorways, breadth first. Seventeen doorways are enough to reach all eighteen rooms. They form a tree, and a tree on 18 rooms always has 17 doorways. That settles where every room goes.</p>
        <p>The other 22 &minus; 17 = 5 doorways were never needed, so each one is a check: both its rooms are already placed, and it closes exactly one loop. Do they line up? Five is the number of independent loops in the house (doorways &minus; rooms + 1, the first Betti number of the graph of rooms and doorways). Two checks pass: C1, between galleries I and II, and D12, between the bedrooms. Three fail: F4, C5 and HALL.</p>
        <figure class="cd-fig" data-fig="plan"><figcaption><b>Fig. 1</b> The architect's drawing, done the inspector's way: start at the front door, place each room through the first doorway that reaches it, then try the five doorways left over.</figcaption></figure>

        <h4>5 &middot; holonomy</h4>
        <p>Walk a loop that starts and ends in the same room, and multiply the moves as you go:</p>
        <p class="cd-eq"><var>H</var> = <var>T</var><sub>1</sub> &middot; <var>T</var><sub>2</sub> &middot; &hellip; &middot; <var>T<sub>k</sub></var></p>
        <p>If the house could be built, each step would be <var>T<sub>i</sub></var> = <var>P</var>(room<sub><var>i</var>&minus;1</sub>)<sup>&minus;1</sup> &middot; <var>P</var>(room<sub><var>i</var></sub>), and the product would collapse:</p>
        <p class="cd-eq"><var>H</var> = <var>P</var>(start)<sup>&minus;1</sup> &middot; <var>P</var>(start) = identity</p>
        <p>So one loop whose product is not the identity proves that no placement exists. Not on a quarter-inch grid, and not anywhere else either: the argument never used the grid, so it rules out every position and every angle in ordinary space. That product is the loop's <i>holonomy</i>. Each room on its own is flat and passes, so no inspection of single rooms can find the problem. It only shows up around a loop.</p>

        <h4>6 &middot; the stair</h4>
        <p>Every flight is the same move: a quarter turn left, 21&prime;-9&Prime; across and 9&prime;-8&Prime; up.</p>
        <p class="cd-eq"><var>F</var> = (1 ; 1044, 0, 464)</p>
        <figure class="cd-fig" data-fig="stair"><figcaption><b>Fig. 2</b> The four flights, drawn from the house file. Climb them: every flight is right, and you arrive back on landing 1 carrying 38&prime;-8&Prime; of height that has nowhere to go.</figcaption></figure>
        <p class="cd-eq"><var>F</var><sup>4</sup> = (0 ; 0, 0, 1856) = rise 38&prime;-8&Prime;</p>
        <p>The turns add up to a full turn, and the plan goes once round a square and closes. The height has nowhere to go: 4 &times; 9&prime;-8&Prime; = 38&prime;-8&Prime;.</p>

        <h4>7 &middot; the cloister</h4>
        <p>Every gallery is the same move too: a right turn (three left quarter turns) and a step of 30&prime;-6&Prime; by 7&prime;-0&Prime;.</p>
        <p class="cd-eq"><var>G</var> = (3 ; 1464, 336, 0)</p>
        <figure class="cd-fig" data-fig="cloister"><figcaption><b>Fig. 3</b> Walk the five galleries round the court. The gauge round the stone counts how far you have turned.</figcaption></figure>
        <p>Four galleries close perfectly: <var>G</var><sup>4</sup> = identity, and gallery V lands exactly on top of gallery I. But there are five, so</p>
        <p class="cd-eq"><var>G</var><sup>5</sup> = <var>G</var><sup>4</sup> &middot; <var>G</var> = <var>G</var></p>
        <p>and the frame comes home a quarter turn askew. In the shared plan this is a rotation by 90&deg; about a single point, found by solving (<var>I</var> &minus; <var>R</var>)<b>p</b> = <b>t</b>. That point is the stone.</p>
        <p>On a flat floor, walking once round any point turns you through 360&deg;. Round the stone you turn through 450&deg;. The difference, 360&deg; &minus; 450&deg; = &minus;90&deg;, is curvature, and all of it sits at the stone. A paper cone has less than 360&deg; round its tip (positive curvature); the stone has more (negative curvature), like a saddle pinched to a point. That is why the stone sees more horizon than there is.</p>

        <h4>8 &middot; the hall</h4>
        <p>No turns on this loop at all, only shifts:</p>
        <figure class="cd-fig" data-fig="hall"><figcaption><b>Fig. 4</b> The hall loop. At this scale a quarter inch is thinner than a line, so the magnifier goes to 1000&times;.</figcaption></figure>
        <p class="cd-eq"><var>H</var> = (0 ; 1, 0, 0) = &frac14;&Prime; east</p>
        <p>Every step is right. The hall's east doorway simply sits &frac14;&Prime; further along than the rooms beside it add up to, so you come home a quarter inch from where you left. It is the smallest failure the house could have: one unit.</p>

        <h4>9 &middot; three kinds of defect</h4>
        <p>The same three failures turn up in crystals, where every atom only knows its neighbours, and they have names. Walk a loop through the crystal counting atoms, and see whether you come home. The shift you come home with is called the Burgers vector.</p>
        <ul>
          <li><b>The stair is a screw dislocation.</b> You come home shifted along the axis you walked round: 38&prime;-8&Prime; straight up, like the thread of a screw.</li>
          <li><b>The hall is an edge dislocation.</b> You come home shifted sideways, across the loop: &frac14;&Prime; east.</li>
          <li><b>The cloister is a disclination.</b> You come home turned: 90&deg;.</li>
        </ul>
        <p>Vito Volterra sorted these out in 1907. In every case each piece is perfect, and the defect lives only in how the pieces are joined.</p>

        <h4>10 &middot; asking a prover</h4>
        <p><code>verify.py</code> walks loops. Z3 is asked the question head on. Each room gets four unknown whole numbers, its turn (0 to 3) and its position <var>x</var>, <var>y</var>, <var>z</var>: 72 unknowns. Each doorway becomes four equations, one for each unknown of the room on the far side. Doorway F2, from flight II to flight III:</p>
        <pre class="cd-code">ST3.turn = (ST2.turn + 1) mod 4
ST3.x    = ST2.x + [1044, 0, -1044, 0][ST2.turn]
ST3.y    = ST2.y + [0, 1044, 0, -1044][ST2.turn]
ST3.z    = ST2.z + 464</pre>
        <p>Z3 answered <b>unsat</b> in 0.18 seconds: no choice of 72 whole numbers satisfies all 22 doorways at once. Asked for the smallest set of doorways it needed (the unsat core), it named four: F1, F2, F3, F4. Their heights alone are already impossible:</p>
        <pre class="cd-code">z2 = z1 + 464
z3 = z2 + 464
z4 = z3 + 464
z1 = z4 + 464
-------------- add all four
 0 = 1856</pre>
        <p>Z3 also wrote out the proof itself, 196 lines of it, and it is in the repo.</p>
        <p>Each failing loop is fatal on its own: put back any one of F4, C5 or HALL and the answer is still unsat. Brick up all three and Z3 hands back coordinates for every room.</p>

        <h4>11 &middot; the cure</h4>
        <p>Bricking up a doorway deletes its equation. The prover tried every single doorway (22 ways), every pair (231) and every triple (1,540): 1,793 questions, in under three minutes.</p>
        <p>No single doorway works and no pair works. The three bad loops share no doorways, so one brick breaks at most one of them. Of the triples, 64 work, and 64 = 4 &times; 4 &times; 4:</p>
        <ul>
          <li>one of the stair doors F1, F2, F3, F4,</li>
          <li>one of the cloister doors C2, C3, C4, C5,</li>
          <li>and one of D01, D02, D03, HALL.</li>
        </ul>
        <p>C1 and D05 are on bad loops too, but neither one ever works, because they are each other's detour. Gallery I &rarr; C1 &rarr; gallery II &rarr; D09 &rarr; library &rarr; D05 &rarr; the hall &rarr; D07 &rarr; gallery I is one of the two loops that close, so going round it changes nothing. Brick up C1 and the cloister loop goes the long way, through the library and the hall, and still comes home turned. Brick up D05 and the hall loop goes round through the galleries instead, and still comes home &frac14;&Prime; out.</p>
        <p>Try it. Click a doorway to brick it up, and the inspector lays the house out again.</p>
        <figure class="cd-fig" data-fig="brick"><figcaption><b>Fig. 5</b> Every doorway in the house. Bricked-up doorways turn pink. Find three that let the house exist, or ask for one.</figcaption></figure>

        <h4>12 &middot; building it anyway</h4>
        <p>Refuse to brick anything up, and lay the rooms down along every route instead of one tree. Now where a room goes depends on how you got there. Every route to a room is one route plus some loops, so each room stands once for every move the loops can make together: the group their holonomies generate. Seen from the shared plan it has three generators:</p>
        <ul>
          <li><var>q</var>: turn 90&deg; about the stone. Four of them do nothing: <var>q</var><sup>4</sup> = 1.</li>
          <li><var>s</var>: rise 38&prime;-8&Prime;. No number of them ever does nothing.</li>
          <li><var>h</var>: shift &frac14;&Prime;.</li>
        </ul>
        <p>Turning about a vertical line doesn't change heights, so <var>q</var> and <var>s</var> commute: <var>qs</var> = <var>sq</var>. Together they give one copy of the house for each quarter turn <var>k</var> = 0, 1, 2, 3 and each level <var>n</var>, any whole number: four houses on every level, sharing the stone, and a level every 38&prime;-8&Prime;, up and down without end. That is <i>The House, Built Anyway</i>. The court is the one place all four copies agree, because a quarter turn about the stone carries it onto itself.</p>
        <figure class="cd-fig" data-fig="anyway"><figcaption><b>Fig. 6</b> One level of the house built anyway: the plan, and the copies the cloister makes of it, turned about the stone.</figcaption></figure>
        <p>The hall's <var>h</var> is in the group too. In the words of the script that makes the drawing: &ldquo;the hall's quarter inch is real too, but at any drawable scale it vanishes into the thickness of a line.&rdquo;</p>

        <h4>13 &middot; checking it</h4>
        <p><code>verify.py</code> uses only Python's standard library and whole numbers. Before it walks anything, it takes the sha-256 of the house file and compares it with the one on the certificate, so the certificate belongs to exactly this house: move one door by a quarter inch and the hashes stop matching. Then it multiplies the moves around the three loops, as in sections 6, 7 and 8, and prints the running totals you can watch in the MS-DOS Prompt.</p>
        <p class="cd-links">
          <button type="button" class="btn" data-run>run verify.py</button>
          <a class="btn" href="${REPO}/blob/main/verify.py" target="_blank" rel="noreferrer">verify.py &rarr;</a>
          <a class="btn" href="${REPO}/blob/main/out/proof/z3_proof.txt" target="_blank" rel="noreferrer">the Z3 proof &rarr;</a>
          <a class="btn" href="${REPO}/blob/main/out/proof/certificate.json" target="_blank" rel="noreferrer">the certificate &rarr;</a>
        </p>`,
    },
    {
      id: "judgment-geometry",
      file: "computational_editorialism",
      title: "Judgment Geometry",
      thumb: IMG + "jg-thumb.jpg",
      repo: JG,
      dir: "jg/",
      run: "make curvature-demo",
      figures: { src: "/summeros/jg-figures.js", api: "jgFigures" },
      sections: "12 sections",
      desc: "<b>Judgment Geometry</b><br>2026 &middot; Python, JavaScript<br><br>What if taste is not a score, but a shape? A study of what one-number rankings leave out.",
      // the dress: The Met 159425 (CC0). The style square: four covers drawn by
      // the project's own renderer, with The Met 157913 (CC0) in the image slot,
      // one move of margin and one of whitespace apart (delta 0.24)
      pics: [
        ["dress", "dress.jpg", "Stripes have rhythm, bows have direction, a bustle has flare. Dress, ca. 1885, The Met", 1006, 1500],
        ["style_square", "style_square.jpg", "One style square: the same cover with margin and whitespace moved, four versions", 1040, 1440],
      ],
      prompt: "C:\\SUMMER\\COMPUT~1\\COMPUT~1>",
      command: "make curvature-demo",
      hi: /all_passed|max_abs_circulation/,
      // what make prints (DOS wraps at 80 columns); the report path is this folder's
      output: `python3 scripts/run_curvature_demo.py --seed 20260731 --output results/curvature_
demo.json
{
  "checks": {
    "all_passed": true,
    "integrable_exact_potential_fit": true,
    "integrable_zero_circulation": true,
    "interaction_coexists_with_zero_circulation": true,
    "nonintegrable_circulation_detected": true,
    "nonintegrable_has_residual_energy": true
  },
  "integrable_max_abs_circulation": 0.0,
  "nonintegrable_max_abs_circulation": 0.5,
  "report": "C:\\\\SUMMER\\\\COMPUT~1\\\\COMPUT~1\\\\results\\\\curvature_demo.json"
}`,
      // the repo's README
      readme: `
        <p class="cd-kicker">computational design &middot; 2026 &middot; Python, JavaScript</p>
        <h3>Judgment Geometry</h3>
        <p class="cd-sub">What if taste is not a score, but a shape?</p>
        <hr>
        <p>Look at the dress. Your eye does not see one number. It sees the beat of the stripes, the reach of the bow, the widening of the train, and the way all three work together. That sets up the project's central question:</p>
        <p><b>What if visual judgments do not fit one score? Their directions and strengths may contain a pattern that a ranking leaves out.</b></p>
        <p>Many visual-ranking systems do something useful and simple: they place designs on a leaderboard from best to worst. Judgment Geometry asks what that leaderboard cannot show.</p>
        <p><b>A leaderboard keeps the order. A map keeps the direction and strength of the comparisons. This project builds the map.</b></p>
        <p>The current prototype tests editorial layouts. The dress shows how the same method could extend to fashion.</p>
        <hr>
        <h4>how the experiment works</h4>
        <ol class="jg-steps">
          <li><b>Hold the content still.</b> Keep the same subject, words, image, and context.</li>
          <li><b>Make two isolated style changes.</b> Change one visual decision at a time, for example margin and whitespace.</li>
          <li><b>Create four related versions.</b> Show neither change, each change alone, and both changes together.</li>
          <li><b>Ask simple side-by-side questions.</b> In the planned human study, people make repeated, randomized choices between two versions for one criterion.</li>
          <li><b>Close the loop.</b> Estimate the comparison strengths and test whether they balance around the four versions.</li>
        </ol>
        <p>If the loop balances within uncertainty, one score may be enough for those four designs. If a repeatable imbalance remains beyond uncertainty, one score cannot fully represent those comparisons.</p>
        <p>That measured leftover is the heart of the project. Mathematicians call it <b>circulation</b>. Here, it is a test of what a ranking erases.</p>
        <hr>
        <p><b>Act I &middot; The score makes a promise.</b> Imagine one editorial cover. The photograph stays. The headline stays. The words stay. Only the formal decisions move: more margin, less density, wider whitespace, stronger hierarchy. A conventional aesthetic model looks at the resulting covers and gives each one a number. The numbers look neutral. They are not. They make a powerful promise: every local comparison among those covers can be explained by the same hidden order.</p>
        <p><b>Act II &middot; The loop tests the promise.</b> One person sees the edges at different moments in the study. The interface never announces a loop. It simply asks the same precise question each time. Only later does the analysis restore the orientation and discover whether the four answers close.</p>
        <p><b>Act III &middot; A geometry appears.</b> If every measured loop closes, the hidden score survives. If a loop refuses to close beyond its uncertainty, the failure has a location: this evaluator, this question, this content anchor, and this pair of style directions. Instead of calling the person inconsistent, the experiment asks which mathematical representation failed.</p>
        <p><b>Act IV &middot; The machine faces the same test.</b> Predicting the preferred cover is no longer enough. The model must preserve the same local failures of scoreability that appear in human judgment. A smooth ranking can be accurate edge by edge while deleting the structure connecting those edges: <b>right answers, wrong geometry.</b></p>
        <hr>
        <p>The project does not need to announce that taste is objective, irrational, universal, or impossible to model. It can end in three scientifically useful places:</p>
        <ul>
          <li><b>The score survives.</b> Scalar ranking is adequate in the tested neighborhood.</li>
          <li><b>The score breaks locally.</b> Scalar representability fails for named style-direction pairs.</li>
          <li><b>The model gets the geometry wrong.</b> Prediction hid a representational mismatch.</li>
        </ul>
        <p class="cd-last">The breakthrough is not the word &ldquo;curvature.&rdquo; It is an experiment capable of distinguishing these endings.</p>
        <hr>
        <h4>research status</h4>
        <p>The renderer, browser-study prototype, response pipeline, loop mathematics, and synthetic demonstrations are implemented. Human recruitment still requires ethics review, perceptibility testing, power analysis, and a study plan containing every comparison needed to close each loop. <b>No human finding is claimed.</b></p>
        <p class="jg-credit">Pictures: <a href="https://www.metmuseum.org/art/collection/search/159425" target="_blank" rel="noreferrer">Dress, American, ca. 1885</a> and <a href="https://www.metmuseum.org/art/collection/search/157913" target="_blank" rel="noreferrer">Evening dress, House of Worth, ca. 1880</a>, The Metropolitan Museum of Art, Brooklyn Museum Costume Collection, open access (CC0). The covers are drawn by the project's renderer with the Worth gown in the image slot.</p>
        <h4>run the mathematical proof in 30 seconds</h4>
        <p><code>make curvature-demo</code> compares two fields on the same controlled square. The first comes from a nonlinear score with a strong interaction, and its loop still closes. The second nudges one edge by 0.5, and no score for the four covers can reproduce it.</p>
        <p class="cd-links">
          <button type="button" class="btn" data-math>read the math &rarr;</button>
          <button type="button" class="btn" data-run>run make curvature-demo</button>
          <a class="btn" href="${JG}" target="_blank" rel="noreferrer">GitHub repo &rarr;</a>
          <a class="btn" href="${JG}/blob/main/docs/mathematical-framework.md" target="_blank" rel="noreferrer">the full framework &rarr;</a>
        </p>`,
      // the math, from the README, docs/mathematical-framework.md and the code
      math: `
        <p class="cd-kicker">computational_editorialism &middot; the math</p>
        <h3>Is taste a score, or a shape?</h3>
        <p class="cd-sub">one square of covers, four answers, and whether they close</p>
        <hr>
        <p>The README tells the story. This is the same story in numbers. The covers here are drawn live by the project's own renderer, with a House of Worth gown from The Met in the image slot, and the loop arithmetic is the same as <code>complex.py</code>. Each figure prints what it finds the way the MS-DOS Prompt does. No human finding is claimed: every number below is the demo's, a toy's, or yours.</p>
        <p class="cd-links cd-figgo"><span>Jump to a figure:</span>
          <button type="button" class="btn" data-fig-go="square">1 &middot; four covers</button>
          <button type="button" class="btn" data-fig-go="judge">2 &middot; judge them yourself</button>
          <button type="button" class="btn" data-fig-go="curl">3 &middot; the stair</button>
          <button type="button" class="btn" data-fig-go="pool">4 &middot; three people, one loop</button>
          <button type="button" class="btn" data-fig-go="matrix">5 &middot; the matrix</button>
        </p>

        <h4>1 &middot; hold the idea still, move the style</h4>
        <p>A cover is rendered from three things: the content <var>b</var> (words, image, template), the style coordinates <b>&theta;</b>, and the presentation context <var>c</var>.</p>
        <p class="cd-eq"><var>x</var> = <var>R</var>(<var>b</var>, <b>&theta;</b>, <var>c</var>), &nbsp;&nbsp; <b>&theta;</b> = (&theta;<sub>margin</sub>, &theta;<sub>alignment</sub>, &theta;<sub>type</sub>, &theta;<sub>whitespace</sub>, &theta;<sub>density</sub>, &theta;<sub>hierarchy</sub>, &theta;<sub>image/text</sub>, &theta;<sub>contrast</sub>) &isin; [0, 1]<sup>8</sup></p>
        <p>Every coordinate runs from 0 to 1, and the renderer turns it into something you can see. These are the real lines from <code>render_contract.js</code>, in hundredths of the cover's width (cqw):</p>
        <pre class="cd-code">padding          3.8 + 7.2 &theta;_margin                  cqw
block gap        1.1 + 4.4 &theta;_whitespace              cqw
deck line height 1.08 + 0.52 &theta;_whitespace
headline size    5.4 + 7.4 &theta;_type + 1.8 &theta;_hierarchy  cqw
headline weight  350 + 350 &theta;_hierarchy
image share      31 + 49 &theta;_image/text                %
image scale      1 + 0.08 &theta;_density
ink              mix(ink, paper, 0.48 (1 - &theta;_contrast))</pre>
        <p>The point is not to generate another image. The point is to create a measured neighborhood around the same artifact.</p>

        <h4>2 &middot; two moves make a square</h4>
        <p>Pick two style directions <var>i</var> and <var>j</var> and a step &delta;. Each move takes one coordinate from just below the anchor to just above it, by the same amount on both sides:</p>
        <p class="cd-eq">&theta;<sub><var>i</var></sub> &rarr; &theta;<sub><var>i</var></sub> &plusmn; &delta;&prime;, &nbsp;&nbsp; &delta;&prime; = min(&delta;, &theta;<sub><var>i</var></sub>, 1 &minus; &theta;<sub><var>i</var></sub>)</p>
        <p>Near the edge of [0, 1] the step shrinks on both sides instead of being clipped on one, so the move stays symmetric. Apply each move alone and together:</p>
        <p class="cd-eq"><var>x</var>, &nbsp; <var>T</var><sub><var>i</var></sub><var>x</var>, &nbsp; <var>T</var><sub><var>j</var></sub><var>x</var>, &nbsp; <var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var> = <var>T</var><sub><var>j</var></sub><var>T</var><sub><var>i</var></sub><var>x</var></p>
        <p>The two edit orders reach the same renderer state. That equality creates a real square in the experimental object: four vertices, four edges, one face. Not a metaphor, not a mood board, and not four unrelated images. Try other pairs: the covers redraw, and the readout prints what each move changed on the page.</p>
        <figure class="cd-fig" data-fig="square"><figcaption><b>Fig. 1</b> The first layout the generator makes with the project's seed, 20260731, in the &ldquo;editorial&rdquo; context. Pick the two moves and the step. Photograph: evening dress, House of Worth, ca. 1880, The Met (CC0).</figcaption></figure>

        <h4>3 &middot; judgment lives on the edges</h4>
        <p>For one person <var>e</var>, one question <var>q</var> (beautiful, luxurious, timeless) and one context <var>c</var>, put a number on each edge <var>v</var> &rarr; <var>w</var>: how strongly the head beats the tail, on the log-odds scale.</p>
        <p class="cd-eq">&omega;(<var>v</var>, <var>w</var>) = logit <var>P</var>(<var>w</var> &#8827; <var>v</var>) = log <var>P</var> &frasl; (1 &minus; <var>P</var>), &nbsp;&nbsp; &omega;(<var>w</var>, <var>v</var>) = &minus;&omega;(<var>v</var>, <var>w</var>)</p>
        <p>Mathematicians call this a 1-form: a number on every oriented edge that flips sign when you walk the edge backwards. A style edit is not labeled &ldquo;good&rdquo; or &ldquo;bad.&rdquo; It receives a direction and a strength for a specific person answering a specific question.</p>
        <p>One click is not a probability. So the study asks each edge more than once with the sides swapped, and never lets 2 out of 2 become infinitely sure. Fig. 2 adds half a choice to each side:</p>
        <p class="cd-eq"><var>P&#770;</var> = (<var>k</var> + &frac12;) &frasl; (<var>n</var> + 1): &nbsp; 0 of 2 &rarr; 0.167, &nbsp; 1 of 2 &rarr; 0.5, &nbsp; 2 of 2 &rarr; 0.833; &nbsp; &omega; = &minus;1.609, 0, +1.609</p>

        <h4>4 &middot; walk around the loop</h4>
        <p>Orient the face <var>x</var> &rarr; <var>T</var><sub><var>i</var></sub><var>x</var> &rarr; <var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var> &rarr; <var>T</var><sub><var>j</var></sub><var>x</var> &rarr; <var>x</var> and add up the four edges with the boundary's signs:</p>
        <p class="cd-eq"><var>F</var> = &omega;(<var>x</var>, <var>T</var><sub><var>i</var></sub><var>x</var>) + &omega;(<var>T</var><sub><var>i</var></sub><var>x</var>, <var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>) &minus; &omega;(<var>T</var><sub><var>j</var></sub><var>x</var>, <var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>) &minus; &omega;(<var>x</var>, <var>T</var><sub><var>j</var></sub><var>x</var>) = <var>d</var>&omega;</p>
        <p>If one score <var>U</var> explains every edge, &omega;(<var>v</var>, <var>w</var>) = <var>U</var>(<var>w</var>) &minus; <var>U</var>(<var>v</var>), and the loop telescopes:</p>
        <p class="cd-eq">[<var>U</var>(<var>T</var><sub><var>i</var></sub><var>x</var>) &minus; <var>U</var>(<var>x</var>)] + [<var>U</var>(<var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>) &minus; <var>U</var>(<var>T</var><sub><var>i</var></sub><var>x</var>)] &minus; [<var>U</var>(<var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>) &minus; <var>U</var>(<var>T</var><sub><var>j</var></sub><var>x</var>)] &minus; [<var>U</var>(<var>T</var><sub><var>j</var></sub><var>x</var>) &minus; <var>U</var>(<var>x</var>)] = 0</p>
        <p>So <var>F</var> tells you whether a score is possible. <var>F</var> &asymp; 0 within uncertainty: one score can explain this style neighborhood. <var>F</var> &ne; 0 reliably: no score for these four covers gives all four edges, and the ranking throws away a structured loop.</p>
        <p>The study never shows anyone a loop. It asks the same question about one pair at a time, and the analysis restores the orientation afterwards. Fig. 2 does exactly that, with you, on the square from Fig. 1.</p>
        <figure class="cd-fig" data-fig="judge"><figcaption><b>Fig. 2</b> Eight choices: each edge twice, sides swapped. Then your four answers become a stair round the square, one flight per edge, and get walked. If the last flight lands level, one score explains you.</figcaption></figure>

        <h4>5 &middot; interaction is not circulation</h4>
        <p>A score can be nonlinear and full of interaction:</p>
        <p class="cd-eq"><var>U</var>(&theta;<sub><var>i</var></sub>, &theta;<sub><var>j</var></sub>) = &alpha;&theta;<sub><var>i</var></sub> + &beta;&theta;<sub><var>j</var></sub> + &gamma;&theta;<sub><var>i</var></sub>&theta;<sub><var>j</var></sub> + &eta;&theta;<sub><var>i</var></sub><sup>2</sup>&theta;<sub><var>j</var></sub></p>
        <p>Its mixed difference, what you get from doing both moves beyond doing each, can be large. And the loop still closes, because it is a score:</p>
        <p class="cd-eq">&Delta;<sub><var>i</var></sub>&Delta;<sub><var>j</var></sub><var>U</var> = <var>U</var>(<var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>) &minus; <var>U</var>(<var>T</var><sub><var>i</var></sub><var>x</var>) &minus; <var>U</var>(<var>T</var><sub><var>j</var></sub><var>x</var>) + <var>U</var>(<var>x</var>) &ne; 0, &nbsp;&nbsp; while &nbsp; <var>d</var>(<var>dU</var>) = 0</p>
        <p>So ordinary factorial interaction is not circulation. Judgment Geometry tests scalar representability itself, not whether two design variables merely interact.</p>
        <p><code>make curvature-demo</code> builds exactly this on margin &times; contrast of the first generated layout, with <var>U</var> = 1.25<var>x</var> &minus; 0.75<var>y</var> + 2.40<var>xy</var> + 0.80<var>x</var><sup>2</sup><var>y</var>. <b>Case A:</b> mixed difference 0.1857818071, circulation 0, residual 0. <b>Case B</b>, the same field with one edge nudged by 0.5: circulation 0.5, residual energy 0.0625, residual fraction 0.0533483986.</p>
        <p>Fig. 3 draws it as a stair round the square: one flight per edge, each climbing by what was measured. Turn the interaction all the way up and the stair still comes home level. Nudge one edge and the last flight arrives exactly that much off, like the stair in Certificate of Nonexistence that comes home 38&prime;-8&Prime; up.</p>
        <figure class="cd-fig" data-fig="curl"><figcaption><b>Fig. 3</b> The curvature demo, live. At Case A and Case B the readout matches the repo's reference run to ten places.</figcaption></figure>

        <h4>6 &middot; the boundary of a boundary</h4>
        <p>Write the square as matrices. <var>B</var><sub>1</sub> says which vertex each edge leaves (&minus;1) and enters (+1). <var>B</var><sub>2</sub> says which edges go round the face, and which way. Rows are <var>x</var>, <var>T</var><sub><var>i</var></sub><var>x</var>, <var>T</var><sub><var>j</var></sub><var>x</var>, <var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>; columns are the edges <var>x</var>&rarr;<var>T</var><sub><var>i</var></sub><var>x</var>, <var>T</var><sub><var>i</var></sub><var>x</var>&rarr;<var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>, <var>T</var><sub><var>j</var></sub><var>x</var>&rarr;<var>T</var><sub><var>i</var></sub><var>T</var><sub><var>j</var></sub><var>x</var>, <var>x</var>&rarr;<var>T</var><sub><var>j</var></sub><var>x</var>.</p>
        <p class="cd-eq"><var>B</var><sub>1</sub> = <span class="cd-mat jg-mat4"><i>&minus;1</i><i>0</i><i>0</i><i>&minus;1</i><i>1</i><i>&minus;1</i><i>0</i><i>0</i><i>0</i><i>0</i><i>&minus;1</i><i>1</i><i>0</i><i>1</i><i>1</i><i>0</i></span> &nbsp;&nbsp; <var>B</var><sub>2</sub> = <span class="cd-mat jg-mat1"><i>1</i><i>1</i><i>&minus;1</i><i>&minus;1</i></span> &nbsp;&nbsp; <var>B</var><sub>1</sub><var>B</var><sub>2</sub> = 0</p>
        <p>The boundary of a boundary is empty. A score's edges are <var>d</var><sub>0</sub><var>U</var> = <var>B</var><sub>1</sub><sup>&#8868;</sup><var>U</var> and a loop is <var>d</var><sub>1</sub>&omega; = <var>B</var><sub>2</sub><sup>&#8868;</sup>&omega;, so <var>d</var><sub>1</sub><var>d</var><sub>0</sub><var>U</var> = <var>B</var><sub>2</sub><sup>&#8868;</sup><var>B</var><sub>1</sub><sup>&#8868;</sup><var>U</var> = (<var>B</var><sub>1</sub><var>B</var><sub>2</sub>)<sup>&#8868;</sup><var>U</var> = 0. That one line is why a score always closes.</p>

        <h4>7 &middot; the best single score</h4>
        <p>Real answers are noisy and never close exactly. Fit the score that comes closest, edge by edge, and keep what is left over:</p>
        <p class="cd-eq"><var>U</var>* = argmin<sub><var>U</var></sub> &Sigma;<sub><var>a</var></sub> <var>w</var><sub><var>a</var></sub> [&omega;&#770;<sub><var>a</var></sub> &minus; (<var>B</var><sub>1</sub><sup>&#8868;</sup><var>U</var>)<sub><var>a</var></sub>]<sup>2</sup>, &nbsp;&nbsp; &omega;&#770; = <var>B</var><sub>1</sub><sup>&#8868;</sup><var>U</var>* + <var>r</var></p>
        <p>The first part is what a score can say; <var>r</var> is what it can't. On a single square with equal weights the leftover is the same size on every edge, <var>r</var> = (<var>F</var>/4)&thinsp;<var>B</var><sub>2</sub>, so its energy is <var>F</var><sup>2</sup>/4. In Case B, <var>F</var> = 0.5, so <var>r</var> = &plusmn;0.125 on each edge and the energy is 0.0625 out of 1.1715:</p>
        <p class="cd-eq">&rho;<sub>potential</sub> = 1 &minus; &Vert;<var>r</var>&Vert;<sup>2</sup> &frasl; &Vert;&omega;&#770;&Vert;<sup>2</sup> = 1 &minus; 0.0625 &frasl; 1.1715 = 0.9467</p>
        <p>The best score's edges, 0.755, 0.139, 0.691 and 0.203, all point the same way as the measured 0.880, 0.264, 0.566 and 0.078. It gets every winner right, and it still has no loop. That is the failure the benchmark looks for in a model: <b>high choice accuracy + low 2-form alignment = right answers, wrong geometry.</b></p>

        <h4>8 &middot; pooling can make a loop nobody has</h4>
        <p>Suppose every person has a perfectly consistent score, but they disagree. Average their choices, then take logits:</p>
        <p class="cd-eq">&omega;<sub>pool</sub>(<var>v</var>, <var>w</var>) = logit [ (1/<var>N</var>) &Sigma;<sub><var>e</var></sub> &sigma;(<var>U</var><sub><var>e</var></sub>(<var>w</var>) &minus; <var>U</var><sub><var>e</var></sub>(<var>v</var>)) ]</p>
        <p>The logit of an average is not the average of logits, so the pooled loop can stop closing. That pooled cycle is not evidence that any individual has one. So the analysis estimates each person first and pools second. Evaluator identity is part of the mathematical unit, not disposable annotation metadata.</p>
        <figure class="cd-fig" data-fig="pool"><figcaption><b>Fig. 4</b> Three people, each with one score for the four covers, so each stair closes: <var>F</var> = 0. Average their choices and the pooled stair does not.</figcaption></figure>

        <h4>9 &middot; every pair of moves, one matrix</h4>
        <p>With <var>d</var> style directions, every pair <var>i</var>, <var>j</var> has its own square at <var>x</var> and its own <var>F</var><sub><var>ij</var></sub>. Arrange them in a matrix:</p>
        <p class="cd-eq"><b>F</b>(<var>x</var>)<sub><var>ij</var></sub> = <var>F</var><sub><var>ij</var></sub>(<var>x</var>), &nbsp;&nbsp; <b>F</b>(<var>x</var>)<sub><var>ji</var></sub> = &minus;<var>F</var><sub><var>ij</var></sub>(<var>x</var>), &nbsp;&nbsp; <b>F</b>(<var>x</var>)<sub><var>ii</var></sub> = 0</p>
        <p>That skew-symmetric matrix is the judgment 2-form at <var>x</var>. It asks which pairs of style decisions make one-number ranking fail, whether the defect sits in typography, composition or contrast, and whether a model keeps the human matrix or flattens it. Its size is the Frobenius norm &Vert;<b>F</b>&Vert;<sub>F</sub>, but collapsing the matrix into one number would repeat the original mistake.</p>
        <p>A model can keep the antisymmetry by building the matrix from wedges:</p>
        <p class="cd-eq"><b>F</b> &asymp; &Sigma;<sub>&#8467;</sub> <var>a</var><sub>&#8467;</sub> &and; <var>b</var><sub>&#8467;</sub>, &nbsp;&nbsp; (<var>a</var> &and; <var>b</var>)<sub><var>ij</var></sub> = <var>a</var><sub><var>i</var></sub><var>b</var><sub><var>j</var></sub> &minus; <var>a</var><sub><var>j</var></sub><var>b</var><sub><var>i</var></sub></p>
        <p>Translated: many observed loops may be mixtures of a few recurring two-dimensional tensions in style space. Fig. 5 is one tension. This is a proposed modeling direction, not a result.</p>
        <p>The experiment does not need the whole cube of 2<sup><var>d</var></sup> covers. One base, <var>d</var> single moves and <var>d</var>(<var>d</var> &minus; 1)/2 double moves complete every face that touches <var>x</var>. For the eight directions that is 1 + 8 + 28 = 37 covers, 8<sup>2</sup> = 64 edges and 28 faces, instead of 256 covers.</p>
        <figure class="cd-fig" data-fig="matrix"><figcaption><b>Fig. 5</b> The 2-form built from one tension, <var>a</var> &and; <var>b</var>. Drag the bars. Pink loops turn one way, blue the other. Point at a cell to see its sum.</figcaption></figure>

        <h4>10 &middot; the dress, registered</h4>
        <p>The dress is a worked example of what the same method would measure in fashion. The numbers come from <a href="${JG}/blob/main/docs/assets/00-garment-geometry.png" target="_blank" rel="noreferrer">the project's own photograph</a> of a black dress with white stripes, a bow and a train. All of it is in image space, normalized to the frame, (<var>u</var>, <var>v</var>) = (<var>x</var>/<var>W</var>, <var>y</var>/<var>H</var>), with <var>W</var> &asymp; 816 px and <var>H</var> &asymp; 1160 px.</p>
        <ul>
          <li><b>Stripes.</b> The spacing between neighbouring white courses, measured across the bands: <var>p&#771;</var> = median <var>p</var><sub><var>k</var></sub>(<var>s</var>) &asymp; 50 px &asymp; 0.043<var>H</var>, with about 10 to 13 courses visible. The white duty cycle, <var>D</var><sub><var>w</var></sub> = median <var>t</var><sub><var>w</var></sub>/<var>p</var> &asymp; 0.36 to 0.40.</li>
          <li><b>Bow.</b> From the gathered centre <var>q</var> to the right loop's tip <var>r</var>: <b>b</b> = <var>r</var> &minus; <var>q</var> &asymp; (130, 55) px, so &Vert;<b>b</b>&Vert; &asymp; 141 px &asymp; 0.17<var>W</var>, at tan<sup>&minus;1</sup>(55/130) &asymp; 23&deg; below horizontal.</li>
          <li><b>Train.</b> Hem width over waist width, 190/70 &asymp; 2.7, a trapezoid of about 8.5 &times; 10<sup>4</sup> px<sup>2</sup>.</li>
          <li><b>Black and white.</b> Among classified garment pixels, <var>P</var><sub>black</sub> &asymp; 0.82 to 0.87, about 5 : 1.</li>
        </ul>
        <p>Each is a candidate style coordinate: stripe pitch, duty cycle, bow reach, train flare. A valid style face would change two of them while holding the garment, pose, material and view still. These are 2-D image estimates, not dressmaking measurements.</p>

        <h4>11 &middot; what it does not claim</h4>
        <p>A reliable nonzero face means the four edges cannot come from one score, for that person, that question and that context, and the failure sits on a named pair of moves. It does not mean the person is irrational, that beauty is solved, that the two variables interact, or that anyone experienced a path: static choices measure circulation, not memory. Noise alone makes <var>F</var> nonzero, so the scalar null is simulated on the exact trial graph before any face is called real. The scalar null is allowed to win.</p>
        <p><b>No human finding is claimed.</b> The renderer, browser study, response pipeline, loop mathematics and synthetic demonstrations are built. The human loops are the next experiment.</p>

        <h4>12 &middot; checking it</h4>
        <p><code>make curvature-demo</code> builds the square, both fields, both potential fits and six checks, and writes the whole report to <code>results/curvature_demo.json</code>. The repo also runs 51 Python tests, regenerates the 1,296-record trial manifest from seed 20260731 byte for byte, and audits every render signature: zero identical. No third-party dependencies.</p>
        <p class="cd-links">
          <button type="button" class="btn" data-run>run make curvature-demo</button>
          <a class="btn" href="${JG}/blob/main/scripts/run_curvature_demo.py" target="_blank" rel="noreferrer">run_curvature_demo.py &rarr;</a>
          <a class="btn" href="${JG}/blob/main/src/judgment_geometry/complex.py" target="_blank" rel="noreferrer">complex.py &rarr;</a>
          <a class="btn" href="${JG}/blob/main/docs/mathematical-framework.md" target="_blank" rel="noreferrer">the full framework &rarr;</a>
        </p>`,
    },
  ];
  const byId = (id) => PROJECTS.find((p) => p.id === id);
  const DEFAULT_DESC = `Design made with code and math.<br><br>Select an item to view its description.`;

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const folderIco = (src) => `<span class="ico folder">${src ? `<img src="${src}" alt="">` : ""}</span>`;

  function win(id, cls, title, pos, inner, { label } = {}) {
    return `<section class="window ${cls}" id="${id}" tabindex="-1" hidden style="${pos}" aria-label="${esc(label || title)}">
        <header class="titlebar"><h2>${esc(title)}</h2>
          <button type="button" data-a="min" aria-label="Minimize ${esc(title)}">_</button>
          <button type="button" data-a="close" aria-label="Close ${esc(title)}">&times;</button>
        </header>${inner}</section>`;
  }

  function projectWindows(p) {
    const readme = win(`cd-readme-${p.id}`, `cd-readme cd-set-${p.id}`, `README.md - ${p.file}`, "--w:560px", `
        <div class="dw-toolbar">${p.math ? `<button type="button" class="btn primary" data-math>MATH.md: the math, live &rarr;</button>` : ""}<button type="button" class="btn" data-run>Run ${esc(p.run)}</button><a class="btn" href="${p.repo}" target="_blank" rel="noreferrer">GitHub repo</a></div>
        <div class="pane cd-doc">${p.readme}</div>
        <div class="statusbar" aria-hidden="true"><span>close me to go back to the folder</span><span>2026</span></div>`, { label: `${p.title} README` });
    const math = !p.math ? "" : win(`cd-math-${p.id}`, `cd-readme cd-math cd-set-${p.id}`, `MATH.md - ${p.file}`, "--w:640px", `
        <div class="pane cd-doc">${p.math}</div>
        <div class="statusbar" aria-hidden="true"><span>close me to go back to the pictures</span><span>${p.sections}</span></div>`, { label: `${p.title}: the math` });
    const pics = p.pics.map(([src, name, cap, w, h], k) =>
      win(`cd-pic-${p.id}-${k}`, `dw-snap cd-pic cd-set-${p.id}`, name, "--w:300px", `
        <div class="pane"><img src="${IMG}${p.dir}${src}-sm.jpg" alt="${esc(cap)}" width="${w}" height="${h}" data-full="${k}"></div>
        <p class="dw-cap">${esc(cap)}</p>`)).join("");
    const dos = win(`cd-dos-${p.id}`, `cd-dos cd-set-${p.id}`, "MS-DOS Prompt", "--w:560px", `
        <div class="dw-toolbar"><button type="button" class="btn" data-run>Run ${esc(p.run)}</button></div>
        <div class="pane cd-dos-pane"><pre class="cd-dos-out" aria-live="polite"><span class="cd-cursor" aria-hidden="true">_</span></pre></div>`, { label: `MS-DOS Prompt running ${p.run}` });
    return readme + math + pics + dos;
  }

  function template() {
    const explorer = win("cd-explorer", "cd-explorer", "C:\\summer\\computational_design", "--fx:0.5; --y:40px; --w:clamp(500px, 42vw, 600px)", `
        <div class="menubar" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Help</span></div>
        <div class="addressbar" aria-hidden="true"><span>Address</span><span class="url">C:\\summer\\computational_design</span></div>
        <div class="pane dw-folder">
          <aside class="dw-webview" aria-live="polite">
            <span class="big" aria-hidden="true">${folderIco(IMG + "tower.jpg")}</span>
            <h3>computational design</h3><div class="dw-rule"></div>
            <div class="dw-desc">${DEFAULT_DESC}</div>
          </aside>
          <ul class="cd-thumbs" role="listbox" aria-label="Projects in computational design">${PROJECTS.map((p, i) => `
            <li><button type="button" class="cd-thumb" role="option" aria-selected="false" data-p="${i}">
              <span class="cd-thumb-img"><img src="${p.thumb}" alt="" width="120" height="120"></span>
              <span class="label">${esc(p.file)}</span>
            </button></li>`).join("")}
          </ul>
        </div>
        <div class="statusbar"><span>${PROJECTS.length} object(s) &middot; double-click to open</span><span>more coming soon</span></div>`, { label: "computational design folder" });

    const viewer = win("cd-viewer", "dw-viewer cd-viewer", "Image Viewer", "--w:min(1000px, 70vw)", `
        <div class="dw-nav"><button type="button" class="btn" data-v="-1" aria-label="Previous picture">&lsaquo; prev</button><button type="button" class="btn" data-v="1" aria-label="Next picture">next &rsaquo;</button></div>
        <div class="pane"><img alt=""></div>
        <p class="dw-cap"></p>`, { label: "Image viewer" });

    const icons = [
      ["back", folderIco("/index_me_images/web/booth-1.jpg"), "\u2190 back to summer"],
      ["folder", folderIco(IMG + "tower.jpg"), "computational design"],
      ["math", '<span class="ico doc cd-mathico"></span>', "MATH.md"],
    ];
    return `
      <div class="dw-wall" aria-hidden="true"></div>
      <ul class="icons" aria-label="computational design desktop">${icons.map(([k, ico, label]) => `<li><button class="icon" type="button" data-icon="${k}">${ico}<span class="label">${esc(label)}</span></button></li>`).join("")}</ul>
      ${explorer}${PROJECTS.map(projectWindows).join("")}${viewer}`;
  }

  // ---------- window plumbing (same behavior as the dreu folder) ----------
  let root = null, z = 20, isOpen = false, pushed = false, lastTrigger = null, task = null;
  let openSet = null, setTrigger = null, timers = [], dosRun = 0;
  let mathOpen = false, region = null;   // the math window takes the pictures' place
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];

  function focusW(w) { w.style.zIndex = ++z; $$(".window").forEach((x) => x.classList.toggle("inactive", x !== w)); }
  function showW(w, moveFocus = true) {
    w.hidden = false; focusW(w);
    if (!moveFocus) return;
    w.focus({ preventScroll: true });
    if (!wide.matches) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }

  // what each window's close / minimize / Escape does
  function hideW(w) {
    if (w.id === "cd-explorer") { close(); return; }
    if (openSet && w.id === `cd-readme-${openSet.id}`) { closeSet(); return; }
    if (openSet && w.id === `cd-math-${openSet.id}`) { closeMath(openSet); return; }
    if (w.classList.contains("cd-dos")) dosRun++;
    w.hidden = true;
    w.classList.add("inactive");
  }
  function wireWindow(w) {
    w.addEventListener("pointerdown", () => focusW(w));
    w.querySelector('[data-a="close"]').addEventListener("click", () => hideW(w));
    w.querySelector('[data-a="min"]').addEventListener("click", () => hideW(w));
    w.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      hideW(w);
    });
    const bar = w.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (!wide.matches || e.button !== 0 || e.target.closest("button")) return;
      const box = w.getBoundingClientRect(), area = root.getBoundingClientRect();
      const dx = e.clientX - box.left, dy = e.clientY - box.top;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        w.style.left = `${Math.min(Math.max(ev.clientX - area.left + root.scrollLeft - dx, 80 - box.width), area.width - 80)}px`;
        w.style.top = `${Math.max(ev.clientY - area.top + root.scrollTop - dy, 0)}px`;
      };
      const stop = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", stop); bar.removeEventListener("pointercancel", stop); };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", stop); bar.addEventListener("pointercancel", stop);
    });
  }
  function pop(w, delay, still, scrollTo = false) {
    timers.push(setTimeout(() => {
      if (!still()) return;
      w.classList.remove("dw-popin");
      showW(w, false);
      if (scrollTo) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      void w.offsetWidth; w.classList.add("dw-popin");
    }, reduced ? 0 : delay));
  }

  // Explorer-style items: click selects and shows the description,
  // double-click (or Enter, or a tap) opens
  function wireThumbs() {
    const desc = $(".dw-desc");
    $$(".cd-thumb").forEach((el) => {
      const p = PROJECTS[Number(el.dataset.p)];
      el.addEventListener("click", (e) => {
        $$(".cd-thumb").forEach((f) => f.setAttribute("aria-selected", String(f === el)));
        desc.innerHTML = `${p.desc}<br><br><a href="${HASH}/${p.id}" class="dw-open-link">open it &rarr;</a>`;
        desc.querySelector(".dw-open-link").addEventListener("click", (ev) => { ev.preventDefault(); openProject(p, el); });
        if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) openProject(p, el);
      });
      el.addEventListener("dblclick", () => openProject(p, el));
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
    wireThumbs();
    $$("[data-icon]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.icon === "back") close();
      else if (b.dataset.icon === "math") mathIcon();
      else showW($("#cd-explorer"));
    }));
    PROJECTS.forEach((p) => {
      $$(`.cd-set-${p.id} img[data-full]`).forEach((img) => img.addEventListener("click", () => showPicture(p, Number(img.dataset.full))));
      $$(`.cd-set-${p.id} [data-math]`).forEach((b) => b.addEventListener("click", () => openMath(p)));
      $$(`.cd-set-${p.id} [data-fig-go]`).forEach((b) => b.addEventListener("click", () => {
        const fig = $(`#cd-math-${p.id} figure[data-fig="${b.dataset.figGo}"]`), pane = fig.closest(".cd-doc");
        const behavior = reduced ? "auto" : "smooth";
        if (wide.matches) pane.scrollBy({ top: fig.getBoundingClientRect().top - pane.getBoundingClientRect().top - 10, behavior });
        else fig.scrollIntoView({ block: "start", behavior });
      }));
      $$(`.cd-set-${p.id} [data-run]`).forEach((b) => b.addEventListener("click", () => {
        const dos = $(`#cd-dos-${p.id}`);
        if (dos.hidden) { dos.classList.remove("dw-popin"); void dos.offsetWidth; dos.classList.add("dw-popin"); }
        showW(dos, !wide.matches);
        runDos(p);
      }));
    });
    $$("[data-v]").forEach((b) => b.addEventListener("click", () => showPicture(viewerP, viewerI + Number(b.dataset.v))));
    window.addEventListener("resize", () => {
      if (!isOpen) return;
      placeOverTaskbar();
      if (openSet && wide.matches) layout(openSet);
    });
    root.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      if (openSet) closeSet(); else close();
    });
  }

  // ---------- one project: README and verify.py on the left, pictures in a grid ----------
  const GAP = 10, LEFT = 120, TOP = 12, EDGE = 12;

  // the biggest picture window width that fits c columns (pictures go into
  // columns in order). A window is its picture plus a frame: "inset" pixels of
  // border around the picture's width, "frame" pixels of titlebar, border and
  // caption around its height.
  function fitColumns(ratios, c, gridW, availH, { inset, frame }) {
    let w = Math.floor((gridW - (c - 1) * GAP) / c);
    for (let j = 0; j < c; j++) {
      const col = ratios.filter((_, k) => k % c === j);
      if (!col.length) continue;
      const sum = col.reduce((a, r) => a + r, 0);
      w = Math.min(w, Math.floor((availH - col.length * frame - (col.length - 1) * GAP) / sum + inset));
    }
    return w;
  }

  function layout(p) {
    const readme = $(`#cd-readme-${p.id}`), dos = $(`#cd-dos-${p.id}`);
    const pics = $$(`.cd-pic.cd-set-${p.id}`);
    const ratios = p.pics.map(([, , , w, h]) => h / w);
    const W = root.clientWidth, H = root.clientHeight, availH = H - TOP - EDGE;
    // measure a picture window's frame at a sample width
    const measure = (w, fn) => {
      const was = w.hidden;
      w.style.visibility = "hidden"; w.hidden = false;
      const v = fn(w);
      w.hidden = was; w.style.visibility = "";
      return v;
    };
    pics[0].style.setProperty("--w", "300px");
    const box = measure(pics[0], (w) => {
      const img = w.querySelector("img");
      return { inset: w.offsetWidth - img.offsetWidth, frame: w.offsetHeight - img.offsetHeight };
    });

    let docW = 560, best = null, scroll = false;
    for (const dw of [560, 440]) {
      const gridW = W - LEFT - EDGE - dw - GAP;
      for (let c = 1; c <= pics.length; c++) {
        const w = Math.min(560, fitColumns(ratios, c, gridW, availH, box));
        if (!best || w > best.w) best = { c, w };
      }
      docW = dw;
      if (best.w >= 240) break;
      best = null;
    }
    if (!best) {
      // small screen: let the desktop scroll, and keep the pictures a good size
      scroll = true;
      const gridW = W - LEFT - EDGE - docW - GAP;
      const c = Math.max(1, Math.min(2, Math.floor((gridW + GAP) / (260 + GAP))));
      best = { c, w: Math.min(520, Math.floor((gridW - (c - 1) * GAP) / c)) };
    }
    root.classList.toggle("cd-scroll", scroll);

    // center the whole arrangement in the space right of the icons
    const gridW = best.c * best.w + (best.c - 1) * GAP;
    let spare = W - LEFT - EDGE - docW - GAP - gridW;
    if (spare > 0) { const grow = Math.min(spare, 640 - docW); docW += grow; spare -= grow; }
    const x = LEFT + Math.max(0, Math.floor(spare / 2)), gx = x + docW + GAP;

    // left column: the README on top, the MS-DOS Prompt under it
    const leftH = scroll ? Math.max(availH, 900) : availH;
    const dosH = Math.round(Math.min(460, Math.max(280, leftH * 0.44)));
    [[readme, TOP, leftH - dosH - GAP], [dos, TOP + leftH - dosH, dosH]].forEach(([w, top, h]) => {
      w.style.setProperty("--w", `${docW}px`);
      Object.assign(w.style, { left: `${x}px`, top: `${top}px`, height: `${h}px` });
    });

    // pictures: column by column, in order, stacked by their real heights
    const ys = Array(best.c).fill(TOP);
    pics.forEach((w, k) => {
      const j = k % best.c;
      w.style.setProperty("--w", `${best.w}px`);
      Object.assign(w.style, { left: `${gx + j * (best.w + GAP)}px`, top: `${ys[j]}px` });
      ys[j] += measure(w, (x) => x.offsetHeight) + GAP;
    });
    region = { x: gx, w: gridW, h: scroll ? availH : leftH };
    if (mathOpen) placeMath(p);
  }

  // ---------- MATH.md: on a big screen it takes the pictures' place until it closes ----------
  function placeMath(p) {
    const m = $(`#cd-math-${p.id}`);
    if (!m || !region) return;
    m.style.setProperty("--w", `${region.w}px`);
    Object.assign(m.style, { left: `${region.x}px`, top: `${TOP}px`, height: `${region.h}px` });
  }
  function openMath(p) {
    const m = $(`#cd-math-${p.id}`);
    if (!m || openSet !== p) return;
    if (!m.hidden) { showW(m); return; }
    mathOpen = true;
    m.querySelector(".pane").scrollTop = 0;
    if (wide.matches) {
      $$(`.cd-pic.cd-set-${p.id}`).forEach((w) => { w.hidden = true; });
      $("#cd-viewer").hidden = true;
      placeMath(p);
    }
    m.classList.remove("dw-popin"); void m.offsetWidth; m.classList.add("dw-popin");
    showW(m);
    figures(p, m);
    if (location.hash.startsWith(HASH)) history.replaceState(history.state, "", `${HASH}/${p.id}/math`);
  }
  // each project's live figures live in their own file, loaded the first time its MATH.md opens
  const figs = {};
  function figures(p, m) {
    if (!p.figures || !m.querySelector("figure[data-fig]")) return;
    const { src, api } = p.figures;
    figs[src] ||= new Promise((ok, no) => {
      const js = Object.assign(document.createElement("script"), { src, onload: ok, onerror: no });
      document.head.appendChild(js);
    });
    figs[src].then(() => window[api].mount(m)).catch(() => {});
  }

  // the MATH.md icon on the desktop: the math of the open project, or of the first one
  async function mathIcon() {
    const p = openSet?.math ? openSet : PROJECTS.find((x) => x.math);
    if (openSet !== p) await openProject(p);
    openMath(p);
  }

  function closeMath(p, { address = true } = {}) {
    const m = $(`#cd-math-${p.id}`);
    if (!m || m.hidden) return;
    mathOpen = false;
    if (p.figures) window[p.figures.api]?.stop();
    m.hidden = true;
    if (wide.matches) $$(`.cd-pic.cd-set-${p.id}`).forEach((w, k) => pop(w, k * 70, () => openSet === p && !mathOpen));
    // big screens: back to the README; phones: back to the pictures, which now sit where the math was
    showW(wide.matches ? $(`#cd-readme-${p.id}`) : $(`.cd-pic.cd-set-${p.id}`));
    if (address && location.hash.startsWith(HASH)) history.replaceState(history.state, "", `${HASH}/${p.id}`);
  }

  // the window that should end up in front once a project has finished opening
  const front = (p) => $(mathOpen ? `#cd-math-${p.id}` : `#cd-readme-${p.id}`);

  async function openProject(p, trigger) {
    if (!p) return;
    if (!isOpen) await open();
    if (openSet === p) { focusW($(`#cd-readme-${p.id}`)); return; }
    if (openSet) closeSet({ history: false, folder: false });
    openSet = p;
    setTrigger = trigger || document.activeElement;
    timers.forEach(clearTimeout); timers = [];
    const still = () => openSet === p;
    const readme = $(`#cd-readme-${p.id}`), dos = $(`#cd-dos-${p.id}`);
    const pics = $$(`.cd-pic.cd-set-${p.id}`);
    readme.querySelector(".pane").scrollTop = 0;
    if (wide.matches) {
      $("#cd-explorer").hidden = true; // it comes back when the project closes
      layout(p);
      pop(readme, 0, still);
      pics.forEach((w, k) => pop(w, 140 + k * 110, () => still() && !mathOpen));
      pop(dos, 140 + pics.length * 110, still);
      timers.push(setTimeout(() => { if (still()) { const w = front(p); focusW(w); w.focus({ preventScroll: true }); runDos(p); } }, reduced ? 0 : 260 + pics.length * 110));
    } else {
      [readme, ...pics, dos].forEach((w, k) => pop(w, k * 90, still, k === 0));
      timers.push(setTimeout(() => { if (still()) front(p).focus({ preventScroll: true }); }, 20));
      // on a phone, verify.py runs when you scroll down to it
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (still()) runDos(p);
      }, { threshold: 0.35 });
      timers.push(setTimeout(() => { if (still()) io.observe(dos); }, reduced ? 0 : 600));
    }
    if (location.hash.startsWith(HASH)) history.replaceState(history.state, "", `${HASH}/${p.id}`);
  }

  // folder: show the folder window again. history: put the address back to the folder.
  function closeSet({ folder = true, history: address = true } = {}) {
    if (!openSet) return;
    const p = openSet;
    openSet = null;
    mathOpen = false;
    timers.forEach(clearTimeout); timers = [];
    dosRun++;
    $$(`.cd-set-${p.id}`).forEach((w) => { w.hidden = true; });
    $$(`.cd-set-${p.id} [data-run]`).forEach((b) => { b.disabled = false; });
    $("#cd-viewer").hidden = true;
    root.classList.remove("cd-scroll");
    root.scrollTop = 0;
    if (address && location.hash.startsWith(HASH)) history.replaceState(history.state, "", HASH);
    if (!folder) return;
    const ex = $("#cd-explorer");
    ex.hidden = false;
    focusW(ex);
    if (setTrigger && setTrigger.focus && root.contains(setTrigger)) setTrigger.focus({ preventScroll: true });
    else ex.focus({ preventScroll: true });
  }

  // ---------- the MS-DOS Prompt: types the command, then prints verify.py's output ----------
  async function runDos(p) {
    const run = ++dosRun;
    const dos = $(`#cd-dos-${p.id}`), pane = dos.querySelector(".pane"), out = dos.querySelector(".cd-dos-out"), cursor = out.querySelector(".cd-cursor");
    const alive = () => run === dosRun && !dos.hidden;
    const buttons = $$(`.cd-set-${p.id} [data-run]`);
    const done = () => { if (run === dosRun) buttons.forEach((b) => { b.disabled = false; }); };
    const write = (text, cls) => {
      const s = document.createElement("span");
      if (cls) s.className = cls;
      s.textContent = text;
      cursor.before(s);
      pane.scrollTop = pane.scrollHeight;
    };
    buttons.forEach((b) => { b.disabled = true; });
    out.querySelectorAll("span:not(.cd-cursor)").forEach((s) => s.remove());
    write(p.prompt);
    await sleep(500);
    for (const ch of p.command) { if (!alive()) return done(); write(ch); await sleep(55); }
    write("\n");
    await sleep(450);
    const lines = p.output.split("\n");
    for (const [k, line] of lines.entries()) {
      if (!alive()) return done();
      write(`${line}\n`, (p.hi ? p.hi.test(line) : k === lines.length - 1) ? "hi" : "");
      await sleep(line ? 45 : 160);
    }
    write(`\n${p.prompt}`);
    done();
  }

  // ---------- big pictures ----------
  let viewerP = null, viewerI = 0;
  function showPicture(p, i) {
    viewerP = p; viewerI = (i + p.pics.length) % p.pics.length;
    const [src, name, cap] = p.pics[viewerI], w = $("#cd-viewer"), img = w.querySelector("img");
    w.querySelector(".titlebar h2").textContent = `${name} - Image Viewer`;
    img.src = `${IMG}${p.dir}${src}.jpg`; img.alt = cap;
    w.querySelector(".dw-cap").textContent = cap;
    if (wide.matches && w.hidden) {
      const W = root.clientWidth, vw = Math.min(1000, W - LEFT - 2 * EDGE);
      w.style.setProperty("--w", `${vw}px`);
      Object.assign(w.style, { left: `${LEFT + Math.max(0, (W - LEFT - EDGE - vw) / 2)}px`, top: `${root.scrollTop + TOP}px` });
    }
    showW(w);
  }

  // ---------- the folder's own desktop ----------
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
    // straight to a project: show the desktop right away, without the explorer
    const direct = location.hash.startsWith(`${HASH}/`);
    const w = $("#cd-explorer");
    w.hidden = true;
    if (!direct) await zoomFrom(trigger);
    if (!isOpen) return;
    root.hidden = false;
    document.documentElement.style.overflow = "hidden";
    addTask();
    if (!location.hash.startsWith(HASH)) { history.pushState({ cd: 1 }, "", HASH); pushed = true; }
    if (direct) { if (!wide.matches) w.hidden = false; return; }
    w.classList.remove("dw-popin"); void w.offsetWidth; w.classList.add("dw-popin");
    showW(w);
  }

  function close(fromHistory) {
    if (!isOpen) return;
    closeSet({ folder: false, history: false });
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

  // what the address says should be open: nothing, the folder, or a project
  async function route() {
    const h = location.hash;
    if (!h.startsWith(HASH)) { if (isOpen) close(true); return; }
    const [id, sub] = h.startsWith(`${HASH}/`) ? h.slice(HASH.length + 1).split("/") : [];
    const p = id ? byId(id) : null;
    if (!isOpen) open();
    if (!p) { if (openSet) closeSet({ history: false }); return; }
    if (openSet !== p) await openProject(p);
    if (sub === "math") openMath(p);
    else closeMath(p, { address: false });
  }
  window.addEventListener("popstate", route);
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-compdesign]");
    if (!t || document.body.classList.contains("plain-mode")) return;
    e.preventDefault();
    e.stopPropagation();
    open(t);
  }, true);
  if (location.hash.startsWith(HASH)) route();
  window.computationalDesign = { open, close, openProject: (id) => openProject(byId(id)) };
})();
