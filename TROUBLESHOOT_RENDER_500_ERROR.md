# Troubleshooting 500 Internal Server Error on Render Deployment

This guide will help you resolve the 500 Internal Server Error you're experiencing with your Render deployment.

## Current Status Analysis

Based on your testing:
- Simple messages like "hi" work correctly
- Complex requests like "show me the available classes" cause 500 errors

This tells us that the basic webhook endpoint is working, but there's an issue when the OpenAI assistant tries to call tools that interact with the GymMaster API.

## Identified Issue: GymMaster API Integration Problems

When you ask for "available classes", the OpenAI assistant tries to call the `get_schedule_public` tool, which requires calling the GymMaster API. The 500 error occurs during this process.

## Solution: Add Better Error Handling and Logging

Let's modify your application to add better error handling and logging to identify the exact issue:

1. **Add detailed logging to the tool-call endpoint** in [openaitomanychat.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js):

Find the tool-call endpoint (around line 414) and add more detailed logging:

```javascript
// New endpoint: Handle tool calls from OpenAI Assistant
app.post("/tool-call", requireBackendKey, async (req, res) => {
  try {
    const { tool_name, tool_args } = req.body;
    
    console.log(`Handling tool call: ${tool_name}`, JSON.stringify(tool_args, null, 2));
    
    // Route to appropriate tool handler
    switch (tool_name) {
      case "get_schedule_public":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster getClassSchedule with:", tool_args.date_from, tool_args.branchId);
          const schedule = await gymMaster.getClassSchedule(tool_args.date_from, tool_args.branchId);
          console.log("GymMaster response:", JSON.stringify(schedule, null, 2));
          return res.json(schedule);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot load schedule: " + e.message });
        }
```

2. **Add date format validation** to the GymMaster API calls:

In [gymmaster.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/gymmaster.js), modify the `getClassSchedule` method to ensure proper date formatting:

```javascript
/**
 * Get class schedule
 * GET /portal/api/v1/booking/classes/schedule
 */
async getClassSchedule(week, companyId = null) {
  // Ensure week is in YYYY-MM-DD format
  let formattedWeek = week;
  if (week && !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
    // If not in correct format, try to convert
    try {
      const date = new Date(week);
      formattedWeek = date.toISOString().split('T')[0];
    } catch (e) {
      // If conversion fails, use today's date
      formattedWeek = new Date().toISOString().split('T')[0];
    }
  }
  
  // If no week provided, use today
  if (!formattedWeek) {
    formattedWeek = new Date().toISOString().split('T')[0];
  }
  
  const params = new URLSearchParams({
    api_key: this.apiKey,
    week: formattedWeek
  });
  
  if (companyId) {
    params.append('companyid', companyId);
  }
  
  console.log(`Calling GymMaster API with week: ${formattedWeek}`);
  const response = await this.makeRequest(`/portal/api/v1/booking/classes/schedule?${params.toString()}`, {
    method: 'GET'
  });
  
  return response.result.map(classItem => ({
    classId: classItem.id,
    name: classItem.bookingname || classItem.name,
    coach: classItem.staffname || null,
    branch: classItem.companyname || null,
    start: `${classItem.arrival_iso}T${classItem.starttime}`,
    end: `${classItem.arrival_iso}T${classItem.endtime}`,
    seatsAvailable: classItem.spacesfree
  }));
}
```

## Immediate Action Items

1. **Check Render logs** for specific error messages when requesting class schedules
2. **Add the enhanced logging** as shown above to identify the exact point of failure
3. **Test with a specific date** like "show me classes for 2025-10-16" to see if date formatting is the issue

## Alternative Testing

Try asking the assistant more specific questions like:
- "What classes are available today?" (instead of "show me the available classes")
- "What classes are available on 2025-10-16?"

This will help determine if the issue is with how the assistant interprets your request or with the actual API calls.

## If Issues Persist

1. **Run the test script** to verify GymMaster API connectivity:
   ```bash
   node test_integrations.js
   ```

2. **Check your GymMaster API key** and base URL are correct
3. **Verify the GymMaster API is accessible** from Render (some APIs have IP restrictions)

The most likely cause is that the assistant is sending an invalid date format to the GymMaster API when trying to fetch class schedules.