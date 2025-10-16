// Simulate exactly what Make.com might be sending
import fetch from 'node-fetch';

async function simulateMakeComRequest() {
  console.log('🔄 Simulating Make.com Request...\n');
  
  // This is what Make.com might be sending based on your configuration
  const makeComPayload = {
    "message": "What classes are available today?",
    "userId": "user123",
    "threadId": null
  };
  
  console.log('📤 Sending payload:');
  console.log(JSON.stringify(makeComPayload, null, 2));
  
  try {
    const response = await fetch('http://localhost:3000/make/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // These headers might be sent by Make.com
        'User-Agent': 'Make/1.0',
        'Accept': '*/*'
      },
      body: JSON.stringify(makeComPayload)
    });
    
    console.log(`\n📥 Response Status: ${response.status}`);
    console.log(`📥 Response Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);
    
    const responseBody = await response.json();
    console.log('\n📥 Response Body:');
    console.log(JSON.stringify(responseBody, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ SUCCESS: The webhook endpoint processed the request correctly!');
      console.log('💡 This means your configuration is working on the backend side.');
      console.log('💡 The issue is likely with the connection between Make.com and your localtunnel URL.');
    } else {
      console.log(`\n❌ UNEXPECTED: Received status ${response.status}`);
    }
    
  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    console.log('💡 This indicates a connection issue between your test and the server.');
  }
}

// Run the simulation
simulateMakeComRequest();