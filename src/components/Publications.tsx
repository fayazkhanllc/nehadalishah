import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink } from 'lucide-react'
import { publications, topics, scholarSearchUrl, type Topic } from '../data/publications'

const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a)
const STEP = 5

export function Publications() {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('all')
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [sort, setSort] = useState<'cit' | 'year'>('cit')
  const [shown, setShown] = useState(10)
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return publications
      .filter((p) => (year === 'all' || p.year === +year) && (topic === 'all' || p.topics.includes(topic)) &&
        (!s || `${p.title} ${p.authors ?? ''} ${p.venue} ${p.year}`.toLowerCase().includes(s)))
      .sort((a, b) => (sort === 'cit' ? b.citations - a.citations : b.year - a.year || b.citations - a.citations))
  }, [q, year, topic, sort])
  const reset = () => setShown(10)
  return (
    <section id="publications">
      <div className="wrap">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Featured Research Publications</p>
          <h2>Selected work, <em>by impact.</em></h2>
          <p className="lead">Twenty featured publications with citation counts as supplied in the researcher’s profile. Author lists are shown only where supplied. “View publication” opens a Google Scholar search for the title, since DOIs have not been verified.</p>
        </motion.div>
        <div className="pub-tools">
          <label className="search">
            <Search size={18} />
            <input type="search" placeholder="Search title, author, journal…" value={q} onChange={(e) => { setQ(e.target.value); reset() }} aria-label="Search publications" />
          </label>
          <select className="sel" value={year} onChange={(e) => { setYear(e.target.value); reset() }} aria-label="Filter by year">
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="sel" value={sort} onChange={(e) => setSort(e.target.value as 'cit' | 'year')} aria-label="Sort publications">
            <option value="cit">Most cited</option>
            <option value="year">Newest</option>
          </select>
        </div>
        <div className="tchips" role="group" aria-label="Filter by research topic">
          {(['all', ...topics] as const).map((t) => (
            <button key={t} className={`tchip ${topic === t ? 'on' : ''}`} aria-pressed={topic === t} onClick={() => { setTopic(t); reset() }}>{t === 'all' ? 'All topics' : t}</button>
          ))}
        </div>
        <p className="note" aria-live="polite" style={{ marginBottom: 14 }}>{list.length} publication{list.length === 1 ? '' : 's'}. Topic tags are editorial groupings based on titles.</p>
        <div className="pubs">
          {list.slice(0, shown).map((p, i) => (
            <motion.article key={p.id} className="pub" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: (i % STEP) * 0.05 }}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{p.title}</h3>
                {p.authors ? <p className="au">{p.authors}</p> : <p className="au miss">Author list not supplied</p>}
                <p className="ve">{p.venue} · {p.venueType}</p>
                <div className="tg">{p.topics.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              <div className="side">
                <div className="cit">{p.citations}<small>Citations</small></div>
                <span className="yr">{p.year}</span>
                {p.doi && <a className="btn ghost sm" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">DOI</a>}
                <a className="btn ghost sm" href={p.url ?? scholarSearchUrl(p.title)} target="_blank" rel="noopener noreferrer">View publication <ExternalLink size={14} /></a>
              </div>
            </motion.article>
          ))}
          {list.length === 0 && <p className="empty">No publications match these filters.</p>}
        </div>
        {list.length > shown && (
          <div className="more"><button className="btn ghost" onClick={() => setShown(shown + 10)}>Show more ({list.length - shown} remaining)</button></div>
        )}
      </div>
    </section>
  )
}
