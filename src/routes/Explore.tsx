import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Zap } from 'lucide-react'
import Hero from '../components/layout/Hero'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Slider from '../components/ui/Slider'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { vehicles } from '../data/vehicles'
import { applyFilters, defaultFilters, FilterOptions } from '../lib/filters'
import { formatCurrency } from '../lib/finance'
import { FuelType, BodyStyle } from '../data/vehicles'
import { motion } from 'framer-motion'

export default function Explore() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [showFilters, setShowFilters] = useState(true)

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredVehicles = useMemo(() => {
    return applyFilters(vehicles, filters)
  }, [filters])

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const fuelTypeOptions = [
    { value: 'any', label: 'Any Fuel Type' },
    { value: 'gas', label: 'Gasoline' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'ev', label: 'Electric' },
  ]

  const bodyStyleOptions = [
    { value: 'any', label: 'Any Body Style' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' },
    { value: 'minivan', label: 'Minivan' },
    { value: 'hatchback', label: 'Hatchback' },
  ]

  return (
    <div>
      <Hero
        title="Explore Our Vehicles"
        subtitle="Browse the complete Toyota lineup and find your perfect match"
        compact
      />

      <section className="py-12 bg-white">
        <div className="container-custom">
          {/* Filter Toggle Button (Mobile) */}
          <div className="mb-6 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-80 flex-shrink-0"
              >
                <Card padding="lg" className="sticky top-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-toyota-black">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-toyota-red"
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toyota-gray-dark" />
                      <Input
                        placeholder="Search vehicles..."
                        value={filters.searchQuery}
                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Fuel Type */}
                    <Select
                      label="Fuel Type"
                      value={filters.fuelType}
                      onChange={(e) =>
                        updateFilter('fuelType', e.target.value as FuelType | 'any')
                      }
                      options={fuelTypeOptions}
                    />

                    {/* Body Style */}
                    <Select
                      label="Body Style"
                      value={filters.bodyStyle}
                      onChange={(e) =>
                        updateFilter('bodyStyle', e.target.value as BodyStyle | 'any')
                      }
                      options={bodyStyleOptions}
                    />

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-toyota-black">
                        Price Range
                      </label>
                      <div className="space-y-3">
                        <Slider
                          label="Min Price"
                          min={20000}
                          max={60000}
                          step={1000}
                          value={filters.priceMin}
                          onChange={(e) =>
                            updateFilter('priceMin', Number(e.target.value))
                          }
                          formatValue={(v) => formatCurrency(v)}
                        />
                        <Slider
                          label="Max Price"
                          min={20000}
                          max={60000}
                          step={1000}
                          value={filters.priceMax}
                          onChange={(e) =>
                            updateFilter('priceMax', Number(e.target.value))
                          }
                          formatValue={(v) => formatCurrency(v)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.aside>
            )}

            {/* Vehicle Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-toyota-black">
                  {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? 's' : ''}{' '}
                  Found
                </h2>
              </div>

              {/* Loading State */}
              {filteredVehicles.length === 0 ? (
                /* Empty State */
                <Card padding="lg" className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-toyota-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-toyota-gray-dark" />
                    </div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      No vehicles found
                    </h3>
                    <p className="text-toyota-gray-dark mb-6">
                      Try adjusting your filters to see more results
                    </p>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                </Card>
              ) : (
                /* Vehicle Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link to={`/app/vehicle/${vehicle.id}`}>
                        <Card hover padding="none" className="overflow-hidden h-full">
                          <div className="relative">
                            <img
                              src={vehicle.image}
                              alt={vehicle.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge variant={vehicle.fuelType === 'ev' ? 'success' : 'info'}>
                                {vehicle.fuelType === 'ev' ? 'Electric' : vehicle.fuelType === 'hybrid' ? 'Hybrid' : 'Gas'}
                              </Badge>
                              {vehicle.safetyRating === 5 && (
                                <Badge variant="warning">5-Star Safety</Badge>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-toyota-black mb-2">
                              {vehicle.name}
                            </h3>
                            <p className="text-sm text-toyota-gray-dark mb-3 line-clamp-2">
                              {vehicle.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-xs text-toyota-gray-dark">Starting at</div>
                                <div className="text-lg font-bold text-toyota-red">
                                  {formatCurrency(vehicle.msrp)}
                                </div>
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
                            <div className="flex flex-wrap gap-1">
                              {vehicle.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} size="sm">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
