'use client';

import { useState, useEffect } from 'react';
import {
  FarmProfile,
  DEFAULT_FARM_PROFILE,
  CropRecommendation,
  SAMPLE_RECOMMENDED_CROPS,
  FarmZone,
  SAMPLE_FARM_ZONES,
  CalendarEvent,
  INITIAL_CALENDAR_EVENTS,
  HarvestRecord,
  SAMPLE_HARVEST_LOG,
  SensorData,
  SAMPLE_SENSOR_DATA,
  PlantScanResult,
  LandScanResult,
} from './farm-data';

const STORAGE_KEYS = {
  FARM_PROFILE: 'ai_farming_profile',
  CROPS: 'ai_farming_crops',
  ZONES: 'ai_farming_zones',
  CALENDAR: 'ai_farming_calendar',
  HARVESTS: 'ai_farming_harvests',
  PLANT_SCANS: 'ai_farming_plant_scans',
  LAND_SCANS: 'ai_farming_land_scans',
  ACTIVE_TAB: 'ai_farming_active_tab',
  WORKFLOW_STEP: 'ai_farming_workflow_step',
};

export function useFarmStore() {
  const [profile, setProfileState] = useState<FarmProfile>(DEFAULT_FARM_PROFILE);
  const [recommendedCrops, setRecommendedCropsState] = useState<CropRecommendation[]>(SAMPLE_RECOMMENDED_CROPS);
  const [zones, setZonesState] = useState<FarmZone[]>(SAMPLE_FARM_ZONES);
  const [calendarEvents, setCalendarEventsState] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [harvestRecords, setHarvestRecordsState] = useState<HarvestRecord[]>(SAMPLE_HARVEST_LOG);
  const [plantScans, setPlantScansState] = useState<PlantScanResult[]>([]);
  const [landScans, setLandScansState] = useState<LandScanResult[]>([]);
  const [sensorData, setSensorDataState] = useState<SensorData>(SAMPLE_SENSOR_DATA);
  const [activeTab, setActiveTabState] = useState<string>('dashboard');
  const [workflowStep, setWorkflowStepState] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Synchronize from localStorage after hydration without causing mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedProfile = localStorage.getItem(STORAGE_KEYS.FARM_PROFILE);
        if (storedProfile) setProfileState(JSON.parse(storedProfile));

        const storedCrops = localStorage.getItem(STORAGE_KEYS.CROPS);
        if (storedCrops) setRecommendedCropsState(JSON.parse(storedCrops));

        const storedZones = localStorage.getItem(STORAGE_KEYS.ZONES);
        if (storedZones) setZonesState(JSON.parse(storedZones));

        const storedCal = localStorage.getItem(STORAGE_KEYS.CALENDAR);
        if (storedCal) setCalendarEventsState(JSON.parse(storedCal));

        const storedHarv = localStorage.getItem(STORAGE_KEYS.HARVESTS);
        if (storedHarv) setHarvestRecordsState(JSON.parse(storedHarv));

        const storedPlantScans = localStorage.getItem(STORAGE_KEYS.PLANT_SCANS);
        if (storedPlantScans) setPlantScansState(JSON.parse(storedPlantScans));

        const storedLandScans = localStorage.getItem(STORAGE_KEYS.LAND_SCANS);
        if (storedLandScans) setLandScansState(JSON.parse(storedLandScans));

        const storedTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
        if (storedTab) setActiveTabState(storedTab);

        const storedStep = localStorage.getItem(STORAGE_KEYS.WORKFLOW_STEP);
        if (storedStep) setWorkflowStepState(parseInt(storedStep, 10));
      } catch (e) {
        console.warn('Could not read from localStorage', e);
      } finally {
        setIsInitialized(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const setProfile = (newProfile: FarmProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem(STORAGE_KEYS.FARM_PROFILE, JSON.stringify(newProfile));
    } catch (e) {}
  };

  const setZones = (newZones: FarmZone[]) => {
    setZonesState(newZones);
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(newZones));
    } catch (e) {}
  };

  const addZone = (zone: FarmZone) => {
    const updated = [...zones, zone];
    setZones(updated);
  };

  const updateZone = (updatedZone: FarmZone) => {
    const updated = zones.map((z) => (z.id === updatedZone.id ? updatedZone : z));
    setZones(updated);
  };

  const deleteZone = (zoneId: string) => {
    const updated = zones.filter((z) => z.id !== zoneId);
    setZones(updated);
  };

  const setCalendarEvents = (events: CalendarEvent[]) => {
    setCalendarEventsState(events);
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
    } catch (e) {}
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    const updated = [event, ...calendarEvents];
    setCalendarEvents(updated);
  };

  const toggleEventComplete = (id: string) => {
    const updated = calendarEvents.map((evt): CalendarEvent =>
      evt.id === id
        ? {
            ...evt,
            status: (evt.status === 'completed' ? 'pending' : 'completed') as CalendarEvent['status'],
          }
        : evt
    );
    setCalendarEvents(updated);
  };

  const setHarvestRecords = (records: HarvestRecord[]) => {
    setHarvestRecordsState(records);
    try {
      localStorage.setItem(STORAGE_KEYS.HARVESTS, JSON.stringify(records));
    } catch (e) {}
  };

  const addHarvestRecord = (record: HarvestRecord) => {
    const updated = [record, ...harvestRecords];
    setHarvestRecords(updated);
  };

  const addPlantScan = (scan: PlantScanResult) => {
    const updated = [scan, ...plantScans];
    setPlantScansState(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PLANT_SCANS, JSON.stringify(updated));
    } catch (e) {}
  };

  const addLandScan = (scan: LandScanResult) => {
    const updated = [scan, ...landScans];
    setLandScansState(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LAND_SCANS, JSON.stringify(updated));
    } catch (e) {}
  };

  const setRecommendedCrops = (crops: CropRecommendation[]) => {
    setRecommendedCropsState(crops);
    try {
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    } catch (e) {}
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch (e) {}
  };

  const setWorkflowStep = (step: number) => {
    setWorkflowStepState(step);
    try {
      localStorage.setItem(STORAGE_KEYS.WORKFLOW_STEP, step.toString());
    } catch (e) {}
  };

  const resetToSampleData = () => {
    setProfile(DEFAULT_FARM_PROFILE);
    setZones(SAMPLE_FARM_ZONES);
    setRecommendedCrops(SAMPLE_RECOMMENDED_CROPS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setHarvestRecords(SAMPLE_HARVEST_LOG);
    setSensorDataState(SAMPLE_SENSOR_DATA);
    setPlantScansState([]);
    setLandScansState([]);
    setWorkflowStep(1);
    localStorage.clear();
  };

  return {
    isInitialized,
    profile,
    setProfile,
    zones,
    setZones,
    addZone,
    updateZone,
    deleteZone,
    recommendedCrops,
    setRecommendedCrops,
    calendarEvents,
    setCalendarEvents,
    addCalendarEvent,
    toggleEventComplete,
    harvestRecords,
    setHarvestRecords,
    addHarvestRecord,
    plantScans,
    addPlantScan,
    landScans,
    addLandScan,
    sensorData,
    setSensorData: setSensorDataState,
    activeTab,
    setActiveTab,
    workflowStep,
    setWorkflowStep,
    resetToSampleData,
  };
}
