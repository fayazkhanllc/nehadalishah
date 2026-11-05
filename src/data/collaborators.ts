export interface Collaborator {
  name: string
  affiliation: string
  /** Approximate city-level location of the institution, as supplied. Omitted if no institution was given. */
  place?: { city: string; country: string; lat: number; lon: number }
}

const seoul = { city: 'Seoul', country: 'South Korea', lat: 37.55, lon: 127.07 }

export const collaborators: Collaborator[] = [
  { name: 'Jae Dong Chung', affiliation: 'Sejong University', place: seoul },
  { name: 'Se-Jin Yook', affiliation: 'Hanyang University', place: seoul },
  { name: 'Siva Raju', affiliation: 'Hanyang University', place: seoul },
  { name: 'Bagh Ali', affiliation: 'Hanyang University, South Korea', place: seoul },
  { name: 'Maddina Dinesh Kumar Naidu', affiliation: 'Hanyang University, South Korea', place: seoul },
  { name: 'Sohaib Abdal', affiliation: 'Hanyang University, Seoul', place: seoul },
  { name: 'Abderrahim Wakif', affiliation: 'Hassan II University, Morocco', place: { city: 'Casablanca', country: 'Morocco', lat: 33.57, lon: -7.59 } },
  { name: 'I. L. Animasaun', affiliation: 'Federal University of Technology, Akure', place: { city: 'Akure', country: 'Nigeria', lat: 7.25, lon: 5.2 } },
  { name: 'Tosin Oreyeni', affiliation: 'Osun State University, Nigeria', place: { city: 'Osogbo', country: 'Nigeria', lat: 7.77, lon: 4.56 } },
  { name: 'N. Ameer Ahammad', affiliation: 'University of Tabuk', place: { city: 'Tabuk', country: 'Saudi Arabia', lat: 28.38, lon: 36.57 } },
  { name: 'Ilyas Khan', affiliation: 'Majmaah University', place: { city: 'Al Majmaah', country: 'Saudi Arabia', lat: 25.9, lon: 45.35 } },
  { name: 'Dr. Salman Saleem', affiliation: 'King Khalid University, Saudi Arabia', place: { city: 'Abha', country: 'Saudi Arabia', lat: 18.22, lon: 42.5 } },
  { name: 'Thanaa Elnaqeeb', affiliation: 'Taif University', place: { city: 'Taif', country: 'Saudi Arabia', lat: 21.27, lon: 40.41 } },
  { name: 'Rasool Shah', affiliation: 'Abdul Wali Khan University Mardan, Pakistan', place: { city: 'Mardan', country: 'Pakistan', lat: 34.2, lon: 72.05 } },
  { name: 'Azhar Ali Zafar', affiliation: 'Abdus Salam School of Mathematical Sciences, GC University Lahore', place: { city: 'Lahore', country: 'Pakistan', lat: 31.56, lon: 74.33 } },
  { name: 'Muhammad Imran Asjad', affiliation: 'University of Management and Technology, Lahore', place: { city: 'Lahore', country: 'Pakistan', lat: 31.4, lon: 74.3 } },
  { name: 'Muhammad Shakeel', affiliation: 'University of Aberdeen, UK', place: { city: 'Aberdeen', country: 'United Kingdom', lat: 57.15, lon: -2.1 } },
  { name: 'Prasannakumara', affiliation: 'Davangere University', place: { city: 'Davangere', country: 'India', lat: 14.47, lon: 75.92 } },
  { name: 'Hajar Farhan Ismael', affiliation: 'University of Zakho, Iraq', place: { city: 'Zakho', country: 'Iraq', lat: 37.14, lon: 42.69 } },
  { name: 'Dr. Mamatha S. Upadhya', affiliation: 'Associate Professor (institution not specified in supplied profile)' },
]
