import type { ResumeData } from "@/types/resume"

export class ResumeAnalyzerService {
  async analyzeResume(textContent: string): Promise<ResumeData> {
    try {
      // For now, we'll use rule-based extraction instead of AI
      // This can be upgraded to use AI later when you're ready
      const resumeData = this.extractResumeDataRuleBased(textContent)

      return this.validateAndCleanData(resumeData)
    } catch (error) {
      console.error("Error analyzing resume:", error)
      throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private extractResumeDataRuleBased(text: string): ResumeData {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    return {
      name: this.extractName(lines, text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      jobTitles: this.extractJobTitles(text),
      summary: this.extractSummary(text),
      yearsOfExperience: this.calculateYearsOfExperience(text),
      certifications: this.extractCertifications(text),
      projects: this.extractProjects(text),
      languages: this.extractLanguages(text),
      location: this.extractLocation(text),
    }
  }

  private extractName(lines: string[], text: string): string {
    // Look for name in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i]

      // Skip lines that are clearly not names
      if (
        line.includes("@") ||
        line.includes("http") ||
        line.match(/^\d/) ||
        line.toLowerCase().includes("resume") ||
        line.toLowerCase().includes("cv") ||
        line.length > 50
      ) {
        continue
      }

      // Check if line looks like a name (2-4 words, proper case)
      const words = line.split(/\s+/)
      if (words.length >= 2 && words.length <= 4) {
        const isProperCase = words.every(
          (word) =>
            word.length > 0 && word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase(),
        )

        if (isProperCase) {
          return line
        }
      }
    }

    return "Unknown"
  }

  private extractEmail(text: string): string {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const matches = text.match(emailRegex)
    return matches ? matches[0] : ""
  }

  private extractPhone(text: string): string {
   const phoneRegex = /(\+\d{1,3}[\s-]?)?/(?\d{3}/)?[\s.-]?\d{3}[\s.-]?\d{4}/g
    const matches = text.match(phoneRegex)
    return matches ? matches[0] : ""
  }

  private extractSkills(text: string): string[] {
    const commonSkills = [
      // Programming Languages
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C#",
      "C++",
      "C",
      "PHP",
      "Ruby",
      "Go",
      "Rust",
      "Swift",
      "Kotlin",
      "Scala",
      "R",
      "MATLAB",
      "SQL",
      "HTML",
      "CSS",
      "Sass",
      "SCSS",
      "Less",

      // Frameworks & Libraries
      "React",
      "Next.js",
      "Vue.js",
      "Angular",
      "Svelte",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "FastAPI",
      "Spring",
      "Laravel",
      "Ruby on Rails",
      "ASP.NET",
      ".NET",
      "jQuery",
      "Bootstrap",
      "Tailwind CSS",
      "Material-UI",
      "Ant Design",
      "Chakra UI",

      // Databases
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "Oracle",
      "SQL Server",
      "Cassandra",
      "DynamoDB",
      "Elasticsearch",
      "Neo4j",

      // Cloud & DevOps
      "AWS",
      "Azure",
      "Google Cloud",
      "GCP",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Terraform",
      "Ansible",
      "Chef",
      "Puppet",
      "Vagrant",
      "CI/CD",
      "DevOps",

      // Tools & Technologies
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Jira",
      "Confluence",
      "Slack",
      "Trello",
      "Asana",
      "Figma",
      "Adobe XD",
      "Sketch",
      "InVision",
      "Photoshop",
      "Illustrator",

      // Data & Analytics
      "Machine Learning",
      "Deep Learning",
      "Data Science",
      "Data Analysis",
      "Big Data",
      "Apache Spark",
      "Hadoop",
      "Tableau",
      "Power BI",
      "TensorFlow",
      "PyTorch",
      "Pandas",
      "NumPy",
      "Scikit-learn",

      // Mobile Development
      "React Native",
      "Flutter",
      "iOS",
      "Android",
      "Xamarin",
      "Ionic",

      // Methodologies
      "Agile",
      "Scrum",
      "Kanban",
      "Waterfall",
      "TDD",
      "BDD",
      "Microservices",
      "REST API",
      "GraphQL",
      "API Development",
      "Web Services",
      "SOA",

      // Soft Skills
      "Leadership",
      "Team Management",
      "Project Management",
      "Communication",
      "Problem Solving",
      "Critical Thinking",
      "Analytical Skills",
      "Creativity",
      "Adaptability",
      "Time Management",
    ]

    const skills: string[] = []
    const lowerText = text.toLowerCase()

    // Look for skills section first
    const skillsSectionMatch = text.match(
      /(?:skills|technical skills|technologies|competencies|proficiencies)[\s\S]*?(?=\n\s*(?:experience|education|projects|certifications|awards|$))/i,
    )
    const textToSearch = skillsSectionMatch ? skillsSectionMatch[0] : text

    commonSkills.forEach((skill) => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
      if (regex.test(textToSearch)) {
        skills.push(skill)
      }
    })

    return [...new Set(skills)] // Remove duplicates
  }

  private extractExperience(
    text: string,
  ): Array<{ title: string; company: string; duration: string; description?: string }> {
    const experiences: Array<{ title: string; company: string; duration: string; description?: string }> = []

    // Look for experience section
    const experienceMatch = text.match(
      /(?:experience|work history|employment|work experience)[\s\S]*?(?=\n\s*(?:education|projects|certifications|skills|awards|$))/i,
    )
    if (!experienceMatch) return experiences

    const experienceText = experienceMatch[0]
    const lines = experienceText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    let currentJob: any = null
    let description: string[] = []

    for (let i = 1; i < lines.length; i++) {
      // Skip the "Experience" header
      const line = lines[i]

      // Check if this line looks like a job title/company line
      if (this.looksLikeJobTitle(line)) {
        // Save previous job if exists
        if (currentJob) {
          experiences.push({
            ...currentJob,
            description: description.join(" ").substring(0, 200), // Limit description length
          })
        }

        // Parse new job
        currentJob = this.parseJobLine(line)
        description = []
      } else if (currentJob && line.length > 20 && !this.looksLikeDate(line)) {
        // This might be a job description
        description.push(line)
      }
    }

    // Don't forget the last job
    if (currentJob) {
      experiences.push({
        ...currentJob,
        description: description.join(" ").substring(0, 200),
      })
    }

    return experiences
  }

  private looksLikeJobTitle(line: string): boolean {
    // Check if line contains common job title patterns
    const jobTitlePatterns = [
      /\b(developer|engineer|manager|analyst|designer|coordinator|specialist|director|lead|senior|junior)\b/i,
      /\bat\s+\w+/i, // "at Company"
      /\|\s*\w+/, // "Title | Company"
      /-\s*\w+/, // "Title - Company"
    ]

    return jobTitlePatterns.some((pattern) => pattern.test(line)) && line.length < 100
  }

  private parseJobLine(line: string): { title: string; company: string; duration: string } {
    // Try different patterns to extract job info

    // Pattern 1: "Title at Company (Date - Date)"
    let match = line.match(/(.+?)\s+at\s+(.+?)(?:\s*$$(.+?)$$)?$/)
    if (match) {
      return {
        title: match[1].trim(),
        company: match[2].replace(/\s*$$.+?$$$/, "").trim(),
        duration: match[3] || "",
      }
    }

    // Pattern 2: "Title | Company | Date"
    match = line.match(/(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/)
    if (match) {
      return {
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
      }
    }

    // Pattern 3: "Title - Company - Date"
    match = line.match(/(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/)
    if (match) {
      return {
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
      }
    }

    // Fallback: treat the whole line as title
    return {
      title: line,
      company: "",
      duration: "",
    }
  }

  private looksLikeDate(line: string): boolean {
    const datePatterns = [
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      /\b(20\d{2}|19\d{2})\b/,
      /\b(present|current)\b/i,
    ]

    return datePatterns.some((pattern) => pattern.test(line))
  }

  private extractEducation(text: string): string[] {
    const education: string[] = []

    const educationMatch = text.match(
      /(?:education|academic background|qualifications)[\s\S]*?(?=\n\s*(?:experience|projects|certifications|skills|awards|$))/i,
    )
    if (!educationMatch) return education

    const educationText = educationMatch[0]
    const lines = educationText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    for (let i = 1; i < lines.length; i++) {
      // Skip the "Education" header
      const line = lines[i]

      if (
        line.match(
          /bachelor|master|phd|doctorate|bs|ba|ms|ma|mba|bsc|msc|b\.s\.|m\.s\.|b\.a\.|m\.a\.|degree|diploma|university|college|school|institute|academy/i,
        )
      ) {
        education.push(line)
      }
    }

    return education
  }

  private extractJobTitles(text: string): string[] {
    const commonTitles = [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Web Developer",
      "Mobile Developer",
      "iOS Developer",
      "Android Developer",
      "DevOps Engineer",
      "Site Reliability Engineer",
      "Data Scientist",
      "Data Engineer",
      "Machine Learning Engineer",
      "AI Engineer",
      "Product Manager",
      "Project Manager",
      "UX Designer",
      "UI Designer",
      "UI/UX Designer",
      "Graphic Designer",
      "QA Engineer",
      "Quality Assurance Engineer",
      "Test Engineer",
      "Automation Engineer",
      "Systems Administrator",
      "Network Engineer",
      "Security Engineer",
      "Database Administrator",
      "Cloud Engineer",
      "Solutions Architect",
      "Technical Lead",
      "Engineering Manager",
      "Senior Developer",
      "Junior Developer",
      "Lead Developer",
      "Principal Engineer",
    ]

    const titles: string[] = []

    // First check experience section
    const experiences = this.extractExperience(text)
    experiences.forEach((exp) => {
      if (exp.title) titles.push(exp.title)
    })

    // Then check for common titles in the text
    commonTitles.forEach((title) => {
      const regex = new RegExp(`\\b${title}\\b`, "i")
      if (regex.test(text) && !titles.some((t) => t.toLowerCase() === title.toLowerCase())) {
        titles.push(title)
      }
    })

    return [...new Set(titles)]
  }

  private extractSummary(text: string): string {
    const summaryMatch = text.match(
      /(?:summary|profile|objective|about me|professional summary)[\s\S]*?(?=\n\s*(?:experience|education|skills|projects|certifications|$))/i,
    )
    if (!summaryMatch) return ""

    const summaryText = summaryMatch[0]
    const lines = summaryText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length <= 1) return ""

    return lines.slice(1).join(" ").substring(0, 500) // Skip header, limit to 500 chars
  }

  private calculateYearsOfExperience(text: string): number {
    // Look for explicit mentions
    const experienceMatch = text.match(/(\d+)(?:\+)?\s*(?:years|yrs)(?:\s+of)?\s+experience/i)
    if (experienceMatch) {
      return Number.parseInt(experienceMatch[1], 10)
    }

    // Try to calculate from job history
    const experiences = this.extractExperience(text)
    if (experiences.length === 0) return 0

    let totalMonths = 0
    const currentYear = new Date().getFullYear()

    experiences.forEach((exp) => {
      const duration = exp.duration.toLowerCase()
      const dateRangeMatch = duration.match(/(\d{4})\s*(?:-|to|–)\s*(?:(\d{4})|present|current)/i)

      if (dateRangeMatch) {
        const startYear = Number.parseInt(dateRangeMatch[1], 10)
        const endYear = dateRangeMatch[2] ? Number.parseInt(dateRangeMatch[2], 10) : currentYear

        const months = (endYear - startYear) * 12
        totalMonths += Math.max(0, months)
      }
    })

    return Math.round(totalMonths / 12)
  }

  private extractCertifications(text: string): string[] {
    const certifications: string[] = []

    const certMatch = text.match(
      /(?:certifications|certificates|credentials|qualifications)[\s\S]*?(?=\n\s*(?:experience|education|skills|projects|awards|$))/i,
    )
    if (!certMatch) return certifications

    const certText = certMatch[0]
    const lines = certText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const line = lines[i]

      if (
        line.match(
          /certified|certification|certificate|aws|azure|google|microsoft|oracle|cisco|comptia|pmp|scrum|agile|itil/i,
        ) &&
        !line.match(/^certification|^certificates/i)
      ) {
        const cleanLine = line.replace(/^[-•*]\s*/, "").trim()
        if (cleanLine.length > 0) {
          certifications.push(cleanLine)
        }
      }
    }

    return certifications
  }

  private extractProjects(text: string): string[] {
    const projects: string[] = []

    const projectMatch = text.match(
      /(?:projects|portfolio|applications|software projects)[\s\S]*?(?=\n\s*(?:experience|education|skills|certifications|awards|$))/i,
    )
    if (!projectMatch) return projects

    const projectText = projectMatch[0]
    const lines = projectText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    for (let i = 1; i < lines.length; i++) {
      // Skip header
      const line = lines[i]

      if ((line.includes(":") || line.match(/^[-•*]\s*/)) && !line.match(/^projects|^portfolio/i)) {
        const cleanLine = line.replace(/^[-•*]\s*/, "").trim()
        if (cleanLine.length > 0) {
          projects.push(cleanLine)
        }
      }
    }

    return projects
  }

  private extractLanguages(text: string): string[] {
    const languages: string[] = []
    const commonLanguages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Russian",
      "Chinese",
      "Japanese",
      "Korean",
      "Arabic",
      "Hindi",
      "Dutch",
      "Swedish",
      "Norwegian",
      "Danish",
      "Finnish",
      "Polish",
    ]

    const languageMatch = text.match(
      /(?:languages|language skills)[\s\S]*?(?=\n\s*(?:experience|education|skills|projects|certifications|awards|$))/i,
    )
    const textToSearch = languageMatch ? languageMatch[0] : text

    commonLanguages.forEach((language) => {
      const regex = new RegExp(`\\b${language}\\b`, "i")
      if (regex.test(textToSearch)) {
        languages.push(language)
      }
    })

    return [...new Set(languages)]
  }

  private extractLocation(text: string): string {
    // Look for location patterns
    const locationPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/, // City, State
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z][a-z]+)\b/, // City, Country
    ]

    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) {
        return match[0]
      }
    }

    return ""
  }

  private validateAndCleanData(data: ResumeData): ResumeData {
    return {
      ...data,
      name: data.name || "Unknown",
      email: data.email || "",
      phone: data.phone || "",
      skills: data.skills.slice(0, 20), // Limit to top 20 skills
      experience: data.experience.slice(0, 10), // Limit to 10 experiences
      education: data.education.slice(0, 5), // Limit to 5 education entries
      jobTitles: data.jobTitles.slice(0, 5), // Limit to 5 job titles
      summary: data.summary.substring(0, 1000), // Limit summary length
      yearsOfExperience: Math.max(0, Math.min(50, data.yearsOfExperience)), // Reasonable bounds
      certifications: data.certifications.slice(0, 10),
      projects: data.projects.slice(0, 10),
      languages: data.languages.slice(0, 10),
      location: data.location || "",
    }
  }
}
