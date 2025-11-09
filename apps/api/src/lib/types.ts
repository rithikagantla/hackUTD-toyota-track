export type ListQuery = {
  fuelType?: 'gas'|'hybrid'|'ev';
  bodyStyle?: 'sedan'|'suv'|'truck'|'minivan'|'coupe';
  maxPrice?: number;
  q?: string;
};
