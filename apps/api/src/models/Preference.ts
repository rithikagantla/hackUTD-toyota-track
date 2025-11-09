// MongoDB removed. Provide a plain TypeScript interface for preferences.
export interface PreferenceDoc {
  userSub?: string;
  budgetMonthly?: number;
  financeGoal?: 'lease'|'finance'|'undecided';
  zipcode?: string;
  fuelType?: 'gas'|'hybrid'|'ev'|'any';
  bodyStyle?: 'sedan'|'suv'|'truck'|'minivan'|'coupe'|'any';
  familySize?: number;
  commuteMilesDaily?: number;
  parking?: 'street'|'garage'|'driveway';
  chargingAccess?: 'none'|'120V'|'240V';
  drivingStyle?: 'calm'|'balanced'|'spirited';
  lifestyleTags?: string[];
}

// No model export; persistence is not used.
