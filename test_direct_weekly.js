// Test the determineScheduleViewType function directly to make sure it works correctly

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

// Test different message types
const testMessages = [
  "What classes are available this week?",
  "Show me the weekly schedule",
  "What's on this week",
  "Show all classes for today",
  "I want to see all classes today",
  "Any yoga classes today?",
  "Is there a HIIT class?",
  "What classes are available today?",
  "Show me classes"
];

console.log("Testing determineScheduleViewType function:\n");

testMessages.forEach((message, index) => {
  const viewType = determineScheduleViewType(message);
  console.log(`${index + 1}. "${message}" -> ${viewType}`);
});

console.log("\n--- Expected behavior ---");
console.log("Weekly view messages should return 'weekly'");
console.log("Full day view messages should return 'full_day'");
console.log("Specific class messages should return 'specific_class'");
console.log("Other messages should return 'daily' (default)");