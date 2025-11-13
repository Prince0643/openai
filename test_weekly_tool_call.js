// Test how the webhook processes weekly requests by checking our view type detection
import { readFileSync } from 'fs';

// Copy the determineScheduleViewType function
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

// Test the message that was sent
const testMessage = "what are the classes this week?";
const viewType = determineScheduleViewType(testMessage);

console.log('=== View Type Detection Test ===');
console.log(`Message: "${testMessage}"`);
console.log(`Detected View Type: ${viewType}`);

// Test other weekly variations
const weeklyMessages = [
  "what are the classes this week?",
  "show me the weekly schedule",
  "give me the schedule for this week",
  "what's on this week?",
  "weekly classes please"
];

console.log('\n=== Other Weekly Message Tests ===');
weeklyMessages.forEach(msg => {
  const viewType = determineScheduleViewType(msg);
  console.log(`"${msg}" -> ${viewType}`);
});

console.log('\n=== Expected Behavior ===');
console.log('For weekly requests, the webhook should:');
console.log('1. Detect view type as "weekly"');
console.log('2. Call the tool with weekly view logic');
console.log('3. Include the follow-up prompt in the response');
console.log('4. Show one day at a time');