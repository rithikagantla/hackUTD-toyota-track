import Hero from '../components/layout/Hero'
import Card from '../components/ui/Card'
import { Lightbulb, Target, Shield, Heart } from 'lucide-react'

export default function About() {
  return (
    <div>
      <Hero
        title="About Toyota Nexus"
        subtitle="Your next chapter deserves the perfect ride—we map your vibe to your ideal Toyota companion"
        compact
      />

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-6 text-center">
              Our Mission
            </h2>
            <Card padding="lg">
              <p className="text-lg text-toyota-gray-dark leading-relaxed text-center">
                Toyota Nexus reimagines car shopping as a journey of self-discovery. Instead of
                drowning you in specs and sales pitches, we ask about your life—your weekend vibe,
                your dreams for the next 3-5 years, how you spend your free time. Then we translate
                those stories into the perfect Toyota match. Because your vehicle should amplify who
                you are and where you're going.
              </p>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-8 text-center">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Target className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Vibe-Based Matching
                    </h3>
                    <p className="text-toyota-gray-dark">
                      We don't just ask about MPG and cargo space. We ask about your weekends,
                      your emotions, your dreams. Then we match you to a Toyota that amplifies your life.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Transparency
                    </h3>
                    <p className="text-toyota-gray-dark">
                      No hidden fees or surprises. See accurate payment estimates with full
                      breakdowns for both financing and leasing options.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Story-Driven AI
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Our AI reads between the lines of your narrative. It finds patterns in your
                      lifestyle choices and translates them into the perfect vehicle fit.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-toyota-red/10 rounded-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-toyota-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      User-First
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Built with your needs in mind. Accessible, easy to use, and designed
                      to help you make confident decisions.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-toyota-black mb-8 text-center">
              How It Works
            </h2>
            <Card padding="lg">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Share Your Weekend Vibe
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Tell us if you're hitting city brunch spots, escaping to trailheads, running
                      kids to games, or tackling DIY projects. Your off-duty rhythm reveals a lot.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Define Your Vehicle Emotion
                    </h3>
                    <p className="text-toyota-gray-dark">
                      When you picture your next ride, what hits first? Security? Efficiency? Freedom?
                      Thrill? Your gut feeling guides us to the right vehicle DNA.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Show Us Your Spending Style
                    </h3>
                    <p className="text-toyota-gray-dark">
                      You get a free Saturday and $500—are you stacking savings, packing the trunk for
                      Home Depot, planning a road trip, or dressing up for the city? Your choices matter.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Paint Your Future Chapter
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Write about what you're building in the next 3-5 years. Whether it's family growth,
                      career moves, or new adventures, your next vehicle should boost that story.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-toyota-red text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-toyota-black mb-1">
                      Get Your Perfect Match
                    </h3>
                    <p className="text-toyota-gray-dark">
                      Our AI translates your answers into personalized Toyota recommendations. See payment
                      options, compare models, and chat with our assistant for deeper insights.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card padding="lg" className="bg-toyota-gray-light border-0">
            <h3 className="font-semibold text-toyota-black mb-2">Important Note</h3>
            <p className="text-sm text-toyota-gray-dark">
              Toyota Nexus is a demonstration project showcasing modern web development practices
              and AI integration. This application is not affiliated with Toyota Motor Corporation.
              All vehicle information, pricing, and payment estimates are for demonstration
              purposes only and should not be used for actual purchasing decisions. Always consult
              with an authorized Toyota dealer for accurate, up-to-date information.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
