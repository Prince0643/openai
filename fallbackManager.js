import { createTicket } from "./staffHandoffManager.js";

/**
 * Check if a response indicates low confidence or confusion
 * @param {string} responseText The assistant's response text
 * @returns {boolean} Whether the response indicates low confidence
 */
function isLowConfidenceResponse(responseText) {
  if (!responseText) return true;
  
  // Common indicators of low confidence or confusion
  const lowConfidenceIndicators = [
    "i don't know",
    "i'm not sure",
    "i don't understand",
    "confused",
    "unclear",
    "not clear",
    "can you clarify",
    "what do you mean",
    "i'm sorry, but",
    "i cannot",
    "i can't",
    "unable to",
    "not able to",
    "don't have information",
    "don't have the information",
    "i don't have",
    "i do not have",
    "no information",
    "no info",
    "i'm not familiar",
    "i'm unfamiliar",
    "beyond my knowledge",
    "outside my knowledge",
    "i cannot help",
    "i can't help"
  ];
  
  const lowerText = responseText.toLowerCase();
  
  // Check for low confidence indicators
  for (const indicator of lowConfidenceIndicators) {
    if (lowerText.includes(indicator)) {
      return true;
    }
  }
  
  // Check for very short responses that might indicate confusion
  if (responseText.trim().length < 10) {
    return true;
  }
  
  // Check for repeated questioning or uncertainty
  if (responseText.includes("?") && responseText.split("?").length > 2) {
    return true;
  }
  
  return false;
}

/**
 * Check if a message is nonsense or unknown
 * @param {string} message The user's message
 * @returns {boolean} Whether the message is nonsense or unknown
 */
function isNonsenseOrUnknown(message) {
  if (!message) return true;
  
  const trimmedMessage = message.trim();
  
  // Very short messages might be nonsense
  if (trimmedMessage.length < 3) {
    return true;
  }
  
  // Common nonsense patterns
  const nonsensePatterns = [
    /^[a-zA-Z]\s*$/, // Single letter
    /^\d+\s*$/, // Just numbers
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+\s*$/, // Just special characters
    /^([a-zA-Z])\1{4,}$/, // Repeated letters
    /^([0-9])\1{4,}$/, // Repeated numbers
  ];
  
  for (const pattern of nonsensePatterns) {
    if (pattern.test(trimmedMessage)) {
      return true;
    }
  }
  
  // Additional check for very short random strings (less than 5 chars)
  if (trimmedMessage.length < 5) {
    // Check if it's mostly non-alphabetic characters
    const nonAlphaCount = (trimmedMessage.match(/[^a-zA-Z\s]/g) || []).length;
    if (nonAlphaCount > trimmedMessage.length / 2) {
      return true;
    }
  }
  
  // Check if it's a random string of letters (no spaces, no meaningful words)
  if (trimmedMessage.length < 10 && !/\s/.test(trimmedMessage)) {
    // Simple heuristic: if it's all letters but doesn't contain common English letter patterns
    // This is a simplified check - in practice you might want a more sophisticated approach
    const commonWords = ['hi', 'hey', 'ok', 'yes', 'no'];
    const isCommonWord = commonWords.some(word => trimmedMessage.toLowerCase().includes(word));
    if (!isCommonWord && trimmedMessage.length > 3) {
      // Check if it looks like a random string
      const vowels = (trimmedMessage.match(/[aeiou]/gi) || []).length;
      const consonants = trimmedMessage.length - vowels;
      // If there are no vowels or an extreme vowel-to-consonant ratio, likely nonsense
      if (vowels === 0 || vowels / consonants > 0.8 || consonants / vowels > 3) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Handle fallback and escalation for low confidence responses
 * @param {string} userId User ID
 * @param {string} message Original user message
 * @param {string} responseText Assistant's response
 * @param {string} threadId Conversation thread ID
 * @returns {Object} Fallback response with escalation if needed
 */
function handleFallback(userId, message, responseText, threadId) {
  // Check if this is a nonsense or unknown query
  if (isNonsenseOrUnknown(message)) {
    // Create a staff ticket for nonsense queries
    const ticket = createTicket({
      userId: userId,
      message: message,
      contactInfo: { email: "not_provided", phone: "not_provided" },
      category: "nonsense_query",
      threadId: threadId
    });
    
    return {
      response: "I don't want to give you the wrong info. I've passed this to our team who will reply shortly.",
      escalated: true,
      ticketId: ticket.ticketId
    };
  }
  
  // Check if the assistant's response indicates low confidence
  if (isLowConfidenceResponse(responseText)) {
    // Create a staff ticket for low confidence responses
    const ticket = createTicket({
      userId: userId,
      message: message,
      contactInfo: { email: "not_provided", phone: "not_provided" },
      category: "low_confidence",
      threadId: threadId
    });
    
    return {
      response: "I don't want to give you the wrong info. I've passed this to our team who will reply shortly.",
      escalated: true,
      ticketId: ticket.ticketId
    };
  }
  
  // If we get here, the response seems reasonable
  return {
    response: responseText,
    escalated: false
  };
}

/**
 * Handle tool call errors with fallback
 * @param {string} userId User ID
 * @param {string} message Original user message
 * @param {string} error Error message
 * @param {string} threadId Conversation thread ID
 * @returns {Object} Fallback response with escalation
 */
function handleToolError(userId, message, error, threadId) {
  // Create a staff ticket for tool errors
  const ticket = createTicket({
    userId: userId,
    message: `Tool error: ${error}. Original message: ${message}`,
    contactInfo: { email: "not_provided", phone: "not_provided" },
    category: "tool_error",
    threadId: threadId
  });
  
  return {
    response: "I'm having trouble processing your request right now. I've passed this to our team who will help you shortly.",
    escalated: true,
    ticketId: ticket.ticketId
  };
}

export {
  isLowConfidenceResponse,
  isNonsenseOrUnknown,
  handleFallback,
  handleToolError
};