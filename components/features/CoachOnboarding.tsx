'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COACH_CATEGORIES, US_STATES } from '@/lib/constants'
import { CoachCategory, PricingModel } from '@prisma/client'

interface CoachOnboardingProps {
  userId: string
}

export default function CoachOnboarding({ userId }: CoachOnboardingProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<CoachCategory[]>([])

  const toggleCategory = (category: CoachCategory) => {
    setSelectedCategories((prev) =>
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
      bio: formData.get('bio') as string,
      title: formData.get('title') as string,
      yearsOfExperience: parseInt(formData.get('yearsOfExperience') as string),
      categories: selectedCategories,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: 'United States',
      pricingModel: formData.get('pricingModel') as PricingModel,
      hourlyRate: formData.get('hourlyRate') ? parseFloat(formData.get('hourlyRate') as string) : undefined,
      sessionRate: formData.get('sessionRate') ? parseFloat(formData.get('sessionRate') as string) : undefined,
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/coaches/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      router.push('/dashboard')
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
          <CardTitle>Coach Profile</CardTitle>
          <CardDescription>
            Tell athletes about your expertise and set your rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Certified Personal Trainer"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell athletes about your background, certifications, and coaching philosophy..."
              rows={5}
              required
              minLength={50}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min="0"
              max="70"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Categories (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {COACH_CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  variant={selectedCategories.includes(category.value) ? 'default' : 'outline'}
                  onClick={() => toggleCategory(category.value)}
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

          <div className="space-y-2">
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select id="pricingModel" name="pricingModel" required disabled={isLoading}>
              <option value={PricingModel.HOURLY}>Hourly Rate</option>
              <option value={PricingModel.PER_SESSION}>Per Session</option>
              <option value={PricingModel.PACKAGE}>Package</option>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="50.00"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionRate">Session Rate ($)</Label>
              <Input
                id="sessionRate"
                name="sessionRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="75.00"
                disabled={isLoading}
              />
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
