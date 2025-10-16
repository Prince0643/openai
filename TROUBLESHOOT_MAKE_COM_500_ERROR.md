# Troubleshooting Make.com 500 Internal Server Error

This guide will help you resolve the "500 Internal Server Error" you're encountering when connecting Make.com to your Omni Gym Chat Automation System.

## Understanding the Error

A 500 Internal Server Error from Make.com means that your backend server encountered an unexpected condition that prevented it from fulfilling the request. This could be due to:

1. Server not running or not accessible
2. Issues with the webhook endpoint
3. Problems with API keys or authentication
4. Errors in processing the request
5. Issues with GymMaster or OpenAI integrations

## Step-by-Step Troubleshooting

### Step 1: Verify Your Server is Running

1. Check if your server is running:
   ```bash
   netstat -ano | findstr :3000
   ```
   
   You should see output similar to:
   ```
   TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       10796
   ```

2. If the server is not running, start it:
   ```bash
   node openaitomanychat.js
   ```

### Step 2: Verify Local Tunnel is Running

1. Make sure you have a separate terminal window running:
   ```bash
   npx localtunnel --port 3000
   ```

2. You should see output like:
   ```
   your url is: https://some-random-subdomain.loca.lt
   ```

3. Keep both terminal windows open:
   - One for the server (`node openaitomanychat.js`)
   - One for localtunnel (`npx localtunnel --port 3000`)

### Step 3: Test Your Endpoint Directly

1. Test the health endpoint:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:3000/health -UseBasicParsing
   ```

   You should see a response like:
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

2. Test the webhook endpoint with a simple request:
   ```powershell
   Invoke-WebRequest -Uri "https://YOUR_LOCALTUNNEL_URL/make/webhook" -Method POST -ContentType "application/json" -Body '{"message": "Test", "userId": "test123"}' -UseBasicParsing
   ```

   Replace `YOUR_LOCALTUNNEL_URL` with your actual localtunnel URL.

   **If this fails**, the issue is with your localtunnel connection.

### Step 4: Check Your Make.com Configuration

1. Verify your HTTP module in Make.com:
   - **Method**: POST
   - **URL**: Should be your localtunnel URL + `/make/webhook`
     Example: `https://some-random-subdomain.loca.lt/make/webhook`
   - **Headers**: 
     - Content-Type: application/json
   - **Body**:
     ```json
     {
       "message": "{{1.message}}",
       "userId": "{{1.userId}}",
       "threadId": "{{1.threadId}}"
     }
     ```

### Step 5: Check Server Logs for Errors

Look at the terminal window where you're running `node openaitomanychat.js` for any error messages when Make.com tries to connect.

Common error messages to look for:
- "Error processing Make.com webhook"
- "OpenAI processing error"
- "GymMaster API error"

### Step 6: Verify API Keys

1. Check your [.env](file:///c%3A/Users/CH/Downloads/openaitomanychat/.env) file:
   ```bash
   type .env
   ```

2. Ensure all required keys are present:
   - BACKEND_API_KEY
   - GYMMASTER_API_KEY
   - OPENAI_API_KEY

3. Verify the GymMaster base URL is correct:
   ```
   GYMMASTER_BASE_URL=https://omni.gymmasteronline.com
   ```

### Step 7: Test with a Simple Payload

Try sending a simple test payload from Make.com:

```json
{
  "message": "Hello",
  "userId": "test_user"
}
```

## Common Causes and Solutions

### Cause 1: Server Not Running
**Symptoms**: Connection refused errors
**Solution**: 
1. Start your server: `node openaitomanychat.js`
2. Start localtunnel: `npx localtunnel --port 3000`

### Cause 2: Expired Localtunnel URL
**Symptoms**: 404 errors or connection timeouts
**Solution**:
1. Restart localtunnel: `npx localtunnel --port 3000`
2. Update the URL in your Make.com scenario
3. Update the webhook URL in ManyChat

### Cause 3: Incorrect Endpoint URL
**Symptoms**: 404 errors
**Solution**:
1. Verify your URL includes `/make/webhook`
2. Example: `https://your-subdomain.loca.lt/make/webhook`

### Cause 4: Missing or Invalid API Keys
**Symptoms**: Authentication errors in server logs
**Solution**:
1. Check your [.env](file:///c%3A/Users/CH/Downloads/openaitomanychat/.env) file
2. Verify all API keys are correct
3. Restart your server after making changes

### Cause 5: GymMaster API Issues
**Symptoms**: "GymMaster API error" in logs
**Solution**:
1. Test GymMaster integration: `node test_gymmaster.js`
2. Verify GYMMASTER_API_KEY and GYMMASTER_BASE_URL
3. Check GymMaster API status

### Cause 6: OpenAI API Issues
**Symptoms**: "OpenAI processing error" in logs
**Solution**:
1. Verify OPENAI_API_KEY in [.env](file:///c%3A/Users/CH/Downloads/openaitomanychat/.env)
2. Check OpenAI API status
3. Verify assistant ID in [openaitomanychat.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js)

### Cause 7: Firewall or Network Issues
**Symptoms**: Timeouts or connection failures
**Solution**:
1. Try accessing your localtunnel URL in a browser
2. Check network/firewall restrictions
3. Try a different network

For a specific solution to the 500 Internal Server Error, see [MAKE_COM_500_ERROR_SOLUTION.md](MAKE_COM_500_ERROR_SOLUTION.md) which provides targeted steps to resolve this exact issue.

## Debugging Steps

### 1. Enable Detailed Logging

Add this to the beginning of your webhook endpoint in [openaitomanychat.js](file:///c%3A/Users/CH/Downloads/openaitomanychat/openaitomanychat.js):

```javascript
app.post("/make/webhook", async (req, res) => {
  console.log("=== MAKE.COM WEBHOOK REQUEST ===");
  console.log("Headers:", req.headers);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("================================");
  
  // ... rest of the existing code
```

### 2. Test Each Component Separately

1. Test GymMaster integration:
   ```bash
   node test_gymmaster.js
   ```

2. Test OpenAI assistant:
   ```bash
   node test_assistant.js
   ```

3. Test backend endpoints:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:3000/health -UseBasicParsing
   ```

### 3. Check Make.com Execution Logs

In Make.com:
1. Click on the failed execution
2. Look at each module's output
3. Check the HTTP module's request and response details

## Advanced Troubleshooting

### Network Issues

If you're behind a corporate firewall:
1. Try using a different tunneling service like ngrok
2. Check with your IT department about firewall restrictions

### Memory Issues

If your server crashes due to memory issues:
1. Monitor memory usage: `node --max-old-space-size=4096 openaitomanychat.js`
2. Check for memory leaks in your code

### Timeout Issues

If requests are timing out:
1. Check the timeout settings in your Make.com HTTP module
2. Increase timeout values if needed

## Prevention Tips

1. **Keep terminals open**: Always keep both server and localtunnel terminals open
2. **Monitor logs**: Regularly check server logs for errors
3. **Test regularly**: Periodically test the connection to catch issues early
4. **Use meaningful error messages**: The system is designed to return helpful error messages

## When to Seek Help

If you've tried all the above steps and still have issues:

1. Copy the exact error message from your server logs
2. Note the timestamp when the error occurred
3. Document what you've tried so far
4. Check if there are any recent changes to your system or API keys

## Useful Commands for Diagnosis

### Check server status:
```powershell
Invoke-RestMethod -Uri http://localhost:3000/health -UseBasicParsing
```

### Test webhook endpoint:
```powershell
Invoke-WebRequest -Uri "https://YOUR_LOCALTUNNEL_URL/make/webhook" -Method POST -ContentType "application/json" -Body '{"message": "Test", "userId": "test123"}' -UseBasicParsing
```

### View running processes:
```bash
tasklist | findstr node
```

### Check port usage:
```bash
netstat -ano | findstr :3000
```

By following these steps, you should be able to identify and resolve the 500 Internal Server Error you're experiencing with Make.com.