import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Building2, GraduationCap, Link2, Send, Copy, Download } from 'lucide-react'
import { profile } from '../data/profile'

type F = { name: string; email: string; institution: string; interest: string; message: string }
const empty: F = { name: '', email: '', institution: '', interest: '', message: '' }

function validate(f: F) {
  const e: Partial<Record<keyof F, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.institution.trim().length < 2) e.institution = 'Please enter your institution.'
  if (f.interest.trim().length < 2) e.interest = 'Please enter a research interest.'
  if (f.message.trim().length < 20) e.message = 'Please write at least 20 characters.'
  return e
}

export function Contact() {
  const [f, setF] = useState<F>(empty)
  const [err, setErr] = useState<ReturnType<typeof validate>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed' | 'nobackend'>('idle')
  const text = `Name: ${f.name}\nEmail: ${f.email}\nInstitution: ${f.institution}\nResearch interest: ${f.interest}\n\n${f.message}`
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate(f)
    setErr(e)
    if (Object.keys(e).length) return
    if (!profile.contactEndpoint) { setState('nobackend'); return }
    setState('sending')
    try {
      const r = await fetch(profile.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) })
      if (!r.ok) throw new Error(String(r.status))
      setState('sent'); setF(empty)
    } catch { setState('failed') }
  }
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    a.download = 'research-inquiry.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const field = (k: keyof F, label: string, type = 'text') => (
    <div className={`field ${err[k] ? 'bad' : ''}`}>
      <label htmlFor={`c-${k}`}>{label}</label>
      <input id={`c-${k}`} type={type} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} aria-describedby={err[k] ? `e-${k}` : undefined} autoComplete={k === 'email' ? 'email' : k === 'name' ? 'name' : 'off'} />
      {err[k] && <p className="err" id={`e-${k}`}>{err[k]}</p>}
    </div>
  )
  return (
    <section id="contact">
      <div className="grad-bg" />
      <div className="wrap contact-grid">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">Contact & Academic Collaboration</p>
          <h2>Let’s explore new frontiers in <em>mathematical research.</em></h2>
          <p className="lead">Open to meaningful academic discussions, scientific collaborations and research opportunities.</p>
          <div className="clinks">
            {profile.links.email
              ? <a className="clink" href={`mailto:${profile.links.email}`}><Mail size={20} /><div>{profile.links.email}<small>Institutional email</small></div></a>
              : <div className="clink"><Mail size={20} /><div>Institutional email<small>Verified Sejong University address to be added</small></div></div>}
            <a className="clink" href={profile.links.institution} target="_blank" rel="noopener noreferrer"><Building2 size={20} /><div>Sejong University<small>Institutional website</small></div></a>
            <a className="clink" href={profile.links.scholar} target="_blank" rel="noopener noreferrer"><GraduationCap size={20} /><div>Google Scholar<small>Publications and updated metrics</small></div></a>
            {profile.links.linkedin && <a className="clink" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"><Link2 size={20} /><div>LinkedIn</div></a>}
          </div>
        </motion.div>
        <motion.form className="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} aria-label="Research collaboration inquiry">
          <div className="row2">{field('name', 'Name')}{field('email', 'Email', 'email')}</div>
          <div className="row2">{field('institution', 'Institution')}{field('interest', 'Research interest')}</div>
          <div className={`field ${err.message ? 'bad' : ''}`}>
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" value={f.message} onChange={set('message')} aria-invalid={!!err.message} aria-describedby={err.message ? 'e-message' : undefined} />
            {err.message && <p className="err" id="e-message">{err.message}</p>}
          </div>
          <button className="btn primary" type="submit" disabled={state === 'sending'} style={{ justifySelf: 'start' }}>
            {state === 'sending' ? 'Sending…' : <>Send inquiry <Send size={16} /></>}
          </button>
          <div role="status" aria-live="polite">
            {state === 'sent' && <p className="status ok">Your inquiry was delivered to the form service. Thank you.</p>}
            {state === 'failed' && <p className="status bad">The message could not be delivered. Please try again later or copy it below.</p>}
            {state === 'nobackend' && (
              <div className="status warn">
                <b>Not sent.</b> This site has no delivery service configured yet, so your message has not been delivered to anyone. You can copy or save it to send by email{profile.links.email ? '' : ' once the verified address is available'}.
                <div className="acts">
                  <button type="button" className="btn ghost sm" onClick={() => navigator.clipboard?.writeText(text)}><Copy size={14} /> Copy message</button>
                  <button type="button" className="btn ghost sm" onClick={download}><Download size={14} /> Save as .txt</button>
                  {profile.links.email && <a className="btn ghost sm" href={`mailto:${profile.links.email}?subject=${encodeURIComponent('Research collaboration inquiry')}&body=${encodeURIComponent(text)}`}><Mail size={14} /> Open in email app</a>}
                </div>
              </div>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
