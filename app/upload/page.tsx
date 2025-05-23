"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  FileUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Briefcase,
  Rocket,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiKeyForm } from "@/components/api-key-form"
import { Switch } from "@/components/ui/switch"
import type { ResumeData } from "@/types/resume"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [originalText, setOriginalText] = useState<string>("")
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [openAIKey, setOpenAIKey] = useState<string | null>(null)
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [useAI, setUseAI] = useState(false)

  // Load OpenAI API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("openai-api-key")
    if (storedKey) {
      setOpenAIKey(storedKey)
      setUseAI(true)
    }
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    // If AI is enabled but no API key, show the form
    if (useAI && !openAIKey) {
      setShowApiKeyForm(true)
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError(null)
    setProcessingStep(useAI ? "Analyzing resume with AI..." : "Uploading and parsing document...")

    // Clear any existing interval
    clearProgressInterval()

    // Start progress animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearProgressInterval()
          return 90
        }
        return prev + 5
      })
    }, 300)

    try {
      // Parse the resume
      const formData = new FormData()
      formData.append("file", file)

      // Choose the appropriate endpoint based on whether AI is enabled
      const endpoint = useAI ? "/api/parse-resume-ai" : "/api/parse-resume"

      // Set up headers for the request
      const headers: HeadersInit = {}
      if (useAI && openAIKey) {
        headers["x-openai-key"] = openAIKey
      }

      // Make the request
      let parseResponse = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers,
      })

      // If main parser fails, try the fallback parser
      if (!parseResponse.ok) {
        console.log("Main parser failed, trying fallback parser...")
        parseResponse = await fetch("/api/fallback-parse", {
          method: "POST",
          body: formData,
        })
      }

      // Handle non-JSON responses
      const contentType = parseResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await parseResponse.text()
        throw new Error(`Server returned non-JSON response: ${errorText.substring(0, 100)}...`)
      }

      const parseResult = await parseResponse.json()

      if (!parseResponse.ok) {
        throw new Error(parseResult.error || `Server error: ${parseResponse.status}`)
      }

      if (parseResult.error) {
        throw new Error(parseResult.error)
      }

      setResumeData(parseResult.resumeData)
      setOriginalText(parseResult.originalText || "")

      // Update progress
      setProgress(100)
      setProcessingStep("Analysis complete!")

      setTimeout(() => {
        setIsProcessing(false)
        setShowPreview(true)
      }, 1000)
    } catch (err) {
      console.error("Error processing resume:", err)
      setError(err instanceof Error ? err.message : "Failed to process resume")
      setIsProcessing(false)
      setProgress(0)
      clearProgressInterval()
    }
  }

  const proceedToMatches = async () => {
    if (!resumeData) return

    try {
      setIsProcessing(true)
      setProcessingStep(useAI ? "Finding AI-powered job matches..." : "Finding job matches...")

      // Choose the appropriate endpoint based on whether AI is enabled
      const endpoint = useAI ? "/api/match-jobs-ai" : "/api/match-jobs"

      // Set up headers for the request
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (useAI && openAIKey) {
        headers["x-openai-key"] = openAIKey
      }

      // Find job matches
      const matchResponse = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ resumeData }),
      })

      if (!matchResponse.ok) {
        const errorData = await matchResponse.json().catch(() => ({ error: "Failed to parse response" }))
        throw new Error(errorData.error || "Failed to find job matches")
      }

      const matchResult = await matchResponse.json()

      // Store data in localStorage for the matches page
      localStorage.setItem("resumeData", JSON.stringify(resumeData))
      localStorage.setItem("jobMatches", JSON.stringify(matchResult.matches))

      router.push("/matches")
    } catch (err) {
      console.error("Error finding matches:", err)
      setError(err instanceof Error ? err.message : "Failed to find job matches")
      setIsProcessing(false)
    }
  }

  const handleSaveApiKey = (apiKey: string) => {
    setOpenAIKey(apiKey)
    setShowApiKeyForm(false)
    setUseAI(true)
    // Now proceed with the submission
    handleSubmit(new Event("submit") as any)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="container max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {showApiKeyForm ? (
          <ApiKeyForm onSave={handleSaveApiKey} onCancel={() => setShowApiKeyForm(false)} />
        ) : (
          <Card className="border-purple-100 shadow-xl shadow-purple-100/20">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg border-b border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-2">
                  <FileUp className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Upload Your Resume
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Upload your resume to find job matches. We support PDF, Word documents, and text files.
              </CardDescription>

              <div className="flex items-center space-x-2 mt-4 bg-white p-3 rounded-lg border border-purple-100">
                <Switch
                  id="use-ai"
                  checked={useAI}
                  onCheckedChange={setUseAI}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="flex flex-col">
                  <Label htmlFor="use-ai" className="text-sm font-medium cursor-pointer">
                    Use AI-powered analysis
                  </Label>
                  <p className="text-xs text-gray-500">
                    {openAIKey
                      ? "Using your OpenAI API key for enhanced resume analysis"
                      : "Requires an OpenAI API key for better results"}
                  </p>
                </div>
                {!openAIKey && useAI && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKeyForm(true)}
                    className="ml-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Add API Key
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
              )}

              {!showPreview ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {!isProcessing ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center ${
                          dragActive
                            ? "border-purple-400 bg-purple-50"
                            : "border-purple-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-200">
                            <FileUp className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-lg">Drag and drop your resume here</p>
                            <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, and TXT files (max 10MB)</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="resume-upload"
                              className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                            >
                              Select a file
                            </Label>
                            <Input
                              id="resume-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={handleChange}
                            />
                            <span className="text-sm text-gray-500">or drag and drop</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="space-y-4 text-center mb-6">
                          <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse opacity-50 blur-md"></div>
                            <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
                              <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                            </div>
                          </div>
                          <h3 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            {processingStep}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {showPreview
                              ? "Finding the best job matches for you..."
                              : "Analyzing your resume content..."}
                          </p>
                        </div>
                        <Progress
                          value={progress}
                          className="h-3 w-full bg-purple-100"
                          indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-500"
                        />
                        <div className="text-center mt-2">
                          <span className="text-sm text-gray-500">{progress}% complete</span>
                        </div>
                      </div>
                    )}

                    {file && !isProcessing && !showPreview && (
                      <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFile(null)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                // Resume Preview
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertDescription className="text-green-700 font-medium">
                      Resume successfully analyzed! Here's what we extracted from your document:
                    </AlertDescription>
                  </Alert>

                  {resumeData && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 flex items-center justify-center text-2xl font-bold text-purple-700">
                            {resumeData.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                              {resumeData.name}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                              {resumeData.email && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-purple-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                  </svg>
                                  {resumeData.email}
                                </span>
                              )}
                              {resumeData.phone && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-purple-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                  </svg>
                                  {resumeData.phone}
                                </span>
                              )}
                              {resumeData.yearsOfExperience > 0 && (
                                <span className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4 text-purple-500" />
                                  {resumeData.yearsOfExperience} years experience
                                </span>
                              )}
                              {resumeData.location && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-purple-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {resumeData.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {resumeData.summary && (
                          <div className="mt-4">
                            <h4 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                              <Sparkles className="h-4 w-4" />
                              Professional Summary
                            </h4>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-purple-100">
                              {resumeData.summary}
                            </p>
                          </div>
                        )}
                      </div>

                      {resumeData.skills.length > 0 && (
                        <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                          <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                            <Rocket className="h-4 w-4" />
                            Skills ({resumeData.skills.length} found)
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resumeData.jobTitles.length > 0 && (
                          <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                            <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              Job Titles
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.jobTitles.map((title) => (
                                <Badge key={title} variant="outline" className="border-purple-200 text-purple-700">
                                  {title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {resumeData.experience.length > 0 && (
                          <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                            <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              Work Experience
                            </h4>
                            <div className="space-y-3">
                              {resumeData.experience.slice(0, 3).map((exp, index) => (
                                <div key={index} className="text-sm border-l-2 border-purple-200 pl-3 py-1">
                                  <span className="font-medium text-gray-800">{exp.title}</span>
                                  {exp.company && (
                                    <>
                                      {" at "}
                                      <span className="text-gray-600">{exp.company}</span>
                                    </>
                                  )}
                                  {exp.duration && (
                                    <span className="text-gray-500 text-xs block mt-0.5">{exp.duration}</span>
                                  )}
                                </div>
                              ))}
                              {resumeData.experience.length > 3 && (
                                <p className="text-xs text-purple-600 font-medium">
                                  +{resumeData.experience.length - 3} more positions
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {resumeData.education.length > 0 && (
                        <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                          <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            Education
                          </h4>
                          <div className="space-y-2">
                            {resumeData.education.map((edu, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                {edu}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(resumeData.certifications.length > 0 ||
                        resumeData.projects.length > 0 ||
                        resumeData.languages.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {resumeData.certifications.length > 0 && (
                            <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                              <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Certifications
                              </h4>
                              <div className="space-y-1">
                                {resumeData.certifications.slice(0, 3).map((cert, index) => (
                                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    {cert}
                                  </div>
                                ))}
                                {resumeData.certifications.length > 3 && (
                                  <p className="text-xs text-purple-600 font-medium">
                                    +{resumeData.certifications.length - 3} more
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {resumeData.projects.length > 0 && (
                            <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                              <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                Projects
                              </h4>
                              <div className="space-y-1">
                                {resumeData.projects.slice(0, 3).map((project, index) => (
                                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    {project.length > 50 ? project.substring(0, 50) + "..." : project}
                                  </div>
                                ))}
                                {resumeData.projects.length > 3 && (
                                  <p className="text-xs text-purple-600 font-medium">
                                    +{resumeData.projects.length - 3} more
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {resumeData.languages.length > 0 && (
                            <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                              <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Languages
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {resumeData.languages.map((language) => (
                                  <Badge
                                    key={language}
                                    variant="outline"
                                    className="border-purple-200 text-purple-700 text-xs"
                                  >
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {originalText && (
                        <div className="bg-white rounded-lg border border-purple-100 p-6 shadow-sm">
                          <h4 className="font-medium text-purple-700 mb-3 flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Document Preview
                          </h4>
                          <div className="rounded-lg border border-purple-100 bg-gray-50 p-4 max-h-40 overflow-y-auto">
                            <p className="text-sm text-gray-600 whitespace-pre-line">{originalText}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-b-lg border-t border-purple-100">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="border-purple-200 text-purple-700 hover:bg-purple-100"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              {!showPreview ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!file || isProcessing}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/20"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {useAI ? (
                        <>
                          <Zap className="h-4 w-4" />
                          Analyze with AI
                        </>
                      ) : (
                        "Analyze Resume"
                      )}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={proceedToMatches}
                  disabled={isProcessing}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/20"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    <>
                      View Job Matches
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
