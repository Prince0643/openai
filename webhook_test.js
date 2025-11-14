import http from 'http';

// Test data for different scenarios
const testData = {
  dailyView: {
    message: "What classes are available today?",
    userId: "test_user_1",
    threadId: null
  },
  weeklyView: {
    message: "What's the schedule for this week?",
    userId: "test_user_2",
    threadId: null
  },
  specificClass: {
    message: "Do you have any yoga classes today?",
    userId: "test_user_3",
    threadId: null
  },
  fullDay: {
    message: "Show me all classes for today",
    userId: "test_user_4",
    threadId: null
  }
};

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

// Run tests
console.log('Testing webhook responses...\n');

// Wait a bit between tests to avoid conflicts
setTimeout(() => {
  sendTestRequest('Daily View', testData.dailyView);
}, 1000);

setTimeout(() => {
  sendTestRequest('Weekly View', testData.weeklyView);
}, 2000);

setTimeout(() => {
  sendTestRequest('Specific Class', testData.specificClass);
}, 3000);

setTimeout(() => {
  sendTestRequest('Full Day', testData.fullDay);
}, 4000);