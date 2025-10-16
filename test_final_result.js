import dotenv from "dotenv";
import OpenAI from "openai";
import GymMasterAPI from "./gymmaster.js";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  OPENAI_API_KEY: dotenvResult.parsed?.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
};

async function testFinalResult() {
  try {
    const openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY
    });
    
    // Initialize GymMaster API
    let gymMaster = null;
    if (config.GYMMASTER_API_KEY && config.GYMMASTER_BASE_URL) {
      gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    }
    
    // Create a thread
    const thread = await openai.beta.threads.create();
    
    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "What classes are available today?"
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp"
    });
    
    console.log("Assistant is processing your request...");
    
    // Wait for completion and handle tool calls
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      if (runStatus.status === "requires_action" && runStatus.required_action) {
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = [];
        
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          try {
            let output;
            switch (functionName) {
              case "get_schedule_public":
                if (gymMaster) {
                  const today = new Date().toISOString().split('T')[0];
                  const schedule = await gymMaster.getClassSchedule(today);
                  output = JSON.stringify(schedule);
                } else {
                  output = JSON.stringify({ error: true, message: "GymMaster API not configured" });
                }
                break;
                
              default:
                output = JSON.stringify({ error: true, message: `Unknown tool: ${functionName}` });
            }
            
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: output
            });
          } catch (error) {
            toolOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify({ error: true, message: error.message })
            });
          }
        }
        
        // Submit tool outputs
        await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
          tool_outputs: toolOutputs
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    if (runStatus.status === "completed") {
      // Get the response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const latestMessage = messages.data[0];
      
      console.log("Assistant Response:");
      console.log(latestMessage.content[0].text.value);
    } else {
      console.error("Assistant run failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testFinalResult();