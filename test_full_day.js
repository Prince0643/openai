import fetch from 'node-fetch';

async function testFullDayRequest() {
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  // Simulate a "full day" request
  const payload = {
    message: "Show me all classes for today",
    userId: "test_user_123",
    platform: "manychat"
  };

  try {
    console.log('Sending full day request to webhook...');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('\nWebhook Response:');
    console.log('Status:', response.status);
    console.log('Response Body:', JSON.stringify(result, null, 2));
    
    if (result.response) {
      console.log('\nFormatted Response:');
      console.log(result.response);
    }
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testFullDayRequest();