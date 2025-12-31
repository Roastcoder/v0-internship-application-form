import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: NextRequest) {
  console.log("[v0] === Google Sheets Connection Test ===")

  // Check environment variables
  const envVars = {
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
      ? "Present (length: " + process.env.GOOGLE_PRIVATE_KEY.length + ")"
      : "Missing",
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  }

  console.log("[v0] Environment Variables:", envVars)

  const missingVars = Object.entries({
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  })
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    return NextResponse.json({
      success: false,
      error: "Missing environment variables",
      missing: missingVars,
      current: envVars,
    })
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    let formattedPrivateKey = privateKey?.trim() || ""

    if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1)
    }

    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, "\n")

    console.log("[v0] Private key format check:")
    console.log("[v0] - Contains \\n:", privateKey?.includes("\\n"))
    console.log("[v0] - Contains actual newlines:", privateKey?.includes("\n"))
    console.log("[v0] - First 50 chars:", privateKey?.substring(0, 50))
    console.log("[v0] - Last 50 chars:", privateKey?.substring(privateKey.length - 50))

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

    console.log("[v0] Creating Google Auth...")
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    console.log("[v0] Creating Sheets client...")
    const sheets = google.sheets({ version: "v4", auth })

    console.log("[v0] Testing connection to sheet:", process.env.GOOGLE_SHEET_ID)

    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      fields: "properties.title,sheets.properties.title",
    })

    console.log("[v0] Successfully connected!")
    console.log("[v0] Sheet title:", response.data.properties?.title)
    console.log(
      "[v0] Existing tabs:",
      response.data.sheets?.map((s) => s.properties?.title),
    )

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Google Sheets",
      sheetTitle: response.data.properties?.title,
      existingTabs: response.data.sheets?.map((s) => s.properties?.title),
      serviceAccount: process.env.GOOGLE_CLIENT_EMAIL,
      sheetId: process.env.GOOGLE_SHEET_ID,
    })
  } catch (error: any) {
    console.error("[v0] Connection test failed:", error)

    const errorDetails = {
      message: error?.message,
      code: error?.code,
      status: error?.status,
    }

    if (error?.code === 403) {
      errorDetails.message = `Permission denied. Please share the Google Sheet with: ${process.env.GOOGLE_CLIENT_EMAIL} with Editor access`
    } else if (error?.code === 404) {
      errorDetails.message = `Sheet not found. Check if the sheet ID is correct: ${process.env.GOOGLE_SHEET_ID}`
    } else if (error?.message?.includes("invalid_grant")) {
      errorDetails.message = "Authentication failed. Check if the private key is correctly formatted"
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to Google Sheets",
        details: errorDetails,
        serviceAccount: process.env.GOOGLE_CLIENT_EMAIL,
        sheetId: process.env.GOOGLE_SHEET_ID,
      },
      { status: 500 },
    )
  }
}
