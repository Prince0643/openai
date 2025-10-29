import { 
  containsRefundPromises, 
  handleRefundsGuardrail, 
  isAskingAboutRefunds, 
  handleRefundInquiry 
} from "./refundsGuardrail.js";

async function testRefundsGuardrail() {
  console.log("Testing refunds/freebies guardrail functionality...\n");
  
  // Test 1: Check refund promise detection
  console.log("=== Test 1: Refund promise detection ===");
  const refundPromises = [
    "I can give you a refund for that",
    "I'll refund your membership fee",
    "We can refund the class cost",
    "I can offer you credit for next time",
    "I'll give you credit for a free class",
    "We can give you a free trial",
    "I can waive the cancellation fee"
  ];
  
  refundPromises.forEach(promise => {
    const contains = containsRefundPromises(promise);
    console.log(`"${promise}" -> Contains refund promise: ${contains}`);
  });
  
  console.log();
  
  // Test 2: Check normal responses
  console.log("=== Test 2: Normal response detection ===");
  const normalResponses = [
    "We have yoga classes every Monday at 6 PM.",
    "Your membership expires on December 31st.",
    "You can book that class through our app.",
    "Our gym is open from 6 AM to 10 PM daily."
  ];
  
  normalResponses.forEach(response => {
    const contains = containsRefundPromises(response);
    console.log(`"${response}" -> Contains refund promise: ${contains}`);
  });
  
  console.log();
  
  // Test 3: Check refund inquiry detection
  console.log("=== Test 3: Refund inquiry detection ===");
  const refundInquiries = [
    "Can I get a refund for my missed class?",
    "Do you offer credit for cancelled sessions?",
    "Is there a free trial available?",
    "Can you waive the late fee?",
    "What's your refund policy?"
  ];
  
  refundInquiries.forEach(inquiry => {
    const isAsking = isAskingAboutRefunds(inquiry);
    console.log(`"${inquiry}" -> Asking about refunds: ${isAsking}`);
  });
  
  console.log();
  
  // Test 4: Check normal inquiries
  console.log("=== Test 4: Normal inquiry detection ===");
  const normalInquiries = [
    "What classes do you have today?",
    "How much does a membership cost?",
    "I'd like to book a yoga class",
    "What are your opening hours?"
  ];
  
  normalInquiries.forEach(inquiry => {
    const isAsking = isAskingAboutRefunds(inquiry);
    console.log(`"${inquiry}" -> Asking about refunds: ${isAsking}`);
  });
  
  console.log();
  
  // Test 5: Handle refund inquiry escalation
  console.log("=== Test 5: Handling refund inquiry escalation ===");
  const inquiryResult = handleRefundInquiry("user_001", "Can I get a refund?", "thread_123");
  
  console.log(`Response: ${inquiryResult.response}`);
  console.log(`Escalated: ${inquiryResult.escalated}`);
  console.log(`Ticket ID: ${inquiryResult.ticketId}`);
  console.log(`Violation type: ${inquiryResult.violationType}`);
  console.log();
  
  // Test 6: Handle refund promise escalation
  console.log("=== Test 6: Handling refund promise escalation ===");
  const promiseResult = handleRefundsGuardrail(
    "user_002", 
    "I want a refund", 
    "I can give you a refund for that", 
    "thread_456"
  );
  
  console.log(`Response: ${promiseResult.response}`);
  console.log(`Escalated: ${promiseResult.escalated}`);
  console.log(`Ticket ID: ${promiseResult.ticketId}`);
  console.log(`Violation type: ${promiseResult.violationType}`);
  console.log();
  
  // Test 7: Handle normal response (no escalation needed)
  console.log("=== Test 7: Handling normal response (no escalation) ===");
  const normalResult = handleRefundsGuardrail(
    "user_003", 
    "What time is yoga class?", 
    "Yoga classes are at 6 PM on Mondays and Wednesdays.", 
    "thread_789"
  );
  
  console.log(`Response: ${normalResult.response}`);
  console.log(`Escalated: ${normalResult.escalated}`);
  console.log();
  
  console.log("All tests completed!");
}

testRefundsGuardrail();