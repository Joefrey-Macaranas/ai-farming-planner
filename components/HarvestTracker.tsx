'use client';

import React, { useState } from 'react';
import {
  Tractor,
  Plus,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Camera,
  Trash2,
  Clock,
  Sprout,
  DollarSign,
} from 'lucide-react';
import { HarvestRecord, FarmProfile, FarmZone } from '@/lib/farm-data';

interface HarvestTrackerProps {
  profile: FarmProfile;
  harvestRecords: HarvestRecord[];
  zones: FarmZone[];
  onAddHarvestRecord: (record: HarvestRecord) => void;
}

export default function HarvestTracker({
  profile,
  harvestRecords,
  zones,
  onAddHarvestRecord,
}: HarvestTrackerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Harvest Form
  const [cropName, setCropName] = useState('Tomato (Kamatis)');
  const [variety, setVariety] = useState('Diamante Max F1');
  const [plantingDate, setPlantingDate] = useState('2026-08-15');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannedYieldKg, setPlannedYieldKg] = useState(800);
  const [actualYieldKg, setActualYieldKg] = useState(850);
  const [qualityGrade, setQualityGrade] = useState<HarvestRecord['qualityGrade']>('Grade A (Premium)');
  const [revenueAmount, setRevenueAmount] = useState(55250);
  const [notes, setNotes] = useState('');

  const currency = profile.budgetCurrency || '₱';

  const totalHistoricalYield = harvestRecords.reduce((acc, h) => acc + (h.actualYieldKg || 0), 0);
  const totalHistoricalRevenue = harvestRecords.reduce((acc, h) => acc + (h.revenueAmount || 0), 0);

  const handleSaveRecord = () => {
    const record: HarvestRecord = {
      id: `harv-${Date.now()}`,
      cropName,
      variety,
      plantingDate,
      harvestDate,
      plannedYieldKg,
      actualYieldKg,
      qualityGrade,
      revenueAmount,
      notes: notes || 'Harvest completed cleanly and packed in sanitized crates.',
    };
    onAddHarvestRecord(record);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Harvest Tracker & Crop Development
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                Monitor vegetative development, log harvest yields, and maintain farm production ledgers.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log Completed Harvest
          </button>
        </div>
      </div>

      {/* Production Ledger Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Total Harvest Production
          </span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {totalHistoricalYield.toLocaleString()}{' '}
            <span className="text-sm font-semibold text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            ≈ {(totalHistoricalYield / 1000).toFixed(2)} metric tons
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Realized Harvest Revenue
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {totalHistoricalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Across {harvestRecords.length} completed cycles
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Average Realized Price
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {currency}{' '}
            {totalHistoricalYield > 0
              ? Math.round(totalHistoricalRevenue / totalHistoricalYield)
              : 0}
            /kg
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            High-grade farmgate benchmark
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Active Plant Batches
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {zones.filter((z) => z.type === 'vegetable' || z.type === 'grain').length}{' '}
            <span className="text-sm font-semibold text-gray-500">Batches</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Currently in vegetative & fruiting stages
          </div>
        </div>
      </div>

      {/* Active Crop Development Progress Bars */}
      <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-600" />
          Active Crop Lifecycle & Maturation Progress
        </h3>

        <div className="space-y-4">
          {zones
            .filter((z) => z.type === 'vegetable' || z.type === 'grain' || z.type === 'fruit')
            .map((zone, idx) => {
              // Mock progression for demonstration
              const progressMap = [75, 55, 30, 15];
              const progressPercent = progressMap[idx % progressMap.length];
              const daysLeftMap = [18, 38, 55, 68];
              const daysLeft = daysLeftMap[idx % daysLeftMap.length];

              return (
                <div
                  key={zone.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 bg-gray-50/50 dark:bg-emerald-900/20 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {zone.cropName} ({zone.name})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        {zone.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-gray-600 dark:text-emerald-300">
                      Est. Harvest in <span className="font-bold text-emerald-600">{daysLeft} days</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-emerald-950 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 dark:text-emerald-400/80">
                    <span>Transplanted</span>
                    <span>Vegetative Growth</span>
                    <span>Flowering</span>
                    <span className="font-bold text-emerald-600">Harvest Ready</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Historical Harvest Ledger */}
      <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          Historical Harvest Records & Farm Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-emerald-900/40 text-gray-600 dark:text-emerald-300 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-100 dark:border-emerald-800">
              <tr>
                <th className="py-3 px-3">Crop & Variety</th>
                <th className="py-3 px-3">Harvest Date</th>
                <th className="py-3 px-3">Yield (Actual / Planned)</th>
                <th className="py-3 px-3">Quality Grade</th>
                <th className="py-3 px-3">Revenue Earned</th>
                <th className="py-3 px-3">Field Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-emerald-800/30">
              {harvestRecords.map((hr) => (
                <tr key={hr.id} className="hover:bg-gray-50 dark:hover:bg-emerald-900/20">
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                    {hr.cropName}
                    <div className="text-[10px] text-gray-400 font-normal">{hr.variety}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-emerald-300 font-mono">
                    {hr.harvestDate}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {hr.actualYieldKg} kg{' '}
                    <span className="text-[10px] text-gray-400 font-normal">
                      (Plan: {hr.plannedYieldKg}kg)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200">
                      {hr.qualityGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-white">
                    {currency} {hr.revenueAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-gray-500 dark:text-emerald-300/80 max-w-xs truncate">
                    {hr.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Harvest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-emerald-950 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Record Completed Crop Harvest
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Seed Variety
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  >
                    <option value="Grade A (Premium)">Grade A (Premium)</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Actual Yield (kg)
                  </label>
                  <input
                    type="number"
                    value={actualYieldKg}
                    onChange={(e) => setActualYieldKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Total Revenue ({currency})
                  </label>
                  <input
                    type="number"
                    value={revenueAmount}
                    onChange={(e) => setRevenueAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Produce quality, brix sweetness, buyer..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-emerald-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                Save Harvest Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
