import OpenAI from "openai";
import fs from "fs";
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

async function createOrUpdateAssistant() {
  try {
    // Read the assistant configuration
    const assistantConfig = JSON.parse(fs.readFileSync('./openaiassistant.json', 'utf8'));
    
    // Remove fields that shouldn't be sent to the API
    const { id, object, created_at, ...configToSend } = assistantConfig;
    
    console.log("Creating or updating assistant...");
    
    // Create or update the assistant
    const assistant = await openai.beta.assistants.create(configToSend);
    
    console.log("✅ Assistant created/updated successfully!");
    console.log("Assistant ID:", assistant.id);
    console.log("Assistant Name:", assistant.name);
    
    // Save the new ID back to the config file
    const updatedConfig = { ...assistantConfig, id: assistant.id };
    fs.writeFileSync('./openaiassistant.json', JSON.stringify(updatedConfig, null, 2));
    
    console.log("✅ Assistant ID updated in openaiassistant.json");
    
  } catch (error) {
    console.error("❌ Error creating/updating assistant:", error.message);
  }
}

createOrUpdateAssistant();