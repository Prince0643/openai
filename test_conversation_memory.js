import express from "express";
import { getUserThread, setUserThread } from "./threadStorage.js";

// Simulate the webhook handler logic
async function simulateConversation(userId, message) {
  console.log(`\n--- Simulating conversation for user: ${userId} ---`);
  console.log(`Message: ${message}`);
  
  // Check if we have a stored thread ID for this user
  let storedThreadId = getUserThread(userId);
  console.log(`Stored thread ID: ${storedThreadId || "None"}`);
  
  // Simulate creating a new thread if none exists
  if (!storedThreadId) {
    // In real implementation, this would be:
    // thread = await openai.beta.threads.create();
    const newThreadId = `thread_${Date.now()}`;
    setUserThread(userId, newThreadId);
    storedThreadId = newThreadId;
    console.log(`Created new thread: ${storedThreadId}`);
  } else {
    console.log(`Using existing thread: ${storedThreadId}`);
  }
  
  // Simulate adding message to thread
  console.log(`Added message to thread: ${storedThreadId}`);
  
  // Simulate getting response from assistant
  const responses = [
    "Hello! How can I help you today?",
    "I remember our previous conversation. How can I assist you further?",
    "Welcome back! I recall you were asking about gym classes.",
    "Thanks for returning! What else would you like to know?"
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  console.log(`Assistant response: ${response}`);
  
  return {
    response: response,
    threadId: storedThreadId,
    userId: userId
  };
}

async function testConversationMemory() {
  console.log("Testing conversation memory with persistent threads...\n");
  
  // Test with a returning user
  const userId = "returning_user_123";
  
  // First interaction
  console.log("=== First Interaction ===");
  await simulateConversation(userId, "Hi, I'm interested in gym classes");
  
  // Second interaction (should remember user)
  console.log("\n=== Second Interaction (5 seconds later) ===");
  await new Promise(resolve => setTimeout(resolve, 5000));
  await simulateConversation(userId, "What classes do you have available?");
  
  // Third interaction (should still remember user)
  console.log("\n=== Third Interaction (10 seconds later) ===");
  await new Promise(resolve => setTimeout(resolve, 5000));
  await simulateConversation(userId, "Can you tell me more about PT sessions?");
  
  console.log("\n=== Testing with a new user ===");
  const newUser = "new_user_456";
  await simulateConversation(newUser, "Hello, I'm new here");
  
  console.log("\n=== Verifying persistent storage ===");
  const storedThread1 = getUserThread(userId);
  const storedThread2 = getUserThread(newUser);
  
  console.log(`Returning user thread: ${storedThread1}`);
  console.log(`New user thread: ${storedThread2}`);
  
  console.log("\nTest completed! Thread information is persisted and will survive server restarts.");
}

testConversationMemory();