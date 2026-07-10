import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const notes = [
  {
    mark: 'DREU / UIUC',
    title: 'Fourier structure under pressure',
    text: ['Shor -> order finding', 'QFT -> phase structure', 'noise -> what survives'],
  },
  {
    mark: 'BIO + CS',
    title: 'Systems, models, evidence',
    text: ['living systems', 'simulation as microscope', 'writing as proof trail'],
  },
  {
    mark: 'FIELD LOG',
    title: 'Weekly research record',
    text: ['questions', 'implementation notes', 'what changed my mind'],
  },
]

const entries = [
  ['01', 'Orientation, lab context, and quantum background', '/dreu/logs/week-01.html'],
  ['02', 'Shor simulation and order finding', '/dreu/logs/week-02.html'],
  ['03', 'Manual QFT implementation and noise experiments', '/dreu/logs/week-03.html'],
  ['04', 'Regev direction, scaling, and research narrative', '/dreu/logs/week-04.html'],
]

function makePanelTexture({ mark, title, text }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640

  const context = canvas.getContext('2d')
  context.fillStyle = '#f5ecd7'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.strokeStyle = 'rgba(29, 39, 36, 0.13)'
  context.lineWidth = 2
  for (let y = 88; y < canvas.height; y += 54) {
    context.beginPath()
    context.moveTo(64, y)
    context.lineTo(canvas.width - 64, y)
    context.stroke()
  }

  context.fillStyle = '#a5483e'
  context.fillRect(0, 0, 18, canvas.height)
  context.fillStyle = '#1d2724'
  context.font = '700 34px ui-sans-serif, system-ui, sans-serif'
  context.fillText(mark, 68, 86)

  context.font = '700 58px Georgia, serif'
  wrapText(context, title, 68, 178, 820, 62)

  context.font = '500 34px ui-sans-serif, system-ui, sans-serif'
  context.fillStyle = '#526159'
  text.forEach((line, index) => {
    context.fillText(line, 86, 390 + index * 58)
    context.fillStyle = index === 0 ? '#526159' : context.fillStyle
  })

  context.strokeStyle = '#d59a4d'
  context.lineWidth = 5
  context.beginPath()
  context.moveTo(68, 316)
  context.bezierCurveTo(220, 250, 350, 370, 512, 312)
  context.bezierCurveTo(650, 262, 748, 312, 910, 282)
  context.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let currentY = y

  words.forEach((word, index) => {
    const testLine = `${line}${word} `
    if (context.measureText(testLine).width > maxWidth && index > 0) {
      context.fillText(line, x, currentY)
      line = `${word} `
      currentY += lineHeight
    } else {
      line = testLine
    }
  })

  context.fillText(line, x, currentY)
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(18, 12, 110, 76)
  geometry.rotateX(-Math.PI / 2)

  const positions = geometry.attributes.position
  const colors = []
  const moss = new THREE.Color('#546f5a')
  const ink = new THREE.Color('#253936')
  const paper = new THREE.Color('#d7c99f')
  const ember = new THREE.Color('#b86543')

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const z = positions.getZ(index)
    const ridge =
      Math.sin(x * 0.82 + z * 0.26) * 0.42 +
      Math.cos(x * 0.34 - z * 0.84) * 0.36 +
      Math.sin((x + z) * 0.92) * 0.18
    const river = Math.exp(-Math.pow(x - Math.sin(z * 0.75) * 1.4, 2) / 1.6) * 0.72
    const height = ridge - river - 1.18
    const normalized = THREE.MathUtils.clamp((height + 1.9) / 2.4, 0, 1)
    const color = ink.clone().lerp(moss, normalized)

    if (height > -0.24) {
      color.lerp(paper, THREE.MathUtils.clamp((height + 0.24) / 0.92, 0, 1) * 0.42)
    }

    if (Math.abs(x - Math.sin(z * 0.75) * 1.4) < 0.24) {
      color.lerp(ember, 0.55)
    }

    positions.setY(index, height)
    colors.push(color.r, color.g, color.b)
  }

  positions.needsUpdate = true
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.86,
      metalness: 0.02,
    }),
  )

  const wire = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshBasicMaterial({
      color: '#f0d98a',
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    }),
  )

  const group = new THREE.Group()
  group.add(mesh, wire)
  group.position.set(2.6, -1.26, -3.25)
  group.rotation.set(0.05, -0.42, 0)

  return group
}

function createHelix() {
  const group = new THREE.Group()
  const colors = ['#68c3bd', '#d96b52']

  colors.forEach((color, strand) => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 90 }, (_, index) => {
        const t = index / 89
        const angle = t * Math.PI * 7.2 + strand * Math.PI
        return new THREE.Vector3(
          Math.cos(angle) * 0.34,
          -1.55 + t * 3.85,
          Math.sin(angle) * 0.34,
        )
      }),
    )
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 130, 0.025, 8, false),
        new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.18 }),
      ),
    )
  })

  for (let index = 0; index < 19; index += 1) {
    const t = index / 18
    const angle = t * Math.PI * 7.2
    const left = new THREE.Vector3(Math.cos(angle) * 0.34, -1.55 + t * 3.85, Math.sin(angle) * 0.34)
    const right = new THREE.Vector3(Math.cos(angle + Math.PI) * 0.34, left.y, Math.sin(angle + Math.PI) * 0.34)
    const curve = new THREE.LineCurve3(left, right)
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 1, 0.012, 6, false),
        new THREE.MeshStandardMaterial({ color: '#f5ecd7', roughness: 0.7 }),
      ),
    )
  }

  group.position.set(-3.55, 0.24, -2.7)
  group.rotation.set(0.18, 0.35, -0.08)
  return group
}

function createQuantumObject() {
  const group = new THREE.Group()
  const materials = [
    new THREE.MeshStandardMaterial({ color: '#e8c36a', roughness: 0.45, metalness: 0.25 }),
    new THREE.MeshStandardMaterial({ color: '#68c3bd', roughness: 0.5, metalness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: '#d96b52', roughness: 0.55, metalness: 0.15 }),
  ]

  ;[
    [0, 0, 0],
    [Math.PI / 2, 0.35, 0],
    [0.68, Math.PI / 2, 0.15],
  ].forEach((rotation, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05 + index * 0.16, 0.013, 16, 128), materials[index])
    ring.rotation.set(rotation[0], rotation[1], rotation[2])
    group.add(ring)
  })

  group.add(
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.22, 1),
      new THREE.MeshStandardMaterial({ color: '#f5ecd7', roughness: 0.22, metalness: 0.1 }),
    ),
  )
  group.position.set(1.16, 1.9, -1.75)
  return group
}

function createCircuit() {
  const group = new THREE.Group()
  const material = new THREE.LineBasicMaterial({ color: '#9edbd7', transparent: true, opacity: 0.82 })
  const points = [
    [-2.6, -0.2, 0],
    [-1.4, -0.2, 0],
    [-1.4, 0.42, 0],
    [-0.2, 0.42, 0],
    [-0.2, -0.46, 0],
    [1.2, -0.46, 0],
    [1.2, 0.18, 0],
    [2.5, 0.18, 0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z))

  for (let index = 0; index < points.length - 1; index += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([points[index], points[index + 1]])
    group.add(new THREE.Line(geometry, material))
  }

  points.forEach((point, index) => {
    group.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(index % 2 === 0 ? 0.07 : 0.05, 14, 14),
        new THREE.MeshStandardMaterial({ color: index % 2 === 0 ? '#e8c36a' : '#f5ecd7', roughness: 0.35 }),
      ),
    ).position.copy(point)
  })

  group.position.set(2.85, 1.1, -1.25)
  group.rotation.set(-0.15, -0.42, 0.08)
  return group
}

function createPanels() {
  const group = new THREE.Group()
  const placements = [
    [-2.95, 2.06, -2.35, 0.08, 0.38, -0.07, 0.82],
    [3.95, 2.3, -3.35, -0.14, -0.48, 0.08, 0.92],
    [-0.45, -1.35, -0.15, -0.38, 0.1, -0.02, 0.68],
  ]

  notes.forEach((note, index) => {
    const [x, y, z, rx, ry, rz, scale] = placements[index]
    const texture = makePanelTexture(note)
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.62),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: index === 2 ? 0.58 : 0.9,
        side: THREE.DoubleSide,
      }),
    )
    panel.position.set(x, y, z)
    panel.rotation.set(rx, ry, rz)
    panel.scale.setScalar(scale)
    panel.userData.floatOffset = index * 1.7
    group.add(panel)
  })

  return group
}

function createParticles() {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const colors = []
  const palette = [new THREE.Color('#f5ecd7'), new THREE.Color('#68c3bd'), new THREE.Color('#e8c36a')]

  for (let index = 0; index < 220; index += 1) {
    vertices.push(
      THREE.MathUtils.randFloatSpread(11),
      THREE.MathUtils.randFloat(-2.0, 4.2),
      THREE.MathUtils.randFloat(-5.8, 1.8),
    )
    const color = palette[index % palette.length]
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
    }),
  )
}

function ResearchAtlas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#10171c')
    scene.fog = new THREE.Fog('#10171c', 8, 16)

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.4, 7.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const atlas = new THREE.Group()
    const terrain = createTerrain()
    const helix = createHelix()
    const quantum = createQuantumObject()
    const circuit = createCircuit()
    const panels = createPanels()
    const particles = createParticles()

    atlas.add(terrain, helix, quantum, circuit, panels, particles)
    scene.add(atlas)

    scene.add(new THREE.HemisphereLight('#fff2d1', '#0b1415', 2.35))
    const key = new THREE.DirectionalLight('#ffe4b4', 2.4)
    key.position.set(-3.4, 5.6, 3.2)
    scene.add(key)
    const rim = new THREE.PointLight('#68c3bd', 6.2, 9)
    rim.position.set(4.5, 2.1, 2.2)
    scene.add(rim)

    const pointer = { x: 0, y: 0 }
    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('resize', handleResize)

    let animationFrame = 0
    const clock = new THREE.Clock()

    const animate = () => {
      const time = clock.getElapsedTime()
      animationFrame = window.requestAnimationFrame(animate)

      atlas.rotation.y = Math.sin(time * 0.18) * 0.045
      terrain.rotation.z = Math.sin(time * 0.22) * 0.018
      quantum.rotation.x = time * 0.32
      quantum.rotation.y = time * 0.42
      helix.rotation.y = 0.35 + Math.sin(time * 0.35) * 0.16
      circuit.position.y = 1.1 + Math.sin(time * 0.72) * 0.08
      particles.rotation.y = time * 0.025

      panels.children.forEach((panel) => {
        panel.position.y += Math.sin(time * 0.9 + panel.userData.floatOffset) * 0.0009
        panel.rotation.z += Math.sin(time * 0.7 + panel.userData.floatOffset) * 0.00022
      })

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.34, 0.035)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.4 - pointer.y * 0.16, 0.035)
      camera.lookAt(0.1, 0.18, -2.4)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="atlas-scene" ref={mountRef} aria-hidden="true" />
}

export default function App() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="hero-title">
        <ResearchAtlas />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        <nav className="topbar" aria-label="Primary navigation">
          <a href="/" className="brand">
            Summer Malik
          </a>
          <div className="nav-links">
            <a href="/dreu/">DREU</a>
            <a href="https://github.com/simransummermalik" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/summermalik/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">Computational biology / quantum algorithms / research notes</p>
          <h1 id="hero-title">Summer Malik</h1>
          <p className="lead">
            I study complicated systems by building simulations, tracing their structure,
            and writing down the parts that make the math feel less sealed off.
          </p>
          <div className="hero-actions" aria-label="Featured links">
            <a className="button primary" href="/dreu/">
              Open DREU log
            </a>
            <a className="button secondary" href="https://github.com/simransummermalik" target="_blank" rel="noreferrer">
              View GitHub
            </a>
          </div>
        </div>

        <aside className="hero-aside" aria-label="Current research focus">
          <p>Current orbit</p>
          <span>QFT noise maps</span>
          <span>Shor simulations</span>
          <span>Regev-style circuits</span>
        </aside>
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <p className="section-label">Research Posture</p>
        <h2 id="manifesto-title">Academic, but still a little electrically weird.</h2>
        <p>
          I like research spaces where code, biology, math, and explanation are allowed
          to sit on the same desk. The goal is not just to make something run. It is to
          understand what the run is telling us.
        </p>
      </section>

      <section className="lab-board" aria-label="Research areas">
        <article>
          <p>01 / Living Systems</p>
          <h3>Biology gives the questions texture.</h3>
          <span>
            The systems are messy, adaptive, and full of hidden state. That is exactly
            why they are interesting computationally.
          </span>
        </article>
        <article>
          <p>02 / Algorithms</p>
          <h3>Simulation turns abstraction into evidence.</h3>
          <span>
            I am interested in the moment a theoretical object becomes something you can
            perturb, measure, plot, and explain.
          </span>
        </article>
        <article>
          <p>03 / Writing</p>
          <h3>The notes matter as much as the result.</h3>
          <span>
            Research gets stronger when the failed paths, assumptions, and small
            discoveries stay visible.
          </span>
        </article>
      </section>

      <section className="research-section" aria-labelledby="research-title">
        <div className="research-copy">
          <p className="section-label">DREU 2026</p>
          <h2 id="research-title">Quantum factoring field log</h2>
          <p>
            Weekly records from UIUC: Shor's algorithm, manual QFT work, noise
            experiments, Regev-style factoring, and the process of turning scattered
            implementation work into a coherent research story.
          </p>
        </div>

        <div className="entry-list">
          {entries.map(([week, title, href]) => (
            <a href={href} className="entry-row" key={week}>
              <span>{week}</span>
              <strong>{title}</strong>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Summer Malik</p>
        <div>
          <a href="/dreu/">DREU</a>
          <a href="https://github.com/simransummermalik" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/summermalik/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  )
}
