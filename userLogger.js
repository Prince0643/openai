// userLogger.js
// Logs user data by sending it to a Google Apps Script Web App,
// which will then write to the "Users" sheet.

import fetch from "node-fetch"; // make sure node-fetch is installed: npm install node-fetch

// Put your Apps Script Web App URL here
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyl_iDWLTrJJ6rtSywWuxABC2j7k5zcRDQBoYPlHUbptn01nqPcOu05NytKnAnHca-VKA/exec";

/**
 * Log user data into the "Users" sheet via Apps Script.
 *
 * Suggested "Users" sheet columns:
 *  A: Timestamp
 *  B: User ID
 *  C: Platform
 *  D: Thread ID
 *  E: Message
 *  F: Source
 *  G: Extra JSON
 */
export async function logUserToSheet({
  userId = "",
  platform = "",
  threadId = "",
  message = "",
  source = "make_webhook",
  extra = {}
} = {}) {
  if (!APPS_SCRIPT_URL) {
    console.error("[userLogger] APPS_SCRIPT_URL is not set.");
    return;
  }

  const payload = {
    action: "log_user", // so Apps Script knows what to do
    userId,
    platform,
    threadId,
    message,
    source,
    extra,
  };

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[userLogger] Failed to log user. Status:", res.status, "Body:", text);
      return;
    }

    const data = await res.text(); // or res.json() if your Apps Script returns JSON
    console.log("[userLogger] Logged user to sheet via Apps Script:", data);
  } catch (err) {
    console.error("[userLogger] Error calling Apps Script:", err);
  }
}
