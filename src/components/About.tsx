import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, ExternalLink, Building2 } from 'lucide-react'
import { profile, metrics } from '../data/profile'
import { publications } from '../data/publications'
import { Counter } from '../hooks'

const fade = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.8 } }

export function About() {
  return (
    <section id="about">
      <div className="grad-bg" />
      <div className="wrap about-grid">
        <motion.div {...fade} className="portrait">
          {profile.portrait ? (
            <img src={profile.portrait} alt={`Portrait of ${profile.name}`} />
          ) : (
            <div className="ph" role="img" aria-label="Portrait placeholder">
              <div><b>NAS</b>Portrait placeholder — photograph to be supplied</div>
            </div>
          )}
        </motion.div>
        <motion.div {...fade} className="about">
          <p className="eyebrow">Academic Profile</p>
          <h2>Exploring the mathematics behind <em>complex physical phenomena.</em></h2>
          {profile.about.map((t) => <p key={t}>{t}</p>)}
          <div className="facts">
            <div className="fact"><small>Academic affiliation</small>{profile.affiliation}</div>
            <div className="fact">
              <small>Institutional email</small>
              {profile.links.email ? <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a> : <>Verified Sejong University address to be added — please use the <a href="#contact" style={{ color: 'var(--cyan)' }}>inquiry form</a> or the university profile.</>}
            </div>
          </div>
          <div className="chips" aria-label="Research interests">{profile.interests.map((i) => <span className="chip" key={i}>{i}</span>)}</div>
          <div className="cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn primary" href={profile.links.scholar} target="_blank" rel="noopener noreferrer"><GraduationCap size={18} /> Google Scholar</a>
            <a className="btn ghost" href={profile.links.institution} target="_blank" rel="noopener noreferrer"><Building2 size={18} /> Sejong University</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const YEARS = Array.from({ length: 10 }, (_, i) => 2016 + i)

export function Impact() {
  const data = YEARS.map((y) => {
    const ps = publications.filter((p) => p.year === y)
    return { y, c: ps.reduce((a, p) => a + p.citations, 0), n: ps.length }
  })
  const max = Math.max(...data.map((d) => d.c))
  const W = 900, H = 340, pl = 50, pr = 24, pt = 30, pb = 44
  const x = (i: number) => pl + (i / (data.length - 1)) * (W - pl - pr)
  const yy = (v: number) => H - pb - (v / (max * 1.1)) * (H - pt - pb)
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${yy(d.c)}`).join(' ')
  const smooth = data.reduce((a, d, i) => {
    if (!i) return `M${x(0)},${yy(d.c)}`
    const px = x(i - 1), py = yy(data[i - 1].c), cx = (px + x(i)) / 2
    return `${a} C${cx},${py} ${cx},${yy(d.c)} ${x(i)},${yy(d.c)}`
  }, '')
  const [hi, setHi] = useState<number | null>(null)
  const total = metrics.total.citations, since = metrics.since2021.citations
  return (
    <section id="impact" style={{ paddingTop: 60 }}>
      <div className="wrap">
        <motion.div {...fade}>
          <p className="eyebrow">Academic Impact</p>
          <h2>Research reach, <em>measured.</em></h2>
          <p className="lead">Figures below are supplied profile data (Google Scholar figures provided by the researcher), not live statistics. <a href={profile.links.scholar} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>See Google Scholar for updated figures <ExternalLink size={13} style={{ verticalAlign: -1 }} /></a></p>
        </motion.div>
        <div className="stat-grid">
          {[
            [metrics.total.citations, 'Total citations'],
            [metrics.since2021.citations, 'Citations since 2021'],
            [metrics.total.hIndex, 'h-index'],
            [metrics.total.i10Index, 'i10-index'],
          ].map(([n, l]) => (
            <motion.div {...fade} className="stat" key={l as string}><b><Counter to={n as number} /></b><span>{l}</span></motion.div>
          ))}
        </div>
        <motion.div {...fade} className="chart-card">
          <div className="chart-head">
            <div><h3 style={{ fontFamily: 'var(--head)', fontWeight: 500 }}>Citations of featured publications, by year published</h3>
              <p className="note" style={{ marginTop: 4 }}>Sum of citation counts of the 20 featured publications below, grouped by publication year. A year-by-year citation history was not supplied.</p></div>
            <div className="legend"><span><i style={{ background: 'var(--cyan)' }} />Citations</span></div>
          </div>
          <div style={{ position: 'relative' }}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Line chart of featured publication citations by publication year" onMouseLeave={() => setHi(null)}>
              <defs>
                <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#46D9FF" stopOpacity=".35" /><stop offset="1" stopColor="#4263EB" stopOpacity="0" /></linearGradient>
                <linearGradient id="ln" x1="0" x2="1"><stop offset="0" stopColor="#4263EB" /><stop offset=".5" stopColor="#7957FF" /><stop offset="1" stopColor="#46D9FF" /></linearGradient>
                <filter id="gl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <g key={t}><line x1={pl} x2={W - pr} y1={yy(max * t)} y2={yy(max * t)} stroke="rgba(167,176,192,.12)" /><text x={pl - 10} y={yy(max * t) + 4} textAnchor="end" fill="#A7B0C0" fontSize="11">{Math.round(max * t)}</text></g>
              ))}
              <path d={`${smooth} L${x(data.length - 1)},${H - pb} L${x(0)},${H - pb} Z`} fill="url(#ar)" />
              <path d={smooth} fill="none" stroke="url(#ln)" strokeWidth="3" filter="url(#gl)" strokeLinecap="round" />
              <path d={path} fill="none" stroke="none" />
              {data.map((d, i) => (
                <g key={d.y} onMouseEnter={() => setHi(i)} onFocus={() => setHi(i)} tabIndex={0} aria-label={`${d.y}: ${d.c} citations across ${d.n} featured publications`}>
                  <rect x={x(i) - 28} y={pt} width="56" height={H - pt - pb} fill="transparent" />
                  {hi === i && <line x1={x(i)} x2={x(i)} y1={pt} y2={H - pb} stroke="rgba(70,217,255,.4)" strokeDasharray="4 4" />}
                  <circle cx={x(i)} cy={yy(d.c)} r={hi === i ? 9 : 5.5} fill="#080D1B" stroke="#46D9FF" strokeWidth="2.5" filter="url(#gl)" style={{ transition: '.2s' }} />
                  <text x={x(i)} y={H - 16} textAnchor="middle" fill={hi === i ? '#fff' : '#A7B0C0'} fontSize="12">{d.y}</text>
                </g>
              ))}
            </svg>
            {hi !== null && (
              <div className="tip" style={{ left: `${(x(hi) / W) * 100}%`, top: `${(yy(data[hi].c) / H) * 100}%` }}>
                <b>{data[hi].c.toLocaleString()}</b>{data[hi].y} · {data[hi].n} featured publication{data[hi].n === 1 ? '' : 's'}
              </div>
            )}
          </div>
          <div className="compare" aria-label="Overall versus since 2021">
            <div className="bar-row"><span>Overall citations</span><div className="bar"><i style={{ width: '100%' }} /></div><span>{total.toLocaleString()}</span></div>
            <div className="bar-row"><span>Since 2021</span><div className="bar"><i style={{ width: `${(since / total) * 100}%`, background: 'linear-gradient(90deg,var(--violet),var(--cyan))' }} /></div><span>{since.toLocaleString()}</span></div>
          </div>
          <p className="note">Since-2021 citations are {((since / total) * 100).toFixed(1)}% of the overall total, calculated from the two supplied figures.</p>
        </motion.div>
      </div>
    </section>
  )
}
void Mail
