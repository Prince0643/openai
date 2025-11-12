// Simple test for determineScheduleViewType function

function determineScheduleViewType(userMessage) {
  if (!userMessage) return 'daily';
  
  const lowerMessage = userMessage.toLowerCase();
  
  // WEEKLY VIEW detection
  if (lowerMessage.includes('week') || 
      lowerMessage.includes('weekly schedule') || 
      lowerMessage.includes('week ahead') || 
      lowerMessage.includes('next 7 days') ||
      lowerMessage.includes('this week')) {
    return 'weekly';
  }
  
  // FULL DAY VIEW detection
  if (lowerMessage.includes('full day') || 
      lowerMessage.includes('all classes') || 
      lowerMessage.includes('entire day') || 
      lowerMessage.includes('whole day')) {
    return 'full_day';
  }
  
  // SPECIFIC CLASS detection
  const classKeywords = ['yoga', 'hiit', 'spin', 'pilates', 'handstands', 'strength training'];
  for (const keyword of classKeywords) {
    if (lowerMessage.includes(keyword)) {
      return 'specific_class';
    }
  }
  
  // DAILY VIEW (default)
  return 'daily';
}

// Test cases for different schedule view types
const testCases = [
  {
    name: "Weekly View Request",
    message: "Show me the weekly schedule",
    expectedViewType: "weekly"
  },
  {
    name: "Full Day View Request",
    message: "Show me all classes for today",
    expectedViewType: "full_day"
  },
  {
    name: "Specific Class Request",
    message: "I want to book a yoga class",
    expectedViewType: "specific_class"
  },
  {
    name: "Daily View Request (default)",
    message: "What classes are available today?",
    expectedViewType: "daily"
  },
  {
    name: "Weekly View Request (alternative)",
    message: "What's on this week?",
    expectedViewType: "weekly"
  },
  {
    name: "Full Day View Request (alternative)",
    message: "Show me the full day schedule",
    expectedViewType: "full_day"
  }
];

console.log("Testing determineScheduleViewType function...\n");

let passedTests = 0;
let totalTests = testCases.length;

for (const testCase of testCases) {
  console.log(`Testing: ${testCase.name}`);
  console.log(`Message: "${testCase.message}"`);
  
  const viewType = determineScheduleViewType(testCase.message);
  console.log(`Expected view type: ${testCase.expectedViewType}`);
  console.log(`Actual view type: ${viewType}`);
  
  if (viewType === testCase.expectedViewType) {
    console.log("✅ PASS\n");
    passedTests++;
  } else {
    console.log("❌ FAIL\n");
  }
}

console.log(`Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log("🎉 All tests passed! The schedule view logic is working correctly.");
} else {
  console.log("⚠️  Some tests failed. Please review the implementation.");
}