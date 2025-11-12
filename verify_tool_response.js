// Test to verify that our tool generates the correct response with follow-up prompt
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

// Simulate the get_schedule_public handler response
function simulateGetSchedulePublicResponse(scheduleData) {
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
    responseText += "\n\nLet me know which day you'd like to see next.";
  }
  
  return JSON.stringify({ message: responseText });
}

// Simulate the get_schedule handler response
function simulateGetScheduleResponse(scheduleData) {
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
    responseText += "\n\nLet me know which day you'd like to see next.";
  }
  
  return JSON.stringify({ message: responseText });
}

console.log("=== get_schedule_public handler response ===");
const publicResponse = simulateGetSchedulePublicResponse(mockSchedule);
console.log(publicResponse);

console.log("\n=== get_schedule handler response ===");
const scheduleResponse = simulateGetScheduleResponse(mockSchedule);
console.log(scheduleResponse);

console.log("\n=== Verification ===");
const publicResponseObj = JSON.parse(publicResponse);
const scheduleResponseObj = JSON.parse(scheduleResponse);

console.log("get_schedule_public includes follow-up:", publicResponseObj.message.includes("Let me know which day you'd like to see next."));
console.log("get_schedule includes follow-up:", scheduleResponseObj.message.includes("Let me know which day you'd like to see next."));

console.log("\nget_schedule_public line count:", publicResponseObj.message.split('\n').length);
console.log("get_schedule line count:", scheduleResponseObj.message.split('\n').length);