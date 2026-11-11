'use client';

import React from 'react';
import {
  Compass,
  Scan,
  MapPin,
  Sparkles,
  Grid3X3,
  Calendar,
  CloudSun,
  Droplets,
  Calculator,
  Tractor,
  Bot,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  SunMedium,
  Thermometer,
  Layers,
  Leaf,
  Plus,
  Sprout,
} from 'lucide-react';
import {
  FarmProfile,
  FarmZone,
  CalendarEvent,
  HarvestRecord,
  SensorData,
  CropRecommendation,
} from '@/lib/farm-data';
import { WeatherData } from '@/app/api/weather/route';

interface DashboardOverviewProps {
  profile: FarmProfile;
  zones: FarmZone[];
  calendarEvents: CalendarEvent[];
  harvestRecords: HarvestRecord[];
  sensorData: SensorData;
  weatherData: WeatherData | null;
  workflowStep: number;
  setActiveTab: (tab: string) => void;
  onOpenWorkflow: () => void;
  onOpenAssistant: () => void;
  toggleEventComplete: (id: string) => void;
}

export default function DashboardOverview({
  profile,
  zones,
  calendarEvents,
  harvestRecords,
  sensorData,
  weatherData,
  workflowStep,
  setActiveTab,
  onOpenWorkflow,
  onOpenAssistant,
  toggleEventComplete,
}: DashboardOverviewProps) {
  // Compute summary stats
  const totalAreaSqm =
    profile.areaUnit === 'sqm'
      ? profile.areaSize
      : profile.areaUnit === 'hectares'
      ? profile.areaSize * 10000
      : profile.areaSize * 4046.86;

  const activeCropsCount = new Set(zones.filter((z) => z.cropName && z.type !== 'shed' && z.type !== 'water_tank').map((z) => z.cropName)).size;
  const totalPlantCount = zones.reduce((acc, z) => acc + (z.plantsCount || 0), 0);

  const pendingEvents = calendarEvents.filter((e) => e.status !== 'completed');
  const totalHarvestRevenue = harvestRecords.reduce((acc, h) => acc + (h.revenueAmount || 0), 0);

  const workflowProgressPercent = Math.min(100, Math.round((workflowStep / 15) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome & Farm Context Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-600/50 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Farming Season 2026 • Tropical Agri-Zone
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {profile.name}
            </h1>
            <p className="text-emerald-200/90 text-sm max-w-2xl leading-relaxed">
              Managed by <span className="font-semibold text-white">{profile.ownerName}</span> in{' '}
              <span className="font-semibold text-white">{profile.location}</span>. Soil:{' '}
              <span className="font-semibold text-emerald-300">{profile.soilType} (pH {profile.soilPh})</span>{' '}
              • Irrigation: <span className="font-semibold text-emerald-300">{profile.waterSource}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('plant-scanner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 shadow-md transition-all active:scale-95"
            >
              <Scan className="w-4 h-4 text-emerald-700" />
              Scan Plant with AI
            </button>
            <button
              onClick={() => setActiveTab('layout-planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-500/50 shadow-sm transition-all"
            >
              <Grid3X3 className="w-4 h-4 text-emerald-300" />
              Farm Layout
            </button>
          </div>
        </div>

        {/* 15-Step AI Farming Journey Progress Tracker */}
        <div className="mt-6 pt-5 border-t border-emerald-700/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold text-emerald-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Complete 15-Step AI Farming Workflow</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                Step {workflowStep} of 15 ({workflowProgressPercent}%)
              </span>
            </div>
            <button
              onClick={onOpenWorkflow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>Continue Step-by-Step Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5 w-full bg-emerald-950/60 rounded-full h-2.5 overflow-hidden border border-emerald-700/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(6, workflowProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Land Area */}
        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-emerald-300/70">
              Total Farm Area
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {profile.areaSize.toLocaleString()}{' '}
              <span className="text-sm font-semibold text-gray-500 dark:text-emerald-400">
                {profile.areaUnit}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-emerald-400/80 mt-0.5">
              ≈ {(totalAreaSqm / 10000).toFixed(2)} ha • {(totalAreaSqm / 4046.86).toFixed(2)} acres
            </div>
          </div>
        </div>

        {/* Active Crops & Plant Count */}
        <div className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-emerald-300/70">
              Active Planted Crops
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {activeCropsCount}{' '}
              <span className="text-sm font-semibold text-gray-500 dark:text-emerald-400">
                Varieties
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              {totalPlantCount.toLocaleString()} total plants in {zones.length} zones
            </div>
          </div>
        </div>

        {/* Live Weather / Temperature */}
        <div
          onClick={() => setActiveTab('weather')}
          className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-emerald-300/70 group-hover:text-emerald-600 transition-colors">
              Live Weather Station
            </span>
            <div className="text-xl">
              {weatherData?.current?.icon || '⛅'}
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{weatherData?.current?.temperature ?? 28.5}°C</span>
              <span className="text-xs font-normal text-gray-500 dark:text-emerald-400">
                (Feels {weatherData?.current?.apparentTemperature ?? 31}°C)
              </span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-emerald-400/80 mt-0.5">
              Humidity: {weatherData?.current?.relativeHumidity ?? 72}% • Wind: {weatherData?.current?.windSpeed ?? 11} km/h
            </div>
          </div>
        </div>

        {/* Soil Moisture & Sensors */}
        <div
          onClick={() => setActiveTab('irrigation')}
          className="bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-emerald-300/70 group-hover:text-emerald-600 transition-colors">
              Soil & Water Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {sensorData.soilMoisturePercent}%
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 ml-2">
                Optimal
              </span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-emerald-400/80 mt-0.5">
              Tank: {sensorData.waterTankLevelPercent}% • Soil Temp: {sensorData.soilTemperatureC}°C
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to All Major Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Agricultural AI Launchpad
          </h2>
          <span className="text-xs text-gray-500 dark:text-emerald-400/70">
            Click any tool to open interactive workspace
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Plant Scanner */}
          <button
            onClick={() => setActiveTab('plant-scanner')}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Scan className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              AI Plant Scanner
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              Detect species, leaf diseases, pests & deficiency
            </p>
          </button>

          {/* Card 2: Land Scanner */}
          <button
            onClick={() => setActiveTab('land-scanner')}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
              Land & Area Scanner
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              GPS, boundaries, slope, drainage & dimensions
            </p>
          </button>

          {/* Card 3: What to Plant */}
          <button
            onClick={() => setActiveTab('crop-recommend')}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              What to Plant
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              AI crop suitability engine for your specific soil
            </p>
          </button>

          {/* Card 4: Farm Layout */}
          <button
            onClick={() => setActiveTab('layout-planner')}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              2D / 3D Layout
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              Interactive farm beds, drip lines & 3D view
            </p>
          </button>

          {/* Card 5: Planting Guide */}
          <button
            onClick={() => setActiveTab('planting-guide')}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center mb-3 shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
              Planting Master Plan
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              Soil prep, germination, nursery & fertilization
            </p>
          </button>

          {/* Card 6: AI Chat Assistant */}
          <button
            onClick={onOpenAssistant}
            className="flex flex-col items-start p-4 rounded-xl bg-gradient-to-b from-white to-emerald-50/50 dark:from-emerald-950/60 dark:to-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-400 hover:shadow-md transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
              AI Agri Assistant
            </div>
            <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 mt-1 line-clamp-2">
              Ask any agronomic, disease or fertilizing question
            </p>
          </button>
        </div>
      </div>

      {/* Two Column Section: Today's Tasks & Weather/Sensor Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Farming Tasks & Planting Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-emerald-950/40 rounded-xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Upcoming Farming Activities & Schedule
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Calendar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {calendarEvents.slice(0, 4).map((evt) => {
              const isDone = evt.status === 'completed';
              return (
                <div
                  key={evt.id}
                  className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                    isDone
                      ? 'bg-gray-50 dark:bg-emerald-950/20 border-gray-200 dark:border-emerald-900/50 opacity-60'
                      : 'bg-emerald-50/40 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  <button
                    onClick={() => toggleEventComplete(evt.id)}
                    className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
                    title={isDone ? 'Mark as pending' : 'Mark as done'}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        isDone ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : 'text-gray-300 dark:text-emerald-700'
                      }`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isDone ? 'line-through text-gray-500 dark:text-emerald-400/60' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {evt.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
                        {evt.cropName}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-emerald-400">
                        {evt.date}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-emerald-300/80 mt-1 line-clamp-1">
                      {evt.notes}
                    </p>
                    {evt.weatherWarning && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{evt.weatherWarning}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-emerald-400 border-t border-gray-100 dark:border-emerald-800/40">
            <span>{pendingEvents.length} tasks remaining for this cycle</span>
            <button
              onClick={() => setActiveTab('calendar')}
              className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>
        </div>

        {/* Right Column: Agronomic Risk & Sensor Advisory */}
        <div className="bg-white dark:bg-emerald-950/40 rounded-xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Agronomic Weather Advisory
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
              Live Feed
            </span>
          </div>

          {weatherData?.agriAlerts && weatherData.agriAlerts.length > 0 ? (
            <div className="space-y-3">
              {weatherData.agriAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    alert.severity === 'danger'
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{alert.title}</span>
                  </div>
                  <p className="opacity-90">{alert.message}</p>
                  <div className="font-semibold text-[11px] pt-1 border-t border-current/10">
                    💡 Action: {alert.action}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
              <div className="font-bold">Weather conditions are favorable</div>
              <p>No critical frost, typhoon or severe drought warnings in the immediate 48-hour forecast.</p>
            </div>
          )}

          {/* Quick Sensor Matrix */}
          <div className="pt-2 border-t border-gray-100 dark:border-emerald-800/40">
            <div className="text-xs font-bold text-gray-700 dark:text-emerald-200 mb-2">
              Soil & Environmental Telemetry
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-gray-500 dark:text-emerald-400">Soil Moisture</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-300">
                  {sensorData.soilMoisturePercent}% (Good)
                </div>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-gray-500 dark:text-emerald-400">Soil pH</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-300">
                  {profile.soilPh} (Neutral)
                </div>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-gray-500 dark:text-emerald-400">Soil Temp</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-300">
                  {sensorData.soilTemperatureC}°C
                </div>
              </div>
              <div className="p-2 rounded bg-gray-50 dark:bg-emerald-900/20 border border-gray-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-gray-500 dark:text-emerald-400">Storage Tank</span>
                <div className="font-bold text-blue-600 dark:text-blue-300">
                  {sensorData.waterTankLevelPercent}% Full
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
