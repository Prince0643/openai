import fetch from 'node-fetch';

async function diagnoseMakeError() {
  console.log('🔍 Diagnosing Make.com 500 Error...\n');
  
  // Check 1: Server health
  console.log('1. Checking server health...');
  try {
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'OK') {
      console.log('   ✅ Server is running and healthy');
      console.log(`   📅 Server time: ${healthData.timestamp}`);
      
      // Check individual components
      console.log('   🔧 Component status:');
      Object.entries(healthData.config).forEach(([component, status]) => {
        console.log(`      ${component}: ${status ? '✅' : '❌'}`);
      });
    } else {
      console.log('   ❌ Server health check failed');
    }
  } catch (error) {
    console.log('   ❌ Unable to reach server - make sure it is running');
    console.log(`   Error: ${error.message}`);
    return;
  }
  
  // Check 2: Webhook endpoint accessibility
  console.log('\n2. Checking if localtunnel is running...');
  console.log('   🔍 Please verify you have a terminal running:');
  console.log('   Command: npx localtunnel --port 3000');
  console.log('   Look for output like: "your url is: https://subdomain.loca.lt"');
  
  // Check 3: Test a simple request to the webhook
  console.log('\n3. Testing webhook endpoint with a simple request...');
  console.log('   ⚠️  To test this, you need to run this command in a new terminal:');
  console.log('   Replace YOUR_URL with your actual localtunnel URL:');
  console.log('');
  console.log('   PowerShell:');
  console.log('   Invoke-WebRequest -Uri "https://YOUR_URL/make/webhook" -Method POST -ContentType "application/json" -Body \'{"message": "Test", "userId": "test123"}\' -UseBasicParsing');
  console.log('');
  console.log('   CMD:');
  console.log('   curl -X POST https://YOUR_URL/make/webhook -H "Content-Type: application/json" -d "{\\"message\\": \\"Test\\", \\"userId\\": \\"test123\\"}"');
  
  // Check 4: Verify environment variables
  console.log('\n4. Verifying environment configuration...');
  console.log('   🔍 Check your .env file for these required variables:');
  console.log('   - BACKEND_API_KEY');
  console.log('   - GYMMASTER_API_KEY');
  console.log('   - GYMMASTER_BASE_URL');
  console.log('   - OPENAI_API_KEY');
  
  console.log('\n📋 For detailed troubleshooting of 500 errors, see:');
  console.log('   TROUBLESHOOT_MAKE_COM_500_ERROR.md');
  
  console.log('\n💡 Tips:');
  console.log('   1. Make sure both server and localtunnel terminals are running');
  console.log('   2. Check server logs for error messages when the request fails');
  console.log('   3. Verify your Make.com HTTP module configuration');
  console.log('   4. Test with a simple payload first');
}

diagnoseMakeError();