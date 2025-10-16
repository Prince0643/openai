// Simple test to verify webhook endpoint without OpenAI processing
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Simple test endpoint
app.post('/test-webhook', (req, res) => {
  console.log('Received test webhook:', req.body);
  res.json({
    response: 'Test successful!',
    userId: req.body.userId,
    success: true
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  
  // Send a test request to ourselves
  setTimeout(() => {
    fetch(`http://localhost:${PORT}/test-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "show today's classes at Omni Kuta.",
        userId: "371492018",
        threadId: ""
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Test response:', data);
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
  }, 1000);
});