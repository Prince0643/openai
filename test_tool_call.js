// Using built-in fetch API

// Test the tool call endpoint directly
async function testToolCall() {
  try {
    const response = await fetch('http://localhost:10000/tool-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer d1a7d4868ab3480299a5ece43701602'
      },
      body: JSON.stringify({
        tool_name: "get_schedule_public",
        tool_args: {
          date_from: "2025-11-13"
        }
      })
    });
    
    const data = await response.json();
    
    console.log('Tool Call Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if the response includes the follow-up question
    if (data.message && data.message.includes("Which day are you interested in?")) {
      console.log('\n✅ SUCCESS: Weekly view follow-up question found in response!');
    } else if (data.message && data.message.includes("Want to see more classes or another day?")) {
      console.log('\n✅ SUCCESS: Daily view follow-up question found in response!');
    } else {
      console.log('\n❌ ISSUE: Expected follow-up question not found in response');
      console.log('Response text:', data.message);
    }
  } catch (error) {
    console.error('Error testing tool call:', error.message);
  }
}

testToolCall();