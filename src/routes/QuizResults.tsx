import { useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Zap, Heart } from 'lucide-react'
import { useProfileStore } from '../store/profile'
import { vehicles } from '../data/vehicles'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../lib/finance'

export default function QuizResults() {
  const navigate = useNavigate()
  const { profile } = useProfileStore()

  // Redirect if quiz not completed
  useEffect(() => {
    if (!profile.completed) {
      navigate('/app/quiz')
    }
  }, [profile.completed, navigate])

  // Calculate match scores for vehicles
  const recommendedVehicles = useMemo(() => {
    const scored = vehicles.map((vehicle) => {
      let score = 0

      // Budget match (most important)
      const estimatedMonthly = vehicle.msrp / 60 // Rough estimate: MSRP / 60 months
      const budgetDiff = Math.abs(estimatedMonthly - profile.budgetMonthly)
      if (budgetDiff < 100) score += 30
      else if (budgetDiff < 200) score += 20
      else if (budgetDiff < 300) score += 10

      // Fuel type match
      if (profile.preferredFuelType !== 'any') {
        if (vehicle.fuelType === profile.preferredFuelType) score += 25
      } else {
        score += 10 // Small bonus for any preference
      }

      // Body style match
      if (profile.preferredBodyStyle !== 'any') {
        if (vehicle.bodyStyle === profile.preferredBodyStyle) score += 20
      } else {
        score += 8
      }

      // Lifestyle tags match
      const matchingTags = vehicle.tags.filter((tag) =>
        profile.lifestyleTags.some((lifeTag) => tag.toLowerCase().includes(lifeTag))
      )
      score += matchingTags.length * 5

      // Commute intensity considerations
      if (profile.commuteIntensity === 'high' && vehicle.mpgCombined > 30) score += 10
      if (profile.commuteIntensity === 'low' && vehicle.fuelType === 'gas') score += 5

      return { ...vehicle, matchScore: score }
    })

    // Sort by match score and return top 3
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
  }, [profile])

  const topMatch = recommendedVehicles[0]

  if (!profile.completed) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white">
      {/* Success Header */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container-custom max-w-4xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-toyota-black mb-4">
            Perfect! We've Found Your Match
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, we've identified the best Toyota vehicles for your lifestyle
          </p>
        </div>
      </section>

      {/* Top Recommendation */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-toyota-red fill-toyota-red" />
            <h2 className="text-3xl font-bold text-toyota-black">Your Top Match</h2>
          </div>

          <Card padding="none" className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Vehicle Image */}
              <div className="relative h-80 md:h-auto">
                <img
                  src={topMatch.image}
                  alt={topMatch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="success" className="!bg-toyota-red !text-white">
                    {topMatch.matchScore}% Match
                  </Badge>
                </div>
              </div>

              {/* Vehicle Info */}
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
                    {topMatch.mpgCombined > 0 && (
                      <div>
                        <div className="text-sm text-gray-600">Fuel Economy</div>
                        <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                          <Zap className="w-6 h-6" />
                          {topMatch.mpgCombined} MPG
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {topMatch.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>

                <Link to={`/app/vehicle/${topMatch.id}`} className="block">
                  <Button size="lg" fullWidth>
                    View Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Other Recommendations */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold text-toyota-black mb-6">
            Other Great Matches
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
                      {vehicle.mpgCombined > 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {vehicle.mpgCombined} MPG
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* CTA to Explore */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Want to see more options?
            </p>
            <Link to="/app/explore">
              <Button variant="outline" size="lg">
                Explore All Vehicles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
