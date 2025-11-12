// Test the final response format

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
    name: "Handstands (all levels)",
    start: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    coach: "Mélanie Beaudette"
  },
  {
    id: "class_202",
    name: "Strength Training (barbells full body)",
    start: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    coach: "Damion Greenaway"
  },
  {
    id: "class_303",
    name: "Sunset Hatha Yoga",
    start: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
    end: new Date(Date.now() + 9000000).toISOString(), // 2.5 hours from now
    coach: null // No coach
  }
];

// Generate the weekly view response
function generateWeeklyViewResponse(scheduleData) {
  let responseText = "Here's today's schedule:";
  const dailySchedule = filterAndLimitDailySchedule(scheduleData, new Date().toISOString().split('T')[0]);
  
  if (dailySchedule.length === 0) {
    responseText = "No more classes today. Want to see tomorrow's schedule?";
  } else {
    dailySchedule.forEach(classItem => {
      const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      responseText += `\n${classTime}: ${classItem.name}`;
      if (classItem.coach) responseText += ` with ${classItem.coach}`;
    });
    responseText += "\nLet me know which day you'd like to see next.";
  }
  
  return responseText;
}

const response = generateWeeklyViewResponse(mockSchedule);

console.log('=== Generated Response ===');
console.log(response);

console.log('\n=== Response Analysis ===');
const lines = response.split('\n');
console.log(`Total lines: ${lines.length}`);

console.log('\nLine by line:');
lines.forEach((line, index) => {
  console.log(`${index + 1}. ${JSON.stringify(line)}`);
});

console.log('\n=== Expected vs Actual ===');
console.log('Expected format:');
console.log('Here\'s today\'s schedule:');
console.log('4:00 PM: Handstands (all levels) with Mélanie Beaudette');
console.log('4:00 PM: Strength Training (barbells full body) with Damion Greenaway');
console.log('5:30 PM: Sunset Hatha Yoga');
console.log('Which day are you interested in?');

console.log('\nActual format:');
console.log(response);

console.log('\n=== Line Count Check ===');
if (lines.length <= 7) {
  console.log('✅ Response is within 4-7 line limit');
} else {
  console.log('❌ Response exceeds 4-7 line limit');
}

console.log('\n=== Follow-up Question Check ===');
if (response.includes('Which day are you interested in?')) {
  console.log('✅ Follow-up question is included');
} else {
  console.log('❌ Follow-up question is missing');
}