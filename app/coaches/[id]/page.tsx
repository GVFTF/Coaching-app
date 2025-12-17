import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COACH_CATEGORIES } from '@/lib/constants'
import { formatPrice, getInitials } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth/session'

export default async function CoachDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const currentUser = await getCurrentUser()

  const coach = await db.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      coachProfile: {
        include: {
          certifications: true,
        },
      },
      reviewsReceived: {
        include: {
          reviewer: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  })

  if (!coach || !coach.coachProfile) {
    notFound()
  }

  const profile = coach.coachProfile

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
              <Button variant="ghost">Back to Search</Button>
            </Link>
            {currentUser && (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Coach Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src={coach.image || undefined} />
                <AvatarFallback className="text-3xl">
                  {getInitials(coach.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold">{coach.name}</h1>
                {profile.title && (
                  <p className="mb-2 text-xl text-muted-foreground">{profile.title}</p>
                )}

                <div className="mb-4 flex flex-wrap items-center gap-4">
                  {profile.city && profile.state && (
                    <p className="text-muted-foreground">
                      📍 {profile.city}, {profile.state}
                    </p>
                  )}
                  {profile.yearsOfExperience && (
                    <p className="text-muted-foreground">
                      🎯 {profile.yearsOfExperience} years experience
                    </p>
                  )}
                  {profile.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{profile.averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({profile.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {profile.categories.map((category) => {
                    const cat = COACH_CATEGORIES.find((c) => c.value === category)
                    return (
                      <Badge key={category} variant="secondary">
                        {cat?.icon} {cat?.label}
                      </Badge>
                    )
                  })}
                </div>

                {currentUser && currentUser.id !== coach.id && (
                  <div className="flex gap-2">
                    <Link href={`/booking/new?coachId=${coach.id}`}>
                      <Button size="lg">Book a Session</Button>
                    </Link>
                    <Link href={`/messages?userId=${coach.id}`}>
                      <Button size="lg" variant="outline">
                        Send Message
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 md:w-48">
                <p className="mb-1 text-sm text-muted-foreground">Pricing</p>
                {profile.hourlyRate && (
                  <p className="mb-1 text-2xl font-bold">
                    {formatPrice(profile.hourlyRate)}<span className="text-sm font-normal">/hr</span>
                  </p>
                )}
                {profile.sessionRate && (
                  <p className="text-lg font-semibold">
                    {formatPrice(profile.sessionRate)}<span className="text-sm font-normal">/session</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  {profile.totalReviews > 0
                    ? `${profile.totalReviews} total reviews`
                    : 'No reviews yet'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {coach.reviewsReceived.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    This coach hasn&apos;t received any reviews yet.
                  </p>
                ) : (
                  coach.reviewsReceived.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="mb-2 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.reviewer.image || undefined} />
                          <AvatarFallback>
                            {getInitials(review.reviewer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{review.reviewer.name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                            {Array.from({ length: 5 - review.rating }).map((_, i) => (
                              <span key={i} className="text-gray-300">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="rounded-lg border p-3">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuingOrg}</p>
                      {cert.verified && (
                        <Badge variant="secondary" className="mt-1">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.verificationStatus === 'VERIFIED' ? (
                  <Badge variant="default">✓ Verified Coach</Badge>
                ) : profile.verificationStatus === 'PENDING' ? (
                  <Badge variant="secondary">Pending Verification</Badge>
                ) : (
                  <Badge variant="outline">Not Verified</Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
