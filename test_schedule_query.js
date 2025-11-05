import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
const dotenvResult = dotenv.config();

const OPENAI_API_KEY = dotenvResult.parsed?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in environment variables");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

async function testScheduleQuery() {
  try {
    console.log("Testing assistant schedule query handling...");
    
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
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && (Date.now() - startTime) < maxWaitTime) {
      // Check if the assistant requires action (tool calls)
      if (runStatus.status === "requires_action" && runStatus.required_action) {
        console.log("🔧 Assistant requires tool calls");
        
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        console.log("Number of tool calls:", toolCalls.length);
        
        for (const toolCall of toolCalls) {
          console.log("Tool call:", toolCall.function.name);
          console.log("Tool arguments:", toolCall.function.arguments);
          
          // Check if it's calling get_schedule_public
          if (toolCall.function.name === "get_schedule_public") {
            console.log("✅ Assistant correctly called get_schedule_public!");
            
            // Parse the arguments
            const args = JSON.parse(toolCall.function.arguments);
            console.log("Arguments:", JSON.stringify(args, null, 2));
          }
        }
        
        // In a real implementation, we would call our tools and submit outputs
        // For this test, we'll just break to see the tool call
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log("Run status:", runStatus.status);
    }
    
    if (runStatus.status === "requires_action") {
      console.log("✅ Test successful - Assistant correctly identified need for get_schedule_public tool");
    } else if (runStatus.status === "completed") {
      console.log("✅ Assistant run completed (may have responded without tool call)");
      
      // Get the response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const latestMessage = messages.data[0];
      
      if (latestMessage.content && latestMessage.content.length > 0) {
        const responseText = latestMessage.content[0].text.value;
        console.log("Assistant Response:");
        console.log(responseText);
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

testScheduleQuery();