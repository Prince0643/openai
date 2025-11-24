import faqManager from './faqManager.js';
import { createTicket } from './staffHandoffManager.js';

/**
 * Check if a message is related to booking a class
 * @param {string} message - User's message
 * @returns {boolean} True if message is about booking a class
 */
function isBookingRequest(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('book') ||
    lowerMessage.includes('yoga') ||
    lowerMessage.includes('hiit') ||
    lowerMessage.includes('pilates') ||
    lowerMessage.includes('spin') ||
    lowerMessage.includes('handstands') ||
    lowerMessage.includes('strength');
}

/**
 * Check if a message is related to schedule inquiries
 * @param {string} message - User's message
 * @returns {boolean} True if message is about schedule
 */
function isScheduleRequest(message) {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('schedule') ||
    lowerMessage.includes('class') ||
    lowerMessage.includes('classes') ||
    lowerMessage.includes('today') ||
    lowerMessage.includes('tomorrow') ||
    lowerMessage.includes('week');
}

/**
 * FAQ Middleware for handling FAQ-based responses
 * @param {string} message - User's message
 * @param {string} userId - User ID
 * @param {string} platform - Messaging platform
 * @returns {Object|null} FAQ response or null if no match or if request should be handled by other systems
 */
async function handleFAQRequest(message, userId, platform) {
  try {
    // Check if this is a booking or schedule request that should be handled by specialized systems
    if (isBookingRequest(message) || isScheduleRequest(message)) {
      // Let the booking/schedule system handle these requests
      console.log(`Booking/schedule request detected: "${message}", allowing specialized handler to process`);
      return null;
    }

    // First, check if the question is in our FAQ database
    const faqResult = await faqManager.checkFAQ(message);

    if (faqResult.found) {
      // Found an FAQ match, return the predefined response
      console.log(`FAQ match found for question: "${message}"`);
      return {
        response: faqResult.reply,
        userId: userId,
        success: true,
        escalated: false,
        platform: platform,
        source: "faq"
      };
    } else {
      // No FAQ match found, escalate to human agent
      console.log(`No FAQ match found for question: "${message}", escalating to human agent`);

      // Create a ticket for the unanswered question
      const ticket = createTicket({
        userId: userId || "unknown_user",
        message: message,
        contactInfo: { email: "not_provided", phone: "not_provided" },
        category: "unanswered_faq",
        threadId: null
      });

      return {
        response: faqResult.reply, // This will be the "I'm not sure" message
        userId: userId,
        success: true,
        escalated: true,
        platform: platform,
        source: "faq_escalation",
        ticketId: ticket.ticketId
      };
    }
  } catch (error) {
    console.error('Error in FAQ middleware:', error);
    return null; // Let the normal flow handle the request
  }
}

/**
 * Get FAQ context for the AI (no direct answer, no escalation)
 * @param {string} message - User's message
 * @returns {Promise<Array<{question:string, reply:string}>>}
 */
async function getFAQContext(message) {
  try {
    // Still let booking/schedule stuff bypass FAQ context
    if (isBookingRequest(message) || isScheduleRequest(message)) {
      console.log(`Booking/schedule request detected: "${message}", skipping FAQ context`);
      return [];
    }

    const relatedFaqs = await faqManager.getTopRelevantFAQs(message, 5);
    console.log(`FAQ context fetched: ${relatedFaqs.length} entries for message "${message}"`);
    return relatedFaqs;
  } catch (error) {
    console.error("Error getting FAQ context:", error);
    return [];
  }
}


export { handleFAQRequest, getFAQContext };
