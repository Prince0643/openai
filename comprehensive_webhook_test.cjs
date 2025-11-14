const http = require('http');

// Function to send a test request
function sendTestRequest(testCase, data) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'localhost',
    port: 10000,
    path: '/make/webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log(`=== ${testCase} Test Response ===`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Response: ${responseData}`);
      console.log('================================\n');
    });
  });

  req.on('error', (error) => {
    console.error(`Error in ${testCase} test:`, error.message);
  });

  req.write(postData);
  req.end();
}

// Test data for different scenarios
console.log('Testing webhook responses...\n');

// Test 1: Daily view
sendTestRequest('Daily View', {
  message: "What classes are available today?",
  userId: "test_user_1"
});

// Test 2: Weekly view
setTimeout(() => {
  sendTestRequest('Weekly View', {
    message: "What's the schedule for this week?",
    userId: "test_user_2"
  });
}, 1000);

// Test 3: Specific class
setTimeout(() => {
  sendTestRequest('Specific Class', {
    message: "Do you have any yoga classes today?",
    userId: "test_user_3"
  });
}, 2000);

// Test 4: Full day
setTimeout(() => {
  sendTestRequest('Full Day', {
    message: "Show me all classes for today",
    userId: "test_user_4"
  });
}, 3000);