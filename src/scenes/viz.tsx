import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Scientific-inspired visualizations. Each one integrates a standard textbook model
 * (potential flow past a sphere, Lorenz system, heat equation, dipole field, Caputo derivative of t).
 * They are illustrative demonstrations — NOT results from the researcher's publications.
 */

const C = {
  blue: new THREE.Color('#4263EB'),
  violet: new THREE.Color('#7957FF'),
  cyan: new THREE.Color('#46D9FF'),
  warm: new THREE.Color('#ff8a5c'),
  hot: new THREE.Color('#fff1c9'),
}
const gauss = () => Math.random() + Math.random() + Math.random() - 1.5
const clampDt = (d: number) => Math.min(d, 0.05)

function ramp(t: number, out: THREE.Color, stops: THREE.Color[]) {
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1)
  const i = Math.floor(x)
  return out.copy(stops[i]).lerp(stops[i + 1], x - i)
}

const pointMat = (size = 0.045, opacity = 0.9) => (
  <pointsMaterial size={size} vertexColors transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
)

/* ---------- shared grid geometry ---------- */
function makeGrid(N: number, size: number) {
  const g = new THREE.BufferGeometry()
  const pos = new Float32Array(N * N * 3)
  const col = new Float32Array(N * N * 3)
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const i = (r * N + c) * 3
      pos[i] = (c / (N - 1) - 0.5) * size
      pos[i + 2] = (r / (N - 1) - 0.5) * size
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
}

/* ---------- coordinate axes ---------- */
export function Axes({ s = 2.6, labels = true }: { s?: number; labels?: boolean }) {
  const lines = useMemo(
    () =>
      [
        { p: [[-s, 0, 0], [s, 0, 0]], c: '#46D9FF', l: 'x', e: [s + 0.2, 0, 0] },
        { p: [[0, -s, 0], [0, s, 0]], c: '#7957FF', l: 'z', e: [0, s + 0.2, 0] },
        { p: [[0, 0, -s], [0, 0, s]], c: '#4263EB', l: 'y', e: [0, 0, s + 0.2] },
      ].map((a) => {
        const g = new THREE.BufferGeometry().setFromPoints(a.p.map((v) => new THREE.Vector3(...v)))
        return { ...a, g }
      }),
    [s],
  )
  return (
    <group>
      {lines.map((a) => (
        <group key={a.l}>
          <line>
            <primitive object={a.g} attach="geometry" />
            <lineBasicMaterial color={a.c} transparent opacity={0.45} />
          </line>
          {labels && (
            <Html position={a.e as [number, number, number]} center style={{ pointerEvents: 'none', color: a.c, fontSize: 12, fontFamily: 'Space Grotesk' }}>
              {a.l}
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}

export function FloorGrid({ y = -1.6, size = 10 }: { y?: number; size?: number }) {
  const g = useMemo(() => {
    const h = new THREE.GridHelper(size, size * 2, '#4263EB', '#1c2750')
    ;(h.material as THREE.Material).transparent = true
    ;(h.material as THREE.Material).opacity = 0.35
    return h
  }, [size])
  return <primitive object={g} position={[0, y, 0]} />
}

/* ---------- 1. Fluid: potential flow past a sphere ---------- */
export function FluidViz({ count = 900, follow = false }: { count?: number; follow?: boolean }) {
  const sphere = useRef<THREE.Mesh>(null!)
  const pts = useRef<THREE.Points>(null!)
  const { pos, col } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.6
    }
    return { pos, col }
  }, [count])
  const tmp = useMemo(() => new THREE.Color(), [])
  useFrame((s, d) => {
    const dt = clampDt(d)
    const cx = follow ? s.pointer.x * 3 : 0
    const cy = follow ? s.pointer.y * 1.4 : 0
    sphere.current.position.set(cx, cy, 0)
    const a = 0.75, U = 1.7, a3 = a * a * a
    for (let i = 0; i < count; i++) {
      const k = i * 3
      const x = pos[k] - cx, y = pos[k + 1] - cy, z = pos[k + 2]
      const r = Math.sqrt(x * x + y * y + z * z)
      if (r < a * 1.03 || pos[k] > 4.2) {
        pos[k] = -4.2
        pos[k + 1] = (Math.random() - 0.5) * 3.6
        pos[k + 2] = (Math.random() - 0.5) * 3.6
        continue
      }
      const xr = x / r
      const f = a3 / (2 * r * r * r)
      const vx = U * (1 + f * (3 * xr * xr - 1))
      const vy = U * f * 3 * xr * (y / r)
      const vz = U * f * 3 * xr * (z / r)
      pos[k] += vx * dt
      pos[k + 1] += vy * dt
      pos[k + 2] += vz * dt
      ramp(Math.hypot(vx, vy, vz) / (U * 1.6), tmp, [C.blue, C.violet, C.cyan])
      col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b
    }
    const g = pts.current.geometry
    g.attributes.position.needsUpdate = true
    g.attributes.color.needsUpdate = true
  })
  return (
    <group>
      <mesh ref={sphere}>
        <icosahedronGeometry args={[0.75, 2]} />
        <meshStandardMaterial color="#1b2a63" metalness={0.5} roughness={0.35} emissive="#4263EB" emissiveIntensity={0.25} />
      </mesh>
      <points ref={pts} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
        </bufferGeometry>
        {pointMat(0.05)}
      </points>
    </group>
  )
}

/* ---------- 2. Mathematical surface ---------- */
export function SurfaceViz({ N = 48, size = 4.4, interactive = true }: { N?: number; size?: number; interactive?: boolean }) {
  const geo = useMemo(() => makeGrid(N, size), [N, size])
  const bump = useRef(new THREE.Vector2(99, 99))
  const tmp = useMemo(() => new THREE.Color(), [])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const p = geo.attributes.position as THREE.BufferAttribute
    const c = geo.attributes.color as THREE.BufferAttribute
    for (let i = 0; i < N * N; i++) {
      const x = p.getX(i), z = p.getZ(i)
      const r = Math.sqrt(x * x + z * z)
      let y = (Math.sin(r * 2.1 - t * 1.4) * 0.5) / (1 + r * 0.45)
      y += 0.18 * Math.sin(x * 1.3 + t * 0.6) * Math.cos(z * 1.3 - t * 0.5)
      const dx = x - bump.current.x, dz = z - bump.current.y
      y += 0.7 * Math.exp(-(dx * dx + dz * dz) * 1.4)
      p.setY(i, y)
      ramp(y * 0.9 + 0.45, tmp, [C.blue, C.violet, C.cyan])
      c.setXYZ(i, tmp.r, tmp.g, tmp.b)
    }
    p.needsUpdate = true
    c.needsUpdate = true
    bump.current.lerp(new THREE.Vector2(99, 99), 0.0) // keep until pointer leaves
  })
  const move = (e: ThreeEvent<PointerEvent>) => interactive && bump.current.set(e.point.x, e.point.z)
  return (
    <group>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.85} />
      </mesh>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial vertexColors transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move} onPointerOut={() => bump.current.set(99, 99)}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ---------- 3. Nanoparticles in a thermal gradient ---------- */
export function NanoViz({ count = 700, nano = 14, spread = 2.6 }: { count?: number; nano?: number; spread?: number }) {
  const hot = useRef(new THREE.Vector3(-99, 0, 0))
  const pts = useRef<THREE.Points>(null!)
  const inst = useRef<THREE.InstancedMesh>(null!)
  const { pos, col, np } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    const np = new Float32Array(nano * 3)
    for (let i = 0; i < nano; i++) {
      np[i * 3] = (Math.random() - 0.5) * spread * 1.6
      np[i * 3 + 1] = (Math.random() - 0.5) * 2.4
      np[i * 3 + 2] = (Math.random() - 0.5) * 2.4
    }
    return { pos, col, np }
  }, [count, nano, spread])
  const tmp = useMemo(() => new THREE.Color(), [])
  const o = useMemo(() => new THREE.Object3D(), [])
  const temp = (x: number, y: number, z: number) => {
    let T = 1 - (x + spread) / (spread * 2) // hot on the left, cold on the right
    const h = hot.current
    if (h.x > -50) T += 0.9 * Math.exp(-((x - h.x) ** 2 + (y - h.y) ** 2 + (z - h.z) ** 2) * 0.8)
    return Math.min(1.3, Math.max(0, T))
  }
  useFrame((_, d) => {
    const dt = clampDt(d)
    for (let i = 0; i < count; i++) {
      const k = i * 3
      const T = temp(pos[k], pos[k + 1], pos[k + 2])
      const a = (0.25 + T * 1.1) * Math.sqrt(dt) * 0.9
      pos[k] += gauss() * a
      pos[k + 1] += gauss() * a
      pos[k + 2] += gauss() * a
      for (let j = 0; j < 3; j++) {
        const lim = j === 0 ? spread : 1.6
        if (pos[k + j] > lim) pos[k + j] = lim
        if (pos[k + j] < -lim) pos[k + j] = -lim
      }
      ramp(T / 1.3, tmp, [C.cyan, C.blue, C.violet, C.warm])
      col[k] = tmp.r; col[k + 1] = tmp.g; col[k + 2] = tmp.b
    }
    pts.current.geometry.attributes.position.needsUpdate = true
    pts.current.geometry.attributes.color.needsUpdate = true
    for (let i = 0; i < nano; i++) {
      const k = i * 3
      const T = temp(np[k], np[k + 1], np[k + 2])
      np[k] += (0.35 * T * dt) + gauss() * 0.9 * Math.sqrt(dt) * 0.3 // thermophoretic drift toward the cold side + Brownian motion
      np[k + 1] += gauss() * 0.27 * Math.sqrt(dt)
      np[k + 2] += gauss() * 0.27 * Math.sqrt(dt)
      if (np[k] > spread) np[k] = -spread
      np[k + 1] = Math.max(-1.4, Math.min(1.4, np[k + 1]))
      np[k + 2] = Math.max(-1.4, Math.min(1.4, np[k + 2]))
      o.position.set(np[k], np[k + 1], np[k + 2])
      o.updateMatrix()
      inst.current.setMatrixAt(i, o.matrix)
    }
    inst.current.instanceMatrix.needsUpdate = true
  })
  const onMove = (e: ThreeEvent<PointerEvent>) => hot.current.set(e.point.x, e.point.y, 0)
  return (
    <group>
      <points ref={pts} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
        </bufferGeometry>
        {pointMat(0.035, 0.75)}
      </points>
      <instancedMesh ref={inst} args={[undefined, undefined, nano]} frustumCulled={false}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#ffffff" emissive="#46D9FF" emissiveIntensity={0.6} metalness={0.4} roughness={0.25} />
      </instancedMesh>
      <mesh onPointerMove={onMove} onPointerOut={() => hot.current.set(-99, 0, 0)}>
        <planeGeometry args={[spread * 2, 3.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(spread * 2, 3.2, 3.2)]} />
        <lineBasicMaterial color="#4263EB" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

/* ---------- 4. Magnetic dipole field lines + gyrating charges ---------- */
export function MhdViz({ count = 160, tiltWithPointer = true }: { count?: number; tiltWithPointer?: boolean }) {
  const grp = useRef<THREE.Group>(null!)
  const pts = useRef<THREE.Points>(null!)
  const S = 1.15
  const lines = useMemo(() => {
    const v: number[] = []
    for (let p = 0; p < 8; p++) {
      const phi = (p / 8) * Math.PI * 2
      for (const L of [1.1, 1.7, 2.4]) {
        let prev: number[] | null = null
        for (let k = 0; k <= 40; k++) {
          const th = 0.28 + (k / 40) * (Math.PI - 0.56)
          const r = L * Math.sin(th) ** 2
          const cur = [r * Math.sin(th) * Math.cos(phi) * S, r * Math.cos(th) * S, r * Math.sin(th) * Math.sin(phi) * S]
          if (prev) v.push(...prev, ...cur)
          prev = cur
        }
      }
    }
    return new Float32Array(v)
  }, [])
  const st = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        phi: Math.random() * Math.PI * 2,
        L: 1.1 + Math.random() * 1.4,
        th: 0.5 + Math.random() * 2,
        dir: Math.random() < 0.5 ? 1 : -1,
        g: Math.random() * 6.28,
      })),
    [count],
  )
  const { pos, col } = useMemo(() => {
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const c = Math.random() < 0.5 ? C.cyan : C.violet
      col.set([c.r, c.g, c.b], i * 3)
    }
    return { pos: new Float32Array(count * 3), col }
  }, [count])
  useFrame((s, d) => {
    const dt = clampDt(d)
    for (let i = 0; i < count; i++) {
      const q = st[i]
      q.th += q.dir * dt * 0.9
      if (q.th > Math.PI - 0.35) { q.th = Math.PI - 0.35; q.dir = -1 }
      if (q.th < 0.35) { q.th = 0.35; q.dir = 1 }
      q.g += dt * 14
      const r = q.L * Math.sin(q.th) ** 2
      const bx = r * Math.sin(q.th) * Math.cos(q.phi) * S, by = r * Math.cos(q.th) * S, bz = r * Math.sin(q.th) * Math.sin(q.phi) * S
      const rho = 0.06 + 0.04 * Math.sin(q.th)
      const n1x = -Math.sin(q.phi), n1z = Math.cos(q.phi)
      const bl = Math.hypot(bx, by, bz) || 1
      const cg = Math.cos(q.g) * rho, sg = Math.sin(q.g) * rho
      pos[i * 3] = bx + n1x * cg + (bx / bl) * sg
      pos[i * 3 + 1] = by + (by / bl) * sg
      pos[i * 3 + 2] = bz + n1z * cg + (bz / bl) * sg
    }
    pts.current.geometry.attributes.position.needsUpdate = true
    const tx = tiltWithPointer ? s.pointer.y * 0.8 : 0
    const tz = tiltWithPointer ? -s.pointer.x * 0.8 : 0
    grp.current.rotation.x += (tx - grp.current.rotation.x) * 0.06
    grp.current.rotation.z += (tz - grp.current.rotation.z) * 0.06
    grp.current.rotation.y += dt * 0.25
  })
  return (
    <group ref={grp}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#7957FF" transparent opacity={0.45} />
      </lineSegments>
      <mesh>
        <capsuleGeometry args={[0.13, 0.5, 6, 14]} />
        <meshStandardMaterial color="#cfd6ea" metalness={0.6} roughness={0.3} emissive="#4263EB" emissiveIntensity={0.3} />
      </mesh>
      <points ref={pts} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
        </bufferGeometry>
        {pointMat(0.06)}
      </points>
    </group>
  )
}

/* ---------- 5. Lorenz attractor ---------- */
export function AttractorViz({ trails = 3, length = 420, interactive = false, onRho }: { trails?: number; length?: number; interactive?: boolean; onRho?: (r: number) => void }) {
  const grp = useRef<THREE.Group>(null!)
  const lastRho = useRef(0)
  const data = useMemo(
    () =>
      Array.from({ length: trails }, (_, i) => {
        const buf = new Float32Array(length * 3)
        const col = new Float32Array(length * 3)
        const st = [1 + i * 0.01, 1, 1 + i * 0.5 + 15]
        const color = [C.cyan, C.violet, C.blue][i % 3]
        for (let k = 0; k < length; k++) {
          const f = k / length
          col.set([color.r * f, color.g * f, color.b * f], k * 3)
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(buf, 3))
        g.setAttribute('color', new THREE.BufferAttribute(col, 3))
        const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
        const obj = new THREE.Line(g, mat)
        obj.frustumCulled = false
        return { buf, g, st, obj }
      }),
    [trails, length],
  )
  useFrame((s) => {
    const rho = interactive ? 14 + ((s.pointer.x + 1) / 2) * 30 : 28
    if (interactive && onRho && Math.abs(rho - lastRho.current) > 0.5) { lastRho.current = rho; onRho(Math.round(rho)) }
    const sig = 10, beta = 8 / 3, h = 0.0055
    const f = (x: number, y: number, z: number): [number, number, number] => [sig * (y - x), x * (rho - z) - y, x * y - beta * z]
    for (const t of data) {
      for (let n = 0; n < 5; n++) {
        let [x, y, z] = t.st
        const k1 = f(x, y, z)
        const k2 = f(x + (h / 2) * k1[0], y + (h / 2) * k1[1], z + (h / 2) * k1[2])
        const k3 = f(x + (h / 2) * k2[0], y + (h / 2) * k2[1], z + (h / 2) * k2[2])
        const k4 = f(x + h * k3[0], y + h * k3[1], z + h * k3[2])
        x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])
        y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])
        z += (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2])
        t.st = [x, y, z]
      }
      t.buf.copyWithin(0, 3)
      const e = (length - 1) * 3
      t.buf[e] = t.st[0] * 0.085
      t.buf[e + 1] = (t.st[2] - 25) * 0.085
      t.buf[e + 2] = t.st[1] * 0.085
      t.g.attributes.position.needsUpdate = true
    }
    grp.current.rotation.y += 0.0035
  })
  return (
    <group ref={grp}>
      {data.map((t, i) => <primitive key={i} object={t.obj} />)}
    </group>
  )
}

/* ---------- 6. Fractional calculus: Caputo derivative of f(t)=t ---------- */
function gamma(z: number): number {
  const g = 7
  const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  z -= 1
  let x = p[0]
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i)
  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

export function FractionalViz({ curves = 9, points = 70 }: { curves?: number; points?: number }) {
  const grp = useRef<THREE.Group>(null!)
  const objs = useMemo(
    () =>
      Array.from({ length: curves }, () => {
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points * 3), 3))
        const m = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 })
        return new THREE.Line(g, m)
      }),
    [curves, points],
  )
  const tmp = useMemo(() => new THREE.Color(), [])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    objs.forEach((ln, i) => {
      const alpha = Math.min(0.97, Math.max(0.02, (((i / (curves - 1)) + t * 0.05) % 1) * 0.97 + 0.02))
      const p = ln.geometry.attributes.position as THREE.BufferAttribute
      const gm = 1 / gamma(2 - alpha)
      for (let k = 0; k < points; k++) {
        const x = (k / (points - 1)) * 2
        p.setXYZ(k, x * 1.5 - 1.5, Math.pow(x, 1 - alpha) * gm * 1.2 - 0.9, (alpha - 0.5) * 2.2)
      }
      p.needsUpdate = true
      ramp(alpha, tmp, [C.cyan, C.blue, C.violet])
      ;(ln.material as THREE.LineBasicMaterial).color.copy(tmp)
    })
    grp.current.rotation.y = Math.sin(t * 0.3) * 0.5 - 0.4 + s.pointer.x * 0.4
    grp.current.rotation.x = s.pointer.y * -0.25
  })
  return (
    <group ref={grp}>
      {objs.map((o, i) => <primitive key={i} object={o} />)}
      <Axes s={1.7} labels={false} />
    </group>
  )
}

/* ---------- Heat equation on a plate (explicit finite differences) ---------- */
export function HeatViz({ N = 56, size = 4.6 }: { N?: number; size?: number }) {
  const geo = useMemo(() => makeGrid(N, size), [N, size])
  const u = useMemo(() => new Float32Array(N * N), [N])
  const nxt = useMemo(() => new Float32Array(N * N), [N])
  const tmp = useMemo(() => new THREE.Color(), [])
  const pend = useRef<{ r: number; c: number; g: number }[]>([])
  const last = useRef(0)
  const stops = useMemo(() => [C.blue, C.violet, C.warm, C.hot], [])
  const inject = (r: number, c: number, amt: number, rad = 3) => {
    for (let dr = -rad; dr <= rad; dr++)
      for (let dc = -rad; dc <= rad; dc++) {
        const rr = r + dr, cc = c + dc
        if (rr < 1 || cc < 1 || rr >= N - 1 || cc >= N - 1) continue
        u[rr * N + cc] = Math.min(1.4, u[rr * N + cc] + amt * Math.exp(-(dr * dr + dc * dc) / (rad * rad * 0.7)))
      }
  }
  useEffect(() => { inject(N >> 1, N >> 1, 1.2, 4) }, []) // eslint-disable-line
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (t - last.current > 2.2) {
      last.current = t
      inject(6 + Math.floor(Math.random() * (N - 12)), 6 + Math.floor(Math.random() * (N - 12)), 1, 3)
    }
    for (const q of pend.current) inject(q.r, q.c, q.g, 3)
    pend.current = []
    const rr = 0.22 // alpha*dt/dx^2 < 0.25 (stable)
    for (let k = 0; k < 3; k++) {
      for (let r = 1; r < N - 1; r++)
        for (let c = 1; c < N - 1; c++) {
          const i = r * N + c
          nxt[i] = u[i] + rr * (u[i - 1] + u[i + 1] + u[i - N] + u[i + N] - 4 * u[i])
        }
      u.set(nxt)
    }
    const p = geo.attributes.position as THREE.BufferAttribute
    const col = geo.attributes.color as THREE.BufferAttribute
    for (let i = 0; i < N * N; i++) {
      p.setY(i, u[i] * 1.1)
      ramp(u[i] * 0.9, tmp, stops)
      col.setXYZ(i, tmp.r, tmp.g, tmp.b)
    }
    p.needsUpdate = true
    col.needsUpdate = true
  })
  const move = (e: ThreeEvent<PointerEvent>) => {
    const c = Math.round((e.point.x / size + 0.5) * (N - 1))
    const r = Math.round((e.point.z / size + 0.5) * (N - 1))
    pend.current.push({ r, c, g: 0.12 })
  }
  return (
    <group>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo} frustumCulled={false}>
        <meshBasicMaterial color="#080D1B" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={move}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
