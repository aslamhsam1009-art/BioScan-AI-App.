export type ScanType = 'plant' | 'animal' | 'auto';

export type LanguageCode =
  | 'en'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'tr'
  | 'pt'
  | 'it'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko';

export interface CountryInfo {
  code: string;
  name: string;
  nativeName?: string;
  flag: string;
  climateZone: string;
  usdaZones?: string;
  avgTempRange: string;
  localNotes?: string;
}

export type HealthSeverity = 'healthy' | 'low' | 'medium' | 'high' | 'emergency';

export interface HealthDiagnosis {
  isHealthy: boolean;
  problemName?: string;
  severity: HealthSeverity;
  symptomsDetected: string[];
  possibleCauses: string[];
  recommendedNextSteps: string[];
  prevention: string[];
  treatmentInformation: {
    safeOptions: string[];
    medicationsOrProducts?: string[];
    organicAlternatives?: string[];
    vetOrExpertGuidance: string;
  };
  disclaimer: string;
}

export interface MatchCandidate {
  commonName: string;
  scientificName: string;
  confidence: number;
  reason?: string;
  thumbnail?: string;
  type: 'plant' | 'animal';
}

export interface PlantDetail {
  // 1. Identification
  commonName: string;
  scientificName: string;
  englishName: string;
  localNames: string[];
  family: string;
  genus: string;
  confidence: number;

  // 2. Description
  description: string;
  foliageDetails: string;
  structureAndForm: string;

  // 3. Origin and natural habitat
  originAndNaturalHabitat: string;

  // 4. Countries and regions where it grows
  countriesAndRegions: string[];

  // 5. Climate
  climatePreferences: string;

  // 6. Temperature
  temperatureRange: {
    minCelsius: number;
    maxCelsius: number;
    idealCelsius: string;
    frostTolerant: boolean;
  };

  // 7. Humidity
  humidityRequirements: string;

  // 8. Sunlight requirements
  sunlightRequirements: string; // e.g. "Bright indirect light", "Full sun (6+ hours)"

  // 9. Water requirements
  waterRequirements: {
    schedule: string;
    seasonAdjustment: string;
    signsOfOverwatering: string;
    signsOfUnderwatering: string;
  };

  // 10. Soil type
  soilType: string;

  // 11. Soil pH
  soilPh: string; // e.g. "6.0 - 7.0 (Slightly acidic to neutral)"

  // 12. Fertilizer
  fertilizerNeeds: {
    type: string;
    frequency: string;
    ratio: string;
    seasonalNotes: string;
  };

  // 13. Pot and planting requirements
  potAndPlantingRequirements: string;

  // 14. Growth rate
  growthRate: 'Slow' | 'Moderate' | 'Fast';

  // 15. Size
  matureSize: {
    height: string;
    spread: string;
    indoorVsOutdoor: string;
  };

  // 16. Flowering and fruiting
  floweringAndFruiting: {
    bloomingSeason: string;
    flowerColor: string;
    fruitDescription?: string;
  };

  // 17. Propagation
  propagationMethods: string[];

  // 18. Toxicity
  toxicity: {
    toxicToHumans: boolean;
    toxicToDogs: boolean;
    toxicToCats: boolean;
    toxicToHorses: boolean;
    toxicCompounds: string;
    severityLevel: string;
  };

  // 19. Is it edible?
  edibility: {
    isEdible: boolean;
    edibleParts?: string[];
    culinaryUses?: string;
    edibilityWarnings: string;
  };

  // 20. Uses
  uses: string[];

  // 21. Common diseases
  commonDiseases: string[];

  // 22. Pests
  commonPests: string[];

  // 23. Disease diagnosis from photo
  diseaseDiagnosis: HealthDiagnosis;

  // 24. Treatment and care recommendations
  treatmentAndCare: string[];

  // 25. Important warnings
  importantWarnings: string[];
}

export interface AnimalDetail {
  // 1. Identification
  commonName: string;
  species: string;
  breedOrSubspecies: string;
  englishName: string;
  localNames: string[];
  scientificName: string;
  confidence: number;

  // 2. Species and breed details
  speciesAndBreedDetails: string;

  // 3. Scientific name and taxonomy
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
  };

  // 4. Origin & domestication/evolution
  originAndHistory: string;

  // 5. Countries and habitat
  countriesAndHabitat: string[];

  // 6. Size and weight
  sizeAndWeight: {
    maleWeight: string;
    femaleWeight: string;
    heightOrLength: string;
  };

  // 7. Lifespan
  lifespan: {
    wild?: string;
    captivityOrDomestic: string;
  };

  // 8. Diet
  diet: {
    type: 'Herbivore' | 'Carnivore' | 'Omnivore' | 'Insectivore' | 'Frugivore';
    primaryFoods: string[];
    feedingFrequency: string;
  };

  // 9. Safe and dangerous foods
  foodSafety: {
    safeFoods: string[];
    dangerousFoods: string[];
    toxicSubstances: string[];
  };

  // 10. Water requirements
  waterRequirements: string;

  // 11. Temperature tolerance
  temperatureRequirements: {
    minCelsius: number;
    maxCelsius: number;
    idealCelsius: string;
    heatOrColdWarning: string;
  };

  // 12. Humidity requirements
  humidityRequirements: string;

  // 13. Habitat / Enclosure needs
  habitatNeeds: string;

  // 14. Behavior & temperament
  behavior: string;

  // 15. Communication and sounds
  communicationAndSounds: {
    primarySounds: string[];
    bodyLanguage: string[];
  };

  // 16. What different sounds may mean
  soundMeanings: Array<{
    sound: string;
    meaning: string;
    context: string;
  }>;

  // 17. Sleep duration and sleep patterns
  sleepPatterns: {
    durationHoursPerDay: string;
    patternType: 'Diurnal' | 'Nocturnal' | 'Crepuscular' | 'Polyphasic';
    habits: string;
  };

  // 18. Activity periods
  activityPeriods: string;

  // 19. Social behavior
  socialBehavior: string;

  // 20. Reproduction
  reproduction: {
    gestationOrIncubation: string;
    litterOrClutchSize: string;
    breedingNotes: string;
  };

  // 21. Common diseases
  commonDiseases: string[];

  // 22. Symptoms
  symptomsToWatchFor: string[];

  // 23. Health risk level
  healthRiskLevel: HealthSeverity;

  // 24. Possible treatments
  possibleTreatments: string[];

  // 25. Veterinary warning
  veterinaryWarning: string;

  // 26. Toxic substances and dangerous foods
  toxicSubstancesAndDangers: string[];

  // Photo health diagnosis
  diseaseDiagnosis: HealthDiagnosis;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  type: 'plant' | 'animal';
  imageUrl: string;
  confidence: number;
  matches: MatchCandidate[];
  plantData?: PlantDetail;
  animalData?: AnimalDetail;
  countryAdapted?: {
    countryName: string;
    zoneAdvice: string;
    climateSuitability: string;
  };
  userNotes?: string;
  isFavorite?: boolean;
}

export interface CareReminder {
  id: string;
  organismId?: string;
  organismName: string;
  organismType: 'plant' | 'animal';
  actionType: 'watering' | 'fertilizing' | 'medication' | 'vet_checkup' | 'grooming' | 'repotting' | 'custom';
  type?: 'water' | 'fertilize' | 'medication' | 'grooming' | 'vet_check' | 'sunlight_rotation' | 'cleaning';
  title?: string;
  notes?: string;
  frequencyDays: number;
  intervalDays?: number;
  lastCompleted?: number;
  nextDue: number;
  isCompleted: boolean;
  createdAt?: number;
}

export interface ChatMessage {
  id: string;
  role?: 'user' | 'assistant' | 'system';
  sender?: 'user' | 'ai';
  text: string;
  timestamp: number;
  suggestions?: string[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  country: string;
  language: LanguageCode;
  isPremium: boolean;
  scansLeftToday?: number;
  totalScans?: number;
  scansCount?: number;
  savedCount?: number;
  activeRemindersCount?: number;
  savedPlants?: string[];
  savedAnimals?: string[];
}
