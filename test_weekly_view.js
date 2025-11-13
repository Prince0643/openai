// Using built-in fetch API

// Test the webhook endpoint with a weekly view request
async function testWebhook() {
  try {
    const response = await fetch('http://localhost:10000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What classes are available this week?",
        userId: "test_user_123",
        platform: "manychat"
      })
    });
    
    const data = await response.json();
    
    console.log('Webhook Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if the response includes the follow-up question
    if (data.response && data.response.includes("Which day are you interested in?")) {
      console.log('\n✅ SUCCESS: Weekly view follow-up question found in response!');
    } else if (data.response && data.response.includes("Want to see more classes or another day?")) {
      console.log('\n✅ SUCCESS: Daily view follow-up question found in response!');
    } else {
      console.log('\n❌ ISSUE: Expected follow-up question not found in response');
      console.log('Response text:', data.response);
    }
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testWebhook();