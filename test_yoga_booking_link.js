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

async function testYogaBookingLink() {
  console.log('Testing Yoga Class Booking Link Generation...\n');
  
  // Test payload for a yoga class request
  const testPayload = {
    message: "Show me the yoga schedule for today",
    userId: "test_user_yoga_" + Date.now(),
    platform: "manychat"
  };
  
  console.log('Sending test request:', JSON.stringify(testPayload, null, 2));
  
  try {
    // Send request to the webhook endpoint
    const response = await fetch(`${BACKEND_URL}/make/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BACKEND_API_KEY}`
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('\nResponse Status:', response.status);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('\nResponse Data:', JSON.stringify(responseData, null, 2));
      
      // Check if the response contains a booking link
      if (responseData.response) {
        console.log('\n=== BOOKING LINK VERIFICATION ===');
        if (responseData.response.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
          console.log('✅ SUCCESS: Specific class booking link found in response');
          console.log('Booking link:', responseData.response.match(/https:\/\/omni\.gymmasteronline\.com\/portal\/account\/book\/class\?classId=[^\s\n]+/)[0]);
        } else if (responseData.response.includes('https://omni.gymmasteronline.com/portal/account/book/class/')) {
          console.log('⚠️  INFO: General booking link found in response');
        } else {
          console.log('❌ ISSUE: No booking link found in response');
          console.log('Response text:', responseData.response);
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
testYogaBookingLink();