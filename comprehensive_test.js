import fetch from 'node-fetch';

async function comprehensiveTest() {
  console.log('=== Comprehensive System Test ===\n');
  
  // Test cases that should trigger FAQ responses
  const faqTestCases = [
    {
      name: "FAQ Match - Types of Classes",
      payload: {
        message: "What types of classes do you offer?",
        userId: "faq_test_1",
        platform: "whatsapp"
      }
    },
    {
      name: "FAQ Match - Booking Process",
      payload: {
        message: "How do I book a class?",
        userId: "faq_test_2",
        platform: "instagram"
      }
    }
  ];
  
  // Test cases that should trigger booking/schedule responses
  const bookingTestCases = [
    {
      name: "Yoga Class Request",
      payload: {
        message: "I'd like to book a yoga class",
        userId: "booking_test_1",
        platform: "whatsapp"
      }
    },
    {
      name: "HIIT Class Request",
      payload: {
        message: "Do you have any HIIT classes today?",
        userId: "booking_test_2",
        platform: "instagram"
      }
    },
    {
      name: "Schedule Request",
      payload: {
        message: "Can you show me the class schedule for today?",
        userId: "schedule_test_1",
        platform: "manychat"
      }
    }
  ];
  
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  console.log('--- FAQ Responses ---');
  for (const testCase of faqTestCases) {
    console.log(`\n${testCase.name}:`);
    console.log(`Message: "${testCase.payload.message}"`);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });
      
      const result = await response.json();
      console.log(`Response: ${result.response}`);
      console.log(`Source: ${result.source}`);
      console.log(`Escalated: ${result.escalated}`);
    } catch (error) {
      console.error(`Error:`, error.message);
    }
  }
  
  console.log('\n--- Booking/Schedule Responses (Currently Escalated) ---');
  for (const testCase of bookingTestCases) {
    console.log(`\n${testCase.name}:`);
    console.log(`Message: "${testCase.payload.message}"`);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });
      
      const result = await response.json();
      console.log(`Response: ${result.response}`);
      console.log(`Source: ${result.source}`);
      console.log(`Escalated: ${result.escalated}`);
      if (result.ticketId) {
        console.log(`Ticket ID: ${result.ticketId}`);
      }
    } catch (error) {
      console.error(`Error:`, error.message);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the test
comprehensiveTest().catch(console.error);