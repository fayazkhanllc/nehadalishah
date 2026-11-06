import { useState } from 'react'
import { motion } from 'framer-motion'
import { OrbitControls } from '@react-three/drei'
import { Waves, Atom, Flame, Magnet, Sigma, Mountain } from 'lucide-react'
import { LazyCanvas } from './LazyCanvas'
import { Axes, FloorGrid, FluidViz, SurfaceViz, NanoViz, MhdViz, AttractorViz, HeatViz } from '../scenes/viz'
import { Tex, useIsMobile, useReducedMotion } from '../hooks'

const MODES = [
  { id: 'surface', label: 'Mathematical surface', icon: Mountain, tex: 'z=\\dfrac{\\sin(2.1r-1.4t)}{2(1+0.45r)}', hint: 'Move the cursor across the surface to perturb it' },
  { id: 'ode', label: 'Differential equations', icon: Sigma, tex: '\\dot x=\\sigma(y-x),\;\\dot y=x(\\rho-z)-y,\;\\dot z=xy-\\beta z', hint: 'Cursor left ↔ right changes ρ (Lorenz system)' },
  { id: 'flow', label: 'Fluid flow', icon: Waves, tex: '\\mathbf{v}=\\mathbf{U}+\\dfrac{a^3}{2r^3}\\left[3(\\mathbf{U}\\!\\cdot\\!\\hat r)\\hat r-\\mathbf{U}\\right]', hint: 'Cursor drags the sphere through potential flow' },
  { id: 'nano', label: 'Nanoparticle motion', icon: Atom, tex: '\\mathbf{J}=-D\\nabla c-D_T c\\nabla T', hint: 'Cursor adds a heat source; particles drift toward the cold side' },
  { id: 'heat', label: 'Heat transfer', icon: Flame, tex: '\\partial_t u=\\alpha\\nabla^2 u', hint: 'Move the cursor over the plate to inject heat' },
  { id: 'mhd', label: 'Magnetic field', icon: Magnet, tex: '\\mathbf{B}\\propto\\dfrac{3(\\mathbf{m}\\!\\cdot\\!\\hat r)\\hat r-\\mathbf{m}}{r^3}', hint: 'Cursor tilts the dipole; charges gyrate along field lines' },
] as const
type Mode = (typeof MODES)[number]['id']

export function Lab() {
  const [mode, setMode] = useState<Mode>('surface')
  const [rho, setRho] = useState(28)
  const low = useIsMobile()
  const reduced = useReducedMotion()
  const m = MODES.find((x) => x.id === mode)!
  return (
    <section id="laboratory">
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Mathematical Laboratory</p>
          <h2>Step inside a <em>mathematical environment.</em></h2>
          <p className="lead">Rotate with drag, zoom with scroll or pinch, and move the cursor to influence each model. These are classical textbook models for illustration — not simulations of, or results from, the published research.</p>
        </motion.div>
        <div className="lab">
          <div className="lab-side" role="tablist" aria-label="Visualizations">
            {MODES.map((x) => (
              <button key={x.id} role="tab" aria-selected={mode === x.id} className={mode === x.id ? 'on' : ''} onClick={() => setMode(x.id)}>
                <x.icon size={17} />{x.label}
              </button>
            ))}
          </div>
          <div className="lab-main">
            <span className="lab-badge">Illustrative model · not published results</span>
            <LazyCanvas camera={{ position: [0, 3, 6.5], fov: 48 }}>
              <color attach="background" args={['#F6F8FD']} />
              <ambientLight intensity={0.6} />
              <pointLight position={[3, 4, 4]} intensity={30} color="#7957FF" />
              <pointLight position={[-4, 2, -3]} intensity={18} color="#46D9FF" />
              <Axes s={mode === 'heat' || mode === 'surface' ? 3 : 2.6} />
              <FloorGrid y={-1.7} size={9} />
              {mode === 'surface' && <SurfaceViz N={low ? 40 : 64} size={5} />}
              {mode === 'ode' && <AttractorViz trails={low ? 3 : 6} length={low ? 380 : 620} interactive onRho={setRho} />}
              {mode === 'flow' && <FluidViz count={low ? 1100 : 2600} follow />}
              {mode === 'nano' && <NanoViz count={low ? 900 : 2200} nano={24} spread={2.6} />}
              {mode === 'heat' && <HeatViz N={low ? 40 : 60} size={5} />}
              {mode === 'mhd' && <MhdViz count={low ? 220 : 520} />}
              <OrbitControls enableDamping enablePan={false} minDistance={3} maxDistance={14} autoRotate={!reduced && mode !== 'ode'} autoRotateSpeed={0.4} />
            </LazyCanvas>
            <div className="lab-hud">
              <div className="lab-eq"><Tex tex={m.tex} />{mode === 'ode' && <span style={{ marginLeft: 14, fontSize: '.8rem' }}>ρ = {rho}</span>}</div>
              <span className="lab-hint">{m.hint}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
