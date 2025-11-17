import faqManager from './faqManager.js';

async function testFAQ() {
  console.log('Testing FAQ Manager...');
  
  // Test fetching FAQ data
  console.log('Fetching FAQ data...');
  const faqs = await faqManager.getFAQData();
  console.log(`Loaded ${faqs.length} FAQs`);
  
  // Test a few sample questions
  const testQuestions = [
    "What types of classes do you offer?",
    "How do I book a class?",
    "What are your operating hours?",
    "Do you have monthly memberships?",
    "What is your refund policy?"
  ];
  
  for (const question of testQuestions) {
    console.log(`\nTesting question: "${question}"`);
    const result = await faqManager.checkFAQ(question);
    if (result.found) {
      console.log(`Found match: ${result.question}`);
      console.log(`Reply: ${result.reply.substring(0, 100)}...`);
    } else {
      console.log('No match found');
      console.log(`Reply: ${result.reply}`);
    }
  }
}

testFAQ().catch(console.error);