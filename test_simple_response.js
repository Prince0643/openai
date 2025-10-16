// Simple test to show the final assistant response
import dotenv from "dotenv";
import OpenAI from "openai";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
dotenv.config();

async function testSimpleResponse() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Initialize GymMaster API
    const gymMaster = new GymMasterAPI(
      process.env.GYMMASTER_API_KEY,
      process.env.GYMMASTER_BASE_URL
    );
    
    console.log("Testing complete flow...");
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    console.log("Thread created");
    
    // Add message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Hi, what classes are available today?"
    });
    console.log("Message added");
    
    // Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp"
    });
    console.log("Assistant running...");
    
    // Poll for completion
    let runStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      // Handle tool calls if needed
      if (runStatus.status === "requires_action") {
        console.log("Handling tool calls...");
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = [];
        
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === "get_schedule_public") {
            const today = new Date().toISOString().split('T')[0];
            const schedule = await gymMaster.getClassSchedule(today);
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify(schedule)
            });
          }
        }
        
        if (toolOutputs.length > 0) {
          await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
            tool_outputs: toolOutputs
          });
        }
      }
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");
    
    if (runStatus.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const response = messages.data[0].content[0].text.value;
      console.log("\n=== FINAL ASSISTANT RESPONSE ===");
      console.log(response);
      console.log("=== END RESPONSE ===");
    } else {
      console.log("Assistant failed:", runStatus);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSimpleResponse();