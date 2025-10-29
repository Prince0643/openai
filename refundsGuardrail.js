import { createTicket } from "./staffHandoffManager.js";

/**
 * Check if a response contains refund, credit, or free trial promises
 * @param {string} responseText The assistant's response text
 * @returns {boolean} Whether the response contains prohibited promises
 */
function containsRefundPromises(responseText) {
  if (!responseText) return false;
  
  // Common phrases that indicate refund/credit/free trial promises
  const prohibitedPhrases = [
    "i can give you a refund",
    "i'll refund",
    "we can refund",
    "refund you",
    "i can offer you credit",
    "i'll give you credit",
    "we can give you credit",
    "free trial",
    "free class",
    "free membership",
    "complimentary",
    "on the house",
    "at no cost",
    "free of charge",
    "zero cost",
    "no charge",
    "gratis",
    "i can waive",
    "we can waive",
    "i'll waive",
    "waive the fee",
    "waive charges"
  ];
  
  const lowerText = responseText.toLowerCase();
  
  // Check for prohibited phrases
  for (const phrase of prohibitedPhrases) {
    if (lowerText.includes(phrase)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Handle refund/credit/free trial guardrail
 * @param {string} userId User ID
 * @param {string} message Original user message
 * @param {string} responseText Assistant's response
 * @param {string} threadId Conversation thread ID
 * @returns {Object} Guardrail response with escalation if needed
 */
function handleRefundsGuardrail(userId, message, responseText, threadId) {
  // Check if the assistant's response contains prohibited promises
  if (containsRefundPromises(responseText)) {
    // Create a staff ticket for refund/credit/free trial promises
    const ticket = createTicket({
      userId: userId,
      message: `Prohibited promise detected: ${message}`,
      contactInfo: { email: "not_provided", phone: "not_provided" },
      category: "refund_violation",
      threadId: threadId
    });
    
    return {
      response: "I don't want to give you the wrong info. I've passed this to our team who will reply shortly.",
      escalated: true,
      ticketId: ticket.ticketId,
      violationType: "refund_promise"
    };
  }
  
  // If we get here, the response doesn't contain prohibited promises
  return {
    response: responseText,
    escalated: false
  };
}

/**
 * Check if a user message is asking about refunds/credits/freebies
 * @param {string} message The user's message
 * @returns {boolean} Whether the message is about refunds/credits/freebies
 */
function isAskingAboutRefunds(message) {
  if (!message) return false;
  
  // Common phrases indicating user is asking about refunds/credits/freebies
  const refundQueries = [
    "refund",
    "credit",
    "free trial",
    "free class",
    "free membership",
    "complimentary",
    "waive",
    "discount"
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for refund-related queries
  for (const query of refundQueries) {
    if (lowerMessage.includes(query)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Handle refund/credit/freebie inquiries with escalation
 * @param {string} userId User ID
 * @param {string} message Original user message
 * @param {string} threadId Conversation thread ID
 * @returns {Object} Escalated response for refund inquiries
 */
function handleRefundInquiry(userId, message, threadId) {
  // Always escalate refund/credit/freebie inquiries
  const ticket = createTicket({
    userId: userId,
    message: `Refund/credit inquiry: ${message}`,
    contactInfo: { email: "not_provided", phone: "not_provided" },
    category: "refund_inquiry",
    threadId: threadId
  });
  
  return {
    response: "I don't want to give you the wrong info. I've passed this to our team who will reply shortly.",
    escalated: true,
    ticketId: ticket.ticketId,
    violationType: "refund_inquiry"
  };
}

export {
  containsRefundPromises,
  handleRefundsGuardrail,
  isAskingAboutRefunds,
  handleRefundInquiry
};