"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

interface WFHFormData {
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  college: string
  degree: string
  fatherName: string
  fatherOccupation: string
  nativePlace: string
  personalVehicle: string
}

export default function WorkFromHomeForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<WFHFormData>({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    college: "",
    degree: "",
    fatherName: "",
    fatherOccupation: "",
    nativePlace: "",
    personalVehicle: "",
  })

  const handleInputChange = (field: keyof WFHFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      applicationType: "Work From Home" as const,
      // Add required fields with default values for WFH
      currentYear: "-",
      specialization: "-",
      cgpaPercentage: "-",
      passingYear: "-",
      technologies: [],
      programmingLanguages: [],
      frameworks: "-",
      database: "-",
      githubPortfolio: "-",
      hasProjects: "-",
      hasInternship: "-",
      experienceDuration: "-",
      mode: "-",
      hoursPerDay: "-",
      duration: "-",
      whySelectYou: "-",
      readyToLearn: "-",
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
          degree: "",
          fatherName: "",
          fatherOccupation: "",
          nativePlace: "",
          personalVehicle: "",
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
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please provide your details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
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
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
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
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Your location information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="nativePlace">Native Place *</Label>
              <Input
                id="nativePlace"
                value={formData.nativePlace}
                onChange={(e) => handleInputChange("nativePlace", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Family Details */}
        <Card>
          <CardHeader>
            <CardTitle>Family Details</CardTitle>
            <CardDescription>Information about your family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherOccupation">Father's Occupation *</Label>
              <Input
                id="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Final details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Do you have a personal vehicle? *</Label>
              <RadioGroup
                value={formData.personalVehicle}
                onValueChange={(value) => handleInputChange("personalVehicle", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vehicle-yes" />
                  <Label htmlFor="vehicle-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vehicle-no" />
                  <Label htmlFor="vehicle-no">No</Label>
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
