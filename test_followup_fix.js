// Using built-in fetch API


// Test the webhook endpoint
async function testWebhook() {
  try {
    const response = await fetch('http://localhost:10000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What classes are available today?",
        userId: "test_user_123",
        platform: "manychat"
      })
    });
    
    const data = await response.json();
    
    console.log('Webhook Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if the response includes the follow-up question
    if (data.response && data.response.includes("Which day are you interested in?")) {
      console.log('\n✅ SUCCESS: Follow-up question found in response!');
    } else if (data.response && data.response.includes("Want to see more classes or another day?")) {
      console.log('\n✅ SUCCESS: Daily view follow-up question found in response!');
    } else {
      console.log('\n❌ ISSUE: Follow-up question not found in response');
      console.log('Response text:', data.response);
    }
  } catch (error) {
    console.error('Error testing webhook:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testWebhook();