# Detailed Make.com Integration Guide

This guide provides step-by-step instructions to connect your Omni Gym Chat Automation System to Make.com so that:
1. Make.com can send data to your system
2. Your system processes the data using OpenAI Assistant and GymMaster APIs
3. Your system sends answers back to Make.com
4. Make.com forwards the answers to ManyChat

## Prerequisites

Before starting, ensure you have:
- Your backend server code (openaitomanychat.js, gymmaster.js, etc.)
- Node.js installed on your computer
- A Make.com account
- A ManyChat account (Pro version required for webhooks)

## Step 1: Start Your Backend Server

1. Open a command prompt or terminal
2. Navigate to your project folder:
   ```bash
   cd C:\Users\CH\Downloads\openaitomanychat
   ```

3. Start your backend server:
   ```bash
   node openaitomanychat.js
   ```

4. You should see output similar to:
   ```
   GymMaster API client initialized successfully
   OpenAI client initialized successfully
   Backend up on port 3000
   Health check: http://localhost:3000/health
   ```

5. Verify your server is running by opening a browser and visiting:
   ```
   http://localhost:3000/health
   ```

   You should see a JSON response showing:
   ```json
   {
     "status": "OK",
     "config": {
       "gymmaster": true,
       "backendKey": true,
       "openai": true
     }
   }
   ```

## Step 2: Expose Your Local Server to the Internet

Since your server runs locally, you need to make it accessible from the internet using localtunnel:

1. Open a NEW command prompt or terminal window (keep the server running)
2. Navigate to your project folder:
   ```bash
   cd C:\Users\CH\Downloads\openaitomanychat
   ```

3. Start localtunnel to expose your server:
   ```bash
   npx localtunnel --port 3000
   ```

4. You will see output like:
   ```
   your url is: https://stupid-parts-join.loca.lt
   ```

5. **IMPORTANT**: Keep both terminal windows open:
   - One running your server (`node openaitomanychat.js`)
   - One running localtunnel (`npx localtunnel --port 3000`)

## Step 3: Test Your Public Endpoint

Before configuring Make.com, test that your public endpoint is working:

1. Open a NEW command prompt or terminal window
2. Test the webhook endpoint:
   ```powershell
   Invoke-WebRequest -Uri "https://YOUR_LOCALTUNNEL_URL/make/webhook" -Method POST -ContentType "application/json" -Body '{"message": "Hello, test message", "userId": "test123"}' -UseBasicParsing
   ```

   Replace `YOUR_LOCALTUNNEL_URL` with your actual URL (e.g., `https://stupid-parts-join.loca.lt`)

3. You should receive a response like:
   ```json
   {
     "response": "I received your message. I'm currently unable to process it with AI assistance, but I'll get back to you soon.",
     "userId": "test123",
     "success": true
   }
   ```

## Step 4: Create a Make.com Scenario

1. Log in to your Make.com account
2. Click "Create a new scenario" (green button)
3. Give your scenario a name like "Omni Gym Chatbot"
4. Click "Create"

## Step 5: Add Webhook Trigger

1. Click on the first module (labeled "Choose a trigger")
2. Search for "Webhooks" and select "Webhooks"
3. Choose "Custom webhook" as the trigger event
4. Click "Save" and then "Copy URL to clipboard"
5. This URL is where ManyChat will send messages to Make.com

## Step 6: Add HTTP Request Module

1. Click the "+" button to add a new module
2. Search for "HTTP" and select "HTTP"
3. Choose "Make a request" as the action
4. Configure the module with these settings:

   **Method**: POST
   
   **URL**: Your localtunnel URL + `/make/webhook`
   Example: `https://stupid-parts-join.loca.lt/make/webhook`
   
   **Headers**:
   - Add header: Content-Type = application/json
   
   **Body Type**: Raw Content
   
   **Body**:
   ```json
   {
     "message": "{{1.message}}",
     "userId": "{{1.userId}}",
     "threadId": "{{1.threadId}}"
   }
   ```

5. Click "OK" to save the module

## Step 7: Handle the Response

1. Click the "+" button to add another module
2. This module will handle the response from your system
3. You can use an HTTP module or directly connect to ManyChat depending on your setup
4. The response from your system will contain:
   ```json
   {
     "response": "Processed answer from your assistant",
     "threadId": "conversation_thread_id",
     "userId": "user123",
     "success": true
   }
   ```

## Step 8: Connect to ManyChat

1. In ManyChat, go to "Automations" > "Webhooks"
2. Create a new webhook using the URL you copied from Make.com in Step 5
3. Configure the payload to include:
   - message: The user's message
   - userId: The ManyChat user ID
   - threadId: (Optional) Conversation thread ID for continuity

## Step 9: Test the Complete Flow

1. Send a test message from ManyChat
2. Watch your server terminal for log messages:
   ```
   Received webhook from Make.com: { ... }
   ```

3. The response should flow back to ManyChat through Make.com

## Example Data Flow

Here's what happens when a user sends a message:

1. **User sends message in ManyChat**: "What classes are available today?"

2. **ManyChat sends to Make.com**:
   ```json
   {
     "message": "What classes are available today?",
     "userId": "mc_123456789",
     "threadId": null
   }
   ```

3. **Make.com forwards to your system**:
   POST request to `https://YOUR_URL/make/webhook`

4. **Your system processes the request**:
   - Receives the message
   - Sends to OpenAI Assistant
   - Assistant may call GymMaster tools
   - Your system processes tool calls
   - Assistant formulates response
   - Your system returns response to Make.com

5. **Your system responds to Make.com**:
   ```json
   {
     "response": "Here are today's classes:\n\n09:00 - Yoga with Sarah - Main Studio - Seats: 5\n10:30 - HIIT - Cardio Room - Seats: 2",
     "threadId": "thread_abc123",
     "userId": "mc_123456789",
     "success": true
   }
   ```

6. **Make.com sends response back to ManyChat**

7. **ManyChat displays response to user**

## Troubleshooting Common Issues

### Issue 1: "ECONNREFUSED" or "Connection refused"
**Cause**: Your server is not running or not accessible
**Solution**:
1. Make sure `node openaitomanychat.js` is running
2. Make sure localtunnel is running
3. Check that both terminal windows are still open

### Issue 2: "404 Not Found"
**Cause**: Wrong URL or endpoint
**Solution**:
1. Verify your localtunnel URL is correct
2. Make sure you're using `/make/webhook` endpoint
3. Test the URL directly in your browser

### Issue 3: Localtunnel URL stops working
**Cause**: localtunnel URLs expire after inactivity
**Solution**:
1. Restart localtunnel: `npx localtunnel --port 3000`
2. Update the URL in your Make.com scenario
3. Update the webhook URL in ManyChat

### Issue 4: No response from assistant
**Cause**: OpenAI API key issues or assistant configuration
**Solution**:
1. Check that OPENAI_API_KEY is set in your .env file
2. Verify the assistant ID in openaitomanychat.js matches your assistant
3. Test the assistant directly with `node test_assistant.js`

### Issue 5: 500 Internal Server Error from Make.com
**Cause**: Server-side error in processing the request
**Solution**: See the detailed troubleshooting guide [TROUBLESHOOT_MAKE_COM_500_ERROR.md](TROUBLESHOOT_MAKE_COM_500_ERROR.md) for comprehensive steps to diagnose and fix this issue.

## Useful Commands for Testing

### Check server health:
```bash
curl http://localhost:3000/health
```

### Test webhook endpoint:
```powershell
Invoke-WebRequest -Uri "https://YOUR_LOCALTUNNEL_URL/make/webhook" -Method POST -ContentType "application/json" -Body '{"message": "Test message", "userId": "test123"}' -UseBasicParsing
```

### View server logs:
Look at the terminal window where you ran `node openaitomanychat.js` for real-time logs

## Security Notes

1. Your BACKEND_API_KEY in the .env file protects your endpoints
2. Never share your localtunnel URL publicly
3. In production, use a proper domain with SSL instead of localtunnel
4. Keep your API keys secure and never commit them to version control

## Next Steps

1. Test with different types of messages
2. Monitor your server logs for any errors
3. Customize the assistant instructions in openaiassistant.json
4. Add more tools to the assistant as needed