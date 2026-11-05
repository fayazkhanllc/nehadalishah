import { Suspense, useState, type ReactNode } from 'react'
import { Canvas, type Props as CanvasProps } from '@react-three/fiber'
import { hasWebGL, useInView } from '../hooks'

const webgl = typeof document !== 'undefined' ? hasWebGL() : false

/** Mounts a WebGL canvas only while near the viewport (keeps GPU contexts and CPU low). */
export function LazyCanvas({ children, className, fallback, ...rest }: { children: ReactNode; className?: string; fallback?: ReactNode } & Partial<CanvasProps>) {
  const [ref, inView] = useInView<HTMLDivElement>('150px')
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%' }}>
      {!webgl || failed ? (
        <div className="noWebgl">{fallback ?? 'Interactive 3D visualization is unavailable on this device (WebGL not supported).'}</div>
      ) : (
        inView && (
          <Canvas
            dpr={[1, 1.6]}
            gl={{ antialias: true, alpha: true }}
            key={attempt}
            onCreated={({ gl }) =>
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault()
                // Retry a couple of times (e.g. GPU pressure), then show the static fallback.
                setAttempt((a) => { if (a >= 2) { setFailed(true); return a } return a + 1 })
              })
            }
            {...rest}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </Canvas>
        )
      )}
    </div>
  )
}
export { webgl }
