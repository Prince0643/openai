import express from "express";
import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
  BACKEND_API_KEY: dotenvResult.parsed?.BACKEND_API_KEY || process.env.BACKEND_API_KEY,
};

// Initialize GymMaster API client
let gymMaster = null;
if (config.GYMMASTER_API_KEY && config.GYMMASTER_BASE_URL) {
  gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
  console.log("GymMaster API client initialized successfully");
} else {
  console.log("GymMaster API client not initialized - missing configuration");
}

const app = express();
app.use(express.json());

// Simple authentication middleware
function requireBackendKey(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!config.BACKEND_API_KEY) {
    return next(); // No key required
  }
  
  if (auth !== `Bearer ${config.BACKEND_API_KEY}`) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  next();
}

// Simple webhook endpoint for Make.com
app.post("/simple-webhook", requireBackendKey, async (req, res) => {
  try {
    console.log("Received simple webhook request:", req.body);
    
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: true, message: "Message is required" });
    }
    
    // Simple keyword matching for class requests
    if (message.toLowerCase().includes("class") || message.toLowerCase().includes("schedule")) {
      // Handle class schedule request directly
      if (!gymMaster) {
        return res.status(500).json({ error: true, message: "GymMaster API not configured" });
      }
      
      try {
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        console.log("Fetching class schedule for:", today);
        
        // Get class schedule
        const schedule = await gymMaster.getClassSchedule(today);
        console.log("Retrieved", schedule.length, "classes");
        
        // Format a simple response
        let responseText = "Here are today's classes at Omni Kuta:\n\n";
        
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
        
        return res.json({
          response: responseText,
          userId: userId,
          success: true
        });
      } catch (gymError) {
        console.error("GymMaster API error:", gymError);
        return res.status(500).json({ 
          error: true, 
          message: "Cannot load schedule: " + gymError.message,
          userId: userId
        });
      }
    } else {
      // Simple response for other messages
      return res.json({
        response: "I received your message: " + message,
        userId: userId,
        success: true
      });
    }
  } catch (e) {
    console.error("Error processing webhook:", e);
    return res.status(500).json({ 
      error: true, 
      message: "Failed to process webhook: " + e.message,
      userId: req.body.userId
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    gymmaster: !!gymMaster
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple webhook server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/simple-webhook`);
});