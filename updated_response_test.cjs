const http = require('http');

// Test weekly schedule request
console.log('=== Testing Updated Weekly Schedule Request ===');
const weeklyData = JSON.stringify({
  message: "What's the schedule for this week?",
  userId: "test_user_weekly_updated"
});

const weeklyOptions = {
  hostname: 'localhost',
  port: 10000,
  path: '/make/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(weeklyData)
  }
};

const weeklyReq = http.request(weeklyOptions, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Weekly Schedule Response:');
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${responseData}`);
    console.log('================================\n');
  });
});

weeklyReq.on('error', (error) => {
  console.error('Weekly Request Error:', error.message);
});

weeklyReq.write(weeklyData);
weeklyReq.end();