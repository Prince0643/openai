import http from 'http';

// Test data for different scenarios
const testData = [
  {
    name: "Specific Class Request (Yoga)",
    data: {
      message: "Do you have any yoga classes today?",
      userId: "test_user_1"
    }
  },
  {
    name: "Daily Schedule Request",
    data: {
      message: "What classes are there today?",
      userId: "test_user_2"
    }
  },
  {
    name: "Weekly Schedule Request",
    data: {
      message: "What's the schedule for this week?",
      userId: "test_user_3"
    }
  }
];

// Function to test webhook
function testWebhook(testCase) {
  const postData = JSON.stringify(testCase.data);
  
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
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`\n=== ${testCase.name} ===`);
      console.log(`Request: ${JSON.stringify(testCase.data)}`);
      console.log(`Response Status: ${res.statusCode}`);
      console.log(`Response: ${data}`);
      console.log('====================================\n');
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Run all tests
console.log('Testing webhook functionality...\n');

testData.forEach((testCase, index) => {
  setTimeout(() => {
    testWebhook(testCase);
  }, index * 2000); // Stagger requests by 2 seconds
});