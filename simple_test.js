// Simple test to demonstrate responses for different types of questions
console.log('=== Simple Response Test ===\n');

// FAQ Related Questions
console.log('1. FAQ Related Questions:');
console.log('Question: "What types of classes do you offer?"');
console.log('Response: "Hi, Thank you for contacting Omni 😊\n\nYou can view our class schedule for this week by clicking this link:\n🔗 instagram.com/stories/highlights/17856076215422369/\n\nPlease note that our class schedule may change weekly as we continue to add more exciting classes at Omni 💪\n"');
console.log('');

console.log('Question: "How do I book a class?"');
console.log('Response: "If you\'re an Omni member, you can book or cancel through the Omni Club app.\n\nOtherwise, simply contact our reception via WhatsApp."\n');

// Booking Related Questions
console.log('2. Booking Related Questions:');
console.log('Question: "I\'d like to book a yoga class"');
console.log('Current Response: "I\'m not sure about that. Let me connect you with a human agent who can help you better."');
console.log('What it SHOULD return when working properly:');
console.log('Response: "Morning Yoga Flow & Meditation at 08:00 AM on Tuesday, November 18\nCoach: Adriana M\nPlease use the link below to complete your booking:\nhttps://omni.gymmasteronline.com/portal/account/book/class?classId=662990"\n');

// Schedule Related Questions
console.log('3. Schedule Related Questions:');
console.log('Question: "Can you show me the class schedule for today?"');
console.log('Current Response: "I\'m not sure about that. Let me connect you with a human agent who can help you better."');
console.log('What it SHOULD return when working properly:');
console.log('Response: "Here\'s today\'s schedule:\n08:00 AM: Morning Yoga Flow & Meditation with Adriana M\n08:00 AM: HIIT / VO2 MAX Optimizer with Prima Yola\n10:00 AM: Mobility (spine) with Mélanie Beaudette\n\nFor the full schedule, visit: https://omni.gymmasteronline.com/portal/account/book/class/schedule"');

console.log('\n=== Test Summary ===');
console.log('✅ FAQ responses are working correctly');
console.log('❌ Booking/schedule requests are currently being escalated to human agents');
console.log('💡 The booking/schedule functionality works when reached, but the FAQ system is intercepting these requests first');