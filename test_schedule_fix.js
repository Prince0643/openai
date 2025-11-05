import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables
const dotenvResult = dotenv.config();

const BACKEND_API_KEY = dotenvResult.parsed?.BACKEND_API_KEY || process.env.BACKEND_API_KEY;
const PORT = parseInt(dotenvResult.parsed?.PORT || process.env.PORT) || 3000;

async function testScheduleFix() {
  try {
    console.log("Testing schedule fix...");
    
    // Test the tool-call endpoint directly with get_schedule_public
    const response = await fetch(`http://localhost:${PORT}/tool-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_API_KEY}`
      },
      body: JSON.stringify({
        tool_name: "get_schedule_public",
        tool_args: {
          date_from: new Date().toISOString().split('T')[0]
        }
      })
    });
    
    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(result, null, 2));
    
    if (result.classes && result.classes.length > 0) {
      console.log("✅ Fix successful! Found", result.classes.length, "classes");
      console.log("First class:", result.classes[0].name);
    } else {
      console.log("❌ Fix not working - no classes found");
    }
    
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testScheduleFix();