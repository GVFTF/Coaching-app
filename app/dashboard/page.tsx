import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserRole } from '@prisma/client'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { signOut } from 'next-auth/react'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch user's bookings
  const bookings = await db.booking.findMany({
    where: user.role === UserRole.COACH
      ? { coachId: user.id }
      : { athleteId: user.id },
    include: {
      coach: {
        select: {
          name: true,
          image: true,
        },
      },
      athlete: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      startTime: 'desc',
    },
    take: 10,
  })

  // Fetch profile info
  let profile = null
  if (user.role === UserRole.COACH) {
    profile = await db.coachProfile.findUnique({
      where: { userId: user.id },
    })
  } else {
    profile = await db.athleteProfile.findUnique({
      where: { userId: user.id },
    })
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
            <Link href="/search">
              <Button variant="ghost">Find Coaches</Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost">Messages</Button>
            </Link>
            <form action={async () => {
              'use server'
              const { signOut } = await import('next-auth/react')
              // Note: This won't work in server component. We'll need client component
            }}>
              <Button variant="ghost" type="button">Sign Out</Button>
            </form>
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            {user.role === UserRole.COACH
              ? 'Manage your coaching sessions and grow your business'
              : 'Track your training sessions and connect with coaches'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                {user.role === UserRole.COACH && profile ? (
                  <>
                    <div className="text-2xl font-bold">{(profile as any).totalSessions || 0}</div>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                    <div className="mt-2">
                      <Badge variant={(profile as any).verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                        {(profile as any).verificationStatus === 'VERIFIED' ? '✓ Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{bookings.length}</div>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </>
                )}
              </CardContent>
            </Card>

            {user.role === UserRole.COACH && profile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {(profile as any).averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(profile as any).totalReviews} reviews
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {user.role === UserRole.COACH ? (
                  <>
                    <Link href="/onboarding" className="block">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/availability" className="block">
                      <Button variant="outline" className="w-full">
                        Set Availability
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/search" className="block">
                      <Button variant="default" className="w-full">
                        Find a Coach
                      </Button>
                    </Link>
                    <Link href="/onboarding" className="block">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bookings */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {user.role === UserRole.COACH ? 'Your Sessions' : 'Your Bookings'}
                </CardTitle>
                <CardDescription>
                  {bookings.length > 0
                    ? `You have ${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`
                    : 'No bookings yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                      {user.role === UserRole.COACH
                        ? "You don't have any upcoming sessions yet."
                        : "You haven't booked any sessions yet."}
                    </p>
                    {user.role === UserRole.ATHLETE && (
                      <Link href="/search">
                        <Button>Browse Coaches</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="font-medium">
                              {user.role === UserRole.COACH
                                ? booking.athlete.name
                                : booking.coach.name}
                            </p>
                            <Badge
                              variant={
                                booking.status === 'CONFIRMED'
                                  ? 'default'
                                  : booking.status === 'PENDING'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(booking.startTime)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📍 {booking.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(booking.totalPrice)}</p>
                          {booking.status === 'PENDING' && user.role === UserRole.COACH && (
                            <div className="mt-2 space-x-2">
                              <Button size="sm" variant="default">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
