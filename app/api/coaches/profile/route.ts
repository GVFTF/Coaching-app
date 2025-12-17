import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { coachProfileSchema } from '@/lib/validations'
import { UserRole } from '@prisma/client'

export async function PUT(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.COACH) {
      return NextResponse.json(
        { error: 'Only coaches can update coach profiles' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = coachProfileSchema.parse(body)

    const updatedProfile = await db.coachProfile.update({
      where: {
        userId: user.id,
      },
      data: {
        bio: validatedData.bio,
        title: validatedData.title,
        yearsOfExperience: validatedData.yearsOfExperience,
        categories: validatedData.categories,
        specialties: validatedData.specialties || [],
        city: validatedData.city,
        state: validatedData.state,
        country: validatedData.country,
        address: validatedData.address,
        serviceRadius: validatedData.serviceRadius,
        pricingModel: validatedData.pricingModel,
        hourlyRate: validatedData.hourlyRate,
        sessionRate: validatedData.sessionRate,
        packageDetails: validatedData.packageDetails,
      },
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('[COACH_PROFILE_UPDATE_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== UserRole.COACH) {
      return NextResponse.json(
        { error: 'Only coaches can access coach profiles' },
        { status: 403 }
      )
    }

    const profile = await db.coachProfile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        certifications: true,
        availability: true,
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
    console.error('[COACH_PROFILE_GET_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
