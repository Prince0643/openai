import fs from 'fs';
import path from 'path';

// File to store broadcast templates and opt-in status
const BROADCAST_STORAGE_FILE = path.join(process.cwd(), 'broadcast_data.json');

/**
 * Load broadcast data from file
 * @returns {Object} Broadcast data including templates and opt-in lists
 */
function loadBroadcastData() {
  try {
    if (fs.existsSync(BROADCAST_STORAGE_FILE)) {
      const data = fs.readFileSync(BROADCAST_STORAGE_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      
      // Convert approvedTemplates array back to Set if it exists
      if (parsedData.approvedTemplates && Array.isArray(parsedData.approvedTemplates)) {
        parsedData.approvedTemplates = new Set(parsedData.approvedTemplates);
      }
      
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading broadcast data:', error);
  }
  
  // Default structure
  return {
    templates: {},
    optIns: {},
    approvedTemplates: new Set()
  };
}

/**
 * Save broadcast data to file
 * @param {Object} broadcastData Broadcast data to save
 */
function saveBroadcastData(broadcastData) {
  try {
    // Convert Set to Array for JSON serialization
    const dataToSave = {
      ...broadcastData,
      approvedTemplates: Array.from(broadcastData.approvedTemplates || [])
    };
    fs.writeFileSync(BROADCAST_STORAGE_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('Error saving broadcast data:', error);
  }
}

/**
 * Add a new broadcast template
 * @param {string} templateId Unique identifier for the template
 * @param {string} content Template content
 * @param {boolean} preApproved Whether the template is pre-approved
 */
function addTemplate(templateId, content, preApproved = false) {
  const broadcastData = loadBroadcastData();
  
  broadcastData.templates[templateId] = {
    content: content,
    createdAt: new Date().toISOString(),
    preApproved: preApproved
  };
  
  if (preApproved) {
    if (!broadcastData.approvedTemplates) {
      broadcastData.approvedTemplates = new Set();
    }
    broadcastData.approvedTemplates.add(templateId);
  }
  
  saveBroadcastData(broadcastData);
  console.log(`Template ${templateId} added successfully`);
}

/**
 * Approve a template
 * @param {string} templateId Template ID to approve
 */
function approveTemplate(templateId) {
  const broadcastData = loadBroadcastData();
  
  if (!broadcastData.approvedTemplates) {
    broadcastData.approvedTemplates = new Set();
  }
  
  broadcastData.approvedTemplates.add(templateId);
  saveBroadcastData(broadcastData);
  console.log(`Template ${templateId} approved successfully`);
}

/**
 * Check if a template is approved
 * @param {string} templateId Template ID to check
 * @returns {boolean} Whether the template is approved
 */
function isTemplateApproved(templateId) {
  const broadcastData = loadBroadcastData();
  const approvedTemplates = broadcastData.approvedTemplates || new Set();
  return approvedTemplates.has(templateId);
}

/**
 * Opt-in a user for broadcasts
 * @param {string} userId User ID to opt-in
 * @param {string} contactInfo User's contact information
 */
function optInUser(userId, contactInfo) {
  const broadcastData = loadBroadcastData();
  
  broadcastData.optIns[userId] = {
    contactInfo: contactInfo,
    optedInAt: new Date().toISOString(),
    status: 'active'
  };
  
  saveBroadcastData(broadcastData);
  console.log(`User ${userId} opted in successfully`);
}

/**
 * Opt-out a user from broadcasts
 * @param {string} userId User ID to opt-out
 */
function optOutUser(userId) {
  const broadcastData = loadBroadcastData();
  
  if (broadcastData.optIns[userId]) {
    broadcastData.optIns[userId].status = 'opted-out';
    broadcastData.optIns[userId].optedOutAt = new Date().toISOString();
    saveBroadcastData(broadcastData);
    console.log(`User ${userId} opted out successfully`);
  }
}

/**
 * Check if a user is opted in
 * @param {string} userId User ID to check
 * @returns {boolean} Whether the user is opted in
 */
function isUserOptedIn(userId) {
  const broadcastData = loadBroadcastData();
  return broadcastData.optIns[userId] && 
         broadcastData.optIns[userId].status === 'active';
}

/**
 * Get all opted-in users
 * @returns {Array} List of opted-in user IDs
 */
function getOptedInUsers() {
  const broadcastData = loadBroadcastData();
  return Object.keys(broadcastData.optIns).filter(userId => 
    broadcastData.optIns[userId].status === 'active'
  );
}

/**
 * Send broadcast to opted-in users
 * @param {string} templateId Template ID to send
 * @param {Array} testUserIds Optional list of test user IDs (if provided, only send to these users)
 * @returns {Object} Result of the broadcast send operation
 */
function sendBroadcast(templateId, testUserIds = null) {
  // Check if template is approved
  if (!isTemplateApproved(templateId)) {
    return {
      success: false,
      error: `Template ${templateId} is not approved for broadcast`
    };
  }
  
  // Get the template
  const broadcastData = loadBroadcastData();
  const template = broadcastData.templates[templateId];
  
  if (!template) {
    return {
      success: false,
      error: `Template ${templateId} not found`
    };
  }
  
  // Determine target users
  let targetUsers;
  if (testUserIds && Array.isArray(testUserIds)) {
    // If test user IDs provided, filter to only those who are opted in
    targetUsers = testUserIds.filter(userId => isUserOptedIn(userId));
  } else {
    // Otherwise, send to all opted-in users
    targetUsers = getOptedInUsers();
  }
  
  // In a real implementation, this would integrate with ManyChat API to send messages
  // For now, we'll just log what would be sent
  console.log(`Broadcast would be sent to ${targetUsers.length} opted-in users using template ${templateId}`);
  console.log(`Template content: ${template.content}`);
  console.log(`Target users: ${targetUsers.join(', ')}`);
  
  return {
    success: true,
    message: `Broadcast sent to ${targetUsers.length} opted-in users`,
    recipients: targetUsers.length,
    templateId: templateId
  };
}

export {
  addTemplate,
  approveTemplate,
  isTemplateApproved,
  optInUser,
  optOutUser,
  isUserOptedIn,
  getOptedInUsers,
  sendBroadcast,
  loadBroadcastData
};