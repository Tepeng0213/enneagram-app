import surfaceEgoData from '../data/surfaceEgoTypes.json';

export interface SurfaceEgoEntry {
  core_type: string;
  core_name: string;
  ego_images: string[];
  strengths: string;
  weaknesses: string;
  healthy_status: string;
  unhealthy_status: string;
  defense_mechanism: {
    name: string;
    description: string;
  };
}

const ENTRIES = surfaceEgoData as SurfaceEgoEntry[];

export function lookupSurfaceEgo(coreType: number): SurfaceEgoEntry | undefined {
  const n = Number(coreType);
  if (!n) return undefined;
  return ENTRIES.find((e) => Number(e.core_type) === n);
}
