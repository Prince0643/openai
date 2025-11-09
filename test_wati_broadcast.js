import dotenv from 'dotenv';
import { sendWatiBroadcast } from './watiBroadcast.js';

// Load environment variables
const dotenvResult = dotenv.config();

async function testWatiBroadcast() {
  console.log("Testing Wati broadcast integration...\n");
  
  // Test sending a broadcast
  console.log("=== Test: Sending broadcast via Wati API ===");
  
  try {
    const result = await sendWatiBroadcast("test_template_001", ["user_001", "user_002"]);
    
    if (result.success) {
      console.log("✅ Broadcast sent successfully!");
      console.log(`Message: ${result.message}`);
      console.log(`Recipients: ${result.recipients}`);
      console.log(`Template ID: ${result.templateId}`);
    } else {
      console.log("❌ Broadcast failed:");
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Test failed with exception:", error.message);
  }
  
  console.log("\n=== Test completed ===");
}

testWatiBroadcast();