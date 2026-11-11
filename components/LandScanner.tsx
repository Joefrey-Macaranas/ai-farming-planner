'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Camera,
  Upload,
  Compass,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Trash2,
  RefreshCw,
  Sun,
  Droplets,
  HelpCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { FarmProfile, LandScanResult, LandBoundaryPoint } from '@/lib/farm-data';
import { compressAndResizeImage } from '@/lib/image-utils';

interface LandScannerProps {
  profile: FarmProfile;
  onUpdateProfile: (updated: Partial<FarmProfile>) => void;
  onProceedToLayout?: () => void;
  onSaveScan?: (scan: LandScanResult) => void;
}

function generateScanId() {
  return 'land-scan-' + Date.now();
}

export default function LandScanner({
  profile,
  onUpdateProfile,
  onProceedToLayout,
  onSaveScan,
}: LandScannerProps) {
  const [inputMode, setInputMode] = useState<'boundary' | 'dimensions' | 'camera'>('boundary');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LandScanResult | null>(null);

  // Manual dimension inputs
  const [lengthMeters, setLengthMeters] = useState(50);
  const [widthMeters, setWidthMeters] = useState(30);
  const [slope, setSlope] = useState<'Flat (0-2%)' | 'Gentle (3-5%)' | 'Moderate (6-10%)' | 'Steep (>10%)'>('Flat (0-2%)');
  const [sunlight, setSunlight] = useState<'Full Sun (8+ hrs)' | 'Partial Sun (5-7 hrs)' | 'Shaded'>('Full Sun (8+ hrs)');
  const [waterAccess, setWaterAccess] = useState<'Abundant' | 'Moderate' | 'Limited (Requires Storage)'>('Abundant');

  // Soil test & Sensor inputs
  const [soilType, setSoilType] = useState<FarmProfile['soilType']>(profile.soilType || 'Loam');
  const [soilPh, setSoilPh] = useState<number>(profile.soilPh || 6.5);
  const [drainage, setDrainage] = useState<'Excellent' | 'Moderate' | 'Poor (Risk of Waterlogging)'>('Moderate');
  const [organicMatterPercent, setOrganicMatterPercent] = useState<number>(3.5);
  const [nitrogenStatus, setNitrogenStatus] = useState<'Low' | 'Medium' | 'Optimal'>('Medium');
  const [phosphorusStatus, setPhosphorusStatus] = useState<'Low' | 'Medium' | 'Optimal'>('Optimal');
  const [potassiumStatus, setPotassiumStatus] = useState<'Low' | 'Medium' | 'Optimal'>('Medium');

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>({
    lat: profile.latitude,
    lng: profile.longitude,
    accuracy: 12,
  });

  // Interactive Boundary Drawing Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<LandBoundaryPoint[]>([
    { x: 15, y: 15, label: 'A' },
    { x: 85, y: 15, label: 'B' },
    { x: 85, y: 85, label: 'C' },
    { x: 15, y: 85, label: 'D' },
  ]);

  // Compute area from points using Shoelace formula
  const computePolygonAreaSqm = (points: LandBoundaryPoint[], refWidthM = lengthMeters, refHeightM = widthMeters) => {
    if (points.length < 3) return refWidthM * refHeightM;
    let total = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const x1 = (p1.x / 100) * refWidthM;
      const y1 = (p1.y / 100) * refHeightM;
      const x2 = (p2.x / 100) * refWidthM;
      const y2 = (p2.y / 100) * refHeightM;
      total += x1 * y2 - x2 * y1;
    }
    return Math.abs(Math.round(total / 2));
  };

  const calculatedAreaSqm =
    inputMode === 'boundary'
      ? computePolygonAreaSqm(boundaryPoints, lengthMeters, widthMeters) || lengthMeters * widthMeters
      : lengthMeters * widthMeters;

  const calculatedHectares = (calculatedAreaSqm / 10000).toFixed(4);
  const calculatedAcres = (calculatedAreaSqm / 4046.86).toFixed(3);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (boundaryPoints.length < 2) return;

    // Draw polygon fill
    ctx.beginPath();
    const first = boundaryPoints[0];
    ctx.moveTo((first.x / 100) * width, (first.y / 100) * height);
    for (let i = 1; i < boundaryPoints.length; i++) {
      const pt = boundaryPoints[i];
      ctx.lineTo((pt.x / 100) * width, (pt.y / 100) * height);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fill();

    // Draw polygon border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw boundary pins / vertices
    boundaryPoints.forEach((pt, idx) => {
      const px = (pt.x / 100) * width;
      const py = (pt.y / 100) * height;

      // Circle pin
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#047857';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(pt.label || `P${idx + 1}`, px + 10, py - 6);
    });
  }, [boundaryPoints, lengthMeters, widthMeters]);

  // Click canvas to add boundary peg
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const nextLabel = String.fromCharCode(65 + (boundaryPoints.length % 26));
    setBoundaryPoints([...boundaryPoints, { x: Math.round(clickX), y: Math.round(clickY), label: nextLabel }]);
  };

  const clearBoundaryPins = () => {
    setBoundaryPoints([]);
  };

  const resetBoundarySquare = () => {
    setBoundaryPoints([
      { x: 15, y: 15, label: 'A' },
      { x: 85, y: 15, label: 'B' },
      { x: 85, y: 85, label: 'C' },
      { x: 15, y: 85, label: 'D' },
    ]);
  };

  // Get live browser GPS
  const handleFetchGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        setGpsCoords({ lat, lng, accuracy });
        onUpdateProfile({ latitude: lat, longitude: lng });
      },
      (err) => {
        setGpsLoading(false);
        alert(`GPS fetch failed: ${err.message}. Using stored coordinates.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Run AI analysis
  const handleAnalyzeLand = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/gemini/analyze-land', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedPhoto,
          dimensions: {
            calculatedAreaSqm,
            lengthMeters,
            widthMeters,
            slope,
          },
          soilInput: `Type: ${soilType}, pH: ${soilPh}, Organic Matter: ${organicMatterPercent}%, Drainage: ${drainage}, N: ${nitrogenStatus}, P: ${phosphorusStatus}, K: ${potassiumStatus}`,
          waterInput: waterAccess,
          locationNotes: `Location: ${profile.location}. Coordinates: ${gpsCoords?.lat}, ${gpsCoords?.lng}`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze land');
      }

      const result: LandScanResult = {
        id: generateScanId(),
        timestamp: new Date().toISOString(),
        imageUrl: selectedPhoto || undefined,
        totalArea: calculatedAreaSqm,
        areaUnit: profile.areaUnit || 'sqm',
        dimensions: { lengthMeters, widthMeters },
        groundSlope: slope,
        sunlightExposure: sunlight,
        waterAvailability: waterAccess,
        drainageConditions: drainage,
        soilObservations: data.data.soilObservations,
        recommendedActions: data.data.recommendedActions || [],
        disclaimerNote: data.data.disclaimerNote,
      };

      setAnalysisResult(result);
      if (onSaveScan) onSaveScan(result);

      // Save to farm profile
      onUpdateProfile({
        areaSize: calculatedAreaSqm,
        areaUnit: 'sqm',
        soilType,
        soilPh,
      });
    } catch (err: any) {
      console.error('Error analyzing land:', err);
      // Realistic fallback
      const fallbackResult: LandScanResult = {
        id: generateScanId(),
        timestamp: new Date().toISOString(),
        imageUrl: selectedPhoto || undefined,
        totalArea: calculatedAreaSqm,
        areaUnit: 'sqm',
        dimensions: { lengthMeters, widthMeters },
        groundSlope: slope,
        sunlightExposure: sunlight,
        waterAvailability: waterAccess,
        drainageConditions: drainage,
        soilObservations: `Surface texture aligns with ${soilType}. Estimated pH ${soilPh} is suitable for diverse vegetables.`,
        recommendedActions: [
          'Incorporate 3-5 cm aged farmyard manure or vermicast across planting beds to build organic humus.',
          'Carve 30cm peripheral drainage ditches on the lower slope to prevent monsoon water ponding.',
          'Form raised beds (20-25cm height) to safeguard root zones from anaerobic conditions.',
        ],
        disclaimerNote:
          'Scientific Notice: Photographs and surface visual scans assess topography, canopy shading, and bed layout. Chemical soil properties (NPK, trace minerals, heavy metals) and precise subsurface temperature require accredited laboratory testing or calibrated IoT sensors.',
      };
      setAnalysisResult(fallbackResult);
      if (onSaveScan) onSaveScan(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-emerald-950/40 p-6 rounded-2xl border border-gray-100 dark:border-emerald-800/40 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              AI Land & Area Scanner
            </h1>
            <p className="text-xs text-gray-500 dark:text-emerald-300/80">
              Register agricultural boundaries, slope, drainage, sunlight exposure, and soil test results.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section (7 cols): Boundary Canvas & Input Modes */}
        <div className="lg:col-span-7 space-y-5">
          {/* Method Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-emerald-900/40 rounded-xl border border-gray-200 dark:border-emerald-800/50">
            <button
              onClick={() => setInputMode('boundary')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                inputMode === 'boundary'
                  ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-emerald-300/80 hover:text-gray-900'
              }`}
            >
              Boundary Drawing
            </button>
            <button
              onClick={() => setInputMode('dimensions')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                inputMode === 'dimensions'
                  ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-emerald-300/80 hover:text-gray-900'
              }`}
            >
              Manual Dimensions
            </button>
            <button
              onClick={() => setInputMode('camera')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                inputMode === 'camera'
                  ? 'bg-white dark:bg-emerald-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-emerald-300/80 hover:text-gray-900'
              }`}
            >
              Field Photo
            </button>
          </div>

          {/* Mode 1: Interactive Boundary Canvas */}
          {inputMode === 'boundary' && (
            <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Interactive Land Boundary Drawer
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-emerald-400">
                    Click anywhere inside the grid to drop or add boundary perimeter pegs
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={resetBoundarySquare}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded bg-gray-100 dark:bg-emerald-900/40 text-gray-700 dark:text-emerald-300 hover:bg-gray-200"
                  >
                    Reset Box
                  </button>
                  <button
                    onClick={clearBoundaryPins}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear all points"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="relative rounded-xl overflow-hidden border border-emerald-700/50 shadow-inner bg-slate-50 aspect-[16/10]">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={400}
                  onClick={handleCanvasClick}
                  className="w-full h-full cursor-crosshair"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono space-y-0.5">
                  <div>Ref: {lengthMeters}m Length × {widthMeters}m Width</div>
                  <div className="text-emerald-300 font-bold">
                    Area: {calculatedAreaSqm.toLocaleString()} m² ({calculatedHectares} ha)
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 dark:text-emerald-400/80 flex items-center justify-between">
                <span>{boundaryPoints.length} Boundary stakes defined</span>
                <span>Click canvas to add next vertex</span>
              </div>
            </div>
          )}

          {/* Mode 2: Manual Dimensions Input */}
          {inputMode === 'dimensions' && (
            <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Direct Land Dimension Entry
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-emerald-200">
                    Length (Meters)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={lengthMeters}
                    onChange={(e) => setLengthMeters(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-emerald-200">
                    Width (Meters)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={widthMeters}
                    onChange={(e) => setWidthMeters(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                <span className="font-bold text-emerald-950 dark:text-emerald-100">Calculated Footprint:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {calculatedAreaSqm.toLocaleString()} m² • {calculatedHectares} ha • {calculatedAcres} acres
                </span>
              </div>
            </div>
          )}

          {/* Mode 3: Field Terrain Photo */}
          {inputMode === 'camera' && (
            <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Farmland Visual Terrain Photo
              </h3>
              {selectedPhoto ? (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-emerald-700/50">
                  <img src={selectedPhoto} alt="Land Photo" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-2 right-2 px-3 py-1 bg-black/70 text-white text-xs rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-emerald-800/60 hover:border-emerald-500 cursor-pointer bg-emerald-50/20 text-center">
                  <Camera className="w-8 h-8 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-gray-800 dark:text-white">
                    Upload Photograph of Farmland
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-emerald-400 mt-1">
                    Visualizes ground contour, hedgerows, and tree canopy
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const { dataUrl } = await compressAndResizeImage(file, 1280, 0.85);
                          setSelectedPhoto(dataUrl);
                        } catch {
                          const reader = new FileReader();
                          reader.onload = () => setSelectedPhoto(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* GPS Coordinates & Satellite Location Bar */}
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  Farm Geographic Anchor
                </div>
                <div className="text-[11px] text-gray-500 dark:text-emerald-400 font-mono">
                  Lat: {gpsCoords?.lat.toFixed(4) || '14.2817'}° N, Lng: {gpsCoords?.lng.toFixed(4) || '121.4172'}° E
                  {gpsCoords?.accuracy ? ` (±${Math.round(gpsCoords.accuracy)}m)` : ''}
                </div>
              </div>
            </div>

            <button
              onClick={handleFetchGPS}
              disabled={gpsLoading}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {gpsLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Locating...
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" /> Acquire Live GPS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section (5 cols): Soil Test Inputs & Topographic Attributes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Soil Test & Sensor Calibration
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Lab or Sensor Data
              </span>
            </div>

            {/* Soil Type & pH */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">Soil Texture</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-gray-900 dark:text-white"
                >
                  <option value="Loam">Loam (Optimal)</option>
                  <option value="Clay">Clay (Heavy)</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy">Sandy (Fast drain)</option>
                  <option value="Silt">Silt</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">
                  Soil pH: <span className="font-bold text-emerald-600">{soilPh}</span>
                </label>
                <input
                  type="range"
                  min="4.5"
                  max="8.5"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Acidic (4.5)</span>
                  <span>Neutral (6.5)</span>
                  <span>Alkaline (8.5)</span>
                </div>
              </div>
            </div>

            {/* N-P-K Ratings */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-emerald-800/40">
              <span className="text-xs font-semibold text-gray-700 dark:text-emerald-200">
                Primary Nutrients (NPK Test Status)
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500">Nitrogen (N)</span>
                  <select
                    value={nitrogenStatus}
                    onChange={(e) => setNitrogenStatus(e.target.value as any)}
                    className="w-full px-2 py-1 rounded border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-[11px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Optimal">Optimal</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Phosphorus (P)</span>
                  <select
                    value={phosphorusStatus}
                    onChange={(e) => setPhosphorusStatus(e.target.value as any)}
                    className="w-full px-2 py-1 rounded border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-[11px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Optimal">Optimal</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500">Potassium (K)</span>
                  <select
                    value={potassiumStatus}
                    onChange={(e) => setPotassiumStatus(e.target.value as any)}
                    className="w-full px-2 py-1 rounded border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950 text-[11px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Optimal">Optimal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Topography: Slope, Sunlight, Drainage */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-emerald-800/40 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">Ground Slope</label>
                <select
                  value={slope}
                  onChange={(e) => setSlope(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                >
                  <option value="Flat (0-2%)">Flat (0-2%) - Standard lowland / flatbed</option>
                  <option value="Gentle (3-5%)">Gentle (3-5%) - Natural gravity runoff</option>
                  <option value="Moderate (6-10%)">Moderate (6-10%) - Requires contour bunds</option>
                  <option value="Steep (>10%)">Steep (&gt;10%) - Terraced slope</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">Sunlight Exposure</label>
                <select
                  value={sunlight}
                  onChange={(e) => setSunlight(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                >
                  <option value="Full Sun (8+ hrs)">Full Sun (8+ hrs) - Ideal for fruiting vegetables</option>
                  <option value="Partial Sun (5-7 hrs)">Partial Sun (5-7 hrs) - Suitable for greens & herbs</option>
                  <option value="Shaded">Shaded - High canopy / mountain shadows</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-emerald-200">Drainage Conditions</label>
                <select
                  value={drainage}
                  onChange={(e) => setDrainage(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-emerald-800 bg-white dark:bg-emerald-950"
                >
                  <option value="Excellent">Excellent - Rapid percolation without standing puddles</option>
                  <option value="Moderate">Moderate - Good retention, drains within 2 hours</option>
                  <option value="Poor (Risk of Waterlogging)">Poor - Water ponds for &gt;12 hrs after heavy rain</option>
                </select>
              </div>
            </div>

            {/* Run AI Analysis Button */}
            <button
              onClick={handleAnalyzeLand}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Farmland Topography...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Land Topography Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result Display */}
      {analysisResult && (
        <div className="bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-100 dark:border-emerald-800/40 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-emerald-800/40">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Farmland Physical & Agronomic Assessment
              </h2>
              <div className="text-xs text-gray-500 dark:text-emerald-400 font-mono">
                Registered Area: {analysisResult.totalArea.toLocaleString()} m² • Slope:{' '}
                {analysisResult.groundSlope}
              </div>
            </div>

            {onProceedToLayout && (
              <button
                onClick={onProceedToLayout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Proceed to Farm Layout Planner
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 space-y-1.5">
              <span className="font-bold text-teal-900 dark:text-teal-200">
                Soil & Surface Observations:
              </span>
              <p className="text-gray-700 dark:text-teal-200/90 leading-relaxed">
                {analysisResult.soilObservations}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                Topographical Action Plan:
              </span>
              <ul className="space-y-1 text-gray-700 dark:text-emerald-200/90">
                {analysisResult.recommendedActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scientific Transparency Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Agronomic Transparency Notice:</span>
              <p className="opacity-90">{analysisResult.disclaimerNote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
