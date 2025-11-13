// Using built-in fetch API

// Test to verify the exact follow-up question for weekly view
async function testWeeklyView() {
  try {
    console.log('Testing webhook with weekly view request...\n');
    
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
    
    // Check if the response includes any follow-up question
    const responseText = data.response || '';
    console.log('\n--- ANALYSIS ---');
    
    if (responseText.includes('Which day are you interested in?')) {
      console.log('✅ SUCCESS: Weekly view follow-up question found!');
    } else if (responseText.includes('Want to see more classes or another day?')) {
      console.log('✅ SUCCESS: Daily view follow-up question found!');
    } else if (responseText.includes('Would you like to see')) {
      console.log('✅ SUCCESS: Rephrased follow-up question found!');
    } else if (responseText.includes('?')) {
      console.log('✅ INFO: Some question found in response (may be follow-up)');
    } else {
      console.log('❌ ISSUE: No follow-up question found in response');
    }
    
    // Count lines
    const lineCount = responseText.split('\n').length;
    console.log(`Line count: ${lineCount}`);
    
    console.log('\n--- RESPONSE TEXT ---');
    console.log(`"${responseText}"`);
    
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

testWeeklyView();