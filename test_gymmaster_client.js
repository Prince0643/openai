import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
};

async function testGymMasterClient() {
  try {
    console.log("Testing GymMaster API client...");
    
    if (!config.GYMMASTER_API_KEY || !config.GYMMASTER_BASE_URL) {
      console.error("Missing GymMaster configuration");
      process.exit(1);
    }
    
    const gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    console.log("GymMaster API client initialized");
    
    // Test 1: Call with no parameters (should work like your URL)
    console.log("\n=== Test 1: Call with no parameters ===");
    const schedule1 = await gymMaster.getClassSchedule();
    console.log("Retrieved", schedule1.length, "classes");
    
    if (schedule1.length > 0) {
      console.log("First class:");
      console.log(JSON.stringify(schedule1[0], null, 2));
    }
    
    // Test 2: Call with specific date
    console.log("\n=== Test 2: Call with specific date ===");
    const today = new Date().toISOString().split('T')[0];
    const schedule2 = await gymMaster.getClassSchedule(today);
    console.log("Retrieved", schedule2.length, "classes");
    
    // Test 3: Call with date and companyId
    console.log("\n=== Test 3: Call with date and companyId ===");
    const schedule3 = await gymMaster.getClassSchedule(today, "2");
    console.log("Retrieved", schedule3.length, "classes");
    
    console.log("\n=== All tests completed successfully ===");
    
  } catch (error) {
    console.error("Test failed:", error);
    console.error("Error stack:", error.stack);
  }
}

testGymMasterClient();