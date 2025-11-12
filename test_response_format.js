// Test the exact response format we're generating

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

// Mock schedule data that matches the response you received
const mockSchedule = [
  {
    id: "class_101",
    name: "Handstands (all levels)",
    start: new Date().setHours(16, 0, 0, 0), // 4:00 PM today
    end: new Date().setHours(17, 0, 0, 0), // 5:00 PM today
    coach: "Mélanie Beaudette"
  },
  {
    id: "class_202",
    name: "Strength Training (barbells full body)",
    start: new Date().setHours(16, 0, 0, 0), // 4:00 PM today
    end: new Date().setHours(17, 0, 0, 0), // 5:00 PM today
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
const response = generateWeeklyViewResponse(mockSchedule, testMessage, new Date().toISOString().split('T')[0]);

console.log('=== Generated Response ===');
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