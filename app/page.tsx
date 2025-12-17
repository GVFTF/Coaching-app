import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { COACH_CATEGORIES } from '@/lib/constants'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            CoachConnect
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost">Find a Coach</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Find Your Perfect Coach
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Connect with professional coaches, fitness trainers, physical therapists, and wellness experts for in-person sessions
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Coaches
                </Button>
              </Link>
              <Link href="/auth/signup?role=COACH">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Become a Coach
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Explore Categories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {COACH_CATEGORIES.slice(0, 8).map((category) => (
                <Link key={category.value} href={`/search?category=${category.value}`}>
                  <Card className="cursor-pointer transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-2 text-4xl">{category.icon}</div>
                      <CardTitle className="text-xl">{category.label}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    1
                  </div>
                  <CardTitle>Find Your Coach</CardTitle>
                  <CardDescription>
                    Browse through verified coaches in your area and filter by specialty, price, and availability
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    2
                  </div>
                  <CardTitle>Book a Session</CardTitle>
                  <CardDescription>
                    Choose a time that works for you and securely book your in-person session
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    3
                  </div>
                  <CardTitle>Train & Grow</CardTitle>
                  <CardDescription>
                    Meet with your coach, achieve your goals, and leave a review to help others
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Join thousands of athletes and coaches connecting on CoachConnect
            </p>
            <Link href="/auth/signup">
              <Button size="lg">Sign Up Now</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CoachConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
