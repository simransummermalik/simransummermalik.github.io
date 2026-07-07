import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef } from 'react'

function Structure() {
  const group = useRef()

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.35
    group.current.rotation.x += delta * 0.08
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.01, 16, 120]} />
        <meshStandardMaterial color="#7dd3fc" />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.45, 0.01, 16, 120]} />
        <meshStandardMaterial color="#c084fc" />
      </mesh>

      <mesh position={[0.8, 0.35, 0.2]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <pointLight position={[4, 4, 4]} intensity={2} />
      <Stars radius={70} depth={35} count={1200} factor={3} fade />
      <Structure />
      <OrbitControls enableZoom={false} />
    </>
  )
}

export default function App() {
  return (
    <main className="page">
      <section className="home">
        <div className="visual">
          <Canvas camera={{ position: [0, 0, 4.5] }}>
            <Scene />
          </Canvas>
        </div>

        <div className="content">
          <p className="name">Summer Malik</p>

          <h1>Computer Science + Biology undergraduate.</h1>

          <p className="bio">
            I work on research projects across quantum algorithms, bioinformatics,
            artificial intelligence, and computational science.
          </p>

          <p className="bio">
            I am currently at UIUC for DREU, studying Shor’s algorithm, the Quantum
            Fourier Transform, noise sensitivity, and newer factoring approaches.
          </p>

          <div className="links">
            <a href="/dreu/">DREU Research Log</a>
            <a href="https://github.com/simransummermalik" target="_blank">GitHub</a>
            <a href="https://www.linkedin.com/in/summermalik/" target="_blank">LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  )
}