import { type NextRequest, NextResponse } from "next/server"
import { MockJobService } from "@/lib/mock-job-data"
import type { ResumeData } from "@/types/resume"

export async function POST(request: NextRequest) {
  try {
    const { resumeData } = (await request.json()) as { resumeData: ResumeData }

    if (!resumeData) {
      return NextResponse.json({ error: "No resume data provided" }, { status: 400 })
    }

    console.log(`Finding job matches for: ${resumeData.name}`)
    console.log(`Skills: ${resumeData.skills.join(", ")}`)

    // Use mock job service to find matches
    const jobService = new MockJobService()
    const jobs = jobService.searchJobs({
      keywords: resumeData.skills,
      // Could also use location from resume if available
    })

    // Limit to top 20 matches
    const topMatches = jobs.slice(0, 20)

    console.log(`Found ${topMatches.length} job matches`)

    return NextResponse.json({
      success: true,
      matches: topMatches,
      totalFound: jobs.length,
    })
  } catch (error) {
    console.error("Error matching jobs:", error)
    return NextResponse.json(
      {
        error: `Failed to match jobs: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
