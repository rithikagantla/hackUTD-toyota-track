import { useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Heart, Sparkles } from 'lucide-react'
import { useProfileStore, WeekendVibe, VehicleEmotion, SpendingStyle, UserProfile } from '../store/profile'
import { vehicles } from '../data/vehicles'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../lib/finance'

const weekendDetails: Record<WeekendVibe, { label: string; tagline: string }> = {
  city_adventures: {
    label: 'City adventures',
    tagline: 'You chase culture, energy, and effortless maneuverability.',
  },
  outdoor_escape: {
    label: 'Outdoor escape',
    tagline: 'You crave all-terrain confidence and gear-ready flexibility.',
  },
  family_focused: {
    label: 'Family-focused',
    tagline: 'Safety, space, and calm logistics always travel with you.',
  },
  home_base: {
    label: 'Home base',
    tagline: 'Comfort, practicality, and reliable utility fuel your projects.',
  },
}

const emotionDetails: Record<VehicleEmotion, { label: string; vibe: string }> = {
  security: {
    label: 'Security',
    vibe: 'Stability first — top-tier safety tech and confident control matter most.',
  },
  efficiency: {
    label: 'Efficiency',
    vibe: 'You want every mile (and dollar) to go further without sacrificing style.',
  },
  freedom: {
    label: 'Freedom',
    vibe: 'Adventure-capable, go-anywhere presence keeps your story moving.',
  },
  thrill: {
    label: 'Thrill',
    vibe: 'Dynamic performance and stand-out personality keep the ride electric.',
  },
}

const spendingDetails: Record<SpendingStyle, { label: string; impulse: string }> = {
  home_project: {
    label: 'Home project hero',
    impulse: 'Cargo space and power tools-on-board ready.',
  },
  mini_road_trip: {
    label: 'Mini road-trip captain',
    impulse: 'Flexible seating, road-trip tech, and comfort for the crew.',
  },
  luxury_experience: {
    label: 'Luxury experience',
    impulse: 'Premium finishes, smooth ride, and statement-making aesthetics.',
  },
  investing: {
    label: 'Stacking the future',
    impulse: 'Smart spend with low operating costs and long-term value.',
  },
}

function hasFeature(vehicleFeatureList: string[], keywords: string[]) {
  return keywords.some((keyword) =>
    vehicleFeatureList.some((feature) => feature.toLowerCase().includes(keyword))
  )
}

function scoreVehicleForProfile(vehicle: typeof vehicles[number], profile: UserProfile) {
  let score = 0

  if (profile.weekendVibe) {
    switch (profile.weekendVibe) {
      case 'city_adventures':
        if (vehicle.tags.includes('tech')) score += 14
        if (vehicle.tags.includes('commuter')) score += 12
        if (vehicle.bodyStyle === 'sedan' || vehicle.bodyStyle === 'hatchback') score += 8
        break
      case 'outdoor_escape':
        if (vehicle.tags.includes('adventure')) score += 18
        if (vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'truck') score += 12
        if (hasFeature(vehicle.features, ['awd', '4wd', 'multi-terrain'])) score += 10
        break
      case 'family_focused':
        if (vehicle.tags.includes('family')) score += 18
        if (vehicle.seating >= 6) score += 12
        if (vehicle.safetyRating >= 5) score += 10
        break
      case 'home_base':
        if (vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'truck') score += 10
        if (vehicle.tags.includes('commuter')) score += 8
        if (hasFeature(vehicle.features, ['liftgate', 'cargo', 'tow'])) score += 8
        break
    }
  }

  if (profile.vehicleEmotion) {
    switch (profile.vehicleEmotion) {
      case 'security':
        if (vehicle.safetyRating >= 5) score += 18
        if (hasFeature(vehicle.features, ['safety sense', 'blind spot', 'lane departure'])) score += 10
        break
      case 'efficiency':
        if (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev') score += 18
        if (vehicle.mpgCombined >= 35) score += 12
        break
      case 'freedom':
        if (vehicle.tags.includes('adventure')) score += 16
        if (hasFeature(vehicle.features, ['awd', '4wd', 'crawl control'])) score += 12
        if (vehicle.seating >= 5 && vehicle.mpgCombined >= 28) score += 6
        break
      case 'thrill':
        if (vehicle.tags.includes('tech') || hasFeature(vehicle.features, ['sport', 'turbo', 'gr'])) score += 12
        if (vehicle.msrp >= 38000) score += 8
        break
    }
  }

  if (profile.spendingStyle) {
    switch (profile.spendingStyle) {
      case 'home_project':
        if (vehicle.bodyStyle === 'truck') score += 18
        if (hasFeature(vehicle.features, ['towing', 'bed', 'payload'])) score += 12
        if (vehicle.bodyStyle === 'suv') score += 6
        break
      case 'mini_road_trip':
        if (vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'minivan') score += 15
        if (vehicle.seating >= 5) score += 8
        if (hasFeature(vehicle.features, ['moonroof', 'power liftgate', 'premium audio'])) score += 6
        break
      case 'luxury_experience':
        if (vehicle.msrp >= 40000) score += 16
        if (hasFeature(vehicle.features, ['leather', 'premium', 'panoramic'])) score += 12
        break
      case 'investing':
        if (vehicle.msrp <= 30000) score += 14
        if (vehicle.mpgCombined >= 35) score += 12
        if (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev') score += 6
        break
    }
  }

  const narrative = profile.futureChapterNarrative?.toLowerCase() ?? ''
  if (narrative) {
    if (/(baby|kid|family|parent|suburb)/.test(narrative) && vehicle.tags.includes('family')) {
      score += 12
    }
    if (/(commute|downtown|city)/.test(narrative) && vehicle.tags.includes('commuter')) {
      score += 10
    }
    if (/(travel|road trip|adventure|mountain)/.test(narrative) && vehicle.tags.includes('adventure')) {
      score += 10
    }
    if (/(budget|gas|payment|cost)/.test(narrative) && (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev')) {
      score += 8
    }
  }

  score += Math.min(vehicle.safetyRating * 3, 12)
  score += Math.min(vehicle.features.length * 1.2, 10)

  return Math.min(Math.round(score), 100)
}

function getProfileSummary(profile: UserProfile) {
  return [
    profile.weekendVibe ? weekendDetails[profile.weekendVibe] : null,
    profile.vehicleEmotion ? emotionDetails[profile.vehicleEmotion] : null,
    profile.spendingStyle ? spendingDetails[profile.spendingStyle] : null,
  ].filter(Boolean)
}

export default function QuizResults() {
  const navigate = useNavigate()
  const { profile } = useProfileStore()

  useEffect(() => {
    if (!profile.completed) {
      navigate('/app/quiz')
    }
  }, [profile.completed, navigate])

  const recommendedVehicles = useMemo(() => {
    if (!profile.completed) {
      return vehicles.slice(0, 3).map((vehicle) => ({ ...vehicle, matchScore: 0 }))
    }

    const scored = vehicles.map((vehicle) => ({
      ...vehicle,
      matchScore: scoreVehicleForProfile(vehicle, profile),
    }))

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
  }, [profile])

  const topMatch = recommendedVehicles[0]
  const profileHighlights = getProfileSummary(profile)

  if (!profile.completed) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/50 to-white">
      {/* Success Header */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-pink-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-toyota-black mb-4">
            Your Psychographic Profile Is Locked
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We captured your vibe, intentions, and future plans. Here’s the Toyota lineup that mirrors that energy.
          </p>
        </div>
      </section>

      {/* Persona Snapshot */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <Card padding="lg" className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-toyota-black">Psychographic Snapshot</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {profileHighlights.length > 0 ? (
                  profileHighlights.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white/70">
                      <div className="text-sm uppercase tracking-wide text-toyota-red font-semibold mb-1">
                        {item.label}
                      </div>
                      <div className="text-sm text-toyota-gray-dark leading-relaxed">
                        {item.tagline ?? item.vibe ?? item.impulse}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-toyota-gray-dark">
                    Tell us more about you in the quiz to unlock tailored insights.
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-rose-50 border border-rose-100 p-5">
                <h3 className="text-sm font-semibold text-rose-700 mb-2">
                  Your next chapter
                </h3>
                <p className="text-sm leading-relaxed text-rose-900 whitespace-pre-line">
                  {profile.futureChapterNarrative || 'You skipped the narrative, but you can always add it later for deeper insights.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Top Recommendation */}
      <section className="py-12 pt-0">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-toyota-red fill-toyota-red" />
            <h2 className="text-3xl font-bold text-toyota-black">Your Headline Match</h2>
          </div>

          {topMatch && (
            <Card padding="none" className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-auto">
                  <img
                    src={topMatch.image}
                    alt={topMatch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant="success" className="!bg-toyota-red !text-white">
                      {topMatch.matchScore}% Psychographic Match
                    </Badge>
                    {profile.vehicleEmotion && (
                      <Badge variant="info" className="!bg-white/80 !text-toyota-black">
                        {emotionDetails[profile.vehicleEmotion].label} energy
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-toyota-black mb-3">
                      {topMatch.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {topMatch.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-600">Starting Price</div>
                        <div className="text-2xl font-bold text-toyota-red">
                          {formatCurrency(topMatch.msrp)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Fuel Story</div>
                        <div className="text-2xl font-bold text-green-600">
                          {topMatch.fuelType === 'ev'
                            ? 'All-electric'
                            : `${topMatch.mpgCombined} MPG combined`}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {topMatch.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <Link to={`/app/vehicle/${topMatch.id}`} className="block">
                    <Button size="lg" fullWidth>
                      Explore This Match
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Other Recommendations */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold text-toyota-black mb-6">
            Backup Cast Members
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {recommendedVehicles.slice(1).map((vehicle) => (
              <Link key={vehicle.id} to={`/app/vehicle/${vehicle.id}`}>
                <Card hover padding="none" className="overflow-hidden h-full">
                  <div className="relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="info" className="!bg-white/90">
                        {vehicle.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-toyota-black mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-toyota-red">
                        {formatCurrency(vehicle.msrp)}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        {vehicle.fuelType === 'ev' ? 'All-electric' : `${vehicle.mpgCombined} MPG`}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA to Explore */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Want to explore the full Toyota universe?
            </p>
            <Link to="/app/explore">
              <Button variant="outline" size="lg">
                Browse All Vehicles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
