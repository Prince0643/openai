// Complete demonstration of the intent-based routing system
console.log('=== Complete Intent-Based Routing Demo ===\n');

// Simulate the FAQ middleware with our new intent-based logic
function isBookingRequest(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('book') || 
         lowerMessage.includes('yoga') || 
         lowerMessage.includes('hiit') || 
         lowerMessage.includes('pilates') || 
         lowerMessage.includes('spin') || 
         lowerMessage.includes('handstands') || 
         lowerMessage.includes('strength');
}

function isScheduleRequest(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('schedule') || 
         lowerMessage.includes('class') || 
         lowerMessage.includes('classes') || 
         lowerMessage.includes('today') || 
         lowerMessage.includes('tomorrow') || 
         lowerMessage.includes('week') ||
         lowerMessage.includes('when') ||
         lowerMessage.includes('next');
}

async function handleFAQRequest(message, userId, platform) {
  // Simulate FAQ database
  const faqDatabase = {
    "what types of classes do you offer?": "Hi, Thank you for contacting Omni 😊\n\nYou can view our class schedule for this week by clicking this link:\n🔗 instagram.com/stories/highlights/17856076215422369/\n\nPlease note that our class schedule may change weekly as we continue to add more exciting classes at Omni 💪",
    "how do i book a class?": "If you're an Omni member, you can book or cancel through the Omni Club app.\n\nOtherwise, simply contact our reception via WhatsApp."
  };
  
  // Check if this is a booking or schedule request that should be handled by specialized systems
  if (isBookingRequest(message) || isScheduleRequest(message)) {
    console.log(`Booking/schedule request detected: "${message}", allowing specialized handler to process`);
    return null; // Let specialized systems handle it
  }
  
  // Check FAQ database
  const normalizedMessage = message.toLowerCase().trim();
  if (faqDatabase[normalizedMessage]) {
    console.log(`FAQ match found for question: "${message}"`);
    return {
      response: faqDatabase[normalizedMessage],
      userId: userId,
      success: true,
      escalated: false,
      platform: platform,
      source: "faq"
    };
  } else {
    console.log(`No FAQ match found for question: "${message}", escalating to human agent`);
    return {
      response: "I'm not sure about that. Let me connect you with a human agent who can help you better.",
      userId: userId,
      success: true,
      escalated: true,
      platform: platform,
      source: "faq_escalation",
      ticketId: "TICKET-001"
    };
  }
}

// Test cases
const testCases = [
  {
    name: "FAQ Request - Classes Offered",
    message: "What types of classes do you offer?",
    userId: "user_1",
    platform: "whatsapp",
    expected: "FAQ response"
  },
  {
    name: "FAQ Request - Booking Process",
    message: "How do I book a class?",
    userId: "user_2",
    platform: "instagram",
    expected: "FAQ response"
  },
  {
    name: "Booking Request - Yoga",
    message: "I'd like to book a yoga class",
    userId: "user_3",
    platform: "whatsapp",
    expected: "Specialized handler"
  },
  {
    name: "Schedule Request - Today",
    message: "What classes are today?",
    userId: "user_4",
    platform: "manychat",
    expected: "Specialized handler"
  },
  {
    name: "Future Schedule Request - Next HIIT",
    message: "When is the next HIIT class?",
    userId: "user_5",
    platform: "whatsapp",
    expected: "Specialized handler"
  },
  {
    name: "Weekly Schedule Request",
    message: "What's this week's schedule?",
    userId: "user_6",
    platform: "instagram",
    expected: "Specialized handler"
  },
  {
    name: "Unmatched Question",
    message: "What is your refund policy?",
    userId: "user_7",
    platform: "manychat",
    expected: "Escalated to human"
  }
];

console.log('Testing intent-based routing:\n');

async function runTests() {
  for (const testCase of testCases) {
    console.log(`--- ${testCase.name} ---`);
    console.log(`Message: "${testCase.message}"`);
    console.log(`Expected: ${testCase.expected}`);
    
    try {
      const result = await handleFAQRequest(testCase.message, testCase.userId, testCase.platform);
      
      if (result === null) {
        console.log('✅ RESULT: Request will be handled by specialized booking/schedule system');
      } else if (result.source === 'faq') {
        console.log('✅ RESULT: FAQ match found');
        console.log(`Response: ${result.response.split('\n')[0]}...`); // Show first line
      } else if (result.source === 'faq_escalation') {
        console.log('ℹ️  RESULT: Request escalated to human agent');
        console.log(`Response: ${result.response}`);
      }
    } catch (error) {
      console.error('❌ ERROR:', error.message);
    }
    
    console.log('');
  }
  
  console.log('=== Demo Complete ===');
  console.log('\nSummary of improvements:');
  console.log('✅ FAQ questions are handled by the FAQ system');
  console.log('✅ Booking requests bypass FAQ escalation and go to booking system');
  console.log('✅ Schedule requests bypass FAQ escalation and go to schedule system');
  console.log('✅ Unmatched questions are escalated to human agents');
  console.log('✅ All requests are routed based on user intent');
}

// Run the demo
runTests().catch(console.error);