import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FuelType, BodyStyle } from '../data/vehicles'

export type DecisionStyle = 'lease' | 'finance' | 'undecided'
export type LifestyleTag = 'commuter' | 'family' | 'adventure' | 'eco' | 'tech'
export type CommuteIntensity = 'low' | 'medium' | 'high'

export interface UserProfile {
  // Quiz responses
  budgetMonthly: number // Target monthly payment
  preferredFuelType: FuelType | 'any'
  preferredBodyStyle: BodyStyle | 'any'
  commuteIntensity: CommuteIntensity
  lifestyleTags: LifestyleTag[]
  decisionStyle: DecisionStyle

  // Metadata
  completed: boolean
  completedAt?: Date
}

interface ProfileStore {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  resetProfile: () => void
  completeProfile: () => void
}

const defaultProfile: UserProfile = {
  budgetMonthly: 400,
  preferredFuelType: 'any',
  preferredBodyStyle: 'any',
  commuteIntensity: 'medium',
  lifestyleTags: [],
  decisionStyle: 'undecided',
  completed: false,
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      resetProfile: () =>
        set({
          profile: defaultProfile,
        }),

      completeProfile: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            completed: true,
            completedAt: new Date(),
          },
        })),
    }),
    {
      name: 'toyota-nexus-profile',
    }
  )
)
