import fetch from 'node-fetch';

async function testDeployedEndpoint() {
  try {
    console.log('Testing deployed endpoint...');
    
    // Test 1: Health check
    console.log('\n1. Testing health check...');
    const healthResponse = await fetch('https://openai-o3ba.onrender.com/health');
    console.log('Health check status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health check data:', JSON.stringify(healthData, null, 2));
    
    // Test 2: Webhook endpoint with simple message
    console.log('\n2. Testing webhook with simple message...');
    const webhookResponse = await fetch('https://openai-o3ba.onrender.com/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Hi there",
        userId: "371492018",
        threadId: ""
      })
    });
    
    console.log('Webhook response status:', webhookResponse.status);
    console.log('Webhook response headers:', [...webhookResponse.headers.entries()]);
    
    const webhookData = await webhookResponse.text();
    console.log('Webhook response body:', webhookData);
    
    // Test 3: Webhook endpoint with class request
    console.log('\n3. Testing webhook with class request...');
    const classResponse = await fetch('https://openai-o3ba.onrender.com/make/webhook', {
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
    
    console.log('Class request response status:', classResponse.status);
    console.log('Class request response headers:', [...classResponse.headers.entries()]);
    
    const classData = await classResponse.text();
    console.log('Class request response body:', classData);
    
    console.log('\n=== Test completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

testDeployedEndpoint();