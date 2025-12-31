# Finonest IT Internship Application - Setup Instructions

This application automatically routes internship applications to Google Sheets with intelligent scoring and filtering.

## Features

- **Smart Scoring System**: Automatically assigns 0-100 points based on qualifications
- **Auto-Routing**: Distributes applications to technology-specific sheets
- **Status Assignment**: Automatically categorizes as Shortlisted, Under Review, or Rejected
- **Real-time Updates**: Direct Google Sheets API integration
- **Auto-Sheet Creation**: Automatically creates all necessary sub-sheets with headers

## Setup Steps

### 1. Google Sheets Setup

**No manual setup required!** The application will automatically create all necessary sheets when the first application is submitted:

1. **All_Applications** - Master sheet with all applications
2. **Web_Development** - For web development applicants
3. **Frontend** - For frontend specialists
4. **Backend** - For backend developers
5. **Full_Stack** - For full-stack developers
6. **Cyber_Security** - For cybersecurity applicants
7. **Data_Analytics** - For data analytics roles
8. **AI_ML** - For AI/ML applicants
9. **Cloud_DevOps** - For cloud/DevOps roles
10. **Rejected** - Auto-rejected applications

All sheets will be created with proper headers automatically.

### 2. Google Service Account (Already Configured)

The service account credentials have been provided. You need to:

1. Your Google Sheet ID is already configured:
   \`\`\`
   1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s
   \`\`\`
   URL: https://docs.google.com/spreadsheets/d/1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s/edit

2. Share your Google Sheet with the service account email:
   \`\`\`
   internship-progam@finonest-salew.iam.gserviceaccount.com
   \`\`\`
   Give it **Editor** access.

### 3. Environment Variables

Add these environment variables to your Vercel project (or .env.local for local development):

\`\`\`env
# Google Service Account Credentials
GOOGLE_PROJECT_ID=finonest-salew
GOOGLE_PRIVATE_KEY_ID=f605c5ad1ed912b7368f4a2bf75eb5ad9441946c
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC1DpP6j8WbeJkA\nG2QWbGent3mEEHV5Ld5UpPXT6k9c7mjfHVnm1rASnMLWFEj1ZfeP57ny/S0FiB0H\nPeonDZfBOqiGGkxGzFEXJ0JmJefHA73NQ5ynb1o8ogZK8aYTMgdUnl6dAepaA1sN\ncEpA6N5nVCsXYkjxbAInFVvkBPAWYfRdj9rXg96geSx6Gt/2qq6w0IPvwfDAaugt\n+kV/EwEOG3m+xBWspss9oSK7iptlaL75rAYSARZMo0Ib1SlwS/OKtVBSRmgdjkwm\n1gIxODF+y8vwwe3o899tEZXtvmql7nQPU8zhYFawaol1zMkJ+EAA0uOST3rjw9L6\nQNQQBmsLAgMBAAECggEAGUdFxc/Y6RH3Wpp4aOENv87P+m5J2Hdc+Thm0gV+uxzW\nK4BvktkakB6u3TDL1uc7ny3dOl26sXEFjINKc9VkAKht6vs09xWDpNXoYVade528\nHDJ6Zq4XTSvZ8RC3/SoY9+l8kDM6QwMA7WlmFJXup0KLGaKxSHOqAUbsI3PFCXq7\nbBI1nYohio/OvTlno7/hiPP+9sM2/SXu+u0lL3cNGXXqCPhygqbf+euxL+GCI80n\nYqH+X56HHR7Ew+3Klwa7S0TF8xXNyiwHLx4ZS8Vz9MoOlzeHK7pDZnOayB/LdUYV\n2DXmnvaAKHmAcYwdr286uXJFZZZUReyb3bDwoeLVsQKBgQDje43mH9pGVPuLaHp7\nh7kvlClgcK6Iw6DUqexfrIvQrDNmwgWR6hfWkFJ1Ka6YsSbkSZx7h8yVmDsnCOYG\nH0W5Ud/1hpTFerOWWq4CzgJ85bfoKiBjGBj9fyuEyiPi7f8HH1b+8oXmSK8Lu62W\nLqsGdogKG4N75cnYP1IuBrxcXQKBgQDLwR2baxC/gDhDUC5/QpVbRs0UT56wN4SE\n2/VGGycYpIWpQtgLl1JIFeYe5Ke/LygxbQreX4qLArFbEYUHw1yrwd5UXVrg6ooY\nXEOEOzxthtXoVCQiJHgzNrnFYcFDelcUzEtmVXIa7sOw5c7d7XY8fKrKeMNTpZjK\nCjMhSO0uhwKBgD7OJ/k3Jh5w7BorOFXOvRQjxeC4e5eK22abm4U2sEtmn7JpMvx8\nMySsJ/ftECVcE67HnAqHDbbnlr1KOafLDocB0eGJzJ1RKTADzTM9CXbOPZ49sz9o\nsc2bRLqezJWku9qNjolJECrqOln08RIbxGA+bYTM39pfMQEhSmEmvu6JAoGAU1+9\nPrhrzQCphRnNPPPA6+2nwzTlSVQeXMMotTwtHk9MBju87dlIqQiU9nU4Euo39ymY\ndfAAX+uFKS+dENUnGX0l/b2Jj1lJkrhGRFh83JB8/SlY88Oaj9JH5/WdQIBSG8eQ\n3tn96/lhiAQxRuyBIjUdKeaKfrLXN20/CNKvgwcCgYAaOJdrekRy3icWHQZ+osdC\ni0IKs22esg9t03reQw+9vtNsBO5NEv96pBUrJj2G3nPzw5JCoB/lGU0msu6e3JS6\nVOPBNY46nOcp+q7fU6dtnx+xqqE4iC8X6f2gQxgw1vLBnpLI2RE5sgZCHOJ1vu+N\nip+6XDgwNZsaUEhwhsT9Dw==\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=internship-progam@finonest-salew.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=102026155687482474976

# Your Google Sheet ID (already configured)
GOOGLE_SHEET_ID=1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s
\`\`\`

**Important:** When adding `GOOGLE_PRIVATE_KEY` to Vercel:
- Keep the quotes around the entire key
- The `\n` characters should remain as literal `\n` (not actual newlines)
- Copy the entire value including the BEGIN and END lines

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy!

## How It Works

### Scoring System (0-100 points)

- **GitHub/Portfolio Link**: +20 points
- **Real Project Experience**: +25 points
- **Final Year/Passout**: +15 points
- **4+ Hours Availability**: +20 points
- **Internship Experience**: +20 points

### Auto-Status Logic

**Rejected** if:
- No programming languages selected
- No projects AND not ready to learn
- Only 2-3 hours/day AND only 1 month duration

**Shortlisted** if:
- Score >= 60 points

**Under Review**:
- All other applications

### Sheet Routing

1. **All applications** → `All_Applications` sheet
2. **Rejected applications** → `Rejected` sheet only
3. **Non-rejected applications** → Technology-specific sheets based on selected technologies

Example: If someone selects "Web Development" and "AI/ML", they'll appear in:
- All_Applications
- Web_Development
- AI_ML

## Testing

1. Fill out the form at your deployed URL
2. Check the Google Sheets - data should appear in real-time
3. Verify the application appears in the correct technology sheets
4. Check that the score and status are calculated correctly

## Support

For issues or questions, check the console logs in Vercel for detailed error messages.
