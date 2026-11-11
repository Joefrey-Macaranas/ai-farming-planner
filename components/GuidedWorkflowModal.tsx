'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Compass,
  Sparkles,
  Camera,
  MapPin,
  Grid3X3,
  Calendar,
  CloudSun,
  Tractor,
  Layers,
  Sprout,
} from 'lucide-react';

interface GuidedWorkflowModalProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Register Farm Profile & Location',
    description: 'Provide your farm name, location (province/region), GPS coordinates, and primary water source.',
    tabTarget: 'settings',
    icon: Compass,
  },
  {
    step: 2,
    title: 'Capture Farmland Photograph',
    description: 'Take a photo of your field using your phone or upload an aerial/ground image.',
    tabTarget: 'land-scanner',
    icon: Camera,
  },
  {
    step: 3,
    title: 'AI Terrain & Environment Analysis',
    description: 'AI vision models inspect ground slope, sunlight exposure, and vegetative canopy.',
    tabTarget: 'land-scanner',
    icon: Sparkles,
  },
  {
    step: 4,
    title: 'Input Land Dimensions & Soil Data',
    description: 'Enter boundary measurements (or draw on canvas), soil texture, and laboratory pH results.',
    tabTarget: 'land-scanner',
    icon: Layers,
  },
  {
    step: 5,
    title: 'Analyze Weather & Microclimate',
    description: 'Fetch live Open-Meteo seasonal weather, precipitation trends, and extreme temperature risks.',
    tabTarget: 'weather',
    icon: CloudSun,
  },
  {
    step: 6,
    title: 'Explore "What to Plant in Your Area"',
    description: 'Select your budget level and market goals to trigger the AI agronomic recommendation engine.',
    tabTarget: 'crop-recommend',
    icon: Sparkles,
  },
  {
    step: 7,
    title: 'Review AI Crop Suitability Scores',
    description: 'Examine vegetables, fruits, corn/rice, and spices scored against your soil and rainfall.',
    tabTarget: 'crop-recommend',
    icon: Sprout,
  },
  {
    step: 8,
    title: 'Select Preferred Farming Crops',
    description: 'Choose your high-demand varieties (e.g. Tomato, Eggplant, Sweet Corn, Chili).',
    tabTarget: 'crop-recommend',
    icon: CheckCircle2,
  },
  {
    step: 9,
    title: 'Calculate Plant Quantities & Spacing',
    description: 'AI calculates exact plant capacity and row-to-row spacing based on your land dimensions.',
    tabTarget: 'layout-planner',
    icon: Grid3X3,
  },
  {
    step: 10,
    title: 'Generate Interactive Farm Layout',
    description: 'Generate 2D bed zones, walking pathways, drip irrigation manifolds, and water tank placement.',
    tabTarget: 'layout-planner',
    icon: Grid3X3,
  },
  {
    step: 11,
    title: 'Review in 2D & 3D Isometric View',
    description: 'Inspect the 3D elevation of your planting beds, fruit trees, and farm station.',
    tabTarget: 'layout-planner',
    icon: Grid3X3,
  },
  {
    step: 12,
    title: 'Generate 10-Phase Planting Plan',
    description: 'Review land prep, seed treatment, seedling nursery management, and fertilizer schedules.',
    tabTarget: 'planting-guide',
    icon: Sprout,
  },
  {
    step: 13,
    title: 'Create Planting & Harvest Calendar',
    description: 'Automatically map out daily tasks, watering times, and export to Google Calendar.',
    tabTarget: 'calendar',
    icon: Calendar,
  },
  {
    step: 14,
    title: 'Live Weather & Irrigation Monitoring',
    description: 'Monitor daily soil moisture and receive automated heavy rain or drought adjustments.',
    tabTarget: 'irrigation',
    icon: CloudSun,
  },
  {
    step: 15,
    title: 'Harvest Tracker & Historical Ledger',
    description: 'Log yields, monitor plant development progress, and track farmgate profit.',
    tabTarget: 'harvest',
    icon: Tractor,
  },
];

export default function GuidedWorkflowModal({
  currentStep,
  onSetStep,
  onClose,
  onNavigateToTab,
}: GuidedWorkflowModalProps) {
  const currentStepData = WORKFLOW_STEPS.find((s) => s.step === currentStep) || WORKFLOW_STEPS[0];
  const Icon = currentStepData.icon;

  const handleLaunchTool = () => {
    onNavigateToTab(currentStepData.tabTarget);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 15) {
      onSetStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onSetStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-emerald-950 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-800 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-emerald-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-emerald-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                15-Step AI Farming Journey
              </h2>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                From Seed to Harvest, Powered by AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            <span>Step {currentStep} of 15</span>
            <span>{Math.round((currentStep / 15) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-emerald-900/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 15) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Spotlight Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Active Milestone • Step {currentStep}
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-gray-700 dark:text-emerald-100 leading-relaxed">
            {currentStepData.description}
          </p>

          <button
            onClick={handleLaunchTool}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Open Dedicated Tool for Step {currentStep}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Selector Mini-Carousel / Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 text-center">
          {WORKFLOW_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => onSetStep(s.step)}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold border transition-all truncate ${
                s.step === currentStep
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                  : s.step < currentStep
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-200'
                  : 'bg-gray-50 dark:bg-emerald-950/40 text-gray-400 border-gray-200 dark:border-emerald-900'
              }`}
            >
              Step {s.step}
            </button>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-emerald-800/60">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-emerald-300 hover:bg-gray-100 dark:hover:bg-emerald-900/40 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === 15}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-emerald-950 hover:bg-amber-400 disabled:opacity-30"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
