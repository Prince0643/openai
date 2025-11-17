# FAQ Integration Instructions

This document provides instructions on how to integrate the Google Sheets FAQ functionality into your chatbot system.

## Overview

The FAQ system works by:
1. Fetching FAQ data from your Google Sheet
2. Matching user questions against the FAQ database
3. Returning predefined responses for matched questions
4. Escalating unmatched questions to human agents

## Files Created

1. `faqManager.js` - Handles fetching and matching FAQ data from Google Sheets
2. `faqMiddleware.js` - Middleware function for processing FAQ requests
3. `test_faq.js` - Test script to verify FAQ functionality

## Integration Steps

To integrate the FAQ functionality into your webhook handler (`openaitomanychat.js`), follow these steps:

### 1. Import the FAQ Middleware

Add this import statement near the top of your `openaitomanychat.js` file:

```javascript
import { handleFAQRequest } from "./faqMiddleware.js";
```

### 2. Add FAQ Processing to the Webhook Handler

In the `/make/webhook` endpoint, after validating the message but before any other processing, add the following code:

```javascript
// First, check if the question is in our FAQ database
const faqResponse = await handleFAQRequest(message, userId, platform);
if (faqResponse) {
  // Found an FAQ match or escalated to human agent
  return res.json(faqResponse);
}
```

This code should be placed right after the message validation block:

```javascript
if (!message || message.trim() === "") {
  return res.status(400).json({ error: true, message: "Message is required" });
}
```

And before the existing class request handling:

```javascript
// Check if this is a specific class request that we can handle directly
```

### 3. Test the Integration

Run the test script to verify the FAQ functionality:

```bash
npm run test:faq
```

## How It Works

1. When a user sends a message, the system first checks if it matches any FAQ in your Google Sheet
2. If a match is found (with >= 70% similarity), the predefined response from the sheet is returned
3. If no match is found, the system creates a ticket for a human agent and responds with a message indicating that escalation has occurred
4. All FAQ data is cached for 5 minutes to reduce API calls to Google Sheets

## Customization

You can adjust the similarity threshold in `faqManager.js` by modifying the value in this line:

```javascript
if (similarity > bestSimilarity && similarity >= 0.7) {
```

Lower values (e.g., 0.5) will result in more matches but potentially less accurate ones.
Higher values (e.g., 0.9) will result in fewer but more precise matches.

## Troubleshooting

If you encounter issues:

1. Verify that your Google Sheet is accessible and published
2. Check that the sheet contains the expected columns: No, Question, Platform, Reply
3. Ensure your environment has internet access to reach Google Sheets
4. Check the console logs for any error messages

## Example Usage

After integration, when a user asks "What types of classes do you offer?", they will receive the predefined response from your Google Sheet rather than going through the AI assistant.