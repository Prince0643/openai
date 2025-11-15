// Test script to check webhook response after removing line limitations
import fetch from 'node-fetch';

async function testWebhookResponse() {
  try {
    console.log('Testing webhook response...\n');
    
    // Test payload that should trigger the weekly view
    const testPayload = {
      message: "What classes are available this week?",
      userId: "test_user_123",
      platform: "manychat"
    };
    
    console.log('Sending request with payload:');
    console.log(JSON.stringify(testPayload, null, 2));
    
    // Send request to webhook endpoint
    const response = await fetch('http://localhost:10000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('\n--- RESPONSE DETAILS ---');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseBody = await response.text();
    console.log('\nRaw Response Body:');
    console.log(responseBody);
    
    // Try to parse as JSON to extract the actual AI response
    try {
      const jsonResponse = JSON.parse(responseBody);
      console.log('\n--- PARSED RESPONSE ---');
      console.log('Full JSON Response:');
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.response) {
        console.log('\n--- ACTUAL AI RESPONSE ---');
        console.log('"' + jsonResponse.response + '"');
        
        // Analyze the response
        console.log('\n--- RESPONSE ANALYSIS ---');
        const lineCount = jsonResponse.response.split('\n').length;
        console.log('Line count:', lineCount);
        
        if (jsonResponse.response.includes('Which day are you interested in?')) {
          console.log('✅ Follow-up question found: "Which day are you interested in?"');
        } else if (jsonResponse.response.includes('Want to see')) {
          console.log('✅ Alternative follow-up question found');
        } else {
          console.log('⚠️ No follow-up question detected');
        }
      } else {
        console.log('No "response" field found in JSON');
      }
    } catch (parseError) {
      console.log('Response is not valid JSON');
      console.log('This might be the raw AI response:');
      console.log('"' + responseBody + '"');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\nMake sure the server is running on port 10000');
  }
}

// Wait a moment for the server to start, then run the test
setTimeout(testWebhookResponse, 2000);