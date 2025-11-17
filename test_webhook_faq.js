import fetch from 'node-fetch';

async function testWebhookFAQ() {
  console.log('Testing webhook with FAQ integration...');
  
  // Test cases
  const testCases = [
    {
      name: "FAQ Match Test",
      payload: {
        message: "What types of classes do you offer?",
        userId: "test_user_1",
        platform: "whatsapp"
      }
    },
    {
      name: "FAQ Match Test 2",
      payload: {
        message: "How do I book a class?",
        userId: "test_user_2",
        platform: "instagram"
      }
    },
    {
      name: "No FAQ Match Test",
      payload: {
        message: "What is your refund policy?",
        userId: "test_user_3",
        platform: "manychat"
      }
    }
  ];
  
  // Server is now running on port 10000
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
      
      if (result.source === 'faq') {
        console.log('✅ Successfully matched FAQ');
      } else if (result.source === 'faq_escalation') {
        console.log('ℹ️  No FAQ match, escalated to human agent');
      } else {
        console.log('ℹ️  Processed through normal flow (might be class request or AI processing)');
      }
    } catch (error) {
      console.error(`Error testing ${testCase.name}:`, error.message);
    }
  }
  
  console.log('\n--- Test Complete ---');
}

// Run the test
testWebhookFAQ().catch(console.error);