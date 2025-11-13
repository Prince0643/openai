// Node.js script to test the webhook
import fetch from 'node-fetch';

async function testWebhook() {
  console.log('Testing webhook endpoint...');
  
  const body = {
    message: "what are the classes this week?",
    userId: "test_user_123",
    platform: "manychat"
  };
  
  try {
    console.log('Sending request...');
    const response = await fetch('https://openai-o3ba.onrender.com/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    console.log(`Status Code: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('Response Headers:', [...response.headers.entries()]);
    console.log('Response Body:', responseText);
    
    // Try to parse as JSON if possible
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON Response:', JSON.stringify(jsonResponse, null, 2));
    } catch (parseError) {
      console.log('Response is not valid JSON');
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testWebhook();