import type { PreferenceDoc, VehicleDoc } from './match.js';

// Placeholder: synthesize a preference string (later embed with Gemini & Atlas Vector Search)
export function synthesizePrefText(p: PreferenceDoc) {
  return `Budget ${p.budgetMonthly}/mo, prefers ${p.fuelType}, ${p.bodyStyle}, family ${p.familySize}, commute ${p.commuteMilesDaily} mi/day, lifestyle ${p.lifestyleTags?.join(',')}`;
}

// For now, we return identity (no vector search) — the final ranking relies on rule score.
export async function vectorRankFallback(vehicles: VehicleDoc[], _prefs: PreferenceDoc) {
  return vehicles; // No reordering until embedding is enabled
}
