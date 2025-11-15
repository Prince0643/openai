// Test script to verify the grouping of consecutive classes with the same name

// Mock schedule data with duplicate classes
const mockSchedule = [
  {
    name: "Lap Swimming",
    start: "2025-11-15T06:00:00",
    endtime: "06:30:00",
    coach: null
  },
  {
    name: "Lap Swimming",
    start: "2025-11-15T06:30:00",
    endtime: "07:00:00",
    coach: null
  },
  {
    name: "Lap Swimming",
    start: "2025-11-15T07:00:00",
    endtime: "07:30:00",
    coach: null
  },
  {
    name: "Lap Swimming",
    start: "2025-11-15T07:30:00",
    endtime: "08:00:00",
    coach: null
  },
  {
    name: "Yoga Class",
    start: "2025-11-15T08:00:00",
    endtime: "09:00:00",
    coach: "John Doe"
  },
  {
    name: "Strength Training",
    start: "2025-11-15T09:00:00",
    endtime: "10:00:00",
    coach: "Jane Smith"
  },
  {
    name: "Strength Training",
    start: "2025-11-15T10:00:00",
    endtime: "11:00:00",
    coach: "Jane Smith"
  }
];

/**
 * Group consecutive classes with the same name and summarize their time ranges
 * @param {Array} classes - Array of class items
 * @returns {Array} - Array of grouped class items with time ranges
 */
function groupConsecutiveClasses(classes) {
  if (!classes || classes.length === 0) return [];
  
  const grouped = [];
  let currentGroup = {
    ...classes[0],
    startTime: new Date(classes[0].start),
    endTime: new Date(classes[0].start)
  };
  
  // Set end time based on class duration if available, otherwise assume 1 hour
  if (classes[0].endtime) {
    currentGroup.endTime = new Date(classes[0].start.split('T')[0] + 'T' + classes[0].endtime);
  } else {
    currentGroup.endTime = new Date(currentGroup.startTime.getTime() + 60 * 60 * 1000);
  }
  
  for (let i = 1; i < classes.length; i++) {
    const currentClass = classes[i];
    const previousClass = classes[i-1];
    
    // Check if current class has the same name as the previous one
    if (currentClass.name === previousClass.name) {
      // Extend the end time of the current group
      if (currentClass.endtime) {
        currentGroup.endTime = new Date(currentClass.start.split('T')[0] + 'T' + currentClass.endtime);
      } else {
        currentGroup.endTime = new Date(new Date(currentClass.start).getTime() + 60 * 60 * 1000);
      }
    } else {
      // Different class name, save the current group and start a new one
      grouped.push(currentGroup);
      
      currentGroup = {
        ...currentClass,
        startTime: new Date(currentClass.start),
        endTime: new Date(currentClass.start)
      };
      
      // Set end time based on class duration if available, otherwise assume 1 hour
      if (currentClass.endtime) {
        currentGroup.endTime = new Date(currentClass.start.split('T')[0] + 'T' + currentClass.endtime);
      } else {
        currentGroup.endTime = new Date(currentGroup.startTime.getTime() + 60 * 60 * 1000);
      }
    }
  }
  
  // Don't forget to add the last group
  grouped.push(currentGroup);
  
  return grouped;
}

// Test the grouping function
console.log("Original schedule:");
mockSchedule.forEach((classItem, index) => {
  const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  console.log(`${index + 1}. ${classTime}: ${classItem.name}${classItem.coach ? ` with ${classItem.coach}` : ''}`);
});

console.log("\nGrouped schedule:");
const groupedSchedule = groupConsecutiveClasses(mockSchedule);
groupedSchedule.forEach((classItem, index) => {
  if (classItem.startTime && classItem.endTime) {
    const startTime = classItem.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const endTime = classItem.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    // If start and end times are the same, just show the start time
    if (startTime === endTime) {
      console.log(`${index + 1}. ${startTime}: ${classItem.name}${classItem.coach ? ` with ${classItem.coach}` : ''}`);
    } else {
      console.log(`${index + 1}. ${startTime} - ${endTime}: ${classItem.name}${classItem.coach ? ` with ${classItem.coach}` : ''}`);
    }
  } else {
    const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    console.log(`${index + 1}. ${classTime}: ${classItem.name}${classItem.coach ? ` with ${classItem.coach}` : ''}`);
  }
});

console.log("\nExpected output:");
console.log("1. 06:00 - 08:00: Lap Swimming");
console.log("2. 08:00 - 09:00: Yoga Class with John Doe");
console.log("3. 09:00 - 11:00: Strength Training with Jane Smith");