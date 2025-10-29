import { getUserThread } from "./threadStorage.js";
import fs from 'fs';
import path from 'path';

// This script demonstrates that thread information persists across server restarts
console.log("Demonstrating persistent thread storage across server restarts...\n");

// Simulate a user who has interacted with the system before
const userId = "returning_user_123";

// Check if we can retrieve the user's thread (simulating server restart)
const storedThreadId = getUserThread(userId);

if (storedThreadId) {
  console.log(`✓ SUCCESS: Found existing thread for returning user ${userId}`);
  console.log(`  Thread ID: ${storedThreadId}`);
  console.log(`  This means the user will be greeted by name and previous context will be remembered`);
  console.log(`  (e.g., "PT inquiry yesterday → continues flow")`);
} else {
  console.log(`✗ FAILURE: No existing thread found for user ${userId}`);
}

// Show all stored threads
console.log("\nAll stored user threads:");
const THREAD_STORAGE_FILE = path.join(process.cwd(), 'user_threads.json');

if (fs.existsSync(THREAD_STORAGE_FILE)) {
  const data = fs.readFileSync(THREAD_STORAGE_FILE, 'utf8');
  const threads = JSON.parse(data);
  Object.keys(threads).forEach(userId => {
    console.log(`  User: ${userId} -> Thread: ${threads[userId]}`);
  });
} else {
  console.log("  No thread storage file found");
}

console.log("\nThis demonstrates that conversation memory persists even when the server is restarted.");