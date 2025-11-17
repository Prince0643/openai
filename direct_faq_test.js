import { handleFAQRequest } from './faqMiddleware.js';

async function testMembershipFAQ() {
  console.log('Direct FAQ test for membership question...');
  
  try {
    const testMessage = "do you have a monthly membership?";
    console.log(`Testing with message: "${testMessage}"`);
    
    const result = await handleFAQRequest(testMessage, 'test_user', 'test');
    
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result && result.response) {
      console.log('\nResponse text:', result.response);
      if (result.response.includes('human agent')) {
        console.log('\n⚠️  Still escalating to human agent - FAQ match not found');
      } else {
        console.log('\n✅ Found FAQ match!');
      }
    } else {
      console.log('\n❌ No result returned');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testMembershipFAQ();