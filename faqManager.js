import fetch from 'node-fetch';

class FAQManager {
  constructor() {
    // Google Sheet ID from the provided URL
    this.sheetId = '1SJ3SV9zpBZPOFXSaDhOoxILJ__-NfLwyuypE1ECTRIk';
    // Sheet name
    this.sheetName = 'All';
    // Google Sheets API endpoint
    this.apiEndpoint = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:json&sheet=${this.sheetName}`;
    // Cache for FAQ data
    this.faqCache = [];
    this.lastUpdated = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry
  }

  /**
   * Fetch FAQ data from Google Sheets
   */
  async fetchFAQData() {
    try {
      console.log('Fetching FAQ data from Google Sheets...');
      const response = await fetch(this.apiEndpoint);
      const text = await response.text();
      
      // Parse the Google Sheets JSON response
      // The response is wrapped in a function call, so we need to extract the JSON
      const jsonStart = text.indexOf('(') + 1;
      const jsonEnd = text.lastIndexOf(')');
      const jsonString = text.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonString);
      
      // Transform the data into a more usable format
      const faqs = [];
      const rows = data.table.rows;
      
      // Skip the header row and process each FAQ entry
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].c;
        if (row && row.length >= 4) {
          const faq = {
            id: row[0] ? row[0].v : null, // No
            question: row[1] ? row[1].v : '', // Question
            platform: row[2] ? row[2].v : '', // Platform
            reply: row[3] ? row[3].v : '' // Reply
          };
          
          // Only add FAQs that have both question and reply
          if (faq.question && faq.reply) {
            faqs.push(faq);
          }
        }
      }
      
      this.faqCache = faqs;
      this.lastUpdated = new Date();
      console.log(`Successfully loaded ${faqs.length} FAQs from Google Sheets`);
      
      return faqs;
    } catch (error) {
      console.error('Error fetching FAQ data from Google Sheets:', error);
      return this.faqCache; // Return cached data if available
    }
  }

  /**
   * Get FAQ data (with caching)
   */
  async getFAQData() {
    // Check if cache is expired or empty
    const now = new Date();
    if (!this.lastUpdated || 
        (now - this.lastUpdated) > this.cacheExpiry || 
        this.faqCache.length === 0) {
      await this.fetchFAQData();
    }
    
    return this.faqCache;
  }

  /**
   * Normalize text for comparison
   * @param {string} text - Text to normalize
   * @returns {string} Normalized text
   */
  normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  /**
   * Calculate similarity between two strings
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score (0-1)
   */
  calculateSimilarity(str1, str2) {
    const normalizedStr1 = this.normalizeText(str1);
    const normalizedStr2 = this.normalizeText(str2);
    
    if (normalizedStr1 === normalizedStr2) return 1;
    if (normalizedStr1.includes(normalizedStr2) || normalizedStr2.includes(normalizedStr1)) return 0.9;
    
    // Split into words and check overlap
    const words1 = normalizedStr1.split(/\s+/).filter(word => word.length > 2);
    const words2 = normalizedStr2.split(/\s+/).filter(word => word.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const commonWords = words1.filter(word1 => 
      words2.some(word2 => word1.includes(word2) || word2.includes(word1))
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Find matching FAQ for a user question
   * @param {string} userQuestion - The user's question
   * @returns {Object|null} Matching FAQ or null if not found
   */
  async findMatchingFAQ(userQuestion) {
    if (!userQuestion) return null;
    
    const faqs = await this.getFAQData();
    const normalizedUserQuestion = this.normalizeText(userQuestion);
    
    // First try exact match
    for (const faq of faqs) {
      if (faq.question && this.normalizeText(faq.question) === normalizedUserQuestion) {
        return faq;
      }
    }
    
    // Special handling for membership-related queries
    // Check if user is asking about memberships and find any membership-related FAQ
    const lowerUserQuestion = userQuestion.toLowerCase();
    const isMembershipQuery = lowerUserQuestion.includes('membership') || 
                             lowerUserQuestion.includes('monthly') || 
                             lowerUserQuestion.includes('yearly') || 
                             lowerUserQuestion.includes('annual') ||
                             (lowerUserQuestion.includes('have') && lowerUserQuestion.includes('plan'));
    
    if (isMembershipQuery) {
      // Look for membership-related FAQs with higher priority
      for (const faq of faqs) {
        if (faq.question) {
          const lowerFAQQuestion = faq.question.toLowerCase();
          if (lowerFAQQuestion.includes('membership') || 
              lowerFAQQuestion.includes('plan') ||
              lowerFAQQuestion.includes('monthly') ||
              lowerFAQQuestion.includes('yearly') ||
              lowerFAQQuestion.includes('annual')) {
            // Calculate similarity for membership-related questions with a lower threshold
            const similarity = this.calculateSimilarity(userQuestion, faq.question);
            if (similarity >= 0.5) { // Lower threshold for membership queries
              return faq;
            }
          }
        }
      }
    }
    
    // Then try high similarity matches (>= 0.7)
    let bestMatch = null;
    let bestSimilarity = 0;
    
    for (const faq of faqs) {
      if (faq.question) {
        const similarity = this.calculateSimilarity(userQuestion, faq.question);
        if (similarity > bestSimilarity && similarity >= 0.7) {
          bestSimilarity = similarity;
          bestMatch = faq;
        }
      }
    }
    
    // If no high similarity match, try partial matches
    if (!bestMatch) {
      const lowerUserQuestion = userQuestion.toLowerCase();
      for (const faq of faqs) {
        if (faq.question) {
          const lowerFAQQuestion = faq.question.toLowerCase();
          // Check if the user question contains the FAQ question or vice versa
          if (lowerUserQuestion.includes(lowerFAQQuestion) || 
              lowerFAQQuestion.includes(lowerUserQuestion)) {
            return faq;
          }
        }
      }
    }
    
    // Additional fuzzy matching for common variations
    if (!bestMatch && isMembershipQuery) {
      for (const faq of faqs) {
        if (faq.question) {
          const lowerFAQQuestion = faq.question.toLowerCase();
          const hasMembershipKeywords = lowerFAQQuestion.includes('membership') || 
                                       lowerFAQQuestion.includes('plan') ||
                                       lowerFAQQuestion.includes('monthly') ||
                                       lowerFAQQuestion.includes('yearly') ||
                                       lowerFAQQuestion.includes('annual');
          
          if (hasMembershipKeywords) {
            // Even if similarity is low, if both are membership-related, consider it a match
            const userWords = normalizedUserQuestion.split(/\s+/);
            const faqWords = this.normalizeText(lowerFAQQuestion).split(/\s+/);
            const commonWords = userWords.filter(word => faqWords.includes(word));
            
            // If they share significant keywords, consider it a match
            if (commonWords.length >= 2) {
              return faq;
            }
          }
        }
      }
    }
    
    return bestMatch;
  }

  /**
   * Check if a question is covered in the FAQ
   * @param {string} userQuestion - The user's question
   * @returns {Object} Result with reply or indication that question is not covered
   */
  async checkFAQ(userQuestion) {
    try {
      const matchingFAQ = await this.findMatchingFAQ(userQuestion);
      
      if (matchingFAQ) {
        return {
          found: true,
          reply: matchingFAQ.reply,
          question: matchingFAQ.question
        };
      } else {
        return {
          found: false,
          reply: "I'm not sure about that. Let me connect you with a human agent who can help you better."
        };
      }
    } catch (error) {
      console.error('Error checking FAQ:', error);
      return {
        found: false,
        reply: "I'm having trouble accessing the FAQ database right now. Let me connect you with a human agent."
      };
    }
  }
}

// Export singleton instance
export default new FAQManager();