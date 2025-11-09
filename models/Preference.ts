import mongoose, { Schema } from 'mongoose';

export interface FinancialProfile {
  estimatedMonthlyIncome: number | null;
  existingMonthlyAutoPayment: number | null;
  existingMonthlyOtherLoans: number | null;
  totalMonthlyDebt: number;
  creditCardDebt: number | null;
  hasExistingAutoLoan: boolean;
  debtToIncomeRatio: number | null;
  analyzedAt: string;
}

export interface Recommendation {
  vehicleId: string;
  model: string;
  trim?: string;
  score?: number;
  summary?: string;
  rank?: number;
}

export interface PreferenceDoc {
  user: mongoose.Types.ObjectId;
  financialProfile?: FinancialProfile | null;
  lastRecommendations: Recommendation[];
  createdAt: Date;
  updatedAt: Date;
}

const financialProfileSchema = new Schema<FinancialProfile>(
  {
    estimatedMonthlyIncome: { type: Number, default: null },
    existingMonthlyAutoPayment: { type: Number, default: null },
    existingMonthlyOtherLoans: { type: Number, default: null },
    totalMonthlyDebt: { type: Number, required: true },
    creditCardDebt: { type: Number, default: null },
    hasExistingAutoLoan: { type: Boolean, required: true },
    debtToIncomeRatio: { type: Number, default: null },
    analyzedAt: { type: String, required: true }
  },
  { _id: false }
);

const recommendationSchema = new Schema<Recommendation>(
  {
    vehicleId: { type: String, required: true },
    model: { type: String, required: true },
    trim: { type: String },
    score: { type: Number },
    summary: { type: String },
    rank: { type: Number }
  },
  { _id: false }
);

const preferenceSchema = new Schema<PreferenceDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    financialProfile: { type: financialProfileSchema, default: null },
    lastRecommendations: { type: [recommendationSchema], default: [] }
  },
  { timestamps: true }
);

export const Preference =
  mongoose.models.Preference || mongoose.model<PreferenceDoc>('Preference', preferenceSchema);

