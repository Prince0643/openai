import GymMasterAPI from './gymmaster.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const GYMMASTER_API_KEY = process.env.GYMMASTER_API_KEY;
const GYMMASTER_BASE_URL = process.env.GYMMASTER_BASE_URL;

if (!GYMMASTER_API_KEY || !GYMMASTER_BASE_URL) {
  console.error('Missing GYMMASTER_API_KEY or GYMMASTER_BASE_URL in environment variables');
  process.exit(1);
}

const gymMaster = new GymMasterAPI(GYMMASTER_API_KEY, GYMMASTER_BASE_URL);

async function testGymMaster() {
  try {
    console.log('Testing GymMaster API...');
    const today = new Date().toISOString().split('T')[0];
    const schedule = await gymMaster.getClassSchedule(today);
    
    console.log('Schedule response:');
    console.log(JSON.stringify(schedule, null, 2));
    
    if (schedule && schedule.length > 0) {
      console.log('\nFirst class details:');
      console.log(`classId: ${schedule[0].classId}`);
      console.log(`id: ${schedule[0].id}`);
      console.log(`name: ${schedule[0].name}`);
    }
  } catch (error) {
    console.error('Error testing GymMaster API:', error);
  }
}

testGymMaster();