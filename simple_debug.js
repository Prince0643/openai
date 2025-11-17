import faqManager from './faqManager.js';

// Simple test
console.log('Loading FAQs...');
faqManager.getFAQData().then(faqs => {
  console.log(`Loaded ${faqs.length} FAQs`);
  
  // Print all FAQ questions to see what's there
  console.log('\nAll FAQ questions:');
  faqs.forEach((faq, index) => {
    console.log(`${index + 1}. "${faq.question}"`);
  });
  
  // Test specific question
  console.log('\nTesting specific question...');
  faqManager.checkFAQ("do you have a monthly membership?").then(result => {
    console.log('Result:', result);
  });
});