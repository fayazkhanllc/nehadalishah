import { lazy, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { collaborators } from '../data/collaborators'
import { LazyCanvas } from './LazyCanvas'
import { useReducedMotion } from '../hooks'
import { ll } from '../scenes/Globe'

const Globe = lazy(() => import('../scenes/Globe'))

export function Collaborations() {
  const reduced = useReducedMotion()
  const [sel, setSel] = useState<string | null>('Seoul')
  const sites = useMemo(() => {
    const m = new Map<string, { key: string; city: string; country: string; lat: number; lon: number }>()
    collaborators.forEach((c) => c.place && !m.has(c.place.city) && m.set(c.place.city, { key: c.place.city, ...c.place }))
    return [...m.values()]
  }, [])
  const here = collaborators.filter((c) => c.place?.city === sel)
  const site = sites.find((s) => s.key === sel)
  return (
    <section id="collaborations">
      <div className="grad-bg" />
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">International Research Collaborations</p>
          <h2>A network spanning <em>{new Set(sites.map((s) => s.country)).size} countries.</em></h2>
          <p className="lead">Drag the globe, or select a marker or name. Arcs radiate from Seoul for visual clarity and do not describe the nature, dates or current status of any collaboration.</p>
        </motion.div>
        <div className="globe-grid">
          <div className="globe-box" aria-label="Interactive globe of collaborator institutions">
            <LazyCanvas camera={{ position: ll(30, 100, 6.2).toArray(), fov: 42 }} fallback="The interactive globe needs WebGL. Use the list to browse collaborators.">
              <Globe sites={sites} selected={sel} onPick={setSel} reduced={reduced} />
            </LazyCanvas>
          </div>
          <aside className="panel" aria-live="polite">
            {site && (
              <>
                <h3>{site.city}</h3>
                <p className="loc">{site.country}</p>
                {here.map((c) => <p key={c.name} style={{ fontSize: '.9rem', marginBottom: 6 }}><b>{c.name}</b> <span style={{ color: 'var(--grey)' }}>— {c.affiliation}</span></p>)}
              </>
            )}
            <div className="clist" role="list">
              {collaborators.map((c) => (
                <button key={c.name} role="listitem" className={`crow ${c.place && sel === c.place.city ? 'on' : ''}`} disabled={!c.place} style={!c.place ? { opacity: 0.6, cursor: 'default' } : undefined} onClick={() => c.place && setSel(c.place.city)}>
                  {c.name}<small>{c.affiliation}</small>
                </button>
              ))}
            </div>
            <p className="disclaimer">Affiliations are as listed in the supplied academic profile. Markers show the approximate city of each institution; collaborators differ in institution and collaboration status. One entry lists no institution and is therefore not placed on the globe.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
