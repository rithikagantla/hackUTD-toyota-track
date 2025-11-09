import mongoose, { Schema } from 'mongoose';

const PreferenceSchema = new Schema({
  userSub: { type: String, index: true, required: true },
  budgetMonthly: Number,
  financeGoal: { type: String, enum: ['lease','finance','undecided'], default: 'undecided' },
  zipcode: String,
  fuelType: { type: String, enum: ['gas','hybrid','ev','any'], default: 'any' },
  bodyStyle: { type: String, enum: ['sedan','suv','truck','minivan','coupe','any'], default: 'any' },
  familySize: Number,
  commuteMilesDaily: Number,
  parking: { type: String, enum: ['street','garage','driveway'] },
  chargingAccess: { type: String, enum: ['none','120V','240V'], default: 'none' },
  drivingStyle: { type: String, enum: ['calm','balanced','spirited'], default: 'balanced' },
  lifestyleTags: [String]
}, { timestamps: true });

export type PreferenceDoc = mongoose.InferSchemaType<typeof PreferenceSchema>;
export const Preference = mongoose.model('Preference', PreferenceSchema);
