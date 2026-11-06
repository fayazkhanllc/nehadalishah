import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import katex from 'katex'
import { FloorGrid } from './viz'

const EQS = [
  { tex: '\\nabla\\cdot\\mathbf{u}=0', p: [-3.2, 2.2, -1] },
  { tex: '\\rho\\frac{D\\mathbf{u}}{Dt}=-\\nabla p+\\mu\\nabla^{2}\\mathbf{u}', p: [5.4, 2.7, -2] },
  { tex: '{}^{C}\\!D_t^{\\alpha}f(t)=\\frac{1}{\\Gamma(1-\\alpha)}\\int_0^t\\frac{f^{\\prime}(\\tau)}{(t-\\tau)^{\\alpha}}d\\tau', p: [-4.2, -1.6, -1.5] },
  { tex: '\\rho c_p\\,\\partial_t T=k\\nabla^2 T', p: [4.6, -1.8, -1] },
  { tex: '\\mathbf{J}\\times\\mathbf{B}', p: [0.6, 3.1, -2.5] },
]

function Surface({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const N = mobile ? 44 : 72
  const size = 8
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(N * N * 3)
    const col = new Float32Array(N * N * 3)
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        pos[(r * N + c) * 3] = (c / (N - 1) - 0.5) * size
        pos[(r * N + c) * 3 + 2] = (r / (N - 1) - 0.5) * size
      }
    const idx: number[] = []
    for (let r = 0; r < N - 1; r++)
      for (let c = 0; c < N - 1; c++) {
        const a = r * N + c
        idx.push(a, a + N, a + 1, a + 1, a + N, a + N + 1)
      }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    g.setIndex(idx)
    return g
  }, [N])
  const tmp = useMemo(() => new THREE.Color(), [])
  const a = useMemo(() => new THREE.Color('#4263EB'), [])
  const b = useMemo(() => new THREE.Color('#7957FF'), [])
  const c = useMemo(() => new THREE.Color('#12A8D8'), [])
  const mouse = useRef(new THREE.Vector2(0, 0))
  useFrame((s) => {
    const t = reduced ? 0 : s.clock.elapsedTime
    mouse.current.lerp(new THREE.Vector2(s.pointer.x * 3.5, -s.pointer.y * 3.5), 0.06)
    const p = geo.attributes.position as THREE.BufferAttribute
    const col = geo.attributes.color as THREE.BufferAttribute
    for (let i = 0; i < N * N; i++) {
      const x = p.getX(i), z = p.getZ(i)
      const r = Math.sqrt(x * x + z * z)
      let y = 0.55 * Math.sin(r * 1.5 - t * 1.1) * Math.exp(-r * 0.2)
      y += 0.22 * Math.sin(x * 0.9 + t * 0.5) * Math.cos(z * 0.9 - t * 0.4)
      const dx = x - mouse.current.x, dz = z - mouse.current.y
      y += 0.9 * Math.exp(-(dx * dx + dz * dz) * 0.5) * Math.cos(Math.sqrt(dx * dx + dz * dz) * 3 - t * 2)
      p.setY(i, y)
      const h = Math.min(1, Math.max(0, y * 0.9 + 0.45))
      if (h < 0.5) tmp.copy(a).lerp(b, h * 2)
      else tmp.copy(b).lerp(c, (h - 0.5) * 2)
      col.setXYZ(i, tmp.r, tmp.g, tmp.b)
    }
    p.needsUpdate = true
    col.needsUpdate = true
  })
  return (
    <>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.85} />
      </mesh>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial vertexColors transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </>
  )
}

function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null!)
  const { pos, col, vel } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const cols = [new THREE.Color('#12A8D8'), new THREE.Color('#7957FF'), new THREE.Color('#4263EB'), new THREE.Color('#1c2b6b')]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1
      const c = cols[Math.floor(Math.random() * cols.length)]
      col.set([c.r, c.g, c.b], i * 3)
    }
    return { pos, col, vel }
  }, [count])
  useFrame((s, d) => {
    if (reduced) return
    const dt = Math.min(d, 0.05)
    const t = s.clock.elapsedTime
    // pointer in world space at z=0 plane
    const mx = (s.pointer.x * s.viewport.width) / 2
    const my = (s.pointer.y * s.viewport.height) / 2
    for (let i = 0; i < count; i++) {
      const k = i * 3
      let x = pos[k], y = pos[k + 1], z = pos[k + 2]
      // smooth swirling flow field
      const fx = Math.sin(y * 0.55 + t * 0.35) + 0.6 * Math.cos(z * 0.7 - t * 0.2) + 0.5
      const fy = Math.sin(z * 0.5 + t * 0.3) * 0.6 + Math.cos(x * 0.45 - t * 0.25) * 0.6
      const fz = Math.cos(x * 0.5 + t * 0.2) * 0.5
      vel[k] += (fx * 0.35 - vel[k]) * 0.04
      vel[k + 1] += (fy * 0.35 - vel[k + 1]) * 0.04
      vel[k + 2] += (fz * 0.35 - vel[k + 2]) * 0.04
      // repel from cursor
      const dx = x - mx, dy = y - my
      const d2 = dx * dx + dy * dy
      if (d2 < 2.8) {
        const f = (2.8 - d2) * 0.6
        const dl = Math.sqrt(d2) + 0.001
        vel[k] += (dx / dl) * f * dt * 4
        vel[k + 1] += (dy / dl) * f * dt * 4
      }
      x += vel[k] * dt; y += vel[k + 1] * dt; z += vel[k + 2] * dt
      if (x > 8) x = -8
      if (x < -8) x = 8
      if (y > 4.5) y = -4.5
      if (y < -4.5) y = 4.5
      pos[k] = x; pos[k + 1] = y; pos[k + 2] = z
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function Curves({ reduced }: { reduced: boolean }) {
  const g = useRef<THREE.Group>(null!)
  const geos = useMemo(
    () =>
      [0, 1, 2].map((k) => {
        const pts: THREE.Vector3[] = []
        for (let i = 0; i <= 260; i++) {
          const t = (i / 260) * Math.PI * 2
          pts.push(new THREE.Vector3(Math.sin(t * (2 + k)) * (2.2 + k * 0.5), Math.cos(t * (3 + k)) * (1.4 + k * 0.3), Math.sin(t * (1 + k) + k) * 1.6))
        }
        return new THREE.BufferGeometry().setFromPoints(pts)
      }),
    [],
  )
  useFrame((_, d) => {
    if (!reduced) {
      g.current.rotation.y += d * 0.12
      g.current.rotation.x += d * 0.03
    }
  })
  const colors = ['#12A8D8', '#7957FF', '#4263EB']
  return (
    <group ref={g} position={[0, 0.3, -1]}>
      {geos.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color={colors[i]} transparent opacity={0.55} />
        </line>
      ))}
    </group>
  )
}

function Rig({ children, mobile }: { children: React.ReactNode; mobile: boolean }) {
  const g = useRef<THREE.Group>(null!)
  useFrame((s) => {
    const cam = s.camera
    cam.position.x += (s.pointer.x * 1.1 - cam.position.x) * 0.04
    cam.position.y += (3.2 + s.pointer.y * 0.8 - cam.position.y) * 0.04
    cam.lookAt(mobile ? 0 : 0.8, 0, 0)
    g.current.rotation.y += (s.pointer.x * 0.25 - g.current.rotation.y) * 0.04
  })
  return <group ref={g} position={[mobile ? 0 : 5.0, mobile ? -1.9 : -0.9, mobile ? -1 : -1.5]} scale={mobile ? 0.75 : 0.72}>{children}</group>
}

function Equations({ reduced }: { reduced: boolean }) {
  const [html] = useState(() => EQS.map((e) => katex.renderToString(e.tex, { throwOnError: false })))
  return (
    <>
      {EQS.map((e, i) => (
        <Html key={i} position={e.p as [number, number, number]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
          <div
            className="eq-float"
            style={{ animationDelay: `${i * 2.4}s`, opacity: reduced ? 0.5 : undefined, animationName: reduced ? 'none' : undefined }}
            dangerouslySetInnerHTML={{ __html: html[i] }}
          />
        </Html>
      ))}
    </>
  )
}

export default function HeroScene({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const [q, setQ] = useState(1)
  const count = Math.round((mobile ? 700 : 2200) * q)
  return (
    <Canvas dpr={[1, mobile ? 1.5 : 1.8]} camera={{ position: [0, 3.2, 9.5], fov: 50 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <PerformanceMonitor onDecline={() => setQ(0.5)} onIncline={() => setQ(1)} />
      <color attach="background" args={['#FFFFFF']} />
      <fog attach="fog" args={['#FFFFFF', 10, 24]} />
      <ambientLight intensity={0.6} />
      <Rig mobile={mobile}>
        <Surface mobile={mobile} reduced={reduced} />
        <Curves reduced={reduced} />
      </Rig>
      <Particles key={count} count={count} reduced={reduced} />
      <FloorGrid y={-2.6} size={22} />
      {!mobile && <Equations reduced={reduced} />}
    </Canvas>
  )
}
