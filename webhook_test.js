import fetch from 'node-fetch';

async function testWebhook() {
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  // Test data simulating a specific class request
  const testData = {
    message: "I'd like to book a yoga class",
    userId: "test_user_123",
    platform: "manychat"
  };
  
  try {
    console.log('Testing webhook with specific class request...');
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('Webhook response:', JSON.stringify(result, null, 2));
    
    // Check if booking link is correctly formed
    if (result.response && result.response.includes('classId=')) {
      console.log('✅ SUCCESS: Booking link found in response');
      if (result.response.includes('classId=undefined')) {
        console.log('❌ FAILURE: Booking link contains undefined classId');
      } else {
        console.log('✅ SUCCESS: Booking link contains valid classId');
      }
    } else {
      console.log('⚠️  WARNING: No booking link found in response');
    }
    
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

// Run the test
testWebhook();