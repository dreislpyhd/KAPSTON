import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Layers,
  ToggleRight,
  Search,
  Download,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Custom CSS for animations
const notificationStyles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out;
  }
  
  .animate-slide-out-right {
    animation: slideOutRight 0.3s ease-in;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = notificationStyles;
  if (!document.head.querySelector('style[data-notification-styles]')) {
    styleElement.setAttribute('data-notification-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HazardMapUI() {
  const [activeLayer, setActiveLayer] = useState({
    flood: true,
    earthquake: true,
    evacuation: true,
    heatmap: false,
  });
  const [selectedHazard, setSelectedHazard] = useState("Flood");
  const [query, setQuery] = useState("");

  // Hazards & Evacuation markers
  const [autoHazards, setAutoHazards] = useState([]);
  const [manualHazards, setManualHazards] = useState([]);
  const [manualEvacuations, setManualEvacuations] = useState([]);

  // Fetch functions
  const fetchManualEvacuations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hes/evacuations');
      const data = response.data.map(e => ({
        id: e.id,
        position: { lat: parseFloat(e.lat), lng: parseFloat(e.lng) },
        name: e.name,
        capacity: e.capacity,
        status: e.status,
        timestamp: e.created_at
      }));
      setManualEvacuations(data);
    } catch (error) {
      console.error('Error fetching manual evacuations:', error);
    }
  };

  const fetchManualHazards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hes/manual-hazards');
      const data = response.data.map(h => ({
        id: h.id,
        position: { lat: parseFloat(h.lat), lng: parseFloat(h.lng) },
        category: h.category,
        severity: h.severity,
        timestamp: h.created_at,
        notes: h.notes
      }));
      setManualHazards(data);
    } catch (error) {
      console.error('Error fetching manual hazards:', error);
    }
  };

  // States for placing markers
  const [placingHazard, setPlacingHazard] = useState(false);
  const [placingEvacuation, setPlacingEvacuation] = useState(false);

  // Additional states for enhanced functionality
  const [notifications, setNotifications] = useState([]);
  const [mapCenter, setMapCenter] = useState([14.6596, 120.9771]);
  const [mapZoom, setMapZoom] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [savedData, setSavedData] = useState(null);
  // Sound settings for alerts
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(1.0); // 0.0 - 1.0
  const emergencyCtxRef = useRef(null);
  const emergencyStopRef = useRef(null);

  // ===== Flood polygon drawing states =====
  const [floodPolygons, setFloodPolygons] = useState([
    [
      [14.666, 120.97],
      [14.662, 120.972],
      [14.66, 120.976],
      [14.665, 120.978],
    ],
  ]);
  const [isDrawingFlood, setIsDrawingFlood] = useState(false);
  const [currentFloodVertices, setCurrentFloodVertices] = useState([]); // [{lat,lng}, ...]

  // Initialize with a welcome notification
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification("Hazard Map System loaded successfully! Click any button to see notifications.", "success", 8000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data from API
  useEffect(() => {
    fetchManualEvacuations();
    fetchManualHazards();
  }, []);

  // ========== ENHANCED NOTIFICATION SYSTEM ==========
  const addNotification = (message, type = "info", duration = 5000) => {
    const notification = {
      id: Date.now() + Math.random(), // More unique ID
      message,
      type, // success, error, warning, info
      timestamp: new Date().toLocaleTimeString(),
      isVisible: true
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after specified duration
    setTimeout(() => {
      // First mark as invisible for slide-out animation
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isVisible: false } : n)
      );
      
      // Then remove from array after animation completes
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 300); // Match animation duration
    }, duration);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // ========== LAYER MANAGEMENT FUNCTIONS ==========
  const toggleLayer = (key) => {
    setActiveLayer((s) => ({ ...s, [key]: !s[key] }));
    const status = !activeLayer[key] ? "enabled" : "disabled";
    addNotification(`${key.charAt(0).toUpperCase() + key.slice(1)} layer ${status}`, "info");
  };

  const toggleAllLayers = () => {
    const allEnabled = Object.values(activeLayer).every(Boolean);
    const newState = allEnabled ? 
      { flood: false, earthquake: false, evacuation: false, heatmap: false } :
      { flood: true, earthquake: true, evacuation: true, heatmap: true };
    
    setActiveLayer(newState);
    addNotification(allEnabled ? "All layers disabled" : "All layers enabled", "info");
  };

  const resetLayersToDefault = () => {
    setActiveLayer({
      flood: true,
      earthquake: true,
      evacuation: true,
      heatmap: false,
    });
    addNotification("Layers reset to default", "success");
  };

  // ========== SEARCH FUNCTIONALITY ==========
  const handleSearch = () => {
    if (!query.trim()) {
      addNotification("Please enter a search term", "warning");
      return;
    }

    setIsLoading(true);
    addNotification(`Searching for "${query}"...`, "info");

    // Simulate search functionality
    setTimeout(() => {
      const searchResults = [
        { name: "Brgy 176", coords: [14.6596, 120.9771] },
        { name: "Brgy 177", coords: [14.6616, 120.9751] },
        { name: "North Caloocan", coords: [14.6700, 120.9800] },
        { name: "South Caloocan", coords: [14.6500, 120.9700] },
      ];

      const result = searchResults.find(place => 
        place.name.toLowerCase().includes(query.toLowerCase())
      );

      if (result) {
        setMapCenter(result.coords);
        setMapZoom(15);
        addNotification(`Found: ${result.name}`, "success");
      } else {
        addNotification(`No results found for "${query}"`, "error");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const clearSearch = () => {
    setQuery("");
    setMapCenter([14.6596, 120.9771]);
    setMapZoom(12);
    addNotification("Search cleared", "info");
  };

  // ========== HAZARD MANAGEMENT FUNCTIONS ==========
  const clearAllHazards = () => {
    if (window.confirm("Are you sure you want to clear all hazards?")) {
      setAutoHazards([]);
      setManualHazards([]);
      addNotification("All hazards cleared", "success");
    }
  };

  const clearAllEvacuations = () => {
    if (window.confirm("Are you sure you want to clear all evacuation centers?")) {
      setManualEvacuations([]);
      addNotification("All evacuation centers cleared", "success");
    }
  };

  const bulkDeleteHazardsByType = (type) => {
    if (type === "auto") {
      setAutoHazards([]);
      addNotification("All auto-generated hazards cleared", "success");
    } else if (type === "manual") {
      setManualHazards([]);
      addNotification("All manual hazards cleared", "success");
    }
  };

  // ========== ALERT MANAGEMENT ==========
  const dismissAlert = () => {
    addNotification("Active alert dismissed", "success");
    stopEmergencySiren();
    // In a real app, this would update the alert status
  };

  const createCustomAlert = (severity = "High", message = "Custom Alert") => {
    addNotification(`${severity} Alert Created: ${message}`, "warning");
    if (severity === 'High' || severity === 'Critical') {
      startEmergencySiren(8000); // louder, longer siren for emergencies
    } else {
      playAlertSound();
    }
    // In a real app, this would create a new alert
  };
  
  // Play an alert tone using Web Audio API (no external file needed)
  const playAlertSound = () => {
    try {
      if (!soundEnabled || typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      // Siren-like up-down sweep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(1000, now + 0.25);
      osc.frequency.linearRampToValueAtTime(600, now + 0.5);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(Math.max(0.05, Math.min(1, soundVolume)), now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.72);
      // Close context after sound to release resources
      osc.onended = () => {
        try { ctx.close(); } catch (_) {}
      };
    } catch (_) {
      // noop if audio fails (browser gesture restrictions, etc.)
    }
  };

  // Emergency continuous siren (two-oscillator phasing), auto-stops after durationMs
  const startEmergencySiren = (durationMs = 8000) => {
    try {
      if (!soundEnabled || typeof window === 'undefined') return;
      stopEmergencySiren();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      // Main tones
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(650, now);
      osc2.frequency.setValueAtTime(700, now);

      // LFO for wailing effect  (0.9 Hz)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.9, now);
      lfoGain.gain.setValueAtTime(200, now); // deviate +/- 200 Hz
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Output gain with quick attack and slow release
      const volume = Math.max(0.1, Math.min(1, soundVolume));
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.08);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      const stopAt = now + durationMs / 1000;
      const stop = () => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          osc1.stop(ctx.currentTime + 0.15);
          osc2.stop(ctx.currentTime + 0.15);
          lfo.stop(ctx.currentTime + 0.15);
          setTimeout(() => { try { ctx.close(); } catch (_) {} }, 250);
        } catch (_) {}
        emergencyCtxRef.current = null;
        emergencyStopRef.current = null;
      };

      emergencyCtxRef.current = ctx;
      emergencyStopRef.current = stop;

      // Auto stop timer
      setTimeout(() => {
        if (emergencyStopRef.current) emergencyStopRef.current();
      }, durationMs);
    } catch (_) {
      // ignore audio errors
    }
  };

  const stopEmergencySiren = () => {
    try {
      if (emergencyStopRef.current) emergencyStopRef.current();
    } catch (_) {}
  };

  // ========== DATA PERSISTENCE ==========
  const saveMapData = () => {
    const mapData = {
      autoHazards,
      manualHazards,
      manualEvacuations,
      activeLayer,
      mapCenter,
      mapZoom,
      floodPolygons,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('hazardMapData', JSON.stringify(mapData));
    setSavedData(mapData);
    addNotification("Map data saved successfully", "success");
  };

  const loadMapData = () => {
    const saved = localStorage.getItem('hazardMapData');
    if (saved) {
      const data = JSON.parse(saved);
      setAutoHazards(data.autoHazards || []);
      setManualHazards(data.manualHazards || []);
      setManualEvacuations(data.manualEvacuations || []);
      setActiveLayer(data.activeLayer || activeLayer);
      setMapCenter(data.mapCenter || [14.6596, 120.9771]);
      setMapZoom(data.mapZoom || 12);
      setFloodPolygons(data.floodPolygons || []);
      setSavedData(data);
      addNotification(`Map data loaded from ${new Date(data.timestamp).toLocaleString()}`, "success");
    } else {
      addNotification("No saved data found", "warning");
    }
  };

  const clearSavedData = () => {
    if (window.confirm("Are you sure you want to clear saved data?")) {
      localStorage.removeItem('hazardMapData');
      setSavedData(null);
      addNotification("Saved data cleared", "success");
    }
  };

  // ========== REPORTING FUNCTIONS ==========
  const generateHazardReport = () => {
    const report = {
      totalAutoHazards: autoHazards.length,
      totalManualHazards: manualHazards.length,
      totalEvacuationCenters: manualEvacuations.length,
      hazardsByCategory: manualHazards.reduce((acc, hazard) => {
        acc[hazard.category] = (acc[hazard.category] || 0) + 1;
        return acc;
      }, {}),
      timestamp: new Date().toISOString()
    };

    console.log("Hazard Report:", report);
    addNotification("Hazard report generated (check console)", "success");
    return report;
  };

  const exportDetailedReport = () => {
    const report = generateHazardReport();
    const csvContent = [
      "Hazard Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Summary:",
      `Auto Hazards: ${report.totalAutoHazards}`,
      `Manual Hazards: ${report.totalManualHazards}`,
      `Evacuation Centers: ${report.totalEvacuationCenters}`,
      "",
      "Hazards by Category:",
      ...Object.entries(report.hazardsByCategory).map(([cat, count]) => `${cat}: ${count}`),
      "",
      "Detailed Data:",
      "Type,Latitude,Longitude,Category/Reports,Date",
      ...autoHazards.map(h => `Auto Hazard,${h.position[0]},${h.position[1]},Reports: ${h.reports},${new Date().toLocaleDateString()}`),
      ...manualHazards.map(h => `Manual Hazard,${h.position.lat},${h.position.lng},${h.category},${new Date().toLocaleDateString()}`),
      ...manualEvacuations.map(e => `Evacuation Center,${e.position.lat},${e.position.lng},Center,${new Date().toLocaleDateString()}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hazard_detailed_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    addNotification("Detailed report exported", "success");
  };

  // ========== MAP CONTROL FUNCTIONS ==========
  const resetMapView = () => {
    setMapCenter([14.6596, 120.9771]);
    setMapZoom(12);
    addNotification("Map view reset", "info");
  };

  const zoomToFitAllMarkers = () => {
    const allMarkers = [
      ...autoHazards.map(h => h.position),
      ...manualHazards.map(h => [h.position.lat, h.position.lng]),
      ...manualEvacuations.map(e => [e.position.lat, e.position.lng])
    ];

    if (allMarkers.length > 0) {
      // Calculate bounds (simplified)
      const lats = allMarkers.map(m => m[0]);
      const lngs = allMarkers.map(m => m[1]);
      const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      
      setMapCenter([centerLat, centerLng]);
      setMapZoom(11);
      addNotification("Zoomed to fit all markers", "info");
    } else {
      addNotification("No markers to fit", "warning");
    }
  };

  const summary = {
    Flood: { activeAlerts: 1, atRiskHH: 3420, severity: "Moderate" },
    Earthquake: { activeAlerts: 0, atRiskHH: 0, severity: "Low" },
  };

  // Static demo data (can later be wired to API)
  const earthquakeMarkers = [
    { position: [14.657, 120.98], magnitude: 4.5, date: "2025-08-26" },
  ];

  const evacuationCenters = [
    { position: [14.659, 120.975], name: "Brgy Hall" },
    { position: [14.664, 120.974], name: "Daycare Center" },
  ];

  // ===== Flood polygon drawing handlers =====
  const startFloodDrawing = () => {
    setIsDrawingFlood(true);
    setPlacingHazard(false);
    setPlacingEvacuation(false);
    setCurrentFloodVertices([]);
    addNotification("Flood drawing mode: click on the map to add vertices.", "info");
  };

  const undoFloodVertex = () => {
    setCurrentFloodVertices(prev => prev.slice(0, -1));
  };

  const cancelFloodDrawing = () => {
    setIsDrawingFlood(false);
    setCurrentFloodVertices([]);
    addNotification("Flood drawing cancelled.", "info");
  };

  const finishFloodPolygon = () => {
    if (currentFloodVertices.length < 3) {
      addNotification("At least 3 points are required to create a polygon.", "warning");
      return;
    }
    const poly = currentFloodVertices.map(v => [v.lat, v.lng]);
    setFloodPolygons(prev => [...prev, poly]);
    setIsDrawingFlood(false);
    setCurrentFloodVertices([]);
    addNotification("Flood polygon saved.", "success");
  };

  const clearFloodPolygons = () => {
    if (!window.confirm("Clear all flood polygons?")) return;
    setFloodPolygons([]);
    addNotification("All flood polygons cleared.", "success");
  };

  const deleteFloodPolygon = (index) => {
    setFloodPolygons(prev => prev.filter((_, i) => i !== index));
    addNotification("Flood polygon deleted.", "success");
  };

  // Handle map clicks for manual markers and flood drawing
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (isDrawingFlood) {
          setCurrentFloodVertices(prev => [...prev, e.latlng]);
          return;
        }
        if (placingHazard) {
          const newHazard = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            category: "Flood",
            severity: "Moderate",
            notes: ""
          };
          try {
            await axios.post('http://localhost:5000/api/hes/manual-hazards', newHazard);
            fetchManualHazards();
            setPlacingHazard(false);
            addNotification(`Manual hazard placed at (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`, "success");
          } catch (error) {
            console.error('Error adding hazard:', error);
          }
        } else if (placingEvacuation) {
          const newEvac = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            name: `Evacuation Center ${manualEvacuations.length + 1}`,
            capacity: 100,
            status: "Available"
          };
          try {
            await axios.post('http://localhost:5000/api/hes/evacuations', newEvac);
            fetchManualEvacuations();
            setPlacingEvacuation(false);
            addNotification(`Evacuation center placed at (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`, "success");
          } catch (error) {
            console.error('Error adding evacuation:', error);
          }
        }
      },
    });
    return null;
  };

  // Enhanced Export CSV function
  const exportCSV = () => {
    const headers = ["Type", "Latitude", "Longitude", "Category/Reports", "Timestamp"];
    const rows = [];

    autoHazards.forEach((h) =>
      rows.push([
        "Auto Hazard",
        h.position[0],
        h.position[1],
        `Reports: ${h.reports}`,
        new Date().toISOString()
      ])
    );

    manualHazards.forEach((h) =>
      rows.push([
        "Manual Hazard",
        h.position.lat,
        h.position.lng,
        h.category,
        new Date().toISOString()
      ])
    );

    manualEvacuations.forEach((e) =>
      rows.push([
        "Evacuation", 
        e.position.lat, 
        e.position.lng, 
        "Center",
        new Date().toISOString()
      ])
    );

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `hazards_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    addNotification("Basic CSV exported successfully", "success");
  };

  // Enhanced AI auto hazard detection
  const autoGenerateHazard = () => {
    const reports = Math.floor(Math.random() * 20); // simulate 0-20 reports
    const hazardTypes = ["Flood", "Fire", "Earthquake", "Landslide"];
    const randomType = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
    
    if (reports >= 10) {
      const newHazard = {
        id: Date.now(),
        position: [
          14.659 + (Math.random() - 0.5) * 0.02,
          120.977 + (Math.random() - 0.5) * 0.02,
        ],
        reports,
        category: `Auto-Detected ${randomType}`,
        severity: reports >= 15 ? "High" : "Moderate",
        timestamp: new Date().toISOString()
      };
      setAutoHazards((prev) => [...prev, newHazard]);
      addNotification(
        `AI detected ${randomType.toLowerCase()} hazard with ${reports} reports (${newHazard.severity} severity)`,
        "warning"
      );
    } else {
      addNotification(`${reports} reports received — not enough to flag as hazard`, "info");
    }
  };

  // Enhanced manual marker placement functions
  const startPlacingHazard = () => {
    setPlacingHazard(true);
    setPlacingEvacuation(false);
    addNotification("Click on the map to place a hazard marker", "info");
  };

  const startPlacingEvacuation = () => {
    setPlacingEvacuation(true);
          setPlacingHazard(false);
    addNotification("Click on the map to place an evacuation center", "info");
          };

  const cancelPlacement = () => {
    setPlacingHazard(false);
          setPlacingEvacuation(false);
    addNotification("Marker placement cancelled", "info");
  };

  // Enhanced Delete functions with notifications
  const deleteHazard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hes/manual-hazards/${id}`);
      fetchManualHazards();
      addNotification("Manual hazard deleted", "success");
    } catch (error) {
      console.error('Error deleting hazard:', error);
    }
  };
  
  const deleteEvacuation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hes/evacuations/${id}`);
      fetchManualEvacuations();
      addNotification("Evacuation center deleted", "success");
    } catch (error) {
      console.error('Error deleting evacuation:', error);
    }
  };
  
  const deleteAutoHazard = (id) => {
    setAutoHazards((prev) => prev.filter((h) => h.id !== id));
    addNotification("Auto-generated hazard deleted", "success");
  };

  // Enhanced Update hazard category
  const updateHazardCategory = async (id, category) => {
    try {
      await axios.put(`http://localhost:5000/api/hes/manual-hazards/${id}`, { category });
      fetchManualHazards();
      addNotification(`Hazard category updated to ${category}`, "info");
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const updateHazardSeverity = async (id, severity) => {
    try {
      await axios.put(`http://localhost:5000/api/hes/manual-hazards/${id}`, { severity });
      fetchManualHazards();
      addNotification(`Hazard severity updated to ${severity}`, "info");
    } catch (error) {
      console.error('Error updating severity:', error);
    }
  };

  const updateEvacuationCapacity = async (id, capacity) => {
    try {
      await axios.put(`http://localhost:5000/api/hes/evacuations/${id}`, { capacity: parseInt(capacity) });
      fetchManualEvacuations();
      addNotification(`Evacuation center capacity updated to ${capacity}`, "info");
    } catch (error) {
      console.error('Error updating capacity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 text-gray-900 dark:text-gray-100">
      {/* Enhanced Notification System - Always in front */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-[99999] space-y-2 pointer-events-none max-w-sm">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl shadow-2xl text-white text-sm transform transition-all duration-300 ease-out pointer-events-auto ${
                notification.type === "success" ? "bg-gradient-to-r from-green-600 to-green-500 border-l-4 border-green-300" :
                notification.type === "error" ? "bg-gradient-to-r from-red-600 to-red-500 border-l-4 border-red-300" :
                notification.type === "warning" ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-l-4 border-yellow-300" :
                "bg-gradient-to-r from-blue-600 to-blue-500 border-l-4 border-blue-300"
              } ${notification.isVisible !== false ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}
              style={{
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 15px 30px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg flex-shrink-0">
                      {notification.type === "success" ? "✅" :
                       notification.type === "error" ? "❌" :
                       notification.type === "warning" ? "⚠️" :
                       "ℹ️"}
                    </span>
                    <p className="font-semibold text-white leading-tight break-words">
                      {notification.message}
                    </p>
                  </div>
                  <p className="text-xs opacity-80 text-gray-100">
                    {notification.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                  }}
                  className="ml-2 text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-30 rounded-full w-7 h-7 flex items-center justify-center text-xl font-bold transition-all duration-200 flex-shrink-0 backdrop-blur-sm"
                  title="Close notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {notifications.length > 1 && (
            <button
              onClick={clearNotifications}
              className="w-full text-center text-sm bg-gray-900 bg-opacity-95 text-white p-3 rounded-xl hover:bg-gray-800 transition-all duration-200 pointer-events-auto backdrop-blur-sm border border-gray-600 font-medium"
              title="Clear all notifications"
              style={{
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              🗑️ Clear All ({notifications.length})
            </button>
          )}
        </div>
      )}

      {/* Top banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-600 dark:text-red-400" />
          <div>
            <h1 className="text-2xl font-bold">Caloocan Hazard Map</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Flood, Earthquake & Fire overview
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={autoGenerateHazard}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
            title="Generate AI-detected hazard based on simulated reports"
          >
            🤖 Auto Generate
          </button>

          <button
            onClick={startPlacingHazard}
            className={`flex items-center gap-2 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors ${
              placingHazard ? "bg-red-800" : "bg-red-600 hover:bg-red-700"
            }`}
            title="Click to place a manual hazard marker"
          >
            {placingHazard ? "📍 Click Map" : "+ Manual Hazard"}
          </button>

          <button
            onClick={startPlacingEvacuation}
            className={`flex items-center gap-2 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors ${
              placingEvacuation ? "bg-indigo-800" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            title="Click to place an evacuation center"
          >
            {placingEvacuation ? "📍 Click Map" : "+ Evacuation"}
          </button>

          {(placingHazard || placingEvacuation) && (
            <button
              onClick={cancelPlacement}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
              title="Cancel marker placement"
            >
              ❌ Cancel
            </button>
          )}

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
            title="Export basic CSV report"
          >
            <Download /> Export
          </button>

          <button
            onClick={exportDetailedReport}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
            title="Export detailed report with analytics"
          >
            📊 Detailed Report
          </button>

          <button
            onClick={saveMapData}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
            title="Save current map data to browser storage"
          >
            💾 Save
          </button>

          <button
            onClick={loadMapData}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm transition-colors"
            title="Load previously saved map data"
          >
            📂 Load
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT PANEL */}
        <aside className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-6 h-fit">
          {/* Search */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">
              Search place / barangay
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Search className="text-gray-500 dark:text-gray-300" />
              <input
                className="flex-1 p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Search e.g., Brgy 176, Caloocan"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                {isLoading ? "🔍 Searching..." : "🔍 Search"}
              </button>
              <button
                onClick={clearSearch}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Layers */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Layers</h3>
              <div className="flex gap-1">
                <button
                  onClick={toggleAllLayers}
                  className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
                  title="Toggle all layers on/off"
                >
                  All
                </button>
                <button
                  onClick={resetLayersToDefault}
                  className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
                  title="Reset layers to default"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { key: "flood", label: "Flood", color: "blue-600" },
                { key: "earthquake", label: "Earthquake", color: "red-600" },
                { key: "evacuation", label: "Evacuation", color: "indigo-600" },
                { key: "heatmap", label: "Risk Heatmap", color: "orange-600" },
              ].map((layer) => (
                <label
                  key={layer.key}
                  className="flex items-center justify-between gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Layers className={`text-${layer.color}`} />
                    {layer.label}
                  </div>
                  <ToggleRight
                    className={`cursor-pointer ${
                      activeLayer[layer.key]
                        ? "text-green-600"
                        : "text-gray-400 dark:text-gray-300"
                    }`}
                    onClick={() => toggleLayer(layer.key)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Flood Mapping */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Flood Mapping</h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={startFloodDrawing}
                  className={`text-xs ${isDrawingFlood ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-2 rounded transition-colors`}
                >
                  {isDrawingFlood ? '📍 Click map to add points' : '✏️ Start Drawing'}
                </button>
                <button
                  onClick={finishFloodPolygon}
                  disabled={!isDrawingFlood || currentFloodVertices.length < 3}
                  className="text-xs bg-green-600 disabled:bg-green-400 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
                >
                  ✅ Finish
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={undoFloodVertex}
                  disabled={!isDrawingFlood || currentFloodVertices.length === 0}
                  className="text-xs bg-yellow-600 disabled:bg-yellow-400 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors"
                >
                  ↩️ Undo
                </button>
                <button
                  onClick={cancelFloodDrawing}
                  disabled={!isDrawingFlood}
                  className="text-xs bg-gray-600 disabled:bg-gray-400 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
              <button
                onClick={clearFloodPolygons}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
              >
                🗑️ Clear All Flood Polygons
              </button>
              {floodPolygons.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Saved Polygons: {floodPolygons.length}</p>
                  {floodPolygons.map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                      <span>Polygon #{idx + 1}</span>
                      <button
                        onClick={() => deleteFloodPolygon(idx)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete polygon"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={resetMapView}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
              >
                🗺️ Reset Map View
              </button>
              <button
                onClick={zoomToFitAllMarkers}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
              >
                🎯 Fit All Markers
              </button>
              <button
                onClick={generateHazardReport}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
              >
                📋 Generate Report
              </button>
            </div>
          </div>

          {/* Hazard Management */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Management</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={clearAllHazards}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
              >
                🗑️ Clear All Hazards
              </button>
              <button
                onClick={clearAllEvacuations}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded transition-colors"
              >
                🗑️ Clear Evacuations
              </button>
              <button
                onClick={() => bulkDeleteHazardsByType("auto")}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors"
              >
                🤖 Clear Auto Hazards
              </button>
              <button
                onClick={() => bulkDeleteHazardsByType("manual")}
                className="text-xs bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded transition-colors"
              >
                ✋ Clear Manual Hazards
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Data</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={clearSavedData}
                className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors"
              >
                🗑️ Clear Saved Data
              </button>
              {savedData && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last saved: {new Date(savedData.timestamp).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* CENTER: Map */}
        <main className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative z-0">
          {/* Enhanced Alert Banner */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-lg shadow">
              <AlertTriangle />
              <span>Active Alert: Flood — Moderate</span>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={dismissAlert}
                  className="bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs transition-colors"
                  title="Dismiss this alert"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => createCustomAlert("High", "Custom Emergency Alert")}
                  className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs transition-colors"
                  title="Create a custom alert"
                >
                  + Alert
                </button>
              </div>
            </div>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="h-[70vh] w-full relative z-0"
            key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
            style={{ zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />

            {/* Flood polygons */}
            {activeLayer.flood &&
              floodPolygons.map((poly, idx) => (
                <Polygon
                  key={idx}
                  positions={poly}
                  pathOptions={{ color: "blue", fillOpacity: 0.3 }}
                />
              ))}

            {/* In-progress flood polygon preview */}
            {isDrawingFlood && currentFloodVertices.length >= 2 && (
              <Polygon
                positions={currentFloodVertices.map(v => [v.lat, v.lng])}
                pathOptions={{ color: "cyan", dashArray: "6", fillOpacity: 0.1 }}
              />
            )}

            {/* Earthquake markers */}
            {activeLayer.earthquake &&
              earthquakeMarkers.map((eq, idx) => (
                <Marker key={idx} position={eq.position}>
                  <Popup>
                    Earthquake M{eq.magnitude} <br /> Date: {eq.date}
                  </Popup>
                </Marker>
              ))}

            {/* Evacuation centers */}
            {activeLayer.evacuation &&
              evacuationCenters.map((ev, idx) => (
                <Marker key={idx} position={ev.position}>
                  <Popup>{ev.name}</Popup>
                </Marker>
              ))}

            {/* Auto Hazards */}
            {autoHazards.map((hz) => (
              <Marker key={hz.id} position={hz.position}>
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="border-b pb-2">
                      <strong>🤖 Auto-generated Hazard</strong> <br />
                      <small>Reports: {hz.reports} | Severity: {hz.severity}</small><br />
                      <small>Category: {hz.category}</small><br />
                      <small>Detected: {new Date(hz.timestamp).toLocaleString()}</small>
                    </div>
                    <div className="flex gap-2">
                    <button
                      onClick={() => deleteAutoHazard(hz.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Delete this hazard"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => addNotification(`Auto hazard details copied to clipboard`, "info")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Copy hazard details"
                      >
                        📋 Copy
                    </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Manual Hazards */}
            {manualHazards.map((hz) => (
              <Marker key={hz.id} position={hz.position}>
                <Popup>
                  <div className="space-y-3 min-w-[250px]">
                    <div className="border-b pb-2">
                      <strong>⚠️ Manual Hazard</strong> <br />
                      <small>Added: {new Date(hz.timestamp).toLocaleString()}</small><br />
                      <small>Location: ({hz.position.lat.toFixed(4)}, {hz.position.lng.toFixed(4)})</small>
                    </div>
                    
                  <div className="space-y-2">
                    <div>
                        <label className="block text-xs font-medium">Category:</label>
                      <select
                          className="w-full border rounded p-1 text-sm"
                        value={hz.category}
                          onChange={(e) => updateHazardCategory(hz.id, e.target.value)}
                      >
                        <option>Flood</option>
                        <option>Earthquake</option>
                        <option>Fire</option>
                        <option>Landslide</option>
                          <option>Storm</option>
                          <option>Other</option>
                      </select>
                    </div>
                      
                      <div>
                        <label className="block text-xs font-medium">Severity:</label>
                        <select
                          className="w-full border rounded p-1 text-sm"
                          value={hz.severity || "Moderate"}
                          onChange={(e) => updateHazardSeverity(hz.id, e.target.value)}
                        >
                          <option>Low</option>
                          <option>Moderate</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => deleteHazard(hz.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Delete this hazard"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => addNotification(`Manual hazard details copied`, "info")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Copy hazard details"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => addNotification(`Hazard reported to authorities`, "success")}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Report to authorities"
                      >
                        📞 Report
                    </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Manual Evacuations */}
            {manualEvacuations.map((ev) => (
              <Marker key={ev.id} position={ev.position}>
                <Popup>
                  <div className="space-y-3 min-w-[250px]">
                    <div className="border-b pb-2">
                      <strong>🏥 {ev.name}</strong> <br />
                      <small>Added: {new Date(ev.timestamp).toLocaleString()}</small><br />
                      <small>Location: ({ev.position.lat.toFixed(4)}, {ev.position.lng.toFixed(4)})</small>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium">Capacity:</label>
                        <input
                          type="number"
                          className="w-full border rounded p-1 text-sm"
                          value={ev.capacity || 100}
                          onChange={(e) => updateEvacuationCapacity(ev.id, e.target.value)}
                          min="1"
                          max="10000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium">Status:</label>
                        <select
                          className="w-full border rounded p-1 text-sm"
                          value={ev.status || "Available"}
                          onChange={async (e) => {
                            try {
                              await axios.put(`http://localhost:5000/api/hes/evacuations/${ev.id}`, { status: e.target.value });
                              fetchManualEvacuations();
                              addNotification(`Evacuation status updated to ${e.target.value}`, "info");
                            } catch (error) {
                              console.error('Error updating status:', error);
                            }
                          }}
                        >
                          <option>Available</option>
                          <option>At Capacity</option>
                          <option>Closed</option>
                          <option>Under Maintenance</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => deleteEvacuation(ev.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Delete evacuation center"
                  >
                        🗑️ Delete
                  </button>
                      <button
                        onClick={() => addNotification(`Evacuation center details copied`, "info")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Copy center details"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => addNotification(`Evacuation center activated`, "success")}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Activate center"
                      >
                        ✅ Activate
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Bottom Summary */}
          <div className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <b>{selectedHazard} summary</b>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  Alerts: {summary[selectedHazard].activeAlerts} • Severity: {""}
                  {summary[selectedHazard].severity}
                </div>
              </div>
              <div className="text-sm">
                <b>At-risk households</b>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {summary[selectedHazard].atRiskHH.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

