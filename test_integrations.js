import dotenv from 'dotenv';
import GymMasterAPI from './gymmaster.js';
import OpenAI from "openai";

// Load environment variables
const dotenvResult = dotenv.config();

const config = {
  GYMMASTER_API_KEY: dotenvResult.parsed?.GYMASTER_API_KEY || process.env.GYMMASTER_API_KEY,
  GYMMASTER_BASE_URL: dotenvResult.parsed?.GYMASTER_BASE_URL || process.env.GYMMASTER_BASE_URL,
  OPENAI_API_KEY: dotenvResult.parsed?.OPENAI_API_KEY || process.env.OPENAI_API_KEY
};

async function testGymMaster() {
  console.log('🔍 Testing GymMaster API Integration...\n');
  
  if (!config.GYMMASTER_API_KEY || !config.GYMMASTER_BASE_URL) {
    console.log('❌ GymMaster API key or base URL not configured in .env');
    return false;
  }
  
  try {
    const gymMaster = new GymMasterAPI(config.GYMMASTER_API_KEY, config.GYMMASTER_BASE_URL);
    
    console.log('✅ GymMaster API client initialized');
    console.log(`🔗 Base URL: ${config.GYMMASTER_BASE_URL}`);
    
    // Test public schedule
    console.log('\n📅 Testing public class schedule...');
    const today = new Date().toISOString().split('T')[0];
    const schedule = await gymMaster.getClassSchedule(today);
    
    console.log(`✅ Successfully fetched ${schedule.length} classes`);
    if (schedule.length > 0) {
      console.log('📋 Sample class:');
      console.log(`   ID: ${schedule[0].classId}`);
      console.log(`   Name: ${schedule[0].name}`);
      console.log(`   Time: ${schedule[0].start} - ${schedule[0].end}`);
      console.log(`   Available seats: ${schedule[0].seatsAvailable}`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ GymMaster API test failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testOpenAI() {
  console.log('\n🤖 Testing OpenAI Integration...\n');
  
  if (!config.OPENAI_API_KEY) {
    console.log('❌ OpenAI API key not configured in .env');
    return false;
  }
  
  try {
    const openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY
    });
    
    console.log('✅ OpenAI client initialized');
    
    // Test assistant retrieval
    console.log('\n📚 Testing assistant retrieval...');
    const assistant = await openai.beta.assistants.retrieve("asst_xy382A6ksEJ9JwYfSyVDfSBp");
    
    console.log(`✅ Assistant retrieved successfully`);
    console.log(`   Name: ${assistant.name}`);
    console.log(`   Model: ${assistant.model}`);
    console.log(`   Tools: ${assistant.tools.length} tools available`);
    
    // Test a simple completion
    console.log('\n💬 Testing simple completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello, this is a test message. Please respond with 'Test successful'." }
      ],
      max_tokens: 20
    });
    
    console.log(`✅ Completion test successful`);
    console.log(`   Response: ${completion.choices[0].message.content}`);
    
    return true;
  } catch (error) {
    console.log('❌ OpenAI test failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testBackendEndpoint() {
  console.log('\n🔌 Testing Backend Webhook Endpoint...\n');
  
  try {
    // Test the health endpoint
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'OK') {
      console.log('✅ Backend server is running and healthy');
      console.log(`   📅 Server time: ${healthData.timestamp}`);
      
      // Check individual components
      console.log('   🔧 Component status:');
      Object.entries(healthData.config).forEach(([component, status]) => {
        console.log(`      ${component}: ${status ? '✅' : '❌'}`);
      });
      
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend endpoint test failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Running Comprehensive Integration Tests...\n');
  
  const results = {
    gymmaster: await testGymMaster(),
    openai: await testOpenAI(),
    backend: await testBackendEndpoint()
  };
  
  console.log('\n📋 Test Summary:');
  console.log(`   GymMaster API: ${results.gymmaster ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   OpenAI: ${results.openai ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Backend Endpoint: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (!allPassed) {
    console.log('\n💡 Troubleshooting Tips:');
    if (!results.gymmaster) {
      console.log('   - Check GYMMASTER_API_KEY and GYMMASTER_BASE_URL in .env');
      console.log('   - Verify internet connectivity to GymMaster API');
    }
    if (!results.openai) {
      console.log('   - Check OPENAI_API_KEY in .env');
      console.log('   - Verify OpenAI API key has correct permissions');
    }
    if (!results.backend) {
      console.log('   - Ensure backend server is running (node openaitomanychat.js)');
      console.log('   - Check if port 3000 is available');
    }
  }
  
  return allPassed;
}

// Run the tests
runAllTests().catch(error => {
  console.error('Unexpected error during testing:', error);
});