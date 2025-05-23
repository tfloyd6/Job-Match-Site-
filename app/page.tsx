import Link from "next/link"
import { ArrowRight, Briefcase, FileText, Search, Users, CheckCircle, Star } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-1.5">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-bold">
              JobMatch
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-purple-600 transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 z-0"></div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-bl from-purple-100/30 to-transparent z-0 rounded-bl-full"></div>
          <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/30 to-transparent z-0 rounded-tr-full"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-2">
                    <Star className="h-3.5 w-3.5 mr-1" />
                    <span>AI-Powered Job Matching</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Find Your Perfect Job Match
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Upload your resume and let our AI match you with the best job opportunities from LinkedIn, Indeed,
                    ZipRecruiter, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/upload">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/20"
                    >
                      Upload Resume <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-2">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt="User"
                    />
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt="User"
                    />
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      className="w-8 h-8 rounded-full border-2 border-white"
                      alt="User"
                    />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600">
                      +5k
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Join thousands of job seekers who found their dream job</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <img
                    alt="Job Match Dashboard"
                    className="relative rounded-2xl shadow-2xl border border-purple-100"
                    height="620"
                    src="/placeholder.svg?height=620&width=1100"
                    width="550"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">95% Match Rate</p>
                        <p className="text-xs text-gray-500">For qualified candidates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-sm text-white font-medium">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Everything You Need to Land Your Dream Job
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses advanced AI to match your skills and experience with the perfect job opportunities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Resume Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our AI analyzes your resume to identify your skills, experience, and career goals.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
                  <Search className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Multi-Source Job Matching
                  </h3>
                  <p className="text-gray-600">
                    We search across LinkedIn, Indeed, ZipRecruiter, and company websites to find the best matches.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                  <Users className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                    Personalized Recommendations
                  </h3>
                  <p className="text-gray-600">
                    Get job recommendations tailored to your unique profile and preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Three simple steps to find your perfect job match.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4 relative">
                <div className="absolute top-0 right-0 -mr-4 lg:mr-0 lg:left-1/2 h-full w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent hidden lg:block"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600">Upload your resume in any common format (PDF, DOCX, TXT).</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 relative">
                <div className="absolute top-0 right-0 -mr-4 lg:mr-0 lg:left-1/2 h-full w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent hidden lg:block"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    AI Analysis
                  </h3>
                  <p className="text-gray-600">
                    Our AI analyzes your resume and searches for matching job opportunities.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                    Get Matched
                  </h3>
                  <p className="text-gray-600">
                    Review your personalized job matches and apply directly through our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-blue-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Success Stories
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from job seekers who found their dream jobs using JobMatch.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-lg shadow-purple-100/20 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Sarah Johnson"
                      className="h-16 w-16 rounded-full border-2 border-purple-100 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-purple-700">Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">Software Engineer</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "I uploaded my resume and within days I had interviews with top tech companies. JobMatch found
                    opportunities I wouldn't have discovered on my own."
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/20 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Michael Chen"
                      className="h-16 w-16 rounded-full border-2 border-blue-100 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-blue-700">Michael Chen</h3>
                      <p className="text-sm text-gray-500">Marketing Manager</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "The AI matching technology is incredible. It understood my experience and found jobs that perfectly
                    matched my skills and career goals."
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-100/20 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Jessica Rodriguez"
                      className="h-16 w-16 rounded-full border-2 border-indigo-100 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-indigo-700">Jessica Rodriguez</h3>
                      <p className="text-sm text-gray-500">UX Designer</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "JobMatch saved me so much time in my job search. Instead of searching multiple sites, I got all my
                    matches in one place."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Find Your Perfect Job?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Upload your resume today and let our AI find the best job matches for you.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/upload">
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-purple-600 hover:bg-blue-50 border-0 shadow-lg shadow-purple-700/20"
                  >
                    Upload Resume <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Create Account
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">5,000+</div>
                  <div className="text-blue-100">Job Seekers</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-blue-100">Match Rate</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-100">Job Listings</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">4.9/5</div>
                  <div className="text-blue-100">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-1.5">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-bold">
                JobMatch
              </span>
            </Link>
            <nav className="flex gap-4 md:gap-6 flex-wrap">
              <Link href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-purple-600 transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Testimonials
              </Link>
              <Link href="/privacy" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm font-medium hover:text-purple-600 transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} JobMatch. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
