import {
  ElementType,
  EnneagramCorrelation,
  GeneKeySphere,
  HolisticTypology,
  HumanDesignProfile,
  JungianArchetype,
  MBTIStack,
  ModalityType,
  PlanetId,
  PlanetPosition,
} from '../types';

export const JUNGIAN_ARCHETYPES: Record<PlanetId, JungianArchetype> = {
  Sun: {
    planetId: 'Sun',
    name: 'The Sun',
    mythicFigure: 'Apollo / Sol Invictus / The Divine Child',
    psychologicalRole: 'The Self & Conscious Center of Individuation',
    shadowExpression: 'Grandiosity, hubristic narcissism, or chronic feeling of invisibility and creative impotence.',
    giftExpression: 'Radiant sovereignty, authentic purpose, generous creative vitality, and conscious self-authorship.',
    individuationTask: 'To differentiate true Self-worth from external adulation and emanate warmth without scorching others.',
    contemplativePrompt: 'What would you dare to embody if you had zero need for external validation?',
  },
  Moon: {
    planetId: 'Moon',
    name: 'The Moon',
    mythicFigure: 'Selene / Artemis / Isis / The Magna Mater',
    psychologicalRole: 'The Anima/Animus & The Somatic Emotional Matrix',
    shadowExpression: 'Emotional regression, infantilism, clinging to codependency, mood volatility, and somatic defense shields.',
    giftExpression: 'Deep empathic resonance, intuitive clairvoyance, psychic containment, and maternal sanctuary.',
    individuationTask: 'To cultivate an internal mother archetype capable of comforting your inner child without defensive retreat.',
    contemplativePrompt: 'Where are you mistaking familiarity and old comfort zones for true emotional safety?',
  },
  Ascendant: {
    planetId: 'Ascendant',
    name: 'The Ascendant',
    mythicFigure: 'Hermes as Guide / Janus / The Threshold Guardian',
    psychologicalRole: 'The Persona & The Gateway of Becoming',
    shadowExpression: 'Total identification with the social mask, leading to alienation from authentic instinctual depths.',
    giftExpression: 'A flexible, artistic instrument of engagement that mediates the inner psyche gracefully into the outer world.',
    individuationTask: 'To treat the Persona as a conscious garment rather than an immutable prison cell.',
    contemplativePrompt: 'Who are you when no one is watching, and what masks drop first in solitude?',
  },
  Mercury: {
    planetId: 'Mercury',
    name: 'Mercury',
    mythicFigure: 'Hermes Trismegistus / Thoth / The Trickster-Alchemist',
    psychologicalRole: 'The Alchemical Mind & Synaptic Messenger',
    shadowExpression: 'Cynical intellectualization, nervous bifurcation, compulsive rationalization, and deceitful rhetoric.',
    giftExpression: 'Synthesizing disparate paradoxes, bridge-building between conscious and unconscious realms, linguistic magic.',
    individuationTask: 'To place the quick intellect in service of the heart rather than using logic to avoid emotional vulnerability.',
    contemplativePrompt: 'What truth are you over-rationalizing to protect yourself from feeling its impact?',
  },
  Venus: {
    planetId: 'Venus',
    name: 'Venus',
    mythicFigure: 'Aphrodite / Hathor / The High Priestess of Beauty',
    psychologicalRole: 'The Aesthetic Heart & Relational Magnetism',
    shadowExpression: 'Co-dependent people-pleasing, vanity, transactional affections, and fear of discordant intimacy.',
    giftExpression: 'Embodied sacred eroticism, artistic discernment, harmonic reconciliation, and unconditional self-value.',
    individuationTask: 'To recognize that true intimacy requires honest boundaries and the courage to endure creative friction.',
    contemplativePrompt: 'What beauty or relational longing have you denied yourself out of fear of rejection?',
  },
  Mars: {
    planetId: 'Mars',
    name: 'Mars',
    mythicFigure: 'Ares / The Sacred Warrior / Iron Will',
    psychologicalRole: 'The Primal Drive & Boundary Assertiveness',
    shadowExpression: 'Passive-aggressive resentment, tyrannical aggression, explosive impulsivity, or paralysis of will.',
    giftExpression: 'Courageous protective agency, pioneering vitality, clarity of desire, and clean sword of discernment.',
    individuationTask: 'To transmute raw instinctual fury into focused, compassionate spiritual heroism.',
    contemplativePrompt: 'What boundary must be decisively drawn today to reclaim your sacred life energy?',
  },
  Jupiter: {
    planetId: 'Jupiter',
    name: 'Jupiter',
    mythicFigure: 'Zeus / The Wise Hierophant / The Great Benefactor',
    psychologicalRole: 'The Sage, Faith Matrix & Horizon Expander',
    shadowExpression: 'Dogmatic fanaticism, ideological inflation, reckless overextension, and spiritual bypassing.',
    giftExpression: 'Cosmic trust, philosophical breadth, magnanimous generosity, and perception of meaningful synchronicity.',
    individuationTask: 'To ground soaring philosophical visions in tangible, patient, humble stewardship.',
    contemplativePrompt: 'Where is an outdated philosophical or religious belief limiting your direct experience of truth?',
  },
  Saturn: {
    planetId: 'Saturn',
    name: 'Saturn',
    mythicFigure: 'Chronos / The Senex / Guardian of the Threshold',
    psychologicalRole: 'The Architect of Reality & Moral Backbone',
    shadowExpression: 'Crippling perfectionism, paralyzing dread of inadequacy, cynical austerity, and emotional petrification.',
    giftExpression: 'Mastery through discipline, crystalline integrity, patient endurance, and elder wisdom.',
    individuationTask: 'To transmute the inner critic from an abusive prosecutor into a devoted master-craftsman mentor.',
    contemplativePrompt: 'What lifelong burden or insecurity holds the exact seed of your greatest masterwork?',
  },
  Chiron: {
    planetId: 'Chiron',
    name: 'Chiron',
    mythicFigure: 'Chiron the Centaur / The Bodhisattva of Pain',
    psychologicalRole: 'The Wounded Healer & Alchemical Fracture',
    shadowExpression: 'Chronic victimhood, toxic martyrdom, or obsession with fixing others while neglecting self.',
    giftExpression: 'Radical compassion born of lived suffering, holistic medicine of the soul, and bridge between mortal and divine.',
    individuationTask: 'To accept that some fractures are not meant to be erased, but to become the sacred aperture of light.',
    contemplativePrompt: 'How can your deepest core vulnerability become your most healing gift to the collective?',
  },
  Uranus: {
    planetId: 'Uranus',
    name: 'Uranus',
    mythicFigure: 'Prometheus / Ouranos / The Divine Rebel',
    psychologicalRole: 'The Cosmic Awakener & Visionary Maverick',
    shadowExpression: 'Contrarian rebellion for its own sake, disruptive cruelty, emotional detachment, and eccentric alienation.',
    giftExpression: 'Revolutionary quantum leaps, lightning intuition, liberation from cultural conditioning, inventive genius.',
    individuationTask: 'To bring prophetic lightning to earth safely without burning down the human vessel.',
    contemplativePrompt: 'What outdated orthodoxy or social script are you ready to permanently shatter?',
  },
  Neptune: {
    planetId: 'Neptune',
    name: 'Neptune',
    mythicFigure: 'Poseidon / Dionysus / The Ocean of Transcendence',
    psychologicalRole: 'The Mystic Dreamer & The Transpersonal Longing',
    shadowExpression: 'Delusional escapism, victim/savior enmeshment, addictive numbing, and psychic dissolution.',
    giftExpression: 'Luminous artistic surrender, oceanic empathy, transpersonal devotion, and mystical communion with the All.',
    individuationTask: 'To build strong Saturnian vessels to hold the unconditioned waters of divine grace safely.',
    contemplativePrompt: 'Where are you escaping into fantasy rather than sanctifying the sacred reality right in front of you?',
  },
  Pluto: {
    planetId: 'Pluto',
    name: 'Pluto',
    mythicFigure: 'Hades / Persephone / Shiva / The Phoenix',
    psychologicalRole: 'The Lord of Metamorphosis & The Collective Shadow',
    shadowExpression: 'Obsessive power struggles, paranoia, emotional manipulation, and terror of surrender.',
    giftExpression: 'Alchemical death and rebirth, total psychological transparency, shamanic regeneration, unshakeable courage.',
    individuationTask: 'To surrender the ego’s illusion of control and descend willingly into the underworld to retrieve gold.',
    contemplativePrompt: 'What must completely die in you right now so that your true essence can finally resurrect?',
  },
  NorthNode: {
    planetId: 'NorthNode',
    name: 'North Node',
    mythicFigure: 'The Dragon’s Head / The Dharma Compass',
    psychologicalRole: 'The Evolutionary Growth Edge',
    shadowExpression: 'Paralysis at the unfamiliar, yearning for comfort even while feeling stagnant.',
    giftExpression: 'Leaping into conscious developmental uncharted territory, activating dormant spiritual potential.',
    individuationTask: 'To lean fearlessly into the uncomfortable qualities of this sign and house.',
    contemplativePrompt: 'What feels intimidating yet magnetically calls you toward your highest future Self?',
  },
  SouthNode: {
    planetId: 'SouthNode',
    name: 'South Node',
    mythicFigure: 'The Dragon’s Tail / Karmic Reservoir',
    psychologicalRole: 'The Karmic Foundation & Overdeveloped Reflex',
    shadowExpression: 'Regressive complacency, falling back into unconscious default reactions under pressure.',
    giftExpression: 'Innate mastery, effortless baseline skills, and ancestral reservoir of gifts.',
    individuationTask: 'To use past strengths as a spring-board rather than an eternal shelter.',
    contemplativePrompt: 'What habit or role has become too comfortable and is secretly stagnating your soul?',
  },
  Lilith: {
    planetId: 'Lilith',
    name: 'Black Moon Lilith',
    mythicFigure: 'Lilith / Inanna / The Untamed Wild Feminine',
    psychologicalRole: 'The Repressed Instinctual Wildness & Raw Autonomy',
    shadowExpression: 'Destructive rage, chronic sense of exile, weaponized sexuality, or bitter spite.',
    giftExpression: 'Fierce sovereign truth, untamed instinctual wisdom, refusal to compromise one’s sacred soul essence.',
    individuationTask: 'To integrate the exiled wild feminine with reverence and mature self-containment.',
    contemplativePrompt: 'Where were you once shamed or exiled for your authentic passion or raw power?',
  },
  Midheaven: {
    planetId: 'Midheaven',
    name: 'Midheaven (MC)',
    mythicFigure: 'The Summit / The World Tree / Yggdrasil',
    psychologicalRole: 'The Public Calling & Spiritual Legacy',
    shadowExpression: 'Status obsession, hollow careerism, or fear of public visibility.',
    giftExpression: 'Inspiring collective leadership, mastery of contribution, alignment of vocation with soul calling.',
    individuationTask: 'To root high public achievement in deep emotional integrity (IC foundation).',
    contemplativePrompt: 'What enduring gift do you wish to leave upon the collective human tapestry?',
  },
  PartOfFortune: {
    planetId: 'PartOfFortune',
    name: 'Part of Fortune',
    mythicFigure: 'Tyche / Fortuna / The Horn of Plenty',
    psychologicalRole: 'The Harmony of Sun, Moon & Rising in Flow',
    shadowExpression: 'Chasing superficial lucky breaks rather than cultivating internal alignment.',
    giftExpression: 'Spontaneous joy, effortless synchronicity, radiant contentment in the present moment.',
    individuationTask: 'To bring conscious intent, emotional need, and outer presence into effortless unison.',
    contemplativePrompt: 'In what activities do you completely lose track of time and experience pure joy?',
  },
};

// 64 Gene Keys database (Selected mapping based on I-Ching Hexagrams & Zodiac degrees)
const GENE_KEYS_MAP: Record<number, { shadow: string; gift: string; siddhi: string }> = {
  1: { shadow: 'Entropy', gift: 'Freshness', siddhi: 'Beauty' },
  2: { shadow: 'Dislocation', gift: 'Orientation', siddhi: 'Unity' },
  3: { shadow: 'Chaos', gift: 'Innovation', siddhi: 'Innocence' },
  4: { shadow: 'Intolerance', gift: 'Understanding', siddhi: 'Forgiveness' },
  5: { shadow: 'Impatience', gift: 'Patience', siddhi: 'Timelessness' },
  6: { shadow: 'Conflict', gift: 'Diplomacy', siddhi: 'Peace' },
  7: { shadow: 'Division', gift: 'Guidance', siddhi: 'Virtue' },
  8: { shadow: 'Mediocrity', gift: 'Style', siddhi: 'Exquisiteness' },
  9: { shadow: 'Inertia', gift: 'Determination', siddhi: 'Invincibility' },
  10: { shadow: 'Self-Obsession', gift: 'Naturalness', siddhi: 'Being' },
  11: { shadow: 'Obscurity', gift: 'Idealism', siddhi: 'Light' },
  12: { shadow: 'Vanity', gift: 'Discrimination', siddhi: 'Purity' },
  13: { shadow: 'Discord', gift: 'Discernment', siddhi: 'Empathy' },
  14: { shadow: 'Compromise', gift: 'Competence', siddhi: 'Bounteousness' },
  15: { shadow: 'Dullness', gift: 'Magnetism', siddhi: 'Florescence' },
  16: { shadow: 'Indifference', gift: 'Versatility', siddhi: 'Mastery' },
  17: { shadow: 'Opinion', gift: 'Far-Sightedness', siddhi: 'Omniscience' },
  18: { shadow: 'Judgment', gift: 'Integrity', siddhi: 'Perfection' },
  19: { shadow: 'Co-Dependence', gift: 'Sensitivity', siddhi: 'Sacrifice' },
  20: { shadow: 'Superficiality', gift: 'Self-Assurance', siddhi: 'Presence' },
  21: { shadow: 'Control', gift: 'Authority', siddhi: 'Valour' },
  22: { shadow: 'Dishonour', gift: 'Graciousness', siddhi: 'Grace' },
  23: { shadow: 'Complexity', gift: 'Simplicity', siddhi: 'Quintessence' },
  24: { shadow: 'Addiction', gift: 'Invention', siddhi: 'Silence' },
  25: { shadow: 'Constriction', gift: 'Acceptance', siddhi: 'Universal Love' },
  26: { shadow: 'Pride', gift: 'Artfulness', siddhi: 'Invisibility' },
  27: { shadow: 'Selfishness', gift: 'Altruism', siddhi: 'Selflessness' },
  28: { shadow: 'Purposelessness', gift: 'Totality', siddhi: 'Immortality' },
  29: { shadow: 'Half-Heartedness', gift: 'Commitment', siddhi: 'Devotion' },
  30: { shadow: 'Desire', gift: 'Lightness', siddhi: 'Rapture' },
  31: { shadow: 'Arrogance', gift: 'Leadership', siddhi: 'Humility' },
  32: { shadow: 'Failure', gift: 'Preservation', siddhi: 'Veneration' },
  33: { shadow: 'Forgetting', gift: 'Mindfulness', siddhi: 'Revelation' },
  34: { shadow: 'Force', gift: 'Strength', siddhi: 'Majesty' },
  35: { shadow: 'Hunger', gift: 'Adventure', siddhi: 'Boundlessness' },
  36: { shadow: 'Turbulence', gift: 'Humanity', siddhi: 'Compassion' },
  37: { shadow: 'Weakness', gift: 'Equality', siddhi: 'Tenderness' },
  38: { shadow: 'Struggle', gift: 'Perseverance', siddhi: 'Honor' },
  39: { shadow: 'Provocation', gift: 'Dynamism', siddhi: 'Liberation' },
  40: { shadow: 'Exhaustion', gift: 'Resolve', siddhi: 'Will' },
  41: { shadow: 'Fantasy', gift: 'Anticipation', siddhi: 'Emanation' },
  42: { shadow: 'Expectation', gift: 'Detachment', siddhi: 'Celebration' },
  43: { shadow: 'Deafness', gift: 'Insight', siddhi: 'Epiphany' },
  44: { shadow: 'Interference', gift: 'Teamwork', siddhi: 'Synarchy' },
  45: { shadow: 'Dominance', gift: 'Synergy', siddhi: 'Communion' },
  46: { shadow: 'Seriousness', gift: 'Delight', siddhi: 'Ecstasy' },
  47: { shadow: 'Oppression', gift: 'Transmutation', siddhi: 'Transfiguration' },
  48: { shadow: 'Inadequacy', gift: 'Resourcefulness', siddhi: 'Wisdom' },
  49: { shadow: 'Reaction', gift: 'Revolution', siddhi: 'Rebirth' },
  50: { shadow: 'Corruption', gift: 'Equilibrium', siddhi: 'Harmony' },
  51: { shadow: 'Agitation', gift: 'Initiative', siddhi: 'Awakening' },
  52: { shadow: 'Stress', gift: 'Restraint', siddhi: 'Stillness' },
  53: { shadow: 'Immaturity', gift: 'Expansion', siddhi: 'Superabundance' },
  54: { shadow: 'Greed', gift: 'Aspiration', siddhi: 'Ascension' },
  55: { shadow: 'Victimization', gift: 'Freedom', siddhi: 'Emancipation' },
  56: { shadow: 'Distraction', gift: 'Enrichment', siddhi: 'Intoxication' },
  57: { shadow: 'Unease', gift: 'Intuition', siddhi: 'Clarity' },
  58: { shadow: 'Dissatisfaction', gift: 'Vitality', siddhi: 'Bliss' },
  59: { shadow: 'Dishonesty', gift: 'Intimacy', siddhi: 'Transparency' },
  60: { shadow: 'Limitation', gift: 'Realism', siddhi: 'Justice' },
  61: { shadow: 'Psychosis', gift: 'Inspiration', siddhi: 'Sanctity' },
  62: { shadow: 'Intellect', gift: 'Precision', siddhi: 'Impeccability' },
  63: { shadow: 'Doubt', gift: 'Inquiry', siddhi: 'Truth' },
  64: { shadow: 'Confusion', gift: 'Imagination', siddhi: 'Illumination' },
};

function degreeToGeneKey(longitude: number): { gate: number; line: number } {
  const norm = ((longitude % 360) + 360) % 360;
  // 64 gates spanning 360 degrees: 5.625 degrees per gate
  const gateIndex = Math.floor(norm / 5.625);
  // Order of hexagram wheel mapping approx:
  const gateNumber = ((gateIndex * 11 + 41) % 64) + 1;
  const rem = (norm % 5.625) / 5.625;
  const line = Math.floor(rem * 6) + 1;
  return { gate: gateNumber, line };
}

export function calculateHolisticTypology(
  planets: PlanetPosition[],
  ascendant: PlanetPosition,
  midheaven: PlanetPosition,
  elementCounts: Record<ElementType, number>,
  modalityCounts: Record<ModalityType, number>
): HolisticTypology {
  const sun = planets.find((p) => p.id === 'Sun') || planets[0];
  const moon = planets.find((p) => p.id === 'Moon') || planets[1];
  const mars = planets.find((p) => p.id === 'Mars');
  const saturn = planets.find((p) => p.id === 'Saturn');

  // 1. Enneagram synthesis
  let primaryType = 1;
  let wingSuggestion = '9w1';
  let coreFear = 'Being corrupt, evil, or defective';
  let coreDesire = 'To have integrity and be good';
  let name = 'Type 1 • The Moral Reformer';
  let astrologicalResonance = 'Saturnian discernment & Virgo/Capricorn perfectionism';
  let growthDirection = 7;

  // Determine dominant elemental signature
  const maxElement = (Object.keys(elementCounts) as ElementType[]).reduce((a, b) =>
    elementCounts[a] >= elementCounts[b] ? a : b
  );

  if (sun.sign === 'Aries' || (maxElement === 'Fire' && (mars?.sign === 'Scorpio' || mars?.sign === 'Aries'))) {
    primaryType = 8;
    name = 'Type 8 • The Sovereign Challenger';
    wingSuggestion = '8w7 or 8w9';
    coreFear = 'Being controlled, harmed, or violated';
    coreDesire = 'To protect self and stand in sovereign strength';
    astrologicalResonance = 'Martian primal agency and sovereign Pluto resilience';
    growthDirection = 2;
  } else if (sun.sign === 'Taurus' || sun.sign === 'Libra' || maxElement === 'Earth') {
    primaryType = 9;
    name = 'Type 9 • The Peacemaker & Harmonizer';
    wingSuggestion = '9w1 or 9w8';
    coreFear = 'Loss of connection, fragmentation, and conflict';
    coreDesire = 'To achieve inner equilibrium and peace of mind';
    astrologicalResonance = 'Venusian relational harmony and Taurus grounding';
    growthDirection = 3;
  } else if (sun.sign === 'Gemini' || sun.sign === 'Aquarius' || maxElement === 'Air') {
    primaryType = 5;
    name = 'Type 5 • The Conceptual Investigator';
    wingSuggestion = '5w4 or 5w6';
    coreFear = 'Being overwhelmed, helpless, or depleted';
    coreDesire = 'To possess deep mastery, insight, and comprehension';
    astrologicalResonance = 'Mercurial intellect and Promethean Uranian pattern-synthesis';
    growthDirection = 8;
  } else if (sun.sign === 'Cancer' || sun.sign === 'Pisces' || maxElement === 'Water') {
    primaryType = 4;
    name = 'Type 4 • The Individualist & Alchemist';
    wingSuggestion = '4w5 or 4w3';
    coreFear = 'Having no personal significance or unique identity';
    coreDesire = 'To express authentic depth and create sacred beauty from pain';
    astrologicalResonance = 'Lunar emotional sensitivity, Neptune longing, and Chiron depth';
    growthDirection = 1;
  } else if (sun.sign === 'Leo' || sun.house === 10) {
    primaryType = 3;
    name = 'Type 3 • The Radiant Achiever';
    wingSuggestion = '3w2 or 3w4';
    coreFear = 'Being worthless or failing to manifest greatness';
    coreDesire = 'To be valuable, distinguished, and respected for excellence';
    astrologicalResonance = 'Solar radiant visibility and Midheaven achievement';
    growthDirection = 6;
  } else if (sun.sign === 'Sagittarius') {
    primaryType = 7;
    name = 'Type 7 • The Visionary Enthusiast';
    wingSuggestion = '7w8 or 7w6';
    coreFear = 'Being deprived, trapped in emotional pain, or limited';
    coreDesire = 'To maintain freedom, joy, and boundless exploration';
    astrologicalResonance = 'Jupiterian faith, boundless horizons, and optimism';
    growthDirection = 5;
  } else if (saturn?.house === 1 || saturn?.house === 10 || sun.sign === 'Capricorn') {
    primaryType = 6;
    name = 'Type 6 • The Loyal Guardian';
    wingSuggestion = '6w5 or 6w7';
    coreFear = 'Being abandoned, unsupported, or unprepared';
    coreDesire = 'To possess reliable security, certainty, and trusted alliances';
    astrologicalResonance = 'Saturnian prudence and systemic foresight';
    growthDirection = 9;
  }

  const enneagram: EnneagramCorrelation = {
    primaryType,
    name,
    wingSuggestion,
    coreFear,
    coreDesire,
    astrologicalResonance,
    growthDirection,
  };

  // 2. MBTI Cognitive Stack Resonance
  let mbtiType = 'INFJ';
  let mbtiTitle = 'The Mystical Counselor & Systems Visionary';
  let dom = 'Introverted Intuition (Ni)';
  let aux = 'Extraverted Feeling (Fe)';
  let tert = 'Introverted Thinking (Ti)';
  let inf = 'Extraverted Sensing (Se)';
  let cogProfile = 'Synthesizes archetypal patterns beneath visible reality with an empathic human focus.';
  let elementalHarmony = 'Water & Air balance fostering profound symbolic contemplation and emotional resonance.';

  if (maxElement === 'Fire') {
    if (modalityCounts.Cardinal >= modalityCounts.Fixed) {
      mbtiType = 'ENTJ';
      mbtiTitle = 'The Sovereign Strategist & Architect';
      dom = 'Extraverted Thinking (Te)';
      aux = 'Introverted Intuition (Ni)';
      tert = 'Extraverted Sensing (Se)';
      inf = 'Introverted Feeling (Fi)';
      cogProfile = 'Decisive strategic vision, high-agency execution, commanding systemic leadership.';
      elementalHarmony = 'Cardinal Fire & Earth driving structural manifestation.';
    } else {
      mbtiType = 'ENFP';
      mbtiTitle = 'The Inspired Catalyst & Visionary';
      dom = 'Extraverted Intuition (Ne)';
      aux = 'Introverted Feeling (Fi)';
      tert = 'Extraverted Thinking (Te)';
      inf = 'Introverted Sensing (Si)';
      cogProfile = 'Passionate exploration of human potential, rapid associative ideation.';
      elementalHarmony = 'Mutable Fire & Air sparking spontaneous creative breakthroughs.';
    }
  } else if (maxElement === 'Earth') {
    mbtiType = 'INTJ';
    mbtiTitle = 'The Mastermind & Systemic Architect';
    dom = 'Introverted Intuition (Ni)';
    aux = 'Extraverted Thinking (Te)';
    tert = 'Introverted Feeling (Fi)';
    inf = 'Extraverted Sensing (Se)';
    cogProfile = 'Long-range structural architecture, impeccable intellectual rigor, stoic independence.';
    elementalHarmony = 'Earth & Air grounding abstract concepts into physical blueprints.';
  } else if (maxElement === 'Water') {
    mbtiType = 'INFP';
    mbtiTitle = 'The Soulful Healer & Poetic Idealist';
    dom = 'Introverted Feeling (Fi)';
    aux = 'Extraverted Intuition (Ne)';
    tert = 'Introverted Sensing (Si)';
    inf = 'Extraverted Thinking (Te)';
    cogProfile = 'Uncompromising inner moral compass, nuanced poetic expression, deep empathy.';
    elementalHarmony = 'Deep Water & Mutable flow nurturing transpersonal artistry.';
  } else if (maxElement === 'Air') {
    mbtiType = 'INTP';
    mbtiTitle = 'The Metaphysical Logician & Theorist';
    dom = 'Introverted Thinking (Ti)';
    aux = 'Extraverted Intuition (Ne)';
    tert = 'Introverted Sensing (Si)';
    inf = 'Extraverted Feeling (Fe)';
    cogProfile = 'Precision categorization of fundamental universal principles, conceptual elegance.';
    elementalHarmony = 'Pure Air & Fixed/Mutable intellect refining pristine universal models.';
  }

  const mbti: MBTIStack = {
    type: mbtiType,
    title: mbtiTitle,
    dominant: dom,
    auxiliary: aux,
    tertiary: tert,
    inferior: inf,
    cognitiveProfile: cogProfile,
    elementalHarmony,
  };

  // 3. Human Design Matrix
  const solarGateData = degreeToGeneKey(sun.longitude);
  const earthGateData = degreeToGeneKey(sun.longitude + 180);
  const consciousLine = solarGateData.line;
  const unconsciousLine = ((solarGateData.gate * 3 + 2) % 6) + 1;
  const profileStr = `${consciousLine}/${unconsciousLine}`;

  let energyType: 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector' = 'Generator';
  let strategy = 'To respond with visceral gut authority rather than initiating from mental anxiety.';
  let authority = 'Sacral (Internal Gut Yes/No)';
  if (elementCounts.Water >= 4 || moon.sign === 'Cancer' || moon.sign === 'Scorpio') {
    authority = 'Emotional Solar Plexus (Wait for clarity over the emotional wave)';
  } else if (elementCounts.Air >= 4) {
    energyType = 'Projector';
    strategy = 'Wait for recognition and formal invitation before sharing profound guidance.';
    authority = 'Splenic Intuitive Instinct';
  } else if (mars && sun.sign === 'Aries') {
    energyType = 'Manifestor';
    strategy = 'Inform others before taking decisive initiating action to clear resistance.';
    authority = 'Ego / Heart Center';
  }

  const humanDesign: HumanDesignProfile = {
    energyType,
    strategy,
    authority,
    profile: profileStr,
    definition: 'Single Definition • High internal coherence and self-contained cognitive autonomy.',
    incarnationCross: `Right Angle Cross of Consciousness (Gate ${solarGateData.gate}/${earthGateData.gate})`,
    solarGate: solarGateData.gate,
    earthGate: earthGateData.gate,
  };

  // 4. Gene Keys Golden Path
  const makeSphere = (sphereName: string, lon: number): GeneKeySphere => {
    const gk = degreeToGeneKey(lon);
    const data = GENE_KEYS_MAP[gk.gate] || { shadow: 'Doubt', gift: 'Inquiry', siddhi: 'Truth' };
    return {
      sphereName,
      gate: gk.gate,
      line: gk.line,
      shadow: data.shadow,
      gift: data.gift,
      siddhi: data.siddhi,
      archetypeLesson: `Transmuting the shadow of ${data.shadow} into the transcendent gift of ${data.gift}.`,
    };
  };

  const geneKeys = {
    lifesWork: makeSphere("Life's Work (Conscious Sun)", sun.longitude),
    evolution: makeSphere("Evolution (Conscious Earth)", sun.longitude + 180),
    radiance: makeSphere("Radiance (Unconscious Sun)", (sun.longitude + 88) % 360),
    purpose: makeSphere("Purpose (Unconscious Earth)", (sun.longitude + 268) % 360),
  };

  return {
    enneagram,
    mbti,
    humanDesign,
    geneKeys,
  };
}
