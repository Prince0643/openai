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

// Test full day
sendTestRequest('Full Day', {
  message: "Show me all classes for today",
  userId: "test_user_4"
});