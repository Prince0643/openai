// Detailed test to simulate Make.com requests and check for potential issues
import fetch from 'node-fetch';

async function detailedMakeTest() {
  console.log('🔬 Detailed Make.com Simulation Test\n');
  
  const testCases = [
    {
      name: 'Standard ManyChat Payload',
      payload: {
        "message": "What classes are available today?",
        "userId": "mc_user_123456",
        "threadId": null
      }
    },
    {
      name: 'Payload with Existing Thread',
      payload: {
        "message": "Can you book me in for the 6 PM yoga class?",
        "userId": "mc_user_123456",
        "threadId": "thread_abc123"
      }
    },
    {
      name: 'Simple Message Payload',
      payload: {
        "message": "Hi",
        "userId": "user123"
      }
    },
    {
      name: 'Empty ThreadId',
      payload: {
        "message": "What are your opening hours?",
        "userId": "user456",
        "threadId": ""
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.name}`);
    console.log('📤 Payload:', JSON.stringify(testCase.payload));
    
    try {
      const response = await fetch('http://localhost:3000/make/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Make/1.0'
        },
        body: JSON.stringify(testCase.payload)
      });
      
      console.log(`📥 Status: ${response.status}`);
      
      if (response.status === 200) {
        const result = await response.json();
        console.log('✅ SUCCESS');
        console.log(`   Response: ${result.response.substring(0, 80)}...`);
        console.log(`   Thread ID: ${result.threadId}`);
        console.log(`   User ID: ${result.userId}`);
      } else if (response.status === 400) {
        const error = await response.json();
        console.log('⚠️  CLIENT ERROR (This is expected for invalid requests)');
        console.log(`   Message: ${error.message}`);
      } else {
        console.log(`❌ SERVER ERROR: ${response.status}`);
        const text = await response.text();
        console.log(`   Body: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ CONNECTION ERROR: ${error.message}`);
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('✅ If all tests show SUCCESS, your backend is working correctly');
  console.log('❌ If you see CONNECTION ERROR, there may be network issues');
  console.log('⚠️  If you see SERVER ERROR, check your server logs for details');
  console.log('\n💡 Since your local tests are passing, the issue is likely with:');
  console.log('   1. The localtunnel URL in Make.com (may have expired)');
  console.log('   2. Network connectivity between Make.com and your localtunnel');
  console.log('   3. Firewall or security settings blocking the connection');
}

detailedMakeTest();