import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { researchAreas, type VizKind } from '../data/research'
import { LazyCanvas } from './LazyCanvas'
import { FluidViz, SurfaceViz, NanoViz, MhdViz, AttractorViz, FractionalViz } from '../scenes/viz'
import { Tex, useIsMobile } from '../hooks'

function Light({ hover }: { hover: boolean }) {
  const l = useRef<THREE.PointLight>(null!)
  const target = useRef(new THREE.Color())
  useFrame(() => {
    target.current.set(hover ? '#46D9FF' : '#7957FF')
    l.current.color.lerp(target.current, 0.08)
    l.current.intensity += ((hover ? 40 : 14) - l.current.intensity) * 0.08
  })
  return <pointLight ref={l} position={[2, 3, 3]} intensity={14} />
}

function Scene({ kind, hover, low }: { kind: VizKind; hover: boolean; low: boolean }) {
  const k = low ? 0.5 : 1
  return (
    <>
      <ambientLight intensity={0.5} />
      <Light hover={hover} />
      {kind === 'fluid' && <FluidViz count={Math.round(520 * k)} follow />}
      {kind === 'surface' && <SurfaceViz N={low ? 30 : 38} size={4} />}
      {kind === 'nano' && <NanoViz count={Math.round(420 * k)} nano={9} spread={2.4} />}
      {kind === 'mhd' && <MhdViz count={Math.round(110 * k)} />}
      {kind === 'attractor' && <AttractorViz trails={3} length={Math.round(300 * k) + 60} />}
      {kind === 'fractional' && <FractionalViz />}
    </>
  )
}

const cams: Record<VizKind, [number, number, number]> = {
  fluid: [0, 0.6, 6], surface: [0, 3.2, 4.6], nano: [0, 0, 6.4], mhd: [0, 1.2, 6.2], attractor: [0, 0, 5.6], fractional: [0, 0.4, 5],
}

export function Research() {
  const [open, setOpen] = useState<string | null>(null)
  const [hov, setHov] = useState<string | null>(null)
  const low = useIsMobile()
  return (
    <section id="research">
      <div className="grad-bg" />
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Research Areas</p>
          <h2>An interactive <em>scientific universe.</em></h2>
          <p className="lead">Six research areas, each with an illustrative visualization of the underlying mathematics. Hover or focus a card, and move the cursor over the scene.</p>
        </motion.div>
        <div className="cards">
          {researchAreas.map((a, i) => (
            <motion.article
              key={a.id}
              className={`rcard ${open === a.id ? 'open' : ''}`}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
              onMouseEnter={() => setHov(a.id)} onMouseLeave={() => setHov(null)}
              onClick={() => setOpen(open === a.id ? null : a.id)}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen(open === a.id ? null : a.id))}
              aria-label={`${a.title}. ${a.blurb}`}
            >
              <div className="rviz" aria-hidden>
                <LazyCanvas camera={{ position: cams[a.kind], fov: 45 }}>
                  <Scene kind={a.kind} hover={hov === a.id} low={low} />
                </LazyCanvas>
              </div>
              <div className="rbody">
                <span className="rnum">{a.id}</span>
                <h3>{a.title}</h3>
                <p>{a.blurb}</p>
                <div className="rdetail"><p>{a.detail}</p><div className="rtex"><Tex tex={a.tex} /></div></div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
