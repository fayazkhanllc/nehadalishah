// All profile data supplied by the researcher. Edit here to update the site.
export const profile = {
  name: 'Dr. Nehad Ali Shah',
  shortName: 'NA Shah',
  identity: 'Mathematician | Researcher | Academic Author',
  heroSubtitle: 'Mathematician & International Researcher',
  heroTagline: 'Advancing Mathematics. Exploring Science. Expanding Knowledge.',
  positioning: 'Exploring the Mathematics Behind Complex Physical Phenomena.',
  statement:
    'Advancing scientific understanding through applied mathematics, fluid mechanics, heat transfer and computational research.',
  affiliation: 'Department of Mechanical Engineering, Sejong University, Seoul, South Korea',
  institutionShort: 'Sejong University, Seoul, South Korea',
  about: [
    'Dr. Nehad Ali Shah is a researcher in applied mathematics and fluid dynamics, affiliated with the Department of Mechanical Engineering at Sejong University, Seoul, South Korea.',
    'His research explores complex fluid-flow phenomena, heat and mass transfer, nanofluids, magnetohydrodynamics and nonlinear mathematical systems.',
    'Through international research collaborations and scholarly publications, his work contributes to the development of mathematical models and scientific understanding of complex physical processes.',
  ],
  interests: [
    'Fluid Dynamics',
    'Applied Mathematics',
    'Nonlinear Dynamical Flow',
    'Neural Networks',
    'Heat Transfer',
    'Nanofluids',
    'Magnetohydrodynamics (MHD)',
    'Fractional Calculus',
    'Mathematical Modelling',
    'Numerical and Analytical Methods',
  ],
  // Links. Only set values that have been verified. `email` is intentionally empty:
  // the verified Sejong address must be supplied by the researcher (never invented).
  links: {
    email: '' as string, // e.g. 'name@sejong.ac.kr' once verified
    scholar: 'https://scholar.google.com/scholar?q=author%3A%22Nehad+Ali+Shah%22',
    institution: 'https://www.sejong.ac.kr/',
    linkedin: '' as string, // add only if verified
  },
  // Optional: set to a form endpoint (e.g. Formspree) so the contact form can deliver.
  contactEndpoint: (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? '',
  portrait: '' as string, // URL of the real photograph when supplied
}

export const metrics = {
  asOf: 'Supplied profile data (Google Scholar figures provided by the researcher)',
  total: { citations: 18502, hIndex: 78, i10Index: 408 },
  since2021: { citations: 17444 },
}
