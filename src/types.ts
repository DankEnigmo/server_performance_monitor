// Cache-busting timestamp: 1737651016
export interface Server {
  name: string;
  address: string;
}

export interface StaticInfo {
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
  mem: {
    total: number;
    layout: {
      size: number;
      type: string;
      clockSpeed: number;
    }[];
  };
  gpus: {
    id: number;
    name: string;
    uuid: string;
    memoryTotal: number;
  }[];
  storage: {
    name: string;
    type: string;
    total: number;
    used: number;
  }[];
}

export interface GpuMetric {
  id: number;
  load: number;
  memoryUtil: number;
  memoryUsed: number;
  temperature: number;
}

export interface Metrics {
  ts: number;
  cpu: {
    percent: number;
    cores: number[];
    temperature: number | null;
  };
  ram: {
    percent: number;
    used: number;
    total: number;
  };
  gpu: GpuMetric[];
}