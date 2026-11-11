'use client';

import React, { useState } from 'react';
import {
  Sprout,
  Compass,
  Scan,
  Sparkles,
  Grid3X3,
  Calendar,
  CloudSun,
  Droplets,
  Calculator,
  Tractor,
  Bot,
  FileText,
  Settings,
  Menu,
  X,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { FarmProfile } from '@/lib/farm-data';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: FarmProfile;
  onOpenAssistant: () => void;
  onOpenWorkflow: () => void;
  weatherSummary?: { temp: number; icon: string; condition: string } | null;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Farm Overview', icon: Compass, category: 'Overview' },
  { id: 'plant-scanner', label: 'AI Plant Scanner', icon: Scan, category: 'AI Tools' },
  { id: 'land-scanner', label: 'Land & Area Scanner', icon: MapPin, category: 'AI Tools' },
  { id: 'crop-recommend', label: 'What to Plant', icon: Sparkles, category: 'Planning' },
  { id: 'layout-planner', label: 'Farm Layout Planner', icon: Grid3X3, category: 'Planning' },
  { id: 'planting-guide', label: 'Crop Planting Planner', icon: Sprout, category: 'Planning' },
  { id: 'calendar', label: 'Planting Calendar', icon: Calendar, category: 'Operations' },
  { id: 'weather', label: 'Weather & Sensors', icon: CloudSun, category: 'Operations' },
  { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets, category: 'Operations' },
  { id: 'budget', label: 'Budget & Profit', icon: Calculator, category: 'Finance' },
  { id: 'harvest', label: 'Harvest Tracker', icon: Tractor, category: 'Operations' },
  { id: 'reports', label: 'Farm Reports', icon: FileText, category: 'Management' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'Management' },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  profile,
  onOpenAssistant,
  onOpenWorkflow,
  weatherSummary,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 text-white border-b border-emerald-800/60 backdrop-blur-md shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-200 via-white to-emerald-300 bg-clip-text text-transparent">
                    AI FARMING PLANNER
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-800/80 text-emerald-300 rounded-full border border-emerald-700">
                    v2.5
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 font-medium tracking-wide hidden sm:block">
                  From Seed to Harvest, Powered by AI
                </p>
              </div>
            </button>
          </div>

          {/* Center / Context Info (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-800 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium truncate max-w-[170px]" title={profile.location}>
                {profile.name}
              </span>
              <span className="text-emerald-400 font-semibold ml-1">
                ({profile.areaSize} {profile.areaUnit})
              </span>
            </div>

            {weatherSummary && (
              <button
                onClick={() => setActiveTab('weather')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 transition-colors"
                title="View Live Weather & Sensor Station"
              >
                <span>{weatherSummary.icon}</span>
                <span className="font-bold">{weatherSummary.temp}°C</span>
                <span className="text-emerald-300/70">{weatherSummary.condition}</span>
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* 15-Step Workflow Wizard CTA */}
            <button
              onClick={onOpenWorkflow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-emerald-500 text-emerald-950 hover:brightness-110 shadow-sm transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-950" />
              <span className="hidden md:inline">15-Step Guided Plan</span>
              <span className="md:hidden">Guide</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 border border-emerald-500/50"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Ask AI</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/80 transition-colors md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar (Desktop Tabs) */}
      <nav className="hidden md:block bg-emerald-900/40 border-t border-emerald-800/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                    : 'text-emerald-300/80 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-800 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="p-3 bg-emerald-900/50 rounded-lg border border-emerald-800 text-xs text-emerald-200">
            <div className="font-semibold text-white">{profile.name}</div>
            <div className="text-emerald-300/80">{profile.location}</div>
            <div className="mt-1 text-[11px] text-emerald-400">
              Area: {profile.areaSize} {profile.areaUnit} • Soil: {profile.soilType}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-emerald-200 hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
