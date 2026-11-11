'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  MapPin,
  Compass,
  Layers,
  Droplets,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { FarmProfile } from '@/lib/farm-data';

interface FarmSettingsProps {
  profile: FarmProfile;
  onUpdateProfile: (updated: FarmProfile) => void;
  onResetData: () => void;
}

export default function FarmSettings({
  profile,
  onUpdateProfile,
  onResetData,
}: FarmSettingsProps) {
  const [formData, setFormData] = useState<FarmProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSelectPreset = (presetName: string) => {
    if (presetName === 'benguet') {
      const p: FarmProfile = {
        ...formData,
        name: 'Benguet Highland Organic Farm',
        ownerName: 'Maria Santos',
        location: 'La Trinidad, Benguet, Philippines',
        latitude: 16.4578,
        longitude: 120.5898,
        areaSize: 2500,
        areaUnit: 'sqm',
        soilType: 'Loam',
        soilPh: 6.0,
        waterSource: 'River/Stream',
        climateZone: 'Highland Tropical',
        budgetCurrency: '₱',
      };
      setFormData(p);
      onUpdateProfile(p);
    } else if (presetName === 'nueva_ecija') {
      const p: FarmProfile = {
        ...formData,
        name: 'Nueva Ecija Grain & Onion Valley',
        ownerName: 'Eduardo Ramos',
        location: 'Cabanatuan, Nueva Ecija, Philippines',
        latitude: 15.4865,
        longitude: 120.9734,
        areaSize: 1.5,
        areaUnit: 'hectares',
        soilType: 'Clay Loam',
        soilPh: 6.4,
        waterSource: 'Irrigation Canal',
        climateZone: 'Tropical (Wet/Dry)',
        budgetCurrency: '₱',
      };
      setFormData(p);
      onUpdateProfile(p);
    } else {
      const p: FarmProfile = {
        ...formData,
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
      };
      setFormData(p);
      onUpdateProfile(p);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-700/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Farm Configuration & Settings
            </h1>
            <p className="text-xs text-gray-500 dark:text-emerald-300/80">
              Manage your agricultural entity credentials, regional coordinates, soil chemistry, and measurement units.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Profiles Bar */}
      <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-4 shadow-sm space-y-2">
        <span className="text-xs font-bold text-gray-700 dark:text-emerald-200">
          Quick Regional Presets:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleSelectPreset('laguna')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold hover:bg-emerald-100"
          >
            🌾 Laguna Vegetable & Agro-Farm (1,500 m²)
          </button>
          <button
            onClick={() => handleSelectPreset('benguet')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold hover:bg-emerald-100"
          >
            🥬 Benguet Highland Organic (2,500 m²)
          </button>
          <button
            onClick={() => handleSelectPreset('nueva_ecija')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold hover:bg-emerald-100"
          >
            🌽 Nueva Ecija Grain Valley (1.5 ha)
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          Primary Farm Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Farm Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Farm Owner / Manager
            </label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Location / Municipality
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Land Footprint Size
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.areaSize}
              onChange={(e) => setFormData({ ...formData, areaSize: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Measurement Unit
            </label>
            <select
              value={formData.areaUnit}
              onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="sqm">Square Meters (m²)</option>
              <option value="hectares">Hectares (ha)</option>
              <option value="acres">Acres</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Financial Currency
            </label>
            <select
              value={formData.budgetCurrency}
              onChange={(e) => setFormData({ ...formData, budgetCurrency: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="₱">Philippine Peso (₱)</option>
              <option value="$">US Dollar ($)</option>
              <option value="€">Euro (€)</option>
            </select>
          </div>
        </div>

        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-emerald-800/40">
          <Layers className="w-4 h-4 text-emerald-600" />
          Soil & Hydrological Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Soil Texture
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="Loam">Loam</option>
              <option value="Clay">Heavy Clay</option>
              <option value="Clay Loam">Clay Loam</option>
              <option value="Sandy">Sandy Loam</option>
              <option value="Silt">Silt</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Soil pH Level: <span className="font-bold text-emerald-600">{formData.soilPh}</span>
            </label>
            <input
              type="range"
              min="4.5"
              max="8.5"
              step="0.1"
              value={formData.soilPh}
              onChange={(e) => setFormData({ ...formData, soilPh: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700 dark:text-emerald-200">
              Primary Water Source
            </label>
            <select
              value={formData.waterSource}
              onChange={(e) => setFormData({ ...formData, waterSource: e.target.value as any })}
              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
            >
              <option value="Deep Well">Deep Well / Submersible Pump</option>
              <option value="River/Stream">River / Stream Gravity Canal</option>
              <option value="Rainwater Catchment">Rainwater Catchment</option>
              <option value="Irrigation Canal">National Irrigation System (NIA)</option>
            </select>
          </div>
        </div>

        {/* Save and Feedback */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-emerald-800/40">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Farm profile updated successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Settings persist in browser storage.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Farm Profile
          </button>
        </div>
      </form>

      {/* Danger Zone / Reset */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-red-900 dark:text-red-200 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Farm Data Management
        </h3>
        <p className="text-xs text-red-800/80 dark:text-red-300/80">
          Reset all current layouts, custom plant scans, and calendar events back to the default agricultural demo dataset.
        </p>

        <button
          onClick={() => {
            if (confirm('Reset all farm data to sample defaults?')) {
              onResetData();
              alert('Farm data restored to initial demo configuration.');
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All to Realistic Sample Farm
        </button>
      </div>
    </div>
  );
}
