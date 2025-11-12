// Script to test the webhook endpoint directly
console.log("To test the webhook endpoint directly, run this command in your terminal:\n");

console.log("curl -X POST https://openai-o3ba.onrender.com/make/webhook \\");
console.log("  -H \"Content-Type: application/json\" \\");
console.log("  -d '{");
console.log("    \"message\": \"what are the classes this week?\",");
console.log("    \"userId\": \"test_user_123\",");
console.log("    \"platform\": \"manychat\"");
console.log("  }'");
console.log("");

console.log("This will show you exactly what your tool returns before the assistant processes it.");
console.log("You should see the follow-up prompt in the response.");
console.log("");
console.log("To test what the assistant returns, you can:");
console.log("1. Use the OpenAI Playground with your assistant");
console.log("2. Send the same message through ManyChat");
console.log("3. Check the Make.com output to see what the assistant actually sent");