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

async function testAssistant() {
  try {
    console.log("Testing assistant configuration...");
    
    // Retrieve the assistant
    const assistant = await openai.beta.assistants.retrieve("asst_xy382A6ksEJ9JwYfSyVDfSBp");
    
    console.log("✅ Assistant retrieved successfully!");
    console.log("Assistant Name:", assistant.name);
    console.log("Assistant Model:", assistant.model);
    console.log("Number of Tools:", assistant.tools.length);
    
    // Create a thread for testing
    const thread = await openai.beta.threads.create();
    console.log("✅ Thread created:", thread.id);
    
    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Hello, what can you help me with?"
    });
    console.log("✅ Message added to thread");
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_xy382A6ksEJ9JwYfSyVDfSBp"
    });
    console.log("✅ Assistant run started:", run.id);
    
    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (runStatus.status !== "completed" && runStatus.status !== "failed" && (Date.now() - startTime) < maxWaitTime) {
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

testAssistant();