'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COACH_CATEGORIES, US_STATES } from '@/lib/constants'
import { CoachCategory } from '@prisma/client'
import { formatPrice, getInitials } from '@/lib/utils'

interface Coach {
  id: string
  userId: string
  title: string | null
  bio: string | null
  categories: CoachCategory[]
  city: string | null
  state: string | null
  hourlyRate: number | null
  sessionRate: number | null
  averageRating: number
  totalReviews: number
  user: {
    id: string
    name: string
    image: string | null
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: '',
    category: searchParams.get('category') || '',
    city: '',
    state: '',
  })

  useEffect(() => {
    fetchCoaches()
  }, [])

  async function fetchCoaches() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.set('query', filters.query)
      if (filters.category) params.set('categories', filters.category)
      if (filters.city) params.set('city', filters.city)
      if (filters.state) params.set('state', filters.state)

      const response = await fetch(`/api/coaches?${params.toString()}`)
      const data = await response.json()

      // Only set coaches if data is an array
      if (Array.isArray(data)) {
        setCoaches(data)
      } else {
        console.error('API returned non-array data:', data)
        setCoaches([])
      }
    } catch (error) {
      console.error('Failed to fetch coaches:', error)
      setCoaches([])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchCoaches()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            CoachConnect
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold">Find Your Perfect Coach</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Name, title, specialty..."
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {COACH_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Any city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  id="state"
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                >
                  <option value="">All States</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Search Coaches
            </Button>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading coaches...</div>
        ) : coaches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              No coaches found matching your criteria. Try adjusting your filters.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <Link key={coach.id} href={`/coaches/${coach.userId}`}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={coach.user.image || undefined} />
                        <AvatarFallback>{getInitials(coach.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{coach.user.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {coach.title || 'Coach'}
                        </CardDescription>
                        {coach.city && coach.state && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {coach.city}, {coach.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {coach.bio && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {coach.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {coach.categories.slice(0, 3).map((category) => {
                        const cat = COACH_CATEGORIES.find((c) => c.value === category)
                        return (
                          <Badge key={category} variant="secondary">
                            {cat?.icon} {cat?.label}
                          </Badge>
                        )
                      })}
                      {coach.categories.length > 3 && (
                        <Badge variant="outline">+{coach.categories.length - 3}</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        {coach.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{coach.averageRating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">
                              ({coach.totalReviews})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {coach.hourlyRate && (
                          <p className="font-semibold">
                            {formatPrice(coach.hourlyRate)}/hr
                          </p>
                        )}
                        {coach.sessionRate && !coach.hourlyRate && (
                          <p className="font-semibold">
                            {formatPrice(coach.sessionRate)}/session
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
