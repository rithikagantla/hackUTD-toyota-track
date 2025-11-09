import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WeekendVibe =
  | 'city_adventures'
  | 'outdoor_escape'
  | 'family_focused'
  | 'home_base'

export type VehicleEmotion = 'security' | 'efficiency' | 'freedom' | 'thrill'

export type SpendingStyle =
  | 'home_project'
  | 'mini_road_trip'
  | 'luxury_experience'
  | 'investing'

export interface PsychographicInsights {
  lifeStage?: string
  primaryGoal?: string
  vehicleNeeds?: string[]
  financialSentiment?: string
  keyConcerns?: string[]
}

export interface UserProfile {
  weekendVibe: WeekendVibe | null
  vehicleEmotion: VehicleEmotion | null
  spendingStyle: SpendingStyle | null
  futureChapterNarrative: string
  insights: PsychographicInsights | null
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
  weekendVibe: null,
  vehicleEmotion: null,
  spendingStyle: null,
  futureChapterNarrative: '',
  insights: null,
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
