"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface FormData {
  // Basic Details
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  college: string
  currentYear: string

  // Education
  degree: string
  specialization: string
  cgpaPercentage: string
  passingYear: string

  // Technology Selection
  technologies: string[]

  // Skills
  programmingLanguages: string[]
  frameworks: string
  database: string
  githubPortfolio: string

  // Experience
  hasProjects: string
  hasInternship: string
  experienceDuration: string

  // Availability
  mode: string
  hoursPerDay: string
  duration: string

  // Screening
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
  "Rust",
]

export default function InternshipApplicationForm() {
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

    // Validation
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

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Application Submitted!",
          description: result.message || "Your application has been received. We will contact you soon.",
        })

        // Reset form
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Details */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Please provide your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Your city"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                required
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Your state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="college">College / University *</Label>
              <Input
                id="college"
                required
                value={formData.college}
                onChange={(e) => handleInputChange("college", e.target.value)}
                placeholder="Your institution"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentYear">Current Year *</Label>
            <Select
              required
              value={formData.currentYear}
              onValueChange={(value) => handleInputChange("currentYear", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Year</SelectItem>
                <SelectItem value="2nd">2nd Year</SelectItem>
                <SelectItem value="3rd">3rd Year</SelectItem>
                <SelectItem value="Final">Final Year</SelectItem>
                <SelectItem value="Passout">Passout</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Select required value={formData.degree} onValueChange={(value) => handleInputChange("degree", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                required
                value={formData.specialization}
                onChange={(e) => handleInputChange("specialization", e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cgpaPercentage">CGPA / Percentage *</Label>
              <Input
                id="cgpaPercentage"
                required
                value={formData.cgpaPercentage}
                onChange={(e) => handleInputChange("cgpaPercentage", e.target.value)}
                placeholder="e.g., 8.5 or 85%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passingYear">Passing Year *</Label>
              <Input
                id="passingYear"
                required
                value={formData.passingYear}
                onChange={(e) => handleInputChange("passingYear", e.target.value)}
                placeholder="e.g., 2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Internship Technology Selection *</CardTitle>
          <CardDescription>Select all technologies you're interested in (multi-select)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technologies.map((tech) => (
              <div key={tech} className="flex items-center space-x-2">
                <Checkbox
                  id={`tech-${tech}`}
                  checked={formData.technologies.includes(tech)}
                  onCheckedChange={(checked) => handleCheckboxChange("technologies", tech, checked as boolean)}
                />
                <Label htmlFor={`tech-${tech}`} className="cursor-pointer font-normal">
                  {tech}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Validation</CardTitle>
          <CardDescription>Show us what you know</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Programming Languages * (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {programmingLanguages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${lang}`}
                    checked={formData.programmingLanguages.includes(lang)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("programmingLanguages", lang, checked as boolean)
                    }
                  />
                  <Label htmlFor={`lang-${lang}`} className="cursor-pointer font-normal">
                    {lang}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frameworks">Frameworks / Tools</Label>
            <Input
              id="frameworks"
              value={formData.frameworks}
              onChange={(e) => handleInputChange("frameworks", e.target.value)}
              placeholder="e.g., React, Node.js, Django, TensorFlow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database Knowledge</Label>
            <Input
              id="database"
              value={formData.database}
              onChange={(e) => handleInputChange("database", e.target.value)}
              placeholder="e.g., MySQL, MongoDB, PostgreSQL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubPortfolio">GitHub / Portfolio URL</Label>
            <Input
              id="githubPortfolio"
              type="url"
              value={formData.githubPortfolio}
              onChange={(e) => handleInputChange("githubPortfolio", e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </CardContent>
      </Card>

      {/* Practical Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Practical Experience</CardTitle>
          <CardDescription>Tell us about your hands-on experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Do you have real projects? *</Label>
            <RadioGroup
              required
              value={formData.hasProjects}
              onValueChange={(value) => handleInputChange("hasProjects", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="projects-yes" />
                <Label htmlFor="projects-yes" className="cursor-pointer font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="projects-no" />
                <Label htmlFor="projects-no" className="cursor-pointer font-normal">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Do you have internship/training experience? *</Label>
            <RadioGroup
              required
              value={formData.hasInternship}
              onValueChange={(value) => handleInputChange("hasInternship", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="internship-yes" />
                <Label htmlFor="internship-yes" className="cursor-pointer font-normal">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="internship-no" />
                <Label htmlFor="internship-no" className="cursor-pointer font-normal">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.hasInternship === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="experienceDuration">Duration (Months)</Label>
              <Input
                id="experienceDuration"
                type="number"
                value={formData.experienceDuration}
                onChange={(e) => handleInputChange("experienceDuration", e.target.value)}
                placeholder="e.g., 6"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>Let us know your availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Internship Mode *</Label>
            <Select required value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursPerDay">Hours per Day *</Label>
            <Select
              required
              value={formData.hoursPerDay}
              onValueChange={(value) => handleInputChange("hoursPerDay", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3">2-3 Hours</SelectItem>
                <SelectItem value="4-6">4-6 Hours</SelectItem>
                <SelectItem value="Full-time">Full-time (8+ Hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Internship Duration *</Label>
            <Select required value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="2">2 Months</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Screening Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Questions</CardTitle>
          <CardDescription>Help us understand your motivation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whySelectYou">Why should we select you? *</Label>
            <Textarea
              id="whySelectYou"
              required
              value={formData.whySelectYou}
              onChange={(e) => handleInputChange("whySelectYou", e.target.value)}
              placeholder="Tell us what makes you a great fit for this internship..."
              className="min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>Are you ready to work on real projects and learn daily? *</Label>
            <RadioGroup
              required
              value={formData.readyToLearn}
              onValueChange={(value) => handleInputChange("readyToLearn", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ready-yes" />
                <Label htmlFor="ready-yes" className="cursor-pointer font-normal">
                  Yes, I'm committed!
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ready-no" />
                <Label htmlFor="ready-no" className="cursor-pointer font-normal">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting Application...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
