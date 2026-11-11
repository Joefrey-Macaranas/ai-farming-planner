'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Droplets,
  Sprout,
  Share2,
} from 'lucide-react';
import { CalendarEvent, FarmProfile } from '@/lib/farm-data';
import { WeatherData } from '@/app/api/weather/route';

interface PlantingCalendarProps {
  profile: FarmProfile;
  events: CalendarEvent[];
  weatherData: WeatherData | null;
  onAddEvent: (event: CalendarEvent) => void;
  onToggleComplete: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
}

export default function PlantingCalendar({
  profile,
  events,
  weatherData,
  onAddEvent,
  onToggleComplete,
  onDeleteEvent,
}: PlantingCalendarProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCropName, setNewCropName] = useState('Tomato (Kamatis)');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newActivityType, setNewActivityType] = useState<CalendarEvent['activityType']>('Watering');
  const [newNotes, setNewNotes] = useState('');

  const activityTypes = [
    'All',
    'Land Prep',
    'Seed Sowing',
    'Transplanting',
    'Watering',
    'Fertilizing',
    'Pest Inspection',
    'Pruning',
    'Harvesting',
  ];

  const filteredEvents = events.filter((e) => {
    if (filterType === 'All') return true;
    return e.activityType === filterType;
  });

  const handleCreateEvent = () => {
    if (!newTitle.trim()) return;
    const evt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      cropName: newCropName,
      date: newDate,
      activityType: newActivityType,
      status: 'pending',
      notes: newNotes || 'Routine scheduled farm task.',
    };
    onAddEvent(evt);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  // Export to standard iCalendar (.ics) format for Google Calendar / Apple Calendar
  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Farming Planner//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${profile.name} Agri Calendar`,
    ];

    events.forEach((evt) => {
      const cleanDate = evt.date.replace(/-/g, '');
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${evt.id}@aifarmingplanner.app`);
      icsContent.push(`DTSTAMP:${cleanDate}T060000Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      icsContent.push(`SUMMARY:[${evt.cropName}] ${evt.title}`);
      icsContent.push(`DESCRIPTION:${evt.activityType} - ${evt.notes}`);
      icsContent.push(`LOCATION:${profile.location}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_calendar.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActivityBadgeColor = (type: CalendarEvent['activityType']) => {
    switch (type) {
      case 'Watering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Fertilizing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Harvesting':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Pest Inspection':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'Transplanting':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'Land Prep':
        return 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Planting & Harvesting Calendar
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                Automated seasonal schedule, task notifications, weather adaptations, and Google Calendar sync.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportICS}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-emerald-900/50 hover:bg-gray-200 text-gray-900 dark:text-white text-xs font-bold border border-gray-200 dark:border-emerald-800 transition-colors"
              title="Download standard .ics file for Google Calendar or Apple Calendar"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              Sync to Google Calendar (.ics)
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-emerald-950/40 p-4 rounded-xl border border-gray-100 dark:border-emerald-800/40 shadow-sm">
        {/* Activity filter */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {activityTypes.map((act) => (
            <button
              key={act}
              onClick={() => setFilterType(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === act
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-emerald-300 hover:bg-gray-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 self-end sm:self-auto p-1 bg-gray-100 dark:bg-emerald-900/40 rounded-xl border border-gray-200 dark:border-emerald-800/50 text-xs">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'month'
                ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-emerald-300'
            }`}
          >
            Month List
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-emerald-300'
            }`}
          >
            Weekly Focus
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-emerald-300'
            }`}
          >
            Today&apos;s Log
          </button>
        </div>
      </div>

      {/* Events List / Agenda */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-8 text-center text-xs text-gray-500 space-y-2">
            <CalendarIcon className="w-8 h-8 text-emerald-600 mx-auto" />
            <p>No farming tasks found matching the selected filter.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isCompleted = evt.status === 'completed';
            return (
              <div
                key={evt.id}
                className={`bg-white dark:bg-emerald-950/40 rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                  isCompleted
                    ? 'opacity-60 bg-gray-50/50 dark:bg-emerald-950/20 border-gray-200 dark:border-emerald-900/50'
                    : 'border-gray-100 dark:border-emerald-800/40 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleComplete(evt.id)}
                    className="mt-1 focus:outline-none"
                    title={isCompleted ? 'Mark pending' : 'Mark completed'}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 transition-colors ${
                        isCompleted
                          ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950'
                          : 'text-gray-300 hover:text-emerald-600 dark:text-emerald-700'
                      }`}
                    />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted
                            ? 'line-through text-gray-500 dark:text-emerald-400/60'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {evt.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${getActivityBadgeColor(
                          evt.activityType
                        )}`}
                      >
                        {evt.activityType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-emerald-900/60 text-gray-700 dark:text-emerald-300">
                        {evt.cropName}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-emerald-300/90 leading-relaxed">
                      {evt.notes}
                    </p>

                    {evt.weatherWarning && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-300 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{evt.weatherWarning}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center text-xs">
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">{evt.date}</div>
                    <span className="text-[10px] text-gray-400">Scheduled 06:30 AM</span>
                  </div>

                  {onDeleteEvent && (
                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-emerald-950 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Add Scheduled Farming Activity
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inspect Tomato lower leaves for Blight"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Activity Type
                  </label>
                  <select
                    value={newActivityType}
                    onChange={(e) => setNewActivityType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  >
                    {activityTypes.filter((a) => a !== 'All').map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Target Crop
                  </label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Execution Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Notes & Agro Instructions
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Chemical dilution rate, tools required, etc."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-emerald-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
