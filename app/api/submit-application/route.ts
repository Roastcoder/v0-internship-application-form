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
  applicationType: "Internship" | "Work From Home"
  fatherName?: string
  fatherOccupation?: string
  nativePlace?: string
  personalVehicle?: string
}

// Calculate application score (0-100)
function calculateScore(data: ApplicationData): number {
  let score = 0

  if (data.githubPortfolio) {
    score += 20
  }

  if (data.hasProjects === "yes") {
    score += 25
  }

  if (data.currentYear === "Final" || data.currentYear === "Passout") {
    score += 15
  }

  if (data.hoursPerDay === "4-6" || data.hoursPerDay === "Full-time") {
    score += 20
  }

  if (data.hasInternship === "yes") {
    score += 20
  }

  return score
}

// Determine application status
function getStatus(data: ApplicationData, score: number): string {
  if (data.programmingLanguages.length === 0) {
    return "Rejected"
  }

  if (data.hasProjects === "no" && data.readyToLearn === "no") {
    return "Rejected"
  }

  if (data.hoursPerDay === "2-3" && data.duration === "1") {
    return "Rejected"
  }

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
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  let formattedPrivateKey = privateKey?.trim() || ""

  if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1)
  }

  formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, "\n")

  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: formattedPrivateKey,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
      process.env.GOOGLE_CLIENT_EMAIL || "",
    )}`,
  }

  console.log("[v0] Creating auth with client email:", process.env.GOOGLE_CLIENT_EMAIL)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return sheets
}

async function appendToGoogleSheets(sheetId: string, sheetName: string, rowData: any) {
  try {
    const sheets = await getGoogleSheetsClient()

    const values = [
      [
        rowData.timestamp,
        rowData.applicationType,
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
        rowData.fatherName || "-",
        rowData.fatherOccupation || "-",
        rowData.nativePlace || "-",
        rowData.personalVehicle || "-",
        rowData.score,
        rowData.status,
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:AF`,
      valueInputOption: "RAW",
      requestBody: { values },
    })
  } catch (error) {
    console.error(`[v0] Error appending to ${sheetName}:`, error)
    throw error
  }
}

async function ensureSheetsExist(sheets: any, sheetId: string, sheetNames: string[]) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    })

    const existingSheetsResponse = response.data.sheets || []
    const existingSheets = existingSheetsResponse.map((sheet: any) => sheet.properties.title)

    const missingSheets = sheetNames.filter((name) => !existingSheets.includes(name))

    if (missingSheets.length > 0) {
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
    }
  } catch (error) {
    console.error("[v0] Error ensuring sheets exist:", error)
    throw error
  }
}

async function initializeWFHSheet(sheets: any, sheetId: string) {
  try {
    const sheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    })

    const wfhSheet = sheetResponse.data.sheets?.find((sheet: any) => sheet.properties?.title === "WFH_Applications")
    const wfhSheetId = wfhSheet?.properties?.sheetId

    console.log("[v0] WFH sheet ID:", wfhSheetId)

    const headers = [
      [
        "Timestamp",
        "Application Type",
        "Full Name",
        "Email",
        "Mobile",
        "City",
        "State",
        "College",
        "Degree",
        "Father's Name",
        "Father's Occupation",
        "Native Place",
        "Personal Vehicle",
      ],
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: "WFH_Applications!A1:M1",
      valueInputOption: "RAW",
      requestBody: { values: headers },
    })

    const filterRequest = {
      setBasicFilter: {
        filter: {
          range: {
            sheetId: wfhSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 13,
          },
        },
      },
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { requests: [filterRequest] },
    })

    console.log("[v0] ✓ WFH sheet initialized with headers and auto-filter")
  } catch (error) {
    console.error("[v0] Error initializing WFH sheet:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === Application Submission Started ===")

    const data: ApplicationData = await request.json()
    console.log("[v0] Received application data:", {
      name: data.fullName,
      email: data.email,
      type: data.applicationType,
    })

    if (data.applicationType === "Work From Home") {
      try {
        const timestamp = new Date().toISOString()
        const sheetId = process.env.GOOGLE_SHEET_ID!
        const sheets = await getGoogleSheetsClient()

        console.log("[v0] Checking if WFH_Applications sheet exists...")
        await ensureSheetsExist(sheets, sheetId, ["WFH_Applications"])

        await initializeWFHSheet(sheets, sheetId)

        const wfhValues = [
          [
            timestamp,
            data.applicationType,
            data.fullName,
            data.email,
            data.mobile,
            data.city,
            data.state,
            data.college,
            data.degree || "-",
            data.fatherName || "-",
            data.fatherOccupation || "-",
            data.nativePlace || "-",
            data.personalVehicle || "-",
          ],
        ]

        console.log("[v0] Appending WFH data to sheet...")
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "WFH_Applications!A:M",
          valueInputOption: "RAW",
          requestBody: { values: wfhValues },
        })

        console.log("[v0] === WFH Application Submitted Successfully ===")

        return NextResponse.json({
          success: true,
          message: `Thank you ${data.fullName}! Your work from home application has been received.`,
        })
      } catch (error: any) {
        console.error("[v0] WFH submission error:", error?.message || error)
        return NextResponse.json(
          {
            error: "Failed to submit WFH application",
            details: error?.message || "Unknown error",
          },
          { status: 500 },
        )
      }
    }

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

    const score = calculateScore(data)
    const status = getStatus(data, score)

    console.log("[v0] Calculated score:", score)
    console.log("[v0] Determined status:", status)

    const timestamp = new Date().toISOString()
    const rowData = {
      timestamp,
      applicationType: data.applicationType,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      city: data.city,
      state: data.state,
      college: data.college,
      currentYear: data.currentYear,
      degree: data.degree || "-",
      specialization: data.specialization || "-",
      cgpaPercentage: data.cgpaPercentage || "-",
      passingYear: data.passingYear || "-",
      technologies: data.technologies ? data.technologies.join(", ") : "-",
      programmingLanguages: data.programmingLanguages ? data.programmingLanguages.join(", ") : "-",
      frameworks: data.frameworks || "-",
      database: data.database || "-",
      githubPortfolio: data.githubPortfolio || "-",
      hasProjects: data.hasProjects || "-",
      hasInternship: data.hasInternship || "-",
      experienceDuration: data.experienceDuration || "-",
      mode: data.mode || "-",
      hoursPerDay: data.hoursPerDay || "-",
      duration: data.duration || "-",
      whySelectYou: data.whySelectYou || "-",
      readyToLearn: data.readyToLearn || "-",
      fatherName: data.fatherName || "-",
      fatherOccupation: data.fatherOccupation || "-",
      nativePlace: data.nativePlace || "-",
      personalVehicle: data.personalVehicle || "-",
      score,
      status,
    }

    const sheetsToUpdate = ["All_Applications"]

    if (status === "Rejected") {
      sheetsToUpdate.push("Rejected")
    } else {
      if (data.technologies && Array.isArray(data.technologies)) {
        data.technologies.forEach((tech) => {
          sheetsToUpdate.push(getTechSheetName(tech))
        })
      }
    }

    console.log("[v0] Sheets to update:", sheetsToUpdate)

    const sheetId = process.env.GOOGLE_SHEET_ID!

    const sheets = await getGoogleSheetsClient()
    console.log("[v0] Google Sheets client created successfully")

    // Test connection
    const testResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: "properties.title",
    })
    console.log("[v0] ✓ Successfully connected to sheet:", testResponse.data.properties?.title)

    await ensureSheetsExist(sheets, sheetId, sheetsToUpdate)
    console.log("[v0] Sheets verified/created")

    // Append to all relevant sheets
    for (const sheetName of sheetsToUpdate) {
      try {
        console.log(`[v0] Appending to sheet: ${sheetName}`)
        await appendToGoogleSheets(sheetId, sheetName, rowData)
        console.log(`[v0] ✓ Successfully added to sheet: ${sheetName}`)
      } catch (error: any) {
        console.error(`[v0] ✗ Error writing to sheet ${sheetName}:`, error?.message)
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
  } catch (error: any) {
    console.error("[v0] Fatal error processing application:", error?.message || error)

    return NextResponse.json(
      {
        error: "Failed to process application",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
