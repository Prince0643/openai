import OpenAI from "openai";
import dotenv from "dotenv";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const OPENAI_API_KEY = dotenvResult.parsed?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const GYMMASTER_API_KEY = dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY;
const GYMMASTER_BASE_URL = dotenvResult.parsed?.GYMMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL;

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment variables");
  process.exit(1);
}

if (!GYMMASTER_API_KEY || !GYMMASTER_BASE_URL) {
  console.error("Missing GymMaster configuration");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

async function testCompleteScheduleFlow() {
  try {
    console.log("Testing complete assistant schedule flow...");
    
    // Initialize GymMaster API
    const gymMaster = new GymMasterAPI(GYMMASTER_API_KEY, GYMMASTER_BASE_URL);
    
    // Create a thread for testing
    const thread = await openai.beta.threads.create();
    console.log("✅ Thread created:", thread.id);
    
    // Add a schedule query message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "What classes are available today?"
    });
    console.log("✅ Schedule query message added to thread");
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp"
    });
    console.log("✅ Assistant run started:", run.id);
    
    // Wait for completion and handle tool calls
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    const maxWaitTime = 60000; // 60 seconds
    const startTime = Date.now();
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && (Date.now() - startTime) < maxWaitTime) {
      // Check if the assistant requires action (tool calls)
      if (runStatus.status === "requires_action" && runStatus.required_action) {
        console.log("🔧 Assistant requires tool calls");
        
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        console.log("Number of tool calls:", toolCalls.length);
        
        const toolOutputs = [];
        
        for (const toolCall of toolCalls) {
          console.log("Tool call:", toolCall.function.name);
          
          // Check if it's calling get_schedule_public
          if (toolCall.function.name === "get_schedule_public") {
            console.log("✅ Assistant correctly called get_schedule_public!");
            
            // Parse the arguments
            const args = JSON.parse(toolCall.function.arguments);
            console.log("Arguments:", JSON.stringify(args, null, 2));
            
            try {
              // Call the actual GymMaster API
              const today = new Date().toISOString().split('T')[0];
              const schedule = await gymMaster.getClassSchedule(today);
              
              // Format response similar to how it's done in openaitomanychat.js
              const formattedSchedule = {
                classes: schedule,
                message: "Here are the available classes:",
                bookingLink: "https://omni.gymmasteronline.com/portal/account/book/class/"
              };
              
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(formattedSchedule)
              });
              
              console.log("✅ Successfully retrieved and formatted schedule data");
              console.log("Classes found:", schedule.length);
            } catch (error) {
              console.error("Error calling GymMaster API:", error.message);
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ error: true, message: "Failed to retrieve schedule: " + error.message })
              });
            }
          } else {
            // Handle other tool calls with mock responses
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify({ message: "Tool not implemented in this test" })
            });
          }
        }
        
        // Submit tool outputs
        if (toolOutputs.length > 0) {
          console.log("Submitting tool outputs...");
          await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
            tool_outputs: toolOutputs
          });
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log("Run status:", runStatus.status);
    }
    
    if (runStatus.status === "completed") {
      console.log("✅ Assistant run completed successfully!");
      
      // Get the response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const latestMessage = messages.data[0];
      
      if (latestMessage.content && latestMessage.content.length > 0) {
        const responseText = latestMessage.content[0].text.value;
        console.log("Assistant Response:");
        console.log("---");
        console.log(responseText);
        console.log("---");
      }
    } else if (runStatus.status === "failed") {
      console.log("❌ Assistant run failed:", runStatus.last_error?.message);
    } else {
      console.log("❌ Assistant run timed out");
    }
    
  } catch (error) {
    console.error("❌ Error testing assistant:", error.message);
  }
}

testCompleteScheduleFlow();