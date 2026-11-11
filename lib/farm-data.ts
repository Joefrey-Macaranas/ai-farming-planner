export interface FarmProfile {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  latitude: number;
  longitude: number;
  areaSize: number; // in unit
  areaUnit: 'sqm' | 'hectares' | 'acres';
  soilType: 'Loam' | 'Clay' | 'Sandy' | 'Clay Loam' | 'Silt';
  soilPh: number;
  waterSource: 'Deep Well' | 'River/Stream' | 'Rainwater Catchment' | 'Irrigation Canal';
  climateZone: 'Tropical (Wet/Dry)' | 'Subtropical' | 'Highland Tropical' | 'Temperate';
  budgetCurrency: '₱' | '$' | '€';
  createdAt: string;
}

export interface PlantScanResult {
  id: string;
  timestamp: string;
  imageUrl?: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  growthStage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Mature / Ready for Harvest';
  overallHealth: 'Excellent' | 'Good' | 'Moderate Concern' | 'Severe Issue';
  leafCondition: string;
  diseasesDetected: Array<{
    name: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    treatment: string;
  }>;
  pestsDetected: Array<{
    name: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    management: string;
  }>;
  nutrientDeficiencies: Array<{
    nutrient: string;
    symptoms: string;
    remedy: string;
  }>;
  sunlightRequirement: string;
  waterRequirement: string;
  soilRequirement: string;
  recommendedFertilizer: string;
  estimatedMaturity: string;
  expectedHarvestPeriod: string;
  careInstructions: string[];
}

export interface LandBoundaryPoint {
  x: number; // percentage 0-100 on canvas
  y: number; // percentage 0-100 on canvas
  label?: string;
}

export interface LandScanResult {
  id: string;
  timestamp: string;
  imageUrl?: string;
  totalArea: number;
  areaUnit: 'sqm' | 'hectares' | 'acres';
  dimensions: {
    lengthMeters: number;
    widthMeters: number;
  };
  groundSlope: 'Flat (0-2%)' | 'Gentle (3-5%)' | 'Moderate (6-10%)' | 'Steep (>10%)';
  sunlightExposure: 'Full Sun (8+ hrs)' | 'Partial Sun (5-7 hrs)' | 'Shaded';
  waterAvailability: 'Abundant' | 'Moderate' | 'Limited (Requires Storage)';
  drainageConditions: 'Excellent' | 'Moderate' | 'Poor (Risk of Waterlogging)';
  soilObservations: string;
  recommendedActions: string[];
  disclaimerNote: string;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  category: 'Vegetables' | 'Fruits' | 'Rice & Corn' | 'Herbs & Spices' | 'Root Crops';
  suitabilityScore: number; // 0 - 100
  bestPlantingSeason: string;
  growingDurationDays: number;
  requiredLandAreaSqm: number;
  plantSpacingCm: {
    rowToRow: number;
    plantToPlant: number;
  };
  waterRequirements: 'Low' | 'Moderate' | 'High';
  waterAmountLitersPerDay: number;
  fertilizerRequirements: string;
  estimatedHarvestDate: string;
  potentialChallenges: string[];
  expectedYieldPerSqmKg: number;
  estimatedMarketPricePerKg: number;
  description: string;
  icon: string;
}

export interface FarmZone {
  id: string;
  name: string;
  cropName: string;
  type: 'vegetable' | 'fruit' | 'grain' | 'pathway' | 'irrigation' | 'water_tank' | 'compost' | 'shed';
  x: number; // grid units 0-100%
  y: number;
  width: number;
  height: number;
  color: string;
  plantsCount: number;
  spacingCm: number;
  irrigationType: 'Drip' | 'Micro-sprinkler' | 'Manual Hose' | 'None';
  status: 'Planned' | 'Planted' | 'Growing' | 'Harvesting';
}

export interface CalendarEvent {
  id: string;
  title: string;
  cropName: string;
  date: string; // YYYY-MM-DD
  activityType: 'Land Prep' | 'Seed Sowing' | 'Transplanting' | 'Watering' | 'Fertilizing' | 'Pest Inspection' | 'Pruning' | 'Harvesting';
  status: 'pending' | 'completed' | 'delayed';
  notes: string;
  weatherWarning?: string;
}

export interface HarvestRecord {
  id: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  harvestDate: string;
  plannedYieldKg: number;
  actualYieldKg: number;
  qualityGrade: 'Grade A (Premium)' | 'Grade B' | 'Standard';
  revenueAmount: number;
  notes: string;
  photoUrl?: string;
}

export interface FarmBudget {
  cropName: string;
  areaSqm: number;
  seedsCost: number;
  fertilizerCost: number;
  soilPrepCost: number;
  irrigationCost: number;
  laborCost: number;
  equipmentCost: number;
  transportCost: number;
  harvestPackagingCost: number;
  expectedYieldKg: number;
  marketPricePerKg: number;
}

export interface SensorData {
  soilMoisturePercent: number;
  soilTemperatureC: number;
  soilPh: number;
  airTemperatureC: number;
  waterTankLevelPercent: number;
  lastUpdated: string;
}

export const DEFAULT_FARM_PROFILE: FarmProfile = {
  id: 'farm-001',
  name: 'Verdant Horizon Agro-Farm',
  ownerName: 'Juan Dela Cruz',
  location: 'Laguna, CALABARZON, Philippines',
  latitude: 14.2817,
  longitude: 121.4172,
  areaSize: 1500,
  areaUnit: 'sqm',
  soilType: 'Loam',
  soilPh: 6.5,
  waterSource: 'Deep Well',
  climateZone: 'Tropical (Wet/Dry)',
  budgetCurrency: '₱',
  createdAt: '2026-01-15',
};

export const SAMPLE_RECOMMENDED_CROPS: CropRecommendation[] = [
  {
    id: 'crop-tomato',
    cropName: 'Tomato (Kamatis)',
    category: 'Vegetables',
    suitabilityScore: 94,
    bestPlantingSeason: 'October - February (Dry Cool season)',
    growingDurationDays: 75,
    requiredLandAreaSqm: 250,
    plantSpacingCm: { rowToRow: 75, plantToPlant: 50 },
    waterRequirements: 'Moderate',
    waterAmountLitersPerDay: 4.5,
    fertilizerRequirements: 'Basal Complete 14-14-14, followed by 46-0-0 Urea & Muriate of Potash at flowering',
    estimatedHarvestDate: '75 days from transplant',
    potentialChallenges: ['Bacterial wilt in excessive rain', 'Tomato fruit borer', 'Blossom end rot (calcium deficiency)'],
    expectedYieldPerSqmKg: 3.8,
    estimatedMarketPricePerKg: 65,
    description: 'High-demand fruit vegetable ideal for loamy, well-drained Philippine soil with trellising.',
    icon: '🍅',
  },
  {
    id: 'crop-eggplant',
    cropName: 'Eggplant (Talong)',
    category: 'Vegetables',
    suitabilityScore: 92,
    bestPlantingSeason: 'Year-round (Best: Oct - May)',
    growingDurationDays: 85,
    requiredLandAreaSqm: 300,
    plantSpacingCm: { rowToRow: 100, plantToPlant: 75 },
    waterRequirements: 'Moderate',
    waterAmountLitersPerDay: 5.0,
    fertilizerRequirements: 'Organic compost + Basal 14-14-14, side-dress ammonium sulfate every 2 weeks',
    estimatedHarvestDate: '85 days from transplant',
    potentialChallenges: ['Fruit and shoot borer', 'Phomopsis fruit rot', 'Aphids during dry spells'],
    expectedYieldPerSqmKg: 4.2,
    estimatedMarketPricePerKg: 55,
    description: 'Hardy tropical staple with prolonged harvesting period and high local market liquidity.',
    icon: '🍆',
  },
  {
    id: 'crop-bittergourd',
    cropName: 'Bitter Gourd (Ampalaya)',
    category: 'Vegetables',
    suitabilityScore: 90,
    bestPlantingSeason: 'November - April',
    growingDurationDays: 70,
    requiredLandAreaSqm: 200,
    plantSpacingCm: { rowToRow: 150, plantToPlant: 100 },
    waterRequirements: 'Moderate',
    waterAmountLitersPerDay: 4.0,
    fertilizerRequirements: 'Vermicast + Complete fertilizer at basal, potassium nitrate during vine run',
    estimatedHarvestDate: '60-70 days after planting',
    potentialChallenges: ['Fruit fly attack (needs bagging)', 'Downy mildew during foggy mornings'],
    expectedYieldPerSqmKg: 3.5,
    estimatedMarketPricePerKg: 80,
    description: 'High-value climbing vine crop with consistent premium farmgate price; benefits from overhead trellis.',
    icon: '🥒',
  },
  {
    id: 'crop-corn',
    cropName: 'Sweet Corn (Mais)',
    category: 'Rice & Corn',
    suitabilityScore: 88,
    bestPlantingSeason: 'November - February & May - July',
    growingDurationDays: 72,
    requiredLandAreaSqm: 400,
    plantSpacingCm: { rowToRow: 75, plantToPlant: 25 },
    waterRequirements: 'High',
    waterAmountLitersPerDay: 6.0,
    fertilizerRequirements: '14-14-14 at planting, heavy nitrogen side-dress (Urea) at knee-high and tasseling',
    estimatedHarvestDate: '70-75 days after sowing',
    potentialChallenges: ['Fall armyworm (FAW)', 'Corn earworm', 'Wind lodging during typhoons'],
    expectedYieldPerSqmKg: 2.1,
    estimatedMarketPricePerKg: 45,
    description: 'Fast-growing cereal crop with high biomass production and immediate market absorption.',
    icon: '🌽',
  },
  {
    id: 'crop-chili',
    cropName: 'Bird\'s Eye Chili (Siling Labuyo)',
    category: 'Herbs & Spices',
    suitabilityScore: 95,
    bestPlantingSeason: 'Year-round',
    growingDurationDays: 90,
    requiredLandAreaSqm: 150,
    plantSpacingCm: { rowToRow: 60, plantToPlant: 50 },
    waterRequirements: 'Low',
    waterAmountLitersPerDay: 2.5,
    fertilizerRequirements: 'Rich organic compost + weekly fermented plant juice (FPJ) or 16-16-16',
    estimatedHarvestDate: '90 days, harvests weekly for 1-2 years',
    potentialChallenges: ['Anthracnose fruit rot', 'Mites and thrips', 'Root rot in waterlogged soil'],
    expectedYieldPerSqmKg: 1.8,
    estimatedMarketPricePerKg: 180,
    description: 'Exceptionally profitable spice with perennial picking cycle, drought tolerance, and minimal area needs.',
    icon: '🌶️',
  },
  {
    id: 'crop-papaya',
    cropName: 'Solo Papaya',
    category: 'Fruits',
    suitabilityScore: 86,
    bestPlantingSeason: 'Onset of rainy season or year-round with drip',
    growingDurationDays: 240,
    requiredLandAreaSqm: 350,
    plantSpacingCm: { rowToRow: 250, plantToPlant: 200 },
    waterRequirements: 'Moderate',
    waterAmountLitersPerDay: 8.0,
    fertilizerRequirements: 'Organic manure + balanced NPK + Boron micronutrients to prevent bumpy fruit',
    estimatedHarvestDate: '8-9 months after transplanting',
    potentialChallenges: ['Papaya ringspot virus (PRSV)', 'Phytophthora root rot in standing water'],
    expectedYieldPerSqmKg: 5.5,
    estimatedMarketPricePerKg: 40,
    description: 'Continuous fruiting semi-perennial tree crop offering steady weekly income once bearing.',
    icon: '🍈',
  },
];

export const SAMPLE_FARM_ZONES: FarmZone[] = [
  {
    id: 'zone-1',
    name: 'Bed A - Premium Tomato',
    cropName: 'Tomato (Kamatis)',
    type: 'vegetable',
    x: 5,
    y: 8,
    width: 38,
    height: 38,
    color: '#ef4444',
    plantsCount: 240,
    spacingCm: 60,
    irrigationType: 'Drip',
    status: 'Growing',
  },
  {
    id: 'zone-2',
    name: 'Bed B - Eggplant Block',
    cropName: 'Eggplant (Talong)',
    type: 'vegetable',
    x: 48,
    y: 8,
    width: 38,
    height: 38,
    color: '#8b5cf6',
    plantsCount: 180,
    spacingCm: 75,
    irrigationType: 'Drip',
    status: 'Growing',
  },
  {
    id: 'zone-3',
    name: 'Bed C - High-Value Chili',
    cropName: 'Bird\'s Eye Chili',
    type: 'vegetable',
    x: 5,
    y: 52,
    width: 28,
    height: 38,
    color: '#f97316',
    plantsCount: 160,
    spacingCm: 50,
    irrigationType: 'Drip',
    status: 'Planted',
  },
  {
    id: 'zone-4',
    name: 'Block D - Sweet Corn Strip',
    cropName: 'Sweet Corn (Mais)',
    type: 'grain',
    x: 37,
    y: 52,
    width: 35,
    height: 38,
    color: '#eab308',
    plantsCount: 320,
    spacingCm: 30,
    irrigationType: 'Micro-sprinkler',
    status: 'Planned',
  },
  {
    id: 'zone-5',
    name: 'Solar Pump & Water Tank',
    cropName: '5,000L Rain Storage',
    type: 'water_tank',
    x: 88,
    y: 8,
    width: 9,
    height: 18,
    color: '#0284c7',
    plantsCount: 0,
    spacingCm: 0,
    irrigationType: 'None',
    status: 'Planned',
  },
  {
    id: 'zone-6',
    name: 'Composting & Vermicast Station',
    cropName: 'Organic Waste Recycling',
    type: 'compost',
    x: 88,
    y: 32,
    width: 9,
    height: 25,
    color: '#84cc16',
    plantsCount: 0,
    spacingCm: 0,
    irrigationType: 'None',
    status: 'Planned',
  },
  {
    id: 'zone-7',
    name: 'Tool Shed & Sorting Hub',
    cropName: 'Farm Station',
    type: 'shed',
    x: 88,
    y: 65,
    width: 9,
    height: 25,
    color: '#64748b',
    plantsCount: 0,
    spacingCm: 0,
    irrigationType: 'None',
    status: 'Planned',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Morning Drip Irrigation Cycle (20 mins)',
    cropName: 'All Active Beds',
    date: '2026-11-12',
    activityType: 'Watering',
    status: 'pending',
    notes: 'Run main manifold valve at 06:30 AM before peak solar evapotranspiration.',
  },
  {
    id: 'cal-2',
    title: 'Side-Dress Potassium & Calcium Nitrate',
    cropName: 'Tomato (Kamatis)',
    date: '2026-11-13',
    activityType: 'Fertilizing',
    status: 'pending',
    notes: 'Apply 10g per hill 10cm away from base to support cluster flowering.',
    weatherWarning: 'Check forecast: Low rain risk ensures fertilizer won\'t leach.',
  },
  {
    id: 'cal-3',
    title: 'Scout for Fruit Fly & Shoot Borer',
    cropName: 'Eggplant (Talong)',
    date: '2026-11-14',
    activityType: 'Pest Inspection',
    status: 'pending',
    notes: 'Examine leaf undersides and terminal shoots; replenish yellow sticky traps.',
  },
  {
    id: 'cal-4',
    title: 'Transplant Siling Labuyo Seedlings',
    cropName: 'Bird\'s Eye Chili',
    date: '2026-11-16',
    activityType: 'Transplanting',
    status: 'pending',
    notes: 'Move 30-day seedlings late in the afternoon (4 PM) to avoid transplant shock.',
  },
  {
    id: 'cal-5',
    title: 'Trellis Pruning & Sucker Removal',
    cropName: 'Tomato (Kamatis)',
    date: '2026-11-18',
    activityType: 'Pruning',
    status: 'pending',
    notes: 'Remove lateral suckers below first flower cluster for single-leader vine architecture.',
  },
  {
    id: 'cal-6',
    title: 'Harvest Batch 1 Mature Tomatoes',
    cropName: 'Tomato (Kamatis)',
    date: '2026-11-25',
    activityType: 'Harvesting',
    status: 'pending',
    notes: 'Pick at breaker stage (pink blush) into padded plastic crates early in morning.',
  },
];

export const SAMPLE_HARVEST_LOG: HarvestRecord[] = [
  {
    id: 'harv-1',
    cropName: 'Tomato (Kamatis - Diamante Max)',
    variety: 'Diamante Max F1',
    plantingDate: '2026-08-10',
    harvestDate: '2026-10-28',
    plannedYieldKg: 850,
    actualYieldKg: 920,
    qualityGrade: 'Grade A (Premium)',
    revenueAmount: 59800,
    notes: 'Excellent firm fruit with high brix sweetness. Zero blossom rot with calcium spray.',
  },
  {
    id: 'harv-2',
    cropName: 'Sweet Corn (Mais - Macho F1)',
    variety: 'Macho F1 Sweet Corn',
    plantingDate: '2026-08-01',
    harvestDate: '2026-10-14',
    plannedYieldKg: 700,
    actualYieldKg: 680,
    qualityGrade: 'Grade A (Premium)',
    revenueAmount: 30600,
    notes: 'Sold directly at wholesale agro-market; heavy ears with complete tip filling.',
  },
  {
    id: 'harv-3',
    cropName: 'Bird\'s Eye Chili (Siling Labuyo)',
    variety: 'Red Hot F1',
    plantingDate: '2026-06-15',
    harvestDate: '2026-10-20',
    plannedYieldKg: 120,
    actualYieldKg: 145,
    qualityGrade: 'Grade A (Premium)',
    revenueAmount: 26100,
    notes: 'Harvest #8; vigorous flowering continues after vermitea foliar application.',
  },
];

export const SAMPLE_SENSOR_DATA: SensorData = {
  soilMoisturePercent: 68, // Optimal 60-75%
  soilTemperatureC: 25.4,
  soilPh: 6.6,
  airTemperatureC: 28.2,
  waterTankLevelPercent: 84,
  lastUpdated: 'Just now',
};
