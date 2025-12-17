import { CoachCategory } from '@prisma/client'

export const COACH_CATEGORIES = [
  { value: CoachCategory.SPORTS_COACH, label: 'Sports Coach', icon: '⚽' },
  { value: CoachCategory.FITNESS_TRAINER, label: 'Fitness Trainer', icon: '💪' },
  { value: CoachCategory.PHYSICAL_THERAPY, label: 'Physical Therapy', icon: '🏥' },
  { value: CoachCategory.REHABILITATION, label: 'Rehabilitation', icon: '♿' },
  { value: CoachCategory.NUTRITION, label: 'Nutrition Coach', icon: '🥗' },
  { value: CoachCategory.MENTAL_COACH, label: 'Mental Coach', icon: '🧠' },
  { value: CoachCategory.YOGA_PILATES, label: 'Yoga & Pilates', icon: '🧘' },
  { value: CoachCategory.STRENGTH_CONDITIONING, label: 'Strength & Conditioning', icon: '🏋️' },
  { value: CoachCategory.CARDIO_ENDURANCE, label: 'Cardio & Endurance', icon: '🏃' },
  { value: CoachCategory.MARTIAL_ARTS, label: 'Martial Arts', icon: '🥋' },
  { value: CoachCategory.OTHER, label: 'Other', icon: '✨' },
] as const

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
] as const

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const

export const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  }
})
