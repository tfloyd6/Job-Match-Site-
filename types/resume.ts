export interface ResumeData {
  name: string
  email: string
  phone: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description?: string
  }>
  education: string[]
  jobTitles: string[]
  summary: string
  yearsOfExperience: number
  certifications: string[]
  projects: string[]
  languages: string[]
  location: string
}

export interface ParsedResume {
  id: string
  userId: string
  fileName: string
  fileUrl: string
  textContent: string
  resumeData: ResumeData
  status: "UPLOADED" | "PARSING" | "ANALYZED" | "ERROR"
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}
