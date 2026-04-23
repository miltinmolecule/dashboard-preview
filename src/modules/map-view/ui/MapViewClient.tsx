"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/utils/cn";
import {
  MOCK_DRIVERS,
  MOCK_ACTIVE_TRIPS,
  MOCK_INCIDENTS,
  MOCK_HEATMAP_POINTS,
  MOCK_ZONES,
  type LiveDriver,
  type Incident,
  type DriverStatus,
} from "../data/mock";
import {
  COUNTRIES,
  ALL_COUNTRIES_VIEW,
  getCountry,
  type CountryConfig,
} from "../data/countries";

// ── Animation ─────────────────────────────────────────────────────────────────
const PULSE_CSS = `
  @keyframes mapPulse {
    0%   { transform: scale(1);   opacity: 0.5; }
    70%  { transform: scale(2.4); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }
`;

// ── Color maps ─────────────────────────────────────────────────────────────────
const DRIVER_COLOR: Record<DriverStatus, string> = {
  available: "#16a34a",
  on_trip:   "#2563eb",
  offline:   "#9ca3af",
  suspended: "#ea580c",
  emergency: "#dc2626",
};

const ZONE_STYLE: Record<string, { fill: string; stroke: string }> = {
  airport:    { fill: "#3b82f6", stroke: "#1d4ed8" },
  premium:    { fill: "#a855f7", stroke: "#7e22ce" },
  no_service: { fill: "#ef4444", stroke: "#b91c1c" },
  standard:   { fill: "#22c55e", stroke: "#15803d" },
};

const INCIDENT_COLOR: Record<string, string> = {
  passenger_emergency:      "#dc2626",
  driver_emergency:         "#dc2626",
  route_deviation:          "#ea580c",
  prolonged_stop:           "#ca8a04",
  suspicious_cancellations: "#7c3aed",
};

const INCIDENT_SYMBOL: Record<string, string> = {
  passenger_emergency:      "🆘",
  driver_emergency:         "🚨",
  route_deviation:          "↗",
  prolonged_stop:           "⏸",
  suspicious_cancellations: "⚠",
};

// ── Icon factories ─────────────────────────────────────────────────────────────
function makeDriverIcon(driver: LiveDriver): L.DivIcon {
  const color = DRIVER_COLOR[driver.status];
  const initials = driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const pulse =
    driver.status === "emergency"
      ? `<div style="position:absolute;inset:-5px;border-radius:50%;background:${color};
           animation:mapPulse 1.4s ease-out infinite;"></div>`
      : "";
  return L.divIcon({
    html: `<div style="position:relative;width:36px;height:36px;">
      ${pulse}
      <div style="position:absolute;inset:0;background:${color};border:2.5px solid #fff;
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        color:#fff;font-size:11px;font-weight:700;font-family:system-ui,sans-serif;
        box-shadow:0 2px 10px rgba(0,0,0,0.22);z-index:1;">${initials}</div>
    </div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function makeIncidentIcon(type: string): L.DivIcon {
  const bg = INCIDENT_COLOR[type] ?? "#6b7280";
  const sym = INCIDENT_SYMBOL[type] ?? "!";
  return L.divIcon({
    html: `<div style="width:30px;height:30px;background:${bg};border:2px solid #fff;
      border-radius:8px;display:flex;align-items:center;justify-content:center;
      font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.28);">${sym}</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

// ── FlyToCountry — moves the map when country changes ─────────────────────────
function FlyToCountry({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}): null {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.4, easeLinearity: 0.35 });
  }, [center, zoom, map]);
  return null;
}

// ── MapClickHandler ────────────────────────────────────────────────────────────
function MapClickHandler({ onMapClick }: { onMapClick: () => void }): null {
  useMapEvents({ click: onMapClick });
  return null;
}

// ── Country Switcher ───────────────────────────────────────────────────────────
function CountrySwitcher({
  selected,
  onChange,
}: {
  selected: string | "all";
  onChange: (code: string | "all") => void;
}): React.ReactNode {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-white/95 shadow-lg border border-gray-200/80 p-1.5 backdrop-blur-sm">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
          selected === "all"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        )}
      >
        🌍 All
      </button>
      {COUNTRIES.map((c) => (
        <button
          key={c.code}
          onClick={() => onChange(c.code)}
          title={c.name}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap",
            selected === c.code
              ? "text-white shadow-sm"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          )}
          style={selected === c.code ? { background: "var(--primary)" } : {}}
        >
          {c.flag} {c.name}
        </button>
      ))}
    </div>
  );
}

// ── Driver Drawer ──────────────────────────────────────────────────────────────
function DriverDrawer({
  driver,
  currencySymbol,
  onClose,
}: {
  driver: LiveDriver;
  currencySymbol: string;
  onClose: () => void;
}): React.ReactNode {
  const trip = MOCK_ACTIVE_TRIPS.find((t) => t.driverId === driver.id);
  const initials = driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = DRIVER_COLOR[driver.status];

  const STATUS_LABEL: Record<DriverStatus, string> = {
    available: "Available",
    on_trip:   "On Trip",
    offline:   "Offline",
    suspended: "Suspended",
    emergency: "Emergency",
  };
  const STATUS_BG: Record<DriverStatus, string> = {
    available: "bg-emerald-50 text-emerald-700",
    on_trip:   "bg-blue-50 text-blue-700",
    offline:   "bg-gray-100 text-gray-500",
    suspended: "bg-orange-50 text-orange-700",
    emergency: "bg-red-50 text-red-700",
  };

  return (
    <div
      className="absolute top-0 right-0 h-full bg-white shadow-2xl z-[1000] flex flex-col border-l border-gray-100"
      style={{ width: 300 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{driver.name}</p>
            <p className="text-xs text-gray-400 font-mono">{driver.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Status + country */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_BG[driver.status])}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          {STATUS_LABEL[driver.status]}
        </span>
        <span className="text-xs text-gray-400">{getCountry(driver.country)?.flag} {getCountry(driver.country)?.name}</span>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Vehicle</p>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-sm font-medium text-gray-800">{driver.vehicle}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{driver.plate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{driver.rating}</p>
            <p className="text-[10px] text-gray-400">Rating</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{driver.totalTrips.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">Total Trips</p>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Contact</p>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-sm text-gray-800">{driver.phone}</p>
          </div>
        </div>

        {trip && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Active Trip</p>
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 space-y-2">
              <p className="text-xs font-mono font-semibold text-blue-700">{trip.id}</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <p className="text-xs text-gray-600">{trip.pickup.address}</p>
                </div>
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p className="text-xs text-gray-600">{trip.destination.address}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>ETA {trip.eta} min</span>
                <span className="text-gray-300">·</span>
                <span>{currencySymbol}{trip.fare.toLocaleString()}</span>
                <span className="text-gray-300">·</span>
                <span>{trip.distanceKm} km</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <a
          href={`/drivers/${driver.id}/personal`}
          className="flex w-full items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          View Full Profile
        </a>
        {driver.status === "emergency" && (
          <button className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
            Dispatch Support
          </button>
        )}
        {(driver.status === "available" || driver.status === "on_trip") && (
          <button className="flex w-full items-center justify-center rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors">
            Suspend Driver
          </button>
        )}
      </div>
    </div>
  );
}

// ── Incident Drawer ────────────────────────────────────────────────────────────
function IncidentDrawer({
  incident,
  onClose,
}: {
  incident: Incident;
  onClose: () => void;
}): React.ReactNode {
  const LABELS: Record<string, string> = {
    passenger_emergency:      "Passenger Emergency",
    driver_emergency:         "Driver Emergency",
    route_deviation:          "Route Deviation",
    prolonged_stop:           "Prolonged Stop",
    suspicious_cancellations: "Suspicious Cancellations",
  };
  const SEV_STYLE: Record<string, string> = {
    high:   "bg-red-50 text-red-700 border border-red-200",
    medium: "bg-orange-50 text-orange-700 border border-orange-200",
    low:    "bg-yellow-50 text-yellow-700 border border-yellow-200",
  };

  return (
    <div
      className="absolute top-0 right-0 h-full bg-white shadow-2xl z-[1000] flex flex-col border-l border-gray-100"
      style={{ width: 300 }}
    >
      <div className="flex items-start justify-between p-4 border-b border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">{LABELS[incident.type]}</p>
          <p className="text-xs font-mono text-gray-400 mt-0.5">{incident.id}</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className={cn("rounded-xl p-3", SEV_STYLE[incident.severity])}>
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-1">{incident.severity} severity</p>
          <p className="text-sm leading-relaxed">{incident.description}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Country</p>
            <p className="text-sm text-gray-700">{getCountry(incident.country)?.flag} {getCountry(incident.country)?.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Coordinates</p>
            <p className="text-sm font-mono text-gray-700">{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Reported At</p>
            <p className="text-sm text-gray-700">{new Date(incident.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
          Escalate Incident
        </button>
        <button className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Mark Resolved
        </button>
      </div>
    </div>
  );
}

// ── Main MapViewClient ─────────────────────────────────────────────────────────
type ActiveLayer = "drivers" | "trips" | "heatmap" | "zones" | "incidents";

export default function MapViewClient(): React.ReactNode {
  const [selectedCountry, setSelectedCountry] = useState<string | "all">("NG");
  const [activeLayers, setActiveLayers] = useState<Set<ActiveLayer>>(
    new Set(["drivers", "trips", "incidents"])
  );
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");
  const [selectedDriver, setSelectedDriver] = useState<LiveDriver | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const countryConfig: CountryConfig | undefined = useMemo(
    () => (selectedCountry === "all" ? undefined : getCountry(selectedCountry)),
    [selectedCountry]
  );

  const flyTarget = useMemo((): { center: [number, number]; zoom: number } => {
    return countryConfig
      ? { center: countryConfig.center, zoom: countryConfig.zoom }
      : ALL_COUNTRIES_VIEW;
  }, [countryConfig]);

  const currencySymbol = countryConfig?.currencySymbol ?? "";

  // Filter all data by selected country
  const filteredDrivers = useMemo(() => {
    const byCountry = selectedCountry === "all"
      ? MOCK_DRIVERS
      : MOCK_DRIVERS.filter((d) => d.country === selectedCountry);
    return statusFilter === "all" ? byCountry : byCountry.filter((d) => d.status === statusFilter);
  }, [selectedCountry, statusFilter]);

  const filteredTrips = useMemo(
    () => selectedCountry === "all" ? MOCK_ACTIVE_TRIPS : MOCK_ACTIVE_TRIPS.filter((t) => t.country === selectedCountry),
    [selectedCountry]
  );

  const filteredIncidents = useMemo(
    () => selectedCountry === "all" ? MOCK_INCIDENTS : MOCK_INCIDENTS.filter((i) => i.country === selectedCountry),
    [selectedCountry]
  );

  const filteredHeatmap = useMemo(
    () => selectedCountry === "all" ? MOCK_HEATMAP_POINTS : MOCK_HEATMAP_POINTS.filter((p) => p.country === selectedCountry),
    [selectedCountry]
  );

  const filteredZones = useMemo(
    () => selectedCountry === "all" ? MOCK_ZONES : MOCK_ZONES.filter((z) => z.country === selectedCountry),
    [selectedCountry]
  );

  const stats = useMemo(() => {
    const pool = selectedCountry === "all" ? MOCK_DRIVERS : MOCK_DRIVERS.filter((d) => d.country === selectedCountry);
    return {
      available:   pool.filter((d) => d.status === "available").length,
      on_trip:     pool.filter((d) => d.status === "on_trip").length,
      offline:     pool.filter((d) => d.status === "offline").length,
      emergency:   pool.filter((d) => d.status === "emergency").length,
      activeTrips: filteredTrips.length,
      incidents:   filteredIncidents.length,
    };
  }, [selectedCountry, filteredTrips, filteredIncidents]);

  const toggleLayer = (layer: ActiveLayer): void => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer); else next.add(layer);
      return next;
    });
  };

  const handleCountryChange = (code: string | "all"): void => {
    setSelectedCountry(code);
    setSelectedDriver(null);
    setSelectedIncident(null);
    setStatusFilter("all");
  };

  const closeDrawers = (): void => {
    setSelectedDriver(null);
    setSelectedIncident(null);
  };

  const LAYER_BTNS: { id: ActiveLayer; label: string; color: string }[] = [
    { id: "drivers",   label: "Drivers",   color: "#16a34a" },
    { id: "trips",     label: "Trips",     color: "#2563eb" },
    { id: "heatmap",   label: "Heatmap",   color: "#ea580c" },
    { id: "zones",     label: "Zones",     color: "#7c3aed" },
    { id: "incidents", label: "Incidents", color: "#dc2626" },
  ];

  const STATUS_OPTS: { value: DriverStatus | "all"; label: string }[] = [
    { value: "all",       label: "All" },
    { value: "available", label: "Available" },
    { value: "on_trip",   label: "On Trip" },
    { value: "offline",   label: "Offline" },
    { value: "suspended", label: "Suspended" },
    { value: "emergency", label: "Emergency" },
  ];

  return (
    <div className="-mx-6 -my-6 relative overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      <style>{PULSE_CSS}</style>

      {/* Map */}
      <MapContainer
        center={flyTarget.center}
        zoom={flyTarget.zoom}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        <FlyToCountry center={flyTarget.center} zoom={flyTarget.zoom} />
        <MapClickHandler onMapClick={closeDrawers} />

        {/* Drivers */}
        {activeLayers.has("drivers") &&
          filteredDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={[driver.lat, driver.lng]}
              icon={makeDriverIcon(driver)}
              eventHandlers={{
                click(e) {
                  e.originalEvent.stopPropagation();
                  setSelectedIncident(null);
                  setSelectedDriver(driver);
                },
              }}
            />
          ))}

        {/* Trips */}
        {activeLayers.has("trips") &&
          filteredTrips.flatMap((trip) => [
            <Polyline
              key={`${trip.id}-line`}
              positions={[
                [trip.pickup.lat, trip.pickup.lng],
                [trip.driverLat, trip.driverLng],
                [trip.destination.lat, trip.destination.lng],
              ]}
              color="#2563eb"
              weight={3}
              opacity={0.65}
              dashArray="6 5"
            />,
            <CircleMarker
              key={`${trip.id}-pickup`}
              center={[trip.pickup.lat, trip.pickup.lng]}
              radius={6}
              fillColor="#22c55e"
              fillOpacity={1}
              color="#fff"
              weight={2}
            />,
            <CircleMarker
              key={`${trip.id}-dest`}
              center={[trip.destination.lat, trip.destination.lng]}
              radius={6}
              fillColor="#ef4444"
              fillOpacity={1}
              color="#fff"
              weight={2}
            />,
          ])}

        {/* Heatmap */}
        {activeLayers.has("heatmap") &&
          filteredHeatmap.map((pt, i) => (
            <CircleMarker
              key={`heat-${i}`}
              center={[pt.lat, pt.lng]}
              radius={pt.intensity * 20}
              fillColor="#f97316"
              fillOpacity={0.06 * pt.intensity}
              stroke={false}
            />
          ))}

        {/* Zones */}
        {activeLayers.has("zones") &&
          filteredZones.map((zone) => {
            const style = ZONE_STYLE[zone.type] ?? ZONE_STYLE.standard;
            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates.map(([lat, lng]) => [lat, lng] as [number, number])}
                fillColor={style.fill}
                fillOpacity={0.14}
                color={style.stroke}
                weight={2}
                dashArray="4 3"
              />
            );
          })}

        {/* Incidents */}
        {activeLayers.has("incidents") &&
          filteredIncidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={makeIncidentIcon(inc.type)}
              eventHandlers={{
                click(e) {
                  e.originalEvent.stopPropagation();
                  setSelectedDriver(null);
                  setSelectedIncident(inc);
                },
              }}
            />
          ))}
      </MapContainer>

      {/* ── Top-left controls ── */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-none">
        {/* Country switcher */}
        <div className="pointer-events-auto">
          <CountrySwitcher selected={selectedCountry} onChange={handleCountryChange} />
        </div>

        {/* Layer toggles */}
        <div className="flex gap-1 rounded-xl bg-white/95 shadow-lg border border-gray-200/80 p-1.5 backdrop-blur-sm pointer-events-auto">
          {LAYER_BTNS.map((btn) => {
            const active = activeLayers.has(btn.id);
            return (
              <button
                key={btn.id}
                onClick={() => toggleLayer(btn.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                  active ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
                style={active ? { background: btn.color } : {}}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Status filter */}
        {activeLayers.has("drivers") && (
          <div className="flex gap-1 rounded-xl bg-white/95 shadow-lg border border-gray-200/80 p-1.5 backdrop-blur-sm pointer-events-auto">
            {STATUS_OPTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150",
                  statusFilter === opt.value
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Zone legend (top-right, only when zones are on) ── */}
      {activeLayers.has("zones") && (
        <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
          <div className="rounded-xl bg-white/95 shadow-lg border border-gray-200/80 p-3 backdrop-blur-sm space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Zone Legend</p>
            {[
              { type: "airport",    label: "Airport Zone",    color: "#1d4ed8" },
              { type: "premium",    label: "Premium Zone",    color: "#7e22ce" },
              { type: "no_service", label: "No-Service Zone", color: "#b91c1c" },
              { type: "standard",   label: "Standard Zone",   color: "#15803d" },
            ].map((z) => (
              <div key={z.type} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm border-2" style={{ borderColor: z.color, background: `${z.color}22` }} />
                <span className="text-xs text-gray-600">{z.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom stats bar ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <div className="flex items-center rounded-xl bg-white/95 shadow-lg border border-gray-200/80 overflow-hidden backdrop-blur-sm">
          {countryConfig && (
            <div className="border-r border-gray-100 px-4 py-2.5 flex items-center gap-1.5">
              <span className="text-base leading-none">{countryConfig.flag}</span>
              <span className="text-xs font-semibold text-gray-700">{countryConfig.name}</span>
            </div>
          )}
          {[
            { dot: "#16a34a", label: "Available", count: stats.available },
            { dot: "#2563eb", label: "On Trip",   count: stats.on_trip },
            { dot: "#9ca3af", label: "Offline",   count: stats.offline },
            { dot: "#dc2626", label: "SOS",       count: stats.emergency },
          ].map((s, i) => (
            <div key={s.label} className={cn("flex items-center gap-1.5 px-4 py-2.5", i > 0 && "border-l border-gray-100")}>
              <div className="h-2 w-2 rounded-full" style={{ background: s.dot }} />
              <span className="text-xs text-gray-500 whitespace-nowrap">{s.label}</span>
              <span className="text-xs font-bold text-gray-900">{s.count}</span>
            </div>
          ))}
          <div className="border-l border-gray-100 px-4 py-2.5 flex items-center gap-1.5">
            <span className="text-xs text-gray-500 whitespace-nowrap">Active Trips</span>
            <span className="text-xs font-bold text-blue-700">{stats.activeTrips}</span>
          </div>
          <div className="border-l border-gray-100 px-4 py-2.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-gray-500 whitespace-nowrap">Incidents</span>
            <span className="text-xs font-bold text-red-700">{stats.incidents}</span>
          </div>
          <div className="border-l border-gray-100 px-4 py-2.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 tracking-wide">LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Right drawers ── */}
      {selectedDriver && (
        <DriverDrawer
          driver={selectedDriver}
          currencySymbol={currencySymbol}
          onClose={() => setSelectedDriver(null)}
        />
      )}
      {selectedIncident && (
        <IncidentDrawer incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      )}
    </div>
  );
}
