import type { PreferenceDoc } from '../models/Preference.js';
import type { VehicleDoc } from '../models/Vehicle.js';
import { financeLoan } from './finance.js';

export type ReasonTag =
  | 'Great for long commutes'
  | 'Lower long-term fuel cost'
  | 'Max space under budget'
  | 'High safety rating'
  | 'EV-friendly home charging'
  | 'AWD for mixed terrain'
  | 'Tech-forward';

export function scoreVehicle(v: VehicleDoc, p: PreferenceDoc) {
  let score = 0;
  const reasons: ReasonTag[] = [];

  // Budget fit (estimate naive monthly: 6% APR, 60 mo, 10% down)
  if (p.budgetMonthly) {
    const est = financeLoan(v.msrp, 6, 60, v.msrp * 0.1).monthly;
    const ratio = p.budgetMonthly / Math.max(est, 1);
    const s = Math.min(ratio, 1); // if est <= budget → 1
    score += s * 0.35;
    if (s > 0.8) reasons.push('Max space under budget');
  }

  // Fuel/commute fit
  if (p.commuteMilesDaily) {
    if (v.fuelType === 'hybrid' && (v.mpgHwy || v.mpgCity)) {
      score += 0.12;
      reasons.push('Lower long-term fuel cost');
      reasons.push('Great for long commutes');
    }
    if (v.fuelType === 'ev' && (v.batteryRangeMi || 0) >= p.commuteMilesDaily * 5) {
      score += 0.12;
      reasons.push('Lower long-term fuel cost');
      reasons.push('Great for long commutes');
    }
  }

  // Charging access + EV fit
  if (p.chargingAccess !== 'none' && v.fuelType === 'ev') {
    score += 0.1;
    reasons.push('EV-friendly home charging');
  }

  // Family/use-case fit
  if (p.familySize && v.seats && v.seats >= Math.min(5, p.familySize)) {
    score += 0.12;
    if (['suv','minivan'].includes(v.bodyStyle)) reasons.push('Max space under budget');
  }

  // Terrain
  if ((p.lifestyleTags || []).includes('adventure') && v.drivetrain === 'AWD') {
    score += 0.08; reasons.push('AWD for mixed terrain');
  }

  // Tech & safety
  if ((p.lifestyleTags || []).includes('tech') && (v.features || []).some(f => ['ACC','LKA','HUD','CarPlay','AndroidAuto'].includes(f))) {
    score += 0.08; reasons.push('Tech-forward');
  }
  if ((v.safetyRating || 0) >= 4) { score += 0.05; reasons.push('High safety rating'); }

  return { score: Math.max(0, Math.min(1, score)), reasons: Array.from(new Set(reasons)) };
}
