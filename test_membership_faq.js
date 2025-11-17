import faqManager from './faqManager.js';

async function testMembershipFAQ() {
  console.log('Testing membership-related FAQ matching...');
  
  // Test the specific question that was failing
  const testQuestion = "do you have a monthly membership?";
  console.log(`Testing question: "${testQuestion}"`);
  
  const result = await faqManager.findMatchingFAQ(testQuestion);
  if (result) {
    console.log(`✓ Found match: "${result.question}"`);
    console.log(`  Reply: "${result.reply.substring(0, 100)}..."`);
  } else {
    console.log('✗ No match found');
    
    // Let's also test with checkFAQ which is what the middleware uses
    const checkResult = await faqManager.checkFAQ(testQuestion);
    console.log(`CheckFAQ result:`, checkResult);
  }
  
  // Test a few variations
  const variations = [
    "What membership options do you have?",
    "Do you offer monthly memberships?",
    "What are your membership plans?",
    "How much is a monthly membership?"
  ];
  
  console.log('\nTesting variations:');
  for (const variation of variations) {
    console.log(`\nTesting: "${variation}"`);
    const result = await faqManager.findMatchingFAQ(variation);
    if (result) {
      console.log(`✓ Found match: "${result.question}"`);
    } else {
      console.log('✗ No match found');
    }
  }
}

testMembershipFAQ().catch(console.error);