/**
 * ================================================================
 * LAND SERVICE KZN NATIONAL CAMP 2026
 * Google Apps Script — Sheets Integration
 * ================================================================
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new spreadsheet.
 * 2. Rename Sheet1 → "Sign Ins", add Sheet2 → "Feedback"
 * 3. Click Extensions → Apps Script
 * 4. Paste this entire script, replacing the default code
 * 5. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL
 * 7. In index.html, replace YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 *    with that URL
 * 8. Also replace YOUR_GOOGLE_SHEET_LINK_HERE in the HTML with
 *    the URL of your Google Sheet
 * ================================================================
 */

const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // From the sheet URL

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.type === 'signin') {
      handleSignIn(ss, data);
    } else if (data.type === 'feedback') {
      handleFeedback(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleSignIn(ss, data) {
  let sheet = ss.getSheetByName('Sign Ins');
  if (!sheet) {
    sheet = ss.insertSheet('Sign Ins');
    // Add header row
    sheet.appendRow([
      'Timestamp',
      'Full Name',
      'Region / Group',
      'Role',
      'Contact Number',
      'Emergency Contact',
      'Dietary / Medical Notes'
    ]);
    // Style header
    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setBackground('#1a4731');
    headerRange.setFontColor('#c9a227');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(data.timestamp).toLocaleString('en-ZA'),
    data.name || '',
    data.region || '',
    data.role || '',
    data.phone || '',
    data.emergency || '',
    data.medical || ''
  ]);
}

function handleFeedback(ss, data) {
  let sheet = ss.getSheetByName('Feedback');
  if (!sheet) {
    sheet = ss.insertSheet('Feedback');
    // Add header row
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Group / Region',
      'Overall Rating',
      'Programme Rating',
      'Arts & Crafts Rating',
      'Accommodation Rating',
      'Enjoyed Most',
      'Improvements',
      'Additional Comments',
      'Would Attend Again'
    ]);
    // Style header
    const headerRange = sheet.getRange(1, 1, 1, 11);
    headerRange.setBackground('#1a4731');
    headerRange.setFontColor('#c9a227');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(data.timestamp).toLocaleString('en-ZA'),
    data.name || 'Anonymous',
    data.group || '',
    data.ratings.overall || '',
    data.ratings.programme || '',
    data.ratings.crafts || '',
    data.ratings.accom || '',
    data.enjoyed || '',
    data.improvements || '',
    data.comments || '',
    data.wouldReturn || ''
  ]);
}

// Test function — run this in Apps Script to verify the sheet connection
function testSetup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log('Connected to: ' + ss.getName());
  Logger.log('Sheets: ' + ss.getSheets().map(s => s.getName()).join(', '));
}
