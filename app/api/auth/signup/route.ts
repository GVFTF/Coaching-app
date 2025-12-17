import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signUpSchema } from '@/lib/validations'
import { UserRole } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role,
      },
    })

    // Create corresponding profile based on role
    if (user.role === UserRole.COACH) {
      await db.coachProfile.create({
        data: {
          userId: user.id,
        },
      })
    } else if (user.role === UserRole.ATHLETE) {
      await db.athleteProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
