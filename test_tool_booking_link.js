import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:10000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

if (!BACKEND_API_KEY) {
  console.error('Missing BACKEND_API_KEY in environment variables');
  process.exit(1);
}

async function testToolBookingLink() {
  console.log('Testing Direct Tool Call for Yoga Class Booking Link...\n');
  
  // Test the get_schedule_public tool call directly
  const today = new Date().toISOString().split('T')[0];
  
  const toolCallPayload = {
    tool_name: "get_schedule_public",
    tool_args: {
      date_from: today
    }
  };
  
  console.log('Sending tool call request:', JSON.stringify(toolCallPayload, null, 2));
  
  try {
    // Send request to the tool-call endpoint
    const response = await fetch(`${BACKEND_URL}/tool-call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_API_KEY}`
      },
      body: JSON.stringify(toolCallPayload)
    });
    
    console.log('\nResponse Status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('\nResponse Data:', JSON.stringify(responseData, null, 2));
      
      // Check if the response contains a booking link
      if (responseData.message) {
        console.log('\n=== BOOKING LINK VERIFICATION ===');
        if (responseData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
          console.log('✅ SUCCESS: Specific class booking link found in tool response');
          console.log('Booking link:', responseData.message.match(/https:\/\/omni\.gymmasteronline\.com\/portal\/account\/book\/class\?classId=[^\s\n]+/)[0]);
        } else if (responseData.message.includes('https://omni.gymmasteronline.com/portal/account/book/class/')) {
          console.log('⚠️  INFO: General booking link found in tool response');
        } else {
          console.log('❌ ISSUE: No booking link found in tool response');
          console.log('Response message:', responseData.message);
        }
      }
      
      return responseData;
    } else {
      const errorText = await response.text();
      console.error('❌ ERROR: Request failed with status', response.status);
      console.error('Error details:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ ERROR: Test failed with exception:', error.message);
    console.error('Error stack:', error.stack);
    return null;
  }
}

// Run the test
testToolBookingLink();