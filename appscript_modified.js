/************** CONFIG **************/
const GM_BASE_URL = 'https://omni.gymmasteronline.com/';
const GM_API_KEY  = '1db1f20df37d8af92da68c0fe5f36fcd'; // 1db1f20df37d8af92da68c0fe5f36fcd 309b28e47ec3126feab3f4319c8ed8e5

const GM_REPORT_ID_ALL_BOOKINGS = 9; // "All Bookings" report

const SHEET_ID   = '1SJ3SV9zpBZPOFXSaDhOoxILJ__-NfLwyuypE1ECTRIk';
const SHEET_NAME = 'Users';

// 👉 Start date: NOVEMBER 1, 2025
const GM_FULL_IMPORT_START = '2025-11-01';
const GM_CHUNK_DAYS = 7;

/************** NEW FUNCTION FOR USER LOGGING **************/
function doPost(e) {
  try {
    // Parse the JSON data sent from your application
    const data = JSON.parse(e.postData.contents);
    
    // Check if it's a user logging action
    if (data.action === "log_user") {
      // Open the spreadsheet by ID
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      // Add a new row with the user data
      const timestamp = new Date();
      sheet.appendRow([
        timestamp,
        data.userId,
        data.platform,
        data.threadId,
        data.message,
        data.source,
        JSON.stringify(data.extra)
      ]);
      
      // Return a success response
      return ContentService.createTextOutput("User logged successfully");
    }
    
    // Return a default response for other actions
    return ContentService.createTextOutput("Action not recognized");
  } catch (error) {
    // Return an error response
    return ContentService.createTextOutput("Error: " + error.toString());
  }
}
