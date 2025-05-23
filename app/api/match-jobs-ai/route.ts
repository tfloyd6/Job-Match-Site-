import { type NextRequest, NextResponse } from "next/server"
import { MockJobService } from "@/lib/mock-job-data"
import { OpenAIService } from "@/lib/openai-service"
import type { ResumeData } from "@/types/resume"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeData } = body as { resumeData: ResumeData }
    const apiKey = request.headers.get("x-openai-key") || process.env.OPENAI_API_KEY

    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is required" }, { status: 400 })
    }

    console.log(`Finding AI job matches for: ${resumeData.name}`)
    console.log(`Skills: ${resumeData.skills.join(", ")}`)

    // Use mock job service to get job listings
    const jobService = new MockJobService()
    const jobs = jobService.generateJobsForSkills(resumeData.skills, 20)

    // Extract job descriptions for AI matching
    const jobDescriptions = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills,
    }))

    // Use OpenAI to match jobs with resume
    const openAIService = new OpenAIService(apiKey)
    const matchResults = await openAIService.matchJobsWithResume(resumeData, jobDescriptions)

    // Combine AI match results with job data
    const enhancedJobs = jobs.map((job) => {
      const matchResult = Array.isArray(matchResults) ? matchResults.find((match: any) => match.jobId === job.id) : null

      if (matchResult) {
        return {
          ...job,
          matchScore: matchResult.matchScore || job.matchScore,
          keywordMatches: matchResult.keywordMatches || job.keywordMatches,
          matchReason: matchResult.matchReason,
        }
      }
      return job
    })

    // Sort by match score
    const sortedMatches = enhancedJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

    console.log(`Found ${sortedMatches.length} AI-enhanced job matches`)

    return NextResponse.json({
      success: true,
      matches: sortedMatches,
      totalFound: sortedMatches.length,
    })
  } catch (error) {
    console.error("Error matching jobs with AI:", error)
    return NextResponse.json(
      {
        error: `Failed to match jobs with AI: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
