import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, BookOpen } from 'lucide-react'
import { profile, metrics } from '../data/profile'
import { collaborators } from '../data/collaborators'
import { Counter, useIsMobile, useReducedMotion } from '../hooks'
import { webgl } from './LazyCanvas'

const HeroScene = lazy(() => import('../scenes/HeroScene'))
const countries = new Set(collaborators.filter((c) => c.place).map((c) => c.place!.country)).size

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!ready || reduced || !root.current) return
    gsap.ticker.lagSmoothing(0) // keep the intro time-based even when the GPU is busy
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-kicker', { y: 20, opacity: 0, duration: 0.8 })
        .from('.hero h1 .line span', { yPercent: 110, duration: 1.2, stagger: 0.12 }, '-=0.5')
        .from('.hero .sub, .hero .tag', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.7')
        .from('.hero .cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.metrics-strip', { y: 80, opacity: 0, duration: 1 }, '-=0.8')
    }, root)
    return () => ctx.revert()
  }, [ready, reduced])
  return (
    <section id="top" className="hero" ref={root} aria-label="Introduction">
      <div className="hero-canvas" aria-hidden>
        {webgl ? (
          <LazyCanvasFree><HeroScene mobile={mobile} reduced={reduced} /></LazyCanvasFree>
        ) : <div className="grad-bg" style={{ background: 'radial-gradient(60% 60% at 70% 40%,rgba(121,87,255,.35),transparent 70%),radial-gradient(50% 50% at 20% 70%,rgba(66,99,235,.3),transparent 70%)' }} />}
      </div>
      <div className="wrap hero-content">
        <p className="hero-kicker">{profile.identity.replace(/ \| /g, '  ·  ')}</p>
        <h1 aria-label={profile.name.toUpperCase()}>
          <span className="line"><span>DR. NEHAD</span></span>
          <span className="line"><span className="accent">ALI SHAH</span></span>
        </h1>
        <p className="sub">{profile.heroSubtitle}</p>
        <p className="tag">“{profile.heroTagline}”</p>
        <div className="cta">
          <a className="btn primary" href="#research">Explore My Research <ArrowRight size={18} /></a>
          <a className="btn ghost" href="#publications"><BookOpen size={18} /> View Publications</a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden>Scroll</div>
      <div className="metrics-strip">
        <div className="wrap">
          <div className="mi"><b><Counter to={metrics.total.citations} suffix="+" /></b><span>Citations</span></div>
          <div className="mi"><b><Counter to={metrics.total.hIndex} /></b><span>h-index</span></div>
          <div className="mi"><b><Counter to={metrics.total.i10Index} /></b><span>i10-index</span></div>
          <div className="mi"><b><Counter to={countries} /> countries</b><span>Global research collaborations</span></div>
        </div>
      </div>
    </section>
  )
}

/** Hero canvas is always mounted (above the fold) so it skips the in-view gate. */
function LazyCanvasFree({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
