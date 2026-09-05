export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';

export type PlanetId =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'Chiron'
  | 'NorthNode'
  | 'SouthNode'
  | 'Lilith'
  | 'Ascendant'
  | 'Midheaven'
  | 'PartOfFortune';

export interface PlanetPosition {
  id: PlanetId;
  name: string;
  glyph: string;
  longitude: number; // 0 to 360 degrees
  sign: ZodiacSign;
  signDegree: number; // 0 to 29
  signMinute: number; // 0 to 59
  signSecond: number; // 0 to 59
  formattedPos: string;
  house: number; // 1 to 12
  isRetrograde: boolean;
  speed: number;
  declination?: number;
  color: string;
}

export type HouseSystem = 'Placidus' | 'WholeSign' | 'Equal';

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: ZodiacSign;
  signDegree: number;
  signMinute: number;
}

export type AspectType =
  | 'Conjunction'
  | 'Sextile'
  | 'Square'
  | 'Trine'
  | 'Opposition'
  | 'Quincunx'
  | 'Quintile'
  | 'BiQuintile';

export interface Aspect {
  planet1: PlanetId;
  planet2: PlanetId;
  type: AspectType;
  angle: number; // target angle (0, 60, 90, 120, 180, etc)
  actualAngle: number;
  orb: number;
  isApplying: boolean;
  nature: 'harmonious' | 'tension' | 'creative' | 'neutral';
  color: string;
  sacredGeometry: string;
}

export interface SacredGeometryPattern {
  id: string;
  type: 'GrandTrine' | 'TSquare' | 'GrandCross' | 'Yod' | 'Kite' | 'MysticRectangle' | 'Stellium';
  name: string;
  planets: PlanetId[];
  element?: ElementType;
  description: string;
  geometricMeaning: string;
  color: string;
}

export interface BirthData {
  id?: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  city: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // in hours offset from UTC (e.g. -5 for EST, +1 for CET)
  houseSystem: HouseSystem;
}

export interface JungianArchetype {
  planetId: PlanetId;
  name: string;
  mythicFigure: string;
  psychologicalRole: string;
  shadowExpression: string;
  giftExpression: string;
  individuationTask: string;
  contemplativePrompt: string;
}

export interface EnneagramCorrelation {
  primaryType: number;
  name: string;
  wingSuggestion: string;
  coreFear: string;
  coreDesire: string;
  astrologicalResonance: string;
  growthDirection: number;
}

export interface MBTIStack {
  type: string;
  title: string;
  dominant: string;
  auxiliary: string;
  tertiary: string;
  inferior: string;
  cognitiveProfile: string;
  elementalHarmony: string;
}

export interface HumanDesignProfile {
  energyType: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
  strategy: string;
  authority: string;
  profile: string; // e.g. "4/6" or "1/3"
  definition: string;
  incarnationCross: string;
  solarGate: number;
  earthGate: number;
}

export interface GeneKeySphere {
  sphereName: string;
  gate: number;
  line: number;
  shadow: string;
  gift: string;
  siddhi: string;
  archetypeLesson: string;
}

export interface HolisticTypology {
  enneagram: EnneagramCorrelation;
  mbti: MBTIStack;
  humanDesign: HumanDesignProfile;
  geneKeys: {
    lifesWork: GeneKeySphere;
    evolution: GeneKeySphere;
    radiance: GeneKeySphere;
    purpose: GeneKeySphere;
  };
}

export interface TransitAspect {
  transitingPlanet: PlanetId;
  natalPlanet: PlanetId;
  aspectType: AspectType;
  orb: number;
  exactDateApprox: string;
  psychologicalWindow: string;
  actionableGuidance: string;
}

export interface FullNatalChart {
  birthData: BirthData;
  calculatedAt: string;
  julianDay: number;
  siderealTimeDegrees: number;
  obliquityDegrees: number;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  angles: {
    ascendant: PlanetPosition;
    midheaven: PlanetPosition;
    descendant: PlanetPosition;
    imumCoeli: PlanetPosition;
  };
  aspects: Aspect[];
  sacredPatterns: SacredGeometryPattern[];
  elementCounts: Record<ElementType, number>;
  modalityCounts: Record<ModalityType, number>;
  typology: HolisticTypology;
}

export interface SavedProfile {
  id: string;
  name: string;
  birthData: BirthData;
  createdAt: string;
  notes?: string;
}

export type AsteroidGroup =
  | 'Apollo'
  | 'Aten'
  | 'Amor'
  | 'Atira'
  | 'Main Belt'
  | 'Potentially Hazardous';

export type SpectralClass =
  | 'C-type (Carbonaceous)'
  | 'S-type (Silicaceous/Stony)'
  | 'M-type (Metallic)'
  | 'B-type (Primitive Carbon)'
  | 'V-type (Basaltic/Vestoid)'
  | 'Q-type (Unweathered Silicate)'
  | 'D-type (Organic-rich)'
  | 'X-type (Complex Metal)'
  | 'L-type'
  | 'E-type';

export interface AsteroidTransitEvent {
  date: string;
  distanceAU: number;
  distanceLunarDistances: number; // 1 LD ≈ 384,400 km
  relativeVelocityKmS: number;
  apparentMagnitude?: number;
  constellation: string;
  sign: ZodiacSign;
  notes: string;
}

export interface AsteroidFact {
  id: string;
  name: string;
  designation: string;
  provisionalDesignation?: string;
  discoveryYear: number;
  discoverer: string;
  group: AsteroidGroup;
  isPotentiallyHazardous: boolean;
  estimatedDiameterMeters: number;
  semiMajorAxisAU: number; // a
  perihelionAU: number; // q
  aphelionAU: number; // Q
  eccentricity: number; // e
  inclinationDeg: number; // i
  orbitalPeriodYears: number;
  orbitalPeriodDays: number;
  spectralType: SpectralClass;
  albedo: number;
  rotationPeriodHours?: number;
  earthMoidAU: number; // Minimum Orbit Intersection Distance
  currentEclipticLongitude: number; // degrees (0-360)
  nextTransit: AsteroidTransitEvent;
  transitHistory: AsteroidTransitEvent[];
  facts: string[];
  explorationMission?: string;
}

export type QuantumJournalState =
  | 'Breakthrough'
  | 'Synchronicity'
  | 'Integration'
  | 'Epiphany'
  | 'Reframing';

export interface QuantumJournalEntry {
  id: string;
  createdAt: string; // ISO string
  entryDate: string; // YYYY-MM-DD
  title: string;
  realization: string; // The intuitive insight
  groundedAction: string; // Tangible step to embody the insight
  asteroidId: string;
  asteroidName: string;
  transitDate: string;
  transitDistanceLD: number;
  asteroidSign?: ZodiacSign;
  planetArchetype: PlanetId;
  archetypeName: string;
  quantumState: QuantumJournalState;
  resonanceScore: number; // 1 to 5
  tags: string[];
}
