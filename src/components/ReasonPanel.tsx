import { Vehicle } from '../data/vehicles'
import { UserProfile } from '../store/profile'
import { Check, Zap, Sparkles } from 'lucide-react'
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

function hasFeature(vehicle: Vehicle, keywords: string[]) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  return lowerKeywords.some((keyword) =>
    vehicle.features.some((feature) => feature.toLowerCase().includes(keyword))
  )
}

function generateReasons(vehicle: Vehicle, profile?: UserProfile): Reason[] {
  const reasons: Reason[] = []

  if (profile?.completed) {
    switch (profile.weekendVibe) {
      case 'city_adventures':
        reasons.push({
          icon: Check,
          text: 'Compact-friendly footprint with tech-forward amenities for downtown adventures',
          highlight: vehicle.bodyStyle === 'sedan' || vehicle.bodyStyle === 'hatchback',
        })
        break
      case 'outdoor_escape':
        if (vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'truck') {
          reasons.push({
            icon: Check,
            text: 'Adventure-ready stance with the clearance and presence your weekend escapes demand',
            highlight: true,
          })
        }
        if (hasFeature(vehicle, ['awd', '4wd', 'multi-terrain'])) {
          reasons.push({
            icon: Sparkles,
            text: 'Selectable drive modes and traction tech keep you confident off the pavement',
          })
        }
        break
      case 'family_focused':
        if (vehicle.seating >= 6) {
          reasons.push({
            icon: Check,
            text: `Room for everyone with ${vehicle.seating}-passenger seating and smart storage touches`,
            highlight: true,
          })
        }
        if (vehicle.safetyRating >= 5) {
          reasons.push({
            icon: Check,
            text: 'Top-tier safety ratings align with your “protect-the-crew” mindset',
          })
        }
        break
      case 'home_base':
        reasons.push({
          icon: Check,
          text: 'Wide cargo opening and flexible seating make DIY runs and neighborhood drop-offs seamless',
          highlight: vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'truck',
        })
        break
    }

    switch (profile.vehicleEmotion) {
      case 'security':
        if (vehicle.safetyRating >= 5) {
          reasons.push({
            icon: Check,
            text: 'Toyota Safety Sense and a 5-star safety pedigree reinforce that secure feeling you asked for',
            highlight: true,
          })
        }
        break
      case 'efficiency':
        if (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev' || vehicle.mpgCombined >= 35) {
          reasons.push({
            icon: Zap,
            text: `Efficiency-first build delivering ${
              vehicle.fuelType === 'ev' ? 'zero tailpipe emissions' : `${vehicle.mpgCombined} MPG combined`
            } to protect your budget`,
            highlight: true,
          })
        }
        break
      case 'freedom':
        if (vehicle.tags.includes('adventure')) {
          reasons.push({
            icon: Sparkles,
            text: 'Adventure credentials mean impromptu road trips are always on the table',
            highlight: true,
          })
        }
        break
      case 'thrill':
        reasons.push({
          icon: Sparkles,
          text: 'Bold styling and engaging drive dynamics keep the thrill dialed up on every commute',
        })
        break
    }

    switch (profile.spendingStyle) {
      case 'home_project':
        if (vehicle.bodyStyle === 'truck' || hasFeature(vehicle, ['towing', 'payload'])) {
          reasons.push({
            icon: Check,
            text: 'Bed space and hauling muscle make weekend project runs effortless',
            highlight: true,
          })
        }
        break
      case 'mini_road_trip':
        reasons.push({
          icon: Check,
          text: 'Road-trip friendly cabin with comfort tech that keeps the whole crew happy mile after mile',
          highlight: vehicle.bodyStyle === 'suv' || vehicle.bodyStyle === 'minivan',
        })
        break
      case 'luxury_experience':
        if (hasFeature(vehicle, ['leather', 'premium', 'panoramic'])) {
          reasons.push({
            icon: Sparkles,
            text: 'Premium finishes and elevated touches match your city-night-out energy',
            highlight: true,
          })
        }
        break
      case 'investing':
        if (vehicle.mpgCombined >= 35 || vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev') {
          reasons.push({
            icon: Zap,
            text: 'Low operating costs and stellar efficiency keep your long-term plan on track',
            highlight: true,
          })
        }
        break
    }

    const narrative = profile.futureChapterNarrative.toLowerCase()
    if (narrative) {
      if (/(family|kid|child|new parent)/.test(narrative) && vehicle.tags.includes('family')) {
        reasons.push({
          icon: Check,
          text: 'Family-first packaging with thoughtful safety tech for stroller-and-snacks life',
        })
      }
      if (/(home|suburb|house)/.test(narrative) && hasFeature(vehicle, ['liftgate', 'power liftgate', 'cargo'])) {
        reasons.push({
          icon: Check,
          text: 'Hands-free cargo access keeps new-home errands simple and stress-free',
        })
      }
      if (/(budget|fuel|gas|payment)/.test(narrative) && (vehicle.fuelType === 'hybrid' || vehicle.fuelType === 'ev')) {
        reasons.push({
          icon: Zap,
          text: 'Efficient powertrain eases fuel anxieties while you focus on bigger financial goals',
        })
      }
    }
  }

  if (vehicle.safetyRating === 5 && !reasons.some((reason) => reason.text.includes('5-star'))) {
    reasons.push({
      icon: Check,
      text: '5-star safety pedigree lets you drive with absolute confidence',
    })
  }

  if (vehicle.features.length > 0) {
    reasons.push({
      icon: Check,
      text: `Signature Toyota features like ${vehicle.features[0]} keep daily life simple`,
    })
  }

  if (!reasons.some((reason) => reason.text.includes('reliability'))) {
    reasons.push({
      icon: Check,
      text: 'Backed by Toyota reliability and resale strength',
    })
  }

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
                reason.highlight ? 'bg-toyota-red text-white' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <reason.icon className="w-4 h-4" />
            </div>
            <span
              className={`text-sm leading-relaxed ${
                reason.highlight ? 'font-medium text-toyota-black' : 'text-toyota-gray-dark'
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
