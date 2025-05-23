// Mock job data generator for testing without external APIs
export interface JobListing {
  id: string
  title: string
  company: string
  location: string
  locationType: "Remote" | "Hybrid" | "On-site"
  salary: string
  salaryMin: number
  salaryMax: number
  description: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  source: string
  matchScore?: number
  keywordMatches?: string[]
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship"
  experience: "Entry-level" | "Mid-level" | "Senior"
  industry: string
  datePosted: string
  applicationUrl: string
  companySize: string
  benefits: string[]
  logo: string
  posted: string
}

export class MockJobService {
  private jobTemplates: Partial<JobListing>[] = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      locationType: "Remote",
      salary: "$120,000 - $150,000",
      salaryMin: 120000,
      salaryMax: 150000,
      description:
        "We're looking for a Senior Frontend Developer with experience in React, Next.js, and TypeScript to join our growing team.",
      requirements: [
        "5+ years of experience with JavaScript and React",
        "Experience with Next.js and TypeScript",
        "Strong understanding of web standards and best practices",
        "Experience with state management libraries (Redux, Zustand, etc.)",
        "Knowledge of CSS preprocessors and modern CSS techniques",
      ],
      responsibilities: [
        "Develop and maintain responsive web applications using React and Next.js",
        "Write clean, maintainable, and efficient code",
        "Collaborate with designers to implement UI/UX designs",
        "Work with backend developers to integrate APIs",
        "Participate in code reviews and technical discussions",
      ],
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "GraphQL"],
      source: "LinkedIn",
      jobType: "Full-time",
      experience: "Senior",
      industry: "Technology",
      companySize: "201-500 employees",
      benefits: ["Health insurance", "401(k) matching", "Remote work", "Unlimited PTO"],
    },
    {
      title: "Full Stack Developer",
      company: "InnovateSoft",
      location: "New York, NY",
      locationType: "Hybrid",
      salary: "$110,000 - $140,000",
      salaryMin: 110000,
      salaryMax: 140000,
      description:
        "Join our team as a Full Stack Developer working on cutting-edge web applications using modern technologies.",
      requirements: [
        "3+ years of experience in full stack development",
        "Proficiency in JavaScript, React, and Node.js",
        "Experience with MongoDB or other NoSQL databases",
        "Understanding of RESTful API design",
        "Knowledge of Git and CI/CD pipelines",
      ],
      responsibilities: [
        "Design and develop web applications using JavaScript frameworks",
        "Build and maintain RESTful APIs",
        "Implement database schemas and queries",
        "Collaborate with product managers and designers",
        "Mentor junior developers",
      ],
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "REST API"],
      source: "Indeed",
      jobType: "Full-time",
      experience: "Mid-level",
      industry: "Technology",
      companySize: "51-200 employees",
      benefits: ["Health insurance", "Stock options", "Flexible hours", "Professional development"],
    },
    {
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "Austin, TX",
      locationType: "Remote",
      salary: "$90,000 - $120,000",
      salaryMin: 90000,
      salaryMax: 120000,
      description:
        "We're seeking a talented UI/UX Designer to create beautiful, intuitive interfaces for our products.",
      requirements: [
        "3+ years of experience in UI/UX design",
        "Proficiency in design tools like Figma or Adobe XD",
        "Portfolio demonstrating strong visual design skills",
        "Experience with user research and testing",
        "Understanding of accessibility standards",
      ],
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity designs",
        "Conduct user research and usability testing",
        "Develop user personas and journey maps",
        "Collaborate with developers to implement designs",
        "Maintain and evolve our design system",
      ],
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing", "Design Systems"],
      source: "ZipRecruiter",
      jobType: "Contract",
      experience: "Mid-level",
      industry: "Design",
      companySize: "11-50 employees",
      benefits: ["Remote work", "Flexible hours", "Creative environment", "Design conferences"],
    },
    {
      title: "Backend Engineer",
      company: "DataSystems",
      location: "Seattle, WA",
      locationType: "On-site",
      salary: "$130,000 - $160,000",
      salaryMin: 130000,
      salaryMax: 160000,
      description:
        "Looking for an experienced Backend Engineer to develop and maintain our cloud infrastructure and services.",
      requirements: [
        "5+ years of experience in backend development",
        "Proficiency in Python and related frameworks",
        "Experience with AWS services (Lambda, EC2, S3, etc.)",
        "Knowledge of containerization technologies (Docker, Kubernetes)",
        "Understanding of database design and optimization",
      ],
      responsibilities: [
        "Design and implement backend services and APIs",
        "Optimize database performance and queries",
        "Develop and maintain cloud infrastructure using AWS",
        "Implement security best practices",
        "Collaborate with frontend developers to integrate services",
      ],
      skills: ["Python", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Microservices"],
      source: "Company Website",
      jobType: "Full-time",
      experience: "Senior",
      industry: "Technology",
      companySize: "501-1000 employees",
      benefits: ["Health insurance", "401(k) matching", "Gym membership", "Commuter benefits"],
    },
    {
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Boston, MA",
      locationType: "Remote",
      salary: "$125,000 - $155,000",
      salaryMin: 125000,
      salaryMax: 155000,
      description: "Join our data science team to build machine learning models and analyze complex datasets.",
      requirements: [
        "3+ years of experience in data science or related field",
        "Proficiency in Python and data science libraries",
        "Experience with machine learning algorithms",
        "Strong statistical knowledge",
        "Experience with SQL and data visualization tools",
      ],
      responsibilities: [
        "Develop machine learning models for predictive analytics",
        "Clean and preprocess large datasets",
        "Perform exploratory data analysis",
        "Collaborate with engineers to deploy models to production",
        "Communicate findings to stakeholders",
      ],
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics", "TensorFlow"],
      source: "ZipRecruiter",
      jobType: "Full-time",
      experience: "Mid-level",
      industry: "Data Science",
      companySize: "201-500 employees",
      benefits: ["Health insurance", "Remote work", "Continuing education", "Conference budget"],
    },
  ]

  generateJobsForSkills(skills: string[], count = 20): JobListing[] {
    const jobs: JobListing[] = []

    for (let i = 0; i < count; i++) {
      const template = this.jobTemplates[i % this.jobTemplates.length]
      const job = this.createJobFromTemplate(template, skills, i)
      jobs.push(job)
    }

    return jobs
  }

  private createJobFromTemplate(template: Partial<JobListing>, userSkills: string[], index: number): JobListing {
    const id = `mock-job-${index + 1}`
    const postedDaysAgo = Math.floor(Math.random() * 14) + 1

    // Calculate match score based on skill overlap
    const jobSkills = template.skills || []
    const matchingSkills = jobSkills.filter((skill) =>
      userSkills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase()),
    )
    const matchScore = Math.min(
      95,
      Math.max(60, Math.round((matchingSkills.length / Math.max(jobSkills.length, 1)) * 100) + Math.random() * 20 - 10),
    )

    return {
      id,
      title: template.title || "Software Developer",
      company: template.company || "Tech Company",
      location: template.location || "Remote",
      locationType: template.locationType || "Remote",
      salary: template.salary || "$80,000 - $120,000",
      salaryMin: template.salaryMin || 80000,
      salaryMax: template.salaryMax || 120000,
      description: template.description || "Great opportunity to work with modern technologies.",
      requirements: template.requirements || ["Experience with modern web technologies"],
      responsibilities: template.responsibilities || ["Develop and maintain applications"],
      skills: template.skills || ["JavaScript", "React"],
      source: template.source || "Mock Source",
      matchScore,
      keywordMatches: matchingSkills,
      jobType: template.jobType || "Full-time",
      experience: template.experience || "Mid-level",
      industry: template.industry || "Technology",
      datePosted: new Date(Date.now() - postedDaysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      applicationUrl: `https://example.com/apply/${id}`,
      companySize: template.companySize || "51-200 employees",
      benefits: template.benefits || ["Health insurance", "Flexible hours"],
      logo: "/placeholder.svg?height=80&width=80",
      posted: `${postedDaysAgo} day${postedDaysAgo === 1 ? "" : "s"} ago`,
    }
  }

  searchJobs(params: {
    keywords?: string[]
    location?: string
    jobType?: string
    experience?: string
    industry?: string
    salaryMin?: number
    salaryMax?: number
  }): JobListing[] {
    // Generate base jobs
    let jobs = this.generateJobsForSkills(params.keywords || [], 50)

    // Apply filters
    if (params.location && params.location !== "All Locations") {
      jobs = jobs.filter((job) => job.location.includes(params.location!))
    }

    if (params.jobType) {
      jobs = jobs.filter((job) => job.jobType === params.jobType)
    }

    if (params.experience) {
      jobs = jobs.filter((job) => job.experience === params.experience)
    }

    if (params.industry) {
      jobs = jobs.filter((job) => job.industry === params.industry)
    }

    if (params.salaryMin) {
      jobs = jobs.filter((job) => job.salaryMax >= params.salaryMin!)
    }

    if (params.salaryMax) {
      jobs = jobs.filter((job) => job.salaryMin <= params.salaryMax!)
    }

    // Sort by match score
    return jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }
}
