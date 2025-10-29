import fs from 'fs';
import path from 'path';

// File to store user thread mappings
const THREAD_STORAGE_FILE = path.join(process.cwd(), 'user_threads.json');

/**
 * Load user thread mappings from file
 * @returns {Map} Map of userId to threadId
 */
function loadUserThreads() {
  try {
    if (fs.existsSync(THREAD_STORAGE_FILE)) {
      const data = fs.readFileSync(THREAD_STORAGE_FILE, 'utf8');
      const threads = JSON.parse(data);
      return new Map(Object.entries(threads));
    }
  } catch (error) {
    console.error('Error loading user threads:', error);
  }
  return new Map();
}

/**
 * Save user thread mappings to file
 * @param {Map} userThreadMap Map of userId to threadId
 */
function saveUserThreads(userThreadMap) {
  try {
    const threads = Object.fromEntries(userThreadMap);
    fs.writeFileSync(THREAD_STORAGE_FILE, JSON.stringify(threads, null, 2));
  } catch (error) {
    console.error('Error saving user threads:', error);
  }
}

/**
 * Get thread ID for a user
 * @param {string} userId 
 * @returns {string|null} threadId or null if not found
 */
function getUserThread(userId) {
  const userThreadMap = loadUserThreads();
  return userThreadMap.get(userId) || null;
}

/**
 * Set thread ID for a user
 * @param {string} userId 
 * @param {string} threadId 
 */
function setUserThread(userId, threadId) {
  const userThreadMap = loadUserThreads();
  userThreadMap.set(userId, threadId);
  saveUserThreads(userThreadMap);
}

/**
 * Delete thread ID for a user
 * @param {string} userId 
 */
function deleteUserThread(userId) {
  const userThreadMap = loadUserThreads();
  userThreadMap.delete(userId);
  saveUserThreads(userThreadMap);
}

export {
  getUserThread,
  setUserThread,
  deleteUserThread,
  loadUserThreads
};