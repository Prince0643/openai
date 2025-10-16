import fetch from 'node-fetch';

async function testSimpleEndpoint() {
  try {
    console.log('Testing simple webhook endpoint...');
    
    const response = await fetch('http://localhost:10000/simple-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "show today's classes",
        userId: "371492018"
      })
    });
    
    console.log('Response status:', response.status);
    
    const responseBody = await response.json();
    console.log('Response body:', JSON.stringify(responseBody, null, 2));
    
    if (response.ok) {
      console.log('Simple webhook test successful!');
    } else {
      console.log('Simple webhook test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Simple webhook test failed with error:', error);
  }
}

testSimpleEndpoint();