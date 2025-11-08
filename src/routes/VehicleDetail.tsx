import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Zap, Star, Award } from 'lucide-react'
import { getVehicleById } from '../data/vehicles'
import { useProfileStore } from '../store/profile'
import { formatCurrency } from '../lib/finance'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ReasonPanel from '../components/ReasonPanel'
import PaymentBreakdown from '../components/PaymentBreakdown'
import { motion } from 'framer-motion'

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useProfileStore()
  const navigate = useNavigate()

  const vehicle = id ? getVehicleById(id) : undefined

  if (!vehicle) {
    return <Navigate to="/app/explore" replace />
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="bg-toyota-gray-light border-b border-gray-200">
        <div className="container-custom py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </div>

      {/* Vehicle Header */}
      <section className="py-12 bg-toyota-gray-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card padding="none" className="overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={vehicle.fuelType === 'ev' ? 'success' : 'info'}>
                  {vehicle.fuelType === 'ev' ? 'Electric' : vehicle.fuelType === 'hybrid' ? 'Hybrid' : 'Gasoline'}
                </Badge>
                <Badge>{vehicle.bodyStyle.toUpperCase()}</Badge>
                {vehicle.safetyRating === 5 && (
                  <Badge variant="warning">5-Star Safety</Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-toyota-black mb-4">
                {vehicle.name}
              </h1>

              <p className="text-lg text-toyota-gray-dark mb-6">
                {vehicle.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-toyota-gray-dark mb-1">Starting MSRP</div>
                  <div className="text-3xl font-bold text-toyota-red">
                    {formatCurrency(vehicle.msrp)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-toyota-gray-dark mb-1">Fuel Economy</div>
                  <div className="text-2xl font-bold text-toyota-black flex items-center gap-2">
                    {vehicle.fuelType === 'ev' ? (
                      <span>252 mi range</span>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 text-green-600" />
                        {vehicle.mpgCombined} MPG
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/app/quiz">
                  <Button size="lg">Get Personalized Match</Button>
                </Link>
                <Button variant="outline" size="lg">
                  Schedule Test Drive
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Specs */}
              <Card padding="lg">
                <h2 className="text-2xl font-semibold text-toyota-black mb-6">
                  Key Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-toyota-red/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-toyota-red" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">{vehicle.seating}</div>
                    <div className="text-sm text-toyota-gray-dark">Passengers</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">
                      {vehicle.fuelType === 'ev' ? 'EV' : `${vehicle.mpgCity}`}
                    </div>
                    <div className="text-sm text-toyota-gray-dark">
                      {vehicle.fuelType === 'ev' ? 'Zero Emissions' : 'City MPG'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">
                      {vehicle.fuelType === 'ev' ? '252mi' : vehicle.mpgHighway}
                    </div>
                    <div className="text-sm text-toyota-gray-dark">
                      {vehicle.fuelType === 'ev' ? 'Range' : 'Highway MPG'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-toyota-black">{vehicle.safetyRating}/5</div>
                    <div className="text-sm text-toyota-gray-dark">Safety Rating</div>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card padding="lg">
                <h2 className="text-2xl font-semibold text-toyota-black mb-6">
                  Standard Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-toyota-red flex-shrink-0 mt-0.5" />
                      <span className="text-toyota-gray-dark">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tags */}
              <Card padding="lg">
                <h2 className="text-2xl font-semibold text-toyota-black mb-4">
                  Best For
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.tags.map((tag) => (
                    <Badge key={tag} size="md">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Reason Panel */}
              {profile.completed && <ReasonPanel vehicle={vehicle} profile={profile} />}

              {/* Payment Breakdown */}
              <PaymentBreakdown vehicle={vehicle} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
