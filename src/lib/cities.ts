import { BirthData } from '../types';

export interface CityRecord {
  name: string;
  country: string;
  lat: number;
  lng: number;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours
  region: string;
}

const RAW_CITIES = [
  // North America
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.0060, timezone: -5, region: "North America" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437, timezone: -8, region: "North America" },
  { name: "San Francisco", country: "United States", lat: 37.7749, lng: -122.4194, timezone: -8, region: "North America" },
  { name: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, timezone: -6, region: "North America" },
  { name: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321, timezone: -8, region: "North America" },
  { name: "Austin", country: "United States", lat: 30.2672, lng: -97.7431, timezone: -6, region: "North America" },
  { name: "Boston", country: "United States", lat: 42.3601, lng: -71.0589, timezone: -5, region: "North America" },
  { name: "Miami", country: "United States", lat: 25.7617, lng: -80.1918, timezone: -5, region: "North America" },
  { name: "Denver", country: "United States", lat: 39.7392, lng: -104.9903, timezone: -7, region: "North America" },
  { name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: -5, region: "North America" },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, timezone: -8, region: "North America" },
  { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673, timezone: -5, region: "North America" },
  { name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, timezone: -6, region: "North America" },
  { name: "Honolulu", country: "United States", lat: 21.3069, lng: -157.8583, timezone: -10, region: "North America" },

  // Europe
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: 0, region: "Europe" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, timezone: 1, region: "Europe" },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, timezone: 1, region: "Europe" },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, timezone: 1, region: "Europe" },
  { name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558, timezone: 1, region: "Europe" },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038, timezone: 1, region: "Europe" },
  { name: "Barcelona", country: "Spain", lat: 41.3879, lng: 2.1699, timezone: 1, region: "Europe" },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041, timezone: 1, region: "Europe" },
  { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738, timezone: 1, region: "Europe" },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, timezone: 1, region: "Europe" },
  { name: "Kesswil", country: "Switzerland", lat: 47.5992, lng: 9.3175, timezone: 1, region: "Europe" }, // Carl Jung birth town
  { name: "Ulm", country: "Germany", lat: 48.4011, lng: 9.9876, timezone: 1, region: "Europe" }, // Einstein birth town
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378, timezone: 1, region: "Europe" },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686, timezone: 1, region: "Europe" },
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522, timezone: 1, region: "Europe" },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683, timezone: 1, region: "Europe" },
  { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275, timezone: 2, region: "Europe" },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603, timezone: 0, region: "Europe" },
  { name: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883, timezone: 0, region: "Europe" },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393, timezone: 0, region: "Europe" },

  // Asia & Middle East
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, timezone: 9, region: "Asia" },
  { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681, timezone: 9, region: "Asia" },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780, timezone: 9, region: "Asia" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, timezone: 8, region: "Asia" },
  { name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, timezone: 8, region: "Asia" },
  { name: "Taipei", country: "Taiwan", lat: 25.0330, lng: 121.5654, timezone: 8, region: "Asia" },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, timezone: 7, region: "Asia" },
  { name: "Bali (Denpasar)", country: "Indonesia", lat: -8.6705, lng: 115.2126, timezone: 8, region: "Asia" },
  { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, timezone: 5.5, region: "Asia" },
  { name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090, timezone: 5.5, region: "Asia" },
  { name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, timezone: 4, region: "Middle East" },
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, timezone: 3, region: "Middle East" },
  { name: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137, timezone: 2, region: "Middle East" },

  // South America
  { name: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, timezone: -3, region: "South America" },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, timezone: -3, region: "South America" },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, timezone: -3, region: "South America" },
  { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693, timezone: -4, region: "South America" },
  { name: "Bogota", country: "Colombia", lat: 4.7110, lng: -74.0721, timezone: -5, region: "South America" },
  { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428, timezone: -5, region: "South America" },

  // Oceania
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, timezone: 10, region: "Oceania" },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, timezone: 10, region: "Oceania" },
  { name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633, timezone: 12, region: "Oceania" },

  // Africa
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, timezone: 2, region: "Africa" },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, timezone: 2, region: "Africa" },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, timezone: 2, region: "Africa" },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, timezone: 3, region: "Africa" },
  { name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811, timezone: 1, region: "Africa" },
];

export const CITIES_DATABASE: CityRecord[] = RAW_CITIES.map((c) => ({
  ...c,
  latitude: c.lat,
  longitude: c.lng,
}));

export const HISTORICAL_PRESETS = [
  {
    id: "carl-jung",
    name: "Carl Gustav Jung",
    bio: "Pioneer of Analytical Psychology & Archetypal Self-Discovery",
    birthData: {
      name: "Carl G. Jung",
      birthDate: "1875-07-26",
      birthTime: "19:32",
      city: "Kesswil, Switzerland",
      latitude: 47.5992,
      longitude: 9.3175,
      timezoneOffset: 1,
      houseSystem: "Placidus" as const,
    },
  },
  {
    id: "albert-einstein",
    name: "Albert Einstein",
    bio: "Theoretical Physicist, General Relativity & Cosmic Geometry",
    birthData: {
      name: "Albert Einstein",
      birthDate: "1879-03-14",
      birthTime: "11:30",
      city: "Ulm, Germany",
      latitude: 48.4011,
      longitude: 9.9876,
      timezoneOffset: 1,
      houseSystem: "Placidus" as const,
    },
  },
  {
    id: "frida-kahlo",
    name: "Frida Kahlo",
    bio: "Surrealist Painter of the Inner Psyche & Visceral Pain",
    birthData: {
      name: "Frida Kahlo",
      birthDate: "1907-07-06",
      birthTime: "08:30",
      city: "Coyoacán, Mexico City",
      latitude: 19.3551,
      longitude: -99.1627,
      timezoneOffset: -6,
      houseSystem: "Placidus" as const,
    },
  },
  {
    id: "steve-jobs",
    name: "Steve Jobs",
    bio: "Visionary Innovator, Apple Co-founder, Design Minimalist",
    birthData: {
      name: "Steve Jobs",
      birthDate: "1955-02-24",
      birthTime: "19:15",
      city: "San Francisco, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      timezoneOffset: -8,
      houseSystem: "Placidus" as const,
    },
  },
  {
    id: "nikola-tesla",
    name: "Nikola Tesla",
    bio: "Electromagnetic Visionary, Inventor of Alternating Current & Harmonics",
    birthData: {
      name: "Nikola Tesla",
      birthDate: "1856-07-10",
      birthTime: "00:00",
      city: "Smiljan, Croatia",
      latitude: 44.5639,
      longitude: 15.3197,
      timezoneOffset: 1,
      houseSystem: "Placidus" as const,
    },
  },
];

export const PRESET_CHARTS: BirthData[] = HISTORICAL_PRESETS.map((p) => ({
  id: p.id,
  name: p.birthData.name,
  birthDate: p.birthData.birthDate,
  birthTime: p.birthData.birthTime,
  city: p.birthData.city,
  latitude: p.birthData.latitude,
  longitude: p.birthData.longitude,
  timezoneOffset: p.birthData.timezoneOffset,
  houseSystem: p.birthData.houseSystem,
}));
