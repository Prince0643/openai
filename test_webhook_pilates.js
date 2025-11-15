import http from 'http';

// Function to send a test request
function sendTestRequest(testCase, messageText) {
  const postData = JSON.stringify({
    message: messageText,
    sender: {
      id: "test_user_3"
    }
  });
  
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

// Test pilates class request
sendTestRequest('Pilates Class Request', "when's your next pilates class?");