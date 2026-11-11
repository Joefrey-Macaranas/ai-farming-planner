'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Grid3X3,
  Layers,
  Box,
  Droplets,
  Plus,
  Trash2,
  Download,
  Sparkles,
  Maximize2,
  Move,
  CheckCircle2,
  Settings2,
  FileJson,
  Eye,
  Info,
} from 'lucide-react';
import { FarmZone, FarmProfile, SAMPLE_FARM_ZONES } from '@/lib/farm-data';

interface FarmLayoutPlannerProps {
  profile: FarmProfile;
  zones: FarmZone[];
  onSetZones: (zones: FarmZone[]) => void;
  onAddZone: (zone: FarmZone) => void;
  onUpdateZone: (zone: FarmZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onProceedToPlantingGuide?: () => void;
}

export default function FarmLayoutPlanner({
  profile,
  zones,
  onSetZones,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  onProceedToPlantingGuide,
}: FarmLayoutPlannerProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(zones[0]?.id || null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [showIrrigation, setShowIrrigation] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [showPathways, setShowPathways] = useState(true);
  const [isAddingZone, setIsAddingZone] = useState(false);

  // Canvas refs
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const canvas3dRef = useRef<HTMLCanvasElement | null>(null);

  // New zone form
  const [newZoneName, setNewZoneName] = useState('New Vegetable Bed');
  const [newCropName, setNewCropName] = useState('Bell Pepper (Sili)');
  const [newZoneType, setNewZoneType] = useState<FarmZone['type']>('vegetable');
  const [newZoneSpacing, setNewZoneSpacing] = useState(50);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;

  // Calculate total capacities
  const totalPlants = zones.reduce((acc, z) => acc + (z.plantsCount || 0), 0);
  const farmAreaSqm = profile.areaSize || 1500;

  // Redraw 2D Canvas
  useEffect(() => {
    if (viewMode !== '2d') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background: fertile soil / grass
    ctx.fillStyle = '#1e3820';
    ctx.fillRect(0, 0, width, height);

    // Grid lines (every 20px)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Walking Pathways Overlay
    if (showPathways) {
      ctx.fillStyle = '#785b3b';
      // Main central horizontal corridor
      ctx.fillRect(0, height * 0.47, width, height * 0.05);
      // Main central vertical corridor
      ctx.fillRect(width * 0.44, 0, width * 0.04, height);
      // Perimeter pathway
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#8a6843';
      ctx.strokeRect(6, 6, width - 12, height - 12);
    }

    // Draw Zones
    zones.forEach((zone) => {
      const zx = (zone.x / 100) * width;
      const zy = (zone.y / 100) * height;
      const zw = (zone.width / 100) * width;
      const zh = (zone.height / 100) * height;
      const isSelected = zone.id === selectedZoneId;

      // Zone fill
      ctx.fillStyle = zone.color;
      ctx.globalAlpha = isSelected ? 0.9 : 0.75;
      ctx.beginPath();
      ctx.roundRect(zx, zy, zw, zh, 6);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Border
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(0,0,0,0.4)';
      ctx.stroke();

      // Zone Label & Plants Count
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(zone.name, zx + 8, zy + 18);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '10px sans-serif';
      if (zone.plantsCount > 0) {
        ctx.fillText(`${zone.plantsCount} plants (${zone.cropName})`, zx + 8, zy + 32);
      } else {
        ctx.fillText(zone.cropName, zx + 8, zy + 32);
      }

      // Draw crop rows pattern inside agricultural zones
      if (zone.type === 'vegetable' || zone.type === 'grain' || zone.type === 'fruit') {
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1;
        const rowStep = Math.max(8, (zone.spacingCm / 100) * 20);
        for (let ry = zy + 40; ry < zy + zh - 6; ry += rowStep) {
          ctx.beginPath();
          ctx.moveTo(zx + 6, ry);
          ctx.lineTo(zx + zw - 6, ry);
          ctx.stroke();
        }
      }
    });

    // Drip Irrigation Overlay (Blue lines with emitters)
    if (showIrrigation) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      // Main water header line from water tank
      ctx.beginPath();
      ctx.moveTo(width * 0.92, height * 0.17);
      ctx.lineTo(width * 0.46, height * 0.17);
      ctx.lineTo(width * 0.46, height * 0.85);
      ctx.stroke();

      // Lateral emitter lines across zones
      zones.forEach((z) => {
        if (z.irrigationType === 'Drip') {
          const zx = (z.x / 100) * width;
          const zy = (z.y / 100) * height;
          const zw = (z.width / 100) * width;
          const zh = (z.height / 100) * height;

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          for (let ly = zy + 15; ly < zy + zh; ly += 20) {
            ctx.beginPath();
            ctx.moveTo(zx + 4, ly);
            ctx.lineTo(zx + zw - 4, ly);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }
      });
    }

    // Drainage Slopes Overlay (Cyan dashed arrows toward edges)
    if (showDrainage) {
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.lineWidth = 2;
      // Draw perimeter drainage canal
      ctx.strokeRect(3, 3, width - 6, height - 6);
    }
  }, [zones, selectedZoneId, viewMode, showIrrigation, showDrainage, showPathways]);

  // Redraw 3D Isometric Canvas
  useEffect(() => {
    if (viewMode !== '3d') return;
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Isometric transformation helper
    const originX = width / 2;
    const originY = 80;
    const isoX = (x: number, y: number) => originX + (x - y) * 2.8;
    const isoY = (x: number, y: number, z = 0) => originY + (x + y) * 1.5 - z;

    // Draw 3D Base Field Polygon
    const baseW = 100;
    const baseH = 100;
    const depth = 20;

    // Base bottom shadow
    ctx.beginPath();
    ctx.moveTo(isoX(0, baseH), isoY(0, baseH, 0));
    ctx.lineTo(isoX(baseW, baseH), isoY(baseW, baseH, 0));
    ctx.lineTo(isoX(baseW, baseH), isoY(baseW, baseH, -depth));
    ctx.lineTo(isoX(0, baseH), isoY(0, baseH, -depth));
    ctx.closePath();
    ctx.fillStyle = '#142918';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(isoX(baseW, 0), isoY(baseW, 0, 0));
    ctx.lineTo(isoX(baseW, baseH), isoY(baseW, baseH, 0));
    ctx.lineTo(isoX(baseW, baseH), isoY(baseW, baseH, -depth));
    ctx.lineTo(isoX(baseW, 0), isoY(baseW, 0, -depth));
    ctx.closePath();
    ctx.fillStyle = '#1a331f';
    ctx.fill();

    // Field top grass
    ctx.beginPath();
    ctx.moveTo(isoX(0, 0), isoY(0, 0));
    ctx.lineTo(isoX(baseW, 0), isoY(baseW, 0));
    ctx.lineTo(isoX(baseW, baseH), isoY(baseW, baseH));
    ctx.lineTo(isoX(0, baseH), isoY(0, baseH));
    ctx.closePath();
    ctx.fillStyle = '#2d5a32';
    ctx.fill();
    ctx.strokeStyle = '#3e7b45';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw Zones as 3D raised blocks
    zones.forEach((z) => {
      const zx = z.x;
      const zy = z.y;
      const zw = z.width;
      const zh = z.height;
      const h = z.type === 'shed' ? 35 : z.type === 'water_tank' ? 25 : 8;

      // Front left face
      ctx.beginPath();
      ctx.moveTo(isoX(zx, zy + zh), isoY(zx, zy + zh, 0));
      ctx.lineTo(isoX(zx + zw, zy + zh), isoY(zx + zw, zy + zh, 0));
      ctx.lineTo(isoX(zx + zw, zy + zh), isoY(zx + zw, zy + zh, h));
      ctx.lineTo(isoX(zx, zy + zh), isoY(zx, zy + zh, h));
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Front right face
      ctx.beginPath();
      ctx.moveTo(isoX(zx + zw, zy), isoY(zx + zw, zy, 0));
      ctx.lineTo(isoX(zx + zw, zy + zh), isoY(zx + zw, zy + zh, 0));
      ctx.lineTo(isoX(zx + zw, zy + zh), isoY(zx + zw, zy + zh, h));
      ctx.lineTo(isoX(zx + zw, zy), isoY(zx + zw, zy, h));
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      // Top face
      ctx.beginPath();
      ctx.moveTo(isoX(zx, zy), isoY(zx, zy, h));
      ctx.lineTo(isoX(zx + zw, zy), isoY(zx + zw, zy, h));
      ctx.lineTo(isoX(zx + zw, zy + zh), isoY(zx + zw, zy + zh, h));
      ctx.lineTo(isoX(zx, zy + zh), isoY(zx, zy + zh, h));
      ctx.closePath();
      ctx.fillStyle = z.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = z.id === selectedZoneId ? 2 : 0.5;
      ctx.stroke();

      // 3D details: Water tank cylinder, trees, or crops
      if (z.type === 'fruit') {
        // Draw 3D Tree tops
        const tx = zx + zw / 2;
        const ty = zy + zh / 2;
        ctx.beginPath();
        ctx.arc(isoX(tx, ty), isoY(tx, ty, h + 15), 12, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
      }

      // Zone name tag in 3D
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(z.name, isoX(zx + 2, zy + 2), isoY(zx + 2, zy + 2, h + 5));
    });
  }, [zones, selectedZoneId, viewMode]);

  // Click on 2D Canvas to select or move zone
  const handle2DCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check hit test in reverse so top zones take precedence
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i];
      if (
        clickX >= z.x &&
        clickX <= z.x + z.width &&
        clickY >= z.y &&
        clickY <= z.y + z.height
      ) {
        setSelectedZoneId(z.id);
        return;
      }
    }
  };

  // Add new zone
  const handleCreateZone = () => {
    const colorMap: Record<FarmZone['type'], string> = {
      vegetable: '#ef4444',
      fruit: '#10b981',
      grain: '#eab308',
      pathway: '#854d0e',
      irrigation: '#0284c7',
      water_tank: '#0369a1',
      compost: '#84cc16',
      shed: '#64748b',
    };

    const newZone: FarmZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName,
      cropName: newCropName,
      type: newZoneType,
      x: 10,
      y: 10,
      width: 25,
      height: 25,
      color: colorMap[newZoneType] || '#10b981',
      plantsCount: newZoneType === 'vegetable' || newZoneType === 'grain' ? 120 : 0,
      spacingCm: newZoneSpacing,
      irrigationType: 'Drip',
      status: 'Planned',
    };

    onAddZone(newZone);
    setSelectedZoneId(newZone.id);
    setIsAddingZone(false);
  };

  // Auto-generate optimal layout
  const handleAutoLayout = () => {
    onSetZones(SAMPLE_FARM_ZONES);
    setSelectedZoneId(SAMPLE_FARM_ZONES[0].id);
  };

  // Export JSON Blueprint
  const handleExportJSON = () => {
    const blueprint = {
      farmName: profile.name,
      location: profile.location,
      areaSize: profile.areaSize,
      areaUnit: profile.areaUnit,
      soilType: profile.soilType,
      exportedAt: new Date().toISOString(),
      zones,
    };
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_farm_layout.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export Canvas Image (PNG)
  const handleExportImage = () => {
    const canvas = viewMode === '2d' ? canvas2dRef.current : canvas3dRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_layout_${viewMode}.png`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                AI Farm Area Layout Planner
              </h1>
              <p className="text-xs text-gray-500 dark:text-emerald-300/80">
                Interactive 2D & 3D planting zones, drip irrigation routes, pathways, and capacity calculator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoLayout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              AI Auto-Organize Layout
            </button>
            <button
              onClick={() => setIsAddingZone(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-emerald-900/50 hover:bg-gray-200 text-gray-900 dark:text-white text-xs font-bold border border-gray-200 dark:border-emerald-800 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              Add Zone
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport & Zone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section (8 cols): Canvas with Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            {/* View Mode & Overlay Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* 2D vs 3D switcher */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-emerald-900/40 rounded-xl border border-gray-200 dark:border-emerald-800/50">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === '2d'
                      ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-emerald-300 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" /> 2D Grid Map
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === '3d'
                      ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-emerald-300 hover:text-gray-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" /> 3D Isometric View
                </button>
              </div>

              {/* Layer toggles */}
              {viewMode === '2d' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowIrrigation(!showIrrigation)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                      showIrrigation
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                    }`}
                  >
                    💧 Drip Lines
                  </button>
                  <button
                    onClick={() => setShowPathways(!showPathways)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                      showPathways
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                    }`}
                  >
                    🚶 Pathways
                  </button>
                  <button
                    onClick={() => setShowDrainage(!showDrainage)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                      showDrainage
                        ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800'
                        : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                    }`}
                  >
                    🌊 Drainage
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-emerald-900/50 shadow-inner bg-slate-900 aspect-[16/10]">
              {viewMode === '2d' ? (
                <canvas
                  ref={canvas2dRef}
                  width={720}
                  height={450}
                  onClick={handle2DCanvasClick}
                  className="w-full h-full cursor-pointer"
                />
              ) : (
                <canvas
                  ref={canvas3dRef}
                  width={720}
                  height={450}
                  className="w-full h-full"
                />
              )}

              {/* Viewport Overlay Info */}
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono space-y-0.5 pointer-events-none">
                <div>Farm: {profile.name} ({farmAreaSqm} m²)</div>
                <div className="text-emerald-400 font-bold">
                  {zones.length} Zones • {totalPlants.toLocaleString()} Total Plant Capacity
                </div>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-emerald-800/40 text-xs">
              <span className="text-gray-500 dark:text-emerald-400">
                Click any zone on the canvas to inspect & configure
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportImage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-emerald-900/40 hover:bg-gray-200 text-gray-800 dark:text-emerald-200 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export PNG Map
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-emerald-900/40 hover:bg-gray-200 text-gray-800 dark:text-emerald-200 font-semibold"
                >
                  <FileJson className="w-3.5 h-3.5" /> Save Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (4 cols): Selected Zone Inspector & Tuning */}
        <div className="lg:col-span-4 space-y-4">
          {selectedZone ? (
            <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: selectedZone.color }}
                  />
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Zone Inspector
                  </h3>
                </div>
                <button
                  onClick={() => onDeleteZone(selectedZone.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                  title="Delete this zone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Zone Name & Crop Name */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Zone Display Name
                  </label>
                  <input
                    type="text"
                    value={selectedZone.name}
                    onChange={(e) =>
                      onUpdateZone({ ...selectedZone, name: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Assigned Crop or Infrastructure
                  </label>
                  <input
                    type="text"
                    value={selectedZone.cropName}
                    onChange={(e) =>
                      onUpdateZone({ ...selectedZone, cropName: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  />
                </div>

                {/* Irrigation Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-emerald-200">
                    Irrigation Delivery
                  </label>
                  <select
                    value={selectedZone.irrigationType}
                    onChange={(e) =>
                      onUpdateZone({
                        ...selectedZone,
                        irrigationType: e.target.value as any,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                  >
                    <option value="Drip">Drip Irrigation Emitters</option>
                    <option value="Micro-sprinkler">Micro-Sprinkler Overhead</option>
                    <option value="Manual Hose">Manual Water Hose / Furrow</option>
                    <option value="None">None (Rainfed / Structure)</option>
                  </select>
                </div>

                {/* Spacing & Calculated Plant Count */}
                {selectedZone.type === 'vegetable' || selectedZone.type === 'grain' ? (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="font-semibold text-gray-700 dark:text-emerald-200">
                          In-Row Plant Spacing: {selectedZone.spacingCm} cm
                        </label>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="150"
                        step="5"
                        value={selectedZone.spacingCm}
                        onChange={(e) => {
                          const newSpacing = Number(e.target.value);
                          // Calculate plants: zone area in sqm / (spacing * 0.75m row)
                          const approxAreaSqm = (selectedZone.width * selectedZone.height * farmAreaSqm) / 10000;
                          const calculatedPlants = Math.max(10, Math.round(approxAreaSqm / ((newSpacing / 100) * 0.75)));
                          onUpdateZone({
                            ...selectedZone,
                            spacingCm: newSpacing,
                            plantsCount: calculatedPlants,
                          });
                        }}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                      <span className="font-bold text-emerald-950 dark:text-emerald-100">
                        Calculated Capacity:
                      </span>
                      <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 text-sm">
                        {selectedZone.plantsCount.toLocaleString()} Plants
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Position & Size Adjusters */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
                  <span className="font-semibold text-gray-700 dark:text-emerald-200 block text-[11px]">
                    Grid Dimensions & Positioning (% of Farm)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-400">Width: {selectedZone.width}%</span>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={selectedZone.width}
                        onChange={(e) =>
                          onUpdateZone({ ...selectedZone, width: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Height: {selectedZone.height}%</span>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={selectedZone.height}
                        onChange={(e) =>
                          onUpdateZone({ ...selectedZone, height: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Position X: {selectedZone.x}%</span>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={selectedZone.x}
                        onChange={(e) =>
                          onUpdateZone({ ...selectedZone, x: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <span className="text-gray-400">Position Y: {selectedZone.y}%</span>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={selectedZone.y}
                        onChange={(e) =>
                          onUpdateZone({ ...selectedZone, y: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-6 shadow-sm text-center text-xs text-gray-500 space-y-2">
              <Info className="w-8 h-8 text-emerald-600 mx-auto" />
              <p>Select any zone on the canvas to edit dimensions and plant spacing.</p>
            </div>
          )}

          {/* Quick Zone List */}
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-4 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider block">
              Configured Farm Zones ({zones.length})
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZoneId(z.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                    z.id === selectedZoneId
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 font-bold'
                      : 'hover:bg-gray-50 dark:hover:bg-emerald-900/20'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: z.color }}
                    />
                    <span className="truncate">{z.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 shrink-0">
                    {z.plantsCount > 0 ? `${z.plantsCount} plants` : z.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {isAddingZone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-emerald-950 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Add New Farm Zone or Structure
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Zone Name
                </label>
                <input
                  type="text"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Type of Zone
                </label>
                <select
                  value={newZoneType}
                  onChange={(e) => setNewZoneType(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                >
                  <option value="vegetable">Vegetable Planting Bed</option>
                  <option value="grain">Rice / Sweet Corn Field</option>
                  <option value="fruit">Fruit Tree Orchard</option>
                  <option value="water_tank">Water Tank / Pump Station</option>
                  <option value="compost">Composting & Vermicast Station</option>
                  <option value="shed">Tool Shed & Storage</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Crop Name (if planting zone)
                </label>
                <input
                  type="text"
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
              <button
                onClick={() => setIsAddingZone(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-emerald-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateZone}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                Add Zone to Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
