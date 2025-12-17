import { z } from 'zod'
import { CoachCategory, PricingModel, UserRole } from '@prisma/client'

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Coach profile schema
export const coachProfileSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters').optional(),
  title: z.string().min(2, 'Title must be at least 2 characters').optional(),
  yearsOfExperience: z.number().min(0).max(70).optional(),
  categories: z.array(z.nativeEnum(CoachCategory)).min(1, 'Select at least one category'),
  specialties: z.array(z.string()).optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  address: z.string().optional(),
  serviceRadius: z.number().min(1).max(100).optional(),
  pricingModel: z.nativeEnum(PricingModel),
  hourlyRate: z.number().min(0).optional(),
  sessionRate: z.number().min(0).optional(),
  packageDetails: z.string().optional(),
})

// Athlete profile schema
export const athleteProfileSchema = z.object({
  bio: z.string().optional(),
  goals: z.array(z.string()).optional(),
  interests: z.array(z.nativeEnum(CoachCategory)).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

// Booking schema
export const bookingSchema = z.object({
  coachId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().min(5, 'Please provide a valid location'),
  notes: z.string().optional(),
})

// Review schema
export const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').optional(),
})

// Message schema
export const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1, 'Message cannot be empty'),
})

// Search/Filter schema
export const searchSchema = z.object({
  query: z.string().optional(),
  categories: z.array(z.nativeEnum(CoachCategory)).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(0).max(5).optional(),
})
