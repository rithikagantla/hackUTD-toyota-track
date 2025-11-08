import { Vehicle, FuelType, BodyStyle } from '../data/vehicles'

export interface FilterOptions {
  fuelType: FuelType | 'any'
  bodyStyle: BodyStyle | 'any'
  priceMin: number
  priceMax: number
  searchQuery: string
}

export function applyFilters(vehicles: Vehicle[], filters: FilterOptions): Vehicle[] {
  let filtered = [...vehicles]

  // Fuel type filter
  if (filters.fuelType !== 'any') {
    filtered = filtered.filter((v) => v.fuelType === filters.fuelType)
  }

  // Body style filter
  if (filters.bodyStyle !== 'any') {
    filtered = filtered.filter((v) => v.bodyStyle === filters.bodyStyle)
  }

  // Price range filter
  filtered = filtered.filter(
    (v) => v.msrp >= filters.priceMin && v.msrp <= filters.priceMax
  )

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.features.some((f) => f.toLowerCase().includes(query)) ||
        v.tags.some((t) => t.toLowerCase().includes(query))
    )
  }

  return filtered
}

export const defaultFilters: FilterOptions = {
  fuelType: 'any',
  bodyStyle: 'any',
  priceMin: 20000,
  priceMax: 60000,
  searchQuery: '',
}
