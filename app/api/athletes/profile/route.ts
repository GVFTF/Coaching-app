import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { athleteProfileSchema } from '@/lib/validations'
import { UserRole } from '@prisma/client'

export async function PUT(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.ATHLETE) {
      return NextResponse.json(
        { error: 'Only athletes can update athlete profiles' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = athleteProfileSchema.parse(body)

    const updatedProfile = await db.athleteProfile.update({
      where: {
        userId: user.id,
      },
      data: {
        bio: validatedData.bio,
        goals: validatedData.goals || [],
        interests: validatedData.interests || [],
        city: validatedData.city,
        state: validatedData.state,
        country: validatedData.country,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('[ATHLETE_PROFILE_UPDATE_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.ATHLETE) {
      return NextResponse.json(
        { error: 'Only athletes can access athlete profiles' },
        { status: 403 }
      )
    }

    const profile = await db.athleteProfile.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('[ATHLETE_PROFILE_GET_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
