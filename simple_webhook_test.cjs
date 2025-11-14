const http = require('http');

// Test data
const testData = {
  message: "What classes are available today?",
  userId: "test_user_1"
};

const postData = JSON.stringify(testData);

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
    console.log('=== Webhook Test Response ===');
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${responseData}`);
    console.log('=============================\n');
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(postData);
req.end();