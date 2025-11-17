import fetch from 'node-fetch';

async function testBookingWebhook() {
  console.log('Testing booking and schedule functionality via webhook...');
  
  // Test cases for booking and schedules
  const testCases = [
    {
      name: "Yoga Class Request",
      payload: {
        message: "I'd like to book a yoga class",
        userId: "test_user_booking_1",
        platform: "whatsapp"
      }
    },
    {
      name: "HIIT Class Request",
      payload: {
        message: "Do you have any HIIT classes today?",
        userId: "test_user_booking_2",
        platform: "instagram"
      }
    },
    {
      name: "Schedule Request",
      payload: {
        message: "Can you show me the class schedule for today?",
        userId: "test_user_schedule_1",
        platform: "manychat"
      }
    },
    {
      name: "Specific Class Request",
      payload: {
        message: "When is the next spin class?",
        userId: "test_user_booking_3",
        platform: "whatsapp"
      }
    }
  ];
  
  // Server is running on port 10000
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  for (const testCase of testCases) {
    console.log(`\n--- ${testCase.name} ---`);
    console.log(`Sending message: "${testCase.payload.message}"`);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });
      
      const result = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${JSON.stringify(result, null, 2)}`);
      
      // Check if it's a booking/schedule response
      if (result.response && (result.response.includes('class') || result.response.includes('schedule') || result.response.includes('booking'))) {
        console.log('✅ Successfully processed booking/schedule request');
      } else {
        console.log('ℹ️  Processed through normal flow');
      }
    } catch (error) {
      console.error(`Error testing ${testCase.name}:`, error.message);
    }
  }
  
  console.log('\n--- Booking/Schedule Test Complete ---');
}

// Run the test
testBookingWebhook().catch(console.error);