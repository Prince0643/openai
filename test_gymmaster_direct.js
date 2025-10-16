import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
};

async function testGymMasterDirect() {
  try {
    console.log("Testing GymMaster API directly...");
    
    if (!config.GYMMASTER_API_KEY || !config.GYMMASTER_BASE_URL) {
      console.error("Missing GymMaster configuration");
      process.exit(1);
    }
    
    const gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    console.log("GymMaster API client initialized");
    
    const today = new Date().toISOString().split('T')[0];
    console.log("Fetching schedule for:", today);
    
    const schedule = await gymMaster.getClassSchedule(today);
    console.log("Retrieved", schedule.length, "classes");
    
    // Format a simple response
    let responseText = "Today's classes at Omni Kuta:\n\n";
    
    if (schedule.length === 0) {
      responseText += "No classes scheduled for today.";
    } else {
      // Sort by start time
      schedule.sort((a, b) => a.start.localeCompare(b.start));
      
      // Format classes
      for (const classItem of schedule) {
        const startTime = classItem.start.split('T')[1].substring(0, 5);
        responseText += `${startTime} - ${classItem.name}`;
        if (classItem.coach) {
          responseText += ` (${classItem.coach})`;
        }
        responseText += ` - Seats: ${classItem.seatsAvailable}\n`;
      }
    }
    
    console.log("Formatted response:");
    console.log(responseText);
    
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    console.error("Error stack:", error.stack);
  }
}

testGymMasterDirect();