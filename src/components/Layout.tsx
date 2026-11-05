import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { Tex, useReducedMotion } from '../hooks'

export const NAV = [
  ['About', '#about'],
  ['Research', '#research'],
  ['Publications', '#publications'],
  ['Collaborations', '#collaborations'],
  ['Contact', '#contact'],
] as const

export function Loader({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const dur = reduced ? 300 : 2200
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      setP(k)
      if (k < 1) raf = requestAnimationFrame(tick)
      else { setDone(true); setTimeout(onDone, 750) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone, reduced])
  // The equation "writes" itself as progress advances.
  const parts = ['\\nabla\\cdot\\mathbf{u}=0', '\\nabla\\cdot\\mathbf{u}=0,\;\; \\rho\\tfrac{D\\mathbf{u}}{Dt}=-\\nabla p+\\mu\\nabla^{2}\\mathbf{u}', '\\nabla\\cdot\\mathbf{u}=0,\;\; \\rho\\tfrac{D\\mathbf{u}}{Dt}=-\\nabla p+\\mu\\nabla^{2}\\mathbf{u},\;\; {}^{C}\\!D_t^{\\alpha}f']
  const tex = p < 0.3 ? parts[0] : p < 0.65 ? parts[1] : parts[2]
  return (
    <div className={`loader ${done ? 'done' : ''}`} role="status" aria-label="Loading">
      <div className="loader-in">
        <div className="eq"><Tex tex={tex} /></div>
        <div className="pg"><i style={{ width: `${p * 100}%` }} /></div>
        <small>Loading research universe</small>
      </div>
    </div>
  )
}

export function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  const [big, setBig] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0
    const mv = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY
      setBig(!!(e.target as HTMLElement).closest('a,button,.rcard,.crow'))
    }
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18
      if (el.current) el.current.style.transform = `translate(${cx - 17}px,${cy - 17}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', mv)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={el} className={`cursor ${big ? 'big' : ''}`} aria-hidden />
}

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <div className="wrap">
        <a href="#top" className="logo" aria-label="Dr. Nehad Ali Shah — home">NEHAD<span>.</span>ALI SHAH</a>
        <nav aria-label="Primary">
          <ul className={open ? 'open' : ''}>
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} onClick={() => setOpen(false)}>{l}</a></li>
            ))}
          </ul>
        </nav>
        <button className="burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <h4>DR. NEHAD ALI SHAH</h4>
            <p>{profile.identity}</p>
            <p>{profile.institutionShort}</p>
          </div>
          <nav aria-label="Footer">
            {NAV.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          </nav>
        </div>
        <p className="copy">Copyright © 2026 Dr. Nehad Ali Shah. All rights reserved.</p>
      </div>
    </footer>
  )
}
