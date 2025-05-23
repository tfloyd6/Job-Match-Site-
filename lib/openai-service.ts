// This file handles OpenAI API integration
import type { ResumeData } from "@/types/resume"

export class OpenAIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async analyzeResume(text: string): Promise<ResumeData> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert resume analyzer. Extract the following information from the resume text and return it as a valid JSON object:
              {
                "name": "string",
                "email": "string", 
                "phone": "string",
                "skills": ["array of strings"],
                "experience": [{"title": "string", "company": "string", "duration": "string", "description": "string"}],
                "education": ["array of strings"],
                "jobTitles": ["array of strings"],
                "summary": "string",
                "yearsOfExperience": 0,
                "certifications": ["array of strings"],
                "projects": ["array of strings"],
                "languages": ["array of strings"],
                "location": "string"
              }`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("No content received from OpenAI")
      }

      const resumeData = JSON.parse(content) as ResumeData

      return this.validateAndCleanData(resumeData)
    } catch (error) {
      console.error("Error analyzing resume with OpenAI:", error)
      throw new Error(`Failed to analyze resume with AI: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async matchJobsWithResume(resumeData: ResumeData, jobDescriptions: any[]): Promise<any[]> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert job matching system. Analyze the resume data and job descriptions to determine match scores and reasons.
              Return a JSON array where each object has:
              {
                "jobId": "string",
                "matchScore": number (0-100),
                "keywordMatches": ["array of matching skills/keywords"],
                "matchReason": "brief explanation of why this is a good match"
              }`,
            },
            {
              role: "user",
              content: `Resume data: ${JSON.stringify(resumeData)}
              
              Job descriptions: ${JSON.stringify(jobDescriptions)}`,
            },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("No content received from OpenAI")
      }

      const result = JSON.parse(content)
      return Array.isArray(result) ? result : result.matches || []
    } catch (error) {
      console.error("Error matching jobs with OpenAI:", error)
      throw new Error(`Failed to match jobs with AI: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private validateAndCleanData(data: any): ResumeData {
    return {
      name: data.name || "Unknown",
      email: data.email || "",
      phone: data.phone || "",
      skills: Array.isArray(data.skills) ? data.skills.slice(0, 20) : [],
      experience: Array.isArray(data.experience) ? data.experience.slice(0, 10) : [],
      education: Array.isArray(data.education) ? data.education.slice(0, 5) : [],
      jobTitles: Array.isArray(data.jobTitles) ? data.jobTitles.slice(0, 5) : [],
      summary: typeof data.summary === "string" ? data.summary.substring(0, 1000) : "",
      yearsOfExperience:
        typeof data.yearsOfExperience === "number" ? Math.max(0, Math.min(50, data.yearsOfExperience)) : 0,
      certifications: Array.isArray(data.certifications) ? data.certifications.slice(0, 10) : [],
      projects: Array.isArray(data.projects) ? data.projects.slice(0, 10) : [],
      languages: Array.isArray(data.languages) ? data.languages.slice(0, 10) : [],
      location: data.location || "",
    }
  }
}
