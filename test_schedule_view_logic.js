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

// Test cases for different schedule view types
const testCases = [
  {
    name: "Weekly View Request",
    message: "Show me the weekly schedule",
    expectedViewType: "weekly"
  },
  {
    name: "Full Day View Request",
    message: "Show me all classes for today",
    expectedViewType: "full_day"
  },
  {
    name: "Specific Class Request",
    message: "I want to book a yoga class",
    expectedViewType: "specific_class"
  },
  {
    name: "Daily View Request (default)",
    message: "What classes are available today?",
    expectedViewType: "daily"
  }
];

async function testScheduleViewLogic() {
  try {
    console.log("Testing schedule view logic...\n");
    
    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);
      console.log(`Message: "${testCase.message}"`);
      console.log(`Expected view type: ${testCase.expectedViewType}`);
      
      // Create a thread for testing
      const thread = await openai.beta.threads.create();
      console.log("✅ Thread created:", thread.id);
      
      // Add the test message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: testCase.message
      });
      console.log("✅ Message added to thread");
      
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
          }
          
          // Break after seeing the tool calls
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log("Run status:", runStatus.status);
      }
      
      if (runStatus.status === "requires_action") {
        console.log("✅ Test completed - Assistant identified tool calls");
      } else if (runStatus.status === "completed") {
        console.log("✅ Assistant run completed");
        
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
      
      console.log("---\n");
    }
    
    console.log("All tests completed!");
    
  } catch (error) {
    console.error("❌ Error testing schedule view logic:", error.message);
  }
}

testScheduleViewLogic();