'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Sprout,
  Filter,
  CheckCircle2,
  Calendar,
  Droplets,
  DollarSign,
  Maximize2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Plus,
  BookOpen,
} from 'lucide-react';
import { FarmProfile, CropRecommendation, SAMPLE_RECOMMENDED_CROPS } from '@/lib/farm-data';

interface CropRecommenderProps {
  profile: FarmProfile;
  recommendedCrops: CropRecommendation[];
  onSetRecommendedCrops: (crops: CropRecommendation[]) => void;
  onSelectCropToPlan?: (crop: CropRecommendation) => void;
  onAddCropToLayout?: (crop: CropRecommendation) => void;
}

const PHILIPPINE_AGRI_ZONES = [
  'Laguna, CALABARZON (Lowland Loam/Vegetables)',
  'Batangas, CALABARZON (Coffee, Corn, Solanaceous crops)',
  'Benguet, Cordillera (Highland Semi-Temperate/Cabbage/Carrot)',
  'Nueva Ecija, Central Luzon (Rice Granary & Onion)',
  'Isabela, Cagayan Valley (Hybrid Yellow Corn & Rice)',
  'Bukidnon, Northern Mindanao (Pineapple, Corn, High-Value Crops)',
  'Davao del Sur, Davao Region (Papaya, Cacao, Tropical Fruits)',
  'Pangasinan, Ilocos Region (Mango, Eggplant, Corn)',
  'Custom International Location',
];

export default function CropRecommender({
  profile,
  recommendedCrops,
  onSetRecommendedCrops,
  onSelectCropToPlan,
  onAddCropToLayout,
}: CropRecommenderProps) {
  const [location, setLocation] = useState(profile.location || 'Laguna, CALABARZON, Philippines');
  const [areaSize, setAreaSize] = useState(profile.areaSize || 1200);
  const [areaUnit, setAreaUnit] = useState(profile.areaUnit || 'sqm');
  const [soilType, setSoilType] = useState(profile.soilType || 'Loam');
  const [soilPh, setSoilPh] = useState(profile.soilPh || 6.5);
  const [waterAccess, setWaterAccess] = useState(profile.waterSource || 'Deep Well');
  const [budgetLevel, setBudgetLevel] = useState<'Budget Friendly / Low Capital' | 'Moderate Investment' | 'Commercial Scale'>('Moderate Investment');
  const [cropPreference, setCropPreference] = useState('High market liquidity vegetables and cash crops');

  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Handle generating new AI recommendations
  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/recommend-crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          areaSize,
          areaUnit,
          soilType,
          soilPh,
          waterAvailability: waterAccess,
          budget: budgetLevel,
          preferences: cropPreference,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to get recommendations');
      }

      onSetRecommendedCrops(resData.data);
    } catch (err: any) {
      console.error('Crop recommendation error:', err);
      // Keep sample recommended crops
      onSetRecommendedCrops(SAMPLE_RECOMMENDED_CROPS);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Rice & Corn', 'Herbs & Spices'];

  const filteredCrops = recommendedCrops.filter((crop) => {
    if (activeCategory === 'All') return true;
    return crop.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Introduction */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              AI What to Plant in Your Area
            </h1>
            <p className="text-xs text-gray-500 dark:text-emerald-300/80">
              Crop recommendation engine matching local microclimate, soil pH, seasonal rainfall, and market demand.
            </p>
          </div>
        </div>
      </div>

      {/* Query Parameters Form */}
      <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-amber-500" />
            Agro-Climatic Parameters
          </h2>
          <span className="text-[10px] text-gray-500 dark:text-emerald-400">
            Calibrated for Philippine & Tropical Agro-Ecology
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Location preset */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Farm Location & Agro-Zone
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Laguna, CALABARZON, Philippines"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>

          {/* Available Area */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Available Land Area
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                value={areaSize}
                onChange={(e) => setAreaSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
              />
              <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-emerald-900/60 text-gray-600 dark:text-emerald-300 font-medium">
                {areaUnit}
              </span>
            </div>
          </div>

          {/* Water Availability */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Water Source Access
            </label>
            <select
              value={waterAccess}
              onChange={(e) => setWaterAccess(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="Deep Well">Deep Well / Submersible Pump</option>
              <option value="River/Stream">River / Stream Gravity Canal</option>
              <option value="Rainwater Catchment">Rainwater Catchment (Seasonal)</option>
              <option value="Municipal Irrigation">National Irrigation System (NIA)</option>
            </select>
          </div>

          {/* Soil Type */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Soil Type (pH {soilPh})
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="Loam">Loam (Optimal friable)</option>
              <option value="Clay">Heavy Clay</option>
              <option value="Clay Loam">Clay Loam</option>
              <option value="Sandy">Sandy Loam</option>
              <option value="Silt">Silt</option>
            </select>
          </div>

          {/* Farming Budget */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Farming Capital Budget
            </label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="Budget Friendly / Low Capital">Low Capital / Organic Smallholder</option>
              <option value="Moderate Investment">Moderate Investment (Drip + Trellis)</option>
              <option value="Commercial Scale">Commercial High-Density</option>
            </select>
          </div>

          {/* Farmer Preferences */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Crop Goals & Market Preferences
            </label>
            <input
              type="text"
              value={cropPreference}
              onChange={(e) => setCropPreference(e.target.value)}
              placeholder="e.g. Fast-cash vegetables, organic spices, perennial fruits"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Microclimate & Soil Match...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-950" />
                Run AI Crop Suitability Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-emerald-800/60 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-emerald-950'
                  : 'text-gray-600 dark:text-emerald-300 hover:bg-gray-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-emerald-400 font-medium hidden sm:inline">
          Showing {filteredCrops.length} Recommended Varieties
        </span>
      </div>

      {/* Recommended Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-2xl">
                    {crop.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {crop.cropName}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {crop.category}
                    </span>
                  </div>
                </div>

                {/* Suitability Badge */}
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                    {crop.suitabilityScore}% Match
                  </span>
                  <div className="w-14 bg-gray-200 dark:bg-emerald-900 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${crop.suitabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 dark:text-emerald-300/90 leading-relaxed line-clamp-2">
                {crop.description}
              </p>

              {/* Key Agronomic Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Duration
                  </span>
                  <span className="font-bold text-gray-800 dark:text-emerald-200 mt-0.5 block">
                    {crop.growingDurationDays} days
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> Spacing
                  </span>
                  <span className="font-bold text-gray-800 dark:text-emerald-200 mt-0.5 block">
                    {crop.plantSpacingCm.rowToRow}cm × {crop.plantSpacingCm.plantToPlant}cm
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Water Needs
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-300 mt-0.5 block">
                    {crop.waterRequirements} ({crop.waterAmountLitersPerDay}L/day)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                  <span className="text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Est. Market Price
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {profile.budgetCurrency} {crop.estimatedMarketPricePerKg}/kg
                  </span>
                </div>
              </div>

              {/* Best Season & Harvest Window */}
              <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] space-y-1">
                <div>
                  <span className="font-semibold text-amber-900 dark:text-amber-200">
                    Best Season:
                  </span>{' '}
                  <span className="text-gray-700 dark:text-amber-200/90">{crop.bestPlantingSeason}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-900 dark:text-amber-200">
                    Expected Harvest:
                  </span>{' '}
                  <span className="text-gray-700 dark:text-amber-200/90">{crop.estimatedHarvestDate}</span>
                </div>
              </div>

              {/* Potential Challenges */}
              {crop.potentialChallenges && crop.potentialChallenges.length > 0 && (
                <div className="text-[11px] space-y-1">
                  <span className="font-semibold text-gray-500 dark:text-emerald-400">
                    Key Challenges to Monitor:
                  </span>
                  <ul className="text-gray-600 dark:text-emerald-300/80 space-y-0.5">
                    {crop.potentialChallenges.slice(0, 2).map((ch, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="truncate">{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
              {onSelectCropToPlan && (
                <button
                  onClick={() => onSelectCropToPlan(crop)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Planting Guide
                </button>
              )}
              {onAddCropToLayout && (
                <button
                  onClick={() => onAddCropToLayout(crop)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-100 dark:bg-emerald-900/50 hover:bg-gray-200 text-gray-900 dark:text-white font-semibold text-xs border border-gray-200 dark:border-emerald-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Layout
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
