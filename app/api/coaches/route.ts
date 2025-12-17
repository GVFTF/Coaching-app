import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationStatus } from '@prisma/client'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const query = searchParams.get('query') || ''
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined

    const coaches = await db.coachProfile.findMany({
      where: {
        AND: [
          {
            verificationStatus: VerificationStatus.VERIFIED,
          },
          categories.length > 0
            ? {
                categories: {
                  hasSome: categories,
                },
              }
            : {},
          city
            ? {
                city: {
                  contains: city,
                  mode: 'insensitive',
                },
              }
            : {},
          state
            ? {
                state: {
                  equals: state,
                },
              }
            : {},
          minPrice !== undefined || maxPrice !== undefined
            ? {
                OR: [
                  {
                    hourlyRate: {
                      gte: minPrice,
                      lte: maxPrice,
                    },
                  },
                  {
                    sessionRate: {
                      gte: minPrice,
                      lte: maxPrice,
                    },
                  },
                ],
              }
            : {},
          minRating
            ? {
                averageRating: {
                  gte: minRating,
                },
              }
            : {},
          query
            ? {
                OR: [
                  {
                    bio: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    title: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    user: {
                      name: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                  },
                ],
              }
            : {},
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        averageRating: 'desc',
      },
    })

    return NextResponse.json(coaches)
  } catch (error) {
    console.error('[COACHES_SEARCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to search coaches' },
      { status: 500 }
    )
  }
}
