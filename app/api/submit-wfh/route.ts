import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

interface WFHData {
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
  applicationType: string
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

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return sheets
}

export async function POST(request: NextRequest) {
  try {
    const data: WFHData = await request.json()
    
    const timestamp = new Date().toISOString()
    const rowData = [
      timestamp,
      data.applicationType,
      data.fullName,
      data.email,
      data.mobile,
      data.city,
      data.state,
      data.college,
      data.degree,
      data.fatherName,
      data.fatherOccupation,
      data.nativePlace,
      data.personalVehicle,
    ]

    const sheets = await getGoogleSheetsClient()
    const sheetId = process.env.GOOGLE_SHEET_ID!

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "WFH_Applications!A:M",
      valueInputOption: "RAW",
      requestBody: { values: [rowData] },
    })

    return NextResponse.json({
      success: true,
      message: `Thank you ${data.fullName}! Your work from home application has been received.`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process application", details: error?.message },
      { status: 500 }
    )
  }
}