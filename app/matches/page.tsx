"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  Info,
  MapPin,
  Search,
  X,
  Star,
  CheckCircle,
  Zap,
  TrendingUp,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMobile } from "@/hooks/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import type { JobListing } from "@/lib/mock-job-data"
import type { ResumeData } from "@/types/resume"

// Location options for the filter
const LOCATIONS = [
  "All Locations",
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Chicago, IL",
  "Miami, FL",
  "Boston, MA",
  "Denver, CO",
]

// Job type options
const JOB_TYPES = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
]

// Work location type options
const LOCATION_TYPES = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "on-site", label: "On-site" },
]

// Experience level options
const EXPERIENCE_LEVELS = [
  { id: "entry-level", label: "Entry-level" },
  { id: "mid-level", label: "Mid-level" },
  { id: "senior", label: "Senior" },
]

// Industry options
const INDUSTRIES = [
  { id: "technology", label: "Technology" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "product", label: "Product" },
  { id: "data-science", label: "Data Science" },
]

export default function MatchesPage() {
  const isMobile = useMobile()
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(!isMobile)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [showMatchDetails, setShowMatchDetails] = useState(false)
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 200000])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedResumeData = localStorage.getItem("resumeData")
      const storedJobMatches = localStorage.getItem("jobMatches")

      if (storedResumeData) {
        setResumeData(JSON.parse(storedResumeData))
      }

      if (storedJobMatches) {
        setJobs(JSON.parse(storedJobMatches))
      }

      setLoading(false)
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      setLoading(false)
    }
  }, [])

  // Toggle job save
  const toggleSaveJob = async (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((jobId) => jobId !== id))
    } else {
      setSavedJobs([...savedJobs, id])
    }
    // In a real implementation, we would call the server action
    // await saveJob(id)
  }

  // Toggle checkbox selection
  const toggleSelection = (id: string, currentSelection: string[], setSelection: (value: string[]) => void) => {
    if (currentSelection.includes(id)) {
      setSelection(currentSelection.filter((item) => item !== id))
    } else {
      setSelection([...currentSelection, id])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedLocation("All Locations")
    setSelectedJobTypes([])
    setSelectedLocationTypes([])
    setSelectedExperienceLevels([])
    setSelectedIndustries([])
    setSalaryRange([50000, 200000])
  }

  // Apply filters to jobs
  const filteredJobs = jobs.filter((job) => {
    // Text search filter
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    // Location filter
    const matchesLocation = selectedLocation === "All Locations" || job.location === selectedLocation

    // Job type filter
    const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType)

    // Location type filter
    const matchesLocationType = selectedLocationTypes.length === 0 || selectedLocationTypes.includes(job.locationType)

    // Experience level filter
    const matchesExperience = selectedExperienceLevels.length === 0 || selectedExperienceLevels.includes(job.experience)

    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(job.industry)

    // Salary range filter
    const matchesSalary = job.salaryMin <= salaryRange[1] && job.salaryMax >= salaryRange[0]

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesLocationType &&
      matchesExperience &&
      matchesIndustry &&
      matchesSalary
    )
  })

  // Count active filters
  useEffect(() => {
    let count = 0
    if (selectedLocation !== "All Locations") count++
    if (selectedJobTypes.length > 0) count++
    if (selectedLocationTypes.length > 0) count++
    if (selectedExperienceLevels.length > 0) count++
    if (selectedIndustries.length > 0) count++
    if (salaryRange[0] > 50000 || salaryRange[1] < 200000) count++
    setActiveFiltersCount(count)
  }, [
    selectedLocation,
    selectedJobTypes,
    selectedLocationTypes,
    selectedExperienceLevels,
    selectedIndustries,
    salaryRange,
  ])

  // Handle apply to job
  const handleApply = async (jobId: string) => {
    // In a real implementation, we would call the server action
    // await applyToJob(jobId)
    const job = jobs.find((job) => job.id === jobId)
    if (job?.applicationUrl) {
      window.open(job.applicationUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading your job matches...</p>
        </div>
      </div>
    )
  }

  if (!resumeData || jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Resume Data Found</h2>
          <p className="text-gray-600 mb-4">
            It looks like you haven't uploaded a resume yet. Please upload your resume to see job matches.
          </p>
          <Link href="/upload">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
              Upload Resume
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-purple-600 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Your Job Matches
            </h1>
            <p className="text-gray-600">
              Based on your resume, we found {jobs.length} job opportunities for {resumeData.name}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search jobs or skills..."
                className="w-full md:w-[300px] pl-9 border-purple-100 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-purple-200 text-purple-700 hover:bg-purple-50 relative"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-[10px] font-medium text-white">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="md:w-1/4 lg:w-1/5">
              <div className="sticky top-4 rounded-lg border border-purple-100 bg-white p-4 shadow-lg shadow-purple-100/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-purple-700 flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      Reset
                    </Button>
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowFilters(false)}
                        aria-label="Close filters"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Location filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-full border-purple-100 focus:ring focus:ring-purple-200 focus:ring-opacity-50">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work location type filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Work Type</h3>
                    <div className="space-y-2">
                      {LOCATION_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-type-${type.id}`}
                            checked={selectedLocationTypes.includes(type.label)}
                            onCheckedChange={() =>
                              toggleSelection(type.label, selectedLocationTypes, setSelectedLocationTypes)
                            }
                            className="border-purple-200 text-purple-600 focus:ring-purple-200"
                          />
                          <label
                            htmlFor={`location-type-${type.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Job type filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
                    <div className="space-y-2">
                      {JOB_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`job-type-${type.id}`}
                            checked={selectedJobTypes.includes(type.label)}
                            onCheckedChange={() => toggleSelection(type.label, selectedJobTypes, setSelectedJobTypes)}
                            className="border-purple-200 text-purple-600 focus:ring-purple-200"
                          />
                          <label
                            htmlFor={`job-type-${type.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary range filter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Salary Range</h3>
                      <span className="text-xs text-gray-500">
                        ${(salaryRange[0] / 1000).toFixed(0)}k - ${(salaryRange[1] / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50000, 200000]}
                      min={50000}
                      max={200000}
                      step={5000}
                      value={salaryRange}
                      onValueChange={(value) => setSalaryRange(value as [number, number])}
                      className="py-4"
                    />
                  </div>

                  {/* Experience level filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h3>
                    <div className="space-y-2">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <div key={level.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`experience-${level.id}`}
                            checked={selectedExperienceLevels.includes(level.label)}
                            onCheckedChange={() =>
                              toggleSelection(level.label, selectedExperienceLevels, setSelectedExperienceLevels)
                            }
                            className="border-purple-200 text-purple-600 focus:ring-purple-200"
                          />
                          <label
                            htmlFor={`experience-${level.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {level.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industry filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Industry</h3>
                    <div className="space-y-2">
                      {INDUSTRIES.map((industry) => (
                        <div key={industry.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`industry-${industry.id}`}
                            checked={selectedIndustries.includes(industry.label)}
                            onCheckedChange={() =>
                              toggleSelection(industry.label, selectedIndustries, setSelectedIndustries)
                            }
                            className="border-purple-200 text-purple-600 focus:ring-purple-200"
                          />
                          <label
                            htmlFor={`industry-${industry.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {industry.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job listings */}
          <div className={`${showFilters ? "md:w-3/4 lg:w-4/5" : "w-full"}`}>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-white border border-purple-100 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md"
                >
                  All Matches ({filteredJobs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md"
                >
                  Saved Jobs ({savedJobs.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {!showFilters && activeFiltersCount > 0 && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters: {activeFiltersCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Reset All
                    </Button>
                  </div>
                )}
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.includes(job.id)}
                      onToggleSave={() => toggleSaveJob(job.id)}
                      onViewDetails={() => {
                        setSelectedJob(job)
                        setShowMatchDetails(true)
                      }}
                      onApply={() => handleApply(job.id)}
                    />
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-purple-100 shadow-sm">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                        <Search className="h-8 w-8 text-purple-300" />
                      </div>
                      <p className="text-gray-600 mb-4">No jobs found matching your search criteria.</p>
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="space-y-6">
                  {filteredJobs
                    .filter((job) => savedJobs.includes(job.id))
                    .map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={true}
                        onToggleSave={() => toggleSaveJob(job.id)}
                        onViewDetails={() => {
                          setSelectedJob(job)
                          setShowMatchDetails(true)
                        }}
                        onApply={() => handleApply(job.id)}
                      />
                    ))}
                  {savedJobs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-purple-100 shadow-sm">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                        <Bookmark className="h-8 w-8 text-purple-300" />
                      </div>
                      <p className="text-gray-600">You haven't saved any jobs yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Match Details Dialog */}
        <Dialog open={showMatchDetails} onOpenChange={setShowMatchDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-purple-100 p-0">
            {selectedJob && (
              <>
                <div className="sticky top-0 z-10 bg-white border-b border-purple-100 p-6 rounded-t-lg">
                  <DialogHeader>
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedJob.logo || "/placeholder.svg"}
                        alt={selectedJob.company}
                        className="w-16 h-16 rounded-lg border border-purple-100 object-cover"
                      />
                      <div>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                          {selectedJob.title}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-1 mt-1 text-gray-600">
                          <Building className="h-3.5 w-3.5" />
                          {selectedJob.company} • {selectedJob.location} ({selectedJob.locationType})
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                <div className="space-y-6 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                        {selectedJob.salary} • {selectedJob.jobType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-purple-500" />
                        Posted {selectedJob.posted}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-100 w-fit"
                    >
                      {selectedJob.matchScore}% Match
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Match Details
                    </h3>
                    <Card className="border-purple-100 shadow-sm">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">Overall Match</span>
                              <span className="text-sm text-purple-700 font-medium">{selectedJob.matchScore}%</span>
                            </div>
                            <Progress
                              value={selectedJob.matchScore}
                              className="h-2 bg-purple-100"
                              indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-500"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Keyword Matches</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.keywordMatches?.map((keyword) => (
                                <Badge
                                  key={keyword}
                                  variant="secondary"
                                  className="bg-green-50 text-green-700 border border-green-100"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Match</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className={
                                    selectedJob.keywordMatches?.includes(skill)
                                      ? "bg-green-50 text-green-700 border border-green-100"
                                      : "bg-gray-50 text-gray-700 border border-gray-100"
                                  }
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-purple-100">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Responsibilities
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 bg-white p-4 rounded-lg border border-purple-100">
                      {selectedJob.responsibilities.map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 bg-white p-4 rounded-lg border border-purple-100">
                      {selectedJob.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Benefits
                    </h3>
                    <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg border border-purple-100">
                      {selectedJob.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" className="border-purple-100 text-purple-700">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      Company Information
                    </h3>
                    <div className="text-sm space-y-2 text-gray-600 bg-white p-4 rounded-lg border border-purple-100">
                      <p>Company Size: {selectedJob.companySize}</p>
                      <p>Industry: {selectedJob.industry}</p>
                      <p>
                        Source:{" "}
                        <Badge variant="outline" className="border-purple-100 text-purple-700">
                          {selectedJob.source}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 z-10 bg-white border-t border-purple-100 p-6 rounded-b-lg flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    {savedJobs.includes(selectedJob.id) ? (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save Job
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleApply(selectedJob.id)}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/20"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

interface JobCardProps {
  job: JobListing
  isSaved: boolean
  onToggleSave: () => void
  onViewDetails: () => void
  onApply: () => void
}

function JobCard({ job, isSaved, onToggleSave, onViewDetails, onApply }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-purple-100 shadow-lg shadow-purple-100/10 hover:shadow-xl hover:shadow-purple-100/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={job.company}
              className="w-12 h-12 rounded-lg border border-purple-100 object-cover"
            />
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                {job.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building className="h-3.5 w-3.5" />
                {job.company}
              </CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={onViewDetails}
                  >
                    {job.matchScore}% Match <Info className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-purple-100">
                <p>Click to view match details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-purple-500" />
              {job.location} ({job.locationType})
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-purple-500" />
              {job.salary} • {job.jobType}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-purple-500" />
              Posted {job.posted}
            </div>
          </div>
          <p className={`text-sm text-gray-600 ${!expanded && "line-clamp-2"}`}>{job.description}</p>
          {job.description.length > 150 && (
            <Button variant="ghost" size="sm" className="w-fit p-0 h-auto" onClick={() => setExpanded(!expanded)}>
              {expanded ? (
                <span className="flex items-center text-xs text-purple-600 hover:text-purple-700">
                  Show less <ChevronUp className="h-3 w-3 ml-1" />
                </span>
              ) : (
                <span className="flex items-center text-xs text-purple-600 hover:text-purple-700">
                  Show more <ChevronDown className="h-3 w-3 ml-1" />
                </span>
              )}
            </Button>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className={
                    job.keywordMatches?.includes(skill)
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-gray-50 text-gray-700 border border-gray-100"
                  }
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Source:</span>
            <Badge variant="outline" className="border-purple-100 text-purple-700">
              {job.source}
            </Badge>
          </div>
        </div>
      </CardContent>
      <Separator className="bg-purple-100" />
      <CardFooter className="pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={onToggleSave}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
        <Button
          size="sm"
          className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/20"
          onClick={onApply}
        >
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
