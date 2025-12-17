# CoachConnect - Athlete & Coach Marketplace

A modern, mobile-first marketplace connecting athletes with professional coaches, trainers, and wellness experts for in-person sessions. Built with Next.js 14, TypeScript, and PostgreSQL.

## Features

### MVP Features ✅

- **Authentication System**
  - Email/password authentication
  - Role-based access (Athlete, Coach, Admin)
  - Secure session management with NextAuth.js

- **User Profiles**
  - Athlete profiles with goals and interests
  - Coach profiles with expertise, certifications, and pricing
  - Profile onboarding flow

- **Search & Discovery**
  - Advanced filtering (category, location, price, rating)
  - Category-based browse
  - Mobile-responsive search interface

- **Coach Profiles**
  - Detailed coach information
  - Certifications and verification status
  - Reviews and ratings display
  - Pricing information

- **Dashboard**
  - Personalized dashboard for athletes and coaches
  - Booking management
  - Quick actions and stats

### Coming Soon 🚀

- Booking/Calendar System
- Real-time Messaging
- Payment Processing (Stripe)
- Review & Rating System
- Availability Management
- Notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (shadcn/ui style)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe (coming soon)
- **File Uploads**: Uploadthing (for credentials)
- **Real-time**: Pusher (for messaging)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd Coaching-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coaching_app"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Uploadthing (Optional - for file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Pusher (Optional - for real-time messaging)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

#### Local PostgreSQL

Install PostgreSQL on your system:

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo systemctl start postgresql

# Create database
createdb coaching_app
```

#### Using Docker

```bash
docker run --name coaching-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=coaching_app \
  -p 5432:5432 \
  -d postgres:15
```

Then update your `DATABASE_URL` to:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/coaching_app"
```

#### Using a Cloud Database (Recommended for Production)

- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Generous free tier)
- **Railway**: https://railway.app
- **Vercel Postgres**: https://vercel.com/storage/postgres

## Project Structure

```
Coaching-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── coaches/         # Coach-related endpoints
│   │   └── athletes/        # Athlete-related endpoints
│   ├── auth/                # Auth pages (signin, signup)
│   ├── coaches/             # Coach profile pages
│   ├── search/              # Search page
│   ├── dashboard/           # User dashboard
│   ├── onboarding/          # Profile onboarding
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   └── features/            # Feature-specific components
├── lib/
│   ├── auth/               # Auth utilities
│   ├── db.ts               # Prisma client
│   ├── utils.ts            # Utility functions
│   ├── validations.ts      # Zod schemas
│   └── constants.ts        # App constants
├── prisma/
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Database Schema

Key models:

- **User**: Base user model (athletes & coaches)
- **CoachProfile**: Extended profile for coaches
- **AthleteProfile**: Extended profile for athletes
- **Booking**: Session bookings
- **Review**: Coach reviews
- **Message**: Direct messaging
- **Certification**: Coach certifications

See `prisma/schema.prisma` for full schema.

## Development

### Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Railway

1. Connect your GitHub repository
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t coaching-app .

# Run container
docker run -p 3000:3000 coaching-app
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | App URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |
| `UPLOADTHING_SECRET` | Uploadthing secret | No |
| `PUSHER_APP_KEY` | Pusher app key | No |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@coachconnect.com or open an issue on GitHub.

## Roadmap

- [ ] Complete booking/scheduling system
- [ ] Integrate Stripe payments
- [ ] Add real-time messaging
- [ ] Build review system
- [ ] Add availability calendar
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Video session integration
- [ ] Analytics dashboard
- [ ] Multi-language support

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- Prisma for the excellent ORM
- shadcn for UI component inspiration