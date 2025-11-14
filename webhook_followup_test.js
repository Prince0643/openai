import fetch from 'node-fetch';

async function testWebhookFollowups() {
  const webhookUrl = 'http://localhost:10000/make/webhook';
  
  // Test cases for different types of requests
  const testCases = [
    {
      name: "Yoga Class Request",
      data: {
        message: "I'd like to book a yoga class",
        userId: "test_user_yoga",
        platform: "manychat"
      }
    },
    {
      name: "Weekly View Request",
      data: {
        message: "What's the schedule for this week?",
        userId: "test_user_weekly",
        platform: "manychat"
      }
    }
  ];
  
  // Start the server if it's not running
  console.log("Testing webhook follow-up questions...\n");
  
  for (const testCase of testCases) {
    console.log(`=== ${testCase.name} ===`);
    console.log('Sending data:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });
      
      const result = await response.json();
      console.log('Webhook response:', JSON.stringify(result, null, 2));
      
      // Check if the response contains proper follow-up questions
      if (result.response) {
        console.log('\nResponse analysis:');
        
        // Check for prohibited phrases
        const prohibitedPhrases = [
          "Which day do you want to see next?",
          "Which day would you like to see next?",
          "Which day are you interested in?",
          "type next",
          "click next",
          "press next"
        ];
        
        let hasProhibitedPhrase = false;
        for (const phrase of prohibitedPhrases) {
          if (result.response.includes(phrase)) {
            console.log(`❌ FAILURE: Response contains prohibited phrase: "${phrase}"`);
            hasProhibitedPhrase = true;
          }
        }
        
        // Check for proper follow-up
        if (result.response.includes("Which day are you looking for?")) {
          console.log('✅ SUCCESS: Response contains proper follow-up: "Which day are you looking for?"');
        } else if (!hasProhibitedPhrase) {
          console.log('⚠️  WARNING: No follow-up question found, but no prohibited phrases detected');
        }
        
        // Check for buttons or structured elements (simplified check)
        if (result.response.includes("[") && result.response.includes("]")) {
          console.log('❌ FAILURE: Response may contain button elements');
        }
        
      } else {
        console.log('⚠️  WARNING: No response content found');
      }
      
      console.log('================================\n');
      
    } catch (error) {
      console.error(`Error testing ${testCase.name}:`, error.message);
      console.log('================================\n');
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run the tests
testWebhookFollowups();