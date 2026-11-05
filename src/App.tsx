import { useCallback, useState } from 'react'
import { Loader, Cursor, Nav, Footer } from './components/Layout'
import { Hero } from './components/Hero'
import { About, Impact } from './components/About'
import { Research } from './components/Research'
import { Publications } from './components/Publications'
import { Collaborations } from './components/Collaborations'
import { Lab } from './components/Lab'
import { Timeline } from './components/Timeline'
import { Contact } from './components/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Loader onDone={done} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <About />
        <Impact />
        <Research />
        <Publications />
        <Collaborations />
        <Lab />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
