import fetch from 'node-fetch';

async function testWebhook() {
  try {
    console.log('Testing webhook endpoint...');
    
    const response = await fetch('http://localhost:10000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "show today's classes at Omni Kuta.",
        userId: "371492018",
        threadId: ""
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const responseBody = await response.text();
    console.log('Response body:', responseBody);
    
    if (response.ok) {
      console.log('Webhook test successful!');
    } else {
      console.log('Webhook test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Webhook test failed with error:', error);
  }
}

testWebhook();