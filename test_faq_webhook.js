import express from 'express';
import { handleFAQRequest } from './faqMiddleware.js';

const app = express();
app.use(express.json());

// Test endpoint that simulates the webhook processing
app.post('/test-faq', async (req, res) => {
  try {
    const { message, userId, platform } = req.body;
    
    console.log(`Testing FAQ with message: "${message}"`);
    
    const result = await handleFAQRequest(message, userId || 'test_user', platform || 'test');
    
    console.log('FAQ Result:', JSON.stringify(result, null, 2));
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error testing FAQ:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test the specific membership question
app.get('/test-membership', async (req, res) => {
  try {
    const testMessage = "do you have a monthly membership?";
    console.log(`Testing membership FAQ with message: "${testMessage}"`);
    
    const result = await handleFAQRequest(testMessage, 'test_user', 'test');
    
    console.log('Membership FAQ Result:', JSON.stringify(result, null, 2));
    
    res.json({
      success: true,
      message: testMessage,
      result: result
    });
  } catch (error) {
    console.error('Error testing membership FAQ:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`FAQ test server running on port ${PORT}`);
  console.log(`Test with: curl -X POST http://localhost:${PORT}/test-faq -H "Content-Type: application/json" -d '{"message":"do you have a monthly membership?"}'`);
  console.log(`Or visit: http://localhost:${PORT}/test-membership`);
});