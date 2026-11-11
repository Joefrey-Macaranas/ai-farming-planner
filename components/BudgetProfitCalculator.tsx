'use client';

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Download,
} from 'lucide-react';
import { FarmProfile } from '@/lib/farm-data';

interface BudgetProfitCalculatorProps {
  profile: FarmProfile;
}

export default function BudgetProfitCalculator({ profile }: BudgetProfitCalculatorProps) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato (Kamatis - 250 sqm bed)');

  // 8 Expense Categories (in user's currency)
  const [seedsCost, setSeedsCost] = useState(2500);
  const [fertilizerCost, setFertilizerCost] = useState(4800);
  const [soilPrepCost, setSoilPrepCost] = useState(3000);
  const [irrigationCost, setIrrigationCost] = useState(1500);
  const [laborCost, setLaborCost] = useState(6500);
  const [equipmentCost, setEquipmentCost] = useState(1800);
  const [transportCost, setTransportCost] = useState(2200);
  const [harvestPackagingCost, setHarvestPackagingCost] = useState(2000);

  // Harvest & Revenue projections
  const [expectedYieldKg, setExpectedYieldKg] = useState(950);
  const [marketPricePerKg, setMarketPricePerKg] = useState(65);

  // Sensitivity percentage slider (-30% to +30%)
  const [marketPriceAdjustmentPercent, setMarketPriceAdjustmentPercent] = useState(0);

  // Calculations
  const totalInvestment =
    seedsCost +
    fertilizerCost +
    soilPrepCost +
    irrigationCost +
    laborCost +
    equipmentCost +
    transportCost +
    harvestPackagingCost;

  const adjustedPricePerKg = Math.round(marketPricePerKg * (1 + marketPriceAdjustmentPercent / 100));
  const grossRevenue = expectedYieldKg * adjustedPricePerKg;
  const netProfit = grossRevenue - totalInvestment;
  const roiPercent = totalInvestment > 0 ? Math.round((netProfit / totalInvestment) * 100) : 0;
  const breakEvenPricePerKg = expectedYieldKg > 0 ? Math.round((totalInvestment / expectedYieldKg) * 10) / 10 : 0;

  const currency = profile.budgetCurrency || '₱';

  const expensesList = [
    { label: 'Certified Seeds / Seedlings', value: seedsCost, setter: setSeedsCost, color: '#10b981' },
    { label: 'Fertilizers & Soil Amendments', value: fertilizerCost, setter: setFertilizerCost, color: '#3b82f6' },
    { label: 'Land Tillage & Bed Preparation', value: soilPrepCost, setter: setSoilPrepCost, color: '#f59e0b' },
    { label: 'Irrigation & Pumping Power', value: irrigationCost, setter: setIrrigationCost, color: '#06b6d4' },
    { label: 'Farm Labor & Maintenance', value: laborCost, setter: setLaborCost, color: '#8b5cf6' },
    { label: 'Equipment Rental & Tools', value: equipmentCost, setter: setEquipmentCost, color: '#ec4899' },
    { label: 'Transportation to Agro-Market', value: transportCost, setter: setTransportCost, color: '#64748b' },
    { label: 'Harvesting, Grading & Crates', value: harvestPackagingCost, setter: setHarvestPackagingCost, color: '#14b8a6' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Farm Budget & Profit Calculator
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                Itemized operating expense models, yield valuation, and farmgate break-even sensitivity analysis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900 text-emerald-900 dark:text-white"
            >
              <option value="Tomato (Kamatis - 250 sqm bed)">Tomato (Kamatis - 250 m² bed)</option>
              <option value="Sweet Corn (Mais - 400 sqm strip)">Sweet Corn (Mais - 400 m² strip)</option>
              <option value="Eggplant (Talong - 300 sqm bed)">Eggplant (Talong - 300 m² bed)</option>
              <option value="Bird&apos;s Eye Chili (150 sqm bed)">Bird&apos;s Eye Chili (150 m² bed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Return Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Total Capital Investment
          </span>
          <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {currency} {totalInvestment.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            All 8 operating categories combined
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Projected Gross Revenue
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {grossRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {expectedYieldKg.toLocaleString()} kg @ {currency} {adjustedPricePerKg}/kg
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Net Farm Profit
          </span>
          <div
            className={`text-2xl font-black mt-1 ${
              netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'
            }`}
          >
            {currency} {netProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            After recovering full operational costs
          </div>
        </div>

        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs text-gray-500 dark:text-emerald-300/70">
            Return on Investment (ROI)
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {roiPercent}%
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            Break-Even: {currency} {breakEvenPricePerKg}/kg
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section (7 cols): Itemized Expense Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Itemized Agricultural Cost Breakdown
            </h3>

            <div className="space-y-3">
              {expensesList.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 dark:border-emerald-800/40 bg-gray-50/50 dark:bg-emerald-900/20 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: exp.color }}
                    />
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {exp.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 w-32">
                    <span className="text-gray-400 font-bold">{currency}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={exp.value}
                      onChange={(e) => exp.setter(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1 text-right font-mono font-bold rounded border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section (5 cols): Harvest Yield, Price & Sensitivity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Harvest Yield & Farmgate Price Calibration
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Expected Harvest Yield (kg)
                </label>
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={expectedYieldKg}
                  onChange={(e) => setExpectedYieldKg(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Base Market Farmgate Price per kg ({currency})
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={marketPricePerKg}
                  onChange={(e) => setMarketPricePerKg(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 font-mono font-bold"
                />
              </div>

              {/* Price Sensitivity Slider */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    Market Price Fluctuation Simulation
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    {marketPriceAdjustmentPercent > 0 ? `+${marketPriceAdjustmentPercent}%` : `${marketPriceAdjustmentPercent}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={marketPriceAdjustmentPercent}
                  onChange={(e) => setMarketPriceAdjustmentPercent(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>-30% (Glut)</span>
                  <span>Baseline ({currency} {marketPricePerKg})</span>
                  <span>+30% (Scarcity)</span>
                </div>
              </div>
            </div>

            {/* Break-Even Analysis */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1 text-emerald-950 dark:text-emerald-100">
              <div className="font-bold">Break-Even Metric:</div>
              <p>
                To recover your full {currency} {totalInvestment.toLocaleString()} investment across {expectedYieldKg.toLocaleString()} kg, your minimum required farmgate selling price is <span className="font-bold text-emerald-700 dark:text-emerald-300">{currency} {breakEvenPricePerKg}/kg</span>.
              </p>
            </div>
          </div>

          {/* Legal / Transparency Disclaimer */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40 text-[11px] text-gray-500 dark:text-emerald-300/80 space-y-1">
            <span className="font-bold">Estimation Disclosure:</span>
            <p>
              Values are agronomical and financial estimates based on prevailing market benchmarks. Actual yields and prices fluctuate according to weather anomalies, local supply surges, and post-harvest grading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
