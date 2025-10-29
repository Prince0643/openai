import { isLowConfidenceResponse, isNonsenseOrUnknown, handleFallback } from "./fallbackManager.js";

async function testFallbackFunctionality() {
  console.log("Testing fallback and escalation functionality...\n");
  
  // Test 1: Check low confidence responses
  console.log("=== Test 1: Low confidence response detection ===");
  const lowConfidenceExamples = [
    "I don't know what you're asking about.",
    "I'm not sure I understand your question.",
    "Can you clarify what you mean?",
    "I'm confused by your request.",
    "I don't have information on that."
  ];
  
  lowConfidenceExamples.forEach(example => {
    const isLow = isLowConfidenceResponse(example);
    console.log(`"${example}" -> Low confidence: ${isLow}`);
  });
  
  console.log();
  
  // Test 2: Check normal confidence responses
  console.log("=== Test 2: Normal confidence response detection ===");
  const normalExamples = [
    "We have yoga classes every Monday at 6 PM.",
    "Your membership expires on December 31st.",
    "You can book that class through our app.",
    "Our gym is open from 6 AM to 10 PM daily."
  ];
  
  normalExamples.forEach(example => {
    const isLow = isLowConfidenceResponse(example);
    console.log(`"${example}" -> Low confidence: ${isLow}`);
  });
  
  console.log();
  
  // Test 3: Check nonsense or unknown queries
  console.log("=== Test 3: Nonsense or unknown query detection ===");
  const nonsenseExamples = [
    "asdf",
    "12345",
    "!!!!",
    "aaaaa",
    "99999",
    "a"
  ];
  
  nonsenseExamples.forEach(example => {
    const isNonsense = isNonsenseOrUnknown(example);
    console.log(`"${example}" -> Nonsense: ${isNonsense}`);
  });
  
  console.log();
  
  // Test 4: Check normal queries
  console.log("=== Test 4: Normal query detection ===");
  const normalQueries = [
    "What classes do you have today?",
    "How much does a membership cost?",
    "I'd like to book a yoga class",
    "What are your opening hours?"
  ];
  
  normalQueries.forEach(example => {
    const isNonsense = isNonsenseOrUnknown(example);
    console.log(`"${example}" -> Nonsense: ${isNonsense}`);
  });
  
  console.log();
  
  // Test 5: Handle fallback for nonsense query
  console.log("=== Test 5: Handling fallback for nonsense query ===");
  const nonsenseFallback = handleFallback(
    "user_001", 
    "asdf", 
    "I'm not sure what you're asking", 
    "thread_123"
  );
  
  console.log(`Response: ${nonsenseFallback.response}`);
  console.log(`Escalated: ${nonsenseFallback.escalated}`);
  if (nonsenseFallback.ticketId) {
    console.log(`Ticket ID: ${nonsenseFallback.ticketId}`);
  }
  console.log();
  
  // Test 6: Handle fallback for low confidence response
  console.log("=== Test 6: Handling fallback for low confidence response ===");
  const lowConfidenceFallback = handleFallback(
    "user_002", 
    "What is your refund policy?", 
    "I don't know about refunds.", 
    "thread_456"
  );
  
  console.log(`Response: ${lowConfidenceFallback.response}`);
  console.log(`Escalated: ${lowConfidenceFallback.escalated}`);
  if (lowConfidenceFallback.ticketId) {
    console.log(`Ticket ID: ${lowConfidenceFallback.ticketId}`);
  }
  console.log();
  
  // Test 7: Handle normal response (no fallback needed)
  console.log("=== Test 7: Handling normal response (no fallback) ===");
  const normalFallback = handleFallback(
    "user_003", 
    "What time is yoga class?", 
    "Yoga classes are at 6 PM on Mondays and Wednesdays.", 
    "thread_789"
  );
  
  console.log(`Response: ${normalFallback.response}`);
  console.log(`Escalated: ${normalFallback.escalated}`);
  console.log();
  
  console.log("All tests completed!");
}

testFallbackFunctionality();