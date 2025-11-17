// Test the intent-based routing
import { handleFAQRequest } from './faqMiddleware.js';

async function testIntentRouting() {
  console.log('=== Intent-Based Routing Test ===\n');
  
  const testCases = [
    {
      name: "FAQ Request",
      message: "What types of classes do you offer?",
      userId: "test_user_1",
      platform: "whatsapp"
    },
    {
      name: "Booking Request",
      message: "I'd like to book a yoga class",
      userId: "test_user_2",
      platform: "instagram"
    },
    {
      name: "Schedule Request",
      message: "Can you show me the class schedule for today?",
      userId: "test_user_3",
      platform: "manychat"
    },
    {
      name: "Another FAQ Request",
      message: "How do I book a class?",
      userId: "test_user_4",
      platform: "whatsapp"
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`--- ${testCase.name} ---`);
    console.log(`Message: "${testCase.message}"`);
    
    try {
      const result = await handleFAQRequest(testCase.message, testCase.userId, testCase.platform);
      
      if (result === null) {
        console.log('Result: Request will be handled by specialized system (not escalated)');
      } else if (result.source === 'faq') {
        console.log('Result: FAQ match found');
        console.log(`Response: ${result.response}`);
      } else if (result.source === 'faq_escalation') {
        console.log('Result: Request escalated to human agent');
        console.log(`Response: ${result.response}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    console.log('');
  }
  
  console.log('=== Test Complete ===');
}

// Run the test
testIntentRouting().catch(console.error);