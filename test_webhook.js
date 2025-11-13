const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Test endpoint that simulates the webhook response
app.post('/test-webhook', (req, res) => {
  console.log('Received test webhook request:', JSON.stringify(req.body, null, 2));
  
  // Simulate a "this week" request to trigger weekly view
  const testPayload = {
    message: "What classes are available this week?",
    userId: "test_user_123",
    platform: "manychat"
  };
  
  console.log('Sending test payload:', JSON.stringify(testPayload, null, 2));
  
  // In a real test, you would send this to your actual webhook endpoint
  // For now, we'll just log what the response should look like
  console.log('\nExpected response format:');
  console.log('--------------------');
  console.log("Here's today's schedule:");
  console.log("04:00 PM: Vinyasa Flow");
  console.log("05:30 PM: Boxing with Vincent Y");
  console.log("Which day are you interested in?");
  console.log('--------------------');
  
  res.json({
    success: true,
    message: 'Test payload sent. Check console for expected response format.'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test webhook server running on port ${PORT}`);
  console.log(`Send a POST request to http://localhost:${PORT}/test-webhook to test`);
});