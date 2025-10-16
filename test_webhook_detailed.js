import fetch from 'node-fetch';

async function testWebhookWithDifferentPayloads() {
  console.log('🔬 Detailed Webhook Endpoint Testing...\n');
  
  const webhookUrl = 'http://localhost:3000/make/webhook';
  
  // Test 1: Basic payload (similar to what Make.com might send)
  console.log('Test 1: Basic payload');
  try {
    const response1 = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What classes are available today?",
        userId: "test_user_123"
      })
    });
    
    const result1 = await response1.json();
    console.log(`✅ Status: ${response1.status}`);
    console.log(`✅ Response: ${result1.response.substring(0, 100)}...`);
    console.log(`✅ Thread ID: ${result1.threadId}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 2: Payload with threadId
  console.log('\nTest 2: Payload with threadId');
  try {
    const response2 = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Can you help me book a class?",
        userId: "test_user_123",
        threadId: "thread_test_456"
      })
    });
    
    const result2 = await response2.json();
    console.log(`✅ Status: ${response2.status}`);
    console.log(`✅ Response: ${result2.response.substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 3: Payload without userId
  console.log('\nTest 3: Payload without userId');
  try {
    const response3 = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What are your opening hours?",
        userId: "test_user_123"
      })
    });
    
    const result3 = await response3.json();
    console.log(`✅ Status: ${response3.status}`);
    console.log(`✅ Response: ${result3.response.substring(0, 100)}...`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 4: Empty message (should fail)
  console.log('\nTest 4: Empty message (should fail)');
  try {
    const response4 = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "",
        userId: "test_user_123"
      })
    });
    
    const result4 = await response4.json();
    console.log(`✅ Status: ${response4.status} (Expected: 400)`);
    console.log(`✅ Error: ${result4.message}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 5: No message field (should fail)
  console.log('\nTest 5: No message field (should fail)');
  try {
    const response5 = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: "test_user_123"
      })
    });
    
    const result5 = await response5.json();
    console.log(`✅ Status: ${response5.status} (Expected: 400)`);
    console.log(`✅ Error: ${result5.message}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('\n🎯 Webhook testing completed!');
}

testWebhookWithDifferentPayloads();