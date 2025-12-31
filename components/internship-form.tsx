"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  college: string
  currentYear: string
  degree: string
  specialization: string
  cgpaPercentage: string
  passingYear: string
  technologies: string[]
  programmingLanguages: string[]
  frameworks: string
  database: string
  githubPortfolio: string
  hasProjects: string
  hasInternship: string
  experienceDuration: string
  mode: string
  hoursPerDay: string
  duration: string
  whySelectYou: string
  readyToLearn: string
}

const technologies = [
  "Web Development",
  "Frontend (HTML, CSS, JS, React)",
  "Backend (PHP / Node.js)",
  "Full Stack",
  "Cyber Security",
  "Data Analytics",
  "AI / ML",
  "Cloud / DevOps",
]

const programmingLanguages = [
  "HTML/CSS",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "PHP",
  "C++",
  "C#",
  "Go",
  "Ruby",
]

export default function InternshipForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    college: "",
    currentYear: "",
    degree: "",
    specialization: "",
    cgpaPercentage: "",
    passingYear: "",
    technologies: [],
    programmingLanguages: [],
    frameworks: "",
    database: "",
    githubPortfolio: "",
    hasProjects: "",
    hasInternship: "",
    experienceDuration: "",
    mode: "",
    hoursPerDay: "",
    duration: "",
    whySelectYou: "",
    readyToLearn: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: "technologies" | "programmingLanguages", value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.technologies.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one technology",
        variant: "destructive",
      })
      return
    }

    if (formData.programmingLanguages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one programming language",
        variant: "destructive",
      })
      return
    }

    if (formData.hasProjects === "yes" && !formData.githubPortfolio) {
      toast({
        title: "Error",
        description: "GitHub/Portfolio URL is required if you have projects",
        variant: "destructive",
      })
      return
    }

    const payload = {
      ...formData,
      applicationType: "Internship",
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Application Submitted!",
          description: result.message || "Your application has been received. We will contact you soon.",
        })

        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          city: "",
          state: "",
          college: "",
          currentYear: "",
          degree: "",
          specialization: "",
          cgpaPercentage: "",
          passingYear: "",
          technologies: [],
          programmingLanguages: [],
          frameworks: "",
          database: "",
          githubPortfolio: "",
          hasProjects: "",
          hasInternship: "",
          experienceDuration: "",
          mode: "",
          hoursPerDay: "",
          duration: "",
          whySelectYou: "",
          readyToLearn: "",
        })
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Please provide your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Education Details */}
        <Card>
          <CardHeader>
            <CardTitle>Education Details</CardTitle>
            <CardDescription>Tell us about your academic background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="college">College/University Name *</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => handleInputChange("college", e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  placeholder="e.g., B.Tech, BCA, MCA"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Computer Science"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentYear">Current Year *</Label>
                <Input
                  id="currentYear"
                  placeholder="e.g., 3rd Year"
                  value={formData.currentYear}
                  onChange={(e) => handleInputChange("currentYear", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpaPercentage">CGPA/Percentage *</Label>
                <Input
                  id="cgpaPercentage"
                  placeholder="e.g., 8.5 or 85%"
                  value={formData.cgpaPercentage}
                  onChange={(e) => handleInputChange("cgpaPercentage", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingYear">Passing Year *</Label>
                <Input
                  id="passingYear"
                  placeholder="e.g., 2025"
                  value={formData.passingYear}
                  onChange={(e) => handleInputChange("passingYear", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Preferences</CardTitle>
            <CardDescription>Select your areas of interest (choose multiple)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              {technologies.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech}
                    checked={formData.technologies.includes(tech)}
                    onCheckedChange={(checked) => handleCheckboxChange("technologies", tech, checked as boolean)}
                  />
                  <Label htmlFor={tech} className="cursor-pointer">
                    {tech}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
            <CardDescription>Share your programming knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block">Programming Languages *</Label>
              <div className="grid md:grid-cols-3 gap-3">
                {programmingLanguages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={formData.programmingLanguages.includes(lang)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("programmingLanguages", lang, checked as boolean)
                      }
                    />
                    <Label htmlFor={lang} className="cursor-pointer">
                      {lang}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frameworks">Frameworks/Libraries</Label>
                <Input
                  id="frameworks"
                  placeholder="e.g., React, Node.js, Django"
                  value={formData.frameworks}
                  onChange={(e) => handleInputChange("frameworks", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="database">Database Knowledge</Label>
                <Input
                  id="database"
                  placeholder="e.g., MySQL, MongoDB"
                  value={formData.database}
                  onChange={(e) => handleInputChange("database", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Experience & Projects</CardTitle>
            <CardDescription>Tell us about your previous work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Do you have any projects? *</Label>
              <RadioGroup
                value={formData.hasProjects}
                onValueChange={(value) => handleInputChange("hasProjects", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="projects-yes" />
                  <Label htmlFor="projects-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="projects-no" />
                  <Label htmlFor="projects-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasProjects === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="githubPortfolio">GitHub / Portfolio URL *</Label>
                <Input
                  id="githubPortfolio"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubPortfolio}
                  onChange={(e) => handleInputChange("githubPortfolio", e.target.value)}
                  required={formData.hasProjects === "yes"}
                />
              </div>
            )}

            <div className="space-y-3">
              <Label>Have you done any internship before? *</Label>
              <RadioGroup
                value={formData.hasInternship}
                onValueChange={(value) => handleInputChange("hasInternship", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="internship-yes" />
                  <Label htmlFor="internship-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="internship-no" />
                  <Label htmlFor="internship-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.hasInternship === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="experienceDuration">Experience Duration</Label>
                <Input
                  id="experienceDuration"
                  placeholder="e.g., 3 months"
                  value={formData.experienceDuration}
                  onChange={(e) => handleInputChange("experienceDuration", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Help us understand your availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Preferred Mode *</Label>
              <RadioGroup value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="mode-online" />
                  <Label htmlFor="mode-online">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offline" id="mode-offline" />
                  <Label htmlFor="mode-offline">Offline</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="mode-hybrid" />
                  <Label htmlFor="mode-hybrid">Hybrid</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoursPerDay">Hours per day available *</Label>
                <Input
                  id="hoursPerDay"
                  placeholder="e.g., 4-6 hours"
                  value={formData.hoursPerDay}
                  onChange={(e) => handleInputChange("hoursPerDay", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Preferred Duration *</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 months"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Final Questions</CardTitle>
            <CardDescription>Help us get to know you better</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whySelectYou">Why should we select you? *</Label>
              <Textarea
                id="whySelectYou"
                placeholder="Tell us what makes you a great fit..."
                rows={4}
                value={formData.whySelectYou}
                onChange={(e) => handleInputChange("whySelectYou", e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Are you ready to learn new technologies? *</Label>
              <RadioGroup
                value={formData.readyToLearn}
                onValueChange={(value) => handleInputChange("readyToLearn", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="learn-yes" />
                  <Label htmlFor="learn-yes">Yes, absolutely!</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="learn-maybe" />
                  <Label htmlFor="learn-maybe">Maybe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="learn-no" />
                  <Label htmlFor="learn-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}
