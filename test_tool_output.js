// Test what our tool actually returns
import { readFileSync } from 'fs';

// Mock the exact same data structure that would be returned by our tool
function simulateToolResponse() {
  // This is what our tool should be returning
  const toolResponse = {
    message: "Here's today's schedule:\n04:00 PM: Handstands (all levels) with Mélanie Beaudette\n04:00 PM: Strength Training (barbells full body) with Damion Greenaway\n05:30 PM: Sunset Hatha Yoga\n\nLet me know which day you'd like to see next."
  };
  
  // This is what the assistant is actually returning (based on the Make.com output)
  const assistantResponse = "Here's today's schedule:\n- 04:00 PM: Handstands (all levels) with Mélanie Beaudette\n- 04:00 PM: Strength Training (barbells full body) with Damion Greenaway\n- 05:30 PM: Sunset Hatha Yoga";
  
  console.log("=== Tool Response (What we generate) ===");
  console.log(JSON.stringify(toolResponse, null, 2));
  
  console.log("\n=== Assistant Response (What Make.com receives) ===");
  console.log(JSON.stringify({
    response: assistantResponse,
    threadId: "thread_IC1o2skkLJvqHjVVsba4dZD3",
    userId: "371492018",
    success: true,
    escalated: false,
    platform: "manychat"
  }, null, 2));
  
  console.log("\n=== Analysis ===");
  console.log("1. Tool includes follow-up prompt:", toolResponse.message.includes("Let me know which day you'd like to see next."));
  console.log("2. Assistant response missing follow-up:", !assistantResponse.includes("Let me know which day you'd like to see next."));
  console.log("3. Tool uses colon format:", toolResponse.message.includes(":"));
  console.log("4. Assistant uses bullet format:", assistantResponse.includes("-"));
  
  console.log("\n=== Conclusion ===");
  console.log("The assistant is post-processing our tool response and:");
  console.log("- Removing the follow-up prompt");
  console.log("- Converting colon format to bullet point format");
  console.log("- This is likely due to the assistant's instructions about summarizing tool outputs");
}

simulateToolResponse();