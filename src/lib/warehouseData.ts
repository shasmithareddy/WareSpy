// Simulated warehouse data and state management

export interface Worker {
  id: string;
  x: number;
  y: number;
  zone: string;
  activity: 'moving' | 'idle' | 'carrying';
  speed: number;
  hasPPE: boolean;
  fatigueLevel: number; // 0-100
  shiftHours: number;
}

export interface Zone {
  id: string;
  name: string;
  type: 'loading' | 'packing' | 'transit' | 'storage' | 'restricted';
  x: number;
  y: number;
  width: number;
  height: number;
  riskScore: number;
  congestionLevel: number;
  workerCount: number;
  avgActivity: number;
  ppeCompliance: number;
}

export interface Alert {
  id: string;
  type: 'ppe' | 'restricted' | 'congestion' | 'fatigue' | 'proximity' | 'prediction';
  severity: 'low' | 'medium' | 'high' | 'critical';
  zone: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
}

// Initial zones configuration
export const initialZones: Zone[] = [
  { id: 'zone-a', name: 'Loading Dock', type: 'loading', x: 0, y: 0, width: 30, height: 40, riskScore: 35, congestionLevel: 45, workerCount: 8, avgActivity: 76, ppeCompliance: 92 },
  { id: 'zone-b', name: 'Packing Area', type: 'packing', x: 30, y: 0, width: 40, height: 40, riskScore: 62, congestionLevel: 78, workerCount: 12, avgActivity: 89, ppeCompliance: 85 },
  { id: 'zone-c', name: 'Transit Corridor', type: 'transit', x: 70, y: 0, width: 30, height: 40, riskScore: 78, congestionLevel: 85, workerCount: 5, avgActivity: 94, ppeCompliance: 78 },
  { id: 'zone-d', name: 'Storage Bay', type: 'storage', x: 0, y: 40, width: 50, height: 60, riskScore: 22, congestionLevel: 25, workerCount: 3, avgActivity: 42, ppeCompliance: 96 },
  { id: 'zone-e', name: 'Restricted Area', type: 'restricted', x: 50, y: 40, width: 50, height: 30, riskScore: 88, congestionLevel: 15, workerCount: 1, avgActivity: 30, ppeCompliance: 100 },
  { id: 'zone-f', name: 'Dispatch Zone', type: 'loading', x: 50, y: 70, width: 50, height: 30, riskScore: 45, congestionLevel: 55, workerCount: 6, avgActivity: 82, ppeCompliance: 88 },
];

// Generate random workers
export const generateWorkers = (count: number): Worker[] => {
  const zones = ['zone-a', 'zone-b', 'zone-c', 'zone-d', 'zone-e', 'zone-f'];
  const activities: Worker['activity'][] = ['moving', 'idle', 'carrying'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `worker-${i + 1}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    zone: zones[Math.floor(Math.random() * zones.length)],
    activity: activities[Math.floor(Math.random() * activities.length)],
    speed: Math.random() * 5 + 1,
    hasPPE: Math.random() > 0.15,
    fatigueLevel: Math.random() * 100,
    shiftHours: Math.random() * 8,
  }));
};

// Generate heatmap data
export const generateHeatmap = (): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  
  // High traffic areas
  const hotspots = [
    { x: 35, y: 20, radius: 15, intensity: 0.9 },
    { x: 75, y: 15, radius: 12, intensity: 0.85 },
    { x: 55, y: 85, radius: 10, intensity: 0.7 },
    { x: 15, y: 25, radius: 8, intensity: 0.6 },
  ];
  
  for (let x = 0; x <= 100; x += 2) {
    for (let y = 0; y <= 100; y += 2) {
      let intensity = 0;
      hotspots.forEach(spot => {
        const dist = Math.sqrt(Math.pow(x - spot.x, 2) + Math.pow(y - spot.y, 2));
        if (dist < spot.radius * 2) {
          intensity += spot.intensity * Math.max(0, 1 - dist / (spot.radius * 2));
        }
      });
      if (intensity > 0.1) {
        points.push({ x, y, intensity: Math.min(1, intensity) });
      }
    }
  }
  
  return points;
};

// Generate initial alerts
export const generateAlerts = (): Alert[] => [
  { id: 'alert-1', type: 'ppe', severity: 'high', zone: 'Zone C - Transit', message: 'Worker detected without safety vest', timestamp: new Date(Date.now() - 120000), acknowledged: false },
  { id: 'alert-2', type: 'congestion', severity: 'medium', zone: 'Zone B - Packing', message: 'Congestion level exceeds 75% threshold', timestamp: new Date(Date.now() - 300000), acknowledged: false },
  { id: 'alert-3', type: 'restricted', severity: 'critical', zone: 'Zone E - Restricted', message: 'Unauthorized entry detected', timestamp: new Date(Date.now() - 60000), acknowledged: false },
  { id: 'alert-4', type: 'fatigue', severity: 'medium', zone: 'Zone B - Packing', message: 'Fatigue indicators rising (4+ hours active)', timestamp: new Date(Date.now() - 600000), acknowledged: true },
  { id: 'alert-5', type: 'prediction', severity: 'high', zone: 'Zone C - Transit', message: 'High accident risk predicted in next 10 minutes', timestamp: new Date(Date.now() - 30000), acknowledged: false },
  { id: 'alert-6', type: 'proximity', severity: 'medium', zone: 'Zone A - Loading', message: 'Worker proximity to forklift below safe distance', timestamp: new Date(Date.now() - 180000), acknowledged: true },
];

// What-If simulation logic
export interface SimulationResult {
  metric: string;
  before: number;
  after: number;
  change: number;
  improvement: boolean;
}

export const runSimulation = (action: string, zone: string): SimulationResult[] => {
  const simulations: Record<string, SimulationResult[]> = {
    'add-worker': [
      { metric: 'Congestion Level', before: 78, after: 65, change: -16.7, improvement: true },
      { metric: 'Average Wait Time', before: 12, after: 8, change: -33.3, improvement: true },
      { metric: 'Throughput', before: 85, after: 98, change: 15.3, improvement: true },
      { metric: 'Risk Score', before: 62, after: 55, change: -11.3, improvement: true },
    ],
    'reroute-path': [
      { metric: 'Congestion Level', before: 85, after: 67, change: -21.2, improvement: true },
      { metric: 'Walking Distance', before: 45, after: 38, change: -15.6, improvement: true },
      { metric: 'Transit Time', before: 8, after: 6, change: -25.0, improvement: true },
      { metric: 'Risk Score', before: 78, after: 58, change: -25.6, improvement: true },
    ],
    'reduce-density': [
      { metric: 'Congestion Level', before: 78, after: 52, change: -33.3, improvement: true },
      { metric: 'Safety Score', before: 72, after: 88, change: 22.2, improvement: true },
      { metric: 'Worker Comfort', before: 65, after: 85, change: 30.8, improvement: true },
      { metric: 'Risk Score', before: 62, after: 42, change: -32.3, improvement: true },
    ],
    'add-ppe-checkpoint': [
      { metric: 'PPE Compliance', before: 78, after: 96, change: 23.1, improvement: true },
      { metric: 'Safety Violations', before: 12, after: 3, change: -75.0, improvement: true },
      { metric: 'Risk Score', before: 78, after: 45, change: -42.3, improvement: true },
      { metric: 'Audit Score', before: 82, after: 95, change: 15.9, improvement: true },
    ],
  };
  
  return simulations[action] || simulations['add-worker'];
};

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
};

export const getActivityColor = (activity: Worker['activity']): string => {
  switch (activity) {
    case 'moving': return 'hsl(var(--primary))';
    case 'idle': return 'hsl(var(--blue-slate))';
    case 'carrying': return 'hsl(142 76% 36%)';
  }
};
