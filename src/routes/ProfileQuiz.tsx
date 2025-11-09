import { type ChangeEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useProfileStore, WeekendVibe, VehicleEmotion, SpendingStyle } from '../store/profile'
import Hero from '../components/layout/Hero'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_STEPS = 4
const MIN_FUTURE_CHAPTER_LENGTH = 40

export default function ProfileQuiz() {
  const navigate = useNavigate()
  const { profile, updateProfile, completeProfile } = useProfileStore()
  const [currentStep, setCurrentStep] = useState<number>(1)

  type FormState = {
    weekendVibe: WeekendVibe | null
    vehicleEmotion: VehicleEmotion | null
    spendingStyle: SpendingStyle | null
    futureChapterNarrative: string
  }

  const [formData, setFormData] = useState<FormState>({
    weekendVibe: profile.weekendVibe ?? null,
    vehicleEmotion: profile.vehicleEmotion ?? null,
    spendingStyle: profile.spendingStyle ?? null,
    futureChapterNarrative: profile.futureChapterNarrative ?? '',
  })

  const updateFormData = <K extends keyof typeof formData>(
    key: K,
    value: typeof formData[K]
  ) => {
    setFormData((prevState: FormState) => ({ ...prevState, [key]: value }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prevStep: number) => prevStep + 1)
      return
    }

    updateProfile({
      ...formData,
      futureChapterNarrative: formData.futureChapterNarrative.trim(),
    })
    completeProfile()
    navigate('/app/quiz-results')
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep: number) => prevStep - 1)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.weekendVibe)
      case 2:
        return Boolean(formData.vehicleEmotion)
      case 3:
        return Boolean(formData.spendingStyle)
      case 4:
        return formData.futureChapterNarrative.trim().length >= MIN_FUTURE_CHAPTER_LENGTH
      default:
        return true
    }
  }, [currentStep, formData])

  return (
    <div>
      <Hero
        title="Map Your Next Chapter"
        subtitle="Lean into the vibes, paint the story, and we'll sculpt the perfect Toyota companion"
        compact
      />

      <section className="py-12 bg-white">
        <div className="container-custom max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-toyota-black">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <span className="text-sm text-toyota-gray-dark">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-toyota-gray-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-toyota-red"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card padding="lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Weekend Vibe */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      What does your typical weekend look like?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Choose the vibe that feels most like your off-duty rhythm
                    </p>
                    <div className="space-y-4">
                      {[
                        {
                          value: 'city_adventures' as WeekendVibe,
                          label: 'City adventures',
                          desc: 'Brunch spots, pop-up exhibits, late-night detours.',
                        },
                        {
                          value: 'outdoor_escape' as WeekendVibe,
                          label: 'Outdoor escape',
                          desc: 'Trailheads, summit selfies, fresh air therapy.',
                        },
                        {
                          value: 'family_focused' as WeekendVibe,
                          label: 'Family-focused',
                          desc: 'Sideline cheers, snack runs, grandparents’ house.',
                        },
                        {
                          value: 'home_base' as WeekendVibe,
                          label: 'Home base',
                          desc: 'DIY projects, neighborhood hangs, easy drives.',
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData('weekendVibe', option.value)}
                          className={`w-full p-5 border-2 rounded-lg transition-all text-left ${
                            formData.weekendVibe === option.value
                              ? 'border-toyota-red bg-toyota-red/5 shadow-md'
                              : 'border-gray-200 hover:border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-toyota-black">
                                {option.label}
                              </div>
                              <div className="text-sm text-toyota-gray-dark">
                                {option.desc}
                              </div>
                            </div>
                            {formData.weekendVibe === option.value && (
                              <Check className="w-5 h-5 text-toyota-red shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Vehicle Emotion */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      When you picture your next ride, what feeling hits first?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Let your gut talk—we'll translate it into vehicle DNA
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          value: 'security' as VehicleEmotion,
                          label: 'Security',
                          desc: 'I want to feel safe, grounded, and in control.',
                        },
                        {
                          value: 'efficiency' as VehicleEmotion,
                          label: 'Efficiency',
                          desc: 'Smart, practical, eco-conscious—the brainy choice.',
                        },
                        {
                          value: 'freedom' as VehicleEmotion,
                          label: 'Freedom',
                          desc: 'Adventure-ready, unconstrained, always game.',
                        },
                        {
                          value: 'thrill' as VehicleEmotion,
                          label: 'Thrill',
                          desc: 'Performance, energy, grins per mile.',
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData('vehicleEmotion', option.value)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.vehicleEmotion === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover:border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-toyota-black">{option.label}</div>
                              <div className="text-sm text-toyota-gray-dark">{option.desc}</div>
                            </div>
                            {formData.vehicleEmotion === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Spending Style */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      You get a free Saturday and $500. What happens?
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      Pick the storyline that feels most like you—or how you want to be
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          value: 'home_project' as SpendingStyle,
                          label: 'Home project hero',
                          desc: 'Home Depot run, IKEA maze, the trunk’s packed with possibilities.',
                        },
                        {
                          value: 'mini_road_trip' as SpendingStyle,
                          label: 'Mini road-trip captain',
                          desc: 'Spontaneous getaway with the crew and an overstuffed cooler.',
                        },
                        {
                          value: 'luxury_experience' as SpendingStyle,
                          label: 'Luxury experience',
                          desc: 'Dress up, dine out, go all-in on the city glow-up.',
                        },
                        {
                          value: 'investing' as SpendingStyle,
                          label: 'Stacking the future',
                          desc: 'Straight into savings, investments, or debt-free dreams.',
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateFormData('spendingStyle', option.value)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            formData.spendingStyle === option.value
                              ? 'border-toyota-red bg-toyota-red/5'
                              : 'border-gray-200 hover:border-toyota-red/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="font-semibold text-toyota-black">{option.label}</div>
                            {formData.spendingStyle === option.value && (
                              <Check className="w-5 h-5 text-toyota-red" />
                            )}
                          </div>
                          <div className="text-xs text-toyota-gray-dark">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Future Chapter */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-toyota-black mb-2">
                      Describe the next chapter of your life
                    </h2>
                    <p className="text-toyota-gray-dark mb-8">
                      What are you building toward in the next 3-5 years, and how should your next vehicle boost that story?
                    </p>
                    <textarea
                      value={formData.futureChapterNarrative}
                      onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                        updateFormData('futureChapterNarrative', event.target.value)
                      }
                      rows={6}
                      placeholder="In your own words, paint the picture..."
                      className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent p-4 text-base text-toyota-black placeholder:text-gray-400"
                    />
                    <div className="text-xs text-toyota-gray-dark mt-3 flex items-center justify-between">
                      <span>Aim for at least a few sentences so we can pull out the good stuff.</span>
                      <span>
                        {Math.max(formData.futureChapterNarrative.trim().length, 0)} / {MIN_FUTURE_CHAPTER_LENGTH}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed}>
                {currentStep === TOTAL_STEPS ? (
                  <>
                    Lock It In
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
