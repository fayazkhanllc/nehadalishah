import { useState } from 'react'
import { motion } from 'framer-motion'
import { publications } from '../data/publications'

const YEARS = Array.from({ length: 10 }, (_, i) => 2016 + i)

export function Timeline() {
  const [y, setY] = useState(2022)
  const items = publications.filter((p) => p.year === y).sort((a, b) => b.citations - a.citations)
  return (
    <section id="timeline" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Research Timeline, 2016–2025</p>
          <h2>A decade of <em>featured contributions.</em></h2>
          <p className="lead">Select a year to see the featured publications from that year. The timeline is built only from the supplied publication years; it does not list degrees, appointments or awards.</p>
        </motion.div>
        <div className="tl-years" role="tablist" aria-label="Publication years">
          {YEARS.map((yr) => {
            const n = publications.filter((p) => p.year === yr).length
            return (
              <button key={yr} role="tab" aria-selected={y === yr} className={`ty ${y === yr ? 'on' : ''} ${n ? '' : 'empty-y'}`} onClick={() => setY(yr)}>
                <b>{yr}</b><small>{n ? `${n} featured` : '—'}</small>
              </button>
            )
          })}
        </div>
        <div className="tl-detail" aria-live="polite">
          <h3>{y}</h3>
          {items.length === 0 && <p className="note">No featured publication from this year in the supplied list.</p>}
          {items.map((p) => (
            <div className="tl-item" key={p.id}>
              <div><small>{p.venue}</small>{p.title}</div>
              <span>{p.citations} citations</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
