import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Server URL - using the standard port for this project
const SERVER_URL = 'http://localhost:10000';

async function testFullDaySchedule() {
  try {
    console.log('Testing full day schedule webhook...');
    
    // Simulate a webhook request with a "full day" message
    const response = await fetch(`${SERVER_URL}/make/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Show me all classes for today",
        userId: "test_user_full_day",
        platform: "manychat"
      })
    });

    const result = await response.json();
    console.log('Webhook Response Status:', response.status);
    console.log('Webhook Response:', JSON.stringify(result, null, 2));
    
    if (result.response) {
      console.log('\nFormatted Response:');
      console.log('===================');
      console.log(result.response);
      console.log('===================');
      console.log(`Response length: ${result.response.length} characters`);
      console.log(`Response lines: ${result.response.split('\n').length}`);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testFullDaySchedule();