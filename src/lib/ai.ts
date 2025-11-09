import { GoogleGenerativeAI } from '@google/generative-ai'
import { Vehicle } from '../data/vehicles'
import { UserProfile, WeekendVibe, VehicleEmotion, SpendingStyle } from '../store/profile'
import { vehicles, searchVehicles } from '../data/vehicles'
import { estimateFinance, formatCurrency, formatMonthly } from './finance'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type AIMode = 'mock' | 'gemini'

interface ChatContext {
  profile?: UserProfile
  vehicles: Vehicle[]
}

const weekendLabel: Record<Exclude<WeekendVibe, null>, string> = {
  city_adventures: 'City adventures',
  outdoor_escape: 'Outdoor escape',
  family_focused: 'Family-focused',
  home_base: 'Home base',
}

const emotionLabel: Record<VehicleEmotion, string> = {
  security: 'Security',
  efficiency: 'Efficiency',
  freedom: 'Freedom',
  thrill: 'Thrill',
}

const spendingLabel: Record<SpendingStyle, string> = {
  home_project: 'Home project hero',
  mini_road_trip: 'Mini road-trip captain',
  luxury_experience: 'Luxury experience',
  investing: 'Stacking the future',
}

function summarizeProfile(profile: UserProfile): string {
  if (!profile.completed) {
    return 'User has not completed profile quiz yet.'
  }

  const lines: string[] = []

  if (profile.weekendVibe) {
    lines.push(`- Weekend vibe: ${weekendLabel[profile.weekendVibe]}`)
  }
  if (profile.vehicleEmotion) {
    lines.push(`- Desired feeling: ${emotionLabel[profile.vehicleEmotion]}`)
  }
  if (profile.spendingStyle) {
    lines.push(`- $500 Saturday plan: ${spendingLabel[profile.spendingStyle]}`)
  }
  if (profile.futureChapterNarrative) {
    const trimmed = profile.futureChapterNarrative.trim()
    const snippet = trimmed.length > 160 ? `${trimmed.slice(0, 157)}...` : trimmed
    lines.push(`- Future chapter: ${snippet}`)
  }

  if (profile.insights) {
    const { lifeStage, primaryGoal, vehicleNeeds, financialSentiment } = profile.insights
    if (lifeStage) lines.push(`- Life stage: ${lifeStage}`)
    if (primaryGoal) lines.push(`- Primary goal: ${primaryGoal}`)
    if (vehicleNeeds && vehicleNeeds.length > 0) lines.push(`- Vehicle needs: ${vehicleNeeds.join(', ')}`)
    if (financialSentiment) lines.push(`- Financial sentiment: ${financialSentiment}`)
  }

  if (lines.length === 0) {
    return 'User completed the psychographic quiz but did not provide additional context.'
  }

  return `User Psychographic Profile:\n${lines.join('\n')}`
}

/**
 * MOCK AI - Rule-based responses
 */
function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm here to help you find the perfect Toyota vehicle. You can ask me about specific models, compare vehicles, or get recommendations based on your needs. What would you like to know?"
  }

  // Quiz/Profile
  if (lowerMessage.includes('quiz') || lowerMessage.includes('profile')) {
    return "Jump into our psychographic onboarding! In just a few questions we'll capture your weekend vibe, the emotion you crave from your next Toyota, and the life chapter you're writing—then turn it into spot-on recommendations. You can start the experience from the navigation menu."
  }

  // Hybrid recommendations
  if (lowerMessage.includes('hybrid') && (lowerMessage.includes('best') || lowerMessage.includes('recommend'))) {
    const hybrids = vehicles.filter(v => v.fuelType === 'hybrid').slice(0, 3)
    if (hybrids.length > 0) {
      const list = hybrids.map(v => `**${v.name}** - ${v.mpgCombined} MPG combined, starting at ${formatCurrency(v.msrp)}`).join('\n- ')
      return `Great choice! Here are our top hybrid vehicles:\n\n- ${list}\n\nAll of these offer excellent fuel economy and Toyota's proven hybrid technology. Would you like to know more about any of these models?`
    }
  }

  // SUV recommendations
  if (lowerMessage.includes('suv') && (lowerMessage.includes('best') || lowerMessage.includes('recommend') || lowerMessage.includes('family'))) {
    const suvs = vehicles.filter(v => v.bodyStyle === 'suv').slice(0, 3)
    if (suvs.length > 0) {
      const list = suvs.map(v => `**${v.name}** - ${v.seating} passengers, starting at ${formatCurrency(v.msrp)}`).join('\n- ')
      return `I'd recommend these excellent SUVs:\n\n- ${list}\n\nThese vehicles offer great versatility, safety, and space for your needs. Want details on any specific model?`
    }
  }

  // Budget/cheap/affordable
  if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable') || lowerMessage.includes('under')) {
    const affordable = [...vehicles].sort((a, b) => a.msrp - b.msrp).slice(0, 3)
    const list = affordable.map(v => `**${v.name}** - ${formatCurrency(v.msrp)}, ${v.mpgCombined} MPG`).join('\n- ')
    return `Here are our most affordable vehicles:\n\n- ${list}\n\nAll offer excellent value, legendary Toyota reliability, and impressive fuel economy. Monthly payments can be as low as ${formatMonthly(estimateFinance(affordable[0].msrp, 5.5, 60, 3000).monthly)}!`
  }

  // Compare Camry vs Corolla
  if (lowerMessage.includes('compare') && lowerMessage.includes('camry') && lowerMessage.includes('corolla')) {
    const camry = vehicles.find(v => v.id === 'camry-2024')
    const corolla = vehicles.find(v => v.id === 'corolla-2024')
    if (camry && corolla) {
      return `**Camry vs. Corolla Comparison:**

**${camry.name}** - ${formatCurrency(camry.msrp)}
- Midsize sedan with more space
- ${camry.mpgCombined} MPG combined
- ${camry.seating} passengers
- More premium features and comfort

**${corolla.name}** - ${formatCurrency(corolla.msrp)}
- Compact sedan, easier to park
- ${corolla.mpgCombined} MPG combined
- ${corolla.seating} passengers
- More affordable, great value

**Bottom line:** Corolla is perfect for budget-conscious buyers and city driving. Camry offers more space, power, and premium features for a bit more money.`
    }
  }

  // Lease vs finance
  if ((lowerMessage.includes('lease') || lowerMessage.includes('leasing')) && lowerMessage.includes('financ')) {
    return `**Lease vs. Finance:**

**Leasing:**
- Lower monthly payments
- Drive a new vehicle every 2-3 years
- No worries about resale value
- Mileage limits apply

**Financing:**
- Build equity and own the vehicle
- No mileage restrictions
- Freedom to modify
- Better long-term value if you keep it

**My recommendation:** Lease if you like new cars and drive under 12k miles/year. Finance if you want to own it or drive more than 15k miles/year.`
  }

  // Electric/EV
  if (lowerMessage.includes('electric') || lowerMessage.includes(' ev ') || lowerMessage.includes('bz4x')) {
    const bz4x = vehicles.find(v => v.id === 'bz4x-2024')
    if (bz4x) {
      return `The **${bz4x.name}** is Toyota's first all-electric SUV!

- 252-mile range on a full charge
- Fast charging capable
- AWD available
- Zero emissions
- Starting at ${formatCurrency(bz4x.msrp)}

It's perfect for eco-conscious drivers who want SUV versatility without gas. Federal tax credits may also be available!`
    }
  }

  // Safety
  if (lowerMessage.includes('safety') || lowerMessage.includes('safe')) {
    const topSafety = vehicles.filter(v => v.safetyRating === 5).slice(0, 3)
    return `Safety is our priority! These vehicles have top 5-star safety ratings:\n\n${topSafety.map(v => `- **${v.name}** with Toyota Safety Sense`).join('\n')}\n\nAll include advanced features like pre-collision braking, lane departure alert, and adaptive cruise control.`
  }

  // Search for specific vehicle name
  const searchResults = searchVehicles(message)
  if (searchResults.length > 0 && searchResults.length <= 3) {
    const vehicle = searchResults[0]
    return `I found the **${vehicle.name}**!\n\n${vehicle.description}\n\n- Starting at ${formatCurrency(vehicle.msrp)}\n- ${vehicle.mpgCombined > 0 ? `${vehicle.mpgCombined} MPG combined` : 'Electric with 252-mile range'}\n- ${vehicle.seating} passengers\n- ${vehicle.safetyRating}-star safety rating\n\nKey features: ${vehicle.features.slice(0, 3).join(', ')}\n\nWould you like to see payment estimates or learn more?`
  }

  // Default fallback
  return `I'd be happy to help! I can assist with:

- **Vehicle recommendations** – Share your vibe or goals and I'll curate Toyota matches
- **Comparisons** – Compare any two Toyota models side-by-side
- **Ownership insights** – Break down lease, finance, or EV charging questions
- **Feature deep dives** – Learn about safety tech, infotainment, and performance

Try asking: \"Which Toyota fits an adventurous family?\", \"Compare RAV4 vs. Highlander\", or \"How efficient is the Prius Prime?\"`
}

/**
 * Call Gemini AI API
 */
async function callGeminiAPI(
  message: string,
  context: ChatContext,
  apiKey: string,
  model: string = 'gemini-1.5-flash'
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model })

    // Build context for Gemini
    const contextStr = `
You are a helpful Toyota vehicle recommendation assistant called Toyota Nexus.

Available vehicles: ${context.vehicles.length} Toyota models including sedans, SUVs, trucks, hybrids, and electric vehicles.

${context.profile ? summarizeProfile(context.profile) : 'User has not completed profile quiz yet.'}

Some popular vehicles:
- Camry: Midsize sedan, 32 MPG, $28,400
- RAV4: Compact SUV, 30 MPG, $29,075
- Prius: Hybrid hatchback, 57 MPG, $28,545
- Highlander: 3-row SUV, 24 MPG, $38,980

Your role:
- Provide concise, practical vehicle guidance
- Reference actual Toyota models when relevant
- Explain lease vs finance if asked
- Be friendly but professional
- Keep responses under 200 words

User question: ${message}

Provide a helpful response:`

    const result = await geminiModel.generateContent(contextStr)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to get AI response. Please check your API key and try again.')
  }
}

/**
 * Generate AI response
 */
export async function generateAIResponse(
  message: string,
  mode: AIMode,
  context: ChatContext,
  apiKey?: string,
  model?: string
): Promise<string> {
  if (mode === 'gemini') {
    if (!apiKey) {
      throw new Error('Gemini API key required. Please configure in settings.')
    }
    return await callGeminiAPI(message, context, apiKey, model)
  }

  // MOCK mode
  return generateMockResponse(message)
}

/**
 * Get quick suggest chips
 */
export function getQuickSuggestions(profile?: UserProfile): string[] {
  const baseSuggestions = [
    'Compare Camry vs. Corolla',
    'Explain Toyota Safety Sense',
    'What Toyota EV options exist?',
    'How does leasing differ from financing?',
  ]

  if (!profile?.completed) {
    return baseSuggestions.slice(0, 4)
  }

  const dynamicSuggestions: string[] = []

  if (profile.weekendVibe === 'outdoor_escape' || profile.vehicleEmotion === 'freedom') {
    dynamicSuggestions.push('Show me adventure-ready Toyotas')
  }

  if (profile.weekendVibe === 'family_focused' || /family|kid|parent/i.test(profile.futureChapterNarrative)) {
    dynamicSuggestions.push('Best Toyota for a growing family')
  }

  if (profile.vehicleEmotion === 'efficiency' || profile.spendingStyle === 'investing') {
    dynamicSuggestions.push('Most efficient Toyota hybrids right now')
  }

  if (profile.spendingStyle === 'luxury_experience' || profile.vehicleEmotion === 'thrill') {
    dynamicSuggestions.push('Premium Toyota interiors worth seeing')
  }

  const combined = [...dynamicSuggestions, ...baseSuggestions]
  return Array.from(new Set(combined)).slice(0, 4)
}
