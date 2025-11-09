// MongoDB removed. Provide a plain TypeScript type for reuse.
export interface VehicleDoc {
  make?: string;
  model: string;
  year: number;
  trim: string;
  msrp: number;
  bodyStyle: 'sedan'|'suv'|'truck'|'minivan'|'coupe';
  fuelType: 'gas'|'hybrid'|'ev';
  mpgCity?: number;
  mpgHwy?: number;
  batteryRangeMi?: number;
  drivetrain?: 'FWD'|'AWD'|'RWD';
  seats?: number;
  safetyRating?: number;
  features?: string[];
  images?: string[];
  specs?: Record<string, any>;
  vector?: number[];
}

// No model export; persistence is not used.
