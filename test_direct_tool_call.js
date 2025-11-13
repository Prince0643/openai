// Test direct tool call to see what our tool actually returns
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDirectToolCall() {
  console.log('Testing direct tool call...');
  
  // Check if BACKEND_API_KEY is available
  const apiKey = process.env.BACKEND_API_KEY;
  if (!apiKey) {
    console.log('BACKEND_API_KEY not found in environment variables');
    console.log('Please set it in your .env file or environment');
    return;
  }
  
  const body = {
    tool_name: "get_schedule_public",
    tool_args: {
      date_from: new Date().toISOString().split('T')[0]
    }
  };
  
  try {
    console.log('Sending direct tool call...');
    const response = await fetch('https://openai-o3ba.onrender.com/tool-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    
    console.log(`Status Code: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    // Try to parse as JSON if possible
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON Response:', JSON.stringify(jsonResponse, null, 2));
      
      // Check if the response includes our follow-up prompt
      if (jsonResponse.message) {
        console.log('\n=== Follow-up Prompt Check ===');
        console.log('Includes "Let me know which day":', jsonResponse.message.includes('Let me know which day'));
        console.log('Includes "Follow-up:":', jsonResponse.message.includes('Follow-up:'));
        console.log('Message length:', jsonResponse.message.length);
        console.log('Line count:', jsonResponse.message.split('\n').length);
      }
    } catch (parseError) {
      console.log('Response is not valid JSON');
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
}

testDirectToolCall();