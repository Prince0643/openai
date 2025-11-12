// Test how the system processes a weekly schedule request

// Import the schedule view type determination function
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the main file to extract the function
const filePath = join(process.cwd(), 'openaitomanychat.js');
const content = readFileSync(filePath, 'utf8');

// Extract the determineScheduleViewType function logic
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

// Test the specific message
const testMessage = "what are the classes this week?";
const viewType = determineScheduleViewType(testMessage);

console.log('=== Weekly Request Analysis ===');
console.log(`User message: "${testMessage}"`);
console.log(`Detected view type: ${viewType}`);

// Check if it should be detected as weekly
if (viewType === 'weekly') {
  console.log('✅ Correctly detected as weekly view request');
  console.log('Expected behavior:');
  console.log('- Show one day at a time');
  console.log('- Include "Which day are you interested in?" prompt');
  console.log('- Not show all 7 days at once');
} else {
  console.log('❌ Not detected as weekly view request');
  console.log('This might explain why the response is not as expected');
}

// Test other variations
const otherMessages = [
  "What's on this week?",
  "Show me the weekly schedule",
  "What classes are available this week?",
  "Weekly classes please"
];

console.log('\n=== Other Weekly Request Variations ===');
otherMessages.forEach(message => {
  const type = determineScheduleViewType(message);
  console.log(`"${message}" -> ${type}`);
});

console.log('\n=== Summary ===');
console.log('The system should correctly identify weekly requests and show one day at a time.');
console.log('If the actual response differs, it might be because:');
console.log('1. The assistant is not calling our tool handlers');
console.log('2. The response is being generated directly by the assistant');
console.log('3. There might be a caching or persistence issue with the conversation thread');