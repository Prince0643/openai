import fetch from 'node-fetch';

async function testFullDayRequest() {
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  // Use a more specific "full day" request that should trigger the full_day view type
  const payload = {
    message: "full day",
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
      
      // Count lines in response
      const lineCount = result.response.split('\n').length;
      console.log('\nLine Count:', lineCount);
    }
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testFullDayRequest();