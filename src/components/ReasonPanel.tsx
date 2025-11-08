import { Vehicle } from '../data/vehicles'
import { UserProfile } from '../store/profile'
import { Check, Zap } from 'lucide-react'
import Card from './ui/Card'

interface ReasonPanelProps {
  vehicle: Vehicle
  profile?: UserProfile
}

interface Reason {
  icon: typeof Check
  text: string
  highlight?: boolean
}

/**
 * Generate personalized reasons why a vehicle is a good fit
 * based on the vehicle specs and user profile
 */
function generateReasons(vehicle: Vehicle, profile?: UserProfile): Reason[] {
  const reasons: Reason[] = []

  // Budget fit (if profile exists)
  if (profile && profile.completed) {
    const estimatedMonthly = Math.round(vehicle.msrp / 60) // Rough estimate
    if (estimatedMonthly <= profile.budgetMonthly) {
      reasons.push({
        icon: Check,
        text: `Fits within your $${profile.budgetMonthly}/mo budget target`,
        highlight: true,
      })
    } else if (estimatedMonthly <= profile.budgetMonthly * 1.15) {
      reasons.push({
        icon: Check,
        text: `Close to your budget at ~$${estimatedMonthly}/mo`,
      })
    }
  }

  // Fuel efficiency
  if (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev') {
    if (vehicle.mpgCombined >= 40 || vehicle.fuelType === 'ev') {
      reasons.push({
        icon: Zap,
        text: `Exceptional fuel efficiency ${vehicle.fuelType === 'ev' ? '(100% electric)' : `(${vehicle.mpgCombined} MPG combined)`}`,
        highlight: vehicle.fuelType === 'ev',
      })
    } else {
      reasons.push({
        icon: Zap,
        text: `Great fuel economy at ${vehicle.mpgCombined} MPG combined`,
      })
    }
  } else if (vehicle.mpgCombined >= 25) {
    reasons.push({
      icon: Check,
      text: `Good fuel economy at ${vehicle.mpgCombined} MPG combined`,
    })
  }

  // Safety
  if (vehicle.safetyRating === 5) {
    reasons.push({
      icon: Check,
      text: 'Top 5-star safety rating for peace of mind',
    })
  }

  // Body style match
  if (profile && profile.preferredBodyStyle !== 'any' && vehicle.bodyStyle === profile.preferredBodyStyle) {
    const styleNames: Record<string, string> = {
      sedan: 'sedan',
      suv: 'SUV',
      truck: 'truck',
      minivan: 'minivan',
      hatchback: 'hatchback',
    }
    reasons.push({
      icon: Check,
      text: `Matches your preference for a ${styleNames[vehicle.bodyStyle]}`,
      highlight: true,
    })
  }

  // Seating capacity
  if (vehicle.seating >= 7) {
    reasons.push({
      icon: Check,
      text: `Spacious ${vehicle.seating}-passenger seating for the whole family`,
    })
  } else if (vehicle.seating >= 5) {
    reasons.push({
      icon: Check,
      text: `Comfortable ${vehicle.seating}-passenger seating`,
    })
  }

  // Technology features
  const hasTech = vehicle.features.some((f) =>
    f.toLowerCase().includes('apple carplay') ||
    f.toLowerCase().includes('android auto') ||
    f.toLowerCase().includes('safety sense')
  )
  if (hasTech && profile?.lifestyleTags.includes('tech')) {
    reasons.push({
      icon: Check,
      text: 'Advanced tech features including Apple CarPlay and Toyota Safety Sense',
      highlight: true,
    })
  } else if (hasTech) {
    reasons.push({
      icon: Check,
      text: 'Modern connectivity and safety technology',
    })
  }

  // Lifestyle tag matches
  if (profile && profile.lifestyleTags.length > 0) {
    const matchingTags = vehicle.tags.filter((tag) =>
      profile.lifestyleTags.includes(tag as any)
    )

    if (matchingTags.includes('family') && profile.lifestyleTags.includes('family')) {
      reasons.push({
        icon: Check,
        text: 'Family-friendly with ample cargo space and safety features',
        highlight: true,
      })
    }

    if (matchingTags.includes('adventure') && profile.lifestyleTags.includes('adventure')) {
      reasons.push({
        icon: Check,
        text: 'Built for adventure with off-road capability',
        highlight: true,
      })
    }

    if (matchingTags.includes('commuter') && profile.lifestyleTags.includes('commuter')) {
      reasons.push({
        icon: Check,
        text: 'Ideal daily commuter with comfort and efficiency',
        highlight: true,
      })
    }
  }

  // If we don't have enough reasons, add some generic ones
  if (reasons.length < 3) {
    if (!reasons.some(r => r.text.includes('reliability'))) {
      reasons.push({
        icon: Check,
        text: 'Legendary Toyota reliability and resale value',
      })
    }

    if (!reasons.some(r => r.text.includes('features')) && vehicle.features.length > 0) {
      reasons.push({
        icon: Check,
        text: `Loaded with features including ${vehicle.features[0]}`,
      })
    }
  }

  // Limit to 5 reasons maximum
  return reasons.slice(0, 5)
}

export default function ReasonPanel({ vehicle, profile }: ReasonPanelProps) {
  const reasons = generateReasons(vehicle, profile)

  if (reasons.length === 0) {
    return null
  }

  return (
    <Card padding="lg">
      <h3 className="text-xl font-semibold text-toyota-black mb-4">
        Why This Vehicle Fits You
      </h3>
      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                reason.highlight
                  ? 'bg-toyota-red text-white'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              <reason.icon className="w-4 h-4" />
            </div>
            <span
              className={`text-sm leading-relaxed ${
                reason.highlight
                  ? 'font-medium text-toyota-black'
                  : 'text-toyota-gray-dark'
              }`}
            >
              {reason.text}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
