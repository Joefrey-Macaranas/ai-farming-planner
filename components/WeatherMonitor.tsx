'use client';

import React, { useState } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  RefreshCw,
  Compass,
  Activity,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { WeatherData } from '@/app/api/weather/route';
import { SensorData, FarmProfile } from '@/lib/farm-data';

interface WeatherMonitorProps {
  profile: FarmProfile;
  weatherData: WeatherData | null;
  sensorData: SensorData;
  onUpdateSensorData: (data: SensorData) => void;
  onRefreshWeather?: () => void;
}

export default function WeatherMonitor({
  profile,
  weatherData,
  sensorData,
  onUpdateSensorData,
  onRefreshWeather,
}: WeatherMonitorProps) {
  const [isEditingSensors, setIsEditingSensors] = useState(false);
  const [tempMoisture, setTempMoisture] = useState(sensorData.soilMoisturePercent);
  const [tempSoilTemp, setTempSoilTemp] = useState(sensorData.soilTemperatureC);
  const [tempTankLevel, setTempTankLevel] = useState(sensorData.waterTankLevelPercent);

  const handleSaveSensors = () => {
    onUpdateSensorData({
      ...sensorData,
      soilMoisturePercent: tempMoisture,
      soilTemperatureC: tempSoilTemp,
      waterTankLevelPercent: tempTankLevel,
      lastUpdated: 'Just now',
    });
    setIsEditingSensors(false);
  };

  const current = weatherData?.current;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Weather & Sensor Telemetry
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                Live Open-Meteo meteorological station synchronized with field soil and water level sensors.
              </p>
            </div>
          </div>

          {onRefreshWeather && (
            <button
              onClick={onRefreshWeather}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Weather Feed
            </button>
          )}
        </div>
      </div>

      {/* Main Meteorological Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Current Weather & 7-Day Forecast */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/50 space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700">
                  <Compass className="w-3 h-3 text-emerald-400" />
                  <span>
                    Lat {weatherData?.latitude?.toFixed(2) || profile.latitude}° • Lon{' '}
                    {weatherData?.longitude?.toFixed(2) || profile.longitude}°
                  </span>
                </div>
                <h2 className="text-xl font-black mt-1">{profile.location}</h2>
                <div className="text-xs text-emerald-200/80 font-medium">
                  {current?.conditionText || 'Partly Cloudy'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-5xl">{current?.icon || '⛅'}</span>
                <div>
                  <div className="text-4xl font-black tracking-tight">
                    {current?.temperature ?? 28.5}°C
                  </div>
                  <div className="text-xs text-emerald-300">
                    Feels like {current?.apparentTemperature ?? 31.0}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-emerald-700/40">
              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10 space-y-0.5">
                <span className="text-emerald-300/80 flex items-center gap-1 text-[11px]">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
                </span>
                <div className="text-base font-bold text-white">
                  {current?.relativeHumidity ?? 72}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10 space-y-0.5">
                <span className="text-emerald-300/80 flex items-center gap-1 text-[11px]">
                  <CloudSun className="w-3.5 h-3.5 text-teal-400" /> Precipitation
                </span>
                <div className="text-base font-bold text-white">
                  {current?.precipitation ?? 0.0} mm
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10 space-y-0.5">
                <span className="text-emerald-300/80 flex items-center gap-1 text-[11px]">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Velocity
                </span>
                <div className="text-base font-bold text-white">
                  {current?.windSpeed ?? 11} km/h
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10 space-y-0.5">
                <span className="text-emerald-300/80 flex items-center gap-1 text-[11px]">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index
                </span>
                <div className="text-base font-bold text-white">
                  {weatherData?.daily?.[0]?.uvIndexMax ?? 8} (High)
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              7-Day Agricultural Forecast
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {(weatherData?.daily || []).slice(0, 7).map((d, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-gray-100 dark:border-emerald-800/40 bg-gray-50/50 dark:bg-emerald-900/20 text-center space-y-1 text-xs"
                >
                  <div className="text-[10px] text-gray-400 font-semibold">{d.date.slice(5)}</div>
                  <div className="text-xl my-1">
                    {d.weatherCode >= 80 ? '⛈️' : d.weatherCode >= 60 ? '🌧️' : d.weatherCode >= 2 ? '⛅' : '☀️'}
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white text-xs">
                    {d.tempMax}° / {d.tempMin}°
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400">
                    {d.precipitationSum} mm
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (5 cols): IoT Soil Sensor & Water Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Field IoT Sensor Telemetry
                </h3>
              </div>

              <button
                onClick={() => setIsEditingSensors(!isEditingSensors)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                {isEditingSensors ? 'Done' : 'Calibrate / Simulate'}
              </button>
            </div>

            {/* Sensor Sliders or Displays */}
            <div className="space-y-3.5 text-xs">
              {/* Soil Moisture */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" /> Volumetric Soil Moisture
                  </span>
                  <span className="font-mono font-black text-blue-700 dark:text-blue-300">
                    {sensorData.soilMoisturePercent}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${sensorData.soilMoisturePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-blue-700/80 dark:text-blue-300/70">
                  <span>Underwatering (&lt;50%)</span>
                  <span className="font-semibold text-emerald-600">Optimal (60-75%)</span>
                  <span>Waterlogged (&gt;85%)</span>
                </div>

                {isEditingSensors && (
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={tempMoisture}
                    onChange={(e) => setTempMoisture(Number(e.target.value))}
                    className="w-full accent-blue-600 mt-2"
                  />
                )}
              </div>

              {/* Water Storage Tank */}
              <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-600" /> Main Water Tank Reserve
                  </span>
                  <span className="font-mono font-black text-teal-700 dark:text-teal-300">
                    {sensorData.waterTankLevelPercent}% Full
                  </span>
                </div>
                <div className="w-full bg-teal-200 dark:bg-teal-900/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${sensorData.waterTankLevelPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 dark:text-teal-300/80">
                  Capacity: ~4,200 Liters remaining (Enough for 4 days standard irrigation)
                </div>

                {isEditingSensors && (
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={tempTankLevel}
                    onChange={(e) => setTempTankLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 mt-2"
                  />
                )}
              </div>

              {/* Soil Temperature */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-600" /> Root Zone Soil Temp
                  </span>
                  <span className="font-mono font-black text-amber-700 dark:text-amber-300">
                    {sensorData.soilTemperatureC}°C
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-amber-300/80">
                  Target Range: 22°C - 28°C for optimal vegetable root respiration and nutrient uptake
                </div>

                {isEditingSensors && (
                  <input
                    type="range"
                    min="15"
                    max="40"
                    step="0.5"
                    value={tempSoilTemp}
                    onChange={(e) => setTempSoilTemp(Number(e.target.value))}
                    className="w-full accent-amber-600 mt-2"
                  />
                )}
              </div>

              {isEditingSensors && (
                <button
                  onClick={handleSaveSensors}
                  className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                >
                  Save Calibrated Telemetry
                </button>
              )}
            </div>
          </div>

          {/* AI Weather Assistant Advisory */}
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              AI Agronomic Weather Advisory
            </h3>

            {weatherData?.agriAlerts && weatherData.agriAlerts.length > 0 ? (
              <div className="space-y-2">
                {weatherData.agriAlerts.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1"
                  >
                    <div className="font-bold text-amber-900 dark:text-amber-200">
                      {alt.title}
                    </div>
                    <p className="text-gray-700 dark:text-amber-200/90">{alt.message}</p>
                    <div className="font-semibold text-[11px] text-emerald-800 dark:text-emerald-300 pt-1 border-t border-amber-200/50">
                      💡 Recommendation: {alt.action}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No critical weather anomalies detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
