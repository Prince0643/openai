// Simple test to check FAQ functionality
import faqManager from './faqManager.js';

// Test the specific question
const testQuestion = "do you have a monthly membership?";

console.log('Testing FAQ system with question:', testQuestion);

// Test the normalize function
console.log('Normalized question:', faqManager.normalizeText(testQuestion));

// Test the FAQ check
faqManager.checkFAQ(testQuestion).then(result => {
  console.log('FAQ Check Result:', result);
  
  if (result.found) {
    console.log('✅ FAQ match found!');
    console.log('Question:', result.question);
    console.log('Reply:', result.reply);
  } else {
    console.log('❌ No FAQ match found');
    console.log('Reply:', result.reply);
  }
}).catch(error => {
  console.error('Error:', error);
});