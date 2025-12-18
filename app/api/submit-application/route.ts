import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

interface ApplicationData {
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

// Calculate application score (0-100)
function calculateScore(data: ApplicationData): number {
  let score = 0

  // GitHub/Portfolio link → +20
  if (data.githubPortfolio) {
    score += 20
  }

  // Real Project → +25
  if (data.hasProjects === "yes") {
    score += 25
  }

  // Final Year / Passout → +15
  if (data.currentYear === "Final" || data.currentYear === "Passout") {
    score += 15
  }

  // 4+ Hours availability → +20
  if (data.hoursPerDay === "4-6" || data.hoursPerDay === "Full-time") {
    score += 20
  }

  // Internship experience → +20
  if (data.hasInternship === "yes") {
    score += 20
  }

  return score
}

// Determine application status
function getStatus(data: ApplicationData, score: number): string {
  // Auto-reject conditions
  if (data.programmingLanguages.length === 0) {
    return "Rejected"
  }

  if (data.hasProjects === "no" && data.readyToLearn === "no") {
    return "Rejected"
  }

  if (data.hoursPerDay === "2-3" && data.duration === "1") {
    return "Rejected"
  }

  // Shortlist if score is high
  if (score >= 60) {
    return "Shortlisted"
  }

  return "Under Review"
}

// Map technology names to sheet names
function getTechSheetName(tech: string): string {
  const mapping: { [key: string]: string } = {
    "Web Development": "Web_Development",
    "Frontend (HTML, CSS, JS, React)": "Frontend",
    "Backend (PHP / Node.js)": "Backend",
    "Full Stack": "Full_Stack",
    "Cyber Security": "Cyber_Security",
    "Data Analytics": "Data_Analytics",
    "AI / ML": "AI_ML",
    "Cloud / DevOps": "Cloud_DevOps",
  }
  return mapping[tech] || tech.replace(/\s+/g, "_")
}

async function getGoogleSheetsClient() {
  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
      process.env.GOOGLE_CLIENT_EMAIL || "",
    )}`,
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return sheets
}

async function appendToGoogleSheets(sheetId: string, sheetName: string, rowData: any) {
  const sheets = await getGoogleSheetsClient()

  const values = [
    [
      rowData.timestamp,
      rowData.fullName,
      rowData.email,
      rowData.mobile,
      rowData.city,
      rowData.state,
      rowData.college,
      rowData.currentYear,
      rowData.degree,
      rowData.specialization,
      rowData.cgpaPercentage,
      rowData.passingYear,
      rowData.technologies,
      rowData.programmingLanguages,
      rowData.frameworks,
      rowData.database,
      rowData.githubPortfolio,
      rowData.hasProjects,
      rowData.hasInternship,
      rowData.experienceDuration,
      rowData.mode,
      rowData.hoursPerDay,
      rowData.duration,
      rowData.whySelectYou,
      rowData.readyToLearn,
      rowData.score,
      rowData.status,
    ],
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:AA`,
    valueInputOption: "RAW",
    requestBody: { values },
  })
}

async function ensureSheetsExist(sheets: any, sheetId: string, sheetNames: string[]) {
  try {
    // Get existing sheets
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    })

    const existingSheets = response.data.sheets?.map((sheet: any) => sheet.properties.title) || []

    // Find missing sheets
    const missingSheets = sheetNames.filter((name) => !existingSheets.includes(name))

    if (missingSheets.length === 0) {
      return
    }

    // Create missing sheets with headers
    const requests = missingSheets.map((sheetName) => ({
      addSheet: {
        properties: {
          title: sheetName,
        },
      },
    }))

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests,
      },
    })

    console.log(`[v0] Created missing sheets: ${missingSheets.join(", ")}`)

    // Add headers to new sheets
    const headers = [
      "Timestamp",
      "Full Name",
      "Email",
      "Mobile",
      "City",
      "State",
      "College",
      "Current Year",
      "Degree",
      "Specialization",
      "CGPA/Percentage",
      "Passing Year",
      "Technologies",
      "Programming Languages",
      "Frameworks",
      "Database",
      "GitHub/Portfolio",
      "Has Projects",
      "Has Internship",
      "Experience Duration",
      "Mode",
      "Hours Per Day",
      "Duration",
      "Why Select You",
      "Ready To Learn",
      "Score",
      "Status",
    ]

    for (const sheetName of missingSheets) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1:AA1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      })
    }

    console.log("[v0] Added headers to new sheets")
  } catch (error) {
    console.error("[v0] Error creating sheets:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === Application Submission Started ===")

    const data: ApplicationData = await request.json()
    console.log("[v0] Received application data:", {
      name: data.fullName,
      email: data.email,
      technologies: data.technologies,
    })

    const requiredEnvVars = {
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    }

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      console.error("[v0] Missing environment variables:", missingVars)
      return NextResponse.json(
        {
          error: "Server configuration error. Missing environment variables.",
          details: missingVars,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Environment variables validated")

    // Calculate score and status
    const score = calculateScore(data)
    const status = getStatus(data, score)

    console.log("[v0] Calculated score:", score)
    console.log("[v0] Determined status:", status)

    // Prepare row data
    const timestamp = new Date().toISOString()
    const rowData = {
      timestamp,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      state: data.state,
      college: data.college,
      currentYear: data.currentYear,
      degree: data.degree,
      specialization: data.specialization,
      cgpaPercentage: data.cgpaPercentage,
      passingYear: data.passingYear,
      technologies: data.technologies.join(", "),
      programmingLanguages: data.programmingLanguages.join(", "),
      frameworks: data.frameworks,
      database: data.database,
      githubPortfolio: data.githubPortfolio,
      hasProjects: data.hasProjects,
      hasInternship: data.hasInternship,
      experienceDuration: data.experienceDuration,
      mode: data.mode,
      hoursPerDay: data.hoursPerDay,
      duration: data.duration,
      whySelectYou: data.whySelectYou,
      readyToLearn: data.readyToLearn,
      score,
      status,
    }

    // Prepare sheets routing
    const sheetsToUpdate = ["All_Applications"]

    if (status === "Rejected") {
      sheetsToUpdate.push("Rejected")
    } else {
      // Add to technology-specific sheets
      data.technologies.forEach((tech) => {
        sheetsToUpdate.push(getTechSheetName(tech))
      })
    }

    console.log("[v0] Sheets to update:", sheetsToUpdate)

    const sheetId = process.env.GOOGLE_SHEET_ID!

    try {
      console.log("[v0] Creating Google Sheets client...")
      const sheets = await getGoogleSheetsClient()
      console.log("[v0] Google Sheets client created successfully")

      console.log("[v0] Ensuring sheets exist...")
      await ensureSheetsExist(sheets, sheetId, sheetsToUpdate)
      console.log("[v0] Sheets verified/created")

      // Append to all relevant sheets
      for (const sheetName of sheetsToUpdate) {
        try {
          console.log(`[v0] Appending to sheet: ${sheetName}`)
          await appendToGoogleSheets(sheetId, sheetName, rowData)
          console.log(`[v0] ✓ Successfully added to sheet: ${sheetName}`)
        } catch (error) {
          console.error(`[v0] ✗ Error writing to sheet ${sheetName}:`, error)
          // Continue with other sheets even if one fails
        }
      }

      console.log("[v0] === Application Submission Completed ===")

      return NextResponse.json({
        success: true,
        message: `Thank you ${data.fullName}! Your application has been received and is ${status.toLowerCase()}.`,
        score,
        status,
        sheetsUpdated: sheetsToUpdate,
      })
    } catch (sheetsError) {
      console.error("[v0] Google Sheets API Error:", sheetsError)

      return NextResponse.json(
        {
          error: "Failed to write to Google Sheets",
          details: sheetsError instanceof Error ? sheetsError.message : "Unknown error",
          hint: "Check if the sheet is shared with the service account email",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Fatal error processing application:", error)

    return NextResponse.json(
      {
        error: "Failed to process application",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
