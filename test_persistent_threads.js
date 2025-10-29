import { getUserThread, setUserThread, deleteUserThread, loadUserThreads } from "./threadStorage.js";

async function testPersistentThreads() {
  console.log("Testing persistent thread storage...");
  
  // Test 1: Set a thread for a user
  const userId1 = "test_user_1";
  const threadId1 = "thread_12345";
  
  console.log(`Setting thread ${threadId1} for user ${userId1}`);
  setUserThread(userId1, threadId1);
  
  // Test 2: Retrieve the thread for the user
  const retrievedThread1 = getUserThread(userId1);
  console.log(`Retrieved thread for user ${userId1}: ${retrievedThread1}`);
  
  if (retrievedThread1 === threadId1) {
    console.log("✓ Test 1 & 2 passed: Thread storage and retrieval working correctly");
  } else {
    console.log("✗ Test 1 & 2 failed: Thread storage or retrieval not working");
  }
  
  // Test 3: Set another thread for a different user
  const userId2 = "test_user_2";
  const threadId2 = "thread_67890";
  
  console.log(`Setting thread ${threadId2} for user ${userId2}`);
  setUserThread(userId2, threadId2);
  
  // Test 4: Retrieve threads for both users
  const retrievedThread2 = getUserThread(userId2);
  const retrievedThread1Again = getUserThread(userId1);
  
  console.log(`Retrieved thread for user ${userId1}: ${retrievedThread1Again}`);
  console.log(`Retrieved thread for user ${userId2}: ${retrievedThread2}`);
  
  if (retrievedThread1Again === threadId1 && retrievedThread2 === threadId2) {
    console.log("✓ Test 3 & 4 passed: Multiple user thread storage working correctly");
  } else {
    console.log("✗ Test 3 & 4 failed: Multiple user thread storage not working");
  }
  
  // Test 5: Load all threads
  const allThreads = loadUserThreads();
  console.log("All stored threads:", Object.fromEntries(allThreads));
  
  if (allThreads.size >= 2) {
    console.log("✓ Test 5 passed: Loading all threads working correctly");
  } else {
    console.log("✗ Test 5 failed: Loading all threads not working");
  }
  
  // Test 6: Delete a thread
  console.log(`Deleting thread for user ${userId1}`);
  deleteUserThread(userId1);
  
  const deletedThread = getUserThread(userId1);
  const remainingThread = getUserThread(userId2);
  
  console.log(`Thread for deleted user ${userId1}: ${deletedThread}`);
  console.log(`Thread for remaining user ${userId2}: ${remainingThread}`);
  
  if (deletedThread === null && remainingThread === threadId2) {
    console.log("✓ Test 6 passed: Thread deletion working correctly");
  } else {
    console.log("✗ Test 6 failed: Thread deletion not working");
  }
  
  console.log("All tests completed!");
}

testPersistentThreads();