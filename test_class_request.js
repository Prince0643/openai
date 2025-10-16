import fetch from 'node-fetch';

async function testClassRequest() {
  try {
    console.log('Testing class request to deployed endpoint...');
    
    // Test webhook endpoint with class request
    console.log('\nSending class request...');
    const startTime = Date.now();
    
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
    
    const endTime = Date.now();
    console.log(`Request completed in ${endTime - startTime}ms`);
    console.log('Class request response status:', classResponse.status);
    
    // Check if it's a timeout
    if (endTime - startTime > 25000) {
      console.log('Request timed out (likely a 30-second OpenAI timeout)');
    }
    
    const classData = await classResponse.text();
    console.log('Class request response body:', classData);
    
    console.log('\n=== Test completed ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    console.error('Error stack:', error.stack);
  }
}

testClassRequest();