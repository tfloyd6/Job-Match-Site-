import { type NextRequest, NextResponse } from "next/server"
import { DocumentParserService } from "@/lib/document-parser"
import { ResumeAnalyzerService } from "@/lib/resume-analyzer"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Please upload a PDF, Word document, or text file.",
        },
        { status: 400 },
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Please upload a file smaller than 10MB.",
        },
        { status: 400 },
      )
    }

    console.log(`Processing file: ${file.name} (${file.type}, ${file.size} bytes)`)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse the document
    const parserService = new DocumentParserService()
    const parsedDocument = await parserService.parseDocument(buffer, file.type, file.name)

    console.log(`Extracted ${parsedDocument.text.length} characters from document`)

    // Analyze the resume
    const analyzerService = new ResumeAnalyzerService()
    const resumeData = await analyzerService.analyzeResume(parsedDocument.text)

    console.log(`Analyzed resume for: ${resumeData.name}`)
    console.log(`Found ${resumeData.skills.length} skills, ${resumeData.experience.length} experiences`)

    return NextResponse.json({
      success: true,
      resumeData,
      originalText: parsedDocument.text.substring(0, 500) + "...", // Preview
      metadata: parsedDocument.metadata,
    })
  } catch (error) {
    console.error("Error processing resume:", error)

    // Ensure we always return a proper JSON response
    return NextResponse.json(
      {
        error: `Failed to process resume: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
