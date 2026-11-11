'use client';

import React, { useState } from 'react';
import {
  Droplets,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FarmProfile, FarmZone, SensorData } from '@/lib/farm-data';

interface SmartIrrigationPlannerProps {
  profile: FarmProfile;
  zones: FarmZone[];
  sensorData: SensorData;
  onUpdateSensorData: (data: SensorData) => void;
}

export default function SmartIrrigationPlanner({
  profile,
  zones,
  sensorData,
  onUpdateSensorData,
}: SmartIrrigationPlannerProps) {
  const [irrigationSystem, setIrrigationSystem] = useState<'Drip' | 'Micro-Sprinkler' | 'Furrow'>('Drip');
  const [pumpFlowRateLitersPerMin, setPumpFlowRateLitersPerMin] = useState(45);
  const [electricityCostPerKwh, setElectricityCostPerKwh] = useState(12.5); // PHP ₱

  // Filter planting zones
  const activePlantBeds = zones.filter(
    (z) => z.type === 'vegetable' || z.type === 'grain' || z.type === 'fruit'
  );

  // Compute daily water requirement: average 4.2 Liters per sqm per day adjusted by system efficiency
  // Drip: 90% efficiency; Sprinkler: 70%; Furrow: 50%
  const efficiency = irrigationSystem === 'Drip' ? 0.9 : irrigationSystem === 'Micro-Sprinkler' ? 0.7 : 0.5;

  const farmAreaSqm = profile.areaSize || 1500;
  const activePlantedAreaSqm = activePlantBeds.reduce((acc, z) => {
    return acc + (z.width * z.height * farmAreaSqm) / 10000;
  }, 0);

  const baselineWaterNeedsLiters = Math.round(activePlantedAreaSqm * 4.2);
  const actualWaterDeliveredLiters = Math.round(baselineWaterNeedsLiters / efficiency);
  const runTimeMinutes = Math.round(actualWaterDeliveredLiters / pumpFlowRateLitersPerMin);

  // Overwatering / Underwatering detection
  const isOverwatered = sensorData.soilMoisturePercent > 82;
  const isUnderwatered = sensorData.soilMoisturePercent < 52;
  const isOptimal = !isOverwatered && !isUnderwatered;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              AI Smart Irrigation Planner
            </h1>
            <p className="text-xs text-gray-500 dark:text-emerald-300/80">
              Crop evapotranspiration (ETc) volume models, automated interval schedules, and soil moisture feedback.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Daily Water Requirement
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {actualWaterDeliveredLiters.toLocaleString()}{' '}
            <span className="text-sm font-semibold text-gray-500">Liters/day</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Across {Math.round(activePlantedAreaSqm)} m² active beds
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Optimal Pumping Run-Time
          </span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {runTimeMinutes}{' '}
            <span className="text-sm font-semibold text-gray-500">Minutes</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
            Split: {Math.round(runTimeMinutes * 0.65)}m AM • {Math.round(runTimeMinutes * 0.35)}m PM
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            System Application Efficiency
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(efficiency * 100)}%
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {irrigationSystem === 'Drip' ? 'Saves ~45% water vs Furrow' : 'Standard distribution'}
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Soil Moisture Status
          </span>
          <div
            className={`text-2xl font-black mt-1 ${
              isOptimal
                ? 'text-emerald-600 dark:text-emerald-400'
                : isOverwatered
                ? 'text-blue-600'
                : 'text-amber-600'
            }`}
          >
            {sensorData.soilMoisturePercent}%{' '}
            <span className="text-xs font-bold uppercase">
              ({isOptimal ? 'Optimal' : isOverwatered ? 'Overwatered' : 'Underwatered'})
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Target threshold: 60 - 75%
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Zone Irrigation Breakdown & Schedule */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Daily Zone-by-Zone Irrigation Regimen
            </h3>

            <div className="space-y-3">
              {activePlantBeds.map((zone) => {
                const zoneAreaSqm = Math.round((zone.width * zone.height * farmAreaSqm) / 10000);
                const zoneDailyLiters = Math.round((zoneAreaSqm * 4.2) / efficiency);
                const zoneMinutes = Math.max(5, Math.round(zoneDailyLiters / pumpFlowRateLitersPerMin));

                return (
                  <div
                    key={zone.id}
                    className="p-3.5 rounded-xl border border-gray-100 dark:border-emerald-800/40 bg-gray-50/50 dark:bg-emerald-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {zone.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-emerald-400">
                          {zone.cropName} • {zoneAreaSqm} m² • {zone.plantsCount} plants
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-300">
                          {zoneDailyLiters} Liters/day
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Drip Runtime: {zoneMinutes} mins
                        </div>
                      </div>

                      <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold text-[10px]">
                        06:30 AM & 04:30 PM
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overwatering / Underwatering Diagnostic Feedback */}
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Hydration Diagnostics
            </h3>

            {isOverwatered ? (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  Potential Overwatering Detected ({sensorData.soilMoisturePercent}% saturation)
                </div>
                <p>
                  Excess moisture in root zone reduces oxygen respiration and creates anaerobic conditions favorable to Pythium root rot.
                </p>
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 pt-1 border-t border-blue-200/50">
                  Action: Suspend morning cycle and check bed drainage ditches for standing water.
                </div>
              </div>
            ) : isUnderwatered ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Underwatering Alert ({sensorData.soilMoisturePercent}% saturation)
                </div>
                <p>
                  Crops are approaching wilting point. Cell turgidity loss will cause blossom drop in solanaceous vegetables.
                </p>
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 pt-1 border-t border-amber-200/50">
                  Action: Trigger deep pulse irrigation for 40 minutes immediately.
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Optimal Root Zone Hydration (68% Volumetric Moisture)
                </div>
                <p>
                  Capillary water tension is in the ideal range. Drip emitter schedule is maintaining uniform moisture without leaching nutrients.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): System Configuration & Pump Economics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              Irrigation Infrastructure Settings
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Delivery Method
                </label>
                <select
                  value={irrigationSystem}
                  onChange={(e) => setIrrigationSystem(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
                >
                  <option value="Drip">Drip Irrigation (90% Efficiency)</option>
                  <option value="Micro-Sprinkler">Micro-Sprinklers (70% Efficiency)</option>
                  <option value="Furrow">Open Furrow / Flood (50% Efficiency)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Pump Output: {pumpFlowRateLitersPerMin} L/min
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={pumpFlowRateLitersPerMin}
                  onChange={(e) => setPumpFlowRateLitersPerMin(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Electricity Cost per kWh ({profile.budgetCurrency})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={electricityCostPerKwh}
                  onChange={(e) => setElectricityCostPerKwh(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>
            </div>

            {/* Pumping Cost Summary */}
            <div className="pt-3 border-t border-gray-100 dark:border-emerald-800/40 space-y-2 text-xs">
              <span className="font-bold text-gray-800 dark:text-white block">
                Irrigation Energy Consumption
              </span>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40 space-y-1 text-gray-600 dark:text-emerald-300">
                <div className="flex justify-between">
                  <span>1.5 HP Pump (1.1 kW) Daily Energy:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {((runTimeMinutes / 60) * 1.1).toFixed(2)} kWh/day
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Estimated Monthly Electricity Cost:</span>
                  <span>
                    {profile.budgetCurrency}{' '}
                    {Math.round((runTimeMinutes / 60) * 1.1 * electricityCostPerKwh * 30).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
