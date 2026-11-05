export type VizKind = 'fluid' | 'surface' | 'nano' | 'mhd' | 'attractor' | 'fractional'

export const researchAreas: {
  id: string; title: string; kind: VizKind; tex: string; blurb: string; detail: string
}[] = [
  { id: '01', title: 'Fluid Dynamics', kind: 'fluid', tex: '\\rho\\left(\\partial_t \\mathbf{u}+\\mathbf{u}\\!\\cdot\\!\\nabla\\mathbf{u}\\right)=-\\nabla p+\\mu\\nabla^2\\mathbf{u}',
    blurb: 'Flow past surfaces and bodies.', detail: 'Mathematical modelling of momentum transport, boundary-layer flow and convection over stretching, rotating and vertical surfaces, including non-Newtonian fluids.' },
  { id: '02', title: 'Applied Mathematics', kind: 'surface', tex: 'z=\\sin\\!\\left(\\sqrt{x^2+y^2}\\right)',
    blurb: 'Models, surfaces and structure.', detail: 'Formulating and analysing mathematical models of physical processes using numerical and analytical methods.' },
  { id: '03', title: 'Nanofluids & Heat Transfer', kind: 'nano', tex: 'q=-k\\nabla T',
    blurb: 'Nanoparticles in thermal gradients.', detail: 'Hybrid and ternary-hybrid nanofluids, Brownian motion, thermophoresis and thermal radiation effects on heat and mass transfer.' },
  { id: '04', title: 'Magnetohydrodynamics', kind: 'mhd', tex: '\\mathbf{J}\\times\\mathbf{B}',
    blurb: 'Magnetic fields meet moving fluid.', detail: 'MHD and EMHD flow models, including Hall current, micropolar fluids and porous-medium (Darcy–Forchheimer) configurations.' },
  { id: '05', title: 'Nonlinear Dynamical Systems', kind: 'attractor', tex: '\\dot x=\\sigma(y-x)',
    blurb: 'Trajectories and attractors.', detail: 'Nonlinear flow behaviour and dynamical systems, with neural networks also listed among his research expertise.' },
  { id: '06', title: 'Fractional Calculus', kind: 'fractional', tex: '{}^{C}\\!D_t^{\\alpha}f(t)',
    blurb: 'Non-integer-order operators.', detail: 'Caputo, Caputo–Fabrizio and Atangana–Baleanu fractional derivatives applied to heat, mass and blood-flow models.' },
]
