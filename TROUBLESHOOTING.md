# Troubleshooting Google Sheets Integration

## Common Issues and Solutions

### 1. "Permission denied to access Google Sheet" (403 Error)

**Solution:** Share your Google Sheet with the service account email.

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s/edit
2. Click the "Share" button in the top right
3. Add this email with **Editor** access: `internship-progam@finonest-salew.iam.gserviceaccount.com`
4. Click "Send"

### 2. "Google Sheet not found" (404 Error)

**Solution:** Verify the Sheet ID is correct.

The Sheet ID should be: `1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s`

Check your environment variables to make sure `GOOGLE_SHEET_ID` matches this value.

### 3. "Missing environment variables"

**Solution:** Ensure all required environment variables are set.

Required variables:
- `GOOGLE_PROJECT_ID`
- `GOOGLE_PRIVATE_KEY_ID`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_SHEET_ID`

### 4. Private Key Format Issues

The `GOOGLE_PRIVATE_KEY` must include newline characters. In Vercel, set it exactly as it appears in your JSON file, including the `\n` characters.

### 5. Check Server Logs

The API now provides detailed logging. Check your console/server logs for messages starting with `[v0]` to see exactly where the error occurs:

- `[v0] Creating Google Sheets client...` - Client initialization
- `[v0] Testing connection to Google Sheet...` - Connection test
- `[v0] ✓ Successfully connected to sheet:` - Connection successful
- `[v0] ✗ Failed to connect to sheet:` - Connection failed (see error details)

### 6. Test the Connection

The API now tests the connection before attempting to write data. If you see a specific error code:

- **403**: Permission issue - share the sheet with the service account
- **404**: Sheet not found - verify the sheet ID
- **401**: Authentication issue - check the service account credentials

### Quick Checklist

- [ ] Sheet is shared with `internship-progam@finonest-salew.iam.gserviceaccount.com`
- [ ] Service account has **Editor** (not Viewer) permissions
- [ ] All environment variables are set in Vercel
- [ ] Sheet ID is correct: `1cmBFGA6ZFoDGxtV-t5cJDCnyML5mHcGGe1tjwX6qn7s`
- [ ] Private key includes `\n` characters for line breaks
