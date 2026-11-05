export type Topic =
  | 'Nanofluids'
  | 'Heat Transfer'
  | 'MHD'
  | 'Fractional Calculus'
  | 'Fluid Dynamics'
  | 'Numerical Methods'

export interface Publication {
  id: number
  title: string
  authors?: string // omitted when not supplied — never fabricated
  venue: string
  venueType: 'Journal' | 'Publisher'
  year: number
  citations: number
  topics: Topic[]
  doi?: string // add only when verified
  url?: string // add only when verified
}

// Topic tags are editorial groupings derived from each title, used for filtering.
export const topics: Topic[] = [
  'Nanofluids',
  'Heat Transfer',
  'MHD',
  'Fractional Calculus',
  'Fluid Dynamics',
  'Numerical Methods',
]

export const publications: Publication[] = [
  { id: 1, title: 'Ratio of momentum diffusivity to thermal diffusivity: introduction, meta-analysis, and scrutinization', authors: 'IL Animasaun, NA Shah, A Wakif, B Mahanthesh, R Sivaraj, OK Koriko', venue: 'CRC Press', venueType: 'Publisher', year: 2022, citations: 290, topics: ['Heat Transfer', 'Fluid Dynamics'] },
  { id: 2, title: 'Ternary-hybrid nanofluids: significance of suction and dual-stretching on three-dimensional flow of water conveying nanoparticles with various shapes and densities', authors: 'T Elnaqeeb, IL Animasaun, NA Shah', venue: 'Zeitschrift für Naturforschung A', venueType: 'Journal', year: 2021, citations: 247, topics: ['Nanofluids', 'Fluid Dynamics'] },
  { id: 3, title: 'Heat transfer analysis in a second grade fluid over an oscillating vertical plate using fractional Caputo–Fabrizio derivatives', authors: 'NA Shah, I Khan', venue: 'The European Physical Journal C', venueType: 'Journal', year: 2016, citations: 230, topics: ['Fractional Calculus', 'Heat Transfer'] },
  { id: 4, title: 'A comprehensive review on nanofluids: Synthesis, cutting-edge applications, and future prospects', authors: 'HB Bacha, N Ullah, A Hamid, NA Shah', venue: 'International Journal of Thermofluids', venueType: 'Journal', year: 2024, citations: 203, topics: ['Nanofluids', 'Heat Transfer'] },
  { id: 5, title: 'Insight into the motion of water conveying three kinds of nanoparticles shapes on a horizontal surface: significance of thermo-migration and Brownian motion', authors: 'S Saleem, IL Animasaun, SJ Yook, QM Al-Mdallal, NA Shah, M Faisal', venue: 'Surfaces and Interfaces', venueType: 'Journal', year: 2022, citations: 183, topics: ['Nanofluids', 'Fluid Dynamics'] },
  { id: 6, title: 'Scrutinization of the effects of Grashof number on the flow of different fluids driven by convection over various surfaces', authors: 'NA Shah, IL Animasaun, RO Ibraheem, HA Babatunde, N Sandeep, I Pop', venue: 'Journal of Molecular Liquids', venueType: 'Journal', year: 2018, citations: 171, topics: ['Heat Transfer', 'Fluid Dynamics'] },
  { id: 7, title: 'Flow of hybrid CNTs past a rotating sphere subjected to thermal radiation and thermophoretic particle deposition', authors: 'GK Ramesh, JK Madhukesh, NA Shah, SJ Yook', venue: 'Alexandria Engineering Journal', venueType: 'Journal', year: 2023, citations: 164, topics: ['Nanofluids', 'Heat Transfer'] },
  { id: 8, title: 'Towards a new MHD non-homogeneous convective nanofluid flow model for simulating a rotating inclined thin layer of sodium alginate-based Iron oxide exposed to incident solar energy', authors: 'A Dawar, A Wakif, T Thumma, NA Shah', venue: 'International Communications in Heat and Mass Transfer', venueType: 'Journal', year: 2022, citations: 156, topics: ['MHD', 'Nanofluids', 'Heat Transfer'] },
  { id: 9, title: 'Heat and mass transport of differential type fluid with non-integer order time-fractional Caputo derivatives', authors: 'MA Imran, I Khan, M Ahmad, NA Shah, M Nazar', venue: 'Journal of Molecular Liquids', venueType: 'Journal', year: 2017, citations: 152, topics: ['Fractional Calculus', 'Heat Transfer'] },
  { id: 10, title: 'Effects of the fractional order and magnetic field on the blood flow in cylindrical domains', authors: 'NA Shah, D Vieru, C Fetecau', venue: 'Journal of Magnetism and Magnetic Materials', venueType: 'Journal', year: 2016, citations: 140, topics: ['Fractional Calculus', 'MHD'] },
  { id: 11, title: 'Numerical study of bio-convection flow of magneto-cross nanofluid containing gyrotactic microorganisms with activation energy', venue: 'Scientific Reports', venueType: 'Journal', year: 2021, citations: 139, topics: ['MHD', 'Nanofluids', 'Numerical Methods'] },
  { id: 12, title: 'Nonlinear movements of axisymmetric ternary hybrid nanofluids in a thermally radiated expanding or contracting permeable Darcy walls with different shapes and densities', venue: 'International Communications in Heat and Mass Transfer', venueType: 'Journal', year: 2022, citations: 138, topics: ['Nanofluids', 'Heat Transfer'] },
  { id: 13, title: 'Significance of haphazard motion and thermal migration of alumina and copper nanoparticles across the dynamics of water and ethylene glycol on a convectively heated surface', venue: 'Case Studies in Thermal Engineering', venueType: 'Journal', year: 2021, citations: 136, topics: ['Nanofluids', 'Heat Transfer'] },
  { id: 14, title: 'Analytical and numerical investigation of Darcy-Forchheimer flow of a nonlinear-radiative non-Newtonian fluid over a Riga plate with entropy optimization', venue: 'Ain Shams Engineering Journal', venueType: 'Journal', year: 2023, citations: 127, topics: ['Fluid Dynamics', 'Numerical Methods'] },
  { id: 15, title: 'Heat transfers thermodynamic activity of a second-grade ternary nanofluid flow over a vertical plate with Atangana-Baleanu time-fractional integral', venue: 'Alexandria Engineering Journal', venueType: 'Journal', year: 2022, citations: 127, topics: ['Fractional Calculus', 'Nanofluids', 'Heat Transfer'] },
  { id: 16, title: 'Numerical investigation of EMHD nanofluid flows over a convectively heated Riga pattern positioned horizontally in a Darcy-Forchheimer porous medium', venue: 'Waves in Random and Complex Media', venueType: 'Journal', year: 2025, citations: 124, topics: ['MHD', 'Nanofluids', 'Numerical Methods'] },
  { id: 17, title: 'Numerical simulation of a thermally enhanced EMHD flow of a heterogeneous micropolar mixture comprising ethylene glycol, water and copper oxide', venue: 'Case Studies in Thermal Engineering', venueType: 'Journal', year: 2022, citations: 123, topics: ['MHD', 'Heat Transfer', 'Numerical Methods'] },
  { id: 18, title: 'Hall current and morphological effects on MHD micropolar non-Newtonian tri-hybrid nanofluid flow between two parallel surfaces', venue: 'Scientific Reports', venueType: 'Journal', year: 2022, citations: 121, topics: ['MHD', 'Nanofluids'] },
  { id: 19, title: 'Boundary layer flow of MHD generalized Maxwell fluid over an exponentially accelerated infinite vertical surface with slip and Newtonian heating at the boundary', venue: 'Results in Physics', venueType: 'Journal', year: 2018, citations: 121, topics: ['MHD', 'Fluid Dynamics', 'Heat Transfer'] },
  { id: 20, title: 'Ternary hybrid nanofluid flow containing gyrotactic microorganisms over three different geometries with Cattaneo–Christov model', venue: 'Mathematics', venueType: 'Journal', year: 2023, citations: 120, topics: ['Nanofluids', 'Fluid Dynamics'] },
]

/** Search link on Google Scholar — used instead of unverified DOIs. */
export const scholarSearchUrl = (title: string) =>
  `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`
