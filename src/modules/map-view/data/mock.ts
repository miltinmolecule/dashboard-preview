export type DriverStatus = "available" | "on_trip" | "offline" | "suspended" | "emergency";
export type TripStatus = "requested" | "accepted" | "arriving" | "in_progress";
export type IncidentType =
  | "passenger_emergency"
  | "driver_emergency"
  | "route_deviation"
  | "prolonged_stop"
  | "suspicious_cancellations";
export type ZoneType = "airport" | "no_service" | "premium" | "standard";

export interface LiveDriver {
  id: string;
  name: string;
  status: DriverStatus;
  lat: number;
  lng: number;
  vehicle: string;
  plate: string;
  rating: number;
  phone: string;
  lastUpdated: string;
  currentTripId?: string;
  totalTrips: number;
  country: string; // ISO-3166-1 alpha-2
}

export interface ActiveTrip {
  id: string;
  driverId: string;
  driverName: string;
  riderName: string;
  status: TripStatus;
  pickup: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  driverLat: number;
  driverLng: number;
  eta: number;
  fare: number;
  distanceKm: number;
  country: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  lat: number;
  lng: number;
  description: string;
  createdAt: string;
  severity: "low" | "medium" | "high";
  country: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  country: string;
}

export interface ServiceZone {
  id: string;
  name: string;
  type: ZoneType;
  coordinates: [number, number][];
  pricingMultiplier: number;
  country: string;
}

// ── Drivers ────────────────────────────────────────────────────────────────────
export const MOCK_DRIVERS: LiveDriver[] = [
  // Nigeria — Lagos
  { id: "drv_NG_L01", name: "Emeka Okonkwo",  country: "NG", status: "available",  lat: 6.4550, lng: 3.3841, vehicle: "Toyota Camry 2020",    plate: "LND-401-KJA", rating: 4.8, phone: "+234 803 456 7890", lastUpdated: "2 min ago",  totalTrips: 412 },
  { id: "drv_NG_L02", name: "Amina Bello",     country: "NG", status: "on_trip",    lat: 6.5954, lng: 3.3364, vehicle: "Honda Accord 2021",    plate: "LGA-218-ABC", rating: 4.9, phone: "+234 806 987 6543", lastUpdated: "Just now",   totalTrips: 587, currentTripId: "TRP-NG-0044" },
  { id: "drv_NG_L03", name: "Ngozi Ikenna",    country: "NG", status: "available",  lat: 6.5238, lng: 3.3790, vehicle: "Kia Cerato 2019",      plate: "LGA-744-XYZ", rating: 4.6, phone: "+234 814 222 3344", lastUpdated: "5 min ago",  totalTrips: 238 },
  { id: "drv_NG_L04", name: "Suleiman Musa",   country: "NG", status: "offline",    lat: 6.4698, lng: 3.5852, vehicle: "Toyota Corolla 2018",  plate: "EPE-119-GHI", rating: 4.7, phone: "+234 808 777 8899", lastUpdated: "2 hrs ago",  totalTrips: 310 },
  { id: "drv_NG_L05", name: "Chukwudi Obi",    country: "NG", status: "on_trip",    lat: 6.5016, lng: 3.3516, vehicle: "Hyundai Elantra 2020", plate: "LGA-566-MNO", rating: 4.5, phone: "+234 811 333 4455", lastUpdated: "Just now",   totalTrips: 195, currentTripId: "TRP-NG-0045" },
  { id: "drv_NG_L06", name: "Fatima Adamu",    country: "NG", status: "available",  lat: 6.3750, lng: 3.5180, vehicle: "Toyota Yaris 2021",    plate: "EPE-302-PQR", rating: 4.8, phone: "+234 815 888 9900", lastUpdated: "1 min ago",  totalTrips: 524 },
  { id: "drv_NG_L07", name: "Bolu Adeola",     country: "NG", status: "emergency",  lat: 6.6018, lng: 3.3516, vehicle: "Honda Civic 2019",     plate: "LGA-987-STU", rating: 4.3, phone: "+234 817 234 5678", lastUpdated: "Just now",   totalTrips: 167, currentTripId: "TRP-NG-0046" },
  { id: "drv_NG_L08", name: "Kunle Adeyemi",   country: "NG", status: "suspended",  lat: 6.4423, lng: 3.4190, vehicle: "Nissan Altima 2020",   plate: "LGA-123-VWX", rating: 3.8, phone: "+234 809 111 2233", lastUpdated: "3 hrs ago",  totalTrips: 89 },
  // Nigeria — Abuja
  { id: "drv_NG_A01", name: "Grace Okonkwo",   country: "NG", status: "available",  lat: 9.0579, lng: 7.4951, vehicle: "Toyota Corolla 2021",  plate: "ABJ-771-AAA", rating: 4.9, phone: "+234 816 800 9900", lastUpdated: "3 min ago",  totalTrips: 621 },
  { id: "drv_NG_A02", name: "Ibrahim Musa",    country: "NG", status: "on_trip",    lat: 9.0846, lng: 7.4835, vehicle: "Lexus ES350 2020",     plate: "ABJ-290-BBB", rating: 4.7, phone: "+234 803 500 6600", lastUpdated: "Just now",   totalTrips: 445, currentTripId: "TRP-NG-0047" },

  // Ghana — Accra
  { id: "drv_GH_001", name: "Kwame Mensah",    country: "GH", status: "available",  lat: 5.6037, lng: -0.1870, vehicle: "Toyota Corolla 2020", plate: "GR-1234-21", rating: 4.7, phone: "+233 24 123 4567", lastUpdated: "3 min ago",  totalTrips: 318 },
  { id: "drv_GH_002", name: "Ama Owusu",       country: "GH", status: "on_trip",    lat: 5.5730, lng: -0.2060, vehicle: "Hyundai i20 2021",   plate: "GR-5678-21", rating: 4.8, phone: "+233 20 987 6543", lastUpdated: "Just now",   totalTrips: 421, currentTripId: "TRP-GH-0001" },
  { id: "drv_GH_003", name: "Kofi Asante",     country: "GH", status: "offline",    lat: 5.6200, lng: -0.1650, vehicle: "Honda Fit 2019",     plate: "GR-9012-20", rating: 4.5, phone: "+233 27 555 7890", lastUpdated: "1 hr ago",   totalTrips: 192 },
  { id: "drv_GH_004", name: "Abena Boateng",   country: "GH", status: "available",  lat: 5.5910, lng: -0.2230, vehicle: "Kia Picanto 2022",   plate: "GR-3456-22", rating: 4.9, phone: "+233 26 444 3210", lastUpdated: "7 min ago",  totalTrips: 537 },

  // Kenya — Nairobi
  { id: "drv_KE_001", name: "Kamau Njoroge",   country: "KE", status: "available",  lat: -1.2921, lng: 36.8219, vehicle: "Toyota Probox 2020",  plate: "KCB 123A", rating: 4.6, phone: "+254 712 345 678", lastUpdated: "4 min ago",  totalTrips: 276 },
  { id: "drv_KE_002", name: "Wanjiru Mwangi",  country: "KE", status: "on_trip",    lat: -1.3090, lng: 36.8516, vehicle: "Nissan Note 2021",    plate: "KDD 456B", rating: 4.8, phone: "+254 722 876 543", lastUpdated: "Just now",   totalTrips: 389, currentTripId: "TRP-KE-0001" },
  { id: "drv_KE_003", name: "Otieno Odhiambo", country: "KE", status: "offline",    lat: -1.2765, lng: 36.8050, vehicle: "Toyota Vitz 2018",    plate: "KDE 789C", rating: 4.4, phone: "+254 733 111 222", lastUpdated: "5 hrs ago",  totalTrips: 143 },
  { id: "drv_KE_004", name: "Akinyi Oloo",     country: "KE", status: "available",  lat: -1.3180, lng: 36.7960, vehicle: "Mazda Demio 2021",    plate: "KDF 012D", rating: 4.7, phone: "+254 700 333 444", lastUpdated: "2 min ago",  totalTrips: 461 },

  // South Africa — Johannesburg
  { id: "drv_ZA_001", name: "Sipho Dlamini",   country: "ZA", status: "available",  lat: -26.2041, lng: 28.0473, vehicle: "Toyota Fortuner 2021", plate: "GP 12-34-AB", rating: 4.8, phone: "+27 71 234 5678", lastUpdated: "2 min ago",  totalTrips: 534 },
  { id: "drv_ZA_002", name: "Nomsa Khumalo",   country: "ZA", status: "on_trip",    lat: -26.1816, lng: 28.0285, vehicle: "VW Polo 2022",         plate: "GP 56-78-CD", rating: 4.9, phone: "+27 82 987 6543", lastUpdated: "Just now",   totalTrips: 612, currentTripId: "TRP-ZA-0001" },
  { id: "drv_ZA_003", name: "Thabo Mokoena",   country: "ZA", status: "offline",    lat: -26.2200, lng: 28.0650, vehicle: "Ford Figo 2020",       plate: "GP 90-12-EF", rating: 4.3, phone: "+27 76 444 5555", lastUpdated: "3 hrs ago",  totalTrips: 198 },
  { id: "drv_ZA_004", name: "Lerato Sithole",  country: "ZA", status: "available",  lat: -26.1950, lng: 28.0120, vehicle: "Hyundai Accent 2021",  plate: "GP 34-56-GH", rating: 4.7, phone: "+27 83 777 8888", lastUpdated: "8 min ago",  totalTrips: 347 },

  // Egypt — Cairo
  { id: "drv_EG_001", name: "Ahmed Hassan",    country: "EG", status: "available",  lat: 30.0444, lng: 31.2357, vehicle: "Toyota Yaris 2021",  plate: "أ ب ج 123", rating: 4.7, phone: "+20 100 123 4567", lastUpdated: "5 min ago",  totalTrips: 428 },
  { id: "drv_EG_002", name: "Sara Mohamed",    country: "EG", status: "on_trip",    lat: 30.0600, lng: 31.2500, vehicle: "Hyundai Accent 2020", plate: "د هـ و 456", rating: 4.8, phone: "+20 111 987 6543", lastUpdated: "Just now",   totalTrips: 319, currentTripId: "TRP-EG-0001" },
  { id: "drv_EG_003", name: "Omar Farouk",     country: "EG", status: "offline",    lat: 30.0310, lng: 31.2180, vehicle: "Kia Cerato 2019",    plate: "ز ح ط 789", rating: 4.5, phone: "+20 122 555 6666", lastUpdated: "2 hrs ago",  totalTrips: 214 },
  { id: "drv_EG_004", name: "Nadia Khalil",    country: "EG", status: "available",  lat: 30.0720, lng: 31.2650, vehicle: "VW Polo 2022",       plate: "ي ك ل 012", rating: 4.9, phone: "+20 100 777 8888", lastUpdated: "1 min ago",  totalTrips: 581 },
];

// ── Active Trips ───────────────────────────────────────────────────────────────
export const MOCK_ACTIVE_TRIPS: ActiveTrip[] = [
  // Nigeria
  {
    id: "TRP-NG-0044", country: "NG", driverId: "drv_NG_L02", driverName: "Amina Bello", riderName: "Tunde Bakare",
    status: "in_progress",
    pickup:      { lat: 6.6100, lng: 3.3200, address: "Ikeja GRA, Lagos" },
    destination: { lat: 6.4281, lng: 3.4219, address: "Victoria Island, Lagos" },
    driverLat: 6.5954, driverLng: 3.3364, eta: 22, fare: 3200, distanceKm: 24.5,
  },
  {
    id: "TRP-NG-0045", country: "NG", driverId: "drv_NG_L05", driverName: "Chukwudi Obi", riderName: "Chidinma Okafor",
    status: "arriving",
    pickup:      { lat: 6.5100, lng: 3.3400, address: "Surulere, Lagos" },
    destination: { lat: 6.4500, lng: 3.4000, address: "Ikoyi, Lagos" },
    driverLat: 6.5016, driverLng: 3.3516, eta: 5, fare: 2800, distanceKm: 18.2,
  },
  {
    id: "TRP-NG-0046", country: "NG", driverId: "drv_NG_L07", driverName: "Bolu Adeola", riderName: "Emmanuel Nwosu",
    status: "in_progress",
    pickup:      { lat: 6.6050, lng: 3.3480, address: "Ojota, Lagos" },
    destination: { lat: 6.5800, lng: 3.3200, address: "Ketu, Lagos" },
    driverLat: 6.6018, driverLng: 3.3516, eta: 8, fare: 1500, distanceKm: 6.5,
  },
  {
    id: "TRP-NG-0047", country: "NG", driverId: "drv_NG_A02", driverName: "Ibrahim Musa", riderName: "Aisha Yusuf",
    status: "in_progress",
    pickup:      { lat: 9.0900, lng: 7.4800, address: "Maitama, Abuja" },
    destination: { lat: 9.0400, lng: 7.5100, address: "Garki II, Abuja" },
    driverLat: 9.0846, driverLng: 7.4835, eta: 14, fare: 2100, distanceKm: 12.8,
  },
  // Ghana
  {
    id: "TRP-GH-0001", country: "GH", driverId: "drv_GH_002", driverName: "Ama Owusu", riderName: "Kwesi Boateng",
    status: "in_progress",
    pickup:      { lat: 5.5800, lng: -0.2100, address: "Osu, Accra" },
    destination: { lat: 5.6200, lng: -0.1720, address: "Adenta, Accra" },
    driverLat: 5.5730, driverLng: -0.2060, eta: 16, fare: 45, distanceKm: 11.2,
  },
  // Kenya
  {
    id: "TRP-KE-0001", country: "KE", driverId: "drv_KE_002", driverName: "Wanjiru Mwangi", riderName: "John Kamau",
    status: "in_progress",
    pickup:      { lat: -1.3000, lng: 36.8400, address: "Kilimani, Nairobi" },
    destination: { lat: -1.2690, lng: 36.8124, address: "Westlands, Nairobi" },
    driverLat: -1.3090, driverLng: 36.8516, eta: 11, fare: 380, distanceKm: 7.8,
  },
  // South Africa
  {
    id: "TRP-ZA-0001", country: "ZA", driverId: "drv_ZA_002", driverName: "Nomsa Khumalo", riderName: "Pieter van Wyk",
    status: "in_progress",
    pickup:      { lat: -26.1900, lng: 28.0320, address: "Sandton, Johannesburg" },
    destination: { lat: -26.2100, lng: 28.0600, address: "Rosebank, Johannesburg" },
    driverLat: -26.1816, driverLng: 28.0285, eta: 9, fare: 120, distanceKm: 5.4,
  },
  // Egypt
  {
    id: "TRP-EG-0001", country: "EG", driverId: "drv_EG_002", driverName: "Sara Mohamed", riderName: "Youssef Ali",
    status: "in_progress",
    pickup:      { lat: 30.0550, lng: 31.2420, address: "Zamalek, Cairo" },
    destination: { lat: 30.0750, lng: 31.2600, address: "Heliopolis, Cairo" },
    driverLat: 30.0600, driverLng: 31.2500, eta: 19, fare: 95, distanceKm: 8.9,
  },
];

// ── Incidents ──────────────────────────────────────────────────────────────────
export const MOCK_INCIDENTS: Incident[] = [
  { id: "INC-NG-001", country: "NG", type: "driver_emergency",         lat: 6.6018,  lng: 3.3516,  description: "Driver Bolu Adeola triggered SOS — Ojota, Lagos.",                    createdAt: "2026-04-16T09:14:00Z", severity: "high" },
  { id: "INC-NG-002", country: "NG", type: "route_deviation",          lat: 6.4698,  lng: 3.5852,  description: "Active trip deviated from expected route near Lekki.",                 createdAt: "2026-04-16T08:55:00Z", severity: "medium" },
  { id: "INC-NG-003", country: "NG", type: "suspicious_cancellations", lat: 6.5158,  lng: 3.3739,  description: "Cluster of 7 cancellations in the last 15 min around Yaba.",           createdAt: "2026-04-16T09:08:00Z", severity: "medium" },
  { id: "INC-GH-001", country: "GH", type: "prolonged_stop",           lat: 5.5810,  lng: -0.2050, description: "Trip TRP-GH-0001 stationary for 10+ min near Osu roundabout.",         createdAt: "2026-04-16T09:05:00Z", severity: "low" },
  { id: "INC-GH-002", country: "GH", type: "passenger_emergency",      lat: 5.6050,  lng: -0.1730, description: "Passenger SOS triggered on Legon road, Accra.",                        createdAt: "2026-04-16T09:18:00Z", severity: "high" },
  { id: "INC-KE-001", country: "KE", type: "route_deviation",          lat: -1.3050, lng: 36.8460, description: "Trip deviated toward Kibera — possible wrong turn.",                   createdAt: "2026-04-16T09:01:00Z", severity: "medium" },
  { id: "INC-ZA-001", country: "ZA", type: "driver_emergency",         lat: -26.1850, lng: 28.0310, description: "Driver SOS in Sandton area — dispatch requested.",                   createdAt: "2026-04-16T09:11:00Z", severity: "high" },
  { id: "INC-EG-001", country: "EG", type: "suspicious_cancellations", lat: 30.0580,  lng: 31.2440, description: "5 cancellations in 10 min near Zamalek — reviewing driver accounts.", createdAt: "2026-04-16T09:09:00Z", severity: "medium" },
];

// ── Heatmap ────────────────────────────────────────────────────────────────────
export const MOCK_HEATMAP_POINTS: HeatmapPoint[] = [
  // Nigeria
  { country: "NG", lat: 6.4550, lng: 3.3841, intensity: 5 },
  { country: "NG", lat: 6.4698, lng: 3.5852, intensity: 4 },
  { country: "NG", lat: 6.5954, lng: 3.3364, intensity: 4 },
  { country: "NG", lat: 6.5238, lng: 3.3790, intensity: 3 },
  { country: "NG", lat: 6.5016, lng: 3.3516, intensity: 3 },
  { country: "NG", lat: 6.5158, lng: 3.3739, intensity: 4 },
  { country: "NG", lat: 9.0579, lng: 7.4951, intensity: 3 },
  { country: "NG", lat: 9.0846, lng: 7.4835, intensity: 2 },
  // Ghana
  { country: "GH", lat: 5.6037, lng: -0.1870, intensity: 5 },
  { country: "GH", lat: 5.5730, lng: -0.2060, intensity: 4 },
  { country: "GH", lat: 5.6200, lng: -0.1650, intensity: 3 },
  { country: "GH", lat: 5.5910, lng: -0.2230, intensity: 3 },
  // Kenya
  { country: "KE", lat: -1.2921, lng: 36.8219, intensity: 5 },
  { country: "KE", lat: -1.3090, lng: 36.8516, intensity: 4 },
  { country: "KE", lat: -1.2765, lng: 36.8050, intensity: 3 },
  { country: "KE", lat: -1.3180, lng: 36.7960, intensity: 2 },
  // South Africa
  { country: "ZA", lat: -26.2041, lng: 28.0473, intensity: 5 },
  { country: "ZA", lat: -26.1816, lng: 28.0285, intensity: 4 },
  { country: "ZA", lat: -26.2200, lng: 28.0650, intensity: 3 },
  { country: "ZA", lat: -26.1950, lng: 28.0120, intensity: 3 },
  // Egypt
  { country: "EG", lat: 30.0444, lng: 31.2357, intensity: 5 },
  { country: "EG", lat: 30.0600, lng: 31.2500, intensity: 4 },
  { country: "EG", lat: 30.0310, lng: 31.2180, intensity: 3 },
  { country: "EG", lat: 30.0720, lng: 31.2650, intensity: 3 },
];

// ── Service Zones ──────────────────────────────────────────────────────────────
export const MOCK_ZONES: ServiceZone[] = [
  // Nigeria
  {
    id: "zone_NG_001", country: "NG", name: "Murtala Mohammed Airport", type: "airport", pricingMultiplier: 1.5,
    coordinates: [[6.5790, 3.3210], [6.5850, 3.3350], [6.5780, 3.3450], [6.5720, 3.3400], [6.5700, 3.3250], [6.5790, 3.3210]],
  },
  {
    id: "zone_NG_002", country: "NG", name: "Victoria Island Premium", type: "premium", pricingMultiplier: 1.3,
    coordinates: [[6.4200, 3.4000], [6.4350, 3.4400], [6.4100, 3.4500], [6.4000, 3.4200], [6.4100, 3.3950], [6.4200, 3.4000]],
  },
  // Ghana
  {
    id: "zone_GH_001", country: "GH", name: "Kotoka International Airport", type: "airport", pricingMultiplier: 1.4,
    coordinates: [[5.6060, -0.1680], [5.6120, -0.1560], [5.6030, -0.1480], [5.5960, -0.1580], [5.5990, -0.1700], [5.6060, -0.1680]],
  },
  {
    id: "zone_GH_002", country: "GH", name: "Cantonments Premium Zone", type: "premium", pricingMultiplier: 1.25,
    coordinates: [[5.5820, -0.1920], [5.5900, -0.1750], [5.5780, -0.1660], [5.5700, -0.1820], [5.5820, -0.1920]],
  },
  // Kenya
  {
    id: "zone_KE_001", country: "KE", name: "JKIA Airport Zone", type: "airport", pricingMultiplier: 1.5,
    coordinates: [[-1.3186, 36.9254], [-1.3050, 36.9380], [-1.3150, 36.9490], [-1.3280, 36.9370], [-1.3186, 36.9254]],
  },
  {
    id: "zone_KE_002", country: "KE", name: "Westlands Premium", type: "premium", pricingMultiplier: 1.3,
    coordinates: [[-1.2650, 36.7980], [-1.2580, 36.8100], [-1.2700, 36.8180], [-1.2780, 36.8060], [-1.2650, 36.7980]],
  },
  // South Africa
  {
    id: "zone_ZA_001", country: "ZA", name: "O.R. Tambo Airport", type: "airport", pricingMultiplier: 1.5,
    coordinates: [[-26.1392, 28.2350], [-26.1280, 28.2520], [-26.1420, 28.2640], [-26.1540, 28.2470], [-26.1392, 28.2350]],
  },
  {
    id: "zone_ZA_002", country: "ZA", name: "Sandton CBD Premium", type: "premium", pricingMultiplier: 1.35,
    coordinates: [[-26.1060, 28.0520], [-26.1000, 28.0680], [-26.1120, 28.0760], [-26.1200, 28.0590], [-26.1060, 28.0520]],
  },
  // Egypt
  {
    id: "zone_EG_001", country: "EG", name: "Cairo International Airport", type: "airport", pricingMultiplier: 1.45,
    coordinates: [[30.1121, 31.3980], [30.1200, 31.4120], [30.1080, 31.4220], [30.0980, 31.4080], [30.1121, 31.3980]],
  },
  {
    id: "zone_EG_002", country: "EG", name: "Zamalek Premium Zone", type: "premium", pricingMultiplier: 1.3,
    coordinates: [[30.0590, 31.2190], [30.0650, 31.2310], [30.0560, 31.2380], [30.0490, 31.2260], [30.0590, 31.2190]],
  },
];
