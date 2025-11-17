// This script demonstrates what the actual responses look like
import faqManager from './faqManager.js';
import GymMasterAPI from './gymmaster.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Initialize GymMaster API client
const gymMaster = new GymMasterAPI(
  process.env.GYMMASTER_API_KEY,
  process.env.GYMMASTER_BASE_URL
);

// Function to find the next specific class (copied from openaitomanychat.js)
function findNextSpecificClass(schedule, className) {
  if (!schedule || !Array.isArray(schedule)) return null;
  
  const now = new Date();
  // Filter classes that match the name and are in the future
  const matchingClasses = schedule
    .filter(classItem => 
      classItem.name && 
      classItem.name.toLowerCase().includes(className.toLowerCase()) &&
      new Date(classItem.start) > now
    )
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  
  return matchingClasses.length > 0 ? matchingClasses[0] : null;
}

async function demonstrateResponses() {
  console.log('=== Response Demonstration ===\n');
  
  // FAQ Responses
  console.log('--- FAQ Responses ---');
  
  const faqQuestions = [
    "What types of classes do you offer?",
    "How do I book a class?"
  ];
  
  for (const question of faqQuestions) {
    console.log(`\nQuestion: "${question}"`);
    try {
      const result = await faqManager.checkFAQ(question);
      if (result.found) {
        console.log(`Response: ${result.reply}`);
      } else {
        console.log(`Response: ${result.reply} (Escalated to human)`);
      }
    } catch (error) {
      console.error(`Error:`, error.message);
    }
  }
  
  // Booking/Schedule Responses
  console.log('\n--- Booking/Schedule Responses ---');
  
  try {
    // Get today's schedule
    const today = new Date().toISOString().split('T')[0];
    const schedule = await gymMaster.getClassSchedule(today);
    console.log(`\nToday's Schedule (${today}):`);
    console.log(`Found ${schedule.length} classes\n`);
    
    // Show specific class examples
    const classTypes = ['yoga', 'hiit', 'spin'];
    
    for (const classType of classTypes) {
      console.log(`--- Next ${classType.toUpperCase()} Class ---`);
      const nextClass = findNextSpecificClass(schedule, classType);
      
      if (nextClass) {
        const classTime = new Date(nextClass.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const classDate = new Date(nextClass.start).toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'});
        console.log(`Class: ${nextClass.name}`);
        console.log(`Time: ${classTime} on ${classDate}`);
        if (nextClass.coach) {
          console.log(`Coach: ${nextClass.coach}`);
        }
        console.log(`Booking Link: https://omni.gymmasteronline.com/portal/account/book/class${nextClass.classId ? `?classId=${nextClass.classId}` : '/schedule'}`);
      } else {
        console.log(`No upcoming ${classType} classes found`);
        console.log(`General Booking Link: https://omni.gymmasteronline.com/portal/account/book/class/schedule`);
      }
      console.log('');
    }
    
    // Show schedule view example
    console.log('--- Schedule View Example ---');
    if (schedule.length > 0) {
      // Show first few classes
      console.log('Here are some classes for today:');
      const limitedSchedule = schedule.slice(0, 3);
      limitedSchedule.forEach(classItem => {
        const classTime = new Date(classItem.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        console.log(`${classTime}: ${classItem.name}${classItem.coach ? ` with ${classItem.coach}` : ''}`);
      });
      console.log('\nFor the full schedule, visit: https://omni.gymmasteronline.com/portal/account/book/class/schedule');
    }
    
  } catch (error) {
    console.error('Error getting schedule:', error.message);
  }
  
  console.log('\n=== Demonstration Complete ===');
}

// Run the demonstration
demonstrateResponses().catch(console.error);