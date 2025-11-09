import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { getOptedInUsers } from './broadcastManager.js';

// Load environment variables
const dotenvResult = dotenv.config();

// Wati API configuration
const WATI_CONFIG = {
  tenantId: process.env.WATI_TENANT_ID || dotenvResult.parsed?.WATI_TENANT_ID,
  apiKey: process.env.WATI_API_KEY || dotenvResult.parsed?.WATI_API_KEY,
  baseUrl: 'https://live-server-12345.wati.io' // Default base URL, should be overridden
};

/**
 * Send broadcast via Wati API
 * @param {string} templateId Template ID to send
 * @param {Array} testUserIds Optional list of test user IDs
 * @returns {Object} Result of the broadcast send operation
 */
async function sendWatiBroadcast(templateId, testUserIds = null) {
  try {
    // Validate Wati configuration
    if (!WATI_CONFIG.tenantId || !WATI_CONFIG.apiKey) {
      return {
        success: false,
        error: 'Wati configuration missing: tenantId or apiKey not set'
      };
    }

    // Get the template content from broadcast manager
    // In a real implementation, you would retrieve the actual template content
    // For now, we'll use a placeholder
    const templateContent = `Broadcast message for template: ${templateId}`;
    
    // Determine target users
    let targetUsers;
    if (testUserIds && Array.isArray(testUserIds)) {
      targetUsers = testUserIds;
    } else {
      // Get all opted-in users from broadcast manager
      targetUsers = getOptedInUsers();
    }

    // Prepare the broadcast payload for Wati API
    const broadcastPayload = {
      templateId: templateId,
      message: templateContent,
      recipientCount: targetUsers.length,
      // In a real implementation, you would map your user data to Wati's format
      recipients: targetUsers.map(userId => ({
        phoneNumber: `+1234567890`, // Placeholder - you would retrieve actual phone numbers
        userId: userId
      }))
    };

    // Send request to Wati broadcast API
    const response = await fetch(
      `https://${WATI_CONFIG.tenantId}.wati.io/api/v1/broadcast/scheduleBroadcast`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WATI_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(broadcastPayload)
      }
    );

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Wati API request failed with status ${response.status}: ${errorText}`
      };
    }

    // Parse response
    const responseData = await response.json();
    
    return {
      success: true,
      message: `Broadcast scheduled successfully via Wati API`,
      recipients: targetUsers.length,
      templateId: templateId,
      watiResponse: responseData
    };

  } catch (error) {
    console.error('Error sending Wati broadcast:', error);
    return {
      success: false,
      error: `Failed to send broadcast via Wati API: ${error.message}`
    };
  }
}

/**
 * Schedule a broadcast via Wati API endpoint
 * This function can be called from your existing broadcast/send endpoint
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
async function scheduleWatiBroadcast(req, res) {
  try {
    const { templateId, testUserIds } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ 
        error: true, 
        message: "templateId is required" 
      });
    }
    
    // Send broadcast via Wati API
    const result = await sendWatiBroadcast(templateId, testUserIds);
    
    if (!result.success) {
      return res.status(500).json({ 
        error: true, 
        message: result.error 
      });
    }
    
    return res.json({ 
      success: true, 
      message: result.message,
      recipients: result.recipients,
      templateId: result.templateId,
      watiResponse: result.watiResponse
    });
    
  } catch (error) {
    console.error('Error in scheduleWatiBroadcast:', error);
    return res.status(500).json({ 
      error: true, 
      message: "Failed to schedule Wati broadcast: " + error.message 
    });
  }
}

export {
  sendWatiBroadcast,
  scheduleWatiBroadcast
};