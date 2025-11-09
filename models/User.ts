import mongoose, { Schema } from 'mongoose';

export interface UserDoc {
  auth0Id: string;
  email?: string;
  name?: string;
  plaidAccessToken?: string;
  plaidItemId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    plaidAccessToken: { type: String },
    plaidItemId: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<UserDoc>('User', userSchema);

