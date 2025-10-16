import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
};

console.log("Configuration:");
console.log("GYMMASTER_API_KEY:", config.GYMMASTER_API_KEY ? "SET" : "NOT SET");
console.log("GYMMASTER_BASE_URL:", config.GYMMASTER_BASE_URL);

if (!config.GYMMASTER_API_KEY || !config.GYMMASTER_BASE_URL) {
  console.error("Missing required configuration. Please check your .env file.");
  process.exit(1);
}

async function testGymMasterSchedule() {
  try {
    console.log("\n=== Testing GymMaster API Integration ===");
    
    const gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    console.log("GymMaster API client initialized successfully");
    
    // Test 1: Get today's schedule
    console.log("\n--- Test 1: Get today's schedule ---");
    const today = new Date().toISOString().split('T')[0];
    console.log("Requesting schedule for:", today);
    
    const schedule = await gymMaster.getClassSchedule(today);
    console.log("Schedule retrieved successfully:");
    console.log(JSON.stringify(schedule, null, 2));
    
    // Test 2: Get schedule with different date formats
    console.log("\n--- Test 2: Get schedule with 'today' string ---");
    const schedule2 = await gymMaster.getClassSchedule("today");
    console.log("Schedule retrieved successfully:");
    console.log(JSON.stringify(schedule2, null, 2));
    
    console.log("\n=== All tests completed successfully ===");
    
  } catch (error) {
    console.error("Test failed with error:", error);
    console.error("Error stack:", error.stack);
  }
}

// Run the test
testGymMasterSchedule();