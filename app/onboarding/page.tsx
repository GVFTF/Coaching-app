import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import CoachOnboarding from '@/components/features/CoachOnboarding'
import AthleteOnboarding from '@/components/features/AthleteOnboarding'

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user has already completed onboarding
  if (user.role === UserRole.COACH) {
    const coachProfile = await db.coachProfile.findUnique({
      where: { userId: user.id },
    })

    if (coachProfile?.city && coachProfile?.categories.length > 0) {
      redirect('/dashboard')
    }
  } else if (user.role === UserRole.ATHLETE) {
    const athleteProfile = await db.athleteProfile.findUnique({
      where: { userId: user.id },
    })

    if (athleteProfile?.city) {
      redirect('/dashboard')
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          {user.role === UserRole.COACH
            ? 'Let athletes know about your expertise and services'
            : 'Help us find the perfect coaches for you'}
        </p>
      </div>

      {user.role === UserRole.COACH ? (
        <CoachOnboarding userId={user.id} />
      ) : (
        <AthleteOnboarding userId={user.id} />
      )}
    </div>
  )
}
