'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { COACH_CATEGORIES, US_STATES } from '@/lib/constants'
import { CoachCategory } from '@prisma/client'

interface AthleteOnboardingProps {
  userId: string
}

export default function AthleteOnboarding({ userId }: AthleteOnboardingProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<CoachCategory[]>([])

  const toggleInterest = (category: CoachCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)

    const data = {
      bio: formData.get('bio') as string || undefined,
      interests: selectedInterests,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: 'United States',
    }

    try {
      const response = await fetch('/api/athletes/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      router.push('/search')
      router.refresh()
    } catch (error) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Athlete Profile</CardTitle>
          <CardDescription>
            Help us find the perfect coaches for your goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell coaches about your fitness goals, experience level, and what you're looking for..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Interests (Optional)</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {COACH_CATEGORIES.slice(0, 9).map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  variant={selectedInterests.includes(category.value) ? 'default' : 'outline'}
                  onClick={() => toggleInterest(category.value)}
                  disabled={isLoading}
                  className="h-auto flex-col gap-1 py-3"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs">{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="San Francisco"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select id="state" name="state" required disabled={isLoading}>
                <option value="">Select state</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
