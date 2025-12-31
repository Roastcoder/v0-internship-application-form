# Google Sheets Integration Setup Guide

## Overview
This guide will help you set up Google Sheets integration for the Finonest IT Internship Application Form.

## Prerequisites
- A Google account
- Access to Google Sheets and Google Apps Script

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **IT Internship Applications**

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code in the script editor
3. **Copy the entire code below** and paste it into the Apps Script editor
4. Click the **Save** icon (💾) and name your project: **Internship Application Handler**

### Google Apps Script Code

\`\`\`javascript
/**
 * Google Apps Script for Finonest IT Internship Application
 * 
 * This code handles automatic routing of applications to technology-specific sheets
 * and sends confirmation emails to applicants.
 */

// Sheet names
const SHEETS = {
  ALL: "All_Applications",
  WEB_DEV: "Web_Development",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULL_STACK: "Full_Stack",
  CYBER: "Cyber_Security",
  DATA: "Data_Analytics",
  AI_ML: "AI_ML",
  CLOUD: "Cloud_DevOps",
  REJECTED: "Rejected",
}

// Column headers
const HEADERS = [
  "Timestamp",
  "Name",
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
  "Ready to Learn",
  "Score",
  "Status",
]

// Initialize sheets on first run
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  Object.values(SHEETS).forEach((sheetName) => {
    let sheet = ss.getSheetByName(sheetName)

    if (!sheet) {
      sheet = ss.insertSheet(sheetName)
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold")
      sheet.setFrozenRows(1)

      // Set column widths
      sheet.setColumnWidth(1, 150) // Timestamp
      sheet.setColumnWidth(2, 150) // Name
      sheet.setColumnWidth(3, 200) // Email
      sheet.setColumnWidth(13, 250) // Technologies
      sheet.setColumnWidth(17, 250) // GitHub
      sheet.setColumnWidth(24, 300) // Why Select You
    }
  })

  Logger.log("Sheets initialized successfully")
}

// Handle POST request from Next.js app
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    // Prepare row data
    const rowData = [
      data.timestamp,
      data.fullName,
      data.email,
      data.mobile,
      data.city,
      data.state,
      data.college,
      data.currentYear,
      data.degree,
      data.specialization,
      data.cgpaPercentage,
      data.passingYear,
      data.technologies,
      data.programmingLanguages,
      data.frameworks,
      data.database,
      data.githubPortfolio,
      data.hasProjects,
      data.hasInternship,
      data.experienceDuration,
      data.mode,
      data.hoursPerDay,
      data.duration,
      data.whySelectYou,
      data.readyToLearn,
      data.score,
      data.status,
    ]

    // Always add to All_Applications
    const allSheet = ss.getSheetByName(SHEETS.ALL)
    allSheet.appendRow(rowData)

    // Add to Rejected sheet if rejected
    if (data.status === "Rejected") {
      const rejectedSheet = ss.getSheetByName(SHEETS.REJECTED)
      rejectedSheet.appendRow(rowData)
    } else {
      // Add to technology-specific sheets
      const technologies = data.technologies.split(", ")
      technologies.forEach((tech) => {
        const sheetName = getTechSheetName(tech)
        const techSheet = ss.getSheetByName(sheetName)
        if (techSheet) {
          techSheet.appendRow(rowData)
        }
      })
    }

    // Send confirmation email
    sendConfirmationEmail(data)

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Application saved successfully",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log("Error: " + error.toString())
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// Map technology names to sheet names
function getTechSheetName(tech) {
  const mapping = {
    "Web Development": SHEETS.WEB_DEV,
    "Frontend (HTML, CSS, JS, React)": SHEETS.FRONTEND,
    "Backend (PHP / Node.js)": SHEETS.BACKEND,
    "Full Stack": SHEETS.FULL_STACK,
    "Cyber Security": SHEETS.CYBER,
    "Data Analytics": SHEETS.DATA,
    "AI / ML": SHEETS.AI_ML,
    "Cloud / DevOps": SHEETS.CLOUD,
  }
  return mapping[tech] || tech.replace(/\s+/g, "_")
}

// Send confirmation email
function sendConfirmationEmail(data) {
  const subject = "Finonest IT Internship - Application Received"

  const body = `
Dear ${data.fullName},

Thank you for applying to the Finonest IT Internship program!

We have received your application for the following technologies:
${data.technologies}

Application Status: ${data.status}
Score: ${data.score}/100

${
  data.status === "Shortlisted"
    ? "Congratulations! Your application has been shortlisted. Our HR team will contact you within 2-3 business days."
    : data.status === "Under Review"
      ? "Your application is currently under review. We will get back to you soon."
      : "Unfortunately, your application does not meet our current requirements. We encourage you to reapply in the future after gaining more experience."
}

If you have any questions, please reply to this email.

Best regards,
Finonest HR Team
Trust Comes First
  `

  try {
    MailApp.sendEmail(data.email, subject, body)
    Logger.log("Confirmation email sent to: " + data.email)
  } catch (error) {
    Logger.log("Failed to send email: " + error.toString())
  }
}

// Test function - Run this first to create all sheets
function testInitialization() {
  initializeSheets()
}
\`\`\`

## Step 3: Initialize Sheets

1. In the Apps Script editor, select the function `testInitialization` from the dropdown menu at the top
2. Click the **Run** button (▶️)
3. You'll be prompted to authorize the script - click **Review Permissions**
4. Choose your Google account
5. Click **Advanced** > **Go to [Project Name] (unsafe)**
6. Click **Allow**

This will create all required sub-sheets with proper headers:
- All_Applications
- Web_Development
- Frontend
- Backend
- Full_Stack
- Cyber_Security
- Data_Analytics
- AI_ML
- Cloud_DevOps
- Rejected

## Step 4: Deploy as Web App

1. In Apps Script, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: Finonest Internship Form Handler
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/...../exec`)

## Step 5: Configure Environment Variable

### Option A: Using v0 (Recommended)

1. In the v0 chat interface, look for the **in-chat sidebar** on the left
2. Click on **Vars** (Variables section)
3. Add a new environment variable:
   - **Name**: `GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value**: Paste your Web App URL from Step 4
4. Click **Save**

### Option B: For Local Development

Create a `.env.local` file in your project root:
\`\`\`bash
GOOGLE_SHEETS_WEBHOOK_URL=your-web-app-url-here
\`\`\`

### Option C: For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add a new variable:
   - **Name**: `GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value**: Your Web App URL
   - **Environment**: Production, Preview, Development

## Step 6: Update API Route (Already Done!)

The API route at `app/api/submit-application/route.ts` is already configured to work with Google Sheets. Once you add the environment variable, it will automatically start sending data.

To enable the actual webhook call, you can update the route to include:

\`\`\`typescript
// Add this code to the API route after calculating score and status
if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
  try {
    await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rowData)
    })
  } catch (error) {
    console.error('[v0] Failed to send to Google Sheets:', error)
    // Don't fail the whole request if sheets update fails
  }
}
\`\`\`

## Auto-Routing Logic

The system automatically routes applications as follows:

### All Applications
- Every submission is saved to **All_Applications** sheet

### Technology-Specific Sheets
If the application is NOT rejected, it's copied to each selected technology sheet:
- Web Development → **Web_Development**
- Frontend (HTML, CSS, JS, React) → **Frontend**
- Backend (PHP / Node.js) → **Backend**
- Full Stack → **Full_Stack**
- Cyber Security → **Cyber_Security**
- Data Analytics → **Data_Analytics**
- AI / ML → **AI_ML**
- Cloud / DevOps → **Cloud_DevOps**

### Rejected Applications
Applications are moved to **Rejected** sheet if:
- No programming languages selected
- No projects AND not willing to learn
- Less than 2-3 hours availability with only 1-month duration

## Scoring System (0-100 points)

The system automatically calculates scores:

- **GitHub/Portfolio link**: +20 points
- **Real projects**: +25 points
- **Final Year/Passout**: +15 points
- **4+ hours availability**: +20 points
- **Internship experience**: +20 points

### Status Assignment
- **Score ≥ 60**: Shortlisted
- **Score < 60**: Under Review
- **Auto-reject conditions met**: Rejected

## Email Confirmation

The system automatically sends confirmation emails to applicants with:
- Application status
- Score
- Next steps based on status

To customize the email template, edit the `sendConfirmationEmail` function in the Google Apps Script.

## Testing

1. Submit a test application through the form
2. Check the **All_Applications** sheet for the entry
3. Verify the entry appears in the appropriate technology sheets
4. Confirm the email was received
5. Check the scoring and status are correct

## Troubleshooting

### Emails not sending
- Verify your Gmail account has permission to send emails via Apps Script
- Check the daily email quota (100 emails/day for free accounts)

### Data not appearing in sheets
- Check the Apps Script execution logs: **Executions** tab in Apps Script editor
- Verify the Web App URL is correct in your environment variables
- Ensure the script has proper permissions

### Duplicate entries
- This is expected if a student selects multiple technologies
- Each technology sheet will have a copy of their application

### Environment variable not found
- Make sure you've added `GOOGLE_SHEETS_WEBHOOK_URL` in the **Vars** section of the v0 sidebar
- For local development, ensure `.env.local` exists in your project root
- For Vercel, check Settings > Environment Variables in your project dashboard

## Security Notes

- The Web App URL should be kept secure
- Consider implementing rate limiting to prevent spam
- Monitor the **All_Applications** sheet for suspicious activity
- Regularly backup your Google Sheet

## Support

For issues with:
- Google Sheets/Apps Script: Check Google's [Apps Script documentation](https://developers.google.com/apps-script)
- Form functionality: Check the Next.js application logs
- Integration: Review the webhook URL and environment variables
