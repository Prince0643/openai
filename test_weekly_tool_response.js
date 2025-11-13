// Test what our tool returns for a weekly view request
import { readFileSync } from 'fs';

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
    coach: null
  }
];

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

// Simulate the weekly view response
function generateWeeklyResponse(scheduleData, date) {
  let responseText = "Here's today's schedule:";
  const dailySchedule = filterAndLimitDailySchedule(scheduleData, date);
  
  if (dailySchedule.length === 0) {
    responseText = "No more classes today. Want to see tomorrow's schedule?";
  } else {
    dailySchedule.forEach(classItem => {
      const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      responseText += `\n${classTime}: ${classItem.name}`;
      if (classItem.coach) responseText += ` with ${classItem.coach}`;
    });
    // This is what we expect to be preserved
    responseText += "\n\nFollow-up: Let me know which day you'd like to see next.";
  }
  
  return responseText;
}

const weeklyResponse = generateWeeklyResponse(mockSchedule, new Date().toISOString().split('T')[0]);

console.log('=== Weekly View Tool Response ===');
console.log(weeklyResponse);

console.log('\n=== Verification ===');
console.log('Includes "Here\'s today\'s schedule":', weeklyResponse.includes("Here's today's schedule"));
console.log('Includes "Follow-up:":', weeklyResponse.includes("Follow-up:"));
console.log('Includes "Let me know which day":', weeklyResponse.includes("Let me know which day"));
console.log('Message length:', weeklyResponse.length);
console.log('Line count:', weeklyResponse.split('\n').length);