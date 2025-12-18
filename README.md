# Finonest IT Internship Application System

A smart, automated internship application form that filters students based on skills and experience, then routes their data to technology-specific Google Sheets for easy HR review.

## Features

### 🎯 Smart Application Form
- **Multi-section form** with progressive disclosure
- **Real-time validation** for required fields
- **Mobile-responsive** design matching Finonest branding
- **Professional UI** with blue and cyan color scheme

### 🤖 Automated Filtering & Scoring
- **Automatic scoring** system (0-100 points) based on:
  - GitHub/Portfolio presence (+20)
  - Real project experience (+25)
  - Academic year (+15)
  - Availability (+20)
  - Previous internship experience (+20)

### 📊 Google Sheets Integration
- **Automatic routing** to technology-specific sheets
- **10 sub-sheets** for different tech stacks
- **Rejection filtering** with auto-classification
- **Master backup** in All_Applications sheet

### 📧 Email Automation
- **Instant confirmation** emails to applicants
- **Status updates** (Shortlisted/Under Review/Rejected)
- **Score reporting** in email body

## Technology Stack

- **Frontend**: Next.js 16, React 19.2, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Google Apps Script
- **Integration**: Google Sheets API, Gmail API

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Google Sheets
Follow the comprehensive guide in `GOOGLE_SHEETS_SETUP.md` to:
- Create the Google Sheet
- Deploy the Apps Script
- Get your webhook URL

### 3. Configure Environment Variables
Add to your `.env.local` or Vercel environment variables:
```
GOOGLE_SHEETS_WEBHOOK_URL=your-webhook-url-here
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the form.

## Form Sections

1. **Basic Details** - Personal information and contact
2. **Education Details** - Academic background
3. **Technology Selection** - Multi-select for tech interests (REQUIRED)
4. **Skill Validation** - Programming languages, frameworks, tools
5. **Practical Experience** - Projects and internships
6. **Availability** - Mode, hours, duration preferences
7. **Screening Questions** - Motivation and commitment

## Auto-Routing Logic

### Google Sheets Structure
```
IT Internship Applications
├── All_Applications (Master backup)
├── Web_Development
├── Frontend
├── Backend
├── Full_Stack
├── Cyber_Security
├── Data_Analytics
├── AI_ML
├── Cloud_DevOps
└── Rejected
```

### Routing Rules
- ✅ Every application → **All_Applications**
- ✅ Multi-tech applicants → Duplicated to each selected tech sheet
- ❌ Rejected applications → **Rejected** sheet only

### Auto-Reject Conditions
Applications are automatically rejected if:
- No programming languages selected
- No projects AND not willing to learn
- Less than 2 hours/day availability

### Status Classification
- **Shortlisted**: Score ≥ 60 points
- **Under Review**: Score < 60 points
- **Rejected**: Meets auto-reject conditions

## File Structure

```
finonest-internship-app/
├── app/
│   ├── api/
│   │   └── submit-application/
│   │       └── route.ts          # Application processing logic
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Homepage with form
│   └── globals.css                # Finonest brand theme
├── components/
│   ├── internship-application-form.tsx  # Main form component
│   └── ui/                        # shadcn/ui components
├── scripts/
│   └── google-sheets-setup.js     # Google Apps Script code
├── public/
│   └── finonest-logo.png          # Company logo
├── GOOGLE_SHEETS_SETUP.md         # Detailed setup guide
└── README.md                      # This file
```

## Customization

### Update Branding Colors
Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: oklch(0.35 0.14 250);    /* Blue */
  --secondary: oklch(0.62 0.15 195);  /* Cyan */
  --accent: oklch(0.62 0.15 195);     /* Accent color */
}
```

### Modify Scoring Algorithm
Edit `app/api/submit-application/route.ts`:
```typescript
function calculateScore(data: ApplicationData): number {
  let score = 0
  // Add your custom scoring logic here
  return score
}
```

### Customize Email Template
Edit the `sendConfirmationEmail` function in `scripts/google-sheets-setup.js`

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Add Environment Variables in Vercel
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add `GOOGLE_SHEETS_WEBHOOK_URL`

## Support

For issues with:
- **Form functionality**: Check browser console and Next.js logs
- **Google Sheets**: See `GOOGLE_SHEETS_SETUP.md`
- **Email delivery**: Check Google Apps Script execution logs

## License

Built for Finonest - Trust Comes First

## Notes

- The `scripts/google-sheets-setup.js` file contains code for Google Apps Script, not Node.js
- Lint warnings for `SpreadsheetApp`, `Logger`, etc. are expected (they're Google Apps Script globals)
- The script file should be copied to Google Apps Script editor, not run locally
