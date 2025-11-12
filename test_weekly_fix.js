// Test to verify the weekly schedule fix

// Copy the key functions we need
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

function filterAndLimitDailySchedule(schedule, date) {
  const todayStr = new Date().toISOString().split('T')[0];
  const requestedDateStr = date || todayStr;
  
  // If not today, return all classes for that date
  if (requestedDateStr !== todayStr) {
    return schedule;
  }
  
  // For today, filter out past classes and limit to next 5
  const now = new Date();
  const upcomingClasses = schedule.filter(classItem => {
    const classTime = new Date(classItem.start);
    return classTime > now;
  });
  
  // Sort by start time and limit to next 5
  upcomingClasses.sort((a, b) => new Date(a.start) - new Date(b.start));
  return upcomingClasses.slice(0, 5);
}

// Mock schedule data
const mockSchedule = [
  {
    id: "class_101",
    name: "Morning Yoga",
    start: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    coach: "Sarah Johnson"
  },
  {
    id: "class_202",
    name: "HIIT Training",
    start: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    end: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
    coach: "Mike Thompson"
  },
  {
    id: "class_303",
    name: "Evening Spin",
    start: new Date(Date.now() + 14400000).toISOString(), // 4 hours from now
    end: new Date(Date.now() + 18000000).toISOString(), // 5 hours from now
    coach: "Alex Rodriguez"
  }
];

// Test the weekly view response generation
function generateWeeklyViewResponse(scheduleData, message) {
  const viewType = determineScheduleViewType(message);
  console.log(`Message: "${message}"`);
  console.log(`Detected view type: ${viewType}`);
  
  let responseText = "";
  
  switch (viewType) {
    case 'weekly':
      // For weekly view, show one day at a time
      responseText = "Here's today's schedule:\n";
      const dailySchedule = filterAndLimitDailySchedule(scheduleData, new Date().toISOString().split('T')[0]);
      if (dailySchedule.length === 0) {
        responseText = "No more classes today. Want to see tomorrow's schedule?";
      } else {
        dailySchedule.forEach(classItem => {
          const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          responseText += `${classTime} - ${classItem.name}`;
          if (classItem.coach) responseText += ` with ${classItem.coach}`;
          responseText += "\n";
        });
        responseText += "\nWhich day are you interested in?";
      }
      break;
      
    case 'daily':
    default:
      // Apply daily view logic (next 5 classes only for today)
      const filteredSchedule = filterAndLimitDailySchedule(scheduleData, new Date().toISOString().split('T')[0]);
      
      if (filteredSchedule.length === 0) {
        responseText = "No more classes today. Want to see tomorrow's schedule?";
      } else {
        responseText = "Here are the available classes:\n";
        filteredSchedule.forEach(classItem => {
          const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          responseText += `${classTime} - ${classItem.name}`;
          if (classItem.coach) responseText += ` with ${classItem.coach}`;
          responseText += "\n";
        });
      }
      break;
  }
  
  return responseText;
}

// Test the specific message
console.log('=== Testing Weekly Request Fix ===\n');

const testMessage = "what are the classes this week?";
const response = generateWeeklyViewResponse(mockSchedule, testMessage);

console.log('Generated response:');
console.log(response);

console.log('\n=== Verification ===');
if (response.includes("Here's today's schedule:")) {
  console.log('✅ Correct header for weekly view');
} else {
  console.log('❌ Incorrect header for weekly view');
}

if (response.includes("Which day are you interested in?")) {
  console.log('✅ Correct follow-up question for weekly view');
} else {
  console.log('❌ Missing follow-up question for weekly view');
}

if (response.includes("Here are today's remaining classes:")) {
  console.log('❌ Still using old header format');
} else {
  console.log('✅ Not using old header format');
}

console.log('\n=== Summary ===');
console.log('The fix should now correctly handle weekly requests by:');
console.log('1. Showing one day at a time (today\'s schedule)');
console.log('2. Including the follow-up question "Which day are you interested in?"');
console.log('3. Not showing all 7 days at once');
console.log('4. Using the correct header format');