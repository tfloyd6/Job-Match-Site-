// Create a simpler fallback parser API route
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simple text extraction based on file type
    let text = ""

    if (file.type === "text/plain") {
      // For text files, just read the text
      text = await file.text()
    } else {
      // For other files, extract basic info
      text = `File name: ${file.name}\nFile type: ${file.type}\nFile size: ${file.size} bytes`

      // Add a sample of text content if possible
      try {
        if (file.type.includes("text") || file.type.includes("document")) {
          const sample = await file.text()
          text += `\n\nSample content:\n${sample.substring(0, 1000)}...`
        }
      } catch (e) {
        console.error("Could not extract text sample:", e)
      }
    }

    // Generate mock resume data
    const mockResumeData = {
      name: "Sample User",
      email: "user@example.com",
      phone: "555-123-4567",
      skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
      experience: [
        {
          title: "Frontend Developer",
          company: "Tech Company",
          duration: "2020 - Present",
          description: "Developed web applications using React and TypeScript.",
        },
        {
          title: "Web Developer",
          company: "Digital Agency",
          duration: "2018 - 2020",
          description: "Created responsive websites for clients.",
        },
      ],
      education: ["Bachelor of Science in Computer Science, University"],
      jobTitles: ["Frontend Developer", "Web Developer"],
      summary: "Experienced web developer with a focus on frontend technologies.",
      yearsOfExperience: 4,
      certifications: ["AWS Certified Developer"],
      projects: ["E-commerce Website", "Portfolio Site"],
      languages: ["English", "Spanish"],
      location: "San Francisco, CA",
    }

    return NextResponse.json({
      success: true,
      resumeData: mockResumeData,
      originalText: text.substring(0, 500) + "...", // Preview
      metadata: {
        fileSize: file.size,
        wordCount: text.split(/\s+/).length,
      },
    })
  } catch (error) {
    console.error("Error in fallback parser:", error)

    return NextResponse.json(
      {
        error: `Fallback parser error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
