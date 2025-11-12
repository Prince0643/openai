// Test the exact response format we're generating with future classes

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

// Mock schedule data with future classes (2 hours from now)
const futureTime = new Date(Date.now() + 7200000); // 2 hours from now
const mockSchedule = [
  {
    id: "class_101",
    name: "Handstands (all levels)",
    start: futureTime.toISOString(), // 2 hours from now
    end: new Date(futureTime.getTime() + 3600000).toISOString(), // 3 hours from now
    coach: "Mélanie Beaudette"
  },
  {
    id: "class_202",
    name: "Strength Training (barbells full body)",
    start: new Date(futureTime.getTime() + 1800000).toISOString(), // 2.5 hours from now
    end: new Date(futureTime.getTime() + 5400000).toISOString(), // 3.5 hours from now
    coach: "Damion Greenaway"
  }
];

// Test the weekly view response generation
function generateWeeklyViewResponse(scheduleData, message, weekParam) {
  const viewType = determineScheduleViewType(message);
  console.log(`Message: "${message}"`);
  console.log(`Detected view type: ${viewType}`);
  
  let responseText = "";
  
  switch (viewType) {
    case 'weekly':
      // For weekly view, show one day at a time
      responseText = "Here's today's schedule:";
      const dailySchedule = filterAndLimitDailySchedule(scheduleData, weekParam);
      console.log(`Found ${dailySchedule.length} upcoming classes`);
      
      if (dailySchedule.length === 0) {
        responseText = "No more classes today. Want to see tomorrow's schedule?";
      } else {
        dailySchedule.forEach(classItem => {
          const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          responseText += `\n${classTime} - ${classItem.name}`;
          if (classItem.coach) responseText += ` with ${classItem.coach}`;
        });
        responseText += "\n\nWhich day are you interested in?";
      }
      break;
  }
  
  return responseText;
}

// Test with the exact message and data
const testMessage = "what are the classes this week?";
const todayStr = new Date().toISOString().split('T')[0];
const response = generateWeeklyViewResponse(mockSchedule, testMessage, todayStr);

console.log('\n=== Generated Response ===');
console.log(JSON.stringify({ message: response }, null, 2));

console.log('\n=== Response Text ===');
console.log(response);

console.log('\n=== Line Count ===');
const lineCount = response.split('\n').length;
console.log(`Total lines: ${lineCount}`);

console.log('\n=== Character Count ===');
console.log(`Total characters: ${response.length}`);

console.log('\n=== Analysis ===');
if (lineCount <= 7) {
  console.log('✅ Line count is within 4-7 line limit');
} else {
  console.log('❌ Line count exceeds 4-7 line limit');
}

if (response.includes("Which day are you interested in?")) {
  console.log('✅ Follow-up question is included in response');
} else {
  console.log('❌ Follow-up question is missing from response');
}

console.log('\n=== Expected vs Actual ===');
console.log('Expected response should include class listings and follow-up question');
console.log('If actual response is missing these, there may be an issue with:');
console.log('1. How the response is being processed by the assistant');
console.log('2. Character/line limits in the assistant');
console.log('3. Formatting issues in the response');