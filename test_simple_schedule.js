import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
};

async function testSimpleSchedule() {
  try {
    console.log("=== Testing GymMaster Schedule API ===");
    
    const gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    
    // Get today's schedule
    const today = new Date().toISOString().split('T')[0];
    console.log("Requesting schedule for:", today);
    
    const schedule = await gymMaster.getClassSchedule(today);
    console.log("Number of classes found:", schedule.length);
    
    // Show first 3 classes
    console.log("\nFirst 3 classes:");
    schedule.slice(0, 3).forEach((classItem, index) => {
      console.log(`${index + 1}. ${classItem.name} at ${classItem.start} (${classItem.seatsAvailable} seats available)`);
    });
    
    console.log("\n=== Test completed successfully ===");
    
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run the test
testSimpleSchedule();