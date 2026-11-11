'use client';

import React, { useState } from 'react';
import {
  Sprout,
  CheckCircle2,
  Calendar,
  Layers,
  Droplets,
  Bug,
  ShieldCheck,
  Scissors,
  ArrowRight,
  Sparkles,
  BookOpen,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { FarmProfile, CropRecommendation, SAMPLE_RECOMMENDED_CROPS } from '@/lib/farm-data';

interface CropPlantingPlannerProps {
  profile: FarmProfile;
  initialCrop?: CropRecommendation | null;
  onAddMilestonesToCalendar?: (cropName: string, events: any[]) => void;
}

export default function CropPlantingPlanner({
  profile,
  initialCrop,
  onAddMilestonesToCalendar,
}: CropPlantingPlannerProps) {
  const [selectedCropName, setSelectedCropName] = useState(
    initialCrop?.cropName || 'Tomato (Kamatis)'
  );

  const availableCrops = [
    'Tomato (Kamatis)',
    'Eggplant (Talong)',
    'Sweet Corn (Mais)',
    'Bird\'s Eye Chili (Siling Labuyo)',
    'Bitter Gourd (Ampalaya)',
    'Lowland Rice (Palay)',
    'Solo Papaya',
  ];

  // Planting Steps Protocol
  const steps = [
    {
      id: 'step-1',
      title: '1. Land & Bed Preparation',
      icon: '🚜',
      summary: `Plow to 20-30cm depth. Form raised beds 1m wide, 20-25cm high to prevent waterlogging on ${profile.soilType} soil.`,
      details: [
        'Perform initial plowing 2 weeks before planting to allow weed seeds to germinate and expose soil pathogens to solarization.',
        'Harrow twice at 7-day intervals to break clods and achieve fine, friable tilth.',
        'Create 30cm wide peripheral drainage furrows between beds to facilitate rapid stormwater evacuation.',
        'Install silver-black reflective plastic mulch or cured rice straw mulch to suppress weed emergence and conserve soil moisture.',
      ],
      timing: 'Day -14 to Day -7 before transplant',
    },
    {
      id: 'step-2',
      title: '2. Soil Conditioning & Basal Fertilizer',
      icon: '🌱',
      summary: `Amend soil with 1-2 kg organic vermicast per linear meter + Basal Complete 14-14-14 at pH ${profile.soilPh}.`,
      details: [
        `Soil pH is currently ${profile.soilPh}. If pH < 5.8, broadcast 100g agricultural lime (CaCO3) per sqm during secondary tilling.`,
        'Incorporate 10-15 metric tons/ha decomposed chicken manure or vermicompost into the upper 15cm bed layer.',
        'Apply basal complete fertilizer (14-14-14) at 10-15g per planting hill, mixing thoroughly with soil to prevent seed/root chemical burn.',
      ],
      timing: 'Day -3 before transplant',
    },
    {
      id: 'step-3',
      title: '3. Seed Selection & Germination',
      icon: '🌾',
      summary: 'Use certified F1 hybrid or heirloom seeds with >85% germination rate. Pre-soak in warm water.',
      details: [
        'Perform floatation test: Discard hollow floating seeds; keep heavy submerged seeds.',
        'Soak seeds in lukewarm water (40°C) with 1 tbsp 3% hydrogen peroxide for 4-6 hours to soften seed coat and sanitize.',
        'Wrap in damp cotton cloth inside a sealed container placed in a warm, dark cupboard for 24-48 hours until radicle tips emerge.',
      ],
      timing: 'Day 0',
    },
    {
      id: 'step-4',
      title: '4. Seedling Nursery Management',
      icon: '🪴',
      summary: 'Sow into 104-hole seedling trays with 1:1 carbonized rice hull (CRH) and vermicast mix.',
      details: [
        'Fill seedling trays with sterilized medium (50% vermicast + 50% carbonized rice hull).',
        'Drop 1 germinated seed per cell at 0.5cm depth; water gently with a fine-rose misting nozzle.',
        'Protect under 50% shade netting with fine nylon mesh to guard against whiteflies, aphids, and heavy raindrops.',
        'Harden seedlings 5-7 days before transplant by gradually increasing direct sun exposure and tapering watering frequency.',
      ],
      timing: 'Day 1 to Day 25 in nursery',
    },
    {
      id: 'step-5',
      title: '5. Field Transplanting & Spacing',
      icon: '📐',
      summary: 'Transplant 25-30 day sturdy seedlings during late afternoon (4 PM) to minimize heat shock.',
      details: [
        'Transplant only vigorous seedlings with 4-5 true leaves and thick, sturdy stems.',
        'Drench seedling tray with bio-fungicide or compost tea 2 hours before pulling to facilitate easy plug release.',
        'Plant in holes spaced 50-75cm apart along the row and 75-100cm between rows.',
        'Firm soil gently around root collar; irrigate immediately with 500ml water per plant.',
      ],
      timing: 'Day 25 to Day 30',
    },
    {
      id: 'step-6',
      title: '6. Fertilizer Application Schedule',
      icon: '🧪',
      summary: 'Stage-specific nutrient delivery: Nitrogen for vegetative vigor, Potassium & Calcium for flowering/fruiting.',
      details: [
        '10-14 Days After Transplant (DAT): Side-dress 5g Urea (46-0-0) or fermented plant juice (FPJ) to stimulate rapid shoot canopy development.',
        '25-30 DAT (Initiation of Flower Buds): Side-dress 10g Complete 14-14-14 + 5g Calcium Nitrate to avert blossom-end rot.',
        '45-50 DAT (Fruit Bulking): Side-dress 10g Muriate of Potash (0-0-60) or fermented fruit juice (FFJ) to maximize fruit brix, size, and shelf-life.',
      ],
      timing: '10 DAT, 30 DAT, and 50 DAT',
    },
    {
      id: 'step-7',
      title: '7. Smart Irrigation Schedule',
      icon: '💧',
      summary: `Deliver 3.5 - 5.0 liters/m²/day via drip lines. Water at 6:30 AM to minimize evaporation.`,
      details: [
        'Run drip lines for 25-30 minutes early morning before peak ambient temperature.',
        'During flowering and fruit set, maintain steady soil moisture (60-70% capacity); avoid sudden drying and flooding cycles which cause fruit cracking.',
        'Inspect soil moisture probe daily at 10cm depth.',
      ],
      timing: 'Daily at 06:30 AM',
    },
    {
      id: 'step-8',
      title: '8. Integrated Pest Management (IPM)',
      icon: '🛡️',
      summary: 'Preventive bio-controls: Neem oil spray, yellow sticky cards, companion planting with marigold.',
      details: [
        'Install 20 yellow sticky traps per hectare to capture flying thrips, aphids, and whiteflies.',
        'Spray cold-pressed organic Neem Oil (5ml/L + 2ml liquid soap) every 7-10 days late afternoon.',
        'Conserve predatory ladybugs, green lacewings, and parasitic wasps.',
      ],
      timing: 'Weekly scouting & preventive application',
    },
    {
      id: 'step-9',
      title: '9. Disease Prevention & Sanitation',
      icon: '🔬',
      summary: 'Prune lower leaves, sterilize tools, apply copper-based bio-fungicide in rainy spells.',
      details: [
        'Strip off lower 20cm of senescent leaves touching the ground to eliminate soil-splash fungal inoculation.',
        'Dip pruning shears in 70% isopropyl alcohol between plants to prevent viral cross-contamination.',
        'Immediately bag and remove any plants displaying mosaic virus or bacterial wilt symptoms.',
      ],
      timing: 'Bi-weekly throughout crop cycle',
    },
    {
      id: 'step-10',
      title: '10. Pruning, Trellising & Harvest',
      icon: '🧺',
      summary: 'Train vines to bamboo trellises, pinch lateral suckers, harvest early morning.',
      details: [
        'Install 2m bamboo A-frame trellis with nylon twine 15 days after transplanting.',
        'Prune lateral suckers below the first flower cluster for single-stem or double-stem vigor.',
        'Harvest fruits at breaker stage (first pink blush) early morning using clean snips with 1cm pedicel attached.',
        'Pack gently into ventilated plastic crates lined with banana leaves; avoid direct sun exposure.',
      ],
      timing: 'Harvest starts 70-80 DAT, continues weekly',
    },
  ];

  const handlePushToCalendar = () => {
    if (!onAddMilestonesToCalendar) return;
    const now = new Date();
    const generatedEvents = [
      {
        id: `gen-cal-${Date.now()}-1`,
        title: `Land Preparation & Tillage - ${selectedCropName}`,
        cropName: selectedCropName,
        date: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0],
        activityType: 'Land Prep',
        status: 'pending',
        notes: `Plow and form 1m raised beds on ${profile.soilType} soil.`,
      },
      {
        id: `gen-cal-${Date.now()}-2`,
        title: `Seed Sowing in Nursery - ${selectedCropName}`,
        cropName: selectedCropName,
        date: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0],
        activityType: 'Seed Sowing',
        status: 'pending',
        notes: 'Sow into 104-hole seedling trays with 1:1 CRH and vermicast.',
      },
      {
        id: `gen-cal-${Date.now()}-3`,
        title: `Field Transplanting - ${selectedCropName}`,
        cropName: selectedCropName,
        date: new Date(now.getTime() + 28 * 86400000).toISOString().split('T')[0],
        activityType: 'Transplanting',
        status: 'pending',
        notes: 'Move hardened seedlings to field beds at 4:00 PM.',
      },
      {
        id: `gen-cal-${Date.now()}-4`,
        title: `Side-Dress Vegetative Fertilizer - ${selectedCropName}`,
        cropName: selectedCropName,
        date: new Date(now.getTime() + 42 * 86400000).toISOString().split('T')[0],
        activityType: 'Fertilizing',
        status: 'pending',
        notes: 'Apply side-dress nitrogen around plant hills.',
      },
      {
        id: `gen-cal-${Date.now()}-5`,
        title: `Expected First Harvest - ${selectedCropName}`,
        cropName: selectedCropName,
        date: new Date(now.getTime() + 75 * 86400000).toISOString().split('T')[0],
        activityType: 'Harvesting',
        status: 'pending',
        notes: 'Harvest premium grade produce into ventilated crates.',
      },
    ];

    onAddMilestonesToCalendar(selectedCropName, generatedEvents);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-md shadow-green-600/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Crop Planting Planner
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                10-phase master agronomic guidelines tailored to your farm&apos;s soil, water, and climate conditions.
              </p>
            </div>
          </div>

          {/* Crop Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCropName}
              onChange={(e) => setSelectedCropName(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900 text-emerald-900 dark:text-white focus:outline-none"
            >
              {availableCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={handlePushToCalendar}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule to Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Farm Context Indicator */}
      <div className="bg-emerald-50/60 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950 dark:text-emerald-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Instructions calibrated for <span className="font-bold">{profile.name}</span>: Soil{' '}
            <span className="font-bold">{profile.soilType} (pH {profile.soilPh})</span>, Irrigation{' '}
            <span className="font-bold">{profile.waterSource}</span>.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          Philippine DA-BAR & Global Good Agricultural Practice (PhilGAP)
        </span>
      </div>

      {/* 10-Step Sequential Cards */}
      <div className="space-y-4">
        {steps.map((st) => (
          <div
            key={st.id}
            className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm hover:border-emerald-300 transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-emerald-800/40">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{st.icon}</span>
                <h3 className="font-black text-sm text-gray-900 dark:text-white">
                  {st.title}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 self-start sm:self-auto">
                ⏱️ {st.timing}
              </span>
            </div>

            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              {st.summary}
            </p>

            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-emerald-300/90 pl-1">
              {st.details.map((dt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{dt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
