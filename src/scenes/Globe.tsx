import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { landDots } from '../data/landDots'

export interface Site { key: string; city: string; country: string; lat: number; lon: number }

const R = 2
export const ll = (lat: number, lon: number, r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180
  const th = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th))
}

function Land() {
  const pos = useMemo(() => {
    const a = new Float32Array(landDots.length * 3)
    landDots.forEach(([la, lo], i) => ll(la, lo, R * 1.003).toArray(a, i * 3))
    return a
  }, [])
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={landDots.length} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.034} color="#9fb2f0" transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Graticule() {
  const geo = useMemo(() => {
    const v: THREE.Vector3[] = []
    for (let lat = -60; lat <= 60; lat += 30) for (let lo = -180; lo < 180; lo += 4) { v.push(ll(lat, lo), ll(lat, lo + 4)) }
    for (let lo = -180; lo < 180; lo += 30) for (let la = -88; la < 88; la += 4) { v.push(ll(la, lo), ll(la + 4, lo)) }
    return new THREE.BufferGeometry().setFromPoints(v)
  }, [])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#4263EB" transparent opacity={0.16} />
    </lineSegments>
  )
}

function Arc({ from, to, selected }: { from: THREE.Vector3; to: THREE.Vector3; selected: boolean }) {
  const { curve, geo } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
    const lift = 1 + Math.min(0.55, from.distanceTo(to) * 0.18)
    mid.normalize().multiplyScalar(R * lift)
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)
    return { curve, geo: new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)) }
  }, [from, to])
  const dot = useRef<THREE.Mesh>(null!)
  const off = useMemo(() => Math.random(), [])
  useFrame((s) => {
    dot.current.position.copy(curve.getPoint((s.clock.elapsedTime * 0.22 + off) % 1))
  })
  return (
    <group>
      <line>
        <primitive object={geo} attach="geometry" />
        <lineBasicMaterial color={selected ? '#46D9FF' : '#7957FF'} transparent opacity={selected ? 0.95 : 0.4} />
      </line>
      <mesh ref={dot}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Marker({ site, active, onPick, home }: { site: Site; active: boolean; onPick: () => void; home?: boolean }) {
  const p = useMemo(() => ll(site.lat, site.lon, R * 1.01), [site])
  const ring = useRef<THREE.Mesh>(null!)
  useFrame((s) => {
    const k = (s.clock.elapsedTime * 0.8) % 1
    ring.current.scale.setScalar(1 + k * 2.2)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (active ? 0.9 : 0.4)
    ring.current.lookAt(0, 0, 0)
  })
  return (
    <group position={p}>
      <mesh ref={ring}>
        <ringGeometry args={[0.04, 0.05, 24]} />
        <meshBasicMaterial color="#46D9FF" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh
        onClick={(e) => { e.stopPropagation(); onPick() }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
        scale={active ? 1.6 : 1}
      >
        <sphereGeometry args={[home ? 0.06 : 0.045, 16, 16]} />
        <meshBasicMaterial color={active ? '#ffffff' : home ? '#7957FF' : '#46D9FF'} />
      </mesh>
    </group>
  )
}

function Scene({ sites, selected, onPick, reduced }: { sites: Site[]; selected: string | null; onPick: (k: string) => void; reduced: boolean }) {
  const home = sites.find((s) => s.key === 'Seoul')!
  const homeV = useMemo(() => ll(home.lat, home.lon, R * 1.01), [home])
  const ctl = useRef<any>(null)
  const { camera } = useThree()
  const arrived = useRef<string | null>(null)
  useFrame(() => {
    if (!selected || arrived.current === selected) return
    const s = sites.find((x) => x.key === selected)
    if (!s) return
    const target = ll(s.lat, s.lon, 6.2)
    camera.position.lerp(target, 0.07)
    ctl.current?.update()
    if (camera.position.distanceTo(target) < 0.05) arrived.current = selected
  })
  return (
    <>
      <ambientLight intensity={0.6} />
      <mesh>
        <sphereGeometry args={[R * 0.995, 64, 64]} />
        <meshBasicMaterial color="#0a1124" />
      </mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshBasicMaterial color="#4263EB" transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <Graticule />
      <Land />
      {sites.filter((s) => s.key !== 'Seoul').map((s) => (
        <Arc key={s.key} from={homeV} to={ll(s.lat, s.lon, R * 1.01)} selected={selected === s.key} />
      ))}
      {sites.map((s) => (
        <Marker key={s.key} site={s} active={selected === s.key} onPick={() => onPick(s.key)} home={s.key === 'Seoul'} />
      ))}
      <OrbitControls ref={ctl} enablePan={false} enableZoom={false} enableDamping autoRotate={!reduced && !selected} autoRotateSpeed={0.5} rotateSpeed={0.6} />
    </>
  )
}

export default Scene
