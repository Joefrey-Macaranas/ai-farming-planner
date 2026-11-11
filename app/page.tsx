'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardOverview from '@/components/DashboardOverview';
import PlantScanner from '@/components/PlantScanner';
import LandScanner from '@/components/LandScanner';
import CropRecommender from '@/components/CropRecommender';
import FarmLayoutPlanner from '@/components/FarmLayoutPlanner';
import CropPlantingPlanner from '@/components/CropPlantingPlanner';
import PlantingCalendar from '@/components/PlantingCalendar';
import WeatherMonitor from '@/components/WeatherMonitor';
import SmartIrrigationPlanner from '@/components/SmartIrrigationPlanner';
import BudgetProfitCalculator from '@/components/BudgetProfitCalculator';
import HarvestTracker from '@/components/HarvestTracker';
import FarmReports from '@/components/FarmReports';
import FarmSettings from '@/components/FarmSettings';
import GuidedWorkflowModal from '@/components/GuidedWorkflowModal';
import AIFarmingAssistant from '@/components/AIFarmingAssistant';

import { useFarmStore } from '@/lib/store';
import { WeatherData } from '@/app/api/weather/route';
import { CropRecommendation } from '@/lib/farm-data';
import {
  Compass,
  Scan,
  Grid3X3,
  Calendar,
  Bot,
  Sprout,
} from 'lucide-react';

export default function Home() {
  const store = useFarmStore();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [selectedCropForGuide, setSelectedCropForGuide] = useState<CropRecommendation | null>(null);

  // Fetch live weather data safely
  useEffect(() => {
    let isCancelled = false;
    const loadWeather = async () => {
      try {
        const lat = store.profile.latitude || 14.2817;
        const lon = store.profile.longitude || 121.4172;
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && !isCancelled) {
            setWeatherData(json.data);
          }
        }
      } catch (e) {
        console.warn('Weather fetch error:', e);
      }
    };

    loadWeather();
    return () => {
      isCancelled = true;
    };
  }, [store.profile.latitude, store.profile.longitude]);

  const refreshWeather = async () => {
    try {
      const lat = store.profile.latitude || 14.2817;
      const lon = store.profile.longitude || 121.4172;
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setWeatherData(json.data);
      }
    } catch (e) {
      console.warn('Weather refresh error:', e);
    }
  };

  // Handle cross-component actions
  const handleOpenAssistantWithPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantModalOpen(true);
  };

  const handleSelectCropToPlan = (crop: CropRecommendation) => {
    setSelectedCropForGuide(crop);
    store.setActiveTab('planting-guide');
  };

  const handleAddCropToLayout = (crop: CropRecommendation) => {
    const newZone = {
      id: `zone-${Date.now()}`,
      name: `${crop.cropName} Plot`,
      cropName: crop.cropName,
      type: 'vegetable' as const,
      x: 20,
      y: 20,
      width: 30,
      height: 30,
      color: '#10b981',
      plantsCount: 220,
      spacingCm: crop.plantSpacingCm.rowToRow,
      irrigationType: 'Drip' as const,
      status: 'Planned' as const,
    };
    store.addZone(newZone);
    store.setActiveTab('layout-planner');
  };

  const handleAddMilestonesToCalendar = (cropName: string, events: any[]) => {
    events.forEach((evt) => store.addCalendarEvent(evt));
    alert(`Added 5 scheduled farming milestones for ${cropName} to your calendar!`);
    store.setActiveTab('calendar');
  };

  const weatherSummary = weatherData?.current
    ? {
        temp: weatherData.current.temperature,
        icon: weatherData.current.icon,
        condition: weatherData.current.conditionText,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-emerald-950/20 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeTab={store.activeTab}
        setActiveTab={store.setActiveTab}
        profile={store.profile}
        onOpenAssistant={() => {
          setAssistantPrompt(null);
          setIsAssistantModalOpen(true);
        }}
        onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
        weatherSummary={weatherSummary}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {store.activeTab === 'dashboard' && (
          <DashboardOverview
            profile={store.profile}
            zones={store.zones}
            calendarEvents={store.calendarEvents}
            harvestRecords={store.harvestRecords}
            sensorData={store.sensorData}
            weatherData={weatherData}
            workflowStep={store.workflowStep}
            setActiveTab={store.setActiveTab}
            onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
            onOpenAssistant={() => {
              setAssistantPrompt(null);
              setIsAssistantModalOpen(true);
            }}
            toggleEventComplete={store.toggleEventComplete}
          />
        )}

        {store.activeTab === 'plant-scanner' && (
          <PlantScanner
            onAddCropZone={(cropName) => {
              store.addZone({
                id: `zone-${Date.now()}`,
                name: `${cropName} Plot`,
                cropName,
                type: 'vegetable',
                x: 15,
                y: 15,
                width: 30,
                height: 30,
                color: '#ef4444',
                plantsCount: 180,
                spacingCm: 60,
                irrigationType: 'Drip',
                status: 'Growing',
              });
              store.setActiveTab('layout-planner');
            }}
            onAddToCalendar={(cropName) => {
              store.addCalendarEvent({
                id: `evt-${Date.now()}`,
                title: `Care Inspection & Nutrition - ${cropName}`,
                cropName,
                date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
                activityType: 'Pest Inspection',
                status: 'pending',
                notes: 'Check leaves for early blight and apply recommended foliar spray.',
              });
              store.setActiveTab('calendar');
            }}
            onAskAI={handleOpenAssistantWithPrompt}
            onSaveScan={store.addPlantScan}
          />
        )}

        {store.activeTab === 'land-scanner' && (
          <LandScanner
            profile={store.profile}
            onUpdateProfile={(updated) => store.setProfile({ ...store.profile, ...updated })}
            onProceedToLayout={() => store.setActiveTab('layout-planner')}
            onSaveScan={store.addLandScan}
          />
        )}

        {store.activeTab === 'crop-recommend' && (
          <CropRecommender
            profile={store.profile}
            recommendedCrops={store.recommendedCrops}
            onSetRecommendedCrops={store.setRecommendedCrops}
            onSelectCropToPlan={handleSelectCropToPlan}
            onAddCropToLayout={handleAddCropToLayout}
          />
        )}

        {store.activeTab === 'layout-planner' && (
          <FarmLayoutPlanner
            profile={store.profile}
            zones={store.zones}
            onSetZones={store.setZones}
            onAddZone={store.addZone}
            onUpdateZone={store.updateZone}
            onDeleteZone={store.deleteZone}
            onProceedToPlantingGuide={() => store.setActiveTab('planting-guide')}
          />
        )}

        {store.activeTab === 'planting-guide' && (
          <CropPlantingPlanner
            profile={store.profile}
            initialCrop={selectedCropForGuide}
            onAddMilestonesToCalendar={handleAddMilestonesToCalendar}
          />
        )}

        {store.activeTab === 'calendar' && (
          <PlantingCalendar
            profile={store.profile}
            events={store.calendarEvents}
            weatherData={weatherData}
            onAddEvent={store.addCalendarEvent}
            onToggleComplete={store.toggleEventComplete}
          />
        )}

        {store.activeTab === 'weather' && (
          <WeatherMonitor
            profile={store.profile}
            weatherData={weatherData}
            sensorData={store.sensorData}
            onUpdateSensorData={store.setSensorData}
            onRefreshWeather={refreshWeather}
          />
        )}

        {store.activeTab === 'irrigation' && (
          <SmartIrrigationPlanner
            profile={store.profile}
            zones={store.zones}
            sensorData={store.sensorData}
            onUpdateSensorData={store.setSensorData}
          />
        )}

        {store.activeTab === 'budget' && (
          <BudgetProfitCalculator profile={store.profile} />
        )}

        {store.activeTab === 'harvest' && (
          <HarvestTracker
            profile={store.profile}
            harvestRecords={store.harvestRecords}
            zones={store.zones}
            onAddHarvestRecord={store.addHarvestRecord}
          />
        )}

        {store.activeTab === 'reports' && (
          <FarmReports
            profile={store.profile}
            zones={store.zones}
            harvestRecords={store.harvestRecords}
            sensorData={store.sensorData}
            weatherData={weatherData}
          />
        )}

        {store.activeTab === 'settings' && (
          <FarmSettings
            profile={store.profile}
            onUpdateProfile={store.setProfile}
            onResetData={store.resetToSampleData}
          />
        )}
      </main>

      {/* Floating 15-Step Workflow Wizard Modal */}
      {isWorkflowModalOpen && (
        <GuidedWorkflowModal
          currentStep={store.workflowStep}
          onSetStep={store.setWorkflowStep}
          onClose={() => setIsWorkflowModalOpen(false)}
          onNavigateToTab={(tab) => store.setActiveTab(tab)}
        />
      )}

      {/* Floating AI Assistant Chat Modal */}
      {isAssistantModalOpen && (
        <AIFarmingAssistant
          profile={store.profile}
          initialPrompt={assistantPrompt}
          isOpenAsModal={true}
          onCloseModal={() => {
            setIsAssistantModalOpen(false);
            setAssistantPrompt(null);
          }}
        />
      )}

      {/* Mobile-Native Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-emerald-950 border-t border-emerald-800 py-2 px-3 flex items-center justify-around z-40 shadow-2xl safe-area-bottom">
        <button
          onClick={() => store.setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            store.activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-emerald-300/70'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => store.setActiveTab('plant-scanner')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            store.activeTab === 'plant-scanner' ? 'text-emerald-400 font-bold' : 'text-emerald-300/70'
          }`}
        >
          <Scan className="w-5 h-5" />
          <span>Scanner</span>
        </button>

        <button
          onClick={() => store.setActiveTab('layout-planner')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            store.activeTab === 'layout-planner' ? 'text-emerald-400 font-bold' : 'text-emerald-300/70'
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          <span>Layout</span>
        </button>

        <button
          onClick={() => store.setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            store.activeTab === 'calendar' ? 'text-emerald-400 font-bold' : 'text-emerald-300/70'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => {
            setAssistantPrompt(null);
            setIsAssistantModalOpen(true);
          }}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-amber-400 font-bold"
        >
          <Bot className="w-5 h-5" />
          <span>Ask AI</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-emerald-900/60 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 dark:text-emerald-400/80 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-800 dark:text-white">AI FARMING PLANNER</span>
            <span>• &ldquo;Smart Farming. Better Planning. Sustainable Harvest.&rdquo;</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Powered by Gemini Vision, Open-Meteo Meteorology & Good Agricultural Practices (GAP)
          </div>
        </div>
      </footer>
    </div>
  );
}
