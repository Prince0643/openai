import faqManager from './faqManager.js';

async function debugFAQ() {
  console.log('Debugging FAQ Manager...');
  
  // Test fetching FAQ data
  console.log('Fetching FAQ data...');
  const faqs = await faqManager.getFAQData();
  console.log(`Loaded ${faqs.length} FAQs`);
  
  // Look for membership-related questions
  console.log('\nMembership-related FAQs:');
  const membershipFaqs = faqs.filter(faq => 
    faq.question && 
    (faq.question.toLowerCase().includes('membership') || 
     faq.question.toLowerCase().includes('monthly'))
  );
  
  membershipFaqs.forEach((faq, index) => {
    console.log(`${index + 1}. Question: "${faq.question}"`);
    console.log(`   Reply: "${faq.reply.substring(0, 50)}..."`);
  });
  
  // Test the specific question
  const testQuestion = "do you have a monthly membership?";
  console.log(`\nTesting question: "${testQuestion}"`);
  
  const result = await faqManager.findMatchingFAQ(testQuestion);
  if (result) {
    console.log(`Found match: "${result.question}"`);
    console.log(`Reply: "${result.reply}"`);
  } else {
    console.log('No match found');
    
    // Let's manually check normalization
    console.log('\nDebugging normalization:');
    console.log(`Normalized user question: "${faqManager.normalizeText(testQuestion)}"`);
    
    // Check each FAQ question normalization
    for (const faq of faqs) {
      const normalizedFaqQuestion = faqManager.normalizeText(faq.question);
      if (normalizedFaqQuestion.includes('membership') && normalizedFaqQuestion.includes('monthly')) {
        console.log(`FAQ question: "${faq.question}"`);
        console.log(`Normalized FAQ question: "${normalizedFaqQuestion}"`);
      }
    }
  }
}

debugFAQ().catch(console.error);