// Test the specific class booking link generation logic directly

// Mock schedule data with yoga classes
const mockSchedule = [
  {
    id: "class_yoga_101",
    name: "Sunset Yin Yoga",
    start: "2025-11-13T17:30:00Z",
    end: "2025-11-13T18:30:00Z",
    coach: "Alex Johnson"
  },
  {
    id: "class_hiit_202",
    name: "HIIT Training",
    start: "2025-11-13T12:00:00Z",
    end: "2025-11-13T13:00:00Z",
    coach: "Sarah Williams"
  }
];

// Simplified version of the determineScheduleViewType function
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

// Test the specific class detection and link generation
function testSpecificClassLinkGeneration() {
  console.log('Testing Specific Class Booking Link Generation...\n');
  
  // Test message that should trigger specific class view
  const testMessage = "Show me the yoga schedule for today";
  const viewType = determineScheduleViewType(testMessage);
  
  console.log(`Message: "${testMessage}"`);
  console.log(`Detected view type: ${viewType}`);
  
  if (viewType === 'specific_class') {
    console.log('\n=== SPECIFIC CLASS DETECTION SUCCESS ===');
    
    // Simulate the specific class matching logic
    let matchingClass = null;
    const lowerMessage = testMessage.toLowerCase();
    
    console.log('\nSearching for matching class...');
    for (const classItem of mockSchedule) {
      const className = classItem.name.toLowerCase();
      console.log(`Checking class: ${classItem.name}`);
      
      if (
        (lowerMessage.includes('yoga') && className.includes('yoga')) ||
        (lowerMessage.includes('hiit') && className.includes('hiit')) ||
        (lowerMessage.includes('spin') && className.includes('spin')) ||
        (lowerMessage.includes('pilates') && className.includes('pilates')) ||
        (lowerMessage.includes('handstands') && className.includes('handstands')) ||
        (lowerMessage.includes('strength') && className.includes('strength'))
      ) {
        matchingClass = classItem;
        console.log(`✅ Match found: ${classItem.name}`);
        break;
      }
    }
    
    if (matchingClass) {
      console.log('\n=== BOOKING LINK GENERATION ===');
      const classTime = new Date(matchingClass.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      let responseText = `I found a ${matchingClass.name} class today at ${classTime}`;
      if (matchingClass.coach) responseText += ` with ${matchingClass.coach}`;
      responseText += ".\n\n";
      
      // This is the updated link generation logic
      responseText += `To book this class, please use the official GymMaster booking link:\nhttps://omni.gymmasteronline.com/portal/account/book/class?classId=${matchingClass.id}`;
      
      console.log('Generated response:');
      console.log(responseText);
      
      // Verify the booking link is present
      if (responseText.includes('https://omni.gymmasteronline.com/portal/account/book/class?classId=')) {
        console.log('\n✅ SUCCESS: Specific class booking link correctly generated');
        console.log('Booking link:', responseText.match(/https:\/\/omni\.gymmasteronline\.com\/portal\/account\/book\/class\?classId=[^\s\n]+/)[0]);
      } else {
        console.log('\n❌ ISSUE: Booking link not found in generated response');
      }
    } else {
      console.log('\n❌ No matching class found in mock schedule');
    }
  } else {
    console.log('\n❌ ISSUE: Expected specific_class view type, got:', viewType);
  }
}

// Run the test
testSpecificClassLinkGeneration();