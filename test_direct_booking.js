// This test directly calls the booking functionality to verify it works
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Import the GymMaster API client
import GymMasterAPI from './gymmaster.js';

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

async function testDirectBooking() {
  console.log('Testing direct booking functionality...');
  
  try {
    // Test getting today's schedule
    console.log('\n--- Getting Today\'s Schedule ---');
    const today = new Date().toISOString().split('T')[0];
    const schedule = await gymMaster.getClassSchedule(today);
    console.log(`Found ${schedule.length} classes for today`);
    
    // Test finding specific classes
    const testClasses = ['yoga', 'hiit', 'spin'];
    
    for (const className of testClasses) {
      console.log(`\n--- Finding Next ${className.toUpperCase()} Class ---`);
      const nextClass = findNextSpecificClass(schedule, className);
      
      if (nextClass) {
        const classTime = new Date(nextClass.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const classDate = new Date(nextClass.start).toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'});
        console.log(`Next ${className} class: ${nextClass.name} at ${classTime} on ${classDate}`);
        if (nextClass.coach) {
          console.log(`Coach: ${nextClass.coach}`);
        }
        console.log(`Booking link: https://omni.gymmasteronline.com/portal/account/book/class${nextClass.classId ? `?classId=${nextClass.classId}` : '/schedule'}`);
      } else {
        console.log(`No upcoming ${className} classes found for today`);
        console.log(`General booking link: https://omni.gymmasteronline.com/portal/account/book/class/schedule`);
      }
    }
    
    console.log('\n--- Direct Booking Test Complete ---');
  } catch (error) {
    console.error('Error in direct booking test:', error.message);
  }
}

// Run the test
testDirectBooking();