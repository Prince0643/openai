import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import OpenAI from "openai";
import GymMasterAPI from "./gymmaster.js";
import { getUserThread, setUserThread } from "./threadStorage.js";
import { 
  addTemplate, 
  approveTemplate, 
  isTemplateApproved, 
  optInUser, 
  optOutUser, 
  isUserOptedIn, 
  getOptedInUsers, 
  sendBroadcast 
} from "./broadcastManager.js";
import { createTicket } from "./staffHandoffManager.js";
import { handleFallback, handleToolError } from "./fallbackManager.js";
import { 
  handleRefundsGuardrail, 
  isAskingAboutRefunds, 
  handleRefundInquiry 
} from "./refundsGuardrail.js";

// Load environment variables
const dotenvResult = dotenv.config();

// Use parsed variables directly to avoid environment variable issues
const config = {
  BACKEND_API_KEY: dotenvResult.parsed?.BACKEND_API_KEY || process.env.BACKEND_API_KEY,
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
  OPENAI_API_KEY: dotenvResult.parsed?.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  PORT: parseInt(dotenvResult.parsed?.PORT || process.env.PORT) || 8080
};

const app = express();
// Add proper JSON parsing with character encoding handling
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json'
}));

// Add URL encoding middleware
app.use(express.urlencoded({ extended: true }));

// Add CORS headers for Make.com integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const BACKEND_API_KEY = config.BACKEND_API_KEY;
const GYMMASTER_API_KEY = config.GYMMASTER_API_KEY;
const GYMMASTER_BASE_URL = config.GYMMASTER_BASE_URL;
const OPENAI_API_KEY = config.OPENAI_API_KEY;

// Validate required environment variables (using our config, not process.env)
if (!BACKEND_API_KEY) {
  console.error("Missing BACKEND_API_KEY in environment variables");
  console.log("Please check your .env file and make sure it contains BACKEND_API_KEY");
  // process.exit(1); // Not exiting to allow server to start for health checks
}

if (!GYMMASTER_API_KEY) {
  console.error("Missing GYMMASTER_API_KEY in environment variables");
  console.log("Please check your .env file and make sure it contains GYMMASTER_API_KEY");
  // process.exit(1); // Not exiting to allow server to start for health checks
}

if (!GYMMASTER_BASE_URL) {
  console.error("Missing GYMMASTER_BASE_URL in environment variables");
  console.log("Please check your .env file and make sure it contains GYMMASTER_BASE_URL");
  // process.exit(1); // Not exiting to allow server to start for health checks
}

// Initialize GymMaster API client (if we have the required keys)
let gymMaster = null;
if (GYMMASTER_API_KEY && GYMMASTER_BASE_URL) {
  gymMaster = new GymMasterAPI(GYMMASTER_API_KEY, GYMMASTER_BASE_URL);
  console.log("GymMaster API client initialized successfully");
} else {
  console.log("GymMaster API client not initialized - missing configuration");
}

// Initialize OpenAI client
let openai = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
  console.log("OpenAI client initialized successfully");
} else {
  console.log("OpenAI client not initialized - missing API key");
}

function requireBackendKey(req, res, next) {
  // If no backend key is configured, allow all requests (for development)
  if (!BACKEND_API_KEY) {
    return next();
  }
  
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${BACKEND_API_KEY}`) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
  next();
}

// Health check endpoint
app.get("/health", (req, res) => {
  const configStatus = {
    gymmaster: !!(GYMMASTER_API_KEY && GYMMASTER_BASE_URL),
    backendKey: !!BACKEND_API_KEY,
    openai: !!OPENAI_API_KEY
  };
  
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    config: configStatus,
    env: {
      GYMMASTER_API_KEY: GYMMASTER_API_KEY ? "SET" : "NOT SET",
      GYMMASTER_BASE_URL: GYMMASTER_BASE_URL ? "SET" : "NOT SET",
      BACKEND_API_KEY: BACKEND_API_KEY ? "SET" : "NOT SET",
      OPENAI_API_KEY: OPENAI_API_KEY ? "SET" : "NOT SET"
    }
  });
});

// member_login
app.post("/member/login", async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }
    
    // Password is optional for passwordless login
    const loginResult = await gymMaster.loginMember(email, password || "");
    
    return res.json(loginResult);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Login failed: " + e.message });
  }
});

// find_or_create_member
app.post("/find_or_create_member", requireBackendKey, async (req, res) => {
  try {
    const { email, phone, name } = req.body;
    
    if (!email || !phone) {
      return res.status(400).json({ error: true, message: "Email and phone are required" });
    }
    
    // In a real implementation, you would check if the member exists
    // and create them if they don't. For now, we'll just return a mock memberId.
    // A full implementation would use the GymMaster member APIs.
    const memberId = "mem_" + Date.now();
    
    return res.json({ memberId });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Member lookup failed: " + e.message });
  }
});

// schedule/public
app.get("/schedule/public", async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { date_from, date_to, branchId } = req.query;
    
    // Use date_from or default to current date
    const week = date_from || new Date().toISOString().split('T')[0];
    
    const schedule = await gymMaster.getClassSchedule(week, branchId);
    
    return res.json(schedule);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot load schedule: " + e.message });
  }
});

// get_class_seats
app.get("/class/seats/:classId", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { classId } = req.params;
    const { token } = req.query;
    
    if (!classId) {
      return res.status(400).json({ error: true, message: "classId is required" });
    }
    
    const seats = await gymMaster.getClassSeats(classId, token);
    
    return res.json(seats);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot get class seats: " + e.message });
  }
});

// book_class
app.post("/book/class", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { memberId, classId, token } = req.body;
    
    if (!memberId || !classId || !token) {
      return res.status(400).json({ error: true, message: "memberId, classId, and token are required" });
    }
    
    const booking = await gymMaster.bookClass(token, classId);
    
    return res.json(booking);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot book class: " + e.message });
  }
});

// cancel_booking
app.post("/cancel/booking", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { bookingId, token } = req.body;
    
    if (!bookingId || !token) {
      return res.status(400).json({ error: true, message: "bookingId and token are required" });
    }
    
    const cancellation = await gymMaster.cancelBooking(token, bookingId);
    
    return res.json(cancellation);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot cancel booking: " + e.message });
  }
});

// get_member_memberships
app.get("/member/:memberId/memberships", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { memberId } = req.params;
    const { token } = req.query;
    
    if (!memberId) {
      return res.status(400).json({ error: true, message: "memberId is required" });
    }
    
    if (!token) {
      return res.status(400).json({ error: true, message: "token is required" });
    }
    
    const memberships = await gymMaster.getMemberMemberships(token);
    
    return res.json(memberships);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot get memberships: " + e.message });
  }
});

// get_member_profile
app.get("/member/:memberId/profile", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { memberId } = req.params;
    const { token } = req.query;
    
    if (!memberId) {
      return res.status(400).json({ error: true, message: "memberId is required" });
    }
    
    if (!token) {
      return res.status(400).json({ error: true, message: "token is required" });
    }
    
    const profile = await gymMaster.getMemberProfile(token);
    
    return res.json(profile);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot get profile: " + e.message });
  }
});

// save_lead
app.post("/save/lead", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const { name, phone, email, interest } = req.body;
    
    if (!name || !phone || !email || !interest) {
      return res.status(400).json({ error: true, message: "name, phone, email, and interest are required" });
    }
    
    const lead = await gymMaster.createProspect(name, email, phone, interest);
    
    return res.json(lead);
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot save lead: " + e.message });
  }
});

// list_catalog
app.get("/catalog", requireBackendKey, async (req, res) => {
  try {
    if (!gymMaster) {
      return res.status(500).json({ error: true, message: "GymMaster API not configured" });
    }
    
    const memberships = await gymMaster.listMemberships();
    const clubs = await gymMaster.listClubs();
    
    return res.json({
      memberships: memberships,
      clubs: clubs
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Cannot list catalog: " + e.message });
  }
});

// New endpoint: Process user message with OpenAI Assistant
app.post("/process-message", requireBackendKey, async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ error: true, message: "OpenAI not configured" });
    }
    
    const { message, threadId, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: true, message: "Message is required" });
    }
    
    let thread;
    
    // Create or retrieve thread
    if (threadId) {
      // Retrieve existing thread
      thread = await openai.beta.threads.retrieve(threadId);
    } else {
      // Create new thread
      thread = await openai.beta.threads.create();
    }
    
    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp" // Your assistant ID from openaiassistant.json
    });
    
    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    // Add timeout to prevent infinite waiting
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    if (runStatus.status === "failed") {
      return res.status(500).json({ error: true, message: "Assistant run failed" });
    }
    
    if (runStatus.status !== "completed") {
      return res.status(500).json({ error: true, message: "Assistant run timed out" });
    }
    
    // Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const latestMessage = messages.data[0];
    
    // Extract text from the response
    let responseText = "";
    if (latestMessage.content && latestMessage.content.length > 0) {
      responseText = latestMessage.content[0].text.value;
    }
    
    // Return response with thread ID for continuity
    return res.json({
      response: responseText,
      threadId: thread.id,
      userId: userId
    });
  } catch (e) {
    console.error("Error processing message:", e);
    return res.status(500).json({ error: true, message: "Failed to process message: " + e.message });
  }
});

// New endpoint: Handle tool calls from OpenAI Assistant
app.post("/tool-call", requireBackendKey, async (req, res) => {
  try {
    const { tool_name, tool_args } = req.body;
    
    console.log(`Handling tool call: ${tool_name}`, JSON.stringify(tool_args, null, 2));
    
    // Route to appropriate tool handler
    switch (tool_name) {
      case "member_login":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          const result = await gymMaster.loginMember(tool_args.email, tool_args.password || "");
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: true, message: "Login failed: " + e.message });
        }
        
      case "find_or_create_member":
        // In a real implementation, you would use GymMaster APIs
        return res.json({ memberId: "mem_" + Date.now() });
        
      case "get_schedule_public":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster getClassSchedule with:", tool_args.date_from, tool_args.branchId);
          
          // Use date_from or default to current date
          const week = tool_args.date_from || new Date().toISOString().split('T')[0];
          
          const schedule = await gymMaster.getClassSchedule(week, tool_args.branchId);
          console.log("GymMaster response:", JSON.stringify(schedule, null, 2));
          
          // Format the schedule data according to the new instructions
          const formattedSchedule = {
            classes: schedule, // Fix: schedule is already an array, not schedule.classes
            message: "Here are the available classes:",
            bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
          };
          
          return res.json(formattedSchedule);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot load schedule: " + e.message });
        }
        
      case "get_schedule":
        // This requires authentication, so we would need to implement token handling
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster getClassSchedule with:", tool_args.date_from, tool_args.branchId);
          
          // Use date_from or default to current date
          const week = tool_args.date_from || new Date().toISOString().split('T')[0];
          
          const schedule = await gymMaster.getClassSchedule(week, tool_args.branchId);
          console.log("GymMaster response:", JSON.stringify(schedule, null, 2));
          
          // Format the schedule data according to the new instructions
          const formattedSchedule = {
            classes: schedule, // Fix: schedule is already an array, not schedule.classes
            message: "Here are the available classes:",
            bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
          };
          
          return res.json(formattedSchedule);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot load schedule: " + e.message });
        }
        
      case "get_class_seats":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster getClassSeats with:", tool_args.classId);
          const seats = await gymMaster.getClassSeats(tool_args.classId);
          console.log("GymMaster response:", JSON.stringify(seats, null, 2));
          return res.json(seats);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot get class seats: " + e.message });
        }
        
      case "book_class":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          // Instead of actually booking, provide a booking link
          const { classId } = tool_args;
          // Generate a booking link - using your GymMaster portal URL
          const bookingLink = `https://omni.gymmasteronline.com/portal/account/book/class/?classId=${classId}`;
          
          // Return a response that includes the booking link
          const bookingResponse = {
            message: "Please use the link below to complete your booking:",
            bookingLink: bookingLink,
            classId: classId
          };
          
          return res.json(bookingResponse);
        } catch (e) {
          console.error("Error generating booking link:", e);
          return res.status(500).json({ error: true, message: "Cannot generate booking link: " + e.message });
        }
        
      case "cancel_booking":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster cancelBooking with:", tool_args.token, tool_args.bookingId);
          const cancellation = await gymMaster.cancelBooking(tool_args.token, tool_args.bookingId);
          console.log("GymMaster response:", JSON.stringify(cancellation, null, 2));
          return res.json(cancellation);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot cancel booking: " + e.message });
        }
        
      case "get_member_memberships":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster getMemberMemberships with:", tool_args.token);
          const memberships = await gymMaster.getMemberMemberships(tool_args.token);
          console.log("GymMaster response:", JSON.stringify(memberships, null, 2));
          return res.json(memberships);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot get memberships: " + e.message });
        }
        
      case "list_catalog":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster listMemberships");
          const memberships = await gymMaster.listMemberships();
          console.log("GymMaster listMemberships response:", JSON.stringify(memberships, null, 2));
          const clubs = await gymMaster.listClubs();
          console.log("GymMaster listClubs response:", JSON.stringify(clubs, null, 2));
          
          // Format the catalog data according to the new instructions
          const formattedCatalog = {
            memberships: memberships,
            clubs: clubs,
            message: "Here are our membership options:",
            bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
          };
          
          return res.json(formattedCatalog);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot list catalog: " + e.message });
        }
        
      case "save_lead":
        if (!gymMaster) {
          return res.status(500).json({ error: true, message: "GymMaster API not configured" });
        }
        try {
          console.log("Calling GymMaster createProspect with:", tool_args.name, tool_args.phone, tool_args.email, tool_args.interest);
          const lead = await gymMaster.createProspect(
            tool_args.name, 
            tool_args.phone, 
            tool_args.email, 
            tool_args.interest
          );
          console.log("GymMaster response:", JSON.stringify(lead, null, 2));
          
          // Format the lead response according to the new instructions
          const formattedLead = {
            success: true,
            message: "Thank you for your interest! Our team will contact you shortly.",
            leadId: lead.id || "lead_" + Date.now()
          };
          
          return res.json(formattedLead);
        } catch (e) {
          console.error("GymMaster API error:", e);
          return res.status(500).json({ error: true, message: "Cannot save lead: " + e.message });
        }
        
      case "handoff_to_staff":
        // Create a proper ticket in the support system with conversation context
        try {
          // Determine the category based on the message content
          let category = "unclear_request";
          if (tool_args.message && tool_args.message.toLowerCase().includes("lost")) {
            category = "lost_and_found";
          } else if (tool_args.message && tool_args.message.toLowerCase().includes("complaint")) {
            category = "complaint";
          } else if (tool_args.message && tool_args.message.toLowerCase().includes("refund")) {
            category = "refund_inquiry";
          }
          
          const ticket = createTicket({
            userId: tool_args.userId || "unknown_user",
            message: tool_args.message || "Assistant requested staff handoff",
            contactInfo: tool_args.contactInfo || { email: "not_provided", phone: "not_provided" },
            category: category,
            threadId: tool_args.threadId || null
          });
          
          const output = {
            ticketId: ticket.ticketId,
            message: "I've alerted our staff and created a ticket for you. Someone will reach out shortly."
          };
          
          return res.json(output);
        } catch (error) {
          console.error("Error creating staff ticket:", error);
          return res.status(500).json({ 
            error: true, 
            message: "Failed to create staff ticket: " + error.message 
          });
        }
        
      default:
        return res.status(400).json({ error: true, message: "Unknown tool: " + tool_name });
    }
  } catch (e) {
    console.error("Error handling tool call:", e);
    return res.status(500).json({ error: true, message: "Failed to handle tool call: " + e.message });
  }
});

// New endpoint: Receive data from Make.com and process it
app.post("/make/webhook", async (req, res) => {
  try {
    console.log("Received webhook from Make.com:", JSON.stringify(req.body, null, 2));
    
    let message, userId, threadId, platform;
    
    // Handle different payload formats
    if (Array.isArray(req.body) && req.body.length > 0) {
      // Wati format - array of messages
      const watiMessage = req.body[0];
      message = watiMessage.text || "";
      userId = watiMessage.waId || ""; // WhatsApp ID
      platform = "wati";
      threadId = watiMessage.conversationId || null; // Use conversationId if available
    } else if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
      // ManyChat format - object
      message = req.body.message || "";
      userId = req.body.userId || "";
      threadId = req.body.threadId || null;
      platform = req.body.platform || "manychat";
    } else {
      // Fallback - try to extract from any object structure
      message = "";
      userId = "";
      threadId = null;
      platform = "unknown";
      
      // Try to find message and userId in the body
      if (req.body && typeof req.body === 'object') {
        // Look for common message fields
        message = req.body.text || req.body.message || req.body.content || "";
        // Look for common user ID fields
        userId = req.body.waId || req.body.userId || req.body.senderId || req.body.from || "";
        
        // Determine platform based on fields present
        if (req.body.waId) {
          platform = "wati";
        } else if (req.body.userId) {
          platform = req.body.platform || "manychat";
        }
      }
    }
    
    console.log(`Parsed payload - Message: "${message}", UserId: "${userId}", Platform: "${platform}"`);
    
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: true, message: "Message is required" });
    }
    
    // Process the message through OpenAI if configured
    if (openai) {
      try {
        let thread;
        
        // Check if we have a stored thread ID for this user
        let storedThreadId = getUserThread(userId);
        
        // If we have a stored thread ID, try to retrieve it
        if (storedThreadId) {
          try {
            thread = await openai.beta.threads.retrieve(storedThreadId);
            console.log(`Retrieved existing thread for user ${userId}: ${storedThreadId}`);
          } catch (retrieveError) {
            console.log(`Failed to retrieve stored thread ${storedThreadId}, creating new one`);
            storedThreadId = null;
          }
        }
        
        // If we don't have a stored thread ID or failed to retrieve it, create a new one
        if (!storedThreadId) {
          thread = await openai.beta.threads.create();
          setUserThread(userId, thread.id);
          console.log(`Created new thread for user ${userId}: ${thread.id}`);
        }
        
        // Add message to thread
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: message
        });
        
        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp" // Your assistant ID from openaiassistant.json
        });
        
        // Wait for completion with timeout and handle tool calls
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        const maxWaitTime = 60000; // 60 seconds
        const startTime = Date.now();
        
        while (runStatus.status !== "completed" && runStatus.status !== "failed" && (Date.now() - startTime) < maxWaitTime) {
          // Handle tool calls if required
          if (runStatus.status === "requires_action" && runStatus.required_action) {
            console.log("Handling tool calls for run:", run.id);
            
            const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
            const toolOutputs = [];
            
            for (const toolCall of toolCalls) {
              const functionName = toolCall.function.name;
              const functionArgs = JSON.parse(toolCall.function.arguments);
              
              console.log(`Calling tool: ${functionName}`, functionArgs);
              
              try {
                let output;
                switch (functionName) {
                  case "member_login":
                    if (gymMaster) {
                      const result = await gymMaster.loginMember(functionArgs.email, functionArgs.password || "");
                      output = JSON.stringify(result);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "find_or_create_member":
                    // In a real implementation, you would use GymMaster APIs
                    output = JSON.stringify({ memberId: "mem_" + Date.now() });
                    break;
                    
                  case "get_schedule_public":
                    if (gymMaster) {
                      // For get_schedule_public, we need to handle the parameters correctly
                      // The assistant sends date_from, date_to, and branchId (optional)
                      const date_from = functionArgs.date_from;
                      const date_to = functionArgs.date_to;
                      const branchId = functionArgs.branchId;
                      
                      // Validate the date - if it's too old, use today's date instead
                      let weekParam = date_from;
                      const today = new Date();
                      const requestedDate = new Date(date_from);
                      
                      // If the requested date is more than a few days in the past, use today
                      if (requestedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)) {
                        console.log("Requested date is too old, using today's date instead");
                        weekParam = today.toISOString().split('T')[0];
                      }
                      
                      // If no date provided, use today's date
                      if (!weekParam) {
                        weekParam = today.toISOString().split('T')[0];
                      }
                      
                      const schedule = await gymMaster.getClassSchedule(weekParam, branchId);
                      
                      // Format the schedule data according to the new instructions
                      const formattedSchedule = {
                        classes: schedule, // Fix: schedule is already an array, not schedule.classes
                        message: "Here are the available classes:",
                        bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/schedule"
                      };
                      
                      output = JSON.stringify(formattedSchedule);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "get_schedule":
                    if (gymMaster) {
                      // For get_schedule, we need to handle the parameters correctly
                      // The assistant sends date_from, date_to, and branchId (optional)
                      const date_from = functionArgs.date_from;
                      const date_to = functionArgs.date_to;
                      const branchId = functionArgs.branchId;
                      
                      // Validate the date - if it's too old, use today's date instead
                      let weekParam = date_from;
                      const today = new Date();
                      const requestedDate = new Date(date_from);
                      
                      // If the requested date is more than a few days in the past, use today
                      if (requestedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)) {
                        console.log("Requested date is too old, using today's date instead");
                        weekParam = today.toISOString().split('T')[0];
                      }
                      
                      // If no date provided, use today's date
                      if (!weekParam) {
                        weekParam = today.toISOString().split('T')[0];
                      }
                      
                      const schedule = await gymMaster.getClassSchedule(weekParam, branchId);
                      
                      // Format the schedule data according to the new instructions
                      const formattedSchedule = {
                        classes: schedule, // Fix: schedule is already an array, not schedule.classes
                        message: "Here are the available classes:",
                        bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
                      };
                      
                      output = JSON.stringify(formattedSchedule);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "get_class_seats":
                    if (gymMaster) {
                      const seats = await gymMaster.getClassSeats(functionArgs.classId);
                      output = JSON.stringify(seats);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "book_class":
                    if (gymMaster) {
                      try {
                        const { classId } = functionArgs;
                        // Generate a booking link - using your GymMaster portal URL
                        const bookingLink = `https://omni.gymmasteronline.com/portal/account/book/class/?classId=${classId}`;
                        
                        // Return a response that includes the booking link
                        const bookingResponse = {
                          message: "Please use the link below to complete your booking:",
                          bookingLink: bookingLink,
                          classId: classId
                        };
                        
                        output = JSON.stringify(bookingResponse);
                      } catch (e) {
                        console.error("Error generating booking link:", e);
                        output = JSON.stringify({ error: true, message: "Cannot generate booking link: " + e.message });
                      }
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "cancel_booking":
                    if (gymMaster) {
                      const cancellation = await gymMaster.cancelBooking(functionArgs.token, functionArgs.bookingId);
                      output = JSON.stringify(cancellation);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "get_member_memberships":
                    if (gymMaster) {
                      const memberships = await gymMaster.getMemberMemberships(functionArgs.token);
                      output = JSON.stringify(memberships);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "list_catalog":
                    if (gymMaster) {
                      const memberships = await gymMaster.listMemberships();
                      const clubs = await gymMaster.listClubs();
                      
                      // Format the catalog data according to the new instructions
                      const formattedCatalog = {
                        memberships: memberships,
                        clubs: clubs,
                        message: "Here are our membership options:",
                        bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
                      };
                      
                      output = JSON.stringify(formattedCatalog);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "save_lead":
                    if (gymMaster) {
                      const lead = await gymMaster.createProspect(
                        functionArgs.name, 
                        functionArgs.phone, 
                        functionArgs.email, 
                        functionArgs.interest
                      );
                      
                      // Format the lead response according to the new instructions
                      const formattedLead = {
                        success: true,
                        message: "Thank you for your interest! Our team will contact you shortly.",
                        leadId: lead.id || "lead_" + Date.now()
                      };
                      
                      output = JSON.stringify(formattedLead);
                    } else {
                      output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                    }
                    break;
                    
                  case "handoff_to_staff":
                    // Create a proper ticket in the support system with conversation context
                    try {
                      // Determine the category based on the message content
                      let category = "unclear_request";
                      if (functionArgs.message && functionArgs.message.toLowerCase().includes("lost")) {
                        category = "lost_and_found";
                      } else if (functionArgs.message && functionArgs.message.toLowerCase().includes("complaint")) {
                        category = "complaint";
                      } else if (functionArgs.message && functionArgs.message.toLowerCase().includes("refund")) {
                        category = "refund_inquiry";
                      }
                      
                      const ticket = createTicket({
                        userId: functionArgs.userId || "unknown_user",
                        message: functionArgs.message || "Assistant requested staff handoff",
                        contactInfo: functionArgs.contactInfo || { email: "not_provided", phone: "not_provided" },
                        category: category,
                        threadId: functionArgs.threadId || null
                      });
                      
                      const staffResponse = {
                        ticketId: ticket.ticketId,
                        message: "I've alerted our staff and created a ticket for you. Someone will reach out shortly."
                      };
                      
                      output = JSON.stringify(staffResponse);
                    } catch (error) {
                      console.error("Error creating staff ticket:", error);
                      output = JSON.stringify({ 
                        error: true, 
                        message: "Failed to create staff ticket: " + error.message 
                      });
                    }
                    break;
                    
                  default:
                    output = JSON.stringify({ error: true, message: `Unknown tool: ${functionName}` });
                }
                
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: output
                });
              } catch (toolError) {
                console.error(`Error calling tool ${functionName}:`, toolError);
                
                // Use fallback manager for tool errors
                const fallbackResult = handleToolError(userId, message, toolError.message, thread.id);
                
                toolOutputs.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify({ 
                    error: true, 
                    message: fallbackResult.response,
                    escalated: fallbackResult.escalated,
                    ticketId: fallbackResult.ticketId
                  })
                });
              }
            }
            
            // Submit tool outputs
            console.log("Submitting tool outputs for run:", run.id);
            await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
              tool_outputs: toolOutputs
            });
          }
          
          // Wait before checking status again
          await new Promise(resolve => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }
        
        if (runStatus.status === "failed") {
          return res.status(500).json({ error: true, message: "Assistant run failed" });
        }
        
        if (runStatus.status !== "completed") {
          return res.status(500).json({ error: true, message: "Assistant run timed out" });
        }
        
        // Get the response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const latestMessage = messages.data[0];
        
        // Extract text from the response
        let responseText = "";
        if (latestMessage.content && latestMessage.content.length > 0) {
          responseText = latestMessage.content[0].text.value;
        }
        
        // Apply refund guardrail first - escalate if user is asking about refunds/credits/freebies
        if (isAskingAboutRefunds(message)) {
          const refundInquiryResult = handleRefundInquiry(userId, message, thread.id);
          return res.json({
            response: refundInquiryResult.response,
            threadId: thread.id,
            userId: userId,
            success: true,
            escalated: refundInquiryResult.escalated,
            ticketId: refundInquiryResult.ticketId,
            violationType: refundInquiryResult.violationType,
            platform: platform
          });
        }
        
        // Apply fallback and escalation logic
        const fallbackResult = handleFallback(userId, message, responseText, thread.id);
        
        // If fallback didn't escalate, apply refund guardrail to check for prohibited promises
        if (!fallbackResult.escalated) {
          const refundResult = handleRefundsGuardrail(userId, message, fallbackResult.response, thread.id);
          return res.json({
            response: refundResult.response,
            threadId: thread.id,
            userId: userId,
            success: true,
            escalated: refundResult.escalated,
            ticketId: refundResult.ticketId,
            violationType: refundResult.violationType,
            platform: platform
          });
        }
        
        // If fallback already escalated, return that result
        return res.json({
          response: fallbackResult.response,
          threadId: thread.id,
          userId: userId,
          success: true,
          escalated: fallbackResult.escalated,
          ticketId: fallbackResult.ticketId,
          platform: platform
        });
      } catch (openaiError) {
        console.error("OpenAI processing error:", openaiError);
        // Fallback to simple response if OpenAI fails
        return res.json({
          response: "I received your message. I'm currently unable to process it with AI assistance, but I'll get back to you soon.",
          userId: userId,
          success: true,
          platform: platform
        });
      }
    } else {
      // Simple echo response if OpenAI is not configured
      return res.json({
        response: `Echo: ${message}`,
        userId: userId,
        success: true,
        platform: platform
      });
    }
  } catch (e) {
    console.error("Error processing Make.com webhook:", e);
    return res.status(500).json({ error: true, message: "Failed to process webhook: " + e.message });
  }
});

// Broadcast endpoints for compliant messaging
// Add a new broadcast template
app.post("/broadcast/template", requireBackendKey, async (req, res) => {
  try {
    const { templateId, content, preApproved } = req.body;
    
    if (!templateId || !content) {
      return res.status(400).json({ error: true, message: "templateId and content are required" });
    }
    
    addTemplate(templateId, content, preApproved);
    
    return res.json({ 
      success: true, 
      message: `Template ${templateId} added successfully`,
      preApproved: preApproved || false
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to add template: " + e.message });
  }
});

// Approve a broadcast template
app.post("/broadcast/approve", requireBackendKey, async (req, res) => {
  try {
    const { templateId } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: true, message: "templateId is required" });
    }
    
    approveTemplate(templateId);
    
    return res.json({ 
      success: true, 
      message: `Template ${templateId} approved successfully`
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to approve template: " + e.message });
  }
});

// Opt-in a user for broadcasts
app.post("/broadcast/opt-in", async (req, res) => {
  try {
    const { userId, contactInfo } = req.body;
    
    if (!userId || !contactInfo) {
      return res.status(400).json({ error: true, message: "userId and contactInfo are required" });
    }
    
    optInUser(userId, contactInfo);
    
    return res.json({ 
      success: true, 
      message: `User ${userId} opted in successfully`
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to opt in user: " + e.message });
  }
});

// Opt-out a user from broadcasts
app.post("/broadcast/opt-out", async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: true, message: "userId is required" });
    }
    
    optOutUser(userId);
    
    return res.json({ 
      success: true, 
      message: `User ${userId} opted out successfully`
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to opt out user: " + e.message });
  }
});

// Send a broadcast to opted-in users
app.post("/broadcast/send", requireBackendKey, async (req, res) => {
  try {
    const { templateId, testUserIds } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: true, message: "templateId is required" });
    }
    
    // If testUserIds is provided, this is a test broadcast
    const isTest = testUserIds && Array.isArray(testUserIds);
    
    const result = sendBroadcast(templateId, testUserIds);
    
    if (!result.success) {
      return res.status(400).json({ error: true, message: result.error });
    }
    
    return res.json({ 
      success: true, 
      message: result.message,
      recipients: result.recipients,
      isTest: isTest
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to send broadcast: " + e.message });
  }
});

// Get broadcast status
app.get("/broadcast/status", requireBackendKey, async (req, res) => {
  try {
    const optedInCount = getOptedInUsers().length;
    
    return res.json({ 
      success: true, 
      optedInUsers: optedInCount,
      message: `${optedInCount} users are opted in for broadcasts`
    });
  } catch (e) {
    return res.status(500).json({ error: true, message: "Failed to get broadcast status: " + e.message });
  }
});

const PORT = config.PORT;

// Handle port already in use
app.listen(PORT, () => {
  console.log(`Backend up on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Backend up on port ${PORT + 1}`);
      console.log(`Health check: http://localhost:${PORT + 1}/health`);
    });
  } else {
    console.error(err);
  }
});