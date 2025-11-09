import mongoose, { Schema } from 'mongoose';

const VehicleSchema = new Schema({
  make: { type: String, default: 'Toyota' },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  trim: { type: String, required: true },
  msrp: { type: Number, required: true },
  bodyStyle: { type: String, enum: ['sedan','suv','truck','minivan','coupe'], required: true },
  fuelType: { type: String, enum: ['gas','hybrid','ev'], required: true },
  mpgCity: Number,
  mpgHwy: Number,
  batteryRangeMi: Number,
  drivetrain: { type: String, enum: ['FWD','AWD','RWD'] },
  seats: Number,
  safetyRating: Number,
  features: [String],
  images: [String],
  specs: { type: Map, of: Schema.Types.Mixed },
  // Optional: vector for future Atlas Vector Search
  vector: { type: [Number], default: [] }
}, { timestamps: true });

export type VehicleDoc = mongoose.InferSchemaType<typeof VehicleSchema>;
export const Vehicle = mongoose.model('Vehicle', VehicleSchema);
